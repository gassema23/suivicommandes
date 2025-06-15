import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { CsrfMiddleware } from './common/middlewares/csrf.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const csrf = new CsrfMiddleware();

  app.use(helmet());

  // Logger Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Security
  app.use(compression());

  app.use(cookieParser());
  app.use(csrf.use.bind(csrf));

  // CORS
  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // Swagger Documentation
  if (configService.getOrThrow('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Order Management System API')
      .setDescription('API pour le système de gestion des commandes')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication', "Endpoints d'authentification")
      .addTag('Users', 'Gestion des utilisateurs')
      .addTag('Teams', 'Gestion des équipes')
      .addTag('Orders', 'Gestion des commandes')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log('📚 Documentation Swagger disponible sur /api/docs');
  }

  const port = configService.getOrThrow<number>('APP_PORT');

  await app.listen(
    configService.getOrThrow<number>('APP_PORT') || 4010,
    '0.0.0.0',
  );

  logger.log(`🚀 Application démarrée sur le port ${port}`);
  logger.log(`🌍 Environment: ${configService.getOrThrow('NODE_ENV')}`);

  if (configService.getOrThrow('NODE_ENV') !== 'production') {
    logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((error) => {
  console.error("❌ Erreur lors du démarrage de l'application:", error);
  process.exit(1);
});
