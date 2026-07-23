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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { CreateVacationDto } from './dto/create-vacation.dto';

@Controller('vacations')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh)
export class VacationsController {
  constructor(private vacationsService: VacationsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.vacationsService.findAll(req.session.cooperativeId);
  }

  @Get('cooperado/:cooperadoId')
  async findByCooperado(@Param('cooperadoId') cooperadoId: string, @Req() req: any) {
    return this.vacationsService.findByCooperado(req.session.cooperativeId, cooperadoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.vacationsService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(@Body() data: CreateVacationDto, @Req() req: any) {
    return this.vacationsService.create({ ...data, cooperative_id: req.session.cooperativeId });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: CreateVacationDto, @Req() req: any) {
    return this.vacationsService.update(id, req.session.cooperativeId, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.vacationsService.remove(id, req.session.cooperativeId);
  }
}
