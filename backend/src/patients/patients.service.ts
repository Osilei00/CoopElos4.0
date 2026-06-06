import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.patient.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async create(cooperativeId: string, data: { name: string; code?: string }) {
    return this.prisma.patient.create({
      data: {
        cooperative_id: cooperativeId,
        ...data,
      },
    });
  }

  async update(id: string, cooperativeId: string, data: { name?: string; code?: string }) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, cooperativeId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    await this.prisma.patient.delete({
      where: { id },
    });

    return { message: 'Patient deleted' };
  }
}
