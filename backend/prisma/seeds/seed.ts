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
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    console.warn(`Could not parse date: ${dateStr}`);
  }
  
  return null;
}

function convertSalary(salaryStr: string): number {
  if (!salaryStr) return 0;
  
  const cleaned = salaryStr.replace(/R\$/g, '').replace(/\./g, '').replace(',', '.').trim();
  const value = parseFloat(cleaned);
  
  return isNaN(value) ? 0 : value;
}

function convertState(stateStr: string): string | null {
  if (!stateStr) return null;
  
  const stateMap: Record<string, string> = {
    'PARÁ': 'PA', 'PA': 'PA', 'PARA': 'PA',
    'AMAZONAS': 'AM', 'AM': 'AM',
    'MARANHÃO': 'MA', 'MA': 'MA',
    'PARAÍBA': 'PB', 'PB': 'PB',
    'RIO GRANDE DO NORTE': 'RN', 'RN': 'RN',
    'CEARÁ': 'CE', 'CE': 'CE',
    'PERNAMBUCO': 'PE', 'PE': 'PE',
    'BAHIA': 'BA', 'BA': 'BA',
    'TOCANTINS': 'TO', 'TO': 'TO',
    'GOIÁS': 'GO', 'GO': 'GO',
    'MATO GROSSO': 'MT', 'MT': 'MT',
    'SÃO PAULO': 'SP', 'SP': 'SP',
    'RIO DE JANEIRO': 'RJ', 'RJ': 'RJ',
    'MINAS GERAIS': 'MG', 'MG': 'MG',
    'ESPÍRITO SANTO': 'ES', 'ES': 'ES',
  };
  
  const upper = stateStr.toUpperCase().trim();
  return stateMap[upper] || upper.substring(0, 2);
}

function convertGender(genderStr: string): 'masculine' | 'feminine' | null {
  if (!genderStr) return null;
  const lower = genderStr.toLowerCase().trim();
  if (lower === 'masculino') return 'masculine';
  if (lower === 'feminino') return 'feminine';
  return null;
}

function convertMaritalStatus(statusStr: string): 'single' | 'married' | 'divorced' | 'widowed' | 'other' | null {
  if (!statusStr) return null;
  const lower = statusStr.toLowerCase().trim();
  if (lower.includes('solteiro')) return 'single';
  if (lower.includes('casado')) return 'married';
  if (lower.includes('divorciado')) return 'divorced';
  if (lower.includes('viúva') || lower.includes('viuvo')) return 'widowed';
  return 'other';
}

async function main() {
  console.log('🌱 Starting seed...');
  
  const csvPath = path.join(__dirname, '../../../docs/Cooperados_2026-05-25_12-57-11.csv');
  const rows = parseCSV(csvPath);
  
  console.log(`📄 Found ${rows.length} rows in CSV`);
  
  // Check if cooperative already exists
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
  
  // Check if admin user already exists
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
        cooperative_id: cooperative.id,
      },
    });
    console.log(`🔑 Default login: admin@coopelos.com.br / ${defaultPassword}`);
    console.log(`👤 Created user: ${user.id}`);
  }
  
  let collaboratorCount = 0;
  let collaboratorNumber = 1;
  
  for (const row of rows) {
    const fullName = row['Nome do Cooperado']?.trim();
    const cpf = row['CPF Cooperado']?.trim();
    
    if (!fullName || !cpf) {
      console.log(`⏭️  Skipping row without name or CPF`);
      continue;
    }
    
    try {
      // Check if collaborator already exists
      const existing = await prisma.collaborator.findFirst({
        where: {
          cooperative_id: cooperative.id,
          cpf: cpf,
        },
      });
      
      if (existing) {
        console.log(`⏭️  Collaborator already exists: ${fullName}`);
        continue;
      }
      
      // Create collaborator
      const collaborator = await prisma.collaborator.create({
        data: {
          cooperative_id: cooperative.id,
          full_name: fullName,
          cpf: cpf,
          collaborator_number: collaboratorNumber,
          rg: row['RG']?.trim() || null,
          nis_pis: row['NIS/PIS']?.trim() || null,
          birth_date: convertDate(row['Nascimento']?.trim() || ''),
          birthplace: row['Naturalidade']?.trim() || null,
          nationality: row['Nacionalidade']?.trim() || 'BRASILEIRA',
          gender: convertGender(row['Sexo']?.trim() || ''),
          marital_status: convertMaritalStatus(row['Estado Civil']?.trim() || ''),
          education_level: row['Escolaridade']?.trim() || null,
          father_name: row['Nome do Pai']?.trim() || null,
          mother_name: row['Nome da Mãe']?.trim() || null,
          spouse_name: row['Nome do Cônjuge']?.trim() || null,
          spouse_cpf: row['CPF Cônjuge']?.trim() || null,
          mobile_phone: row['Celular Cooperado']?.trim() || null,
          home_phone: row['Telefone Residencial']?.trim() || null,
          email: row['E-mail coop']?.trim() || null,
          address: row['Endereço']?.trim() || null,
          neighborhood: row['Bairro']?.trim() || null,
          address_complement: row['Complemento']?.trim() || null,
          postal_code: row['CEP']?.trim() || null,
          city: row['Cidade']?.trim() || null,
          state: convertState(row['Estado']?.trim() || ''),
          status: 'active',
          ativo: true,
          admission_date: convertDate(row['Data de admissão']?.trim() || ''),
        },
      });
      
      // Create adhesion form
      const otherActivities = row['Atividades Cooperados']?.trim() 
        ? row['Atividades Cooperados'].split(',').map(a => a.trim())
        : [];
      
      await prisma.adhesionForm.create({
        data: {
          collaborator_id: collaborator.id,
          registration_number: parseInt(row['Matricula']?.trim() || '0') || null,
          registration_location: row['Local de Cadastro']?.trim() || null,
          registration_date: convertDate(row['Data de Cadastro']?.trim() || ''),
          referrer_name: row['Nome Indicação']?.trim() || null,
          referrer_phone: row['Celular Indicador']?.trim() || null,
          referrer_email: row['E-mail Indicador']?.trim() || null,
          bank_name: row['Banco']?.trim() || null,
          bank_branch: row['Agencia']?.trim() || null,
          bank_account: row['Conta Corrente/Poupança']?.trim() || null,
          pix_key: row['PIX']?.trim() || null,
          company_name: row['Empresa/Trabalho']?.trim() || null,
          desired_position: row['Cargo Pretendido']?.trim() || null,
          hired_position: row['Cargo Contratado']?.trim() || null,
          salary: convertSalary(row['Salário']?.trim() || ''),
          work_card: row['CTPS / Série']?.trim() || null,
          social_capital: convertSalary(row['Capital Social']?.trim() || ''),
          integrated_value: convertSalary(row['Valor Integralizado']?.trim() || ''),
          accumulated_value: convertSalary(row['Valor Acumulado']?.trim() || ''),
          current_value: convertSalary(row['Valor Atual']?.trim() || ''),
          primary_activity: row['Ativ Coop DropA']?.trim() || null,
          secondary_activity: row['Ativ Coop DropB']?.trim() || null,
          other_activities: otherActivities,
          other_professional_activities: row['Outras Ativd Profissionais']?.trim() || null,
          has_registration_card: row['Carteira de Registro']?.trim()?.toLowerCase() === 'sim',
          has_technical_certificates: row['Atestados técnicos']?.trim()?.toLowerCase() === 'sim',
          has_cv: row['Currículo Profissional']?.trim()?.toLowerCase() === 'sim',
          brief_description: row['Descrição Sucinta']?.trim() || null,
          installments: parseInt(row['Parcelas']?.trim() || '0') || null,
          manager_email: row['E-mail Gestor']?.trim() || null,
          profile_image_url: row['Imagem Cooperado']?.trim() || null,
          signature_url: null,
        },
      });
      
      collaboratorCount++;
      collaboratorNumber++;
      console.log(`✅ Created collaborator: ${fullName}`);
      
    } catch (error) {
      console.error(`❌ Error creating collaborator ${fullName}:`, error);
    }
  }
  
  // ============================================
  // FICHA COOPERADO FORM
  // ============================================
  console.log('\n📋 Importing ficha_cooperado_form...');
  let fichaCount = 0;
  let fichaNumber = 1;

  for (const row of rows) {
    const nomeCooperado = row['Nome do Cooperado']?.trim();
    const cpfCooperado = row['CPF Cooperado']?.trim();

    if (!nomeCooperado && !cpfCooperado) {
      continue;
    }

    try {
      const uniqueId = row['unique id']?.trim() || null;
      if (uniqueId) {
        const existingFicha = await prisma.fichaCooperadoForm.findFirst({
          where: { unique_id_bubble: uniqueId },
        });
        if (existingFicha) {
          continue;
        }
      }

      await prisma.fichaCooperadoForm.create({
        data: {
          cooperative_id: cooperative.id,
          cooperado_number: fichaNumber,
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

      fichaCount++;
      fichaNumber++;
    } catch (error) {
      console.error(`❌ Error creating ficha for ${nomeCooperado}:`, error);
    }
  }

  console.log(`✅ Created ${fichaCount} ficha_cooperado_form records`);

  console.log(`\n🎉 Seed completed! Created ${collaboratorCount} collaborators and ${fichaCount} fichas`);

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
