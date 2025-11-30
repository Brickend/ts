# API Generator

## Implementation Documentation
- **Purpose:** Generate Supabase Edge Functions that provide CRUD endpoints for services, with proper authentication, validation, and error handling.
- **How it works (flow):**
  - Generate router functions for service endpoints
  - Create CRUD method handlers (create, get, list, update, delete)
  - Implement request validation using generated Zod schemas
  - Add authentication and organization context handling
  - Generate API gateway registration for routing
- **Interfaces & side effects:** Writes Edge Function files to supabase/functions/, creates router and handler files
- **Constraints:** Deno runtime compatibility, RLS-dependent security, stateless handlers, proper HTTP status codes

## TODO List
- [ ] [T-001] Build Edge Function router generator for service endpoints
- [ ] [T-002] Implement CRUD handler templates with Supabase client
- [ ] [T-003] Create request validation layer using Zod schemas
- [ ] [T-004] Add authentication middleware and organization context
- [ ] [T-005] Generate API gateway registration and routing

## Clarifications (by ID)
### T-004 — Clarification
- **Context:** Authentication should extract JWT from Authorization header and validate with Supabase, organization context from X-Org-Id header
- **Related:** ../security/TODO.md#t-002--clarification
- **Notes:** Use SERVICE_KEY for Supabase client in Edge Functions, not anon key

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] Generated endpoints respond to HTTP requests correctly (verifies: T-001, T-002)
- [ ] [AC-002] Request validation rejects invalid inputs with clear errors (verifies: T-003)
- [ ] [AC-003] Authentication protects endpoints from unauthorized access (verifies: T-004)
- [ ] [AC-004] API gateway routes requests to correct handlers (verifies: T-005)

## Metadata
```yaml
mode: module
entries_path: ../mvp-project.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
related:
  - ../../templates/edge-function.ts
  - ../../lib/handler-generator.ts
  - ../security/TODO.md
  - ../type-generator/TODO.md
```
