import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'admin@coopelos.com.br' },
  });
  
  console.log('User:', user);
  
  const coop = await prisma.cooperative.findFirst();
  console.log('Cooperative:', coop);
  
  if (user && coop && !user.cooperative_id) {
    await prisma.user.update({
      where: { id: user.id },
      data: { cooperative_id: coop.id },
    });
    console.log('Updated user with cooperative_id');
  }
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
