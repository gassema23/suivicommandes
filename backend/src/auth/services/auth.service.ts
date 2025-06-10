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
import { Response } from 'express';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
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
   * Service d'authentification pour gérer l'inscription, la connexion, la vérification d'email,
   * la réinitialisation de mot de passe, et la gestion des tokens JWT.
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
   * @param email - L'email de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
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
   * Génère les tokens JWT pour l'utilisateur.
   * @param user - L'utilisateur pour lequel générer les tokens.
   * @returns Un objet contenant l'accessToken et le refreshToken.
   */
  async loginAndSetCookies(loginDto: LoginDto, res: Response) {
    const { email, password, twoFactorCode } = loginDto;

    // Authentification et vérification 2FA via la méthode login existante
    const result = await this.login(loginDto);

    // Si 2FA requis, ne pose pas les cookies, retourne juste l'info
    if (result.requiresTwoFactor) {
      return { user: result.user, requiresTwoFactor: true };
    }

    // Pose les cookies avec les bons tokens
    const jwtExpirationAcessToken = process.env.JWT_EXPIRATION || '1m';
    const jwtExpirationRefreshToken =
      process.env.JWT_REFRESH_EXPIRATION || '30d';

    const maxAgeAcessToken = parseDurationToMs(jwtExpirationAcessToken);
    const maxAgeRefreshToken = parseDurationToMs(jwtExpirationRefreshToken);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAgeAcessToken,
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAgeRefreshToken,
    });

    const decoded = this.jwtService.decode(result.accessToken) as {
      exp?: number;
    };
    if (decoded?.exp) {
      res.cookie('accessTokenExpiresAt', decoded.exp * 1000, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAgeAcessToken,
      });
    }

    return { user: result.user, requiresTwoFactor: false };
  }

  /**
   * Génère les tokens JWT pour l'utilisateur.
   * @param user - L'utilisateur pour lequel générer les tokens.
   * @returns Un objet contenant l'accessToken et le refreshToken.
   */
  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password, twoFactorCode } = loginDto;

    const testValue = await this.cacheManager.get('test_key');
    console.log('Test Redis:', testValue); // doit afficher 42

    const cacheKey = `login_attempts:${email}`;
    let attempts = (await this.cacheManager.get<number>(cacheKey)) || 0;
    console.log('Tentatives pour', email, ':', attempts);

    // Vérifie le seuil AVANT de valider l'utilisateur
    if (attempts >= 3) {
      await this.cacheManager.set(cacheKey, attempts, 900000);
      throw new UnauthorizedException(
        'Trop de tentatives, réessayez dans 15 minutes.',
      );
    }

    const user = await this.validateUser(email, password);
    if (!user) {
      attempts++;
      await this.cacheManager.set(cacheKey, attempts, 900000); // 15 min
      throw new UnauthorizedException(
        'Identifiants ou mot de passe incorrects.',
      );
    }

    // Réinitialise le compteur en cas de succès
    await this.cacheManager.del(cacheKey);

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Veuillez vérifier votre adresse email avant de vous connecter.',
      );
    }

    // Vérification 2FA si activé
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

    const tokens = await this.generateTokens(user);

    // Mettre à jour le remember token
    await this.userRepository.update(user.id, {
      rememberToken: tokens.refreshToken,
    });

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Génère les tokens JWT pour l'utilisateur.
   * @param user - L'utilisateur pour lequel générer les tokens.
   * @returns Un objet contenant l'accessToken et le refreshToken.
   */
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    let hashedPassword: string;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec cette adresse email existe déjà.',
      );
    }

    if (registerDto.password) {
      // vérifier si le password et confirmpassword correspondent
      if (registerDto.password !== registerDto.confirmPassword) {
        throw new BadRequestException(
          'Les mots de passe ne correspondent pas.',
        );
      }
      // Hasher le mot de passe
      hashedPassword = await bcrypt.hash(registerDto.password, 12);
    } else {
      // générer un mot de passe aléatoire si non fourni
      const randomPassword = Math.random().toString(36).slice(-8);
      registerDto.password = randomPassword;
      registerDto.confirmPassword = randomPassword;
      // Hasher le mot de passe
      hashedPassword = await bcrypt.hash(randomPassword, 12);
      console.warn(
        'Aucun mot de passe fourni, un mot de passe aléatoire a été généré :',
        randomPassword,
      );
      // Vous pouvez envoyer ce mot de passe par email ou le stocker pour l'utilisateur
      // Note: Assurez-vous de gérer la sécurité de ce mot de passe généré
      // await this.emailService.sendRandomPasswordEmail(
      //   email,
      //   randomPassword,
      // );
    }

    // Créer l'utilisateur
    const user = this.userRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      team: registerDto.teamId
        ? ({ id: registerDto.teamId } as any)
        : undefined,
      role: registerDto.roleId
        ? ({ id: registerDto.roleId } as any)
        : undefined,
    });

    await this.userRepository.save(user);

    // Envoyer l'email de vérification
    await this.sendVerificationEmail(user);

    return {
      message:
        'Compte créé avec succès. Veuillez vérifier votre adresse email.',
    };
  }

  /**
   * Envoie un email de vérification à l'utilisateur.
   * @param user - L'utilisateur pour lequel envoyer l'email de vérification.
   */
  async verifyEmail(
    token: string,
  ): Promise<{ message: string; user: VerifyEmailInterface }> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findOne({
        select: ['id', 'emailVerifiedAt', 'firstName', 'lastName', 'email'],
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException(
          'Aucun utilisateur trouvé avec cet identifiant.',
        );
      }

      if (user.emailVerifiedAt) {
        throw new BadRequestException(
          'Cette adresse email a déjà été vérifiée.',
        );
      }

      // await this.userRepository.update(user.id, {
      //   emailVerifiedAt: new Date(),
      // });

      const userPlain = instanceToPlain(user) as VerifyEmailInterface;
      return {
        message: 'Adresse email vérifiée avec succès.',
        user: userPlain,
      };
    } catch (error) {
      throw new BadRequestException(
        'Le token de vérification est invalide ou expiré.',
      );
    }
  }

  /**
   * Envoie un email de vérification à l'utilisateur après l'inscription.
   * @param user - L'utilisateur pour lequel envoyer l'email de vérification.
   * @param forgotPasswordDto - DTO contenant l'email de l'utilisateur qui souhaite réinitialiser son mot de passe.
   * @returns - Un message indiquant que si l'email existe, un lien de réinitialisation a été envoyé.
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
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    await this.emailService.sendPasswordResetEmail(user, resetToken);

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
    };
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur.
   * @param resetPasswordDto - DTO contenant le token et le nouveau mot de passe.
   * @returns Un message indiquant que le mot de passe a été réinitialisé avec succès.
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset') {
        throw new BadRequestException(
          'Le token de réinitialisation est invalide.',
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException(
          'Aucun utilisateur trouvé avec cet identifiant.',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.userRepository.update(user.id, {
        password: hashedPassword,
        rememberToken: '', // Invalider les tokens existants
      });

      return { message: 'Mot de passe réinitialisé avec succès.' };
    } catch (error) {
      throw new BadRequestException(
        'Le token de réinitialisation est invalide ou expiré.',
      );
    }
  }

  /**
   * Change le mot de passe de l'utilisateur.
   * @param userId - L'ID de l'utilisateur dont le mot de passe doit être changé.
   * @param changePasswordDto - DTO contenant le mot de passe actuel et le nouveau mot de passe.
   * @returns Un message indiquant que le mot de passe a été changé avec succès.
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        'Aucun utilisateur trouvé avec cet identifiant.',
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Le mot de passe actuel est incorrect.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, {
      password: hashedPassword,
      rememberToken: '', // Invalider les tokens existants
    });

    return { message: 'Mot de passe modifié avec succès.' };
  }

  /**
   * Rafraîchit le token d'accès en utilisant le token de rafraîchissement.
   * @param refreshToken - Le token de rafraîchissement.
   * @returns Un objet contenant le nouveau accessToken et refreshToken.
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, rememberToken: refreshToken },
        relations: ['team'],
      });

      if (!user) {
        throw new UnauthorizedException(
          'Le token de rafraîchissement est invalide.',
        );
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(
        'Le token de rafraîchissement est invalide.',
      );
    }
  }

  /**
   * Définit les cookies d'authentification dans la réponse.
   * @param res - La réponse HTTP.
   * @param accessToken - Le token d'accès à définir dans le cookie.
   * @param refreshToken - Le token de rafraîchissement à définir dans le cookie.
   */
  async setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const jwtExpirationAcessToken =
      this.configService.getOrThrow<string>('JWT_EXPIRATION') || '1m';
    const jwtExpirationRefreshToken =
      this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION') || '30d';

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
   * @param userId - L'ID de l'utilisateur à déconnecter.
   * @returns Un message indiquant que la déconnexion a réussi.
   */
  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, {
      rememberToken: '',
    });
    return { message: 'Déconnexion réussie' };
  }

  /**
   * Génère les tokens JWT pour l'utilisateur.
   * @param user - L'utilisateur pour lequel générer les tokens.
   * @returns Un objet contenant l'accessToken et le refreshToken.
   */
  private async generateTokens(
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
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_EXPIRATION', '8h'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow(
          'JWT_REFRESH_EXPIRATION',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Envoie un email de vérification à l'utilisateur après l'inscription.
   * @param user - L'utilisateur pour lequel envoyer l'email de vérification.
   */
  private async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'email-verification' },
      { expiresIn: '24h' },
    );

    // Envoyer l'email de vérification
    await this.emailService.sendVerificationEmail(user, verificationToken);
  }

  /**
   * Récupère les permissions de l'utilisateur en fonction de son rôle.
   * @param userId - L'ID de l'utilisateur dont on veut récupérer les permissions.
   * @returns Un tableau de permissions associées au rôle de l'utilisateur.
   */
  async getUserPermissions(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user?.role) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    return user.role.permissions || [];
  }

  /**
   * Envoie un nouvel email de vérification à l'utilisateur.
   * @param data - Contient le token de vérification et l'email de l'utilisateur.
   * @returns Un message indiquant que l'email de vérification a été envoyé.
   */
  async resendEmailVerification(data: {
    token: string;
    email: string;
  }): Promise<{ message: string }> {
    const user = await this.verifyEmail(data.token);

    /*
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user || user.email !== email) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Envoyer un nouvel email de vérification
    await this.sendVerificationEmail(user.email);
*/
    return { message: 'Un nouvel email de vérification a été envoyé' };
  }

  /**
   * Onboard un nouvel utilisateur en vérifiant son email et en mettant à jour ses informations.
   * @param userId - L'ID de l'utilisateur à onboarder.
   * @param onboardingDto - DTO contenant les informations d'onboarding de l'utilisateur.
   */
  async onboard(
    userId: string,
    onboardingDto: OnboardingDto /*: Promise<{ message: string }>*/,
  ) {
    this.verifyEmail(onboardingDto.email);

    const { email, password, confirmPassword } = onboardingDto;

    // vérifier si le password et confirmpassword correspondent
    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour les informations de l'utilisateur
    // await this.userRepository.update(userId, {
    //   ...onboardingDto,
    //   emailVerifiedAt: new Date(), // Marquer l'email comme vérifié
    // });

    //return { message: 'Onboarding réussi' };
  }
}
