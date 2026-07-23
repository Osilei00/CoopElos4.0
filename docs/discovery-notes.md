# Discovery Notes — [Nome do Produto]
> Arquivo gerado automaticamente durante o workflow /build-saas.
> Fonte de verdade para geração dos PRDs. Não edite manualmente.

## Visão
- **Problema**: Processos de RH e DP de cooperativas hospitalares espalhados em planilhas, WhatsApp, documentos perdidos e prazos dependentes da memória das pessoas
- **Solução**: Centralizar tudo em um único lugar de forma automática e inteligente, com alertas e organização
- **Usuários principais**: Profissionais de RH/DP da cooperativa
- **Pitch**: "É uma plataforma que centraliza e automatiza toda a gestão de RH e DP da cooperativa, transformando processos manuais em uma operação simples, organizada e inteligente."
- **Funcionalidades RH**: Cadastro de cooperados, histórico profissional, controle de férias, comunicação interna
- **Funcionalidades DP**: Controle de folha de pagamento, gerenciamento de ponto e jornadas, emissão de documentos (holerites, declarações), prevenção de erros e multas
- **Referência visual**: app.deel.com (dashboard limpo, gestão de documentos, compliance, UX organizada)
## Funcionalidades
- **Core 1**: Cadastrar e manter atualizados os dados dos cooperados (informações pessoais, documentos, vínculos, funções, contratos)
- **Core 2**: Gerenciar rotinas de RH e DP (folha, ponto, férias, admissões, desligamentos, obrigações legais)
- **Upload de arquivos**: Sim (documentos, imagens, PDFs relacionados a cooperados e DP)
## Monetização
## Técnico
- **Backend**: Node.js + NestJS + PostgreSQL + Prisma + Zod
- **Frontend**: React + Next.js + Chakra UI + Tailwind CSS
- **Auth**: iron-session (MVP) → Auth0/Keycloak depois
- **Infra**: Docker Compose + Railway/Render (MVP) → AWS ECS/K8s depois
- **Fila**: BullMQ + Redis
- **Storage**: S3 (documentos, holerites, contratos)
- **Monitoramento**: Básico no MVP → Grafana/Prometheus depois
- **Extras**: Audit log (obrigatório pra RH/DP)
- **Plataforma**: Web responsivo
## Contexto
- **Wireframes definidos**: Dashboard, Lista de Cooperados, Perfil do Cooperado, Tarefas & Alertas, Folha/DP, Recibo
- **Prazo MVP**: A definir
## PRD — User Stories
### Autenticação & Perfil
- US1: Admin cadastra usuários do sistema (email, nome, perfil de acesso)
- US2: Admin recupera senha de usuário — exclui a atual e gera uma nova temporária

### Cooperados
- US3: Cadastrar cooperado (dados pessoais, documentos, vínculo)
- US3.1: Preencher ficha de adesão completa com todas as seções (dados pessoais, cadastro, bancários, atividades profissionais, documentação, declarações, assinatura)
- US3.2: Fazer upload da Declaração de Adesão assinada (PDF) e visualizá-la/baixá-la pela lista de cooperados
- US3.3: Fazer upload da Declaração de Quitação (comprovante de quitação de dívidas) e visualizá-la/baixá-la
- US4: Buscar e filtrar cooperados (nome, CPF, setor, status)
- US5: Visualizar perfil completo com abas (Dados, Documentos, Folha, Férias, Histórico)
- US6: Editar dados do cooperado
- US7: Upload de documentos do cooperado

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

### Contribuições Financeiras
- US19: Registrar contribuição mensal do cooperado (valor flexível)
- US20: Visualizar dashboard financeiro com totais por mês e cooperados
- US21: Gerar e baixar recibo PDF da contribuição
- US22: Filtrar contribuições por mês, ano, cooperado e status

### Tarefas & Alertas
- US15: Ver lista de tarefas/alertas com prazos
- US16: Filtrar tarefas por período (hoje, semana, atrasadas)
- US17: Marcar tarefas como concluídas

### Auditoria
- US18: Log de todas as ações no sistema
## PRD — Requisitos Funcionais
## PRD — Requisitos Não-Funcionais
## Database — Entidades e Relações
- `cooperado`: Tabela com dados completos dos cooperados (importada de CSV do Bubble). Inclui campos de controle `cooperado_number` (Int, auto-numerado), `status` (String, default "active"), `declaracao_adesao_url` (Text, URL do PDF da declaração assinada), `recibo_contribuicao_url` (Text, URL do recibo de contribuição) e `declaracao_quitacao_url` (Text, URL da declaração de quitação). Relaciona-se com `cooperative` via `cooperative_id`.
- `contribuicao`: Registro de contribuições mensais dos cooperados. Campos: `cooperado_id`, `mes`, `ano`, `valor`, `status`, `observacao`. Unique constraint em (cooperado_id, mes, ano).
## Backend — Endpoints e Integrações
## Backend — Agent Graph
## Frontend — Páginas e Componentes
### Páginas
- **Dashboard**: Boas-vindas, cards (cooperados ativos, pendências DP, documentos a vencer), menu lateral fixo
- **Lista de Cooperados**: Busca (nome, CPF, email), ordenação por # ou Nome, tabela com #/nome/CPF/cargo/status/ações (Visualizar, Editar, Declaração de Adesão PDF, Excluir). Ícone de Declaração gera PDF dinâmico com dados do cooperado. Dados da tabela `cooperado`.
- **Ficha de Edição do Cooperado**: Formulário completo com dados pessoais, documentos, e seção de uploads (Declaração de Adesão, Recibo de Contribuição, Declaração de Quitação).
- **Perfil do Cooperado**: Foto, status, abas (Dados, Documentos, Folha, Férias, Histórico), botões (Editar, Gerar documento, Enviar para assinatura)
- **Tarefas & Alertas**: Filtros (Hoje, Esta semana, Atrasadas, Todas), lista com checkbox/título/prazo/botão ver
- **Folha/DP**: Seletor de mês, botões (Gerar folha, Exportar, Ver pendências), cards (cooperados na folha, pendências, eSocial), tabela (nome/cargo/salário/horas/descontos/líquido)
- **Folha de Ponto (Hospitalar)**: Tabela matricial — linhas (Nome + Horário), colunas (Dia 1 a Dia 28), célula com código de escala, coluna "Total de Horas"
  - Códigos: M (Manhã 6h), T (Tarde 6h), SN (Noturno 12h), D (Diurno 8h), F (Folga), . (Sem plantão)
  - Um cooperado pode ter múltiplas linhas se tiver múltiplos horários
  - Legenda visível com códigos e horas
- **Folha de Ponto SAD (Atendimento Domiciliar)**: Cabeçalho com dados da cooperativa, filtros (Mês, Paciente, Exportar PDF)
  - Tabelas agrupadas por Paciente (P001, P002, etc.) com nome do paciente no cabeçalho
  - Colunas: ORDEM, PROFISSIONAL, FUNÇÃO, SETOR, MT (Manhã), N (Noturno), 6x1, BRUTO, ALIM, COTA, TAXA, LÍQUIDO
  - Linhas: Profissionais alocados por paciente com valores calculados
  - Totais por tabela (Bruto, Taxas, Líquido)
  - Linhas vazias com valores zerados e taxa fixa (R$ 50,00)
  - Exportação PDF por paciente ou geral
- **Recibo**: Cabeçalho com logo + botões (Baixar PDF, Imprimir), cards (Dados cooperativa, Valor recebido, Produção executada, Especificações, Identificação cooperado, Descontos), rodapé com assinatura
- **Contribuições Financeiras**: Dashboard com cards de resumo (total recebido, cooperados contribuintes, mês atual), gráfico de barras por mês, tabela com detalhes, modal para nova contribuição, geração de recibo PDF
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
- Sidebar fixa com navegação (Dashboard, Cooperados, Folha de Pagamento, Ponto Hospitalar, Ponto SAD, Pacientes, Férias, Contribuições, Tarefas, Auditoria, Usuários, Configurações)
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
