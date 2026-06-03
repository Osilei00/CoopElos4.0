import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    cooperativeId: string;
    userId?: string;
    action: string;
    tableName: string;
    recordId: string;
    oldData?: any;
    newData?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        cooperative_id: data.cooperativeId,
        user_id: data.userId,
        action: data.action,
        table_name: data.tableName,
        record_id: data.recordId,
        old_data: data.oldData,
        new_data: data.newData,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
      },
    });
  }

  async findAll(cooperativeId: string, tableName?: string) {
    return this.prisma.auditLog.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(tableName && { table_name: tableName }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 1000, // Limit to prevent performance issues
    });
  }

  async findByRecord(tableName: string, recordId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        table_name: tableName,
        record_id: recordId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
