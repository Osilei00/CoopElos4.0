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
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@Controller('documents')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.rh)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('collaborator/:collaboratorId')
  async findAll(@Param('collaboratorId') collaboratorId: string) {
    return this.documentsService.findAll(collaboratorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post('upload/:collaboratorId')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('collaboratorId') collaboratorId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.upload(collaboratorId, file);
  }

  @Get(':id/download')
  async download(@Param('id') id: string) {
    return this.documentsService.getSignedUrl(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
