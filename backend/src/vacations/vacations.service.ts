import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VacationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string) {
    return this.prisma.vacation.findMany({
      where: {
        collaborator: {
          cooperative_id: cooperativeId,
        },
      },
      include: {
        collaborator: {
          select: {
            id: true,
            full_name: true,
            cpf: true,
          },
        },
      },
      orderBy: { start_date: 'desc' },
    });
  }

  async findByCollaborator(collaboratorId: string) {
    return this.prisma.vacation.findMany({
      where: { collaborator_id: collaboratorId },
      orderBy: { start_date: 'desc' },
    });
  }

  async findOne(id: string) {
    const vacation = await this.prisma.vacation.findUnique({
      where: { id },
      include: {
        collaborator: {
          select: {
            id: true,
            full_name: true,
            cpf: true,
          },
        },
      },
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return vacation;
  }

  async create(data: any) {
    return this.prisma.vacation.create({
      data,
    });
  }

  async update(id: string, data: any) {
    const vacation = await this.prisma.vacation.findUnique({
      where: { id },
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return this.prisma.vacation.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const vacation = await this.prisma.vacation.findUnique({
      where: { id },
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return this.prisma.vacation.delete({
      where: { id },
    });
  }
}
