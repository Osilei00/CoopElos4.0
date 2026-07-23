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
            cooperado: {
              select: {
                id: true,
                nome_cooperado: true,
                cpf_cooperado: true,
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
            cooperado: {
              select: {
                id: true,
                nome_cooperado: true,
                cpf_cooperado: true,
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

  async createItem(
    payrollId: string,
    cooperativeId: string,
    data: {
      cooperado_id: string;
      gross_amount?: number;
      discounts?: number;
      net_amount?: number;
    },
  ) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id: payrollId, cooperative_id: cooperativeId },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    if (payroll.status === 'closed') {
      throw new BadRequestException('Cannot add items to a closed payroll');
    }

    const gross = data.gross_amount ?? 0;
    const disc = data.discounts ?? 0;
    const net = data.net_amount ?? gross - disc;

    const item = await this.prisma.payrollItem.create({
      data: {
        payroll_id: payrollId,
        cooperado_id: data.cooperado_id,
        gross_amount: gross,
        discounts: disc,
        net_amount: net,
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

    await this.recalculateTotals(payrollId);

    return item;
  }

  async updateItem(
    itemId: string,
    payrollId: string,
    cooperativeId: string,
    data: {
      gross_amount?: number;
      discounts?: number;
      net_amount?: number;
    },
  ) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id: payrollId, cooperative_id: cooperativeId },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    if (payroll.status === 'closed') {
      throw new BadRequestException('Cannot update items in a closed payroll');
    }

    const existingItem = await this.prisma.payrollItem.findFirst({
      where: { id: itemId, payroll_id: payrollId },
    });

    if (!existingItem) {
      throw new NotFoundException('Payroll item not found');
    }

    const gross = data.gross_amount ?? Number(existingItem.gross_amount);
    const disc = data.discounts ?? Number(existingItem.discounts);
    const net = data.net_amount ?? gross - disc;

    const item = await this.prisma.payrollItem.update({
      where: { id: itemId },
      data: {
        gross_amount: gross,
        discounts: disc,
        net_amount: net,
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

    await this.recalculateTotals(payrollId);

    return item;
  }

  async deleteItem(itemId: string, payrollId: string, cooperativeId: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id: payrollId, cooperative_id: cooperativeId },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    if (payroll.status === 'closed') {
      throw new BadRequestException('Cannot delete items from a closed payroll');
    }

    const existingItem = await this.prisma.payrollItem.findFirst({
      where: { id: itemId, payroll_id: payrollId },
    });

    if (!existingItem) {
      throw new NotFoundException('Payroll item not found');
    }

    await this.prisma.payrollItem.delete({ where: { id: itemId } });

    await this.recalculateTotals(payrollId);

    return { message: 'Item deleted' };
  }

  private async recalculateTotals(payrollId: string) {
    const items = await this.prisma.payrollItem.findMany({
      where: { payroll_id: payrollId },
    });

    const totalGross = items.reduce((sum, item) => sum + Number(item.gross_amount), 0);
    const totalDiscounts = items.reduce((sum, item) => sum + Number(item.discounts), 0);
    const totalNet = items.reduce((sum, item) => sum + Number(item.net_amount), 0);

    await this.prisma.payroll.update({
      where: { id: payrollId },
      data: {
        total_gross: totalGross,
        total_discounts: totalDiscounts,
        total_net: totalNet,
      },
    });
  }
}
