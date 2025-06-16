import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Response } from 'express';

import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from '../../email/email.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { instanceToPlain } from 'class-transformer';
import { VerifyEmailInterface } from '../interfaces/verify-email.interface';
import { OnboardingDto } from '../dto/onboarding.dto';
import { parseDurationToMs } from '../../common/utils/parse-duration';
import { TwoFactorAuthService } from './two-factor-auth.service';

export interface JwtPayload {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
}

@Injectable()
export class AuthService {
  /**
   * Constructeur de AuthService.
   * Initialise les dépendances nécessaires pour le service d'authentification.
   *
   * @param userRepository Le repository pour accéder aux données des utilisateurs.
   * @param usersService Le service pour gérer les utilisateurs.
   * @param jwtService Le service pour gérer les JSON Web Tokens (JWT).
   * @param emailService Le service pour envoyer des emails.
   * @param twoFactorService Le service pour gérer l'authentification à deux facteurs (2FA).
   * @param configService Le service de configuration pour accéder aux variables d'environnement.
   * @param cacheManager Le gestionnaire de cache pour stocker les tentatives de connexion.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly twoFactorService: TwoFactorAuthService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Valide les identifiants de l'utilisateur.
   * Cette méthode vérifie si l'utilisateur existe dans la base de données,
   * compare le mot de passe fourni avec le mot de passe haché stocké,
   * et retourne l'utilisateur si les identifiants sont valides.
   *
   * @param email L'email de l'utilisateur.
   * @param password Le mot de passe de l'utilisateur.
   * @returns L'utilisateur si les identifiants sont valides, sinon null.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['team'],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Gère la connexion et pose les cookies JWT.
   * Cette méthode appelle la méthode `login` pour valider les identifiants de l'utilisateur,
   * puis définit les cookies d'authentification dans la réponse.
   *
   * @param loginDto Les données de connexion de l'utilisateur.
   * @param res La réponse Express pour définir les cookies.
   * @returns Un objet contenant l'utilisateur et un indicateur si la 2FA est requise.
   */
  async loginAndSetCookies(loginDto: LoginDto, res: Response) {
    const result = await this.login(loginDto);

    if (result.requiresTwoFactor) {
      return { user: result.user, requiresTwoFactor: true };
    }

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return { user: result.user, requiresTwoFactor: false };
  }

  /**
   * Gère la connexion et la logique 2FA.
   * Cette méthode valide les identifiants de l'utilisateur,
   * gère les tentatives de connexion, et
   * génère les tokens JWT si la connexion est réussie.
   *
   * @param loginDto Les données de connexion de l'utilisateur.
   * @returns Un objet AuthResult contenant l'utilisateur, le token d'accès, le token de rafraîchissement, et un indicateur si la 2FA est requise.
   * @throws UnauthorizedException si les identifiants sont incorrects ou si l'utilisateur n'a pas vérifié son email.
   * @throws UnauthorizedException si l'utilisateur a dépassé le nombre de tentatives de connexion.
   * @throws UnauthorizedException si le code de vérification 2FA est invalide.
   * @throws UnauthorizedException si l'utilisateur n'a pas activé la 2FA mais a fourni un code.
   * @throws UnauthorizedException si l'utilisateur n'a pas vérifié son email.
   * @throws UnauthorizedException si l'utilisateur a dépassé le nombre de tentatives de connexion.
   * @throws UnauthorizedException si l'utilisateur n'est pas trouvé.
   */
  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password, twoFactorCode } = loginDto;
    const cacheKey = `login_attempts:${email}`;
    let attempts = (await this.cacheManager.get<number>(cacheKey)) || 0;

    if (attempts >= 3) {
      await this.cacheManager.set(cacheKey, attempts, 900_000);
      throw new UnauthorizedException(
        'Trop de tentatives, réessayez dans 15 minutes.',
      );
    }

    const user = await this.validateUser(email, password);
    if (!user) {
      attempts++;
      await this.cacheManager.set(cacheKey, attempts, 900_000);
      throw new UnauthorizedException(
        'Identifiants ou mot de passe incorrects.',
      );
    }
    await this.cacheManager.del(cacheKey);

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Veuillez vérifier votre adresse email avant de vous connecter.',
      );
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return {
          user,
          accessToken: '',
          refreshToken: '',
          requiresTwoFactor: true,
        };
      }
      const isValidCode = await this.twoFactorService.verifyCode(
        user,
        twoFactorCode,
      );
      if (!isValidCode) {
        throw new UnauthorizedException(
          'Le code de vérification 2FA est invalide.',
        );
      }
    }

    const tokens = await this.generateTokensAndSaveRefreshToken(user);
    return { user, ...tokens };
  }

  /**
   * Inscription d'un nouvel utilisateur.
   * Cette méthode crée un nouvel utilisateur, hache son mot de passe,
   * et envoie un email de vérification.
   *
   * @param registerDto Les données d'inscription de l'utilisateur.
   * @returns Un message de succès indiquant que le compte a été créé.
   * @throws ConflictException si un utilisateur avec le même email existe déjà.
   * @throws BadRequestException si les mots de passe ne correspondent pas.
   * @throws BadRequestException si l'email n'est pas valide ou si le mot de passe est trop court.
   * @throws BadRequestException si l'email n'est pas vérifié.
   * @throws BadRequestException si le token de vérification est invalide ou expiré.
   */
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec cette adresse email existe déjà.',
      );
    }

    if (
      registerDto.password &&
      registerDto.password !== registerDto.confirmPassword
    ) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const password =
      registerDto.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      team: registerDto.teamId ? { id: registerDto.teamId } : undefined,
      role: registerDto.roleId ? { id: registerDto.roleId } : undefined,
    });

    await this.userRepository.save(user);
    await this.sendVerificationEmail(user);

    return {
      message:
        'Compte créé avec succès. Veuillez vérifier votre adresse email.',
    };
  }

  /**
   * Envoie un email de vérification à l'utilisateur.
   * Cette méthode est utilisée lors de l'inscription et peut être réutilisée pour renvoyer un email de vérification.
   *
   * @param token Le token de vérification JWT.
   * @returns Un objet contenant un message de succès et les informations de l'utilisateur.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   * @throws BadRequestException si l'email a déjà été vérifié ou si le token est invalide.
   * @throws BadRequestException si le token de vérification est invalide ou expiré.
   */
  async verifyEmail(
    token: string,
  ): Promise<{ message: string; user: VerifyEmailInterface }> {
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        select: ['id', 'emailVerifiedAt', 'firstName', 'lastName', 'email'],
        where: { id: payload.sub },
      });
      if (!user)
        throw new NotFoundException(
          'Aucun utilisateur trouvé avec cet identifiant.',
        );
      if (user.emailVerifiedAt)
        throw new BadRequestException(
          'Cette adresse email a déjà été vérifiée.',
        );

      // TODO: Décommenter pour activer la vérification
      // await this.userRepository.update(user.id, { emailVerifiedAt: new Date() });

      return {
        message: 'Adresse email vérifiée avec succès.',
        user: instanceToPlain(user) as VerifyEmailInterface,
      };
    } catch (err) {
      console.error("Erreur lors de la vérification de l'email:", err);
      throw new BadRequestException(
        'Le token de vérification est invalide ou expiré.',
      );
    }
  }

  /**
   * Envoie un email de réinitialisation de mot de passe.
   *
   * @param forgotPasswordDto Contient l'email de l'utilisateur.
   * @returns Un message indiquant si un email a été envoyé ou non.
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        message:
          'Si cette adresse email existe, un lien de réinitialisation a été envoyé.',
      };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '1h' },
    );
    await this.emailService.sendPasswordResetEmail(user, resetToken);

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
    };
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur.
   *
   * @param resetPasswordDto Contient le token de réinitialisation et le nouveau mot de passe.
   * @returns Un message de confirmation de réinitialisation du mot de passe.
   * @throws BadRequestException si le token est invalide ou expiré.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   * @throws BadRequestException si le nouveau mot de passe est identique à l'ancien.
   * @throws BadRequestException si le token de réinitialisation est invalide.
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset')
        throw new BadRequestException(
          'Le token de réinitialisation est invalide.',
        );

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user)
        throw new NotFoundException(
          'Aucun utilisateur trouvé avec cet identifiant.',
        );

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.userRepository.update(user.id, {
        password: hashedPassword,
        rememberToken: '',
      });

      return { message: 'Mot de passe réinitialisé avec succès.' };
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      throw new BadRequestException(
        'Le token de réinitialisation est invalide ou expiré.',
      );
    }
  }

  /**
   * Change le mot de passe de l'utilisateur.
   *
   * @param userId L'identifiant de l'utilisateur dont le mot de passe doit être changé.
   * @param changePasswordDto Les données contenant le mot de passe actuel, le nouveau mot de passe et la confirmation du nouveau mot de passe.
   * @returns Un message de confirmation de changement de mot de passe.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   * @throws BadRequestException si le mot de passe actuel est incorrect, si les nouveaux mots de passe ne correspondent pas, ou si le nouveau mot de passe est identique à l'ancien.
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(
        'Aucun utilisateur trouvé avec cet identifiant.',
      );

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid)
      throw new BadRequestException('Le mot de passe actuel est incorrect.');
    if (newPassword !== confirmPassword)
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    if (newPassword === currentPassword)
      throw new BadRequestException(
        "Le nouveau mot de passe ne peut pas être le même que l'ancien.",
      );

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, {
      password: hashedPassword,
      rememberToken: '',
    });

    return { message: 'Mot de passe modifié avec succès.' };
  }

  /**
   * Rafraîchit le token d'accès en utilisant le token de rafraîchissement.
   *
   * @param refreshToken Le token de rafraîchissement à utiliser pour générer un nouveau token d'accès.
   * @returns Un objet contenant le nouveau token d'accès et le token de rafraîchissement.
   * @throws UnauthorizedException si le token de rafraîchissement est invalide ou expiré.
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, rememberToken: refreshToken },
        relations: ['team'],
      });
      if (!user)
        throw new UnauthorizedException(
          'Le token de rafraîchissement est invalide.',
        );

      return this.generateTokensAndSaveRefreshToken(user);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw new UnauthorizedException(
        'Le token de rafraîchissement est invalide.',
      );
    }
  }

  /**
   * Définit les cookies d'authentification dans la réponse.
   *
   * @param res La réponse Express.
   * @param accessToken Le token d'accès à stocker dans le cookie.
   * @param refreshToken Le token de rafraîchissement à stocker dans le cookie.
   */
  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const jwtExpirationAcessToken =
      this.configService.get<string>('JWT_EXPIRATION') || '1m';
    const jwtExpirationRefreshToken =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '30d';

    const maxAgeAcessToken = parseDurationToMs(jwtExpirationAcessToken);
    const maxAgeRefreshToken = parseDurationToMs(jwtExpirationRefreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAgeAcessToken,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAgeRefreshToken,
    });

    const decoded = this.jwtService.decode(accessToken) as { exp?: number };
    if (decoded?.exp) {
      res.cookie('accessTokenExpiresAt', decoded.exp * 1000, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAgeAcessToken,
      });
    }
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token de rafraîchissement.
   *
   * @param userId L'identifiant de l'utilisateur à déconnecter.
   * @param res La réponse Express pour supprimer les cookies.
   * @returns Un message de confirmation de déconnexion.
   */
  async logout(userId: string, res: Response): Promise<{ message: string }> {
    await this.userRepository.update(userId, { rememberToken: '' });
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return { message: 'Déconnexion réussie' };
  }

  /**
   * Génère les tokens JWT et sauvegarde le refreshToken en base.
   *
   * @param user L'utilisateur pour lequel générer les tokens.
   * @returns Un objet contenant le token d'accès et le token de rafraîchissement.
   */
  private async generateTokensAndSaveRefreshToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION') || '8h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    await this.userRepository.update(user.id, { rememberToken: refreshToken });
    return { accessToken, refreshToken };
  }

  /**
   * Envoie un email de vérification à l'utilisateur après l'inscription.
   *
   * @param user L'utilisateur pour lequel envoyer l'email de vérification.
   * @returns Promise<void>
   * @throws BadRequestException si l'envoi de l'email échoue.
   */
  private async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'email-verification' },
      { expiresIn: '24h' },
    );
    await this.emailService.sendVerificationEmail(user, verificationToken);
  }

  /**
   * Récupère les permissions de l'utilisateur en fonction de son rôle.
   *
   * @param userId L'identifiant de l'utilisateur.
   * @returns Promise<string[]> Liste des permissions de l'utilisateur.
   * @throws BadRequestException si l'utilisateur n'est pas trouvé ou n'a pas de rôle.
   */
  async getUserPermissions(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user?.role) throw new BadRequestException('Utilisateur non trouvé');
    return user.role.permissions || [];
  }

  /**
   * Envoie un nouvel email de vérification à l'utilisateur.
   *
   * @param data Contient le token de vérification et l'email de l'utilisateur.
   * @returns Promise<{ message: string }> Message de confirmation.
   * @throws BadRequestException si le token est invalide ou expiré.
   * @throws UnauthorizedException si l'email n'est pas vérifié.
   */
  async resendEmailVerification(data: {
    token: string;
    email: string;
  }): Promise<{ message: string }> {
    await this.verifyEmail(data.token);
    // TODO: Envoyer un nouvel email de vérification si besoin
    return { message: 'Un nouvel email de vérification a été envoyé' };
  }

  /**
   * Onboard un nouvel utilisateur en vérifiant son email et en mettant à jour ses informations.
   *
   * @param userId L'identifiant de l'utilisateur à onboarder.
   * @param onboardingDto Les données d'onboarding contenant l'email, le mot de passe et la confirmation du mot de passe.
   * @throws BadRequestException si l'email n'est pas valide ou si les mots de passe ne correspondent pas.
   */
  async onboard(userId: string, onboardingDto: OnboardingDto) {
    this.verifyEmail(onboardingDto.email);
    const { email, password, confirmPassword } = onboardingDto;
    if (password !== confirmPassword)
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    const hashedPassword = await bcrypt.hash(password, 12);
    // TODO: Mettre à jour les infos utilisateur et marquer l'email comme vérifié
  }
}
