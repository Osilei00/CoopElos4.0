import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const cooperative = await prisma.cooperative.findFirst();
  if (!cooperative) {
    console.error('Nenhuma cooperativa encontrada');
    return;
  }

  const defaultPassword = 'teste123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const testUsers = [
    { id: 'test-rh-001', name: 'Maria RH', email: 'rh@coopelos.com.br', role: 'rh' },
    { id: 'test-dp-001', name: 'Pedro DP', email: 'dp@coopelos.com.br', role: 'dp' },
    { id: 'test-viewer-001', name: 'João Viewer', email: 'viewer@coopelos.com.br', role: 'viewer' },
  ];

  for (const tu of testUsers) {
    const existing = await prisma.user.findFirst({ where: { email: tu.email } });
    if (existing) {
      console.log(`Usuário ${tu.email} já existe`);
      continue;
    }
    await prisma.user.create({
      data: {
        id: tu.id,
        name: tu.name,
        email: tu.email,
        username: tu.email.split('@')[0],
        password_hash: passwordHash,
        role: tu.role as any,
        cooperative_id: cooperative.id,
        is_active: true,
      },
    });
    console.log(`✅ Criado: ${tu.email} (${tu.role}) - senha: ${defaultPassword}`);
  }

  const allUsers = await prisma.user.findMany({ select: { email: true, role: true, is_active: true } });
  console.log('\n=== Todos os usuários ===');
  allUsers.forEach((u) => console.log(`  ${u.email} - ${u.role} ${u.is_active ? '✓' : '✗'}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
