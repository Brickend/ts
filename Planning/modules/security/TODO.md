# Security Layer

## Implementation Documentation
- **Purpose:** Implement comprehensive security model with RLS policies, authentication helpers, and permission validation for multi-tenant SaaS architecture.
- **How it works (flow):**
  - Generate RLS policies that enforce user and organization boundaries
  - Create authentication helpers for JWT validation
  - Implement permission checking functions
  - Provide organization context management
  - Ensure secure defaults throughout the system
- **Interfaces & side effects:** Generates SQL policies, creates auth helper functions, validates user permissions
- **Constraints:** RLS-first security model, fail-secure defaults, auth.uid() validation, organization isolation

## TODO List
- [ ] [T-001] Define RLS policy templates for user and organization data
- [ ] [T-002] Implement JWT authentication helpers for Edge Functions
- [ ] [T-003] Create organization context validation and switching
- [ ] [T-004] Build permission checking utilities and middleware

## Clarifications (by ID)
### T-001 — Clarification
- **Context:** User data should be accessible only to auth.uid(), organization data should check membership through org_memberships table
- **Related:** ../database-generator/TODO.md#t-002--clarification
- **Notes:** Include policies for SELECT, INSERT, UPDATE, DELETE with appropriate restrictions

### T-002 — Clarification
- **Context:** Edge Functions should use SERVICE_KEY for database access but validate user session from Authorization header
- **Related:** ../api-generator/TODO.md#t-004--clarification
- **Notes:** Extract and validate JWT token, set user context for RLS policies

## How to Use This TODO
1. Read the entries file first.
2. Execute tasks in the TODO List order.
3. If a task needs context, open its matching section in "Clarifications (by ID)".

## Acceptance Criteria
- [ ] [AC-001] Unauthorized requests cannot access any user data (verifies: T-001, T-002)
- [ ] [AC-002] Users can only access their own data and authorized organization data (verifies: T-001, T-003)
- [ ] [AC-003] Organization switching updates access permissions correctly (verifies: T-003, T-004)

## Metadata
```yaml
mode: module
entries_path: ../mvp-project.md
last_updated: 2025-01-25
owner: brickend@core
status: Active
version: 0.1.0
related:
  - ../../lib/auth-helpers.ts
  - ../../templates/rls-policies.sql
  - ../database-generator/TODO.md
  - ../api-generator/TODO.md
```
