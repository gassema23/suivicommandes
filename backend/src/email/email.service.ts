import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as nodemailer from 'nodemailer';
import { User } from '../users/entities/user.entity';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    private configService: ConfigService,
  ) {
    this.createTransporter();
  }

  private createTransporter() {
    const isSecure = this.configService.getOrThrow('MAIL_PORT') === 465;
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: this.configService.getOrThrow<number>('MAIL_PORT'),
      secure: isSecure,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USERNAME'),
        pass: this.configService.getOrThrow<string>('MAIL_PASSWORD'),
      },
    });
  }


  async sendEmail(emailData: EmailData): Promise<void> {
    await this.emailQueue.add('send-email', emailData);
  }

  async sendVerificationEmail(user: User, token: string): Promise<void> {
    const verificationUrl = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/verify-email/${token}`;
    
    await this.sendEmail({
      to: user.email,
      subject: 'Vérifiez votre adresse email',
      template: 'email-verification',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        verificationUrl,
        appName: this.configService.getOrThrow<string>('APP_NAME'),
      },
    });
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    const resetUrl = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/reset-password/${token}`;
    
    await this.sendEmail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'password-reset',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        resetUrl,
        appName: this.configService.getOrThrow<string>('APP_NAME'),
      },
    });
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject: 'Bienvenue dans notre application',
      template: 'welcome',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        appName: this.configService.getOrThrow<string>('APP_NAME'),
        loginUrl: `${this.configService.getOrThrow(<string>'FRONTEND_URL')}/login`,
      },
    });
  }

  async sendTwoFactorEnabledEmail(user: User): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject: 'Authentification à deux facteurs activée',
      template: 'two-factor-enabled',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        appName: this.configService.getOrThrow<string>('APP_NAME'),
      },
    });
  }

  async sendPasswordChangedEmail(user: User): Promise<void> {
    await this.sendEmail({
      to: user.email,
      subject: 'Mot de passe modifié',
      template: 'password-changed',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        appName: this.configService.getOrThrow<string>('APP_NAME'),
        changeTime: new Date().toLocaleString('fr-FR'),
      },
    });
  }

  // Méthode pour envoyer directement sans queue (pour les tests)
  async sendEmailDirect(emailData: EmailData): Promise<void> {
    try {
      const html = this.generateEmailHtml(emailData.template, emailData.context);
      
      const mailOptions = {
        from: `${this.configService.getOrThrow('APP_NAME')} <${this.configService.getOrThrow('MAIL_FROM')}>`,
        to: emailData.to,
        subject: emailData.subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email envoyé avec succès: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }

  private generateEmailHtml(template: string, context: Record<string, any>): string {
    // Templates HTML simples - en production, vous pourriez utiliser Handlebars ou similar
    const templates = {
      'email-verification': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Vérification d'email</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; }
            .header { text-align: center; color: #333; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vérifiez votre adresse email</h1>
            </div>
            <p>Bonjour ${context.firstName} ${context.lastName},</p>
            <p>Merci de vous être inscrit sur ${context.appName}. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            <div style="text-align: center;">
              <a href="${context.verificationUrl}" class="button">Vérifier mon email</a>
            </div>
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #007bff;">${context.verificationUrl}</p>
            <p>Ce lien expire dans 24 heures.</p>
            <div class="footer">
              <p>Si vous n'avez pas créé de compte sur ${context.appName}, vous pouvez ignorer cet email.</p>
              <p>© 2025 ${context.appName}. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      
      'password-reset': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Réinitialisation du mot de passe</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; }
            .header { text-align: center; color: #333; }
            .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Réinitialisation de votre mot de passe</h1>
            </div>
            <p>Bonjour ${context.firstName} ${context.lastName},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour ${context.appName}.</p>
            <div class="warning">
              <strong>⚠️ Important :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
            </div>
            <p>Pour créer un nouveau mot de passe, cliquez sur le bouton ci-dessous :</p>
            <div style="text-align: center;">
              <a href="${context.resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #dc3545;">${context.resetUrl}</p>
            <p>Ce lien expire dans 1 heure pour votre sécurité.</p>
            <div class="footer">
              <p>© 2025 ${context.appName}. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'welcome': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Bienvenue</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; }
            .header { text-align: center; color: #333; }
            .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            .features { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue sur ${context.appName} !</h1>
            </div>
            <p>Bonjour ${context.firstName} ${context.lastName},</p>
            <p>Félicitations ! Votre compte a été créé avec succès. Nous sommes ravis de vous accueillir dans notre communauté.</p>
            <div class="features">
              <h3>Que pouvez-vous faire maintenant ?</h3>
              <ul>
                <li>Gérer vos commandes et suivre leur statut</li>
                <li>Collaborer avec votre équipe</li>
                <li>Accéder aux rapports et analyses</li>
                <li>Configurer vos notifications</li>
              </ul>
            </div>
            <p>Commencez dès maintenant en vous connectant :</p>
            <div style="text-align: center;">
              <a href="${context.loginUrl}" class="button">Se connecter</a>
            </div>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter. Notre équipe est là pour vous aider !</p>
            <div class="footer">
              <p>Merci de faire confiance à ${context.appName}.</p>
              <p>© 2025 ${context.appName}. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'two-factor-enabled': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>2FA Activé</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; }
            .header { text-align: center; color: #333; }
            .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 4px; margin: 15px 0; color: #155724; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Sécurité renforcée</h1>
            </div>
            <p>Bonjour ${context.firstName} ${context.lastName},</p>
            <div class="success">
              <strong>✅ Authentification à deux facteurs activée !</strong>
            </div>
            <p>Vous avez activé avec succès l'authentification à deux facteurs sur votre compte ${context.appName}.</p>
            <p>Votre compte est maintenant mieux protégé. Lors de vos prochaines connexions, vous devrez saisir :</p>
            <ul>
              <li>Votre mot de passe habituel</li>
              <li>Un code à 6 chiffres généré par votre application d'authentification</li>
            </ul>
            <p><strong>Important :</strong> Conservez précieusement votre application d'authentification et/ou vos codes de récupération.</p>
            <div class="footer">
              <p>Si vous n'avez pas activé cette fonctionnalité, contactez-nous immédiatement.</p>
              <p>© 2025 ${context.appName}. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,

      'password-changed': `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Mot de passe modifié</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; }
            .header { text-align: center; color: #333; }
            .info { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; border-radius: 4px; margin: 15px 0; color: #0c5460; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Mot de passe modifié</h1>
            </div>
            <p>Bonjour ${context.firstName} ${context.lastName},</p>
            <div class="info">
              <strong>ℹ️ Votre mot de passe a été modifié avec succès</strong>
            </div>
            <p>Votre mot de passe ${context.appName} a été modifié le ${context.changeTime}.</p>
            <p>Si vous avez effectué cette modification, aucune action n'est requise.</p>
            <p><strong>Si vous n'avez pas modifié votre mot de passe :</strong></p>
            <ul>
              <li>Contactez immédiatement notre équipe de support</li>
              <li>Vérifiez que votre adresse email n'a pas été compromise</li>
              <li>Changez vos mots de passe sur d'autres services si vous utilisez le même</li>
            </ul>
            <div class="footer">
              <p>Pour votre sécurité, ce message est automatiquement envoyé lors de chaque modification de mot de passe.</p>
              <p>© 2025 ${context.appName}. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return templates[template] || '<p>Template non trouvé</p>';
  }
}