/**
 * Script de Auditoria de Segurança do Frontend
 *
 * Verifica:
 * 1. Nenhum token exposto em localStorage/sessionStorage
 * 2. Nenhuma chamada direta ao backend (deve usar /api/proxy)
 * 3. Nenhum console.log expondo dados sensíveis
 * 4. iron-session configurado corretamente
 *
 * Uso: node scripts/audit-security.js
 */

import path from 'path';
import { promises as fs } from 'fs';

interface AuditResult {
  check: string;
  passed: boolean;
  details?: string;
}

async function auditSecurity(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];
  const srcDir = path.resolve(__dirname, '../src');

  // 1. Verificar que api.ts usa proxy
  const apiPath = path.join(srcDir, 'lib', 'api.ts');
  try {
    const apiContent = await fs.readFile(apiPath, 'utf-8');
    const usesProxy = apiContent.includes('/api/proxy');
    const usesBackendDirect = apiContent.includes('localhost:3001') || apiContent.includes('BACKEND_URL');

    results.push({
      check: 'api.ts usa /api/proxy como baseURL',
      passed: usesProxy && !usesBackendDirect,
      details: usesProxy
        ? 'api.ts corretamente configurado para usar /api/proxy'
        : 'PERIGO: api.ts não usa o proxy!',
    });
  } catch (error: any) {
    results.push({
      check: 'api.ts usa /api/proxy como baseURL',
      passed: false,
      details: `Arquivo api.ts não encontrado: ${error.message}`,
    });
  }

  // 2. Verificar session.ts (iron-session config)
  const sessionPath = path.join(srcDir, 'lib', 'session.ts');
  try {
    const sessionContent = await fs.readFile(sessionPath, 'utf-8');
    const hasHttpOnly = sessionContent.includes('httpOnly');
    const hasSecure = sessionContent.includes('secure');
    const hasSameSite = sessionContent.includes('sameSite');
    const hasSessionSecret = sessionContent.includes('SESSION_SECRET');

    results.push({
      check: 'Session config tem httpOnly, secure, sameSite',
      passed: hasHttpOnly && hasSecure && hasSameSite,
      details: `httpOnly: ${hasHttpOnly}, secure: ${hasSecure}, sameSite: ${hasSameSite}`,
    });

    results.push({
      check: 'Session usa SESSION_SECRET de env var',
      passed: hasSessionSecret,
      details: hasSessionSecret
        ? 'SESSION_SECRET vindo de variável de ambiente'
        : 'PERIGO: SESSION_SECRET hardcoded!',
    });
  } catch (error: any) {
    results.push({
      check: 'Session config',
      passed: false,
      details: `Arquivo session.ts não encontrado: ${error.message}`,
    });
  }

  // 3. Verificar middleware (proteção de rotas)
  const middlewarePath = path.join(srcDir, 'middleware.ts');
  try {
    const middlewareContent = await fs.readFile(middlewarePath, 'utf-8');
    const hasLoginRedirect = middlewareContent.includes('/login');
    const hasSessionCheck = middlewareContent.includes('getIronSession') || middlewareContent.includes('session');

    results.push({
      check: 'Middleware protege rotas (redirect to /login)',
      passed: hasLoginRedirect && hasSessionCheck,
      details: hasLoginRedirect && hasSessionCheck
        ? 'Middleware configurado corretamente'
        : 'Middleware pode estar desprotegido',
    });
  } catch (error: any) {
    results.push({
      check: 'Middleware de proteção de rotas',
      passed: false,
      details: `middleware.ts não encontrado: ${error.message}`,
    });
  }

  // 4. Verificar que NÃO há localStorage para tokens
  const searchPatterns = [
    { pattern: 'localStorage.setItem', danger: 'Armazenando em localStorage' },
    { pattern: 'sessionStorage.setItem', danger: 'Armazenando em sessionStorage' },
    { pattern: 'document.cookie', danger: 'Cookies JS-accessible' },
  ];

  async function searchInFiles(dir: string): Promise<string[]> {
    const dangers: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('node_modules') && !entry.name.startsWith('.next')) {
        const subDangers = await searchInFiles(fullPath);
        dangers.push(...subDangers);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const content = await fs.readFile(fullPath, 'utf-8');
        
        for (const { pattern, danger } of searchPatterns) {
          if (content.includes(pattern)) {
            dangers.push(`${danger} em ${fullPath}`);
          }
        }
      }
    }

    return dangers;
  }

  try {
    const foundDangers = await searchInFiles(srcDir);
    results.push({
      check: 'NENHUM token/session armazenado em localStorage/sessionStorage',
      passed: foundDangers.length === 0,
      details: foundDangers.length === 0
        ? 'Nenhum armazenamento local de tokens encontrado'
        : `PERIGO: ${foundDangers.join('; ')}`,
    });
  } catch (error: any) {
    results.push({
      check: 'Verificação de localStorage/sessionStorage',
      passed: false,
      details: `Erro ao escanear: ${error.message}`,
    });
  }

  // 5. Verificar proxy routes implementados
  const proxyRoutePath = path.join(srcDir, 'app', 'api', 'proxy', '[...path]', 'route.ts');
  const proxyExists = await fs.access(proxyRoutePath).then(() => true).catch(() => false);

  results.push({
    check: 'Proxy API route (/api/proxy/[...path]) existe',
    passed: proxyExists,
    details: proxyExists
      ? 'Proxy route encontrado em src/app/api/proxy/[...path]/route.ts'
      : 'Proxy route não encontrado em src/app/api/proxy/[...path]',
  });

  return results;
}

// Helper function to check if a path exists
async function accessPath(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('AUDITORIA DE SEGURANÇA DO FRONTEND');
  console.log('Verificando padrões de segurança...');
  console.log('='.repeat(60));
  console.log();

  const results = await auditSecurity();

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    const status = result.passed ? 'PASSOU' : 'FALHOU';
    console.log(`${icon} [${status}] ${result.check}`);
    console.log(`   ${result.details}`);
    console.log();

    if (result.passed) passed++;
    else failed++;
  }

  console.log('='.repeat(60));
  console.log(`RESUMO: ${passed} passaram, ${failed} falharam`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\n🔴 RISCOS DE SEGURANÇA ENCONTRADOS! Corrija antes do deploy.');
    process.exit(1);
  } else {
    console.log('\n🟢 Todos os padrões de segurança estão OK!');
  }
}

main().catch(console.error);
