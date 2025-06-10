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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';

import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { EnableTwoFactorDto } from '../dto/enable-two-factor.dto';
import { instanceToPlain } from 'class-transformer';
import { OnboardingDto } from '../dto/onboarding.dto';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Contrôleur pour gérer l'authentification des utilisateurs.
   * Permet de s'inscrire, se connecter, se déconnecter, gérer les mots de passe,
   * et activer/désactiver l'authentification à deux facteurs.
   *
   * @param authService Service pour gérer l'authentification.
   * @param twoFactorService Service pour gérer l'authentification à deux facteurs.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorAuthService,
  ) {}

  /**
   * Enregistre un nouvel utilisateur.
   * @param registerDto DTO contenant les informations de l'utilisateur à enregistrer.
   * @returns L'utilisateur enregistré.
   */
  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Connecte un utilisateur existant.
   * @param loginDto DTO contenant les informations de connexion de l'utilisateur.
   * @param res Réponse HTTP pour définir les cookies d'authentification.
   * @returns Les cookies d'authentification et l'utilisateur connecté.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 tentatives par minute
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAndSetCookies(loginDto, res);
  }

  /**
   * Onboard un nouvel utilisateur.
   * @param id ID de l'utilisateur à onboarder.
   * @param onboardingDto DTO contenant les informations d'onboarding.
   * @returns L'utilisateur onboardé.
   */
  @Patch('onboard/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Onboard nouvel utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async onboard(@Param('id') id: string, @Body() onboardingDto: OnboardingDto) {
    return this.authService.onboard(id, onboardingDto);
  }

  /**
   * Déconnecte l'utilisateur en invalidant les tokens et en supprimant les cookies.
   * @param user Utilisateur connecté à déconnecter.
   * @param res Réponse HTTP pour supprimer les cookies d'authentification.
   * @returns Un message de succès de déconnexion.
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Se déconnecter' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(user.id, res);
  }

  /**
   * Vérifie l'email de l'utilisateur avec le token fourni.
   * @param token Token de vérification d'email.
   * @returns Un message de succès ou une erreur si le token est invalide ou expiré.
   */
  @Get('verify-email')
  @ApiOperation({ summary: "Vérifier l'email avec le token" })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  /**
   * Demande la réinitialisation du mot de passe en envoyant un email avec un lien de réinitialisation.
   * @param forgotPasswordDto DTO contenant l'email de l'utilisateur.
   * @returns Un message de succès ou une erreur si l'email n'est pas trouvé.
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demander la réinitialisation du mot de passe' })
  @ApiResponse({ status: 200, description: 'Email de réinitialisation envoyé' })
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 tentatives par minute
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur avec le token fourni.
   * @param resetPasswordDto DTO contenant le nouveau mot de passe et le token.
   * @returns Un message de succès ou une erreur si le token est invalide ou expiré.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Change le mot de passe de l'utilisateur connecté.
   * @param user Utilisateur connecté dont le mot de passe doit être changé.
   * @param changePasswordDto DTO contenant le mot de passe actuel et le nouveau mot de passe.
   * @returns Un message de succès ou une erreur si le mot de passe actuel est incorrect.
   */
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

  /**
   * Renvoie un nouvel email de vérification à l'utilisateur.
   * @param data Contient l'email de l'utilisateur et le token de vérification.
   * @returns Un message de succès ou une erreur si l'email n'est pas trouvé.
   */
  @Post('resend-email-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retourner le courriel de vérification' })
  @ApiResponse({ status: 200, description: 'Tokens renouvelés' })
  async resendEmailVerification(
    @Body() data: { email: string; token: string },
  ) {
    return this.authService.resendEmailVerification(data);
  }

  /**
   * Renouvelle les tokens d'authentification de l'utilisateur.
   * @param req Requête HTTP contenant le token de rafraîchissement.
   * @param res Réponse HTTP pour définir les nouveaux cookies d'authentification.
   * @returns Un message de succès ou une erreur si le token de rafraîchissement est invalide.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler les tokens' })
  @ApiResponse({ status: 200, description: 'Tokens renouvelés' })
  @ApiResponse({
    status: 401,
    description: 'Token de rafraîchissement invalide',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    // Assuming the refresh token is stored in a cookie named 'refreshToken'
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token manquant' });
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);
    await this.authService.setAuthCookies(res, accessToken, newRefreshToken);
    return res.json({ success: true });
  }

  /**
   * Obtient les informations de l'utilisateur connecté.
   * @param user Utilisateur connecté dont les informations doivent être renvoyées.
   * @returns Les informations de l'utilisateur connecté.
   */
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

  /**
   * Met à jour les informations de l'utilisateur connecté.
   * @param user Utilisateur connecté dont les informations doivent être mises à jour.
   * @param updateUserDto DTO contenant les nouvelles informations de l'utilisateur.
   * @returns Les informations mises à jour de l'utilisateur.
   */
  @Get('2fa/generate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Générer un secret 2FA' })
  @ApiResponse({ status: 200, description: 'Secret 2FA généré' })
  async generateTwoFactor(@CurrentUser() user: User) {
    return this.twoFactorService.generateTwoFactorSecret(user);
  }

  /**
   * Active l'authentification à deux facteurs (2FA) pour l'utilisateur connecté.
   * @param user Utilisateur connecté pour lequel l'authentification 2FA doit être activée.
   * @param enableTwoFactorDto  DTO contenant le secret et le code de vérification pour activer l'authentification 2FA.
   * @returns Un message de succès indiquant que l'authentification 2FA a été activée.
   */
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

  /**
   * Désactive l'authentification à deux facteurs (2FA) pour l'utilisateur connecté.
   * @param user Utilisateur connecté pour lequel l'authentification 2FA doit être désactivée.
   * @returns Un message de succès indiquant que l'authentification 2FA a été désactivée.
   */
  @Post('2fa/disable')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Désactiver l'authentification 2FA" })
  @ApiResponse({ status: 200, description: '2FA désactivé' })
  async disableTwoFactor(@CurrentUser() user: User) {
    await this.twoFactorService.disableTwoFactor(user);
    return { message: 'Authentification à deux facteurs désactivée' };
  }

  @Patch('update-password/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le mot de passe de l’utilisateur' })
  @ApiResponse({ status: 200, description: 'Mot de passe mis à jour avec succès' })
  async updatePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(id, changePasswordDto);
  }
}
