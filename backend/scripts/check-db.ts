import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  console.log('Tabelas existentes:');
  tables.forEach((t) => console.log(`  - ${t.table_name}`));
  
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, is_active: true } });
  console.log('\nUsuários:');
  users.forEach((u) => console.log(`  - ${u.email} (${u.role}) ${u.is_active ? 'ativo' : 'inativo'}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
