# PRD — Frontend (CoopElos)

## Resumo do Produto
Interface web responsiva para gestão de RH/DP. Estilo limpo inspirado no Deel, com sidebar fixa, cards e tabelas organizadas.

## Requisitos Funcionais (Frontend)
- **Dashboard**: Cards de resumo, pendências, alertas.
- **Colaboradores**: Lista com busca/filtros, perfil em abas, ficha de adesão.
- **Folha**: Tabelas editáveis, visualização de matriz hospitalar e SAD.
- **Tarefas**: Lista com filtros de período, marcação de conclusão.
- **Upload**: Drag & drop ou seletor de arquivos com preview.
- **Exportação**: Botões para PDF/Excel com feedback de "processando".

## Mapa de Páginas (App Router)
- `/login` — Autenticação
- `/dashboard` — Visão geral
- `/collaborators` — Lista de colaboradores
- `/collaborators/[id]` — Perfil (Dados, Documentos, Folha, Férias, Histórico)
- `/cooperados` — Lista de cooperados (ficha_cooperado_form)
- `/payroll` — Lista de folhas
- `/payroll/[id]` — Detalhes da folha
- `/timesheets/hospital` — Matriz hospitalar
- `/timesheets/sad` — Tabelas SAD por paciente
- `/patients` — Gestão de pacientes
- `/vacations` — Controle de férias
- `/tasks` — Tarefas e alertas
- `/audit` — Logs (admin)
- `/users` — Gestão de usuários (admin)
- `/settings` — Configurações

## Árvore de Componentes
- `Layout`: Sidebar, Header, MainContent, Footer
- `UI`: Card, Table, Input, Select, Button, Modal, Toast, Skeleton, Badge, Tabs, Accordion
- `Feature`: CollaboratorCard, PayrollTable, TimeSheetMatrix, TaskItem, FileUploader, SearchBar

## Design System
- **Estilo**: Deel-inspired, muito espaço em branco, tipografia leve.
- **Paleta**: Base #FFFFFF, Divisórias #E5E7EB, Texto #374151, Destaque #2563EB, Positivo #059669, Negativo #DC2626.
- **Tipografia**: Inter (títulos SemiBold, corpo Regular), JetBrains Mono (valores).
- **Componentes**: Cards radius 8px, botões radius 6px, hover suave.

## Auth Flow
- Login → POST `/api/auth/login` → iron-session cookie.
- Middleware Next.js protege rotas `/app/*`.
- Sessão incluída em requests via cookie (proxy auth).

## API Integration Layer
- `fetch` wrapper com interceptador de sessão.
- SWR/React Query para cache e revalidação.
- Hooks: `useCollaborators`, `useCooperados`, `usePayrolls`, `useTasks`, `useSession`.

## Requisitos Não-Funcionais
- Responsivo (mobile/tablet/desktop).
- Loading states e skeletons.
- Feedback visual (toast) para ações.
- Acessibilidade (WCAG AA).

## Security Checklist
- [ ] Sem dados sensíveis no localStorage.
- [ ] CSRF protection via iron-session.
- [ ] Sanitização de inputs antes do envio.
- [ ] Validação client-side com Zod.

## Stack
- Next.js 16 App Router
- TypeScript
- Chakra UI / Material UI
- React Query / SWR
- Zod
- iron-session
