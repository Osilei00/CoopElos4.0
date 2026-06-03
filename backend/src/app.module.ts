import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { DocumentsModule } from './documents/documents.module';
import { PayrollModule } from './payroll/payroll.module';
import { TimeSheetsModule } from './timesheets/timesheets.module';
import { VacationsModule } from './vacations/vacations.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audit/audit.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CollaboratorsModule,
    DocumentsModule,
    PayrollModule,
    TimeSheetsModule,
    VacationsModule,
    TasksModule,
    AuditModule,
    QueueModule,
  ],
})
export class AppModule {}
