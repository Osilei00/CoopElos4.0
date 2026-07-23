import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLogin() {
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
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    console.log('User cooperative_id:', user.cooperative_id);
    
    // Verify password
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

testLogin();
