import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CooperativeService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const cooperative = await this.prisma.cooperative.findUnique({
      where: { id },
    });
    if (!cooperative) throw new NotFoundException('Cooperativa não encontrada');
    return cooperative;
  }

  async update(id: string, data: { name?: string; cnpj?: string; address?: string; phone?: string; email?: string; logo_url?: string }) {
    const cooperative = await this.prisma.cooperative.findUnique({ where: { id } });
    if (!cooperative) throw new NotFoundException('Cooperativa não encontrada');
    return this.prisma.cooperative.update({ where: { id }, data });
  }
}
