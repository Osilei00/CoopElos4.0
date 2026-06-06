// Importa dados do CSV para ficha_cooperado_form
// ------------------------------------------------
require('dotenv/config');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
const COOP_ID = '895e1dca-1cb0-4368-89b6-5d535f44c303';
const CSV_PATH = __dirname + '\\..\\..\\docs\\Cooperados_2026-05-25_12-57-11.csv';

function parseDate(v) {
  if (!v || !v.trim()) return null;
  const trimmed = v.trim();
  
  try {
    // Formato americano: "Jun 9, 2024 12:42 pm" ou "Jun 12, 2024 10:01 am"
    if (trimmed.includes(',')) {
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) return d;
    }
    
    // Formato brasileiro: "02/06/2024"
    if (trimmed.includes('/')) {
      const [day, month, year] = trimmed.split('/');
      if (day && month && year && year.length === 4) {
        const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(d.getTime())) return d;
      }
    }
    
    // Tenta parse direto
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  } catch (e) {
    // Ignora erro
  }
  return null;
}

async function main() {
  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  console.log(`📋 Total de registros no CSV: ${records.length}`);

  await prisma.$transaction(async (tx) => {
    // Limpa tabela existente
    const deleted = await tx.fichaCooperadoForm.deleteMany({});
    console.log(`🗑️  Registros antigos removidos: ${deleted.count}`);

    let imported = 0;
    let skipped = 0;

    for (const rec of records) {
      const nomeCooperado = rec['Nome do Cooperado']?.trim();
      
      // Pula linhas vazias ou sem nome
      if (!nomeCooperado) {
        skipped++;
        continue;
      }

      // Pega o unique_id do Bubble (coluna "unique id")
      const uniqueIdBubble = rec['unique id']?.trim() || null;

      await tx.fichaCooperadoForm.create({
        data: {
          cooperative_id: COOP_ID,
          
          // Dados de identificação
          venc_cooperados: rec['1º Venc_Cooperados']?.trim() || null,
          matricula: rec['Matricula']?.trim() || null,
          unique_id_bubble: uniqueIdBubble,
          slug: rec['Slug']?.trim() || null,

          // Dados pessoais
          nome_cooperado: nomeCooperado,
          cpf_cooperado: rec['CPF Cooperado']?.trim() || null,
          rg: rec['RG']?.trim() || null,
          nis_pis: rec['NIS/PIS']?.trim() || null,
          ctps_serie: rec['CTPS / Série']?.trim() || null,
          nacionalidade: rec['Nacionalidade']?.trim() || null,
          naturalidade: rec['Naturalidade']?.trim() || null,
          nascimento: parseDate(rec['Nascimento']),
          sexo: rec['Sexo']?.trim() || null,
          estado_civil: rec['Estado Civil']?.trim() || null,
          escolaridade: rec['Escolaridade']?.trim() || null,
          nome_pai: rec['Nome do Pai']?.trim() || null,
          nome_mae: rec['Nome do Mãe']?.trim() || null,
          nome_conjuge: rec['Nome do Cônjuge']?.trim() || null,
          cpf_conjuge: rec['CPF Cônjuge']?.trim() || null,

          // Contato
          celular_cooperado: rec['Celular Cooperado']?.trim() || null,
          telefone_residencial: rec['Telefone Residencial']?.trim() || null,
          email_cooperado: rec['E-mail coop']?.trim() || null,
          celular_indicador: rec['Celular Indicador']?.trim() || null,
          email_indicador: rec['E-mail Indicador']?.trim() || null,
          nome_indicacao: rec['Nome Indicação']?.trim() || null,
          email_gestor: rec['E-mail Gestor']?.trim() || null,

          // Endereço
          endereco: rec['Endereço']?.trim() || null,
          bairro: rec['Bairro']?.trim() || null,
          complemento: rec['Complemento']?.trim() || null,
          cep: rec['CEP']?.trim() || null,
          cidade: rec['Cidade']?.trim() || null,
          estado: rec['Estado']?.trim() || null,

          // Dados profissionais
          empresa_trabalho: rec['Empresa/Trabalho']?.trim() || null,
          cargo_pretendido: rec['Cargo Pretendido']?.trim() || null,
          cargo_contratado: rec['Cargo Contratado']?.trim() || null,
          salario: rec['Salário']?.trim() || null,
          data_admissao: parseDate(rec['Data de admissão']),
          data_cadastro: parseDate(rec['Data de Cadastro']),

          // Atividades
          ativ_coop_dropa: rec['Ativ Coop DropA']?.trim() || null,
          ativ_coop_dropb: rec['Ativ Coop DropB']?.trim() || null,
          atividades_cooperados: rec['Atividades Cooperados']?.trim() || null,
          outras_ativd_profissionais: rec['Outras Ativd Profissionais']?.trim() || null,

          // Dados bancários
          banco: rec['Banco']?.trim() || null,
          agencia: rec['Agencia']?.trim() || null,
          conta_corrente: rec['Conta Corrente/Poupança']?.trim() || null,
          pix: rec['PIX']?.trim() || null,
          capital_social: rec['Capital Social']?.trim() || null,

          // Documentos e checklist
          carteira_registro: rec['Carteira de Registro']?.trim() || null,
          atestados_tecnicos: rec['Atestados técnicos']?.trim() || null,
          curriculo_profissional: rec['Currículo Profissional']?.trim() || null,
          descricao_sucinta: rec['Descrição Sucinta']?.trim() || null,

          // Valores
          valor_acumulado: rec['Valor Acumulado']?.trim() || null,
          valor_atual: rec['Valor Atual']?.trim() || null,
          valor_integralizado: rec['Valor Integralizado']?.trim() || null,
          valor_var: rec['Valor VAR']?.trim() || null,

          // Outros
          parcelas: rec['Parcelas']?.trim() || null,
          em_aberto: rec['em aberto']?.trim() || null,
          local_cadastro: rec['Local de Cadastro']?.trim() || null,
          imagem_cooperado: rec['Imagem Cooperado']?.trim() || null,

          // Metadados Bubble
          creation_date: parseDate(rec['Creation Date']),
          modified_date: parseDate(rec['Modified Date']),
          creator: rec['Creator']?.trim() || null,
        }
      });
      imported++;
    }

    console.log(`✅ Importação concluída!`);
    console.log(`   📊 Registros importados: ${imported}`);
    console.log(`   ⏭️  Registros pulados (vazios): ${skipped}`);
  });
}

main()
  .catch(err => {
    console.error('❌ Erro na importação:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
