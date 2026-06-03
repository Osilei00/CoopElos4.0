import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SessionData {
  userId: string;
  cooperativeId: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(userId: string): Promise<SessionData> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        cooperative_id: true,
        role: true,
        is_active: true,
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      userId: user.id,
      cooperativeId: user.cooperative_id,
      role: user.role,
    };
  }

  async login(email: string, password: string, cooperativeId: string) {
    // TODO: Implement proper password hashing with bcrypt/argon2
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        cooperative_id: cooperativeId,
        is_active: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // TODO: Verify password hash
    // For now, return user data
    return {
      userId: user.id,
      cooperativeId: user.cooperative_id,
      role: user.role,
    };
  }
}
