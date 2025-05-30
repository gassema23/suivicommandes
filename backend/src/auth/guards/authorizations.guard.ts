import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/roles/decorators/permission.decorator';
import { AuthService } from '../auth.service';
import { Permission } from 'src/roles/dto/create-role.dto';

@Injectable()
export class AuthorizationsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('User not authenticated');
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
            `User does not have permission for resource: ${routePermission.resource}`,
          );
        } else {
          const hasAction = routePermission.actions.every((action) =>
            userPermission.actions.includes(action),
          );
          if (!hasAction) {
            throw new ForbiddenException(
              `User does not have required actions for resource: ${routePermission.resource}`,
            );
          }
        }
      }
    } catch (error) {
      throw new ForbiddenException('Error fetching user permissions');
    }

    return true;
  }
}
