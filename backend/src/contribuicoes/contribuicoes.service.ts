import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import PDFDocument from 'pdfkit';

@Injectable()
export class ContribuicoesService {
  private s3: S3Client;
  private bucketName: string;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.S3_BUCKET_NAME || 'coopelos-documents';
  }

  async create(
    cooperativeId: string,
    data: {
      cooperado_id: string;
      valor: number;
      mes: number;
      ano: number;
      tipo?: string;
      descricao?: string;
    },
  ) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: data.cooperado_id, cooperative_id: cooperativeId },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    const existing = await this.prisma.contribuicao.findUnique({
      where: { cooperado_id_mes_ano: { cooperado_id: data.cooperado_id, mes: data.mes, ano: data.ano } },
    });

    if (existing) {
      throw new BadRequestException('Contribuição já registrada para este mês');
    }

    const tipo = data.tipo || 'parcela';
    const defaultDescricao = tipo === 'quitacao'
      ? `Quitação quota parte - ${String(data.mes).padStart(2, '0')}/${data.ano}`
      : `Contribuição mensal - ${String(data.mes).padStart(2, '0')}/${data.ano}`;

    return this.prisma.contribuicao.create({
      data: {
        cooperative_id: cooperativeId,
        cooperado_id: data.cooperado_id,
        valor: data.valor,
        mes: data.mes,
        ano: data.ano,
        tipo,
        descricao: data.descricao || defaultDescricao,
      },
      include: { cooperado: { select: { nome_cooperado: true, cpf_cooperado: true } } },
    });
  }

  async findAll(
    cooperativeId: string,
    filters?: { mes?: number; ano?: number; cooperado_id?: string; status?: string; tipo?: string },
  ) {
    return this.prisma.contribuicao.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(filters?.mes && { mes: filters.mes }),
        ...(filters?.ano && { ano: filters.ano }),
        ...(filters?.cooperado_id && { cooperado_id: filters.cooperado_id }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.tipo && { tipo: filters.tipo }),
      },
      include: {
        cooperado: {
          select: { id: true, nome_cooperado: true, cpf_cooperado: true, cooperado_number: true },
        },
      },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }, { created_at: 'desc' }],
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const contribuicao = await this.prisma.contribuicao.findFirst({
      where: { id, cooperative_id: cooperativeId },
      include: {
        cooperado: {
          select: { id: true, nome_cooperado: true, cpf_cooperado: true, cooperado_number: true, celular_cooperado: true, email_cooperado: true },
        },
      },
    });

    if (!contribuicao) {
      throw new NotFoundException('Contribuição não encontrada');
    }

    return contribuicao;
  }

  async update(id: string, cooperativeId: string, data: { valor?: number; status?: string; descricao?: string }) {
    const contribuicao = await this.prisma.contribuicao.findFirst({
      where: { id, cooperative_id: cooperativeId },
    });

    if (!contribuicao) {
      throw new NotFoundException('Contribuição não encontrada');
    }

    return this.prisma.contribuicao.update({
      where: { id },
      data,
      include: { cooperado: { select: { nome_cooperado: true, cpf_cooperado: true } } },
    });
  }

  async remove(id: string, cooperativeId: string) {
    const contribuicao = await this.prisma.contribuicao.findFirst({
      where: { id, cooperative_id: cooperativeId },
    });

    if (!contribuicao) {
      throw new NotFoundException('Contribuição não encontrada');
    }

    return this.prisma.contribuicao.delete({ where: { id } });
  }

  async getStats(cooperativeId: string, ano: number) {
    const contribuicoes = await this.prisma.contribuicao.findMany({
      where: { cooperative_id: cooperativeId, ano },
    });

    const totalRecebido = contribuicoes.reduce((sum, c) => sum + Number(c.valor), 0);
    const totalRegistros = contribuicoes.length;
    const porMes = Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const doMes = contribuicoes.filter((c) => c.mes === mes);
      return {
        mes,
        total: doMes.reduce((sum, c) => sum + Number(c.valor), 0),
        quantidade: doMes.length,
      };
    });

    const cooperadosUnicos = new Set(contribuicoes.map((c) => c.cooperado_id)).size;

    return { totalRecebido, totalRegistros, cooperadosUnicos, porMes, ano };
  }

  async generateReciboPdf(contribuicaoId: string, cooperativeId: string): Promise<Buffer> {
    const contribuicao = await this.findOne(contribuicaoId, cooperativeId);
    const cooperative = await this.prisma.cooperative.findUnique({
      where: { id: cooperativeId },
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 60 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const valor = Number(contribuicao.valor);
      const valorFormatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      const mesAno = `${String(contribuicao.mes).padStart(2, '0')}/${contribuicao.ano}`;
      const nomeCooperado = contribuicao.cooperado.nome_cooperado || '';
      const cpf = contribuicao.cooperado.cpf_cooperado || '';

      doc.fontSize(14).font('Helvetica-Bold').text('RECIBO', 60, 60, { align: 'center', width: 472 });
      doc.font('Helvetica').fontSize(12).text('\u2399', 500, 60, { width: 30, align: 'right' });
      doc.x = 60;
      doc.moveDown(4);

      doc.fontSize(11).font('Helvetica');
      doc.text(`Recebemos de ${nomeCooperado}, inscrito(a) no CPF: ${cpf} o valor correspondente a ${valorFormatado} (${this.numeroPorExtenso(valor)}), referente ao pagamento integral de quota parte para associação na COOP ELOS.`, 60, doc.y, {
        width: 472,
        lineGap: 4,
      });

      doc.moveDown(1);
      doc.text('O presente recibo nada declara ao pagamento de outras despesas relacionadas a cooperativa.', 60, doc.y, { width: 472 });

      doc.moveDown(6);
      doc.text('Atenciosamente,', { align: 'center' });

      doc.moveDown(3);
      doc.text('___________________________________', { align: 'center' });
      doc.font('Helvetica-Bold').text('SETOR FINANCEIRO - COOP ELOS', { align: 'center' });

      doc.moveDown(2);
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#6B8E23')
        .text('COOPERATIVA MULTIPROFISSIONAL DE PRESTAÇÃO DE SERVIÇOS - COOP ELOS', { align: 'center' });
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      doc.text(`${cooperative?.address || 'Travessa Dois de Junho, 1012 – Aparecida, CEP. 68040-567'}`, { align: 'center' });
      doc.text(`Contato: ${cooperative?.phone || '(93) 99175-9484'} / E-mail: ${cooperative?.email || 'relacionamento@eloscooperativa.com.br'}`, { align: 'center' });
      doc.text(`CNPJ ${cooperative?.cnpj || '52.399.504/0001-20'}`, { align: 'center' });

      doc.end();
    });
  }

  async generateQuitacaoPdf(contribuicaoId: string, cooperativeId: string): Promise<Buffer> {
    const contribuicao = await this.findOne(contribuicaoId, cooperativeId);
    const cooperative = await this.prisma.cooperative.findUnique({
      where: { id: cooperativeId },
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 60 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const valor = Number(contribuicao.valor);
      const valorFormatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      const mesAno = `${String(contribuicao.mes).padStart(2, '0')}/${contribuicao.ano}`;
      const nomeCooperado = contribuicao.cooperado.nome_cooperado || '';
      const cpf = contribuicao.cooperado.cpf_cooperado || '';

      doc.fontSize(14).font('Helvetica-Bold').text('DECLARAÇÃO DE QUITAÇÃO', 60, 60, { align: 'center', width: 472 });
      doc.moveDown(4);

      doc.fontSize(11).font('Helvetica');
      doc.text(`A COOPERATIVA MULTIPROFISSIONAL DE PRESTAÇÃO DE SERVIÇOS – COOP ELOS, declara para os devidos fins que o(a) cooperado(a) ${nomeCooperado}, inscrito(a) no CPF sob o nº ${cpf}, encontra-se quite com a cooperative, referente ao pagamento de quota parte, no valor de R$ ${valorFormatado} (${this.numeroPorExtenso(valor)}), referente ao período de ${mesAno}.`, 60, doc.y, {
        width: 472,
        lineGap: 4,
      });

      doc.moveDown(1);
      doc.text('A presente declaração é emitida para que o(a) cooperado(a) faça uso que achar conveniente.', 60, doc.y, { width: 472 });

      doc.moveDown(6);
      doc.text('Aparecida/PA, ' + new Date().toLocaleDateString('pt-BR') + '.', { align: 'center' });

      doc.moveDown(3);
      doc.text('___________________________________', { align: 'center' });
      doc.font('Helvetica-Bold').text('PRESIDENTE DA COOP ELOS', { align: 'center' });

      doc.moveDown(2);
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#6B8E23')
        .text('COOPERATIVA MULTIPROFISSIONAL DE PRESTAÇÃO DE SERVIÇOS - COOP ELOS', { align: 'center' });
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      doc.text(`${cooperative?.address || 'Travessa Dois de Junho, 1012 – Aparecida, CEP. 68040-567'}`, { align: 'center' });
      doc.text(`Contato: ${cooperative?.phone || '(93) 99175-9484'} / E-mail: ${cooperative?.email || 'relacionamento@eloscooperativa.com.br'}`, { align: 'center' });
      doc.text(`CNPJ ${cooperative?.cnpj || '52.399.504/0001-20'}`, { align: 'center' });

      doc.end();
    });
  }

  async uploadRecibo(contribuicaoId: string, cooperativeId: string, file: Express.Multer.File) {
    const contribuicao = await this.findOne(contribuicaoId, cooperativeId);

    const fileKey = `recibos/${contribuicao.cooperado_id}/${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: fileKey });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return this.prisma.contribuicao.update({
      where: { id: contribuicaoId },
      data: { recibo_url: url },
      select: { id: true, recibo_url: true },
    });
  }

  private numeroPorExtenso(valor: number): string {
    const unidades = ['', 'UM', 'DOIS', 'TRÊS', 'QUATRO', 'CINCO', 'SEIS', 'SETE', 'OITO', 'NOVE'];
    const dezenas = ['', 'DEZ', 'VINTE', 'TRINTA', 'QUARENTA', 'CINQUENTA', 'SESSENTA', 'SETENTA', 'OITENTA', 'NOVENTA'];
    const centenas = ['', 'CEM', 'DUZENTOS', 'TREZENTOS', 'QUATROCENTOS', 'QUINHENTOS', 'SEISCENTOS', 'SETECENTOS', 'OITOCENTOS', 'NOVECENTOS'];
    const especiais: Record<number, string> = {
      10: 'DEZ', 11: 'ONZE', 12: 'DOZE', 13: 'TREZE', 14: 'QUATORZE',
      15: 'QUINZE', 16: 'DEZESSEIS', 17: 'DEZESSETE', 18: 'DEZOITO', 19: 'DEZENOVE',
    };

    if (valor === 0) return 'ZERO REAIS';

    const inteiro = Math.floor(valor);
    const centavos = Math.round((valor - inteiro) * 100);

    const convertGroup = (n: number): string => {
      if (n === 0) return '';
      let result = '';

      if (n >= 100) {
        if (n === 100) return 'CEM';
        result += centenas[Math.floor(n / 100)];
        if (n % 100 > 0) result += ' E ';
      }

      const resto = n % 100;
      if (resto >= 20) {
        result += dezenas[Math.floor(resto / 10)];
        if (resto % 10 > 0) result += ` E ${unidades[resto % 10]}`;
      } else if (resto >= 10) {
        result += especiais[resto] || '';
      } else if (resto > 0) {
        result += unidades[resto];
      }

      return result;
    };

    let resultado = '';

    if (inteiro >= 1000000) {
      const milhoes = Math.floor(inteiro / 1000000);
      if (milhoes === 1) resultado += 'UM MILHÃO';
      else resultado += `${convertGroup(milhoes)} MILHÕES`;
      const restoMilhoes = inteiro % 1000000;
      if (restoMilhoes > 0) resultado += ' E ';
    }

    const restoFinal = inteiro >= 1000000 ? inteiro % 1000000 : inteiro;

    if (restoFinal >= 1000) {
      const milhares = Math.floor(restoFinal / 1000);
      if (milhares === 1) resultado += 'MIL';
      else resultado += `${convertGroup(milhares)} MIL`;
      const restoMilhares = restoFinal % 1000;
      if (restoMilhares > 0) resultado += ' E ';
    }

    const restoUnidades = restoFinal >= 1000 ? restoFinal % 1000 : restoFinal;
    if (restoUnidades > 0) {
      resultado += convertGroup(restoUnidades);
    }

    resultado += inteiro === 1 ? ' REAL' : ' REAIS';

    if (centavos > 0) {
      resultado += ` E ${centavos}/100`;
    }

    return resultado;
  }
}
