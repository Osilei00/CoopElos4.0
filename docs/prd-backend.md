# PRD — Backend (CoopElos)

## Resumo do Produto
SaaS para gestão de RH e DP de cooperativas hospitalares. Centraliza cadastro de cooperados, folha de pagamento (hospitalar e SAD), controle de férias, tarefas/alertas e auditoria.

## Requisitos Funcionais (Backend)
- **Auth**: Login via email/senha, gestão de usuários pelo admin, sessão httpOnly.
- **Cooperados**: CRUD completo, ficha de adesão, histórico contratual, upload de documentos.
- **Folha**: Geração mensal, cálculos (horas extras, noturno, descontos), versão imutável ao fechar.
- **Ponto**: Matriz hospitalar (códigos M/T/SN/D/F/.), SAD por paciente (cálculo de produção/taxas).
- **Férias**: Registro, saldo, alertas de vencimento.
- **Tarefas**: CRUD, filtros, status, responsáveis.
- **Auditoria**: Log de todas as ações com before/after.

## Database Schema

### Tabelas Principais
- `cooperative`: Dados da cooperativa (multi-tenant).
- `user`: Usuários do sistema (admin, rh, dp, viewer).
- `cooperado`: Ficha completa do cooperado (dados pessoais, profissionais, bancários, documentos). Inclui `cooperado_number` (Int, auto-numerado) e `status` (String, default "active").
- `contract_history`: Histórico de salários/cargos do cooperado (FK para `cooperado`). Registra mudanças contratuais ao longo do tempo.
- `adhesion_form`: Ficha de adesão complementar (FK para `cooperado`).
- `document`: Metadados de arquivos no S3.
- `payroll`: Cabeçalho da folha (mês/ano, status, totais).
- `payroll_item`: Itens individuais da folha.
- `time_sheet_hospital`: Matriz de escalas (JSONB).
- `time_sheet_sad`: Registros por paciente/profissional.
- `patient`: Pacientes para atendimento domiciliar.
- `vacation`: Controle de períodos de férias.
- `task`: Tarefas e alertas.
- `audit_log`: Log imutável de ações.

### RLS Policies
- Todas as tabelas com `cooperative_id` possuem: `USING (cooperative_id = current_setting('app.current_cooperative_id')::uuid)`.
- Roles: `admin` (full), `rh` (cooperados/docs/férias), `dp` (folha/ponto), `viewer` (read-only).

### Triggers
- `set_updated_at`: Atualiza `updated_at` em cada UPDATE.
- `audit_trigger`: Captura mudanças em tabelas críticas e insere em `audit_log`.

### Indexes
- `cooperado(cooperative_id, cpf_cooperado)`, `cooperado(cooperative_id, status)`
- `payroll(cooperative_id, year, month)`
- `task(cooperative_id, status, due_date)`
- `audit_log(cooperative_id, created_at)`

## Endpoints

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/session` — Sessão atual
- `POST /api/auth/users` — Criar usuário (admin)
- `POST /api/auth/users/:id/reset-password` — Reset senha

### Dashboard
- `GET /api/dashboard/stats` — Estatísticas do dashboard (cooperados ativos, folha atual, tarefas pendentes, férias programadas)

### Cooperados
- `GET /api/cooperados` — Listar com filtros/paginação
- `POST /api/cooperados` — Criar
- `GET /api/cooperados/:id` — Detalhes
- `PUT /api/cooperados/:id` — Atualizar
- `DELETE /api/cooperados/:id` — Soft delete
- `GET/POST/PUT /api/cooperados/:id/adhesion-form` — Ficha de adesão
- `GET/POST /api/cooperados/:id/history` — Histórico contratual (salários, cargos, admissões)
- `POST /api/cooperados/:id/declaracao-adesao` — Upload da Declaração de Adesão (PDF → S3)
- `GET /api/cooperados/:id/declaracao-adesao` — Obter URL da Declaração de Adesão
- `GET /api/cooperados/:id/declaracao-adesao/pdf` — Gerar PDF dinâmico da Declaração de Adesão (dados do cooperado)
- `POST /api/cooperados/:id/declaracao-quitacao` — Upload da Declaração de Quitação (PDF → S3)
- `GET /api/cooperados/:id/declaracao-quitacao` — Obter URL da Declaração de Quitação
- `POST /api/cooperados/:id/recibo-contribuicao` — Upload do Recibo de Contribuição (PDF → S3)
- `GET /api/cooperados/:id/recibo-contribuicao` — Obter URL do Recibo de Contribuição

### Documents
- `POST /api/documents/upload` — Upload (multipart → S3)
- `GET /api/documents/:id/download` — URL assinada
- `GET /api/documents` — Listar
- `DELETE /api/documents/:id` — Soft delete

### Payroll
- `GET/POST /api/payrolls` — Listar/Gerar folha
- `GET /api/payrolls/:id` — Detalhes
- `POST /api/payrolls/:id/items` — Criar item na folha
- `PATCH /api/payrolls/:id/items/:itemId` — Atualizar item
- `DELETE /api/payrolls/:id/items/:itemId` — Remover item
- `POST /api/payrolls/:id/close` — Fechar versão
- `POST /api/payrolls/:id/export` — Job de exportação

### TimeSheets
- `GET/POST/PATCH /api/timesheets/hospital` — Hospitalar
- `GET/POST/PATCH /api/timesheets/sad` — SAD
- `POST /api/timesheets/:id/export` — Exportar PDF

### Patients, Vacations, Tasks, Audit
- CRUD padrão conforme especificação de módulos.

### Contribuições
- `POST /api/contribuicoes` — Registrar contribuição
- `GET /api/contribuicoes` — Listar com filtros (mês, ano, cooperado, status)
- `GET /api/contribuicoes/stats` — Estatísticas do ano (total, por mês, cooperados únicos)
- `GET /api/contribuicoes/:id` — Detalhes
- `PUT /api/contribuicoes/:id` — Atualizar
- `DELETE /api/contribuicoes/:id` — Remover
- `GET /api/contribuicoes/:id/recibo` — Gerar recibo PDF
- `POST /api/contribuicoes/:id/recibo/upload` — Upload do recibo (PDF → S3)

## Auth Middleware
- iron-session no Next.js gera cookie `httpOnly`.
- API Gateway/Proxy injeta `X-User-Id` e `X-Cooperative-Id` nos headers ao chamar NestJS.
- NestJS `AuthGuard` valida headers e define contexto RLS.

## Integrações
- **S3**: Storage de documentos (AWS ou MinIO).
- **BullMQ + Redis**: Filas para geração de PDFs e processamento assíncrono.

## Requisitos Não-Funcionais
- Respostas < 500ms (queries simples).
- Paginação em todas as listagens.
- Logs estruturados (Pino/Winston).
- Arquitetura stateless.

## Security Checklist
- [ ] iron-session com `httpOnly`, `secure`, `sameSite=lax`.
- [ ] RLS ativo em todas as tabelas.
- [ ] CORS restrito ao frontend.
- [ ] Rate limiting (100 req/min).
- [ ] Validação Zod em todos os inputs.
- [ ] Senhas com bcrypt/argon2.
- [ ] `.env` ignorado no git.

## Stack
- Node.js + NestJS
- PostgreSQL + Prisma
- Zod
- BullMQ + Redis
- AWS SDK (S3)
