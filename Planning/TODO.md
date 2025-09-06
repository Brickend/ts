# 🏗️ Brickend Base Project - Development TODO

> **Multi-Org SaaS Template**: Complete backend from YAML → Supabase + Next.js frontend

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [📦 Development Phases](#-development-phases)
  - [Phase 0: CLI Core](#phase-0--cli-core--brickend-commands)
  - [Phase 1: Project Bootstrap](#phase-1--project-bootstrap--automated-setup)
  - [Phase 2: YAML Configuration](#phase-2--yaml-configuration--source-of-truth)
  - [Phase 3: Database Generation](#phase-3--database-generation--migration-generator)
  - [Phase 4: Security Layer](#phase-4--security-layer--rls--permissions)
  - [Phase 5: API Gateway](#phase-5--api-gateway--supabase-functions)
  - [Phase 6: Service Implementation](#phase-6--service-implementation--users--organizations)
  - [Phase 7: Frontend Scaffold](#phase-7--frontend-scaffold--nextjs)
  - [Phase 8: Type Safety](#phase-8--type-safety--contracts--api-client)
  - [Phase 9: Authentication](#phase-9--authentication--auth--onboarding)
  - [Phase 10: Testing](#phase-10--testing--unit--integration--e2e)
  - [Phase 11: DevOps & DX](#phase-11--devops--dx--development-experience)
  - [Phase 12: Observability](#phase-12--observability--monitoring--logging)
  - [Phase 13: Documentation](#phase-13--documentation--guides--templates)
  - [Phase 14: Multi-Environment](#phase-14--multi-environment--dev--staging--prod)
  - [Phase 15: Performance](#phase-15--performance--caching--optimization)
  - [Phase 16: Future Features](#phase-16--future-features--post-mvp)
- [✅ Acceptance Checklist](#-acceptance-checklist)
- [📁 File Structure](#-file-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)

---

## 🎯 Project Overview

**Scope**: DB-from-YAML (tables/relations/RLS → migrations), Supabase API Gateway, auth/permission types in brickend.yaml, custom role/scopes in permissions.yaml, services (users, organizations), and a Next.js app (login, onboarding, public, private, admin).

**Tech Stack**: Next.js 15, Tailwind v4, shadcn/ui, TypeScript, Supabase, Edge Functions, Zod validation

---

## 📦 Development Phases

### Phase 0: 🛠️ CLI Core | Brickend commands

<details>
<summary><strong>📝 Overview</strong></summary>

Build the core CLI commands that power the entire development workflow.

</details>

#### 🔧 Implementation Steps

1. **`brickend init --template base-project`**
   - Copy baseline folder structure and starter YAML files
   - Install dependencies for both web and functions
   - Initialize Supabase project configuration

2. **`brickend generate`**
   - Parse YAML → Internal Representation (types, relations, policies)
   - Generate migrations, contracts, functions, gateway registry
   - Create typed API client for frontend
   - **Regeneration Strategy**: Framework files regenerated, method files preserved
   - **Warning System**: Detect contract changes and alert about manual updates needed

3. **`brickend deploy`**
   - Apply database migrations
   - Deploy Edge Functions to Supabase
   - Seed permission helper functions

4. **`brickend upgrade`**
   - Update framework code (`_shared/`, `index.ts` routers, contracts)
   - Preserve existing business logic in method files
   - Safe migration with user prompts for breaking changes

#### 📦 Artifacts

- `bin/brickend` CLI executable
- Template files under `templates/base-project/`
- Regeneration strategy documentation
- Change detection and warning system

#### ✅ Success Criteria

- [ ] CLI commands run without prompts and produce bootable stack
- [ ] Framework updates don't break existing method files
- [ ] Contract changes produce clear warnings about manual updates needed
- [ ] `bun dev` starts complete development environment

#### ⚠️ Pitfalls

- **Non-deterministic Codegen**: Fix timestamps and file ordering for stable diffs
- **Accidental File Overwrite**: Never overwrite method files during regeneration

---

### Phase 1: 🎯 Project Bootstrap | Automated setup

<details>
<summary><strong>📝 Overview</strong></summary>

Use the brickend CLI to create and validate the first working project with proper structure, dependencies, and configuration.

</details>

#### 🔧 Implementation Steps

1. **Bootstrap Project with CLI**
   - Run `brickend init --template base-project` to create project structure
   - Validate generated `/web` - Next.js 15 + Tailwind v4 + shadcn/ui + TypeScript
   - Validate generated `/supabase` - Migrations and Edge Functions
   - Validate generated `/services` - YAML definitions (users, organizations)
   - Validate generated `/contracts` - Generated TypeScript types and schemas

2. **Environment Configuration**
   - Verify `.env.example` with required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY`

3. **Development Tools Validation**
   - Verify ESLint configuration for both Edge Functions and Next.js
   - Verify Prettier code formatting
   - Verify TypeScript configs (separate for Deno and Node environments)

4. **End-to-End Validation**
   - Test `brickend generate` produces working output
   - Test development environment startup

#### 📦 Artifacts

- Working project structure generated by CLI
- Validated development environment
- Project configuration files and dependencies
- Initial service definitions and contracts

#### ✅ Success Criteria

- [ ] `brickend init base-project` completes successfully
- [ ] `bun install` completes successfully in generated project
- [ ] `bun typecheck` passes without errors in generated project
- [ ] `brickend generate` produces valid migrations and functions
- [ ] Generated project folder structure matches specification

#### ⚠️ Pitfalls

- **Template Validation**: Ensure templates produce working, not just syntactically correct code
- **Dependency Conflicts**: Verify all generated dependencies are compatible

---

### Phase 2: 📝 YAML Configuration | Source of truth

<details>
<summary><strong>📝 Overview</strong></summary>

Define the YAML schema that serves as the single source of truth for the entire system.

</details>

#### 🔧 Implementation Steps

1. **`brickend.yaml`** - Global Configuration
   - Project settings and metadata
   - Authentication and authorization config
   - Permissions (roles/scopes/modules)
   - Services registry
   - API Gateway configuration

2. **`permissions.yaml`** - Role Management
   - Per-role module overrides
   - Custom permission mappings
   - Access control definitions

3. **Service YAML Files** - `services/users.yaml`, `services/organizations.yaml`
   - Database tables and field definitions
   - Enumerations and constraints
   - Table relations and foreign keys
   - Row-level security policies
   - API method definitions

#### 📦 Artifacts

- Comprehensive YAML schema validation (Zod/JSON Schema)
- Helpful error messages for invalid configurations
- Documentation for all YAML fields and options

#### ✅ Success Criteria

- [ ] `brickend generate` reads YAML and prints capabilities summary
- [ ] Schema validation catches errors with helpful messages
- [ ] All required vs optional fields are clearly documented

#### ⚠️ Pitfalls

- **Implicit Defaults**: Document and normalize all field types (e.g., use `timestamptz` consistently)
- **Type Inconsistency**: Establish clear conventions for data types across the system

---

### Phase 3: 🗄️ Database Generation | Migration generator

<details>
<summary><strong>📝 Overview</strong></summary>

Generate SQL migrations automatically from YAML definitions with smart diffing.

</details>

#### 🔧 Implementation Steps

1. **Internal Representation Builder**
   - Normalize data types across different database systems
   - Resolve foreign key targets and validate relationships
   - Auto-generate indexes based on uniqueness constraints

2. **Migration Generation Pipeline**
   - Ordered generation: enums → tables → constraints → indexes → policies → helper functions
   - Idempotent SQL where possible for safe re-runs

3. **Smart Diff Engine**
   - Compare YAML(old) vs YAML(new) for incremental changes
   - Generate additive-safe changes automatically
   - Lock destructive operations unless `--allow-breaking` flag is used

4. **Helper Functions**
   - `fn_user_org_role` - Get user's role in organization
   - `fn_role_scopes` - Get scopes for a role
   - `fn_effective_scopes` - Compute effective permissions
   - `fn_has_scope` - Check if user has specific permission

#### 📦 Artifacts

- `/supabase/migrations/00X_*.sql` files with clear naming
- Migration dependency tracking
- Helper function implementations

#### ✅ Success Criteria

- [ ] `supabase db reset` applies all migrations cleanly
- [ ] Row-level security is enabled on all tables
- [ ] Helper functions are available and tested
- [ ] Diff engine produces minimal, safe migrations

#### ⚠️ Pitfalls

- **Enum Changes**: Only append new values safely; replacements require manual migration gates
- **Destructive Operations**: Always require explicit confirmation for data loss

---

### Phase 4: 🔒 Security Layer | RLS & permissions

<details>
<summary><strong>📝 Overview</strong></summary>

Implement comprehensive Row-Level Security and permission model.

</details>

#### 🔧 Implementation Steps

1. **Enable RLS on All Tables**
   - Automatic RLS activation during table creation
   - Default deny-all policies as baseline

2. **Policy Generation from YAML**
   - Generate SELECT/INSERT/UPDATE/DELETE policies
   - Reference helper functions for permission checks
   - Clear, descriptive policy names

3. **Core Table Coverage**
   - `user_profiles` - User account information
   - `organizations` - Multi-tenant organization data
   - `org_memberships` - User-organization relationships
   - `org_invitations` (optional) - Pending invitations
   - `audit_logs` (optional) - Security and change tracking

#### 📦 Artifacts

- SQL policy files with clear naming conventions
- Policy unit tests for validation
- Documentation of permission model

#### ✅ Success Criteria

- [ ] Queries without JWT token fail appropriately
- [ ] Queries with valid JWT respect membership and scopes
- [ ] All permission scenarios are covered by policies

#### ⚠️ Pitfalls

- **Leaky Policies**: Always include `auth.uid()` guards where appropriate
- **Permission Gaps**: Include comprehensive unit tests for all permission scenarios

---

### Phase 5: 🌐 API Gateway | Supabase Functions

<details>
<summary><strong>📝 Overview</strong></summary>

Build a robust API gateway with comprehensive error handling and middleware.

</details>

#### 🔧 Implementation Steps

1. **Core Gateway Function** - `/supabase/functions/api/index.ts`
   - Route pattern: `/api/v1/:service/:method`
   - CORS configuration from `brickend.yaml.gateway`
   - Authentication: parse Authorization header → validate session
   - Organization context: read X-Org-Id header or aoid cookie
   - Rate limiting: KV bucket by user_id + path
   - Idempotency: optional cache by Idempotency-Key header
   - **Enhanced Error Envelope**: `{ error: { code, message, details, timestamp, request_id } }`

2. **Error Taxonomy & HTTP Status Mapping**
   - `VALIDATION_ERROR` → 400 Bad Request
   - `UNAUTHORIZED` → 401 Unauthorized  
   - `FORBIDDEN` → 403 Forbidden
   - `NOT_FOUND` → 404 Not Found
   - `CONFLICT` → 409 Conflict
   - `RATE_LIMITED` → 429 Too Many Requests
   - `INTERNAL_ERROR` → 500 Internal Server Error

3. **Auto-Generated Registry**
   - `registry.ts` mapping service/method → lazy import handler
   - Dynamic loading for better performance

4. **Advanced Validation**
   - Generated Zod schemas for query/path/body/headers
   - Advanced query parameter parsing (date ranges, arrays, enums, field selection)
   - Type-safe parameter extraction and validation

5. **Monitoring & Logging**
   - Structured logs with request_id, latency, user_id (hashed)
   - Service/method tracking for analytics
   - Error tracking with full request context

#### 📦 Artifacts

- `api/index.ts` - Main gateway function
- `api/registry.ts` - Service/method routing
- `_shared/{auth,validation,responses,errors}.ts` - Framework utilities
- Error handling documentation and examples

#### ✅ Success Criteria

- [ ] curl commands hit real handlers with proper routing
- [ ] Invalid inputs return clear Zod validation errors
- [ ] Missing org_id on private methods returns meaningful 400/403
- [ ] All error responses follow consistent format and HTTP status codes
- [ ] Rate limiting and CORS work as configured

#### ⚠️ Pitfalls

- **Supabase Client Key Confusion**: Must use SERVICE_KEY inside Edge Functions, not anon key
- **Inconsistent Error Formats**: Ensure all validation layers use the same error structure

---

### Phase 6: ⚙️ Service Implementation | Users & organizations

<details>
<summary><strong>📝 Overview</strong></summary>

Implement core business services with advanced filtering and custom methods.

</details>

#### 🔧 Implementation Steps

1. **YAML Method Definitions** (Enhanced)
   - Support custom method names beyond CRUD (e.g., `sendInviteReminder`, `switchActiveOrg`)
   - Advanced filtering parameters: date ranges, text search, array filters, field selection
   - Query parameter constraints: `optional`, `default()`, `enum()`, `min/max`, format validation

2. **Code Generation Strategy**
   - **Router files**: Regenerated with custom method routing (framework code)
   - **Business logic files**: Generated once, safe to edit (your code)
   - **Organized contracts**: Zod + TypeScript types organized by service
   - **Advanced schemas**: Query parameter validation with complex constraints

3. **Core Handler Implementation** (Minimal, RLS-first)
   - `users/getMe` - Profile + memberships + scopes map (by module)
   - `users/updateProfile` - Profile updates with validation
   - `users/listOrgMembers` - Filtered/paginated member listing (requires 'access:read' or admin)
   - `users/setMemberRole`, `users/setModuleOverrides` - Admin-only role management
   - `organizations/create|get|list|update|delete` - Full CRUD with advanced filtering
   - `organizations/switchActiveOrg` - Returns `{active_org_id, scopes}`
   - **Custom methods** with proper routing and validation

4. **Advanced Filtering Implementation**
   - Date range filtering (`created_after`, `updated_since`)
   - Text search and contains operations
   - Array filters and enum constraints
   - Multi-field sorting with direction control
   - Field selection and relation inclusion

#### 📦 Artifacts

- `/supabase/functions/{users,organizations}/*` including custom methods
- `/contracts/{users,organizations}/{schemas.ts,types.ts}` with advanced parameter schemas
- Query building and filtering utilities
- Service-specific helper functions

#### ✅ Success Criteria

- [ ] Postman collection tests pass for all endpoints
- [ ] Handlers enforce organization checks via SQL helpers
- [ ] Custom methods work with proper validation and routing
- [ ] Advanced filtering works across all list endpoints
- [ ] RLS policies are the source of truth for security

#### ⚠️ Pitfalls

- **Double Permission Checking**: JavaScript checks are for UX; RLS is the security guarantee
- **Custom Method Routing**: Ensure custom methods don't conflict with standard CRUD paths

---

### Phase 7: 🎨 Frontend Scaffold | Next.js

<details>
<summary><strong>📝 Overview</strong></summary>

Build a complete Next.js frontend with authentication, routing, and permission gates.

</details>

#### 🔧 Implementation Steps

1. **Dependencies & Setup**
   - Tailwind v4 with modern design system
   - shadcn/ui core components for consistent UI
   - Lucide icons for visual elements

2. **App Router Structure**
   - `(public)/page.tsx` - Marketing homepage
   - `(auth)/login`, `(auth)/signup` - Authentication flows
   - `(onboarding)` - Organization creation or invite acceptance
   - `(private)/dashboard` - Main application dashboard
   - `(private)/admin/(organizations|users|access)` - Admin panels

3. **React Providers & Utilities**
   - `SupabaseProvider` - SSR/CSR session management
   - `useSession`, `getSessionServer` - Authentication state
   - `useActiveOrg` - Active organization management (cookie + headers)
   - `PermissionGate` - `<Gate module="access" scope="manage">...</Gate>`

4. **Middleware Protection**
   - Protect private routes → redirect to `/login` if no session
   - Ensure active organization → redirect to onboarding if missing `aoid`
   - Server-side permission validation

#### 📦 Artifacts

- `/web/app/**` - Complete route structure
- `/web/components/**` - Reusable UI components
- `/web/lib/{api-client,auth,active-org}.ts` - Core utilities
- `/web/middleware.ts` - Route protection logic

#### ✅ Success Criteria

- [ ] Complete user flow: signup → onboarding → dashboard works
- [ ] Admin users can CRUD organizations and memberships
- [ ] Viewer users cannot access admin functionality
- [ ] Permission gates work correctly throughout the UI

#### ⚠️ Pitfalls

- **Hydration Issues**: Keep authentication checks server-first where possible
- **Client-Server State Mismatch**: Ensure consistent session state across SSR/CSR

---

### Phase 8: 🔗 Type Safety | Contracts & API client

<details>
<summary><strong>📝 Overview</strong></summary>

Generate organized contracts and type-safe API client for seamless frontend integration.

</details>

#### 🔧 Implementation Steps

1. **Organize Contracts by Service**
   - `/contracts/users/{schemas.ts, types.ts}` - User service contracts
   - `/contracts/organizations/{schemas.ts, types.ts}` - Organization service contracts
   - `/contracts/index.ts` - Re-exports with organized imports
   - Service-specific Zod schemas and TypeScript interfaces

2. **Type-Safe API Client Generation** - `/web/lib/api-client.ts`
   - `call<Svc,Method,Input,Output>(service, method, {query, body}, opts)` - Generic typed calls
   - Auto-attach Authorization and X-Org-Id headers
   - Map error envelope to typed exceptions (ValidationError, ForbiddenError, etc.)
   - Import from organized contract structure

3. **Optional React Hooks**
   - `useApi()` - General API hook (keep minimal for MVP)
   - Service-specific hooks if needed
   - Error boundary integration

#### 📦 Artifacts

- Organized contract structure: `/contracts/{service}/{schemas.ts,types.ts}`
- `/contracts/index.ts` with both flat and organized re-exports
- Type-safe API client with full error handling
- Client-side type tests and validation

#### ✅ Success Criteria

- [ ] Frontend consumes only the generated client
- [ ] Adding new backend endpoints requires no manual client updates
- [ ] Contracts are organized by service for better maintainability
- [ ] Both flat imports and service-organized imports work correctly

#### ⚠️ Pitfalls

- **Contract-Client Divergence**: Client must import generated types directly to stay in sync
- **Import Path Complexity**: Balance organized structure with simple import paths

---

### Phase 9: 🔐 Authentication | Auth & onboarding

<details>
<summary><strong>📝 Overview</strong></summary>

Implement complete authentication and user onboarding flows.

</details>

#### 🔧 Implementation Steps

1. **Authentication Providers**
   - Email/password authentication
   - Magic link option for passwordless login
   - Social provider integration (optional)

2. **Smart Onboarding Logic**
   - **Invite Flow**: If invite token present → join organization with preset role
   - **New User Flow**: Create new organization + admin membership
   - Set `aoid` cookie and call `organizations/switchActiveOrg` to preload scopes

3. **Organization Management**
   - Top bar organization picker for switching active org
   - Real-time scope updates when organization changes
   - Persistent active organization state

#### 📦 Artifacts

- Invite acceptance page with token validation
- Organization creation wizard
- Top bar organization selector component
- Onboarding flow documentation

#### ✅ Success Criteria

- [ ] Both invite and new user flows are tested and working
- [ ] Active organization ID changes reflect instantly in gated UI
- [ ] Organization switching updates permissions correctly

#### ⚠️ Pitfalls

- **Client-Side Permission Trust**: Always recompute permissions server-side; never trust client claims

---

### Phase 10: 🧪 Testing | Unit, integration, E2E

<details>
<summary><strong>📝 Overview</strong></summary>

Comprehensive testing strategy covering all layers of the application.

</details>

#### 🔧 Implementation Steps

1. **Unit Tests - SQL Functions** (via pg-tap or custom scripts)
   - `fn_user_org_role` - User role resolution
   - `fn_role_scopes` - Role permission mapping  
   - `fn_effective_scopes` - Combined permission calculation
   - `fn_has_scope` - Permission checking logic

2. **Integration Tests - Edge Functions**
   - Call each handler with various user roles
   - Verify 200/403 behavior matches expected permissions
   - Test error handling and validation

3. **End-to-End Tests** (Playwright)
   - Complete user journey: signup → onboarding → create org → invite second user
   - Role changes and permission updates
   - UI permission gates and access control

#### 📦 Artifacts

- `/tests/unit-sql/` - Database function tests
- `/tests/integration/` - API endpoint tests
- `/tests/e2e/` - Full application flow tests

#### ✅ Success Criteria

- [ ] Green path and key negative test scenarios pass locally and in CI
- [ ] Permission model is thoroughly validated
- [ ] Critical user flows are covered by E2E tests

#### ⚠️ Pitfalls

- **Flaky E2E Tests**: Use local token acceptance routes for tests instead of relying on email links

---

### Phase 11: 🚀 DevOps & DX | Development experience

<details>
<summary><strong>📝 Overview</strong></summary>

Enhanced development experience with hot reload, automation, and deployment pipelines.

</details>

#### 🔧 Implementation Steps

1. **Enhanced Development Script**
   - `bun dev` → Next.js + Supabase local + function watcher (concurrent)
   - **Hot reload** for Edge Functions (file watcher + automatic redeploy)
   - **YAML change detection** → auto-regenerate contracts
   - **Live reload** for contract changes in frontend
   - **Integrated log streaming** from all services

2. **Development Experience Improvements**
   - Real-time error reporting from Edge Functions
   - YAML validation on save with helpful error messages
   - Auto-format YAML files on change
   - Development database seeding and reset scripts

3. **Continuous Integration**
   - Lint, typecheck, generate, migrate to ephemeral DB
   - Unit and integration test execution
   - Contract generation validation (detect breaking changes)
   - YAML schema validation

4. **Deployment Pipeline**
   - Vercel project setup with preview environments
   - Supabase project linking and migration automation
   - Automated migration deployment checks

#### 📦 Artifacts

- Enhanced `package.json` scripts with development tooling
- GitHub Actions workflow (or similar CI/CD)
- Development utilities and file watchers
- Deployment automation scripts

#### ✅ Success Criteria

- [ ] Single command (`bun dev`) starts complete development environment
- [ ] YAML changes trigger automatic contract regeneration
- [ ] Hot reload works for both frontend and backend changes
- [ ] One push deploys to preview environment

#### ⚠️ Pitfalls

- **Environment Isolation**: Keep preview DB separate from production
- **File Watcher Performance**: Optimize for large codebases to avoid slowdowns

---

### Phase 12: 📊 Observability | Monitoring & logging

<details>
<summary><strong>📝 Overview</strong></summary>

Production-ready monitoring, logging, and health checks.

</details>

#### 🔧 Implementation Steps

1. **Structured Gateway Logging**
   - Logs include: request_id, latency, user_id (hashed), service/method
   - JSON format for easy parsing and analysis
   - Different log levels for different environments

2. **Comprehensive Error Taxonomy**
   - Standardized error codes across all endpoints
   - Error tracking with full request context
   - Error rate monitoring and alerting

3. **Rate Limiting & Idempotency Storage**
   - KV storage or Postgres table with TTL
   - Per-user and per-endpoint rate limiting
   - Idempotency key support for safe retries

4. **Health Check System**
   - Public `GET /api/v1/health` endpoint
   - Database connectivity checks
   - Service dependency validation

#### 📦 Artifacts

- `_shared/responses.ts`, `_shared/auth.ts`, `_shared/validation.ts` with metrics hooks
- Health check endpoint implementation
- Monitoring dashboard configuration

#### ✅ Success Criteria

- [ ] Logs show complete request lifecycle
- [ ] Synthetic health checks are consistently green
- [ ] Error rates and performance metrics are tracked

#### ⚠️ Pitfalls

- **Sensitive Data Logging**: Avoid logging request/response bodies by default
- **Log Volume**: Balance observability with storage costs

---

### Phase 13: 📚 Documentation | Guides & templates

<details>
<summary><strong>📝 Overview</strong></summary>

Comprehensive documentation for developers using the system.

</details>

#### 🔧 Implementation Steps

1. **Update Main README**
   - Quick start guide with copy-paste commands
   - Clear explanation of project structure
   - Common use cases and examples

2. **Inline YAML Documentation**
   - Comments for every field in YAML examples
   - Type information and constraints
   - Best practices and common patterns

3. **Developer Guides**
   - "How to add a new module" step-by-step guide
   - Module registry → service YAML → `brickend generate` → frontend Gate usage
   - Troubleshooting common issues

#### 📦 Artifacts

- `/docs/adding-a-module.md` - Module creation guide
- `/docs/yaml-reference.md` - Complete YAML field reference
- Inline documentation and examples

#### ✅ Success Criteria

- [ ] New developer can add a service in <1 hour using docs only
- [ ] All YAML fields have clear documentation
- [ ] Common questions are answered in the guides

#### ⚠️ Pitfalls

- **Documentation Drift**: Auto-extract examples from YAML comments where possible
- **Outdated Examples**: Establish process for keeping examples current

---

### Phase 14: 🌍 Multi-Environment | Dev, staging, prod

<details>
<summary><strong>📝 Overview</strong></summary>

Support for multiple deployment environments with proper isolation.

</details>

#### 🔧 Implementation Steps

1. **Environment-Specific YAML Configuration**
   - `brickend.yaml` supports environments: development, staging, production
   - Environment-specific overrides for rate limits, auth settings, CORS
   - Different database connection strings per environment
   - Feature flags per environment

2. **Targeted Deployment**
   - `brickend deploy --env staging` command
   - Environment variable management per environment
   - Separate Supabase projects per environment

3. **Configuration Validation**
   - Validate environment-specific configurations
   - Prevent accidental production deployments
   - Environment drift detection and alerts

#### 📦 Artifacts

- Environment configuration system
- Environment-specific deployment scripts
- Configuration validation tools and safeguards

#### ✅ Success Criteria

- [ ] Can deploy to different environments with different configurations
- [ ] Environment isolation prevents cross-contamination
- [ ] No accidental data leakage between environments

#### ⚠️ Pitfalls

- **Accidental Production Deployments**: Implement confirmation prompts for production
- **Environment Configuration Drift**: Regular validation to catch inconsistencies

---

### Phase 15: ⚡ Performance | Caching & optimization

<details>
<summary><strong>📝 Overview</strong></summary>

Performance optimization features for production workloads.

</details>

#### 🔧 Implementation Steps

1. **Response Caching Layer**
   - Configurable TTL per endpoint
   - Cache invalidation on data changes
   - User-based and organization-based cache keys
   - Redis/KV integration for cache storage

2. **Database Connection Optimization**
   - Connection pooling for better resource utilization
   - Read replica support for GET requests
   - Connection reuse across function calls

3. **Response Optimization**
   - gzip compression for large responses
   - Partial response support (field selection)
   - Pagination optimization for large datasets
   - Query optimization helpers

4. **Performance Monitoring**
   - Performance metrics collection
   - Slow query detection and alerts
   - Cache hit rate monitoring
   - Performance dashboard

#### 📦 Artifacts

- Caching middleware and utilities
- Connection pooling configuration
- Performance monitoring setup
- Optimization guidelines

#### ✅ Success Criteria

- [ ] Significant performance improvement for read operations
- [ ] Cache invalidation works correctly without stale data
- [ ] Performance metrics are collected and actionable
- [ ] Database connections are efficiently managed

#### ⚠️ Pitfalls

- **Cache Consistency**: Ensure real-time data isn't stale
- **Over-Optimization**: Avoid adding complexity without measurable benefit

---

### Phase 16: 🚀 Future Features | Post-MVP

<details>
<summary><strong>📝 Overview</strong></summary>

Advanced features for future development phases.

</details>

#### 🎯 Planned Features

- **Feature Flags**: Per-module/organization feature toggles
- **Usage Metering**: Billing hooks and usage tracking  
- **Webhooks**: Real-time events on membership/role changes
- **Audit Log Viewer**: Complete audit trail interface
- **AI-Powered Optimization**: Query optimization suggestions
- **Anomaly Detection**: Unusual pattern recognition
- **Auto-Generated Documentation**: API docs from YAML definitions

⸻

## ✅ Acceptance Checklist

Final validation that all features work end-to-end:

- [ ] `brickend init base-project` → runs without prompts, prints next commands
- [ ] `brickend generate` → migrations/contracts/functions/gateway/client generated deterministically
- [ ] `brickend generate` detects contract changes and warns about method files needing updates
- [ ] `brickend upgrade` → updates framework code while preserving business logic
- [ ] `brickend deploy` → DB schema + functions live
- [ ] `brickend deploy --env staging` → deploys to staging environment with correct config
- [ ] Auth: signup/login works; onboarding creates org/admin membership or accepts invite
- [ ] Org switching updates aoid + scopes; UI gates react
- [ ] Admin can CRUD org & memberships; editor/viewer are restricted by RLS and handlers
- [ ] Gateway enforces CORS, auth, rate limits, and returns typed errors
- [ ] Advanced filtering works: date ranges, text search, arrays, sorting, pagination
- [ ] Custom methods work with proper routing and validation
- [ ] Contracts organized by service with both flat and organized imports
- [ ] Hot reload works for YAML changes → auto-regenerate contracts
- [ ] E2E happy path passes; key negative cases (no org, wrong role) return 403
- [ ] Performance features improve response times measurably
- [ ] Error responses follow consistent format with proper HTTP status codes
- [ ] Docs explain adding a new module/service end-to-end

---

## 📁 File Structure

Complete project structure after MVP completion:

```
base-project/
├── brickend.yaml                      # Multi-env project config
├── permissions.yaml                   # Role definitions
├── .env.development                   # Dev environment vars
├── .env.staging                       # Staging environment vars  
├── .env.production                    # Production environment vars
├── services/
│   ├── users.yaml                     # Advanced filtering + custom methods
│   └── organizations.yaml             # Advanced filtering + custom methods
├── supabase/
│   ├── migrations/00X_*.sql           # Generated DB migrations
│   └── functions/
│       ├── api/
│       │   ├── index.ts               # Main gateway function
│       │   └── registry.ts            # Service routing registry
│       ├── _shared/                   # Framework utilities (do not modify)
│       │   ├── auth.ts                # Authentication helpers
│       │   ├── responses.ts           # Response formatters
│       │   ├── validation.ts          # Parameter validation
│       │   └── errors.ts              # Error handling
│       ├── users/                     # User service
│       │   ├── index.ts               # Router (regenerated)
│       │   ├── getMe.ts               # Business logic (safe to edit)
│       │   ├── updateProfile.ts       # Business logic (safe to edit)
│       │   ├── listOrgMembers.ts      # Business logic (safe to edit)
│       │   ├── setMemberRole.ts       # Business logic (safe to edit)
│       │   ├── setModuleOverrides.ts  # Business logic (safe to edit)
│       │   └── utils/                 # Service-specific helpers
│       └── organizations/             # Organization service
│           ├── index.ts               # Router (regenerated)
│           ├── createOrganization.ts  # Business logic (safe to edit)
│           ├── getOrganization.ts     # Business logic (safe to edit)
│           ├── listOrganizations.ts   # Business logic (safe to edit)
│           ├── updateOrganization.ts  # Business logic (safe to edit)
│           ├── deleteOrganization.ts  # Business logic (safe to edit)
│           ├── switchActiveOrg.ts     # Business logic (safe to edit)
│           └── utils/                 # Service-specific helpers
├── contracts/                         # Organized by service
│   ├── index.ts                       # Re-exports with organized imports
│   ├── users/
│   │   ├── schemas.ts                 # Zod validation schemas
│   │   └── types.ts                   # TypeScript interfaces
│   └── organizations/
│       ├── schemas.ts                 # Zod validation schemas
│       └── types.ts                   # TypeScript interfaces
├── web/                               # Next.js frontend
│   ├── app/
│   │   ├── (public)/page.tsx          # Marketing homepage
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx         # Login form
│   │   │   └── signup/page.tsx        # Signup form
│   │   ├── (onboarding)/              # Org creation/invite acceptance
│   │   ├── (private)/
│   │   │   ├── dashboard/page.tsx     # Main dashboard
│   │   │   └── admin/                 # Admin panels
│   │   │       ├── organizations/     # Org management
│   │   │       ├── users/             # User management
│   │   │       └── access/            # Permission management
│   │   └── layout.tsx                 # Root layout
│   ├── components/
│   │   ├── PermissionGate.tsx         # Permission-based rendering
│   │   └── ui/                        # shadcn/ui components
│   ├── lib/
│   │   ├── api-client.ts              # Type-safe API client
│   │   ├── auth.ts                    # Authentication helpers
│   │   └── active-org.ts              # Organization management
│   └── middleware.ts                  # Route protection
├── scripts/
│   ├── dev.js                         # Hot reload + YAML watching
│   └── deploy.js                      # Environment targeting
└── tests/
    ├── integration/                   # Function testing
    └── e2e/                          # Full stack testing
```


---

## 🚀 Quick Start Guide

### Initial Setup
```bash
# Initialize new project
brickend init base-project
cd base-project
bun install
```

### Development Workflow
```bash
# Generate all code from YAML
brickend generate

# Start local development environment
supabase start           # Local Supabase instance
bun dev                  # Next.js + function watcher + YAML watcher

# Open application
open http://localhost:3000
```

### Making Changes
```bash
# After YAML modifications
# (auto-regenerated by file watcher)
# OR manually:
brickend generate
```

### Multi-Environment Deployment
```bash
# Deploy to different environments
brickend deploy --env development
brickend deploy --env staging  
brickend deploy --env production
```

### Framework Updates
```bash
# Update framework code while preserving business logic
brickend upgrade
```

---

*This TODO serves as the complete roadmap for building a production-ready, multi-tenant SaaS foundation with Brickend + Supabase + Next.js.*