import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get user ID from headers (injected by Next.js proxy)
    const userId = request.headers['x-user-id'];
    const cooperativeId = request.headers['x-cooperative-id'];

    if (!userId || !cooperativeId) {
      throw new UnauthorizedException('Missing authentication headers');
    }

    try {
      const session = await this.authService.validateUser(userId);

      request.session = {
        userId: session.userId,
        cooperativeId,
        role: session.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
