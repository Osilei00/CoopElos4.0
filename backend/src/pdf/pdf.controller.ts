import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { AuthGuard } from '../auth/auth.guard';
import { Req } from '@nestjs/common';

@Controller('pdf')
@UseGuards(AuthGuard)
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('job/:jobId/status')
  async getJobStatus(@Param('jobId') jobId: string) {
    // Esta implementação virá com BullMQ
    return { status: 'pending', jobId };
  }

  @Get('payroll/:payrollId')
  async generatePayrollPdf(
    @Param('payrollId') payrollId: string,
    @Req() req: any,
  ) {
    try {
      const pdfBuffer = await this.pdfService.generatePayrollPdf(
        payrollId,
        req.session.cooperativeId,
      );
      return {
        success: true,
        data: pdfBuffer.toString('base64'),
        filename: `folha_pagamento_${payrollId}.pdf`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}