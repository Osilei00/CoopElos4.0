import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  async generatePayrollPdf(payrollId: string, cooperativeId: string): Promise<Buffer> {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        id: payrollId,
        cooperative_id: cooperativeId,
      },
      include: {
        items: {
          include: {
            collaborator: {
              select: {
                id: true,
                full_name: true,
                cpf: true,
              },
            },
          },
        },
        cooperative: true,
      },
    });

    if (!payroll) {
      throw new Error('Payroll not found');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text(payroll.cooperative?.name || 'CoopElos', { align: 'center' });
      doc.fontSize(14).text('Folha de Pagamento', { align: 'center' });
      doc.moveDown();

      // Period info
      doc.fontSize(12).text(`Período: ${payroll.month}/${payroll.year}`);
      doc.text(`Status: ${payroll.status}`);
      doc.moveDown();

      // Table header
      const tableTop = doc.y;
      const colWidths = [150, 80, 80, 80, 80];
      const headers = ['Colaborador', 'Salário Bruto', 'Descontos', 'Salário Líquido', ''];

      let y = tableTop;
      doc.fontSize(10).font('Helvetica-Bold');

      headers.forEach((header, i) => {
        doc.text(header, 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
          width: colWidths[i],
          align: 'left',
        });
      });

      y += 20;
      doc.font('Helvetica');

      // Table rows
      payroll.items.forEach((item) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc.text(item.collaborator.full_name, 50, y, { width: colWidths[0] });
        doc.text(this.formatCurrency(Number(item.gross_salary)), 50 + colWidths[0], y, {
          width: colWidths[1],
        });
        doc.text(this.formatCurrency(Number(item.discounts)), 50 + colWidths.slice(0, 2).reduce((a, b) => a + b, 0), y, {
          width: colWidths[2],
        });
        doc.text(this.formatCurrency(Number(item.net_salary)), 50 + colWidths.slice(0, 3).reduce((a, b) => a + b, 0), y, {
          width: colWidths[3],
        });

        y += 20;
      });

      // Totals
      y += 10;
      doc.font('Helvetica-Bold');
      doc.text('Totais:', 50, y);
      y += 20;
      doc.text(`Total Bruto: ${this.formatCurrency(Number(payroll.total_gross))}`, 50, y);
      doc.text(`Total Descontos: ${this.formatCurrency(Number(payroll.total_discounts))}`, 50, y + 15);
      doc.text(`Total Líquido: ${this.formatCurrency(Number(payroll.total_net))}`, 50, y + 30);

      // Footer
      doc.fontSize(8).font('Helvetica');
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 50, 750, {
        align: 'center',
      });

      doc.end();
    });
  }

  async generateTimesheetPdf(
    timesheetId: string,
    type: 'hospital' | 'sad',
    cooperativeId: string,
  ): Promise<Buffer> {
    let timesheet: any;

    if (type === 'hospital') {
      timesheet = await this.prisma.timeSheetHospital.findFirst({
        where: {
          id: timesheetId,
          collaborator: { cooperative_id: cooperativeId },
        },
        include: {
          collaborator: {
            select: {
              id: true,
              full_name: true,
              cpf: true,
            },
          },
        },
      });
    } else {
      timesheet = await this.prisma.timeSheetSad.findFirst({
        where: {
          id: timesheetId,
          collaborator: { cooperative_id: cooperativeId },
        },
        include: {
          collaborator: {
            select: {
              id: true,
              full_name: true,
              cpf: true,
            },
          },
          patient: true,
        },
      });
    }

    if (!timesheet) {
      throw new Error('Timesheet not found');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('CoopElos', { align: 'center' });
      doc.fontSize(14).text(type === 'hospital' ? 'Ponto Hospitalar' : 'Ponto SAD', { align: 'center' });
      doc.moveDown();

      // Collaborator info
      doc.fontSize(12).text(`Colaborador: ${timesheet.collaborator.full_name}`);
      doc.text(`CPF: ${timesheet.collaborator.cpf}`);
      doc.text(`Período: ${timesheet.month}/${timesheet.year}`);
      doc.moveDown();

      if (type === 'hospital') {
        // Hospital timesheet - matrix format
        doc.fontSize(10).font('Helvetica-Bold').text('Matriz de Escalas:');
        doc.font('Helvetica');

        const scheduleData = timesheet.schedule_data as any;
        if (scheduleData) {
          let y = doc.y;
          Object.entries(scheduleData).forEach(([day, code]) => {
            if (y > 750) {
              doc.addPage();
              y = 50;
            }
            doc.text(`Dia ${day}: ${code}`, 50, y);
            y += 15;
          });
        }

        doc.moveDown();
        doc.font('Helvetica-Bold').text(`Total de Horas: ${timesheet.total_hours}`);
      } else {
        // SAD timesheet
        doc.fontSize(10).font('Helvetica-Bold').text('Paciente:');
        doc.font('Helvetica').text(timesheet.patient?.name || '-');
        doc.moveDown();

        doc.font('Helvetica-Bold').text('Turnos:');
        doc.font('Helvetica');
        doc.text(`Manhã: ${timesheet.morning_shifts}`);
        doc.text(`Noite: ${timesheet.night_shifts}`);
        doc.text(`6x1: ${timesheet.six_by_one}`);
        doc.moveDown();

        doc.font('Helvetica-Bold').text('Valores:');
        doc.font('Helvetica');
        doc.text(`Valor Bruto: ${this.formatCurrency(Number(timesheet.gross_value))}`);
        doc.text(`Ajuda de Custo: ${this.formatCurrency(Number(timesheet.meal_allowance))}`);
        doc.text(`Cota: ${this.formatCurrency(Number(timesheet.quota_value))}`);
        doc.text(`Impostos: ${this.formatCurrency(Number(timesheet.tax_value))}`);
        doc.text(`Valor Líquido: ${this.formatCurrency(Number(timesheet.net_value))}`);
      }

      // Footer
      doc.fontSize(8).font('Helvetica');
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 50, 750, {
        align: 'center',
      });

      doc.end();
    });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
