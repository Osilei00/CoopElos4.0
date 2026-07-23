const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
p.user.findMany({ select: { id: true, name: true, email: true, role: true, is_active: true } })
  .then((u) => { console.log(JSON.stringify(u, null, 2)); return p.$disconnect(); })
  .catch((e) => { console.error(e); return p.$disconnect(); });
