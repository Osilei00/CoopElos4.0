import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('vacations')
@UseGuards(AuthGuard)
export class VacationsController {
  constructor(private vacationsService: VacationsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.vacationsService.findAll(req.session.cooperativeId);
  }

  @Get('collaborator/:collaboratorId')
  async findByCollaborator(@Param('collaboratorId') collaboratorId: string) {
    return this.vacationsService.findByCollaborator(collaboratorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vacationsService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.vacationsService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.vacationsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vacationsService.remove(id);
  }
}
