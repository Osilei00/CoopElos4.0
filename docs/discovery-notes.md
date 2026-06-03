# Discovery Notes — [Nome do Produto]
> Arquivo gerado automaticamente durante o workflow /build-saas.
> Fonte de verdade para geração dos PRDs. Não edite manualmente.

## Visão
- **Problema**: Processos de RH e DP de cooperativas hospitalares espalhados em planilhas, WhatsApp, documentos perdidos e prazos dependentes da memória das pessoas
- **Solução**: Centralizar tudo em um único lugar de forma automática e inteligente, com alertas e organização
- **Usuários principais**: Profissionais de RH/DP da cooperativa
- **Pitch**: "É uma plataforma que centraliza e automatiza toda a gestão de RH e DP da cooperativa, transformando processos manuais em uma operação simples, organizada e inteligente."
- **Funcionalidades RH**: Cadastro de colaboradores, histórico profissional, controle de férias, comunicação interna
- **Funcionalidades DP**: Controle de folha de pagamento, gerenciamento de ponto e jornadas, emissão de documentos (holerites, declarações), prevenção de erros e multas
- **Referência visual**: app.deel.com (dashboard limpo, gestão de documentos, compliance, UX organizada)
## Funcionalidades
- **Core 1**: Cadastrar e manter atualizados os dados dos colaboradores (informações pessoais, documentos, vínculos, funções, contratos)
- **Core 2**: Gerenciar rotinas de RH e DP (folha, ponto, férias, admissões, desligamentos, obrigações legais)
- **Upload de arquivos**: Sim (documentos, imagens, PDFs relacionados a colaboradores e DP)
## Monetização
## Técnico
- **Backend**: Node.js + NestJS + PostgreSQL + Prisma + Zod
- **Frontend**: React + Next.js + Chakra UI / Material UI
- **Auth**: Lucia Auth / NextAuth (MVP) → Auth0/Keycloak depois
- **Infra**: Docker Compose + Railway/Render (MVP) → AWS ECS/K8s depois
- **Fila**: BullMQ + Redis
- **Storage**: S3 (documentos, holerites, contratos)
- **Monitoramento**: Básico no MVP → Grafana/Prometheus depois
- **Extras**: Audit log (obrigatório pra RH/DP)
- **Plataforma**: Web responsivo
## Contexto
- **Wireframes definidos**: Dashboard, Lista de Colaboradores, Perfil do Colaborador, Tarefas & Alertas, Folha/DP, Recibo
- **Prazo MVP**: A definir
## PRD — User Stories
### Autenticação & Perfil
- US1: Admin cadastra usuários do sistema (email, nome, perfil de acesso)
- US2: Admin recupera senha de usuário — exclui a atual e gera uma nova temporária

### Colaboradores
- US3: Cadastrar colaborador (dados pessoais, documentos, vínculo)
- US3.1: Preencher ficha de adesão completa com todas as seções (dados pessoais, cadastro, bancários, atividades profissionais, documentação, declarações, assinatura)
- US4: Buscar e filtrar colaboradores (nome, CPF, setor, status)
- US5: Visualizar perfil completo com abas (Dados, Documentos, Folha, Férias, Histórico)
- US6: Editar dados do colaborador
- US7: Upload de documentos do colaborador

### Folha & DP
- US8: Gerar folha de pagamento por mês
- US9: Visualizar tabela da folha (salário, horas, descontos, líquido)
- US10: Exportar folha em PDF/Excel
- US11: Gerenciar ponto e jornadas
  - US11.1: Folha hospitalar (tabela matricial com códigos de escala, cálculo automático de horas)
  - US11.2: Folha SAD (tabelas agrupadas por paciente, cálculo de produção, taxas, brutos e líquidos)
- US12: Gerar recibos e holerites

### Férias
- US14: Registrar e acompanhar férias

### Tarefas & Alertas
- US15: Ver lista de tarefas/alertas com prazos
- US16: Filtrar tarefas por período (hoje, semana, atrasadas)
- US17: Marcar tarefas como concluídas

### Auditoria
- US18: Log de todas as ações no sistema
## PRD — Requisitos Funcionais
## PRD — Requisitos Não-Funcionais
## Database — Entidades e Relações
## Backend — Endpoints e Integrações
## Backend — Agent Graph
## Frontend — Páginas e Componentes
### Páginas
- **Dashboard**: Boas-vindas, cards (colaboradores ativos, pendências DP, documentos a vencer), menu lateral fixo
- **Lista de Colaboradores**: Busca (nome, CPF, setor), filtros (status, setor, vínculo), tabela com foto/nome/cargo/setor/status/ações
- **Perfil do Colaborador**: Foto, status, abas (Dados, Documentos, Folha, Férias, Histórico), botões (Editar, Gerar documento, Enviar para assinatura)
- **Tarefas & Alertas**: Filtros (Hoje, Esta semana, Atrasadas, Todas), lista com checkbox/título/prazo/botão ver
- **Folha/DP**: Seletor de mês, botões (Gerar folha, Exportar, Ver pendências), cards (colaboradores na folha, pendências, eSocial), tabela (nome/cargo/salário/horas/descontos/líquido)
- **Folha de Ponto (Hospitalar)**: Tabela matricial — linhas (Nome + Horário), colunas (Dia 1 a Dia 28), célula com código de escala, coluna "Total de Horas"
  - Códigos: M (Manhã 6h), T (Tarde 6h), SN (Noturno 12h), D (Diurno 8h), F (Folga), . (Sem plantão)
  - Um colaborador pode ter múltiplas linhas se tiver múltiplos horários
  - Legenda visível com códigos e horas
- **Folha de Ponto SAD (Atendimento Domiciliar)**: Cabeçalho com dados da cooperativa, filtros (Mês, Paciente, Exportar PDF)
  - Tabelas agrupadas por Paciente (P001, P002, etc.) com nome do paciente no cabeçalho
  - Colunas: ORDEM, PROFISSIONAL, FUNÇÃO, SETOR, MT (Manhã), N (Noturno), 6x1, BRUTO, ALIM, COTA, TAXA, LÍQUIDO
  - Linhas: Profissionais alocados por paciente com valores calculados
  - Totais por tabela (Bruto, Taxas, Líquido)
  - Linhas vazias com valores zerados e taxa fixa (R$ 50,00)
  - Exportação PDF por paciente ou geral
- **Recibo**: Cabeçalho com logo + botões (Baixar PDF, Imprimir), cards (Dados cooperativa, Valor recebido, Produção executada, Especificações, Identificação cooperado, Descontos), rodapé com assinatura
- **Ficha de Adesão**: Cabeçalho com logo + botões (Baixar PDF, Imprimir), seções:
  - Dados de quem indicou (Nome, Celular, E-mail)
  - Dados Pessoais (Nome Completo, RG, CPF, Nascimento, Estado Civil, Naturalidade, Nacionalidade, Sexo, Escolaridade, Nome do Pai/Mãe/Cônjuge)
  - Dados de Cadastro (Endereço, Bairro, Complemento, CEP, Cidade, Estado, Tel Residencial, Celular, E-mail)
  - Dados Bancários e Comerciais (Banco, Agência, Conta, Empresa/Trabalho, Cargo, Admissão, Salário)
  - Atividades Profissionais (checkboxes com 30+ opções: enfermagem, limpeza, segurança, contabilidade, saúde, psicologia, fisioterapia, medicina, odontologia, assistência social, etc + campo "Outros")
  - Documentação (checkboxes para upload de PDFs: Carteira conselho, Atestados/certificados, Currículo, Descrição especialidade)
  - Cadastro do Cooperado (Local atendimento, Data cadastro, Matrícula, Capital Social, Valor integralizado, Data, Visto Diretor Presidente)
  - Declarações (3 termos de responsabilidade)
  - Assinatura

### Layout
- Sidebar fixa com navegação
- Header com logo + foto do usuário
- Conteúdo principal com cards e tabelas
- Rodapé minimalista
## Frontend — Design System
- **Estilo**: Inspirado no Deel — muito espaço em branco, tipografia leve, ícones minimalistas, cards com bordas suaves, navegação lateral fixa
- **Paleta**:
  - Base: Branco (#FFFFFF)
  - Divisórias: Cinza claro (#E5E7EB)
  - Textos: Cinza escuro (#374151) / #111827
  - Destaques: Azul profissional (#2563EB)
  - Positivos: Verde (#059669)
  - Negativos: Vermelho suave (#DC2626)
- **Tipografia**: Inter (títulos SemiBold, conteúdo Regular), JetBrains Mono para valores monetários
- **Componentes**: Cards (radius 8px, shadow-sm), botões (borda fina, radius 6px, hover azul claro), tabelas estilizadas, tooltips em valores, accordions em mobile
- **Layout**: Largura máx 900px para documentos, margens 32px, responsivo (1 coluna em telas pequenas)
- **Sensação**: Profissionalismo, clareza, organização, confiabilidade, estética moderna (Deel + Notion + Stripe Dashboard)
## Security — Decisões
