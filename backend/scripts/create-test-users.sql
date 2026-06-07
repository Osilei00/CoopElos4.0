-- Inserir usuários de teste com diferentes roles
INSERT INTO "user" (id, cooperative_id, name, username, email, password_hash, role, is_active, created_at, updated_at)
VALUES 
  -- Usuário RH
  ('test-rh-001', (SELECT id FROM cooperative LIMIT 1), 'Maria RH', 'maria.rh', 'rh@coopelos.com.br', '$2b$10$YH8vFZ4CG3KGL9O4vM8GLeT8rVH3xjKj5lzqGZ6jC5xJZ4jC5xJZ4', 'rh', true, NOW(), NOW()),
  -- Usuário DP
  ('test-dp-001', (SELECT id FROM cooperative LIMIT 1), 'Pedro DP', 'pedro.dp', 'dp@coopelos.com.br', '$2b$10$YH8vFZ4CG3KGL9O4vM8GLeT8rVH3xjKj5lzqGZ6jC5xJZ4jC5xJZ4', 'dp', true, NOW(), NOW()),
  -- Usuário Viewer
  ('test-viewer-001', (SELECT id FROM cooperative LIMIT 1), 'João Viewer', 'joao.viewer', 'viewer@coopelos.com.br', '$2b$10$YH8vFZ4CG3KGL9O4vM8GLeT8rVH3xjKj5lzqGZ6jC5xJZ4jC5xJZ4', 'viewer', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

SELECT email, role, is_active, name FROM "user";
