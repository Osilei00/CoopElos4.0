import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaboratorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.collaborator.findMany({
      where: {
        cooperative_id: cooperativeId,
        status: 'active',
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
    const { adhesion_form, ...collaboratorData } = data;

    return this.prisma.collaborator.create({
      data: {
        cooperative_id: cooperativeId,
        ...collaboratorData,
        ...(adhesion_form && {
          adhesion_form: {
            create: adhesion_form,
          },
        }),
      },
      include: {
        adhesion_form: true,
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

    const { adhesion_form, ...collaboratorData } = data;

    return this.prisma.collaborator.update({
      where: { id },
      data: {
        ...collaboratorData,
        ...(adhesion_form && {
          adhesion_form: {
            upsert: {
              create: adhesion_form,
              update: adhesion_form,
            },
          },
        }),
      },
      include: {
        adhesion_form: true,
      },
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

    return this.prisma.collaborator.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  // ============================================
  // ADHESION FORM
  // ============================================

  async getAdhesionForm(collaboratorId: string, cooperativeId: string) {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: {
        id: collaboratorId,
        cooperative_id: cooperativeId,
      },
      include: {
        adhesion_form: true,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator.adhesion_form;
  }

  async upsertAdhesionForm(
    collaboratorId: string,
    cooperativeId: string,
    data: any,
  ) {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: {
        id: collaboratorId,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return this.prisma.adhesionForm.upsert({
      where: { collaborator_id: collaboratorId },
      create: {
        collaborator_id: collaboratorId,
        ...data,
      },
      update: data,
    });
  }
}
