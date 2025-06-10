import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    loginAndSetCookies: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TwoFactorAuthService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      mockAuthService.register.mockResolvedValueOnce({
        message: 'Compte créé',
      });
      expect(await controller.register(dto)).toEqual({
        message: 'Compte créé',
      });
      expect(authService.register).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      mockAuthService.register.mockRejectedValueOnce(
        new ConflictException('Email déjà utilisé'),
      );
      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto: LoginDto = {
        email: 'john@example.com',
        password: 'Password123!',
      };
      const res = { cookie: jest.fn() } as any;
      mockAuthService.loginAndSetCookies.mockResolvedValueOnce({
        accessToken: 'token',
      });
      expect(await controller.login(dto, res)).toEqual({
        accessToken: 'token',
      });
      expect(authService.loginAndSetCookies).toHaveBeenCalledWith(dto, res);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const dto: LoginDto = {
        email: 'john@example.com',
        password: 'wrong',
      };
      const res = { cookie: jest.fn() } as any;
      mockAuthService.loginAndSetCookies.mockRejectedValueOnce(
        new UnauthorizedException('Identifiants invalides'),
      );
      await expect(controller.login(dto, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email if user exists', async () => {
      const dto: ForgotPasswordDto = { email: 'john@example.com' };
      mockAuthService.forgotPassword.mockResolvedValueOnce({
        message: 'Email envoyé',
      });
      expect(await controller.forgotPassword(dto)).toEqual({
        message: 'Email envoyé',
      });
      expect(authService.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const dto: ResetPasswordDto = {
        token: 'token',
        newPassword: 'Password123!',
      };
      mockAuthService.resetPassword.mockResolvedValueOnce({
        message: 'Mot de passe réinitialisé',
      });
      expect(await controller.resetPassword(dto)).toEqual({
        message: 'Mot de passe réinitialisé',
      });
      expect(authService.resetPassword).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException for invalid token', async () => {
      const dto: ResetPasswordDto = {
        token: 'invalid',
        newPassword: 'Password123!',
      };
      mockAuthService.resetPassword.mockRejectedValueOnce(
        new BadRequestException('Token invalide'),
      );
      await expect(controller.resetPassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
