#!/usr/bin/env bash
# ============================================
# CoopElos 4.0 - Deploy Oracle Cloud (OCI)
# Uso: bash scripts/deploy-oci.sh
# ============================================

set -euo pipefail

echo "=========================================="
echo "  CoopElos 4.0 - Deploy OCI"
echo "=========================================="

# 1. Validar variaveis
if [ ! -f .env.production ]; then
  echo "[ERRO] Crie .env.production a partir de .env.production.example"
  exit 1
fi

export $(grep -v '^#' .env.production | xargs)

# 2. Pull imagens e build
echo "[1/5] Construindo imagens Docker..."
docker compose -f docker-compose.prod.yml build --pull

# 3. Rodar migrations
echo "[2/5] Executando migrations..."
docker compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

# 4. Seed (se necessario)
echo "[3/5] Verificando seed..."
docker compose -f docker-compose.prod.yml run --rm backend npx ts-node prisma/seeds/seed.ts || true

# 5. Subir servicos
echo "[4/5] Subindo servicos..."
docker compose -f docker-compose.prod.yml up -d

# 6. Health check
echo "[5/5] Health check..."
sleep 10

if curl -sf http://localhost:3001/api/auth/logout > /dev/null 2>&1; then
  echo "[OK] Backend respondendo na porta 3001"
else
  echo "[AVISO] Backend pode ainda estar inicializando..."
fi

if curl -sf http://localhost:3000 > /dev/null 2>&1; then
  echo "[OK] Frontend respondendo na porta 3000"
else
  echo "[AVISO] Frontend pode ainda estar inicializando..."
fi

echo ""
echo "=========================================="
echo "  Deploy concluido!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "=========================================="
