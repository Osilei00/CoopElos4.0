import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.user.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        created_at: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(cooperativeId: string, data: { name: string; username?: string; email: string; password: string; role: string }) {
    // Check email uniqueness
    const existingEmail = await this.prisma.user.findFirst({
      where: {
        cooperative_id: cooperativeId,
        email: data.email,
      },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check username uniqueness if provided
    if (data.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });

      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        cooperative_id: cooperativeId,
        name: data.name,
        username: data.username || null,
        email: data.email,
        password_hash: passwordHash,
        role: data.role as any,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  async update(id: string, cooperativeId: string, data: { name?: string; username?: string; email?: string; role?: string; is_active?: boolean }) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          cooperative_id: cooperativeId,
          email: data.email,
          id: { not: id },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (data.username && data.username !== user.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: id },
        },
      });

      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        role: data.role ? (data.role as any) : undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        is_active: true,
        updated_at: true,
      },
    });
  }

  async resetPassword(id: string, cooperativeId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate temporary password: first name + 4 random numbers
    const firstName = user.name?.split(' ')[0]?.toLowerCase() || 'user';
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const temporaryPassword = `${firstName}${randomNumbers}`;
    
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password_hash: passwordHash },
    });

    return {
      message: 'Password reset successfully',
      username: user.username || user.email,
      temporaryPassword,
    };
  }

  async remove(id: string, cooperativeId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
