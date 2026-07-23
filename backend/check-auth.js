const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Check cooperatives
  const cooperatives = await prisma.cooperative.findMany({ take: 3 });
  console.log('=== Cooperatives ===');
  console.log(JSON.stringify(cooperatives.map(c => ({ id: c.id, name: c.name })), null, 2));

  // Check users
  const users = await prisma.user.findMany({ 
    take: 3, 
    select: { id: true, name: true, email: true, role: true, is_active: true, cooperative_id: true } 
  });
  console.log('\n=== Users ===');
  console.log(JSON.stringify(users, null, 2));

  // Check if any user has a valid password hash
  if (users.length > 0) {
    const user = await prisma.user.findUnique({ where: { id: users[0].id } });
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`\n=== Password test for ${user.email} ===`);
    console.log(`Password "${testPassword}" valid: ${isValid}`);
  }

  // Check count
  const userCount = await prisma.user.count();
  const coopCount = await prisma.cooperative.count();
  console.log(`\n=== Counts ===`);
  console.log(`Users: ${userCount}`);
  console.log(`Cooperatives: ${coopCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
