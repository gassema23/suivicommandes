import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EmailService, EmailData } from './email.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailData>) {
    this.logger.log(`Traitement de l'email pour: ${job.data.to}`);
    
    try {
      await this.emailService.sendEmailDirect(job.data);
      this.logger.log(`Email envoyé avec succès à: ${job.data.to}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email à ${job.data.to}: ${error.message}`);
      throw error; // Bull va réessayer automatiquement
    }
  }
}