import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { EnableTwoFactorDto } from './dto/enable-two-factor.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { instanceToPlain } from 'class-transformer';
import { OnboardingDto } from './dto/onboarding.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorAuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 tentatives par minute
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAndSetCookies(loginDto, res);
  }

  @Patch('onboard/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Onboard nouvel utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async onboard(@Param('id') id: string, @Body() onboardingDto: OnboardingDto) {
    return this.authService.onboard(id, onboardingDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Se déconnecter' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Invalide le refreshToken côté base de données si besoin
    await this.authService.logout(user.id);

    // Détruit les cookies côté client
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

  @Get('verify-email')
  @ApiOperation({ summary: "Vérifier l'email avec le token" })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demander la réinitialisation du mot de passe' })
  @ApiResponse({ status: 200, description: 'Email de réinitialisation envoyé' })
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 tentatives par minute
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changer le mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié' })
  @ApiResponse({ status: 400, description: 'Mot de passe actuel incorrect' })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  @Post('resend-email-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retourner le courriel de vérification' })
  @ApiResponse({ status: 200, description: 'Tokens renouvelés' })
  async resendEmailVerification(
    @Body() data: { email: string; token: string },
  ) {
    return this.authService.resendEmailVerification(data);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler les tokens' })
  @ApiResponse({ status: 200, description: 'Tokens renouvelés' })
  @ApiResponse({
    status: 401,
    description: 'Token de rafraîchissement invalide',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Obtenir les informations de l'utilisateur connecté",
  })
  @ApiResponse({ status: 200, description: 'Informations utilisateur' })
  async getProfile(@CurrentUser() user: User) {

    return { user: instanceToPlain(user) };
  }

  // Two Factor Authentication endpoints
  @Get('2fa/generate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Générer un secret 2FA' })
  @ApiResponse({ status: 200, description: 'Secret 2FA généré' })
  async generateTwoFactor(@CurrentUser() user: User) {
    return this.twoFactorService.generateTwoFactorSecret(user);
  }

  @Post('2fa/enable')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Activer l'authentification 2FA" })
  @ApiResponse({ status: 200, description: '2FA activé' })
  @ApiResponse({ status: 400, description: 'Code invalide' })
  async enableTwoFactor(
    @CurrentUser() user: User,
    @Body() enableTwoFactorDto: EnableTwoFactorDto,
  ) {
    await this.twoFactorService.enableTwoFactor(
      user,
      enableTwoFactorDto.secret,
      enableTwoFactorDto.code,
    );
    return { message: 'Authentification à deux facteurs activée' };
  }

  @Post('2fa/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Désactiver l'authentification 2FA" })
  @ApiResponse({ status: 200, description: '2FA désactivé' })
  async disableTwoFactor(@CurrentUser() user: User) {
    await this.twoFactorService.disableTwoFactor(user);
    return { message: 'Authentification à deux facteurs désactivée' };
  }
}
