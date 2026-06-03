import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TimeSheetsService } from './timesheets.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('timesheets')
@UseGuards(AuthGuard)
export class TimeSheetsController {
  constructor(private timeSheetsService: TimeSheetsService) {}

  // ============================================
  // HOSPITAL
  // ============================================

  @Get('hospital')
  async findHospitalAll(
    @Req() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.timeSheetsService.findHospitalAll(
      req.session.cooperativeId,
      year ? parseInt(year) : undefined,
      month ? parseInt(month) : undefined,
    );
  }

  @Get('hospital/:id')
  async findHospitalOne(@Param('id') id: string) {
    return this.timeSheetsService.findHospitalOne(id);
  }

  @Post('hospital')
  async upsertHospital(@Body() data: any) {
    return this.timeSheetsService.upsertHospital(data);
  }

  // ============================================
  // SAD
  // ============================================

  @Get('sad')
  async findSadAll(
    @Req() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.timeSheetsService.findSadAll(
      req.session.cooperativeId,
      year ? parseInt(year) : undefined,
      month ? parseInt(month) : undefined,
    );
  }

  @Get('sad/:id')
  async findSadOne(@Param('id') id: string) {
    return this.timeSheetsService.findSadOne(id);
  }

  @Post('sad')
  async upsertSad(@Body() data: any) {
    return this.timeSheetsService.upsertSad(data);
  }
}
