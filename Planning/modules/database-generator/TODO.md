# Database Generator

## Implementation Documentation
- **Purpose:** Generate SQL migrations from parsed service definitions, creating tables with proper constraints, indexes, and RLS policies for secure multi-tenant access.
- **How it works (flow):**
  - Transform service definitions into SQL DDL statements
  - Generate migrations in dependency order (tables → constraints → indexes → policies)
  - Create RLS policies based on service security definitions
  - Generate helper functions for permission checking
  - Ensure idempotent migrations for safe re-runs
- **Interfaces & side effects:** Reads internal representation, writes SQL migration files to supabase/migrations/
- **Constraints:** PostgreSQL-compatible SQL, RLS-first security model, deterministic output for stable diffs

## TODO List
- [ ] [T-001] Build SQL DDL generator for tables and constraints
- [ ] [T-002] Implement RLS policy generator from service definitions
- [ ] [T-003] Create migration file writer with proper naming and ordering

## Clarifications (by ID)
### T-002 — Clarification
- **Context:** RLS policies should default to secure patterns - auth.uid() checks for user data, organization membership for multi-tenant data
- **Related:** ../security/TODO.md#t-001--clarification
- **Notes:** Generate both permissive policies for valid users and restrictive policies as baseline security

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] Generated migrations create tables with correct structure (verifies: T-001)
- [ ] [AC-002] RLS policies prevent unauthorized access (verifies: T-002)
- [ ] [AC-003] Migration files are properly ordered and idempotent (verifies: T-003)

## Metadata
```yaml
mode: module
entries_path: ../mvp-project.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
related:
  - ../../lib/sql-generator.ts
  - ../../templates/migration.sql
  - ../security/TODO.md
```
