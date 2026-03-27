<p align="center">
  <a href="https://vercel.com">
    <img src="https://avatars.githubusercontent.com/u/271130245?s=400&u=2259ff9edea9b7ffd9c1151df6cfaea18ed15027&v=4" height="96">
    <h3 align="center">Jacare</h3>
  </a>
</p>

<p align="center">
  Design. Compile. Play. 
</p>
<p align="center">
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#api-reference"><strong>API Reference</strong></a> ·
  <a href="#ecosystem"><strong>Ecosystem</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>

<br/>

## What is this?

Jacare-app-backend is the backend of [Jacare](https://github.com/oJacare) — an open-source visual state machine engine for Unreal Engine 5.

It receives mission graphs from the Canvas editor, validates them for loops and dead-ends (DAG), compiles them into a strict JSON contract with a SHA-256 hash, and serves the result to the Unreal plugin via a secure M2M REST API.

## Ecosystem

| Repository | Role |
|------------|------|
| **jacare-app-backend** ← you are here | Compiler, versioning, and REST API |
| [jacare-app-frontend](../jacare-app-frontend) | Visual graph editor for Game Designers |
| [jacare-app-unreal](../jacare-app-unreal) | UE5 C++ plugin that executes the missions |

## Prerequisites

- Node.js 20+
- PostgreSQL 15+

## Quick Start

```bash
git clone https://github.com/lisboon/jacare-app-backend
cd jacare-app-backend

cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET

npm install
npx prisma migrate dev
npm run start:dev
```

Server starts at `http://localhost:3000`.

## API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/signup` | Create account + organization atomically |
| POST | `/auth/login` | Sign in — returns a JWT |
| GET | `/auth/me` | Current user with org context |

### Missions
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/missions` | Create a mission (status: `DRAFT`) |
| POST | `/missions/:id/versions` | Save a version — computes SHA-256 |
| PUT | `/missions/:id/publish` | Set a version as active |
| GET | `/missions/:id/versions` | List all versions, newest first |
| GET | `/missions/:id/active` | Get the current published version |

### Engine (M2M)

Authenticated via `x-api-key` header. Keys are generated through `/api-keys`.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/missions/engine/:id/active` | Fetch the compiled mission JSON (called by the Unreal plugin) |
| POST | `/api-keys` | Create an engine API key |
| DELETE | `/api-keys/:id` | Revoke a key |

## Stack

NestJS 11 · Prisma · PostgreSQL · DDD + Clean Architecture

## Contributing

Contributions are welcome. Please read [CLAUDE.md](./CLAUDE.md) for architecture conventions before submitting a pull request.
