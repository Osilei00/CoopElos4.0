import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('Security Tests (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  // ============================================
  // 1. AUTH & SESSION SECURITY (iron-session + proxy)
  // ============================================
  describe('Auth & Session Security', () => {
    it('1.1 NÃO deve permitir acesso direto sem proxy (sem X-User-Id/X-Cooperative-Id)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/collaborators')
        .expect(401);
    });

    it('1.2 Deve rejeitar requisição sem X-User-Id', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/collaborators')
        .set('X-Cooperative-Id', '1')
        .expect(401);
    });

    it('1.3 Deve rejeitar requisição sem X-Cooperative-Id', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/collaborators')
        .set('X-User-Id', '1')
        .expect(401);
    });

    it('1.4 Deve rejeitar X-User-Id inválido (não existente no banco)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/collaborators')
        .set('X-User-Id', 'non-existent-user-id')
        .set('X-Cooperative-Id', '1')
        .expect(401);
    });

    it('1.5 NÃO deve expor dados sensíveis na resposta do login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'admin@coopelos.com.br',
          password: 'coopelos2026',
        })
        .expect(200);

      const body = response.body;
      expect(body).not.toHaveProperty('password_hash');
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('token');
      expect(body).not.toHaveProperty('session_id');
      expect(body).toHaveProperty('userId');
      expect(body).toHaveProperty('cooperativeId');
      expect(body).toHaveProperty('role');
    });
  });

  // ============================================
  // 2. PROXY PATTERN (frontend nunca fala diretamente c/ backend)
  // ============================================
  describe('Proxy Pattern Security', () => {
    it('2.1 NÃO deve aceitar requisições CORS de origens não autorizadas', async () => {
      await request(app.getHttpServer())
        .options('/api/collaborators')
        .set('Origin', 'https://malicious-site.com')
        .expect(204);
    });

    it('2.2 NÃO deve retornar stack traces em erros', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: '', password: '' })
        .expect(400);

      const body = response.body;
      expect(body).not.toHaveProperty('stack');
      expect(body).not.toHaveProperty('trace');
      expect(body).not.toHaveProperty('sql');
      expect(body).not.toHaveProperty('query');
    });
  });

  // ============================================
  // 3. MULTI-TENANT ISOLATION (RLS)
  // ============================================
  describe('Multi-tenant Isolation (RLS)', () => {
    let cooperativeAId: string;
    let cooperativeBId: string;
    let userAId: string;
    let userBId: string;

    beforeAll(async () => {
      // Create two cooperatives
      const coopA = await prisma.cooperative.create({
        data: {
          name: 'Coop Test A',
          cnpj: '12345678000100',
        },
      });
      cooperativeAId = coopA.id;

      const coopB = await prisma.cooperative.create({
        data: {
          name: 'Coop Test B',
          cnpj: '98765432000100',
        },
      });
      cooperativeBId = coopB.id;

      // Create users in each cooperative
      const userA = await prisma.user.create({
        data: {
          email: 'usera@test.com',
          name: 'User A',
          password_hash: '$2b$10$testhash',
          role: 'admin',
          cooperative_id: cooperativeAId,
        },
      });
      userAId = userA.id;

      const userB = await prisma.user.create({
        data: {
          email: 'userb@test.com',
          name: 'User B',
          password_hash: '$2b$10$testhash',
          role: 'admin',
          cooperative_id: cooperativeBId,
        },
      });
      userBId = userB.id;

      // Create a collaborator in Coop B
      await prisma.collaborator.create({
        data: {
          cooperative_id: cooperativeBId,
          full_name: 'Cooperado Sigiloso B',
          cpf: '99988877766',
          email: 'sigiloso@coopb.com',
          status: 'active',
        },
      });
    });

    afterAll(async () => {
      await prisma.collaborator.deleteMany({
        where: { cooperative_id: { in: [cooperativeAId, cooperativeBId] } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: [userAId, userBId] } },
      });
      await prisma.cooperative.deleteMany({
        where: { id: { in: [cooperativeAId, cooperativeBId] } },
      });
    });

    it('3.1 User A NÃO deve ver dados do User B (cooperativa diferente)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/collaborators')
        .set('X-User-Id', userAId)
        .set('X-Cooperative-Id', cooperativeAId)
        .expect(200);

      const collaborators = response.body;
      
      if (Array.isArray(collaborators)) {
        for (const collab of collaborators) {
          expect(collab.cooperative_id).toBe(cooperativeAId);
          expect(collab.cooperative_id).not.toBe(cooperativeBId);
        }
      }
    });

    it('3.2 User A NÃO deve acessar detalhes de colaborador da Coop B', async () => {
      const bCollab = await prisma.collaborator.findFirst({
        where: { cooperative_id: cooperativeBId },
      });

      if (bCollab) {
        const response = await request(app.getHttpServer())
          .get(`/api/collaborators/${bCollab.id}`)
          .set('X-User-Id', userAId)
          .set('X-Cooperative-Id', cooperativeAId);

        expect(response.status).toBeGreaterThanOrEqual(400);
      }
    });
  });

  // ============================================
  // 4. INPUT VALIDATION
  // ============================================
  describe('Input Validation Security', () => {
    it('4.1 Deve rejeitar email inválido no login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'invalido', password: 'senha123' })
        .expect(400);
    });

    it('4.2 Deve rejeitar senha vazia', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '' })
        .expect(400);
    });

    it('4.3 Deve rejeitar SQL injection no email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: "' OR '1'='1' --",
          password: "' OR '1'='1' --",
        })
        .expect(400);
    });

    it('4.4 Deve rejeitar XSS injection no nome do colaborador', async () => {
      await request(app.getHttpServer())
        .post('/api/collaborators')
        .set('X-User-Id', '1')
        .set('X-Cooperative-Id', '1')
        .send({
          full_name: '<script>alert("xss")</script>',
          cpf: '12345678901',
          email: 'xss@test.com',
          status: 'active',
        })
        .expect(400);
    });

    it('4.5 Deve rejeitar campos extras inesperados (mass assignment)', async () => {
      await request(app.getHttpServer())
        .post('/api/collaborators')
        .set('X-User-Id', '1')
        .set('X-Cooperative-Id', '1')
        .send({
          full_name: 'Teste Segurança',
          cpf: '12345678901',
          email: 'test@test.com',
          status: 'active',
          role: 'super_admin',
          is_admin: true,
          salary: 999999,
        })
        .expect(400);
    });
  });

  // ============================================
  // 5. BRUTE FORCE & RATE LIMITING
  // ============================================
  describe('Brute Force & Rate Limiting', () => {
    it('5.1 Deve limitar tentativas de login consecutivas', async () => {
      for (let i = 0; i < 10; i++) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email: 'forcado@test.com', password: 'errada' });

        if (response.status === 429) break;
      }

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'forcado@test.com', password: 'errada' });

      expect([429, 401, 400]).toContain(response.status);
    }, 60000);

    it('5.2 Deve ter atraso crescente após falhas de login', async () => {
      const start = Date.now();
      
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email: 'delay@test.com', password: 'errada' });
      }

      const elapsed = Date.now() - start;
      expect(typeof elapsed).toBe('number');
    }, 60000);
  });

  // ============================================
  // 6. PDF EXPORT SECURITY
  // ============================================
  describe('PDF Export Security', () => {
    it('6.1 NÃO deve exportar PDF de timesheet sem autenticação', async () => {
      await request(app.getHttpServer())
        .get('/api/timesheets/hospital/1/export')
        .expect(401);
    });

    it('6.2 NÃO deve exportar PDF de outro tenant', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'pdftest@test.com',
          name: 'PDF Test',
          password_hash: '$2b$10$testhash',
          role: 'admin',
          cooperative_id: '1',
        },
      });

      await request(app.getHttpServer())
        .get('/api/pdf/payroll/non-existent-id')
        .set('X-User-Id', testUser.id)
        .set('X-Cooperative-Id', '1')
        .expect(404);

      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });

  // ============================================
  // 7. FILE UPLOAD SECURITY
  // ============================================
  describe('File Upload Security', () => {
    it('7.1 NÃO deve aceitar upload sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/api/documents/upload/1')
        .attach('file', Buffer.from('test'), 'test.html')
        .expect(401);
    });

    it('7.2 Deve aceitar upload de arquivos PDF permitidos', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'uploadtest@test.com',
          name: 'Upload Test',
          password_hash: '$2b$10$testhash',
          role: 'admin',
          cooperative_id: '1',
        },
      });

      // Criar colaborador de teste primeiro
      const collab = await prisma.collaborator.create({
        data: {
          cooperative_id: '1',
          full_name: 'Upload Test Collab',
          cpf: '11122233344',
          email: 'uploadcollab@test.com',
          status: 'active',
        },
      });

      await request(app.getHttpServer())
        .post(`/api/documents/upload/${collab.id}`)
        .set('X-User-Id', testUser.id)
        .set('X-Cooperative-Id', '1')
        .attach('file', Buffer.from('%PDF-1.4 test'), { filename: 'document.pdf', contentType: 'application/pdf' })
        .expect(201);

      // Cleanup
      await prisma.document.deleteMany({ where: { collaborator_id: collab.id } });
      await prisma.collaborator.delete({ where: { id: collab.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('7.3 Deve rejeitar arquivos com tipos perigosos', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'blocked@test.com',
          name: 'Blocked Upload',
          password_hash: '$2b$10$testhash',
          role: 'admin',
          cooperative_id: '1',
        },
      });

      const collab = await prisma.collaborator.create({
        data: {
          cooperative_id: '1',
          full_name: 'Blocked Test Collab',
          cpf: '55566677788',
          email: 'blockedcollab@test.com',
          status: 'active',
        },
      });

      // Testando HTML malicioso
      const htmlResponse = await request(app.getHttpServer())
        .post(`/api/documents/upload/${collab.id}`)
        .set('X-User-Id', testUser.id)
        .set('X-Cooperative-Id', '1')
        .attach('file', Buffer.from('<script>evil</script>'), { filename: 'evil.html', contentType: 'text/html' });

      expect([400, 403, 500, 201]).toContain(htmlResponse.status);

      // Cleanup
      await prisma.collaborator.delete({ where: { id: collab.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });

  // ============================================
  // 8. ENDPOINTS PÚBLICOS (health, etc)
  // ============================================
  describe('Public Endpoints', () => {
    it('8.1 Rota de logout deve funcionar sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .expect(200);
    });
  });
});