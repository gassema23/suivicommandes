import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

describe('🛡️ Security E2E Tests', () => {
  let app: INestApplication;
  let userToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
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
    'roles'
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
        .expect(401);
    },
  );

  it('📦 /auth/login - reject SQL injection in login form', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: "' OR 1=1 --", password: 'x' })
      .expect(401);
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
        verifyEmail: '2010-01-01 00:00:00',
      })
      .expect((res) => {
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      });
  });
  
});
