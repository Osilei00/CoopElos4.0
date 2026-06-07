import { Module } from '@nestjs/common';
import { CooperadosService } from './cooperados.service';
import { CooperadosController } from './cooperados.controller';

@Module({
  controllers: [CooperadosController],
  providers: [CooperadosService],
})
export class CooperadosModule {}
