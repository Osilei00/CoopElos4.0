-- Inserir usuários de teste com diferentes roles
-- Hash bcrypt para senha "teste123"

INSERT INTO "user" (id, cooperative_id, name, username, email, password_hash, role, is_active, created_at, updated_at)
VALUES 
  ('test-rh-001', (SELECT id FROM cooperative LIMIT 1), 'Maria RH', 'maria.rh', 'rh@coopelos.com.br', '$2b$10$rQTHv2b0ujJmB/dpCdY.wOAKqXVb5RNhj/8GeRddJ7LxGBDvn7nea', 'rh', true, NOW(), NOW()),
  ('test-dp-001', (SELECT id FROM cooperative LIMIT 1), 'Pedro DP', 'pedro.dp', 'dp@coopelos.com.br', '$2b$10$rQTHv2b0ujJmB/dpCdY.wOAKqXVb5RNhj/8GeRddJ7LxGBDvn7nea', 'dp', true, NOW(), NOW()),
  ('test-viewer-001', (SELECT id FROM cooperative LIMIT 1), 'João Viewer', 'joao.viewer', 'viewer@coopelos.com.br', '$2b$10$rQTHv2b0ujJmB/dpCdY.wOAKqXVb5RNhj/8GeRddJ7LxGBDvn7nea', 'viewer', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

SELECT email, role, is_active, name FROM "user";
