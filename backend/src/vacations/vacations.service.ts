import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VacationStatus } from '@prisma/client';

@Injectable()
export class VacationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string) {
    return this.prisma.vacation.findMany({
      where: {
        cooperado: { cooperative_id: cooperativeId },
      },
      include: {
        cooperado: {
          select: {
            id: true,
            nome_cooperado: true,
            cpf_cooperado: true,
          },
        },
      },
      orderBy: { start_date: 'desc' },
    });
  }

  async findByCooperado(cooperativeId: string, cooperadoId: string) {
    return this.prisma.vacation.findMany({
      where: {
        cooperado_id: cooperadoId,
        cooperado: { cooperative_id: cooperativeId },
      },
      orderBy: { start_date: 'desc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const vacation = await this.prisma.vacation.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
      include: {
        cooperado: {
          select: {
            id: true,
            nome_cooperado: true,
            cpf_cooperado: true,
          },
        },
      },
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return vacation;
  }

  async create(data: {
    cooperative_id: string;
    cooperado_id: string;
    start_date: string;
    end_date: string;
    days_count: number;
    status?: string;
  }) {
    return this.prisma.vacation.create({
      data: {
        cooperado_id: data.cooperado_id,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        days: data.days_count,
        status: (data.status as VacationStatus) || VacationStatus.scheduled,
      },
    });
  }

  async update(id: string, cooperativeId: string, data: {
    start_date?: string;
    end_date?: string;
    days_count?: number;
    status?: string;
  }) {
    const vacation = await this.prisma.vacation.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return this.prisma.vacation.update({
      where: { id },
      data: {
        ...(data.start_date && { start_date: new Date(data.start_date) }),
        ...(data.end_date && { end_date: new Date(data.end_date) }),
        ...(data.days_count && { days: data.days_count }),
        ...(data.status && { status: data.status as VacationStatus }),
      },
    });
  }

  async remove(id: string, cooperativeId: string) {
    const vacation = await this.prisma.vacation.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
    });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    return this.prisma.vacation.delete({
      where: { id },
    });
  }
}
