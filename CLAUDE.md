# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

ApplyPilot is a monorepo for a job-application tracker. The git root is the repo root (parent of `be/`).

- `be/` — Backend: Hono on the Bun runtime, PostgreSQL via Drizzle ORM. Run all backend commands from here, not the repo root.
- `fe/` — Frontend: Nuxt 4 (Vue 3) with shadcn-vue (reka-ui), Tailwind v4, Phosphor icons. Run all frontend commands from here.
- `docker/`, `compose.yaml` — Containerization (currently broken; see below).
- `README.md` — Product overview, full DB schema reference, and the intended REST API contract.
- `AGENTS.md` — Earlier agent notes; partially stale (it predates `fe/` and claims no frontend exists — that is no longer true).

## Commands

Neither app defines `test`, `lint`, or `typecheck` scripts — do not invent or assume them as project-standard commands. There are no tests yet.

### Backend (`cd be`)
- Install: `bun install`
- Dev server: `bun run dev` (runs `bun run --hot src/index.ts`, serves on `:3000`)
- Drizzle Kit is a devDependency with no npm script wrapper — invoke it directly, e.g. `bunx drizzle-kit generate` / `push` / `migrate`. Migrations output to `be/drizzle/` (no migrations committed yet).

### Frontend (`cd fe`)
- Install: `bun install` (the `postinstall` runs `nuxt prepare`)
- Dev server: `bun run dev` (Nuxt dev, `:3000`)
- Build / static generate / preview: `bun run build` / `bun run generate` / `bun run preview`

## Environment

- The backend requires `DATABASE_URL` (`process.env.DATABASE_URL`, asserted non-null in `src/index.ts` and `drizzle.config.ts`). Bun auto-loads `be/.env` when commands run from `be/`.
- `be/.env` currently also holds `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (Better Auth is a dependency but is not wired in — see "Unfinished scaffolding").
- Both `be/.gitignore` and `fe/.gitignore` ignore `.env*`. There is **no committed `.env.example`** anywhere despite the README mentioning one — create values from the env keys above.

## Architecture

### Backend (early scaffold)
- Entry: `be/src/index.ts` is a minimal Hono app exporting `default app` (Bun serves it). It currently only has a `GET /` health-check route returning `"Hello Hono!"`.
- The Drizzle client is constructed inline in `index.ts` (`drizzle(process.env.DATABASE_URL!)` using the `node-postgres` driver). There is **no `db` instance module** — `src/db/` contains only `schema.ts`.
- Schema: `be/src/db/schema.ts` defines four tables — `users`, `companies`, `applications`, `application_notes` — plus the `application_status` pgEnum. Snake_case DB columns map to camelCase TS fields (e.g. `user_id` → `userId`). `applications.companyId` has no `onDelete` rule; `userId` and the notes FK cascade on delete.
- **No route handlers exist yet.** The REST contract in `README.md` (`POST/GET/PATCH /applications`, `PATCH /applications/:id/status`, `DELETE /applications/:id`) is the intended design, not implemented behavior. Treat the README as a spec to build toward.

### Frontend (UI shell, not yet connected to backend)
- Nuxt 4 `app/` directory layout. Routes map to `app/pages/`: `/` (marketing landing, `definePageMeta({ layout: false })`), `/dashboard`, `/applications` (list), `/applications/new`, `/applications/[id]` (detail/edit). `app/layouts/default.vue` provides the sidebar shell.
- UI: shadcn-nuxt with **empty prefix** (components are `<Button>`, `<Card>`, not `<UiButton>`), `new-york` style, `zinc` base color, `phosphor` icon library. Components live in `app/components/ui/*` (generated via shadcn-vue; `fe/.mcp.json` configures the shadcn MCP). `cn()` helper is in `app/lib/utils.ts`.
- Nuxt **auto-imports** are relied on throughout — `useState`, `useRoute`, `computed`, `definePageMeta`, `NuxtLink`, etc. are used without explicit imports by design; don't "fix" these as missing imports.
- **State is mocked.** `app/composables/useApplications.ts` serves hardcoded `INITIAL_APPLICATIONS` via Nuxt `useState` (in-memory only, resets on reload). There is **no `$fetch`/`useFetch`/`useAsyncData`/API base URL anywhere in `fe/app`** — wiring the frontend to the backend API is a pending task.

## Gotchas

- **Status contract mismatch.** The frontend `ApplicationStatus` type is `'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected'`, but the backend `application_status` enum is `wishlist | applied | interview | offer | rejected | archived`. These two must be reconciled before connecting FE to BE.
- **Unfinished auth scaffolding.** `be/lib/auth.ts` imports `@/db`, but `tsconfig.json` defines no `@/*` path alias and no `db` instance module exists. It is not imported by `index.ts`. Either finish it (add the alias + a `src/db/index.ts` exporting `db`) or ignore it.
- **Docker does not build.** `docker/backend.Dockerfile` and `compose.yaml` reference `services/backend/` (this repo uses `be/`), and call `bun storage:link` / `bun start` — scripts that don't exist in `be/package.json`. `docker/frontend.Dockerfile` assumes a root-level frontend manifest, but the frontend lives in `fe/`. Do not rely on Docker/Compose until these paths are reconciled.
