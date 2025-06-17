import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Garde d'authentification JWT.
   * Elle vérifie si la route est publique et gère l'authentification JWT.
   * @param reflector - Utilisé pour récupérer les métadonnées des routes.
   * @return boolean - Retourne true si la route est publique ou si l'utilisateur est authentifié.
   * @throws UnauthorizedException si le token est invalide ou expiré.
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Vérifie si la route est publique.
   * Si la route est publique, l'authentification JWT n'est pas nécessaire.
   * @param context - Contexte d'exécution de la requête.
   * @return boolean - Retourne true si la route est publique, sinon appelle la méthode canActivate de AuthGuard.
   */
  canActivate(context: ExecutionContext) {
    // Vérifier si la route est publique
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Gère la réponse après l'authentification.
   * Si une erreur se produit ou si l'utilisateur n'est pas trouvé, une exception UnauthorizedException est levée.
   * @param err - Erreur d'authentification.
   * @param user - Utilisateur authentifié.
   * @param info - Informations supplémentaires sur l'authentification.
   * @return user - Retourne l'utilisateur authentifié.
   * @throws UnauthorizedException si le token est invalide ou expiré.
   */
  handleRequest(err: any, user: any, info: any) {
    console.log('handleRequest', { err, user, info });
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Authentification refusée : token JWT invalide ou expiré.',
        )
      );
    }
    return user;
  }
}
