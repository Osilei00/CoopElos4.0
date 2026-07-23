import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh, UserRole.dp, UserRole.viewer)
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private auditService: AuditService,
  ) {}

  @Get()
  async findAll(@Req() req: any, @Query('status') status?: string) {
    return this.tasksService.findAll(req.session.cooperativeId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.session.cooperativeId);
  }

  @Post()
  async create(@Body() data: CreateTaskDto, @Req() req: any) {
    const result = await this.tasksService.create(
      req.session.cooperativeId,
      req.session.userId,
      data,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'CREATE',
      tableName: 'task',
      recordId: result.id,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: CreateTaskDto, @Req() req: any) {
    const result = await this.tasksService.update(
      id,
      req.session.cooperativeId,
      data,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPDATE',
      tableName: 'task',
      recordId: id,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @Req() req: any) {
    const result = await this.tasksService.complete(
      id,
      req.session.cooperativeId,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'COMPLETE',
      tableName: 'task',
      recordId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.tasksService.remove(
      id,
      req.session.cooperativeId,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'DELETE',
      tableName: 'task',
      recordId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }
}
