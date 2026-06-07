import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session.role) {
      throw new ForbiddenException('Sessão inválida');
    }

    const hasRole = requiredRoles.includes(session.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Requer um dos seguintes perfis: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
