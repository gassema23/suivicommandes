import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from '../../email/email.service';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockUser = {
  id: 'uuid-user',
  email: 'test@example.com',
  password: 'hashed-password',
  twoFactorEnabled: false,
  emailVerifiedAt: null,
  role: { permissions: ['read'] },
};

describe('AuthService - forgotPassword', () => {
  let service: AuthService;
  let repo: Repository<User>;
  let jwtService: JwtService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        { provide: UsersService, useValue: {} },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn().mockResolvedValue('token'),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: { sendPasswordResetEmail: jest.fn() },
        },
        { provide: TwoFactorAuthService, useValue: { verifyCode: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('secret'),
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should send reset email if user exists', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    emailService.sendPasswordResetEmail = jest.fn();
    jwtService.sign = jest.fn().mockReturnValue('reset-token');
    await service.forgotPassword({ email: 'test@example.com' });
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
  });

  it('should not throw if user does not exist', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(
      service.forgotPassword({ email: 'notfound@example.com' }),
    ).resolves.not.toThrow();
  });

  it('should not send email if user does not exist', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    emailService.sendPasswordResetEmail = jest.fn();
    await service.forgotPassword({ email: 'notfound@example.com' });
    expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
