import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import PDFDocument from 'pdfkit';

@Injectable()
export class CooperadosService {
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

  async findNextNumber(cooperativeId: string) {
    const last = await this.prisma.cooperado.findFirst({
      where: { cooperative_id: cooperativeId },
      orderBy: { cooperado_number: 'desc' },
      select: { cooperado_number: true },
    });
    return (last?.cooperado_number || 0) + 1;
  }

  async create(cooperativeId: string, data: any) {
    const nextNumber = await this.findNextNumber(cooperativeId);

    const val = (v: any) => (v === '' ? null : v ?? null);

    return this.prisma.cooperado.create({
      data: {
        cooperative_id: cooperativeId,
        cooperado_number: nextNumber,
        status: val(data.status) || 'active',
        venc_cooperados: val(data.venc_cooperados),
        matricula: val(data.matricula),
        slug: val(data.slug),
        nome_cooperado: val(data.nome_cooperado),
        cpf_cooperado: val(data.cpf_cooperado),
        rg: val(data.rg),
        nis_pis: val(data.nis_pis),
        ctps_serie: val(data.ctps_serie),
        nacionalidade: val(data.nacionalidade),
        naturalidade: val(data.naturalidade),
        nascimento: val(data.nascimento),
        sexo: val(data.sexo),
        estado_civil: val(data.estado_civil),
        escolaridade: val(data.escolaridade),
        nome_pai: val(data.nome_pai),
        nome_mae: val(data.nome_mae),
        nome_conjuge: val(data.nome_conjuge),
        cpf_conjuge: val(data.cpf_conjuge),
        celular_cooperado: val(data.celular_cooperado),
        telefone_residencial: val(data.telefone_residencial),
        email_cooperado: val(data.email_cooperado),
        celular_indicador: val(data.celular_indicador),
        email_indicador: val(data.email_indicador),
        nome_indicacao: val(data.nome_indicacao),
        email_gestor: val(data.email_gestor),
        endereco: val(data.endereco),
        bairro: val(data.bairro),
        complemento: val(data.complemento),
        cep: val(data.cep),
        cidade: val(data.cidade),
        estado: val(data.estado),
        empresa_trabalho: val(data.empresa_trabalho),
        cargo_pretendido: val(data.cargo_pretendido),
        cargo_contratado: val(data.cargo_contratado),
        salario: val(data.salario),
        data_admissao: val(data.data_admissao),
        data_cadastro: val(data.data_cadastro),
        ativ_coop_dropa: val(data.ativ_coop_dropa),
        ativ_coop_dropb: val(data.ativ_coop_dropb),
        atividades_cooperados: val(data.atividades_cooperados),
        outras_ativd_profissionais: val(data.outras_ativd_profissionais),
        banco: val(data.banco),
        agencia: val(data.agencia),
        conta_corrente: val(data.conta_corrente),
        pix: val(data.pix),
        capital_social: val(data.capital_social),
        carteira_registro: val(data.carteira_registro),
        atestados_tecnicos: val(data.atestados_tecnicos),
        curriculo_profissional: val(data.curriculo_profissional),
        descricao_sucinta: val(data.descricao_sucinta),
        valor_acumulado: val(data.valor_acumulado),
        valor_atual: val(data.valor_atual),
        valor_integralizado: val(data.valor_integralizado),
        valor_var: val(data.valor_var),
        parcelas: val(data.parcelas),
        em_aberto: val(data.em_aberto),
        local_cadastro: val(data.local_cadastro),
        imagem_cooperado: val(data.imagem_cooperado),
        creator: val(data.creator),
      },
    });
  }

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.cooperado.findMany({
      where: {
        cooperative_id: cooperativeId,
        ...(search && {
          OR: [
            { nome_cooperado: { contains: search, mode: 'insensitive' } },
            { cpf_cooperado: { contains: search } },
            { email_cooperado: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        cooperado_number: true,
        nome_cooperado: true,
        cpf_cooperado: true,
        cargo_pretendido: true,
        cargo_contratado: true,
        status: true,
        cidade: true,
        celular_cooperado: true,
        email_cooperado: true,
        matricula: true,
      },
      orderBy: { cooperado_number: 'asc' },
    });
  }

  async findOne(id: string, cooperativeId: string) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return cooperado;
  }

  async update(id: string, cooperativeId: string, data: any) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return this.prisma.cooperado.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, cooperativeId: string) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: {
        id,
        cooperative_id: cooperativeId,
      },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return this.prisma.cooperado.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async getAdhesionForm(cooperadoId: string, cooperativeId: string) {
    return this.prisma.adhesionForm.findUnique({
      where: { cooperado_id: cooperadoId },
    });
  }

  async upsertAdhesionForm(
    cooperadoId: string,
    cooperativeId: string,
    data: any,
  ) {
    return this.prisma.adhesionForm.upsert({
      where: { cooperado_id: cooperadoId },
      create: {
        cooperado_id: cooperadoId,
        ...data,
      },
      update: data,
    });
  }

  // ============================================
  // DECLARAÇÃO DE ADESÃO
  // ============================================

  async uploadDeclaracaoAdesao(
    cooperadoId: string,
    cooperativeId: string,
    file: Express.Multer.File,
  ) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    const fileKey = `declaracoes/${cooperadoId}/${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return this.prisma.cooperado.update({
      where: { id: cooperadoId },
      data: { declaracao_adesao_url: url },
      select: { id: true, declaracao_adesao_url: true },
    });
  }

  async getDeclaracaoAdesao(cooperadoId: string, cooperativeId: string) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
      select: { id: true, declaracao_adesao_url: true },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return cooperado;
  }

  async generateDeclaracaoAdesaoPdf(cooperadoId: string, cooperativeId: string): Promise<Buffer> {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
      select: {
        nome_cooperado: true,
        cpf_cooperado: true,
        rg: true,
      },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    const cooperative = await this.prisma.cooperative.findUnique({
      where: { id: cooperativeId },
    });

    const nomeCooperado = cooperado.nome_cooperado || '';
    const cpf = cooperado.cpf_cooperado || '';
    const rg = cooperado.rg || '';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 72 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(16).font('Helvetica-Bold').text('DECLARAÇÃO DO COOPERADO', { align: 'center' });
      doc.moveDown(2);

      const cnpj = cooperative?.cnpj || '52.399.504/0001-20';

      doc.fontSize(11).font('Helvetica');
      doc.text(
        'Declaro, para todos os fins que, como trabalhador autônomo, optei livremente em participar da ' +
        'COOPERATIVA MULTIPROFISSIONAL DE PRESTAÇÃO DE SERVIÇOS – COOP ELOS, inscrita no CNPJ n° ' +
        cnpj +
        ', com sede na ' + (cooperative?.address || 'Travessa Dois de Junho, 1012, Aparecida, Santarém-PA') +
        ', onde exercerei minhas atividades sem vínculo empregatício, o que significa que, de acordo com a ' +
        'Lei nº 5.764, de 16 de dezembro de 1971, não tenho direito ao Fundo de Garantia por Tempo de Serviço – FGTS, ' +
        'ao 13º Salário e às demais verbas previstas na Consolidação das Leis do Trabalho – CLT. Declaro também que tenho ' +
        'pleno conhecimento dos meus Deveres e dos meus Direitos, descritos no estatuto social da cooperativa.',
        { lineGap: 8 },
      );

      doc.moveDown(5);

      doc.fontSize(12).font('Helvetica-Bold').text(nomeCooperado, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').text(`RG: ${rg}`);
      doc.text(`CPF: ${cpf}`);

      doc.end();
    });
  }

  // ============================================
  // RECIBO DE CONTRIBUIÇÃO
  // ============================================

  async uploadReciboContribuicao(
    cooperadoId: string,
    cooperativeId: string,
    file: Express.Multer.File,
  ) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    const fileKey = `recibos-contribuicao/${cooperadoId}/${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return this.prisma.cooperado.update({
      where: { id: cooperadoId },
      data: { recibo_contribuicao_url: url },
      select: { id: true, recibo_contribuicao_url: true },
    });
  }

  async getReciboContribuicao(cooperadoId: string, cooperativeId: string) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
      select: { id: true, recibo_contribuicao_url: true },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return cooperado;
  }

  // ============================================
  // DECLARAÇÃO DE QUITAÇÃO
  // ============================================

  async uploadDeclaracaoQuitacao(
    cooperadoId: string,
    cooperativeId: string,
    file: Express.Multer.File,
  ) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    const fileKey = `declaracoes-quitacao/${cooperadoId}/${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return this.prisma.cooperado.update({
      where: { id: cooperadoId },
      data: { declaracao_quitacao_url: url },
      select: { id: true, declaracao_quitacao_url: true },
    });
  }

  async getDeclaracaoQuitacao(cooperadoId: string, cooperativeId: string) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
      select: { id: true, declaracao_quitacao_url: true },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return cooperado;
  }

  // ============================================
  // CONTRACT HISTORY
  // ============================================

  async getContractHistory(cooperadoId: string, cooperativeId: string) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return this.prisma.contractHistory.findMany({
      where: { cooperado_id: cooperadoId },
      orderBy: { created_at: 'desc' },
    });
  }

  async createContractHistory(
    cooperadoId: string,
    cooperativeId: string,
    data: {
      cargo?: string;
      position?: string;
      salario?: number;
      salary?: number;
      data_admissao?: string;
      change_date?: string;
      motivo?: string;
      reason?: string;
    },
  ) {
    const cooperado = await this.prisma.cooperado.findFirst({
      where: { id: cooperadoId, cooperative_id: cooperativeId },
    });

    if (!cooperado) {
      throw new NotFoundException('Cooperado not found');
    }

    return this.prisma.contractHistory.create({
      data: {
        cooperado_id: cooperadoId,
        position: data.position || data.cargo,
        salary: data.salary || data.salario || 0,
        change_date: data.change_date ? new Date(data.change_date) : data.data_admissao ? new Date(data.data_admissao) : new Date(),
        reason: data.reason || data.motivo,
      },
    });
  }
}
