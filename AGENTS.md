# AGENTS.md

## Repo Shape
- Active code currently lives under `be/`; the root README mentions Nuxt/frontend, but no frontend package or root manifest is present in this checkout.
- Backend entrypoint is `be/src/index.ts`: a minimal Hono app for Bun that exports the app default.
- Drizzle schema source is `be/src/db/schema.ts`; migrations are configured to output to `be/drizzle/`, but no migrations exist yet.

## Commands
- Run backend commands from `be/`, not the repo root.
- Install backend deps: `bun install`.
- Start the backend dev server: `bun run dev`.
- There are no committed `test`, `lint`, `typecheck`, `build`, or Drizzle migration scripts in `be/package.json`; do not invent them as project-standard commands.

## Environment
- `be/src/index.ts` requires `DATABASE_URL` via `process.env.DATABASE_URL`; Bun loads `be/.env` when commands are run from `be/`.
- Root README says to copy `.env.example`, but no `.env.example` is present right now.

## Tooling Notes
- Stack verified from executable files: Bun runtime, Hono, PostgreSQL, Drizzle ORM, Better Auth dependency.
- `be/drizzle.config.ts` reads `DATABASE_URL` directly and points at `./src/db/schema.ts` with PostgreSQL dialect.
- `be/lib/auth.ts` is not wired into the app and imports `@/db`, but `tsconfig.json` does not define a `@` path alias; treat it as unfinished scaffolding.

## Docker Gotcha
- `compose.yaml` and `docker/backend.Dockerfile` reference `services/backend`, which does not exist in this repo layout; do not rely on Docker/Compose until those paths are reconciled with `be/`.
