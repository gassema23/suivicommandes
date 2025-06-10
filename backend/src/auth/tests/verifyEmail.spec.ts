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
import { BadRequestException } from '@nestjs/common';

const mockUser = {
  id: 'uuid-user',
  email: 'test@example.com',
  password: 'hashed-password',
  twoFactorEnabled: false,
  emailVerifiedAt: null,
  role: { permissions: ['read'] },
};

describe('AuthService - verifyEmail', () => {
  let service: AuthService;
  let repo: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
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
        { provide: EmailService, useValue: { sendEmail: jest.fn() } },
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
  });

  it('should verify email with valid token', async () => {
    jwtService.verify = jest
      .fn()
      .mockReturnValue({ sub: mockUser.id, type: 'email-verification' });
    (repo.findOne as jest.Mock).mockResolvedValueOnce({
      ...mockUser,
      emailVerifiedAt: null,
    });
    (repo.update as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await service.verifyEmail('valid-token');
    expect(result).toBeDefined();
  });

  it('should throw for invalid token', async () => {
    jwtService.verify = jest.fn().mockImplementation(() => {
      throw new Error('invalid');
    });
    await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
      BadRequestException,
    );
  });
});
