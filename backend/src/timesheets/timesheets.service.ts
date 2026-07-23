import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeSheetsService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // HOSPITAL TIMESHEET
  // ============================================

  async findHospitalAll(cooperativeId: string, year?: number, month?: number) {
    return this.prisma.timeSheetHospital.findMany({
      where: {
        cooperado: { cooperative_id: cooperativeId },
        ...(year && month && { year, month }),
      },
      include: { cooperado: { select: { id: true, nome_cooperado: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findHospitalOne(id: string, cooperativeId: string) {
    const timesheet = await this.prisma.timeSheetHospital.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
      include: { cooperado: { select: { id: true, nome_cooperado: true } } },
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return timesheet;
  }

  async upsertHospital(data: {
    cooperative_id: string;
    cooperado_id: string;
    year: number;
    month: number;
    schedule_data: any;
    total_hours?: number;
  }) {
    const { cooperado_id, year, month, schedule_data, total_hours } = data;

    const existing = await this.prisma.timeSheetHospital.findFirst({
      where: { cooperado_id, year, month },
    });

    if (existing) {
      return this.prisma.timeSheetHospital.update({
        where: { id: existing.id },
        data: { schedule_data, total_hours: total_hours ?? existing.total_hours },
      });
    }

    return this.prisma.timeSheetHospital.create({
      data: {
        cooperado_id,
        year,
        month,
        schedule_data,
        total_hours: total_hours ?? 0,
      },
    });
  }

  // ============================================
  // SAD TIMESHEET
  // ============================================

  async findSadAll(cooperativeId: string, year?: number, month?: number) {
    return this.prisma.timeSheetSad.findMany({
      where: {
        cooperado: { cooperative_id: cooperativeId },
        ...(year && month && { year, month }),
      },
      include: {
        patient: true,
        cooperado: { select: { id: true, nome_cooperado: true } },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findSadOne(id: string, cooperativeId: string) {
    const timesheet = await this.prisma.timeSheetSad.findFirst({
      where: {
        id,
        cooperado: { cooperative_id: cooperativeId },
      },
      include: {
        patient: true,
        cooperado: { select: { id: true, nome_cooperado: true } },
      },
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return timesheet;
  }

  async upsertSad(data: {
    cooperative_id: string;
    cooperado_id: string;
    patient_id: string;
    year: number;
    month: number;
    morning_shifts?: number;
    night_shifts?: number;
    six_by_one?: number;
    gross_value?: number;
    meal_allowance?: number;
    quota_value?: number;
    tax_value?: number;
    net_value?: number;
  }) {
    const { cooperado_id, patient_id, year, month, ...fields } = data;

    const existing = await this.prisma.timeSheetSad.findFirst({
      where: { cooperado_id, patient_id, year, month },
    });

    if (existing) {
      return this.prisma.timeSheetSad.update({
        where: { id: existing.id },
        data: fields,
      });
    }

    return this.prisma.timeSheetSad.create({
      data: {
        cooperado_id,
        patient_id,
        year,
        month,
        ...fields,
      },
    });
  }
}
