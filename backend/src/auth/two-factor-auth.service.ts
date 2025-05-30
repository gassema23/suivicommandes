import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async generateTwoFactorSecret(user: User): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = speakeasy.generateSecret({
      name: `${this.configService.getOrThrow<string>('APP_NAME')} (${user.email})`,
      issuer: this.configService.getOrThrow<string>('APP_NAME'),
    });

    // Correction: vérification de otpauth_url et await correct
    if (!secret.otpauth_url) {
      throw new Error('Impossible de générer l\'URL OTP');
    }

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32!,
      qrCodeUrl,
    };
  }

  async enableTwoFactor(user: User, secret: string, code: string): Promise<void> {
    const isValidCode = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!isValidCode) {
      throw new Error('Code de vérification invalide');
    }

    await this.userRepository.update(user.id, {
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    });
  }

  async disableTwoFactor(user: User): Promise<void> {
    await this.userRepository.update(user.id, {
      twoFactorSecret: '',
      twoFactorEnabled: false,
    });
  }

  async verifyCode(user: User, code: string): Promise<boolean> {
    if (!user.twoFactorSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });
  }
}