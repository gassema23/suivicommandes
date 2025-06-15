import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailController } from './email.controller';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { partials } from 'handlebars';
import { strict } from 'assert';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow<string>('MAIL_HOST'),
          port: config.getOrThrow<number>('MAIL_PORT'),
          auth: {
            user: config.getOrThrow<string>('MAIL_USERNAME'),
            pass: config.getOrThrow<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: config.getOrThrow<string>('MAIL_FROM'),
        },
        template: {
          dir: join(__dirname, '../templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
            layoutsDir: join(__dirname, '../templates/layouts'),
            defaultLayout: 'main',
          },
        },

      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
