import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
    const { username, password, ...rest } = data;
    
    const createData: any = {
      cooperative_id: cooperativeId,
      ...rest,
    };

    // If username and password provided, hash the password
    if (username && password) {
      createData.username = username;
      createData.password_hash = await bcrypt.hash(password, 10);
    }

    return this.prisma.fichaCooperadoForm.create({
      data: createData,
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

    const { password, ...rest } = data;
    
    const updateData: any = { ...rest };

    // If password provided, hash it
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    return this.prisma.fichaCooperadoForm.update({
      where: { id },
      data: updateData,
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
  // PASSWORD RESET
  // ============================================

  async resetPassword(id: string, cooperativeId: string) {
    const collaborator = await this.prisma.fichaCooperadoForm.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    if (!collaborator.username) {
      throw new BadRequestException('Collaborator does not have a username set');
    }

    // Generate a random password: first name + numbers
    const firstName = collaborator.nome_cooperado?.split(' ')[0]?.toLowerCase() || 'user';
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const newPassword = `${firstName}${randomNumbers}`;
    
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.fichaCooperadoForm.update({
      where: { id },
      data: { password_hash: passwordHash },
    });

    return {
      message: 'Password reset successfully',
      username: collaborator.username,
      temporaryPassword: newPassword,
    };
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
