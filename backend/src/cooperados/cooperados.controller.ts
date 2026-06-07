import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { CooperadosService } from './cooperados.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@Controller('cooperados')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh, UserRole.dp)
export class CooperadosController {
  constructor(private cooperadosService: CooperadosService) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.cooperadosService.create(req.session.cooperativeId, body);
  }

  @Get()
  async findAll(@Req() req: any, @Query('search') search?: string) {
    return this.cooperadosService.findAll(req.session.cooperativeId, search);
  }
}
