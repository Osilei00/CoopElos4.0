// Importa os 189 cooperados do CSV usando Prisma
// ------------------------------------------------
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const COOP_ID = '895e1dca-1cb0-4368-89b6-5d535f44c303';
const CSV_PATH = __dirname + '\\..\\..\\docs\\Cooperados_2026-05-25_12-57-11.csv';

function mapStatus(v){
  if(v==='Casado(a)') return 'married';
  if(v==='Solteiro(a)') return 'single';
  if(v==='Divorciado(a)') return 'divorced';
  return 'other';
}
function mapGender(v){
  if(v==='Masculino') return 'masculine';
  if(v==='Feminino') return 'feminine';
  return null;
}
function parseDate(v){
  if(!v) return null;
  const [d,m,y] = v.split('/');
  if(!d||!m||!y) return null;
  return new Date(`${y}-${m}-${d}`);
}

async function main(){
  const csv = fs.readFileSync(CSV_PATH,'utf-8');
  const records = parse(csv, {columns:true, skip_empty_lines:true});

  await prisma.$transaction(async tx => {
    await tx.cooperado.deleteMany({});
    await tx.adhesionForm.deleteMany({});
    for(const rec of records){
      const nomeCooperado = rec['Nome do Cooperado'];
      if(!nomeCooperado) continue;
      await tx.cooperado.create({
        data:{
          cooperative_id: COOP_ID,
          nome_cooperado: nomeCooperado,
          cpf_cooperado: rec['CPF Cooperado'],
          rg: rec['RG'],
          nascimento: parseDate(rec['Nascimento']),
          estado_civil: mapStatus(rec['Estado Civil']),
          escolaridade: rec['Escolaridade'],
          nome_pai: rec['Nome do Pai'],
          nome_mae: rec['Nome do Mãe'],
          celular_cooperado: rec['Celular Cooperado'],
          telefone_residencial: rec['Telefone Residencial'],
          email_cooperado: rec['E-mail coop'],
          endereco: rec['Endereço'],
          bairro: rec['Bairro'],
          complemento: rec['Complemento'],
          cep: rec['CEP'],
          cidade: rec['Cidade'],
          estado: rec['Estado'],
          sexo: mapGender(rec['Sexo']),
          data_admissao: parseDate(rec['Data de admissão']),
          status: 'active',
        }
      });
    }
  });
  console.log('✅ Importação concluída. Registrados', records.length, 'cooperados.');
}

main().catch(err=>{console.error(err);process.exit(1);});
