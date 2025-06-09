import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/services/users.service';
import { EmailService } from '../email/email.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { instanceToPlain } from 'class-transformer';
import { VerifyEmailInterface } from './interfaces/verify-email.interface';
import { OnboardingDto } from './dto/onboarding.dto';
import { parseDurationToMs } from '../common/utils/parse-duration';
import { Response } from 'express';

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
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly twoFactorService: TwoFactorAuthService,
    private readonly configService: ConfigService,
  ) {}

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

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password, twoFactorCode } = loginDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Veuillez vérifier votre email avant de vous connecter',
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
        throw new UnauthorizedException('Code de vérification invalide');
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

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    let hashedPassword: string;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    if (registerDto.password) {
      // vérifier si le password et confirmpassword correspondent
      if (registerDto.password !== registerDto.confirmPassword) {
        throw new BadRequestException('Les mots de passe ne correspondent pas');
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
      message: 'Compte créé avec succès. Veuillez vérifier votre email.',
    };
  }

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
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (user.emailVerifiedAt) {
        throw new BadRequestException('Email déjà vérifié');
      }

      // await this.userRepository.update(user.id, {
      //   emailVerifiedAt: new Date(),
      // });

      const userPlain = instanceToPlain(user) as VerifyEmailInterface;
      return { message: 'Email vérifié avec succès', user: userPlain };
    } catch (error) {
      throw new BadRequestException('Token de vérification invalide ou expiré');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return {
        message:
          'Si cet email existe, un lien de réinitialisation a été envoyé.',
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

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Token invalide');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.userRepository.update(user.id, {
        password: hashedPassword,
        rememberToken: '', // Invalider les tokens existants
      });

      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch (error) {
      throw new BadRequestException(
        'Token de réinitialisation invalide ou expiré',
      );
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, {
      password: hashedPassword,
      rememberToken: '', // Invalider les tokens existants
    });

    return { message: 'Mot de passe modifié avec succès' };
  }

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
        throw new UnauthorizedException('Token de rafraîchissement invalide');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

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

  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, {
      rememberToken: '',
    });
    return { message: 'Déconnexion réussie' };
  }

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

  private async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'email-verification' },
      { expiresIn: '24h' },
    );

    // Envoyer l'email de vérification
    await this.emailService.sendVerificationEmail(user, verificationToken);
  }

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
