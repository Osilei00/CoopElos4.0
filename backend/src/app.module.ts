import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
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
import { DashboardModule } from './dashboard/dashboard.module';
import { ContribuicoesModule } from './contribuicoes/contribuicoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.DATABASE_URL ? true : false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
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
    DashboardModule,
    ContribuicoesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
