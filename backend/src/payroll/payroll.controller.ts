import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('payrolls')
@UseGuards(AuthGuard)
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Get()
  async findAll(
    @Req() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.payrollService.findAll(
      req.session.cooperativeId,
      year ? parseInt(year) : undefined,
      month ? parseInt(month) : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.payrollService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(
    @Query('year') year: string,
    @Query('month') month: string,
    @Req() req: any,
  ) {
    return this.payrollService.create(
      req.session.cooperativeId,
      parseInt(year),
      parseInt(month),
    );
  }

  @Post(':id/close')
  async close(@Param('id') id: string, @Req() req: any) {
    return this.payrollService.close(id, req.session.cooperativeId);
  }
}
