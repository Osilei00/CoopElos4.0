import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async findAll(@Req() req: any, @Query('status') status?: string) {
    return this.tasksService.findAll(req.session.cooperativeId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.tasksService.create(
      req.session.cooperativeId,
      req.session.userId,
      data,
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.tasksService.update(id, req.session.cooperativeId, data);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.complete(id, req.session.cooperativeId);
  }
}
