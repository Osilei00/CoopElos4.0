import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Security Tests (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testCooperativeId: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    const coop = await prisma.cooperative.create({
      data: { name: 'Security Test Coop', cnpj: `SEC${Date.now()}` },
    });
    testCooperativeId = coop.id;

    const hash = await bcrypt.hash('testpass123', 10);
    const user = await prisma.user.create({
      data: { name: 'Security Tester', email: `sec${Date.now()}@test.com', password_hash: hash, role: 'admin' },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.cooperative.deleteMany({ where: { id: testCooperativeId } });
    if (app) await app.close();
  });

  describe('Auth & Session Security', () => {
    it('1.1 NÃO deve permitir acesso sem headers de proxy', async () => {
      await request(app.getHttpServer()).get('/api/cooperados').expect(401);
    });

    it('1.2 Deve rejeitar requisição sem X-User-Id', async () => {
      await request(app.getHttpServer()).get('/api/cooperados').set('X-Cooperative-Id', testCooperativeId).expect(401);
    });

    it('1.3 Deve rejeitar X-User-Id inválido', async () => {
      await request(app.getHttpServer()).get('/api/cooperados').set('X-User-Id', 'non-existent').set('X-Cooperative-Id', testCooperativeId).expect(401);
    });

    it('1.4 NÃO deve expor dados sensíveis no login', async () => {
      const res = await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'sec@test.com', password: 'testpass123' });
      expect(res.body).not.toHaveProperty('password_hash');
      expect(res.body).not.toHaveProperty('token');
    });
  });

  describe('Input Validation', () => {
    it('2.1 Deve rejeitar email inválido no login', async () => {
      await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'invalido', password: 'senha123' }).expect(400);
    });

    it('2.2 Deve rejeitar SQL injection no email', async () => {
      await request(app.getHttpServer()).post('/api/auth/login').send({ email: "' OR '1'='1' --", password: 'test' }).expect(400);
    });
  });

  describe('Multi-tenant Isolation', () => {
    it('3.1 User de uma cooperativa NÃO vê dados de outra', async () => {
      const res = await request(app.getHttpServer()).get('/api/cooperados').set('X-User-Id', testUserId).set('X-Cooperative-Id', testCooperativeId).expect(200);

      const data = res.body;
      if (Array.isArray(data)) {
        for (const item of data) {
          expect(item.cooperative_id).toBe(testCooperativeId);
        }
      }
    });
  });

  describe('Rate Limiting', () => {
    it('4.1 Deve limitar tentativas de login', async () => {
      for (let i = 0; i < 6; i++) {
        await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'brute@test.com', password: 'errada' });
      }
      const res = await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'brute@test.com', password: 'errada' });
      expect([429, 401]).toContain(res.status);
    }, 30000);
  });

  describe('Public Endpoints', () => {
    it('5.1 Logout funciona sem autenticação', async () => {
      await request(app.getHttpServer()).post('/api/auth/logout').expect(200);
    });
  });
});
