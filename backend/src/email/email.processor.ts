import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EmailService, EmailData } from './email.service';

@Processor('email')
export class EmailProcessor {
  /**
   * Logger pour la classe EmailProcessor.
   * Utilisé pour enregistrer les informations de traitement des emails.
   */
  private readonly logger = new Logger(EmailProcessor.name);

  /**
   * Constructeur de la classe EmailProcessor.
   * @param emailService Le service d'email utilisé pour envoyer les emails.
   */
  constructor(private readonly emailService: EmailService) {}

  /**
   * Traitement des emails en file d'attente.
   * Cette méthode est appelée par Bull lorsque des jobs sont ajoutés à la file d'attente.
   * @param job Le job contenant les données de l'email à envoyer.
   */
  @Process('send-email')
  async handleSendEmail(job: Job<EmailData>) {
    this.logger.log(`Traitement de l'email pour : ${job.data.to}`);

    try {
      await this.emailService.sendEmailDirect(job.data);
      this.logger.log(`Email envoyé avec succès à : ${job.data.to}`);
    } catch (error) {
      this.logger.error(
        `Échec de l'envoi de l'email à ${job.data.to} : ${error?.message || error}`,
        error?.stack,
      );
      throw new Error(
        `Impossible d'envoyer l'email à ${job.data.to} : ${error?.message || error}`,
      );
    }
  }
}
