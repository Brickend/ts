# YAML Engine

## Implementation Documentation
- **Purpose:** Parse and validate service.yaml files using Zod schemas, converting raw YAML into strongly-typed internal representations for code generation.
- **How it works (flow):**
  - Define Zod schemas for service.yaml structure
  - Parse YAML files and validate against schemas
  - Transform parsed data into normalized internal representation
  - Provide helpful validation error messages
  - Export typed interfaces for other modules
- **Interfaces & side effects:** Reads service.yaml files, validates structure, exports TypeScript interfaces and parsing functions
- **Constraints:** Comprehensive validation with clear error messages, extensible schema design for future features

## TODO List
- [ ] [T-001] Define core service.yaml Zod schema for MVP scope
- [ ] [T-002] Implement YAML parser with validation and error handling
- [ ] [T-003] Create internal representation types and transformation functions

## Clarifications (by ID)
### T-001 — Clarification
- **Context:** MVP schema should include tables (fields, constraints, indexes), RLS policies, and CRUD methods only
- **Related:** ../mvp-project.md#t-001--clarification
- **Notes:** Exclude advanced features like custom methods, complex relationships, multi-environment configs

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] Schema validates correct service.yaml files without errors (verifies: T-001, T-002)
- [ ] [AC-002] Schema rejects invalid YAML with helpful error messages (verifies: T-001, T-002)
- [ ] [AC-003] Parsed data provides clean interface for code generators (verifies: T-003)

## Metadata
```yaml
mode: module
entries_path: ../mvp-project.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
related:
  - ../../lib/yaml-parser.ts
  - ../../schemas/service-schema.ts
  - ../database-generator/TODO.md
```
