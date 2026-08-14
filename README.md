# CKS Slavia — Frontend (Next.js)

Panel zawodnika (`/panel`), kadry (`/klub`) i witryna. API przez **Orval** + React Query.

## Wymagania

- Node 22+
- **tylko pnpm** (nie npm / yarn)
- Lokalny backend: `cargo run` w `../slavia-backend` (port **8080**)

## Start

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8080

pnpm install
pnpm dev
```

Z roota workspace (zalecane):

```bash
pnpm fe          # ten projekt
pnpm be          # backend
pnpm sync:api    # OpenAPI → Orval
pnpm sync:slavia # wersja + changelog
```

## Skrypty

| Skrypt | Opis |
|--------|------|
| `pnpm dev` | Next.js dev |
| `pnpm build` / `start` | produkcja |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` / `format:check` | Biome |
| `pnpm biome:ci` | Biome w CI |
| `pnpm knip` | martwy kod (opcjonalnie) |
| `pnpm gen:api` | Orval z lokalnego `openapi/openapi.json` (gitignore; najpierw `pnpm sync:api`) |
| `pnpm sync:version` / `sync:changelog` | sync z `Slavia.toml` |

## OpenAPI / typy

Źródło: backend (utoipa). Po zmianie API z roota:

```bash
pnpm sync:api
```

albo ręcznie:

```bash
cd ../slavia-backend && cargo test export_openapi -- --ignored
cd ../slavia-frontend && pnpm gen:api
```

**Jedyna warstwa HTTP w UI:** `lib/api/generated/**` + `customFetch` — bez ręcznych path stringów. Spec `openapi/openapi.json` jest lokalnym artefaktem (`pnpm sync:api`), nie commitowanym kontraktem.

## Deploy

Vercel — `NEXT_PUBLIC_API_URL` → URL HF Space (np. `https://koliber-cks-slavia.hf.space`). Szczegóły: `../slavia-backend/deploy.md`.

## DevTools

`/klub/devtools` — flagi, AI, stats, trasy, changelog, debug, **React Query**.
