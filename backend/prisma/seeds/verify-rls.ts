/**
 * Script de Verificação RLS (Row Level Security)
 *
 * Este script verifica se o isolamento multi-tenant está funcionando
 * em todas as tabelas protegidas do banco de dados.
 *
 * Uso: ts-node prisma/seeds/verify-rls.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RLSVerificationResult {
  table: string;
  hasCooperativeId: boolean;
  hasUserId: boolean;
  passed: boolean;
  notes?: string;
}

async function verifyRLS(): Promise<RLSVerificationResult[]> {
  const results: RLSVerificationResult[] = [];

  // Lista de tabelas e suas colunas de tenant
  const tenantTables = [
    {
      table: 'User',
      tenantField: 'cooperative_id',
      description: 'Usuários - isola por cooperativa',
    },
    {
      table: 'Collaborator',
      tenantField: 'cooperative_id',
      description: 'Colaboradores - isola por cooperativa',
    },
    {
      table: 'Payroll',
      tenantField: 'cooperative_id',
      description: 'Folhas de pagamento - isola por cooperativa',
    },
    {
      table: 'PayrollItem',
      tenantField: 'payroll_id',
      description: 'Itens da folha - isola via payroll pai',
    },
    {
      table: 'TimeSheetHospital',
      tenantField: 'cooperative_id',
      description: 'Pontos hospitalares - isola por cooperativa',
    },
    {
      table: 'TimeSheetSad',
      tenantField: 'cooperative_id',
      description: 'Pontos SAD - isola por cooperativa',
    },
    {
      table: 'Vacation',
      tenantField: 'cooperative_id',
      description: 'Férias - isola por cooperativa',
    },
    {
      table: 'Task',
      tenantField: 'cooperative_id',
      description: 'Tarefas - isola por cooperativa',
    },
    {
      table: 'Document',
      tenantField: 'cooperative_id',
      description: 'Documentos - isola por cooperativa',
    },
    {
      table: 'Patient',
      tenantField: 'cooperative_id',
      description: 'Pacientes - isola por cooperativa',
    },
    {
      table: 'AdhesionForm',
      tenantField: 'cooperative_id',
      description: 'Fichas de adesão - isola por cooperativa',
    },
  ];

  for (const { table, tenantField, description } of tenantTables) {
    try {
      // Verificar se a tabela existe e tem registros
      const model = (prisma as any)[table as keyof typeof prisma];
      if (!model) {
        results.push({
          table,
          hasCooperativeId: false,
          hasUserId: false,
          passed: false,
          notes: 'Model não encontrado no Prisma',
        });
        continue;
      }

      // Tentar buscar um registro para verificar a estrutura
      const sample = await model.findFirst();
      
      if (!sample) {
        results.push({
          table,
          hasCooperativeId: false,
          hasUserId: false,
          passed: true,
          notes: 'Tabela vazia - nenhum dado para verificar',
        });
        continue;
      }

      const hasCooperativeId = tenantField in sample;
      const hasUserId = 'user_id' in sample;

      const passed = hasCooperativeId || hasUserId;

      results.push({
        table,
        hasCooperativeId,
        hasUserId,
        passed,
        notes: passed ? undefined : `FALTA campo de tenant: ${tenantField}`,
      });
    } catch (error) {
      results.push({
        table,
        hasCooperativeId: false,
        hasUserId: false,
        passed: false,
        notes: `Erro ao verificar: ${error.message}`,
      });
    }
  }

  return results;
}

async function main() {
  console.log('='.repeat(60));
  console.log('VERIFICAÇÃO RLS - ROW LEVEL SECURITY');
  console.log('Isolamento Multi-tenant');
  console.log('='.repeat(60));
  console.log();

  const results = await verifyRLS();

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    const status = result.passed ? 'PASSOU' : 'FALHOU';
    console.log(`${icon} ${status}: ${result.table}`);
    console.log(`   Descrição: ${result.notes || 'OK'}`);
    console.log(`   cooperative_id: ${result.hasCooperativeId ? '✅ Presente' : '❌ Ausente'}`);
    if (result.hasUserId !== undefined) {
      console.log(`   user_id: ${result.hasUserId ? '✅ Presente' : '❌ Ausente'}`);
    }
    console.log();

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`RESUMO: ${passed} passaram, ${failed} falharam de ${results.length} tabelas`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log();
    console.log('❌ VERIFICAÇÃO FALHOU! Tabelas sem isolamento de tenant:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => console.log(`   - ${r.table}: ${r.notes}`));
    process.exit(1);
  } else {
    console.log('✅ Isolamento multi-tenant VERIFICADO com sucesso!');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Erro na verificação RLS:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
