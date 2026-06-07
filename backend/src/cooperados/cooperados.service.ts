import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CooperadosService {
  constructor(private prisma: PrismaService) {}

  async findNextNumber(cooperativeId: string) {
    const last = await this.prisma.fichaCooperadoForm.findFirst({
      where: { cooperative_id: cooperativeId },
      orderBy: { cooperado_number: 'desc' },
      select: { cooperado_number: true },
    });
    return (last?.cooperado_number || 0) + 1;
  }

  async create(cooperativeId: string, data: any) {
    const nextNumber = await this.findNextNumber(cooperativeId);
    return this.prisma.fichaCooperadoForm.create({
      data: {
        cooperative_id: cooperativeId,
        cooperado_number: nextNumber,
        status: data.status || 'active',
        venc_cooperados: data.venc_cooperados || null,
        matricula: data.matricula || null,
        slug: data.slug || null,
        nome_cooperado: data.nome_cooperado || null,
        cpf_cooperado: data.cpf_cooperado || null,
        rg: data.rg || null,
        nis_pis: data.nis_pis || null,
        ctps_serie: data.ctps_serie || null,
        nacionalidade: data.nacionalidade || null,
        naturalidade: data.naturalidade || null,
        nascimento: data.nascimento || null,
        sexo: data.sexo || null,
        estado_civil: data.estado_civil || null,
        escolaridade: data.escolaridade || null,
        nome_pai: data.nome_pai || null,
        nome_mae: data.nome_mae || null,
        nome_conjuge: data.nome_conjuge || null,
        cpf_conjuge: data.cpf_conjuge || null,
        celular_cooperado: data.celular_cooperado || null,
        telefone_residencial: data.telefone_residencial || null,
        email_cooperado: data.email_cooperado || null,
        celular_indicador: data.celular_indicador || null,
        email_indicador: data.email_indicador || null,
        nome_indicacao: data.nome_indicacao || null,
        email_gestor: data.email_gestor || null,
        endereco: data.endereco || null,
        bairro: data.bairro || null,
        complemento: data.complemento || null,
        cep: data.cep || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        empresa_trabalho: data.empresa_trabalho || null,
        cargo_pretendido: data.cargo_pretendido || null,
        cargo_contratado: data.cargo_contratado || null,
        salario: data.salario || null,
        data_admissao: data.data_admissao || null,
        data_cadastro: data.data_cadastro || null,
        ativ_coop_dropa: data.ativ_coop_dropa || null,
        ativ_coop_dropb: data.ativ_coop_dropb || null,
        atividades_cooperados: data.atividades_cooperados || null,
        outras_ativd_profissionais: data.outras_ativd_profissionais || null,
        banco: data.banco || null,
        agencia: data.agencia || null,
        conta_corrente: data.conta_corrente || null,
        pix: data.pix || null,
        capital_social: data.capital_social || null,
        carteira_registro: data.carteira_registro || null,
        atestados_tecnicos: data.atestados_tecnicos || null,
        curriculo_profissional: data.curriculo_profissional || null,
        descricao_sucinta: data.descricao_sucinta || null,
        valor_acumulado: data.valor_acumulado || null,
        valor_atual: data.valor_atual || null,
        valor_integralizado: data.valor_integralizado || null,
        valor_var: data.valor_var || null,
        parcelas: data.parcelas || null,
        em_aberto: data.em_aberto || null,
        local_cadastro: data.local_cadastro || null,
        imagem_cooperado: data.imagem_cooperado || null,
        creator: data.creator || null,
      },
    });
  }

  async findAll(cooperativeId: string, search?: string) {
    return this.prisma.fichaCooperadoForm.findMany({
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
}
