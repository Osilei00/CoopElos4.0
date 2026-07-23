import { Module } from '@nestjs/common';
import { CooperadosService } from './cooperados.service';
import { CooperadosController } from './cooperados.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [CooperadosController],
  providers: [CooperadosService],
})
export class CooperadosModule {}
