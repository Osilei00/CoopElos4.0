import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { PayrollModule } from './payroll/payroll.module';
import { TasksModule } from './tasks/tasks.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CollaboratorsModule,
    PayrollModule,
    TasksModule,
    QueueModule,
  ],
})
export class AppModule {}
