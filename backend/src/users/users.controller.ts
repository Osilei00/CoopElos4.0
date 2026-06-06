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

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Req() req: any, @Query('search') search?: string) {
    return this.usersService.findAll(req.session.cooperativeId, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.usersService.create(req.session.cooperativeId, data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.usersService.update(id, req.session.cooperativeId, data);
  }

  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Body('password') password: string,
    @Req() req: any,
  ) {
    return this.usersService.resetPassword(id, req.session.cooperativeId, password);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.session.cooperativeId);
  }
}
