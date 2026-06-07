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
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { PdfModule } from './pdf/pdf.module';
import { CooperadosModule } from './cooperados/cooperados.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.DATABASE_URL ? true : false,
    }),
    PrismaModule,
    AuthModule,
    CollaboratorsModule,
    CooperadosModule,
    DocumentsModule,
    PayrollModule,
    TimeSheetsModule,
    VacationsModule,
    TasksModule,
    AuditModule,
    QueueModule,
    UsersModule,
    PatientsModule,
    PdfModule,
  ],
})
export class AppModule {}
