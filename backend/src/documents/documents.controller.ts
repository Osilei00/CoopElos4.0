import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@Controller('documents')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh)
export class DocumentsController {
  constructor(
    private documentsService: DocumentsService,
    private auditService: AuditService,
  ) {}

  @Get('cooperado/:cooperadoId')
  async findAll(@Param('cooperadoId') cooperadoId: string) {
    return this.documentsService.findAll(cooperadoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.findOne(id, req.session.cooperativeId);
  }

  @Post('upload/:cooperadoId')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('cooperadoId') cooperadoId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.documentsService.upload(cooperadoId, file);
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'UPLOAD',
      tableName: 'document',
      recordId: result.id,
      newData: { name: file.originalname, mime_type: file.mimetype },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.getSignedUrl(id, req.session.cooperativeId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.documentsService.remove(id, req.session.cooperativeId);
    await this.auditService.log({
      cooperativeId: req.session.cooperativeId,
      userId: req.session.userId,
      action: 'DELETE',
      tableName: 'document',
      recordId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return result;
  }
}
