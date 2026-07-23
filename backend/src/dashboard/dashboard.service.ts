import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(cooperativeId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [activeCooperados, pendingTasks, scheduledVacations, currentPayroll] =
      await Promise.all([
        this.prisma.cooperado.count({
          where: {
            cooperative_id: cooperativeId,
            status: 'active',
          },
        }),
        this.prisma.task.count({
          where: {
            cooperative_id: cooperativeId,
            status: { in: ['pending', 'in_progress'] },
          },
        }),
        this.prisma.vacation.count({
          where: {
            cooperado: { cooperative_id: cooperativeId },
            status: { in: ['scheduled', 'approved'] },
          },
        }),
        this.prisma.payroll.findFirst({
          where: {
            cooperative_id: cooperativeId,
            year: currentYear,
            month: currentMonth,
          },
          select: {
            total_net: true,
            status: true,
          },
        }),
      ]);

    return {
      activeCooperados,
      currentPayrollTotal: currentPayroll
        ? Number(currentPayroll.total_net)
        : 0,
      payrollStatus: currentPayroll?.status || null,
      pendingTasks,
      scheduledVacations,
    };
  }
}
