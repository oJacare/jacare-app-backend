import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, MissionPermission } from '../shared/roles.decorator';
import { JwtPayload } from './auth-guard';

const JACARE_ROLE_HIERARCHY: Record<string, number> = {
  VIEWER: 1,
  DESIGNER: 2,
  ADMIN: 3,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<MissionPermission>(
      Roles,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;

    const userLevel = JACARE_ROLE_HIERARCHY[user.role] ?? 0;
    const requiredLevel = JACARE_ROLE_HIERARCHY[requiredPermission.role] ?? 0;

    if (userLevel < requiredLevel) {
      throw new ForbiddenException(
        `Acesso negado. Role necessária: ${requiredPermission.role}. Sua role: ${user.role}.`,
      );
    }

    return true;
  }
}
