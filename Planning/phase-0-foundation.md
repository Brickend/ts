# Phase 0: CLI Foundation - Brickend Command Tool

## Implementation Documentation
- **Purpose:** Build the core brickend CLI tool that powers the entire development workflow, enabling YAML-driven project generation for multi-org SaaS templates with Next.js 15, Tailwind v4, shadcn/ui, TypeScript, and Supabase integration.
- **How it works (flow):** 
  - Build CLI executable with command parsing and validation
  - Implement YAML schema definition and parsing engine
  - Create template system for project scaffolding
  - Develop code generation pipeline for migrations, contracts, functions
  - Build init, generate, and deploy command implementations
- **Interfaces & side effects:** Creates `bin/brickend` executable, reads YAML config files, generates project files/directories, executes shell commands, connects to Supabase APIs
- **Constraints:** Must be deterministic for stable diffs, support both Deno (Edge Functions) and Node.js (Next.js) environments, preserve user business logic during regeneration

## TODO List
- [ ] [T-001] Build CLI executable and command structure
- [ ] [T-002] Implement YAML schema and parsing engine
- [ ] [T-003] Create template system and project scaffolding
- [ ] [T-004] Develop code generation pipeline for services

## Clarifications (by ID)
### T-003 — Clarification
- **Context:** Template system must generate isolated TypeScript configs for different runtime environments to prevent Deno/Node type conflicts
- **Related:** ./TODO.md#phase-1--cli-core--brickend-commands
- **Notes:** Templates should include separate tsconfig.json for `/supabase/functions` (Deno runtime) and `/web` (Node.js runtime)

### T-004 — Clarification
- **Context:** Code generation must preserve user business logic files while regenerating framework code
- **Related:** ./TODO.md#phase-1--cli-core--brickend-commands
- **Notes:** Framework files (routers, shared utilities) are regenerated; method files containing business logic are preserved

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] CLI commands execute successfully (verifies: T-001, T-002)
- [ ] [AC-002] YAML parsing generates valid internal representation (verifies: T-002)
- [ ] [AC-003] Template system creates functional project structure (verifies: T-003)
- [ ] [AC-004] Code generation produces working migrations and functions (verifies: T-004)
- [ ] [AC-005] brickend init + generate produces bootable stack (verifies: T-001, T-002, T-003, T-004)

## Metadata
```yaml
mode: module
entries_path: ./TODO.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.2.0
related:
  - ./TODO.md
  - ../bin/brickend
  - ../templates/base-project/
  - ../lib/yaml-parser.ts
  - ../lib/code-generator.ts
```
