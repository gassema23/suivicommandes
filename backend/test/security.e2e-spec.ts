import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

import * as compression from 'compression';
import helmet from 'helmet';

describe('🛡️ Security E2E Tests', () => {
  let app: INestApplication;
  let userToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.use(helmet());
    app.use(compression());
    // Ajoute le ValidationPipe ici
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();

    // Créer un utilisateur non admin
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test@example.com',
      password: '!Password123',
      confirmPassword: '!Password123',
      firstName: 'Admin',
      lastName: 'User',
      emailVerifiedAt: '2010-01-01 00:00:00',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '!Password123' });

    userToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  const protectedRoutes = [
    'sectors',
    'services',
    'users',
    'service-categories',
    'providers',
    'provider-service-categories',
    'clients',
    'subdivision-clients',
    'teams',
    'holidays',
    'roles',
    'delay-types',
    'requisition-types',
    'request-types',
    'conformity-types',
    'deliverables',
    'flows',
    'provider-disponibilities',
    'request-type-service-categories',
    'request-type-delays',
    ///
  ];

  it.each(protectedRoutes)(
    '🔒 %s - reject unauthenticated access',
    async (route) => {
      await request(app.getHttpServer()).get(`/${route}`).expect(401);
    },
  );

  it.each(protectedRoutes)(
    '🧑‍🦰 %s - reject access with non-admin token',
    async (route) => {
      await request(app.getHttpServer())
        .post(`/${route}`)
        .set('Cookie', [`accessToken=${userToken}`])
        .send({ name: 'Test' })
        .expect((res) => {
          expect([401, 403]).toContain(res.statusCode);
        });
    },
  );

  it.each(protectedRoutes)(
    '🧪 %s - SQL injection attempt should fail',
    async (route) => {
      await request(app.getHttpServer())
        .post(`/${route}`)
        .set('Cookie', [`accessToken=${userToken}`])
        .send({ name: "' OR 1=1 --" })
        .expect((res) => {
          expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });
    },
  );

  it.each(protectedRoutes)(
    '🧪 %s - XSS injection attempt should be sanitized',
    async (route) => {
      await request(app.getHttpServer())
        .post(`/${route}`)
        .set('Cookie', [`accessToken=${userToken}`])
        .send({ name: '<script>alert("XSS")</script>' })
        .expect((res) => {
          expect(res.text).not.toContain('<script>');
        });
    },
  );

  it.each(protectedRoutes)(
    '🚫 %s - forged JWT should be rejected',
    async (route) => {
      const forgedToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiJ9.' +
        'WRONGSIGNATURE';

      await request(app.getHttpServer())
        .get(`/${route}`)
        .set('Cookie', [`accessToken=${forgedToken}`])
        .expect([400, 401]);
    },
  );

  it('📦 /auth/login - reject SQL injection in login form', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: "' OR 1=1 --", password: 'x' })
      .expect([400, 401]);
  });

  it('📦 /auth/register - reject malformed email or injection', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: "<img src='x' onerror='alert(1)'>",
        password: 'x',
        confirmPassword: 'x',
        firstName: 'Admin',
        lastName: 'User',
        emailVerifyEmailAt: '2010-01-01 00:00:00',
      })
      .expect((res) => {
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      });
  });

  it('🛡️ /auth/login - reject POST without CSRF token', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '!Password123' })
      .expect(403); // ou 401 selon ta config
  });
  it('🛡️ /auth/login - accept POST with valid CSRF token', async () => {
    // 1. Récupère le token CSRF via un GET (selon ta config)
    const res = await request(app.getHttpServer()).get('/auth/csrf-token');
    const csrfToken = res.body.csrfToken || res.headers['x-csrf-token'];
    const cookies = res.headers['set-cookie'];

    // 2. Utilise le token dans le header et le cookie dans la requête POST
    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send({ email: 'test@example.com', password: '!Password123' })
      .expect((r) => {
        // Ici, tu attends un 200 ou une erreur d'auth, mais pas une erreur CSRF
        expect([200, 400, 401]).toContain(r.statusCode);
      });
  });
});
