import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CsrfService {
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateToken(
    sessionToken: string | undefined,
    requestToken: string | undefined,
  ): boolean {
    console.log('🔒 Validation du token CSRF...');

    console.log('Session Token:', sessionToken);
    console.log('Request Token:', requestToken);


    if (!sessionToken || !requestToken) {
      return false;
    }

    try {
      return crypto.timingSafeEqual(
        Buffer.from(sessionToken),
        Buffer.from(requestToken),
      );
    } catch (error) {
      console.error('Error validating CSRF token:', error);
      return false;
    }
  }
}
