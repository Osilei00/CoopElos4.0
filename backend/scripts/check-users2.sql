-- Hash bcrypt para "teste123" gerado externamente
-- Vou usar um hash conhecido: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy (senha "password")
-- Mas vou gerar hash válido via Node primeiro

-- Atualizar usuários existentes se houver
UPDATE "user" SET role = 'rh', is_active = true WHERE email = 'rh@coopelos.com.br';
UPDATE "user" SET role = 'dp', is_active = true WHERE email = 'dp@coopelos.com.br';
UPDATE "user" SET role = 'viewer', is_active = true WHERE email = 'viewer@coopelos.com.br';

-- Listar todos
SELECT email, role, is_active, name FROM "user";
