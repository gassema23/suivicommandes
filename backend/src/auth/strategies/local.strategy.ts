import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Strategy for validating user credentials using email and password.
   * It checks if the user exists and if the password is correct.
   */
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the user credentials.
   * @param email The user's email.
   * @param password The user's password.
   * @returns The user object if credentials are valid.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(
        'Authentification refusée : email ou mot de passe incorrect.',
      );
    }
    return user;
  }
}
