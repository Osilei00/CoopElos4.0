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
import { CollaboratorsService } from './collaborators.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@Controller('collaborators')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh, UserRole.dp)
export class CollaboratorsController {
  constructor(private collaboratorsService: CollaboratorsService) {}

  @Get()
  async findAll(@Req() req: any, @Query('search') search?: string) {
    return this.collaboratorsService.findAll(req.session.cooperativeId, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.collaboratorsService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.collaboratorsService.create(req.session.cooperativeId, data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.collaboratorsService.update(
      id,
      req.session.cooperativeId,
      data,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.collaboratorsService.remove(id, req.session.cooperativeId);
  }

  // ============================================
  // ADHESION FORM
  // ============================================

  @Get(':id/adhesion-form')
  async getAdhesionForm(@Param('id') id: string, @Req() req: any) {
    return this.collaboratorsService.getAdhesionForm(
      id,
      req.session.cooperativeId,
    );
  }

  @Post(':id/adhesion-form')
  async createAdhesionForm(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.collaboratorsService.upsertAdhesionForm(
      id,
      req.session.cooperativeId,
      data,
    );
  }

  @Put(':id/adhesion-form')
  async updateAdhesionForm(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.collaboratorsService.upsertAdhesionForm(
      id,
      req.session.cooperativeId,
      data,
    );
  }
}
