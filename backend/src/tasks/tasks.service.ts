import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(status && { status: status as any }),
      },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true },
        },
      },
      orderBy: { due_date: 'asc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(cooperativeId: string, creatorId: string, data: any) {
    return this.prisma.task.create({
      data: {
        cooperative_id: cooperativeId,
        creator_id: creatorId,
        ...data,
      },
    });
  }

  async update(id: string, cooperativeId: string, data: any) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async complete(id: string, cooperativeId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        status: 'completed',
        completed_at: new Date(),
      },
    });
  }
}
