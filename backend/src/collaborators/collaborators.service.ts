import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaboratorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.fichaCooperadoForm.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(search && {
          OR: [
            { nome_cooperado: { contains: search, mode: 'insensitive' } },
            { cpf_cooperado: { contains: search } },
            { email_cooperado: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { nome_cooperado: 'asc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const collaborator = await this.prisma.fichaCooperadoForm.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }

  async create(cooperativeId: string, data: any) {
    return this.prisma.fichaCooperadoForm.create({
      data: {
        cooperative_id: cooperativeId,
        ...data,
      },
    });
  }

  async update(id: string, cooperativeId: string, data: any) {
    const collaborator = await this.prisma.fichaCooperadoForm.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return this.prisma.fichaCooperadoForm.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, cooperativeId: string) {
    const collaborator = await this.prisma.fichaCooperadoForm.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return this.prisma.fichaCooperadoForm.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  // ============================================
  // ADHESION FORM (legacy compatibility)
  // ============================================

  async getAdhesionForm(collaboratorId: string, cooperativeId: string) {
    return null;
  }

  async upsertAdhesionForm(
    collaboratorId: string,
    cooperativeId: string,
    data: any,
  ) {
    return null;
  }
}
