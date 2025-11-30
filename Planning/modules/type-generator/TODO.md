# Type Generator

## Implementation Documentation
- **Purpose:** Generate TypeScript type definitions and Zod schemas for frontend consumption, ensuring type safety between service definitions and client code.
- **How it works (flow):**
  - Transform service definitions into TypeScript interfaces
  - Generate Zod schemas for request/response validation
  - Create API client types for frontend integration
  - Export organized contract files by service
  - Ensure compile-time type safety across stack
- **Interfaces & side effects:** Writes TypeScript files to contracts/ directory, exports types and schemas
- **Constraints:** TypeScript compatibility, Zod integration, frontend-friendly organization, stable type definitions

## TODO List
- [ ] [T-001] Generate TypeScript interfaces from service definitions
- [ ] [T-002] Create Zod schemas for request/response validation

## Clarifications (by ID)
### T-001 — Clarification
- **Context:** Types should be organized by service (users/, organizations/) with both flat and structured export patterns
- **Related:** ../api-generator/TODO.md#t-003--clarification
- **Notes:** Include both database types and API request/response types

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] Generated types compile without TypeScript errors (verifies: T-001)
- [ ] [AC-002] Zod schemas validate API requests/responses correctly (verifies: T-002)

## Metadata
```yaml
mode: module
entries_path: ../mvp-project.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
related:
  - ../../lib/type-generator.ts
  - ../../contracts/
  - ../api-generator/TODO.md
```
