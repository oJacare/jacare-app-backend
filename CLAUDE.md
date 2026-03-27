# jacare-app-backend

NestJS 11 · Prisma · PostgreSQL · DDD + Clean Architecture. The compiler and API layer of Jacare Flow.

## Mandatory Rule: Keep Skills Up to Date

**After ANY interaction with this project** — reading code, creating use cases, fixing bugs, refactoring, or answering questions — **you MUST update the corresponding skill** in `.claude/skills/`.

This includes:
- **New use case, entity, or route** → update `/jacare-backend`
- **New Node Type in the catalog** → update `/new-jacare-mission-type`
- **DTO or JSON contract change** → update `/jacare-backend` AND `/new-jacare-mission-type`
- **New pattern, guard, or error type** → update `/jacare-backend`
- **Prisma schema change** → update `/jacare-backend`

**Skills are the living source of truth. Stale skills corrupt future interactions.**

---

## Context

**Jacare Flow** is an open-source visual state machine engine for UE5. This backend (Jacare Maestro) is the compiler and API: receives mission graphs from the Canvas, validates the DAG, generates a SHA-256 hash, persists versions, and serves the compiled JSON contract to the Unreal plugin via a secure M2M REST API.

Current phase: **Phase 2 complete → supporting Phase 3 (Canvas)**.

---

## Architecture

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
│       └── prisma.instance.ts   # Manual Prisma singleton (the one in use)
└── modules/
    ├── @shared/domain/
    │   ├── entity/        # BaseEntity with Notification pattern
    │   ├── errors/        # NotFoundError, EntityValidationError
    │   └── events/        # EventDispatcher
    ├── account/           # User, Organization, Member, Invite
    ├── engine/            # OrganizationApiKey (M2M auth)
    └── missions/          # Mission, MissionVersion, DialogueTree
```

### Layer responsibilities

| Layer | Belongs here | Never here |
|-------|-------------|------------|
| `domain/` | Pure TypeScript — entities, validation, business rules | NestJS, Prisma, any external lib |
| `gateway/` | Persistence interface (contract) | Implementation |
| `repository/` | Prisma implementation of gateway | Business logic |
| `usecase/` | Orchestration — one file per use case | Direct Prisma queries |
| `facade/` | Single entry point for the module (Service Locator) | Logic |
| `factory/` | Instantiates use cases with injected dependencies | Framework code |
| `infra/http/` | Controllers, Guards, Filters | Business rules |

---

## Conventions

### File naming
```
[name].entity.ts
[name].usecase.ts
[name].usecase.dto.ts
[name].gateway.ts
[name].repository.ts
[name].facade.ts
[name].facade.factory.ts
```

### Class naming
```typescript
MissionEntity          // domain entity
SaveVersionUseCase     // use case
MissionGateway         // persistence interface
MissionRepository      // Prisma implementation
MissionFacade          // module entry point
MissionFacadeFactory   // DI factory
```

### DTOs
- Contract interface: `SaveVersionInputDto` / `SaveVersionOutputDto`
- Each use case has its own `.usecase.dto.ts` file
- DTOs are pure TypeScript interfaces — no framework decorators

### Enums
```typescript
EMissionStatus.DRAFT | REVIEW | APPROVED | ARCHIVED
EMemberRole.ADMIN | DESIGNER | VIEWER
EPlayerMissionStatus.ACTIVE | COMPLETED | FAILED | ABANDONED
```

### Path alias
`@/*` → `./src/*`

---

## Patterns

### Factory DI
```typescript
// Factory composes everything without NestJS DI
MissionFacadeFactory.create()

// NestJS module uses useFactory:
{ provide: MissionFacade, useFactory: () => MissionFacadeFactory.create() }
```

### Typed errors
| Error | HTTP | When to use |
|-------|------|-------------|
| `NotFoundError` | 404 | Entity not found |
| `EntityValidationError` | 422 | Domain validation failed |
| `new Error()` | 500 | Genuine data corruption — reserved |

### Atomic writes
Any operation touching multiple tables uses `prisma.$transaction()`.
Canonical reference: `account/repository/` — `createSignupAtomically()`.

### JWT auth
- Payload: `{ memberId, organizationId, role }`
- `JWT_SECRET` is required — throws `Error` if missing, no fallback

### M2M auth (Unreal Plugin)
- Format: `jcr_live_{32bytes_hex}`
- Stored as SHA-256 (plaintext never persisted)
- Header: `x-api-key`
- Scoped to `organizationId` — a key from one org cannot access another

### Node Types (Gameplay Tags)
The `type` field on each node follows `Category.Action`:
```
Spawn.Actor | Objective.Kill | Objective.Goto | Objective.Collect | Objective.Interact
Condition.And | Condition.Or | Condition.Not | Condition.Time | Condition.Faction
Dialogue.Tree | Dialogue.Node | Cinematic.Play | Audio.Play
Reward.Give | Flag.Set | Flow.Wait | Flow.Branch | Flow.Custom
```

---

## API Reference

Import `docs/insomnia.json` into Insomnia for the full collection with example payloads and environment variables.

Quick reference:

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/signup` | — | Create account + org atomically |
| POST | `/auth/login` | — | Sign in — returns JWT |
| GET | `/auth/me` | JWT | Current member with org context |
| POST | `/missions` | JWT · DESIGNER | Create a mission (status: DRAFT) |
| POST | `/missions/:id/versions` | JWT · DESIGNER | Save version — computes SHA-256 |
| PUT | `/missions/:id/publish` | JWT · DESIGNER | Set a version as active |
| GET | `/missions/:id/versions` | JWT · VIEWER | List all versions, newest first |
| GET | `/missions/:id/active` | JWT · VIEWER | Current published version |
| GET | `/missions/engine/:id/active` | x-api-key | Compiled JSON for the Unreal plugin |
| POST | `/api-keys` | JWT · ADMIN | Create an engine API key |
| GET | `/api-keys` | JWT | List org's API keys |
| DELETE | `/api-keys/:id` | JWT · ADMIN | Revoke a key |

---

## Commands

```bash
npm run start:dev                                      # Dev server (watch)
npm run build                                          # Production build
npm run start:prod                                     # Run production build
npx prisma generate                                    # Regenerate client after schema changes
npx prisma migrate dev --name migration_name           # Create a new migration
npx prisma studio                                      # Database GUI
npm run test                                           # Unit tests
npm run test:e2e                                       # E2E tests
```

---

## Skills (Slash Commands)

| Skill | When to use |
|-------|-------------|
| `/review` | Full architecture review before a PR |
| `/commit` | Generate a Conventional Commits message |
| `/new-jacare-mission-type` | Cross-ecosystem scaffold for a new Node Type |

---

## Rules (Contextual)

Path-specific rules to create in `.claude/rules/`:
- `architecture.md` — Domain layer rules (`src/modules/**/domain/**`)
- `controllers.md` — HTTP layer rules (`src/infra/http/**`)

---

## Setup

```bash
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET

npm install
npx prisma migrate dev
npm run start:dev
```

### Required environment variables
```
DATABASE_URL=postgresql://user:pass@localhost:5432/jacare
JWT_SECRET=...        # Required — app won't start without this
NODE_ENV=development  # Controls Prisma log verbosity
```
