# CLI Core

## Implementation Documentation
- **Purpose:** Core brickend CLI executable that provides init, generate, and deploy commands with proper argument parsing, validation, and error handling for the MVP workflow.
- **How it works (flow):** 
  - Parse command-line arguments and validate subcommands
  - Initialize project structure with template files
  - Coordinate YAML parsing and code generation
  - Execute deployment pipeline to Supabase
  - Provide clear error messages and success feedback
- **Interfaces & side effects:** Creates bin/brickend executable, reads/writes files, executes shell commands, connects to Supabase CLI
- **Constraints:** Cross-platform compatibility, minimal dependencies, clear error messages, deterministic behavior

## TODO List
- [ ] [T-001] Build CLI executable with command parsing and help system
- [ ] [T-002] Implement brickend init command with project scaffolding
- [ ] [T-003] Implement brickend generate command with module coordination
- [ ] [T-004] Implement brickend deploy command with Supabase integration

## Clarifications (by ID)
### T-003 — Clarification
- **Context:** Generate command must coordinate all modules in correct order - YAML parsing → DB generation → API generation → type generation
- **Related:** ../mvp-project.md#decomposition-map
- **Notes:** Each module should expose a generate() function that CLI can orchestrate

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] CLI shows helpful usage when run without arguments (verifies: T-001)
- [ ] [AC-002] brickend init creates valid project structure (verifies: T-002)
- [ ] [AC-003] brickend generate processes service.yaml successfully (verifies: T-003)
- [ ] [AC-004] brickend deploy applies migrations and functions (verifies: T-004)

## Metadata
```yaml
mode: module
entries_path: ../mvp-project.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
related:
  - ../../bin/brickend
  - ../yaml-engine/TODO.md
  - ../database-generator/TODO.md
```
