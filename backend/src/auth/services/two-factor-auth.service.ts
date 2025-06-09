import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TwoFactorAuthService {
  /**
   * Service for managing two-factor authentication (2FA) for users.
   * It provides methods to generate a 2FA secret, enable/disable 2FA, and verify codes.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a two-factor authentication secret for the user.
   * It also generates a QR code URL that can be used to set up the 2FA in an authenticator app.
   * @param user The user for whom the 2FA secret is being generated.
   * @returns An object containing the base32 secret and the QR code URL.
   */
  async generateTwoFactorSecret(
    user: User,
  ): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = speakeasy.generateSecret({
      name: `${this.configService.getOrThrow<string>('APP_NAME')} (${user.email})`,
      issuer: this.configService.getOrThrow<string>('APP_NAME'),
    });

    // Correction: vérification de otpauth_url et await correct
    if (!secret.otpauth_url) {
      throw new BadRequestException(
        "Impossible de générer l'URL OTP pour l'authentification à deux facteurs.",
      );
    }

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32!,
      qrCodeUrl,
    };
  }

  /**
   * Enables two-factor authentication for the user by verifying the provided code.
   * @param user The user for whom 2FA is being enabled.
   * @param secret The base32 secret generated for the user.
   * @param code The verification code provided by the user.
   * @throws BadRequestException if the verification code is invalid.
   */
  async enableTwoFactor(
    user: User,
    secret: string,
    code: string,
  ): Promise<void> {
    const isValidCode = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!isValidCode) {
      throw new BadRequestException(
        "Le code de vérification fourni pour l'activation de la double authentification est invalide.",
      );
    }

    await this.userRepository.update(user.id, {
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    });
  }

  /**
   * Disables two-factor authentication for the user.
   * @param user The user for whom 2FA is being disabled.
   */
  async disableTwoFactor(user: User): Promise<void> {
    await this.userRepository.update(user.id, {
      twoFactorSecret: '',
      twoFactorEnabled: false,
    });
  }

  /**
   * Verifies the provided code against the user's 2FA secret.
   * @param user The user for whom the code is being verified.
   * @param code The verification code provided by the user.
   * @returns A boolean indicating whether the code is valid.
   */
  async verifyCode(user: User, code: string): Promise<boolean> {
    if (!user.twoFactorSecret) {
      throw new BadRequestException(
        "Impossible de vérifier le code : aucun secret 2FA n'est associé à cet utilisateur.",
      );
    }

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });
  }
}
