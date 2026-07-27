import { PrismaClient } from '@prisma/client';
const p = new PrismaClient({ datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5432/coopelos' } } });
p.$connect()
  .then(() => { console.log('DB CONNECTED'); return p.$disconnect(); })
  .catch((e: any) => console.log('ERROR:', e.message));
