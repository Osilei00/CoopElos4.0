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
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query('search') search?: string, @Req() req?: any) {
    return this.usersService.findAll(search, req?.session?.cooperativeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req?: any) {
    return this.usersService.findOne(id, req?.session?.cooperativeId);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.usersService.create({
      ...data,
      cooperative_id: req.session.cooperativeId,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.usersService.update(id, data);
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
  ) {
    return this.usersService.resetPassword(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
