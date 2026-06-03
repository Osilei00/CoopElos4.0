import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('audit')
@UseGuards(AuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  async findAll(
    @Req() req: any,
    @Query('table') tableName?: string,
  ) {
    return this.auditService.findAll(req.session.cooperativeId, tableName);
  }

  @Get(':tableName/:recordId')
  async findByRecord(
    @Param('tableName') tableName: string,
    @Param('recordId') recordId: string,
  ) {
    return this.auditService.findByRecord(tableName, recordId);
  }
}
