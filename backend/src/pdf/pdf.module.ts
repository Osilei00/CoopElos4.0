import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfWorker } from './pdf.worker';
import { PdfController } from './pdf.controller';

@Module({
  controllers: [PdfController],
  providers: [PdfService, PdfWorker],
  exports: [PdfService],
})
export class PdfModule {}
