# Implementation Plan — CoopElos

## Batch 1: Infraestrutura
- Task 1.1: Criar repositório e estrutura de pastas (monorepo ou separado) | Arquivos: `package.json`, `docker-compose.yml` | Verificação: `docker compose up` sobe DB e Redis
- Task 1.2: Configurar `.env.example` com variáveis obrigatórias | Arquivos: `.env.example` | Verificação: Variáveis listadas e documentadas

## Batch 2: Database
- Task 2.1: Configurar Prisma com PostgreSQL | Arquivos: `schema.prisma` | Verificação: `npx prisma generate` roda sem erros
- Task 2.2: Criar models iniciais (Cooperative, User, Collaborator) | Arquivos: `schema.prisma` | Verificação: `npx prisma db push` aplica tabelas
- Task 2.3: Criar models de Folha, Ponto, Tarefas, Auditoria | Arquivos: `schema.prisma` | Verificação: Todas as tabelas criadas no DB
- Task 2.4: Criar model ficha_cooperado_form com cooperado_number e status | Arquivos: `schema.prisma` | Verificação: Tabela criada com colunas de controle
- Task 2.5: Criar seed para importar CSV de cooperados | Arquivos: `prisma/seeds/seed.ts` | Verificação: 187 cooperados importados
- Task 2.6: Adicionar indexes e triggers no SQL bruto | Arquivos: `migrations/` | Verificação: Queries de busca usam indexes

## Batch 3: Backend Core
- Task 3.1: Setup NestJS com PrismaService | Arquivos: `src/prisma/prisma.service.ts` | Verificação: App inicia e conecta ao DB
- Task 3.2: Configurar AuthModule com iron-session/proxy | Arquivos: `src/auth/` | Verificação: Login retorna cookie válido
- Task 3.3: Implementar RLS e middleware de contexto | Arquivos: `src/common/guards/` | Verificação: User só vê dados da própria cooperativa
- Task 3.4: Configurar BullMQ + Redis module | Arquivos: `src/queue/` | Verificação: Job de teste é processado

## Batch 4: Backend Modules
- Task 4.1: CRUD de Colaboradores + Ficha de Adesão | Arquivos: `src/collaborators/` | Verificação: Endpoints criam/leem dados
- Task 4.2: Módulo de Cooperados (ficha_cooperado_form) | Arquivos: `src/cooperados/` | Verificação: `GET /api/cooperados` retorna dados
- Task 4.3: Módulo de Documentos + S3 upload | Arquivos: `src/documents/` | Verificação: Upload gera URL assinada
- Task 4.4: Lógica de Folha de Pagamento (cálculos) | Arquivos: `src/payroll/` | Verificação: Totais batem com inputs
- Task 4.5: Folha Hospitalar (matriz) e SAD (pacientes) | Arquivos: `src/timesheets/` | Verificação: JSONB salvo corretamente
- Task 4.6: Tarefas, Férias e Auditoria | Arquivos: `src/tasks/`, `src/vacations/`, `src/audit/` | Verificação: CRUDs funcionais

## Batch 5: Frontend Setup
- Task 5.1: Setup Next.js + Chakra/MUI + TypeScript | Arquivos: `app/`, `components/` | Verificação: `npm run dev` roda
- Task 5.2: Configurar Layout (Sidebar, Header, Auth guard) | Arquivos: `app/layout.tsx`, `middleware.ts` | Verificação: Rotas protegidas redirecionam para login
- Task 5.3: Criar Design System (cores, tipografia, componentes base) | Arquivos: `theme/`, `components/ui/` | Verificação: Componentes renderizam com estilo correto
- Task 5.4: Configurar API client e hooks (React Query) | Arquivos: `lib/api/`, `hooks/` | Verificação: Hook `useSession` retorna dados

## Batch 6: Frontend Pages
- Task 6.1: Página de Login e Gestão de Usuários | Arquivos: `app/login/`, `app/users/` | Verificação: Login funciona, admin cria usuários
- Task 6.2: Dashboard e Lista de Colaboradores | Arquivos: `app/dashboard/`, `app/collaborators/` | Verificação: Cards e tabela com dados reais
- Task 6.3: Página de Cooperados | Arquivos: `app/cooperados/`, hook `useCooperados` | Verificação: Lista mostra dados de ficha_cooperado_form
- Task 6.4: Perfil do Colaborador (abas) | Arquivos: `app/collaborators/[id]/` | Verificação: Abas carregam dados corretos
- Task 6.5: Folha de Pagamento e Ponto (Hospitalar/SAD) | Arquivos: `app/payroll/`, `app/timesheets/` | Verificação: Tabelas editáveis e matriz renderizada
- Task 6.6: Tarefas, Férias e Auditoria | Arquivos: `app/tasks/`, `app/vacations/`, `app/audit/` | Verificação: Filtros e ações funcionam

## Batch 7: Integração Final
- Task 7.1: Upload de documentos (frontend ↔ S3) | Arquivos: `components/FileUploader.tsx` | Verificação: Arquivo aparece no perfil
- Task 7.2: Exportação de PDFs (jobs assíncronos) | Arquivos: `app/reports/` | Verificação: Download inicia após processamento
- Task 7.3: Testes de segurança e RLS | Arquivos: `tests/` | Verificação: User não acessa dados de outra cooperativa
- Task 7.4: Deploy inicial (Railway/Render) | Arquivos: `Dockerfile`, `railway.json` | Verificação: App acessível via URL pública
