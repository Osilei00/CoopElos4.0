import { Module } from '@nestjs/common';
import { TimeSheetsService } from './timesheets.service';
import { TimeSheetsController } from './timesheets.controller';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [PdfModule],
  controllers: [TimeSheetsController],
  providers: [TimeSheetsService],
  exports: [TimeSheetsService],
})
export class TimeSheetsModule {}
