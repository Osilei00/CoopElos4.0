const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ 
    take: 5, 
    select: { id: true, name: true, email: true, role: true, is_active: true } 
  });
  console.log('Users:', JSON.stringify(users, null, 2));
  
  const cooperatives = await prisma.cooperative.findMany({ 
    take: 5, 
    select: { id: true, name: true } 
  });
  console.log('Cooperatives:', JSON.stringify(cooperatives, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
