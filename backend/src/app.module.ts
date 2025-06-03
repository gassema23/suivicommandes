import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { EmailModule } from './email/email.module';
import { RedisConfig } from './config/redis.config';
import { getDatabaseConfig } from './config/database.config';
import { RolesModule } from './roles/roles.module';
import { HolidaysModule } from './holidays/holidays.module';
import { SectorsModule } from './sectors/sectors.module';
import { ServicesModule } from './services/services.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),

    // Base de données TypeORM
    TypeOrmModule.forRoot(getDatabaseConfig()),

    // Redis & Queue
    BullModule.forRoot({
      redis: RedisConfig,
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Logging avec Winston
    WinstonModule.forRoot({
      transports: [
        // Console transport avec couleurs pour développement
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, context, trace }) => {
              return `${timestamp} [${context || 'Application'}] ${level}: ${message}${
                trace ? `\n${trace}` : ''
              }`;
            }),
          ),
        }),
        
        // Fichier de logs pour les erreurs
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        
        // Fichier de logs combiné
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: 'logs/exceptions.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      ],
    }),

    // Modules métier
    AuthModule,
    UsersModule,
    TeamsModule,
    EmailModule,
    RolesModule,
    HolidaysModule,
    SectorsModule,
    ServicesModule,
    ServiceCategoriesModule,
  ],
})
export class AppModule {}