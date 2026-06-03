import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaboratorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.collaborator.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(search && {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        adhesion_form: true,
      },
      orderBy: { full_name: 'asc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
      include: {
        adhesion_form: true,
        documents: true,
        vacations: true,
        contract_history: true,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }

  async create(cooperativeId: string, data: any) {
    return this.prisma.collaborator.create({
      data: {
        cooperative_id: cooperativeId,
        ...data,
      },
    });
  }

  async update(id: string, cooperativeId: string, data: any) {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return this.prisma.collaborator.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, cooperativeId: string) {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    // Soft delete - set status to inactive
    return this.prisma.collaborator.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
