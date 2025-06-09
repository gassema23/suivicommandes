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

@Injectable()
export class AuthorizationsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
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
            `L'utilisateur n'a pas la permission pour la ressource : ${routePermission.resource}`,
          );
        } else {
          const hasAction = routePermission.actions.every((action) =>
            userPermission.actions.includes(action),
          );
          if (!hasAction) {
            throw new ForbiddenException(
              `L'utilisateur n'a pas les actions requises pour la ressource : ${routePermission.resource}`,
            );
          }
        }
      }
    } catch (error) {
      throw new ForbiddenException(
        'Erreur lors de la récupération des permissions utilisateur',
      );
    }

    return true;
  }
}
