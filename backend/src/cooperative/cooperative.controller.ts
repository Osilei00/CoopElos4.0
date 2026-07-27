import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { IsString, IsOptional, IsEmail } from 'class-validator';

class UpdateCooperativeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;
}

@Controller('cooperatives')
@UseGuards(AuthGuard, RolesGuard)
export class CooperativeController {
  constructor(private cooperativeService: CooperativeService) {}

  @Get('me')
  async getMyCooperative(@Req() req: any) {
    return this.cooperativeService.findById(req.session.cooperativeId);
  }

  @Put('me')
  @Roles(UserRole.admin)
  async updateMyCooperative(@Req() req: any, @Body() data: UpdateCooperativeDto) {
    return this.cooperativeService.update(req.session.cooperativeId, data);
  }
}
