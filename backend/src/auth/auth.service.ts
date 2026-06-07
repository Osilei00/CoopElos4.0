import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface SessionData {
  userId: string;
  cooperativeId: string;
  role: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(userId: string): Promise<SessionData> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        is_active: true,
        name: true,
        email: true,
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      userId: user.id,
      cooperativeId: '',
      role: user.role,
      name: user.name,
      email: user.email,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        is_active: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const cooperative = await this.prisma.cooperative.findFirst();
    if (!cooperative) {
      throw new UnauthorizedException('No cooperative configured');
    }

    return {
      userId: user.id,
      cooperativeId: cooperative.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };
  }
}
