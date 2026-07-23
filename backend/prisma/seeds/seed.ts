import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

interface CSVRow {
  'Nome do Cooperado': string;
  'CPF Cooperado': string;
  'RG': string;
  'Nascimento': string;
  'Sexo': string;
  'Estado Civil': string;
  'Celular Cooperado': string;
  'Celular Indicador': string;
  'E-mail coop': string;
  'E-mail Gestor': string;
  'E-mail Indicador': string;
  'Endereço': string;
  'Bairro': string;
  'Complemento': string;
  'Cidade': string;
  'Estado': string;
  'CEP': string;
  'Telefone Residencial': string;
  'Matricula': string;
  'Data de admissão': string;
  'Data de Cadastro': string;
  'Cargo Contratado': string;
  'Cargo Pretendido': string;
  'Salário': string;
  'Banco': string;
  'Agencia': string;
  'Conta Corrente/Poupança': string;
  'PIX': string;
  'Ativ Coop DropA': string;
  'Ativ Coop DropB': string;
  'Atividades Cooperados': string;
  'Outras Ativd Profissionais': string;
  'Escolaridade': string;
  'Nacionalidade': string;
  'Naturalidade': string;
  'NIS/PIS': string;
  'CTPS / Série': string;
  'Nome do Pai': string;
  'Nome da Mãe': string;
  'Nome do Cônjuge': string;
  'CPF Cônjuge': string;
  'Nome Indicação': string;
  'Empresa/Trabalho': string;
  'Carteira de Registro': string;
  'Atestados técnicos': string;
  'Currículo Profissional': string;
  'Descrição Sucinta': string;
  'Imagem Cooperado': string;
  'Capital Social': string;
  'Valor Acumulado': string;
  'Valor Atual': string;
  'Valor Integralizado': string;
  'Valor VAR': string;
  'Local de Cadastro': string;
  'Parcelas': string;
  'em aberto': string;
  '1º Venc_Cooperados'?: string;
  'unique id'?: string;
  'Slug'?: string;
  'Creation Date'?: string;
  'Modified Date'?: string;
  'Creator'?: string;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCSV(filePath: string): CSVRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());

  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    rows.push(row as CSVRow);
  }

  return rows;
}

function convertDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  try {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (e) {
    console.warn(`Could not parse date: ${dateStr}`);
    return null;
  }
}

async function main() {
  console.log('🌱 Starting seed...');

  const csvPath = path.join(__dirname, '../../../docs/Cooperados_2026-05-25_12-57-11.csv');
  const rows = parseCSV(csvPath);

  console.log(`📄 Found ${rows.length} rows in CSV`);

  let cooperative = await prisma.cooperative.findFirst({
    where: { cnpj: '00.000.000/0001-00' },
  });

  if (cooperative) {
    console.log(`🏢 Cooperative already exists: ${cooperative.id}`);
  } else {
    cooperative = await prisma.cooperative.create({
      data: {
        name: 'CoopElos 4.0',
        cnpj: '00.000.000/0001-00',
      },
    });
    console.log(`🏢 Created cooperative: ${cooperative.id}`);
  }

  let user = await prisma.user.findFirst({
    where: { email: 'admin@coopelos.com.br' },
  });

  if (user) {
    console.log(`👤 Admin user already exists: ${user.id}`);
  } else {
    const defaultPassword = 'coopelos2026';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    user = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@coopelos.com.br',
        password_hash: passwordHash,
        role: 'admin',
      },
    });
    console.log(`🔑 Default login: admin@coopelos.com.br / ${defaultPassword}`);
    console.log(`👤 Created user: ${user.id}`);
  }

  let cooperadoCount = 0;
  let cooperadoNumber = 1;

  for (const row of rows) {
    const nomeCooperado = row['Nome do Cooperado']?.trim();
    const cpfCooperado = row['CPF Cooperado']?.trim();

    if (!nomeCooperado && !cpfCooperado) {
      continue;
    }

    try {
      const uniqueId = row['unique id']?.trim() || null;
      if (uniqueId) {
        const existing = await prisma.cooperado.findFirst({
          where: { unique_id_bubble: uniqueId },
        });
        if (existing) {
          console.log(`⏭️  Cooperado already exists: ${nomeCooperado}`);
          continue;
        }
      }

      const cooperado = await prisma.cooperado.create({
        data: {
          cooperative_id: cooperative.id,
          cooperado_number: cooperadoNumber,
          status: 'active',

          venc_cooperados: row['1º Venc_Cooperados']?.trim() || null,
          matricula: row['Matricula']?.trim() || null,
          unique_id_bubble: uniqueId,
          slug: row['Slug']?.trim() || null,

          nome_cooperado: nomeCooperado || null,
          cpf_cooperado: cpfCooperado || null,
          rg: row['RG']?.trim() || null,
          nis_pis: row['NIS/PIS']?.trim() || null,
          ctps_serie: row['CTPS / Série']?.trim() || null,
          nacionalidade: row['Nacionalidade']?.trim() || null,
          naturalidade: row['Naturalidade']?.trim() || null,
          nascimento: convertDate(row['Nascimento']?.trim() || ''),
          sexo: row['Sexo']?.trim() || null,
          estado_civil: row['Estado Civil']?.trim() || null,
          escolaridade: row['Escolaridade']?.trim() || null,
          nome_pai: row['Nome do Pai']?.trim() || null,
          nome_mae: row['Nome da Mãe']?.trim() || null,
          nome_conjuge: row['Nome do Cônjuge']?.trim() || null,
          cpf_conjuge: row['CPF Cônjuge']?.trim() || null,

          celular_cooperado: row['Celular Cooperado']?.trim() || null,
          telefone_residencial: row['Telefone Residencial']?.trim() || null,
          email_cooperado: row['E-mail coop']?.trim() || null,
          celular_indicador: row['Celular Indicador']?.trim() || null,
          email_indicador: row['E-mail Indicador']?.trim() || null,
          nome_indicacao: row['Nome Indicação']?.trim() || null,
          email_gestor: row['E-mail Gestor']?.trim() || null,

          endereco: row['Endereço']?.trim() || null,
          bairro: row['Bairro']?.trim() || null,
          complemento: row['Complemento']?.trim() || null,
          cep: row['CEP']?.trim() || null,
          cidade: row['Cidade']?.trim() || null,
          estado: row['Estado']?.trim() || null,

          empresa_trabalho: row['Empresa/Trabalho']?.trim() || null,
          cargo_pretendido: row['Cargo Pretendido']?.trim() || null,
          cargo_contratado: row['Cargo Contratado']?.trim() || null,
          salario: row['Salário']?.trim() || null,
          data_admissao: convertDate(row['Data de admissão']?.trim() || ''),
          data_cadastro: convertDate(row['Data de Cadastro']?.trim() || ''),

          ativ_coop_dropa: row['Ativ Coop DropA']?.trim() || null,
          ativ_coop_dropb: row['Ativ Coop DropB']?.trim() || null,
          atividades_cooperados: row['Atividades Cooperados']?.trim() || null,
          outras_ativd_profissionais: row['Outras Ativd Profissionais']?.trim() || null,

          banco: row['Banco']?.trim() || null,
          agencia: row['Agencia']?.trim() || null,
          conta_corrente: row['Conta Corrente/Poupança']?.trim() || null,
          pix: row['PIX']?.trim() || null,
          capital_social: row['Capital Social']?.trim() || null,

          carteira_registro: row['Carteira de Registro']?.trim() || null,
          atestados_tecnicos: row['Atestados técnicos']?.trim() || null,
          curriculo_profissional: row['Currículo Profissional']?.trim() || null,
          descricao_sucinta: row['Descrição Sucinta']?.trim() || null,

          valor_acumulado: row['Valor Acumulado']?.trim() || null,
          valor_atual: row['Valor Atual']?.trim() || null,
          valor_integralizado: row['Valor Integralizado']?.trim() || null,
          valor_var: row['Valor VAR']?.trim() || null,

          parcelas: row['Parcelas']?.trim() || null,
          em_aberto: row['em aberto']?.trim() || null,
          local_cadastro: row['Local de Cadastro']?.trim() || null,
          imagem_cooperado: row['Imagem Cooperado']?.trim() || null,

          creation_date: convertDate(row['Creation Date']?.trim() || ''),
          modified_date: convertDate(row['Modified Date']?.trim() || ''),
          creator: row['Creator']?.trim() || null,
        },
      });

      const otherActivities = row['Atividades Cooperados']?.trim()
        ? row['Atividades Cooperados'].split(',').map(a => a.trim()).join(', ')
        : null;

      await prisma.adhesionForm.create({
        data: {
          id: cooperado.id,
          cooperative_id: cooperative.id,
          cooperado_id: cooperado.id,

          venc_cooperados: row['1º Venc_Cooperados']?.trim() || null,
          matricula: row['Matricula']?.trim() || null,
          unique_id_bubble: uniqueId,
          slug: row['Slug']?.trim() || null,

          nome_cooperado: nomeCooperado || null,
          cpf_cooperado: cpfCooperado || null,
          rg: row['RG']?.trim() || null,
          nis_pis: row['NIS/PIS']?.trim() || null,
          ctps_serie: row['CTPS / Série']?.trim() || null,
          nacionalidade: row['Nacionalidade']?.trim() || null,
          naturalidade: row['Naturalidade']?.trim() || null,
          nascimento: convertDate(row['Nascimento']?.trim() || ''),
          sexo: row['Sexo']?.trim() || null,
          estado_civil: row['Estado Civil']?.trim() || null,
          escolaridade: row['Escolaridade']?.trim() || null,
          nome_pai: row['Nome do Pai']?.trim() || null,
          nome_mae: row['Nome da Mãe']?.trim() || null,
          nome_conjuge: row['Nome do Cônjuge']?.trim() || null,
          cpf_conjuge: row['CPF Cônjuge']?.trim() || null,

          celular_cooperado: row['Celular Cooperado']?.trim() || null,
          telefone_residencial: row['Telefone Residencial']?.trim() || null,
          email_cooperado: row['E-mail coop']?.trim() || null,
          celular_indicador: row['Celular Indicador']?.trim() || null,
          email_indicador: row['E-mail Indicador']?.trim() || null,
          nome_indicacao: row['Nome Indicação']?.trim() || null,
          email_gestor: row['E-mail Gestor']?.trim() || null,

          endereco: row['Endereço']?.trim() || null,
          bairro: row['Bairro']?.trim() || null,
          complemento: row['Complemento']?.trim() || null,
          cep: row['CEP']?.trim() || null,
          cidade: row['Cidade']?.trim() || null,
          estado: row['Estado']?.trim() || null,

          empresa_trabalho: row['Empresa/Trabalho']?.trim() || null,
          cargo_pretendido: row['Cargo Pretendido']?.trim() || null,
          cargo_contratado: row['Cargo Contratado']?.trim() || null,
          salario: row['Salário']?.trim() || null,
          data_admissao: convertDate(row['Data de admissão']?.trim() || ''),
          data_cadastro: convertDate(row['Data de Cadastro']?.trim() || ''),

          ativ_coop_dropa: row['Ativ Coop DropA']?.trim() || null,
          ativ_coop_dropb: row['Ativ Coop DropB']?.trim() || null,
          atividades_cooperados: otherActivities,
          outras_ativd_profissionais: row['Outras Ativd Profissionais']?.trim() || null,

          banco: row['Banco']?.trim() || null,
          agencia: row['Agencia']?.trim() || null,
          conta_corrente: row['Conta Corrente/Poupança']?.trim() || null,
          pix: row['PIX']?.trim() || null,
          capital_social: row['Capital Social']?.trim() || null,

          carteira_registro: row['Carteira de Registro']?.trim() || null,
          atestados_tecnicos: row['Atestados técnicos']?.trim() || null,
          curriculo_profissional: row['Currículo Profissional']?.trim() || null,
          descricao_sucinta: row['Descrição Sucinta']?.trim() || null,

          valor_acumulado: row['Valor Acumulado']?.trim() || null,
          valor_atual: row['Valor Atual']?.trim() || null,
          valor_integralizado: row['Valor Integralizado']?.trim() || null,
          valor_var: row['Valor VAR']?.trim() || null,

          parcelas: row['Parcelas']?.trim() || null,
          em_aberto: row['em aberto']?.trim() || null,
          local_cadastro: row['Local de Cadastro']?.trim() || null,
          imagem_cooperado: row['Imagem Cooperado']?.trim() || null,

          creation_date: convertDate(row['Creation Date']?.trim() || ''),
          modified_date: convertDate(row['Modified Date']?.trim() || ''),
          creator: row['Creator']?.trim() || null,
        },
      });

      cooperadoCount++;
      cooperadoNumber++;
      console.log(`✅ Created cooperado: ${nomeCooperado}`);

    } catch (error) {
      console.error(`❌ Error creating cooperado ${nomeCooperado}:`, error);
    }
  }

  console.log(`\n🎉 Seed completed! Created ${cooperadoCount} cooperados`);

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
