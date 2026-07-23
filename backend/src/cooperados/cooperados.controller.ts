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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CooperadosService } from './cooperados.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { CreateCooperadoDto } from './dto/create-cooperado.dto';

@Controller('cooperados')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh, UserRole.dp, UserRole.viewer)
export class CooperadosController {
  constructor(
    private cooperadosService: CooperadosService,
    private auditService: AuditService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() body: CreateCooperadoDto) {
    const result = await this.cooperadosService.create(
      req.session.cooperativeId,
      body,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'CREATE',
      tableName: 'cooperado',
      recordId: result.id,
      newData: body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get()
  async findAll(@Req() req: any, @Query('search') search?: string) {
    return this.cooperadosService.findAll(req.session.cooperativeId, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.cooperadosService.findOne(id, req.session.cooperativeId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: CreateCooperadoDto,
    @Req() req: any,
  ) {
    const oldData = await this.cooperadosService.findOne(
      id,
      req.session.cooperativeId,
    );
    const result = await this.cooperadosService.update(
      id,
      req.session.cooperativeId,
      data,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPDATE',
      tableName: 'cooperado',
      recordId: id,
      oldData,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const oldData = await this.cooperadosService.findOne(
      id,
      req.session.cooperativeId,
    );
    const result = await this.cooperadosService.remove(
      id,
      req.session.cooperativeId,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'DELETE',
      tableName: 'cooperado',
      recordId: id,
      oldData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  // ============================================
  // ADHESION FORM
  // ============================================

  @Get(':id/adhesion-form')
  async getAdhesionForm(@Param('id') id: string, @Req() req: any) {
    return this.cooperadosService.getAdhesionForm(
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
    const result = await this.cooperadosService.upsertAdhesionForm(
      id,
      req.session.cooperativeId,
      data,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPSERT',
      tableName: 'ficha_cooperado_form',
      recordId: result.id,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Put(':id/adhesion-form')
  async updateAdhesionForm(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    const result = await this.cooperadosService.upsertAdhesionForm(
      id,
      req.session.cooperativeId,
      data,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPSERT',
      tableName: 'ficha_cooperado_form',
      recordId: result.id,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  // ============================================
  // DECLARAÇÃO DE ADESÃO
  // ============================================

  @Post(':id/declaracao-adesao')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDeclaracaoAdesao(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.cooperadosService.uploadDeclaracaoAdesao(
      id,
      req.session.cooperativeId,
      file,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPLOAD',
      tableName: 'cooperado',
      recordId: id,
      newData: { declaracao_adesao: file.originalname },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get(':id/declaracao-adesao')
  async getDeclaracaoAdesao(@Param('id') id: string, @Req() req: any) {
    return this.cooperadosService.getDeclaracaoAdesao(
      id,
      req.session.cooperativeId,
    );
  }

  @Get(':id/declaracao-adesao/pdf')
  async generateDeclaracaoAdesaoPdf(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const pdf = await this.cooperadosService.generateDeclaracaoAdesaoPdf(
      id,
      req.session.cooperativeId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="declaracao-adesao-${id}.pdf"`,
    });
    res.send(pdf);
  }

  // ============================================
  // RECIBO DE CONTRIBUIÇÃO
  // ============================================

  @Post(':id/recibo-contribuicao')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReciboContribuicao(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.cooperadosService.uploadReciboContribuicao(
      id,
      req.session.cooperativeId,
      file,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPLOAD',
      tableName: 'cooperado',
      recordId: id,
      newData: { recibo_contribuicao: file.originalname },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get(':id/recibo-contribuicao')
  async getReciboContribuicao(@Param('id') id: string, @Req() req: any) {
    return this.cooperadosService.getReciboContribuicao(
      id,
      req.session.cooperativeId,
    );
  }

  // ============================================
  // DECLARAÇÃO DE QUITAÇÃO
  // ============================================

  @Post(':id/declaracao-quitacao')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDeclaracaoQuitacao(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.cooperadosService.uploadDeclaracaoQuitacao(
      id,
      req.session.cooperativeId,
      file,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPLOAD',
      tableName: 'cooperado',
      recordId: id,
      newData: { declaracao_quitacao: file.originalname },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get(':id/declaracao-quitacao')
  async getDeclaracaoQuitacao(@Param('id') id: string, @Req() req: any) {
    return this.cooperadosService.getDeclaracaoQuitacao(
      id,
      req.session.cooperativeId,
    );
  }

  // ============================================
  // CONTRACT HISTORY
  // ============================================

  @Get(':id/history')
  async getContractHistory(@Param('id') id: string, @Req() req: any) {
    return this.cooperadosService.getContractHistory(
      id,
      req.session.cooperativeId,
    );
  }

  @Post(':id/history')
  async createContractHistory(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    const result = await this.cooperadosService.createContractHistory(
      id,
      req.session.cooperativeId,
      data,
    );
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'CREATE',
      tableName: 'contract_history',
      recordId: result.id,
      newData: data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }
}
