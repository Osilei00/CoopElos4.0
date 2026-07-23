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
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ContribuicoesService } from './contribuicoes.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { CreateContribuicaoDto } from './dto/create-contribuicao.dto';

@Controller('contribuicoes')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.dp)
export class ContribuicoesController {
  constructor(
    private contribuicoesService: ContribuicoesService,
    private auditService: AuditService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() body: CreateContribuicaoDto,
  ) {
    const result = await this.contribuicoesService.create(req.session.cooperativeId, body);
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'CREATE',
      tableName: 'contribuicao',
      recordId: result.id,
      newData: body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('cooperado_id') cooperado_id?: string,
    @Query('status') status?: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.contribuicoesService.findAll(req.session.cooperativeId, {
      mes: mes ? parseInt(mes) : undefined,
      ano: ano ? parseInt(ano) : undefined,
      cooperado_id,
      status,
      tipo,
    });
  }

  @Get('stats')
  async getStats(@Req() req: any, @Query('ano') ano?: string) {
    const currentYear = ano ? parseInt(ano) : new Date().getFullYear();
    return this.contribuicoesService.getStats(req.session.cooperativeId, currentYear);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.contribuicoesService.findOne(id, req.session.cooperativeId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { valor?: number; status?: string; descricao?: string },
    @Req() req: any,
  ) {
    const result = await this.contribuicoesService.update(id, req.session.cooperativeId, data);
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPDATE',
      tableName: 'contribuicao',
      recordId: id,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.contribuicoesService.remove(id, req.session.cooperativeId);
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'DELETE',
      tableName: 'contribuicao',
      recordId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get(':id/recibo')
  async generateRecibo(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const pdf = await this.contribuicoesService.generateReciboPdf(id, req.session.cooperativeId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="recibo-contribuicao-${id}.pdf"`,
    });
    res.send(pdf);
  }

  @Get(':id/quitacao')
  async generateQuitacao(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const pdf = await this.contribuicoesService.generateQuitacaoPdf(id, req.session.cooperativeId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="declaracao-quitacao-${id}.pdf"`,
    });
    res.send(pdf);
  }

  @Post(':id/recibo/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRecibo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.contribuicoesService.uploadRecibo(id, req.session.cooperativeId, file);
  }
}
