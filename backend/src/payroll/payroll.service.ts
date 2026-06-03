import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, year?: number, month?: number) {
    return this.prisma.payroll.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(year && month && { year, month }),
      },
      include: {
        items: {
          include: {
            collaborator: {
              select: {
                id: true,
                full_name: true,
                cpf: true,
              },
            },
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
      include: {
        items: {
          include: {
            collaborator: {
              select: {
                id: true,
                full_name: true,
                cpf: true,
              },
            },
          },
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    return payroll;
  }

  async create(cooperativeId: string, year: number, month: number) {
    // Check if payroll already exists for this period
    const existing = await this.prisma.payroll.findFirst({
      where: {
        cooperative_id: cooperativeId,
        year,
        month,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Payroll for ${year}/${month} already exists`,
      );
    }

    return this.prisma.payroll.create({
      data: {
        cooperative_id: cooperativeId,
        year,
        month,
      },
    });
  }

  async close(id: string, cooperativeId: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    if (payroll.status !== 'draft' && payroll.status !== 'processing') {
      throw new BadRequestException('Payroll cannot be closed');
    }

    return this.prisma.payroll.update({
      where: { id },
      data: {
        status: 'closed',
        closed_at: new Date(),
      },
    });
  }
}
