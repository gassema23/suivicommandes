import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from '../../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';

const mockUser = {
  id: 'uuid-user',
  email: 'test@example.com',
  password: 'hashed-password',
  twoFactorEnabled: false,
  emailVerifiedAt: new Date(),
  role: { permissions: ['read', 'write'] },
};

describe('AuthService', () => {
  let service: AuthService;
  let repo: Repository<User>;
  let cacheManager: Cache;
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
        {
          provide: EmailService,
          useValue: { sendEmail: jest.fn(), sendPasswordResetEmail: jest.fn() },
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
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    jwtService = service['jwtService'];
    emailService = service['emailService'];
  });

  describe('validateUser', () => {
    it('should validate user with correct password', async () => {
      (repo.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        password: await require('bcryptjs').hash('password', 1),
      });
      const user = await service.validateUser('test@example.com', 'password');
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null for invalid user', async () => {
      (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
      const user = await service.validateUser(
        'notfound@example.com',
        'password',
      );
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should throw after too many login attempts', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValueOnce(5);
      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong',
          twoFactorCode: undefined,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should increment attempts on failed login', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValueOnce(1);
      (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong',
          twoFactorCode: undefined,
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should reset attempts on successful login', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValueOnce(1);
      (repo.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        password: await require('bcryptjs').hash('password', 1),
      });
      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
        twoFactorCode: undefined,
      });
      expect(cacheManager.del).toHaveBeenCalled();
      expect(result.user.email).toBe('test@example.com');
    });
  });

  // Ajoute ici les autres describe pour register, verifyEmail, forgotPassword, etc.
});
