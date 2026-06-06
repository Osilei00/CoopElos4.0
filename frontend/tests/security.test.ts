/**
 * Script de Testes de Segurança do Frontend
 *
 * Verifica os padrões de segurança:
 * 1. Proxy pattern (frontend nunca fala direto com backend)
 * 2. Session cookie security (httpOnly, sem localStorage)
 * 3. API layer security
 * 4. Protected routes
 *
 * Uso: ts-node tests/security.test.ts
 */

import path from 'path';
import { promises as fs } from 'fs';

let passed = 0;
let failed = 0;
const results: { check: string; passed: boolean; details: string }[] = [];

function assert(check: string, condition: boolean, details: string) {
  if (condition) {
    passed++;
    results.push({ check, passed: true, details });
    console.log(`  ✅ PASSOU: ${check}`);
  } else {
    failed++;
    results.push({ check, passed: false, details });
    console.log(`  ❌ FALHOU: ${check}`);
    console.log(`     ${details}`);
  }
}

async function runTests() {
  const srcDir = path.resolve(__dirname, '../src');
  console.log();
  console.log('='.repeat(60));
  console.log('TESTES DE SEGURANÇA DO FRONTEND');
  console.log('='.repeat(60));
  console.log();

  // ============================================
  // 1. PROXY PATTERN
  // ============================================
  console.log('📌 1. Proxy Pattern');
  console.log('-'.repeat(40));

  const apiPath = path.join(srcDir, 'lib', 'api.ts');
  try {
    const apiContent = await fs.readFile(apiPath, 'utf-8');
    const baseUrl = apiContent.match(/baseURL:\s*['"]([^'"]+)['"]/);
    
    assert(
      'api.ts usa /api/proxy como baseURL',
      baseUrl ? baseUrl[1].includes('/api/proxy') : false,
      baseUrl
        ? `baseURL configurado como: ${baseUrl[1]}`
        : 'baseURL não encontrado no arquivo api.ts',
    );

    assert(
      'api.ts NÃO contém referência direta ao backend',
      !apiContent.includes('localhost:3001') && !apiContent.includes('BACKEND_URL'),
      'api.ts contém referência direta ao backend!',
    );
  } catch (error: any) {
    assert('api.ts encontrado', false, `api.ts não encontrado: ${error.message}`);
  }

  // ============================================
  // 2. SESSION COOKIE SECURITY
  // ============================================
  console.log('\n📌 2. Session Cookie Security');
  console.log('-'.repeat(40));

  const sessionPath = path.join(srcDir, 'lib', 'session.ts');
  try {
    const sessionContent = await fs.readFile(sessionPath, 'utf-8');
    
    assert(
      'Session config tem httpOnly',
      sessionContent.includes('httpOnly'),
      'Propriedade httpOnly não encontrada na config',
    );

    assert(
      'Session config tem secure',
      sessionContent.includes('secure'),
      'Propriedade secure não encontrada na config',
    );

    assert(
      'Session config tem sameSite',
      sessionContent.includes('sameSite'),
      'Propriedade sameSite não encontrada na config',
    );

    assert(
      'Session usa SESSION_SECRET de env var',
      sessionContent.includes('SESSION_SECRET') || sessionContent.includes('process.env'),
      'SESSION_SECRET pode estar hardcoded',
    );
  } catch (error: any) {
    assert('session.ts encontrado', false, `session.ts não encontrado: ${error.message}`);
  }

  // ============================================
  // 3. SEM TOKENS NO LOCALSTORAGE
  // ============================================
  console.log('\n📌 3. Sem Tokens em localStorage/sessionStorage');
  console.log('-'.repeat(40));

  async function findStorageUsage(dir: string): Promise<{ file: string; line: string }[]> {
    const dangers: { file: string; line: string }[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('node_modules') && !entry.name.startsWith('.next')) {
        const subDangers = await findStorageUsage(fullPath);
        dangers.push(...subDangers);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (
            line.includes('localStorage.setItem') &&
            (line.toLowerCase().includes('token') || line.toLowerCase().includes('session'))
          ) {
            dangers.push({ file: fullPath, line: `${index + 1}: ${line.trim()}` });
          }

          if (
            line.includes('sessionStorage.setItem') &&
            (line.toLowerCase().includes('token') || line.toLowerCase().includes('auth'))
          ) {
            dangers.push({ file: fullPath, line: `${index + 1}: ${line.trim()}` });
          }
        });
      }
    }

    return dangers;
  }

  try {
    const storageDangers = await findStorageUsage(srcDir);
    assert(
      'NENHUM token armazenado em localStorage/sessionStorage',
      storageDangers.length === 0,
      storageDangers.length > 0
        ? `Encontrado em: ${storageDangers.map(d => `${d.file}:${d.line}`).join('; ')}`
        : 'Nenhum armazenamento inseguro encontrado',
    );
  } catch (error: any) {
    assert('Verificação de storage', false, `Erro ao escanear: ${error.message}`);
  }

  // ============================================
  // 4. PROXY ROUTES
  // ============================================
  console.log('\n📌 4. Proxy Routes');
  console.log('-'.repeat(40));

  const proxyRoutePath = path.join(srcDir, 'app', 'api', 'proxy', '[...path]', 'route.ts');
  try {
    await fs.access(proxyRoutePath);
    assert(
      'Proxy route implementado (/api/proxy/[...path]/route.ts)',
      true,
      'Proxy route encontrado',
    );
  } catch {
    assert(
      'Proxy route implementado',
      false,
      'Proxy route NÃO encontrado em src/app/api/proxy/[...path]/route.ts',
    );
  }

  // ============================================
  // 5. MIDDLEWARE
  // ============================================
  console.log('\n📌 5. Middleware de Proteção de Rotas');
  console.log('-'.repeat(40));

  const middlewarePaths = [
    path.join(srcDir, 'middleware.ts'),
    path.join(srcDir, 'middleware.tsx'),
  ];

  let middlewareFound = false;
  for (const mwPath of middlewarePaths) {
    try {
      const mwContent = await fs.readFile(mwPath, 'utf-8');
      middlewareFound = true;
      
      assert(
        'Middleware redireciona para /login se não autenticado',
        mwContent.includes('/login') && (mwContent.includes('session') || mwContent.includes('cookie')),
        'Middleware existe mas pode não redirecionar corretamente',
      );
      break;
    } catch {
      // Continue
    }
  }

  if (!middlewareFound) {
    assert(
      'Middleware de proteção de rotas',
      false,
      'Arquivo middleware.ts não encontrado',
    );
  }

  // ============================================
  // RESUMO
  // ============================================
  console.log();
  console.log('='.repeat(60));
  console.log(`RESUMO: ${passed} passaram, ${failed} falharam`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\n🔴 RISCOS DE SEGURANÇA ENCONTRADOS!');
    process.exit(1);
  } else {
    console.log('\n🟢 Todos os testes de segurança passaram!');
  }
}

runTests().catch((error) => {
  console.error('Erro ao executar testes:', error);
  process.exit(1);
});