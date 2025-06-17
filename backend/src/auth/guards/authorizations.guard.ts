import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../roles/decorators/permission.decorator';
import { AuthService } from '../services/auth.service';
import { Permission } from '../../roles/dto/create-role.dto';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class AuthorizationsGuard implements CanActivate {
  /**
   * Garde d'autorisation pour vérifier les permissions de l'utilisateur.
   * Cette garde s'assure que l'utilisateur est authentifié et possède les permissions nécessaires
   * pour accéder à une ressource spécifique.
   * @param reflector - Utilisé pour récupérer les métadonnées des permissions définies sur les routes.
   * @param authService - Service d'authentification pour récupérer les permissions de l'utilisateur.
   */
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  /**
   * Vérifie si l'utilisateur a les permissions nécessaires pour accéder à la ressource.
   * @param context - Contexte d'exécution de la requête.
   * @returns true si l'utilisateur a les permissions, sinon lève une exception.
   * @throws UnauthorizedException si l'utilisateur n'est pas authentifié.
   * @throws ForbiddenException si l'utilisateur n'a pas les permissions requises.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new UnauthorizedException(
        'Accès refusé : utilisateur non authentifié.',
      );
    }

    const routePermissions: Permission[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    try {
      const userPermissions = await this.authService.getUserPermissions(
        request.user.id,
      );
      for (const routePermission of routePermissions) {
        const userPermission = userPermissions.find(
          (perm) => perm.resource === routePermission.resource,
        );
        if (!userPermission) {
          throw new ForbiddenException(
            `Accès refusé : vous n'avez pas la permission d'accéder à la ressource "${routePermission.resource}".`,
          );
        } else {
          const hasAction = routePermission.actions.every((action) =>
            userPermission.actions.includes(action),
          );
          if (!hasAction) {
            throw new ForbiddenException(
              `Accès refusé : vous n'avez pas les actions requises pour la ressource "${routePermission.resource}".`,
            );
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions :', error);
      throw new ForbiddenException(
        "Erreur lors de la vérification des permissions de l'utilisateur.",
      );
    }

    return true;
  }
}
