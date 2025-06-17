import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrfCookie = req.cookies['csrfToken'];
      const csrfHeader = req.headers['x-csrf-token'];

      if (!csrfCookie && !csrfHeader) {
        throw new ForbiddenException(
          'Protection CSRF : cookie et en-tête CSRF manquants.',
        );
      }
      if (!csrfCookie) {
        throw new ForbiddenException('Protection CSRF : cookie CSRF manquant.');
      }
      if (!csrfHeader) {
        throw new ForbiddenException(
          'Protection CSRF : en-tête CSRF manquant.',
        );
      }
      if (csrfCookie !== csrfHeader) {
        throw new ForbiddenException(
          'Protection CSRF : le token du cookie et de l’en-tête ne correspondent pas.',
        );
      }
    }
    next();
  }
}
