# Project rules (read before coding)

## Architecture
- Frontend: React + TypeScript, component-first, no business logic in UI components.
- Backend: Java (Spring Boot), boundaries: controller -> service -> domain -> repository.
- Contracts: REST OpenAPI-first; DTOs separate from domain.

## Code quality
- Prefer small PR-sized changes (<= ~300 LOC unless refactor).
- No new dependencies without justification + lockfile update.
- Always run: frontend lint+test; backend tests.

## PostgreSQL + data
- Treat schema as code: all schema changes via migrations (Flyway or Liquibase).
- Prefer idempotent, forward-only migrations (no "undo" unless explicitly required).
- Use explicit constraints: PK, FK, UNIQUE, NOT NULL, CHECK.
- Prefer `uuid` for public identifiers; use `bigserial`/`identity` only when appropriate.
- Use `timestamptz` for timestamps; store UTC; avoid `timestamp` unless justified.
- Indexing: create indexes for FKs and high-cardinality filter columns; avoid over-indexing.
- JSON: use `jsonb` where it makes sense; add GIN indexes for frequently queried paths.
- Avoid PL/pgSQL unless necessary; keep functions immutable/stable where applicable.
- For bulk operations, prefer set-based SQL; avoid row-by-row loops.

## Backend persistence
- Prefer JPA for simple CRUD; use native SQL (or jOOQ) for complex queries/perf paths.
- Separate read models if needed (projection DTOs, query repositories).
- Transactions: explicit @Transactional at service boundary, not in controllers.
