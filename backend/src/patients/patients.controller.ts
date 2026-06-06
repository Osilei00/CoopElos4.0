import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('patients')
@UseGuards(AuthGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  async findAll(@Req() req: any, @Query('search') search?: string) {
    return this.patientsService.findAll(req.session.cooperativeId, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.patientsService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.patientsService.create(req.session.cooperativeId, data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.patientsService.update(id, req.session.cooperativeId, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.patientsService.remove(id, req.session.cooperativeId);
  }
}
