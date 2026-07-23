const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('Testing login...');
    
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email: 'admin@coopelos.com.br',
        is_active: true,
      },
    });
    
    console.log('User found:', user ? user.id : 'NOT FOUND');
    console.log('User cooperative_id:', user?.cooperative_id);
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    // Verify password
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare('coopelos2026', user.password_hash);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.error('Invalid password');
      return;
    }
    
    // Find cooperative
    const cooperative = await prisma.cooperative.findFirst();
    console.log('Cooperative found:', cooperative ? cooperative.id : 'NOT FOUND');
    
    if (!cooperative) {
      console.error('No cooperative configured');
      return;
    }
    
    console.log('Login would succeed!');
    console.log('Session data:', {
      userId: user.id,
      cooperativeId: cooperative.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
    
  } catch (error) {
    console.error('Login test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
