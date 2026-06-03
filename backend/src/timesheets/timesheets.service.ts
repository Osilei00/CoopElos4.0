import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        collaborator: {
          cooperative_id: cooperativeId,
        },
        ...(year && month && { year, month }),
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
      orderBy: { collaborator: { full_name: 'asc' } },
    });
  }

  async findHospitalOne(id: string) {
    const timesheet = await this.prisma.timeSheetHospital.findUnique({
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

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return timesheet;
  }

  async upsertHospital(data: any) {
    const { collaborator_id, year, month, schedule_data } = data;

    // Calculate total hours from schedule
    const totalHours = this.calculateHospitalHours(schedule_data);

    return this.prisma.timeSheetHospital.upsert({
      where: {
        collaborator_id_year_month: {
          collaborator_id,
          year,
          month,
        },
      },
      create: {
        collaborator_id,
        year,
        month,
        schedule_data,
        total_hours: totalHours,
      },
      update: {
        schedule_data,
        total_hours: totalHours,
      },
    });
  }

  private calculateHospitalHours(scheduleData: any): number {
    // Codes: M=6h, T=6h, SN=12h, D=8h, F=0, .=0
    const codeHours: Record<string, number> = {
      M: 6,
      T: 6,
      SN: 12,
      D: 8,
      F: 0,
      '.': 0,
    };

    let total = 0;
    for (const day of Object.values(scheduleData) as string[]) {
      total += codeHours[day] || 0;
    }
    return total;
  }

  // ============================================
  // SAD TIMESHEET
  // ============================================

  async findSadAll(cooperativeId: string, year?: number, month?: number) {
    return this.prisma.timeSheetSad.findMany({
      where: {
        collaborator: {
          cooperative_id: cooperativeId,
        },
        patient: {
          cooperative_id: cooperativeId,
        },
        ...(year && month && { year, month }),
      },
      include: {
        collaborator: {
          select: {
            id: true,
            full_name: true,
            cpf: true,
          },
        },
        patient: true,
      },
      orderBy: { patient: { code: 'asc' } },
    });
  }

  async findSadOne(id: string) {
    const timesheet = await this.prisma.timeSheetSad.findUnique({
      where: { id },
      include: {
        collaborator: {
          select: {
            id: true,
            full_name: true,
            cpf: true,
          },
        },
        patient: true,
      },
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return timesheet;
  }

  async upsertSad(data: any) {
    const {
      collaborator_id,
      patient_id,
      year,
      month,
      morning_shifts,
      night_shifts,
      six_by_one,
    } = data;

    // Calculate values
    const grossValue = this.calculateSadGross(
      morning_shifts,
      night_shifts,
      six_by_one,
    );
    const taxValue = this.calculateSadTax(grossValue);
    const netValue = grossValue - taxValue;

    return this.prisma.timeSheetSad.upsert({
      where: {
        collaborator_id_patient_id_year_month: {
          collaborator_id,
          patient_id,
          year,
          month,
        },
      },
      create: {
        collaborator_id,
        patient_id,
        year,
        month,
        morning_shifts,
        night_shifts,
        six_by_one,
        gross_value: grossValue,
        tax_value: taxValue,
        net_value: netValue,
      },
      update: {
        morning_shifts,
        night_shifts,
        six_by_one,
        gross_value: grossValue,
        tax_value: taxValue,
        net_value: netValue,
      },
    });
  }

  private calculateSadGross(
    morning: number,
    night: number,
    sixByOne: number,
  ): number {
    // TODO: Get actual rates from cooperative settings
    const morningRate = 150; // R$ 150/day
    const nightRate = 180; // R$ 180/day
    const sixByOneRate = 200; // R$ 200/day

    return morning * morningRate + night * nightRate + sixByOne * sixByOneRate;
  }

  private calculateSadTax(gross: number): number {
    // TODO: Implement proper tax calculation
    return gross * 0.15; // 15% tax placeholder
  }
}
