# CoopElos 4.0

Plataforma de gestao de RH e Departamento Pessoal para cooperativas hospitalares.

## O que e?

Sistema web que centraliza:
- Cadastro de colaboradores
- Folha de pagamento (hospitalar e SAD)
- Controle de ponto e jornadas
- Gestao de férias
- Tarefas e alertas
- Auditoria

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16 + TypeScript + Chakra UI |
| Backend | NestJS + Prisma |
| Banco | PostgreSQL |
| Filas | BullMQ + Redis |
| Storage | AWS S3 |
| Auth | iron-session |

## Como rodar

### Pre-requisitos
- Node.js 18+
- Docker + Docker Compose

### 1. Instalar dependencias
`ash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
`

### 2. Configurar variaveis de ambiente
`ash
cp .env.example .env
# Edite .env com suas credenciais
`

### 3. Subir bancos de dados
`ash
docker compose up -d
`

### 4. Rodar migrations
`ash
cd backend && npx prisma migrate dev
`

### 5. Iniciar aplicacao
`ash
# Backend (porta 3001)
cd backend && npm run start:dev

# Frontend (porta 3000)
cd frontend && npm run dev
`

## Estrutura

`
coopelos4.0/
+-- frontend/ # Next.js (interface do usuario)
+-- backend/ # NestJS (API e regras de negocio)
+-- docs/ # Documentacao do projeto
+-- .agents/ # Configs de assistentes IA
+-- docker-compose.yml
`

## Features

- **Auth**: Login via email/senha com sessao segura (httpOnly cookie)
- **Colaboradores**: CRUD completo, ficha de adesao, upload de documentos
- **Folha**: Geracao mensal, calculos (horas extras, noturno, descontos)
- **Ponto Hospitalar**: Matriz de escalas com codigos (M/T/SN/D/F)
- **Ponto SAD**: Tabelas por paciente com calculo de producao
- **Ferias**: Registro, saldo, alertas de vencimento
- **Tarefas**: CRUD com filtros e status
- **Auditoria**: Log imutavel de todas as acoes

## Licenca

Proprietario - Cooperativa Hospitalar
