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
import { ConflictException } from '@nestjs/common';

const mockUser = {
  id: 'uuid-user',
  email: 'test@example.com',
  password: 'hashed-password',
  twoFactorEnabled: false,
  emailVerifiedAt: null,
  role: { permissions: ['read'] },
};

describe('AuthService - register', () => {
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
        // Correction ici :
        {
          provide: EmailService,
          useValue: { sendEmail: jest.fn(), sendVerificationEmail: jest.fn() },
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
  });

  it('should register a new user', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (repo.create as jest.Mock).mockReturnValue({ ...mockUser });
    (repo.save as jest.Mock).mockResolvedValueOnce({ ...mockUser });
    jwtService.sign = jest.fn().mockReturnValue('jwt-token');
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
    };
    const result = await service.register(dto as any);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('message');
  });

  it('should throw if email already exists', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
    };
    await expect(service.register(dto as any)).rejects.toThrow(
      ConflictException,
    );
  });
});
