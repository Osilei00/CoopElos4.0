# Deploy CoopElos - Hostinger VPS + Dokploy

## Pre-requisitos

- Conta na Hostinger com VPS (recomendado: 4GB RAM, 2 vCPU, 50GB SSD)
- Dominio registrado (ex: coopelos.com.br)
- Acesso SSH ao VPS
- Repositorio GitHub com o projeto

---

## Passo 1: Configurar o VPS na Hostinger

### 1.1 Acessar via SSH

```bash
ssh root@IP_DO_SEU_VPS
```

### 1.2 Atualizar o sistema

```bash
apt update && apt upgrade -y
```

### 1.3 Configurar firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw enable
```

---

## Passo 2: Instalar Dokploy

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Apos a instalacao, acesse o painel Dokploy:

```
http://IP_DO_SEU_VPS:3000
```

Crie a conta de administrador no painel.

---

## Passo 3: Configurar DNS do Dominio

No painel do seu provedor de DNS (ex: Cloudflare, Registro.br), crie os registros:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | IP_DO_VPS | Auto |
| A | www | IP_DO_VPS | Auto |
| A | api | IP_DO_VPS | Auto |

> **Nota:** O backend sera acessado via `api.seudominio.com.br` e o frontend via `seudominio.com.br`.

---

## Passo 4: Criar o Projeto no Dokploy

### 4.1 Criar novo Docker Compose

1. No painel Dokploy, va em **Docker Compose**
2. Clique em **Create Project**
3. Nome: `coopelos`
4. Conecte seu repositorio GitHub

### 4.2 Configurar o compose

No campo de editor do Docker Compose, cole o conteudo do arquivo `docker-compose.dokploy.yml` da raiz do projeto.

### 4.3 Configurar variaveis de ambiente

Va na aba **Environment** do projeto e adicione:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SU_SENHA_SEGURA_AQUI
POSTGRES_DB=coopelos

# Auth
SESSION_SECRET=MINIMO_32_CARACTERES_AQUI
JWT_SECRET=MINIMO_32_CARACTERES_AQUI
INTERNAL_TOKEN=64 caracteres hex aleatorios

# URL do App
APP_URL=https://seudominio.com.br

# AWS S3 (deixe como esta para MVP sem S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_BUCKET=coopelos-documents
```

> **Para gerar secrets seguros, execute no VPS:**
> ```bash
> openssl rand -hex 32  # SESSION_SECRET
> openssl rand -hex 32  # JWT_SECRET
> openssl rand -hex 32  # INTERNAL_TOKEN
> ```

---

## Passo 5: Configurar Dominios

### 5.1 Frontend (app principal)

1. Na aba **Domains** do projeto Docker Compose
2. Clique em **Add Domain**
3. Configure:
   - **Service Name:** frontend
   - **Host:** `seudominio.com.br`
   - **Port:** 3000
   - **HTTPS:** Let's Encrypt (automatico)

### 5.2 Backend (API)

1. Clique em **Add Domain** novamente
2. Configure:
   - **Service Name:** backend
   - **Host:** `api.seudominio.com.br`
   - **Port:** 3001
   - **HTTPS:** Let's Encrypt (automatico)

---

## Passo 6: Configurar o Backend para Producao

O backend ja esta configurado para aceitar requests via header `X-Internal-Token`.

Apos o deploy, atualize o `APP_URL` nas variaveis de ambiente para:
```
APP_URL=https://seudominio.com.br
```

O frontend automaticamente usara `BACKEND_URL=http://backend:3001` (comunicacao interna Docker).

---

## Passo 7: Deploy

1. No painel Dokploy, va na aba **General**
2. Clique em **Deploy**
3. Aguarde o build finalizar (pode levar 3-5 minutos)
4. Verifique os logs na aba **Logs**

---

## Passo 8: Verificar o Deploy

### 8.1 Testar o frontend

Acesse `https://seudominio.com.br` - deve redirecionar para o login.

### 8.2 Testar o backend

Acesse `https://api.seudominio.com.br/api/dashboard/stats` - deve retornar erro 401 (esperado sem auth).

### 8.3 Criar usuario admin

Apos o primeiro deploy, o banco estara vazio. Voce precisa criar o primeiro usuario admin.

**Opcao A - Via seed (recomendado):**

No painel Dokploy, va no container `coopelos-backend` e execute o seed:

```bash
npx prisma db seed
```

**Opcao B - Via API (manual):**

Acesse o container backend e crie o usuario diretamente no banco via Prisma Studio ou SQL.

---

## Passo 9: Configurar SSL (automatico)

O Dokploy configura automaticamente SSL via Let's Encrypt quando voce adiciona um dominio com HTTPS habilitado.

Para verificar:
1. Va na aba **Domains** do projeto
2. Verifique se o certificado esta ativo
3. Acesse o site via `https://`

---

## Passo 10: Backup do Banco

### Via Dokploy (recomendado)

1. No painel, va no container PostgreSQL
2. Va na aba **Backups**
3. Configure backup automatico para S3 ou storage local

### Via comando manual

```bash
# Executar no VPS
docker exec coopelos-postgres pg_dump -U postgres coopelos > backup_$(date +%Y%m%d).sql
```

---

## Solucao de Problemas

### Backend nao conecta ao banco

Verifique se o PostgreSQL esta saudavel:
```bash
docker logs coopelos-postgres
```

### Frontend nao conecta ao backend

Verifique se o `BACKEND_URL` esta correto no Docker Compose:
```
BACKEND_URL=http://backend:3001
```

### Erro de SSL

Aguarde alguns minutos apos a configuracao do dominio. Let's Encrypt leva ate 5 minutos para emitir o certificado.

### Container nao inicia

Verifique os logs:
```bash
docker logs coopelos-backend
docker logs coopelos-frontend
```

---

## Arquitetura Final

```
[Usuario] → [Cloudflare/DNS] → [Traefik (Dokploy)]
                                    ↓
                              [Frontend :3000]
                                    ↓ (proxy interno)
                              [Backend :3001]
                                    ↓
                    [PostgreSQL :5432] [Redis :6379]
```

- **Frontend:** Next.js (porta 3000) - acessivel via Traefik
- **Backend:** NestJS (porta 3001) - acessivel via Traefik (api.seudominio.com.br)
- **PostgreSQL:** internamente no Docker network
- **Redis:** internamente no Docker network

---

## Variaveis de Ambiente - Referencia

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `POSTGRES_USER` | Usuario do PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `senha_segura` |
| `POSTGRES_DB` | Nome do banco | `coopelos` |
| `SESSION_SECRET` | Chave iron-session (min 32 chars) | `abc123...` |
| `JWT_SECRET` | Chave JWT (min 32 chars) | `abc123...` |
| `INTERNAL_TOKEN` | Token proxy↔backend (64 hex) | `abc123...` |
| `APP_URL` | URL publica do frontend | `https://app.com` |
| `AWS_ACCESS_KEY_ID` | Chave AWS S3 | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Chave secreta AWS | `abc123...` |
| `AWS_S3_BUCKET` | Bucket S3 | `coopelos-docs` |
