/*
https://docs.nestjs.com/controllers#controllers
*/
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService, EmailData } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() emailData: EmailData) {
    await this.emailService.sendEmailDirect(emailData);
    return { message: 'Email envoyé' };
  }
}
