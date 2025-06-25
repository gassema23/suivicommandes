import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfService } from '../services/csrf.service';

interface SessionWithCsrf {
  csrfToken?: string;
  [key: string]: any;
}

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private readonly csrfService: CsrfService) {}

  use(req: Request, res: Response, next: NextFunction) {
    //const session = req.session as SessionWithCsrf;
    const method = req.method.toLowerCase();

    // Génère un token pour GET ou toute requête POST
    if (method === 'get' || method === 'post') {
      this.generateAndSetToken(req, res);
    }
    // Validation seulement pour les requêtes sensibles
    if (this.requiresCsrfProtection(req)) {
      this.validateCsrfToken(req);
    }

    next();
  }

  private generateAndSetToken(req: Request, res: Response) {
    const token = this.csrfService.generateToken();
    const session = req.session as SessionWithCsrf;

    session.csrfToken = token;

    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });
  }

  private validateCsrfToken(req: Request) {
    const session = req.session as SessionWithCsrf;
    const sessionToken = session.csrfToken;

    // Log tous les headers pour debug
    console.log('🔍 Headers reçus:', req.headers);
    console.log('🔍 Header X-CSRF-Token:', req.headers['xsrf-token']);
    console.log('🔍 Header X-Requested-With:', req.headers['x-requested-with']);

    const requestToken = req.headers['xsrf-token'] as string;

    if (!this.csrfService.validateToken(sessionToken, requestToken)) {
      throw new ForbiddenException('Token CSRF invalide ou manquant');
    }
  }

  private requiresCsrfProtection(req: Request): boolean {
    const method = req.method.toLowerCase();
    const sensitiveMethods = ['post', 'put', 'patch', 'delete'];
    // Exclut le login de la protection CSRF
    const excludedPaths = ['/auth/login', '/login'];

    return (
      sensitiveMethods.includes(method) && !excludedPaths.includes(req.path)
    );
  }

  private isLoginRequest(req: Request): boolean {
    const loginPaths = ['/auth/login', '/login', '/api/auth/login'];
    const isLogin =
      req.method.toLowerCase() === 'post' && loginPaths.includes(req.path);
    console.log('🔍 Est une requête de login:', isLogin);
    return isLogin;
  }
}
