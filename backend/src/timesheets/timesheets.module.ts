import { Module } from '@nestjs/common';
import { TimeSheetsService } from './timesheets.service';
import { TimeSheetsController } from './timesheets.controller';

@Module({
  controllers: [TimeSheetsController],
  providers: [TimeSheetsService],
  exports: [TimeSheetsService],
})
export class TimeSheetsModule {}
