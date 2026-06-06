// Importa os 189 colaboradores do CSV usando Prisma
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
    await tx.collaborator.deleteMany({});
    await tx.adhesionForm.deleteMany({});
    for(const rec of records){
      const fullName = rec['Nome do Cooperado'];
      if(!fullName) continue;
      await tx.collaborator.create({
        data:{
          cooperative_id: COOP_ID,
          full_name: fullName,
          cpf: rec['CPF Cooperado'],
          rg: rec['RG'],
          birth_date: parseDate(rec['Nascimento']),
          marital_status: mapStatus(rec['Estado Civil']),
          education_level: rec['Escolaridade'],
          father_name: rec['Nome do Pai'],
          mother_name: rec['Nome do Mãe'],
          mobile_phone: rec['Celular Cooperado'],
          home_phone: rec['Telefone Residencial'],
          email: rec['E-mail coop'],
          address: rec['Endereço'],
          neighborhood: rec['Bairro'],
          address_complement: rec['Complemento'],
          postal_code: rec['CEP'],
          city: rec['Cidade'],
          state: rec['Estado'],
          gender: mapGender(rec['Sexo']),
          admission_date: parseDate(rec['Data de admissão']),
          status: 'active',
        }
      });
    }
  });
  console.log('✅ Importação concluída. Registrados', records.length, 'cooperados.');
}

main().catch(err=>{console.error(err);process.exit(1);});
