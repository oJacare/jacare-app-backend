# jacare-app-backend

NestJS 11 + DDD estrito + Prisma + PostgreSQL. Compilador e API do Jacare Flow.

## REGRA OBRIGATÓRIA: Manter Skills Atualizadas

**Após QUALQUER interação com o projeto** — leitura de código, criação de use cases, correção de bugs, refatoração ou resposta a perguntas — **você DEVE atualizar a skill correspondente** em `.claude/skills/`.

Isso inclui:
- **Novo use case, entidade ou rota** → atualizar skill do módulo (`/jacare-backend`)
- **Novo Node Type no catálogo** → atualizar `/new-jacare-mission-type`
- **Mudança em DTO ou contrato JSON** → atualizar `/jacare-backend` E `/new-jacare-mission-type`
- **Novo padrão, guard ou erro** → atualizar `/jacare-backend`
- **Mudança no schema Prisma** → atualizar `/jacare-backend`

**As skills são a fonte de verdade viva. Skills desatualizadas corrompem futuras interações.**

---

## Contexto

**Jacare Flow** é uma State Machine Engine open-source para UE5. Este backend (Jacare Maestro) é o compilador e API: recebe grafos do Canvas, valida DAG, gera SHA-256, persiste versões e serve o contrato JSON para a Unreal via HTTP M2M.

Fase atual: **Fase 2 concluída → suportando Fase 3 (Canvas)**.

---

## Arquitetura

```
src/
├── infra/
│   ├── http/
│   │   ├── account/      # POST /auth/signup|login, GET /auth/me
│   │   ├── auth/         # Guards: JwtAuthGuard, EngineAuthGuard, RolesGuard
│   │   ├── engine/       # GET /missions/engine/:id/active (M2M), CRUD /api-keys
│   │   ├── missions/     # CRUD /missions, /versions, /publish
│   │   └── shared/
│   │       └── errors/   # NotFoundErrorFilter, EntityValidationErrorFilter
│   └── database/
│       └── prisma.instance.ts   # Singleton manual do PrismaClient (o usado)
└── modules/
    ├── @shared/domain/
    │   ├── entity/        # BaseEntity com Notification pattern
    │   ├── errors/        # NotFoundError, EntityValidationError
    │   └── events/        # EventDispatcher
    ├── account/           # User, Organization, Member, Invite
    ├── engine/            # OrganizationApiKey (M2M auth)
    └── missions/          # Mission, MissionVersion, DialogueTree
```

### Camadas (DDD estrito)

| Camada | O que vai aqui | O que nunca vai aqui |
|--------|---------------|----------------------|
| `domain/` | Entidade pura TypeScript, validação, regras de negócio | NestJS, Prisma, qualquer lib externa |
| `gateway/` | Interface (contrato) de persistência | Implementação |
| `repository/` | Implementação Prisma do gateway | Lógica de negócio |
| `usecase/` | Orquestração — um arquivo por caso de uso | Queries Prisma diretas |
| `facade/` | Ponto de entrada único do módulo (Service Locator) | Lógica |
| `factory/` | Instancia use cases injetando dependências | Framework code |
| `infra/http/` | Controllers, Guards, Filters | Regras de negócio |

---

## Convenções

### Nomenclatura de arquivos
```
[nome].entity.ts
[nome].usecase.ts
[nome].usecase.dto.ts
[nome].gateway.ts
[nome].repository.ts
[nome].facade.ts
[nome].facade.factory.ts
```

### Nomenclatura de classes
```typescript
MissionEntity          // entidade de domínio
SaveVersionUseCase     // caso de uso
MissionGateway         // interface de persistência
MissionRepository      // implementação Prisma
MissionFacade          // ponto de entrada do módulo
MissionFacadeFactory   // factory de DI
```

### DTOs
- Interface de contrato: `SaveVersionInputDto` / `SaveVersionOutputDto`
- Cada use case tem seu próprio `.usecase.dto.ts`
- DTOs são interfaces TypeScript puras — sem decorators de framework

### Enums (Prisma + TypeScript)
```typescript
EMissionStatus.DRAFT | REVIEW | APPROVED | ARCHIVED
EMemberRole.ADMIN | DESIGNER | VIEWER
EPlayerMissionStatus.ACTIVE | COMPLETED | FAILED | ABANDONED
```

### Path alias
`@/*` → `./src/*`

---

## Padrões

### Factory DI
```typescript
// factory instancia tudo sem NestJS DI
MissionFacadeFactory.create()  // compõe gateway → usecase → facade

// módulo NestJS usa useFactory:
{ provide: MissionFacade, useFactory: () => MissionFacadeFactory.create() }
```

### Erros tipados
| Erro | HTTP | Quando usar |
|------|------|-------------|
| `NotFoundError` | 404 | Entidade não encontrada |
| `EntityValidationError` | 422 | Validação de domínio falhou |
| `new Error()` | 500 | Corrupção de dados real (reservado) |

### Operações atômicas
Qualquer escrita em múltiplas tabelas usa `prisma.$transaction()`.
Referência canônica: `account/repository/` — `createSignupAtomically()`.

### Auth JWT
- Payload: `{ memberId, organizationId, role }`
- `JWT_SECRET` obrigatório — lança `Error` se ausente, sem fallback

### Auth M2M (Unreal Plugin)
- Formato: `jcr_live_{32bytes_hex}`
- Armazenado como SHA-256 (nunca o key em texto puro)
- Header: `x-api-key`
- Isolado por `organizationId`

### Node Types (Gameplay Tags)
O campo `type` de cada nó segue `Categoria.Acao`:
```
Spawn.Actor | Objective.Kill | Objective.Goto | Objective.Collect | Objective.Interact
Condition.And | Condition.Or | Condition.Not | Condition.Time | Condition.Faction
Dialogue.Tree | Dialogue.Node | Cinematic.Play | Audio.Play
Reward.Give | Flag.Set | Flow.Wait | Flow.Branch | Flow.Custom
```

---

## Comandos

```bash
npm run start:dev     # Dev server (watch)
npm run build         # Production build
npm run start:prod    # Rodar build de produção
npx prisma generate   # Regenerar Prisma client após schema change
npx prisma migrate dev --name nome_da_migracao   # Nova migration
npx prisma studio     # GUI do banco
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run lint          # ESLint
```

---

## Skills (Slash Commands)

| Skill | Quando usar |
|-------|-------------|
| `/review` | Review completo de arquitetura antes de PR |
| `/commit` | Gerar commit message em Conventional Commits |
| `/new-jacare-mission-type` | Scaffold cross-ecosystem para novo Node Type |

---

## Rules (Contextuais)

Rules path-specific a criar em `.claude/rules/`:
- `architecture.md` — Regras do domain layer (`src/modules/**/domain/**`)
- `controllers.md` — Regras do HTTP layer (`src/infra/http/**`)

---

## Tech Debt Conhecido

1. `PrismaService` (NestJS) definido mas não usado — só o singleton `prisma.instance.ts` é utilizado
2. `EventDispatcher` + domain events definidos mas sem listeners ativos
3. Camada Service é proxy inútil — delega tudo para Facade, pode ser removida
4. Zero testes unitários (1 e2e trivial)
5. Sem rate limiting nos endpoints

---

## Setup Local

```bash
cp .env.example .env
# Preencher DATABASE_URL e JWT_SECRET

npm install
npx prisma generate
npx prisma migrate dev

npm run start:dev
```

### Variáveis obrigatórias
```
DATABASE_URL=postgresql://user:pass@localhost:5432/jacare
JWT_SECRET=...          # Obrigatório — app não sobe sem este
NODE_ENV=development    # Controla log level do Prisma
```
