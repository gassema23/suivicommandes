import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { JwtPayload } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Strategy for validating JWT tokens.
   * It checks if the user exists and if their email is verified.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('La variable d’environnement JWT_SECRET est manquante.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.['accessToken'];
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  /**
   * Validates the JWT payload and retrieves the user from the database.
   * @param req The request object containing the JWT token.
   * @param payload The JWT payload containing user information.
   * @returns The user object if found and email is verified.
   * @throws UnauthorizedException if the user is not found or email is not verified.
   */
  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['team'],
    });
    if (!user) {
      throw new UnauthorizedException(
        'Authentification refusée : utilisateur introuvable.',
      );
    }
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Authentification refusée : adresse e-mail non vérifiée.',
      );
    }
    return user;
  }
}
