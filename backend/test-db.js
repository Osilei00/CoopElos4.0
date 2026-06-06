require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

async function test() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  
  try {
    const result = await prisma.cooperative.findMany();
    console.log('Cooperatives:', result);
  } catch (e) {
    console.error('Error:', e.message);
    console.error('Full error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
