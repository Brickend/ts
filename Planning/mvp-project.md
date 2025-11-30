# Brickend MVP - YAML-Driven Service Generator

## Implementation Documentation
- **Scope:** Core CLI tool that generates functional services with database tables and CRUD endpoints from YAML definitions. Includes minimal API gateway, RLS security, and type-safe contracts. Excludes frontend, multi-environment, and advanced features for MVP focus.
- **Architecture:** CLI tool → YAML parser → SQL migration generator → Supabase Edge Functions → Type contracts. Single-service validation with users table as reference implementation.
- **Interfaces & side effects:** Reads service.yaml files, generates SQL migrations, creates Supabase Edge Functions, produces TypeScript contracts, deploys to Supabase project
- **Constraints:** Deterministic output for stable diffs, RLS-first security model, minimal external dependencies, single-service scope for MVP validation

## Phases
- [ ] [P-01] Core CLI Infrastructure — YAML parsing and validation engine
- [ ] [P-02] Database Generation — SQL migrations with RLS policies  
- [ ] [P-03] API Layer — Edge Functions with CRUD endpoints
- [ ] [P-04] Security Implementation — Authentication and permission model
- [ ] [P-05] Type Safety — Generated contracts and validation

## Modules Registry
- [ ] [M-cli] CLI Core — `./modules/cli/TODO.md`
- [ ] [M-yaml] YAML Engine — `./modules/yaml-engine/TODO.md`
- [ ] [M-db] Database Generator — `./modules/database-generator/TODO.md`
- [ ] [M-api] API Generator — `./modules/api-generator/TODO.md`
- [ ] [M-sec] Security Layer — `./modules/security/TODO.md`
- [ ] [M-types] Type Generator — `./modules/type-generator/TODO.md`

## Decomposition Map
- **P-01** → implements via: M-cli:T-001,T-002; M-yaml:T-001,T-002,T-003
- **P-02** → implements via: M-db:T-001,T-002,T-003; M-sec:T-001
- **P-03** → implements via: M-api:T-001,T-002,T-003; M-cli:T-003
- **P-04** → implements via: M-sec:T-002,T-003,T-004; M-api:T-004
- **P-05** → implements via: M-types:T-001,T-002; M-api:T-005

## TODO List (project-level work)
- [ ] [T-001] Define canonical service.yaml schema for MVP scope
- [ ] [T-002] Create reference implementation with users service
- [ ] [T-003] Establish integration testing framework for generated services
- [ ] [T-004] Document MVP workflow and validation criteria

## Clarifications (by ID)
### T-001 — Clarification
- **Context:** MVP schema should cover essential fields only - tables, fields, constraints, basic RLS policies, CRUD methods
- **Related:** ./TODO.md#phase-2--yaml-configuration--source-of-truth
- **Notes:** Exclude advanced features like custom methods, complex permissions, multi-environment config

### T-002 — Clarification  
- **Context:** Users service provides realistic validation case with authentication integration
- **Related:** ./TODO.md#phase-6--service-implementation--users--organizations
- **Notes:** Include user_profiles table, basic CRUD, RLS policies tied to auth.uid()

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] CLI generates working users service from YAML (verifies: P-01, P-02, P-03)
- [ ] [AC-002] Generated migrations create RLS-enabled tables (verifies: P-02, P-04)
- [ ] [AC-003] CRUD endpoints work with proper authentication (verifies: P-03, P-04)
- [ ] [AC-004] Type contracts enable frontend integration (verifies: P-05)
- [ ] [AC-005] End-to-end user journey: YAML → deploy → test endpoints (verifies: P-01, P-02, P-03, P-04, P-05)

## Metadata
```yaml
mode: project
entries_path: ./TODO.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
phases: [P-01, P-02, P-03, P-04, P-05]
modules: [M-cli, M-yaml, M-db, M-api, M-sec, M-types]
related:
  - ./TODO.md
  - ./phase-0-foundation.md
  - ../services/users.yaml
  - ../bin/brickend
```
