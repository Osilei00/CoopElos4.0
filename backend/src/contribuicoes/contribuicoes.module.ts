import { Module } from '@nestjs/common';
import { ContribuicoesController } from './contribuicoes.controller';
import { ContribuicoesService } from './contribuicoes.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [ContribuicoesController],
  providers: [ContribuicoesService],
  exports: [ContribuicoesService],
})
export class ContribuicoesModule {}
