# Brickend MVP - YAML-Driven Service Generator

## Overview

This MVP demonstrates the core value proposition of Brickend: generating fully functional backend services with database tables, CRUD endpoints, security policies, and type-safe contracts from simple YAML service definitions.

## What It Does

**Input:** A `service.yaml` file defining your data model and API
**Output:** Complete backend service with:
- PostgreSQL tables with constraints and indexes
- Row-Level Security (RLS) policies for data protection  
- Supabase Edge Functions with CRUD endpoints
- TypeScript contracts for frontend integration
- Authentication and organization context handling

## Quick Start

```bash
# 1. Define your service (see examples/users.yaml)
# 2. Generate everything
brickend generate ./services/users.yaml

# 3. Deploy to Supabase
brickend deploy

# 4. Test your API
curl -H "Authorization: Bearer $JWT" \
     https://your-project.supabase.co/functions/v1/api/users/me
```

## MVP Scope

### ✅ Included in MVP
- **Database Generation**: Tables, constraints, indexes, RLS policies
- **API Layer**: CRUD endpoints with validation and error handling
- **Security**: JWT authentication, user-based and organization-based access control
- **Type Safety**: Generated TypeScript contracts and Zod schemas
- **Single Service**: Focus on getting one service (users) working perfectly

### 🚧 Future Features (Post-MVP)
- Multiple services with relationships
- Custom business logic endpoints
- Frontend scaffolding (Next.js)
- Multi-environment deployments
- Advanced permissions and roles
- Real-time subscriptions

## Project Structure

```
Planning/
├── mvp-project.md                    # Main project plan (Project mode)
├── modules/                          # Individual component plans
│   ├── cli/TODO.md                   # CLI executable
│   ├── yaml-engine/TODO.md           # YAML parsing & validation
│   ├── database-generator/TODO.md    # SQL migration generation
│   ├── api-generator/TODO.md         # Edge Functions generation
│   ├── security/TODO.md              # RLS policies & auth
│   └── type-generator/TODO.md        # TypeScript contracts
└── examples/
    └── users.yaml                    # Reference service definition
```

## Service Definition Schema

A service.yaml file defines:

### 1. Database Table
```yaml
table:
  name: user_profiles
  fields:
    - name: id
      type: uuid
      primary_key: true
    - name: email
      type: text
      unique: true
      nullable: false
```

### 2. Security Policies
```yaml
rls:
  enabled: true
  policies:
    - name: "Users can view their own profile"
      operation: SELECT
      condition: "auth.uid() = id"
```

### 3. API Endpoints
```yaml
endpoints:
  - name: getProfile
    method: GET
    path: "/users/me"
    auth_required: true
```

## Generated Output

From a service definition, Brickend generates:

### Database Layer
- `supabase/migrations/001_create_user_profiles.sql`
- RLS policies for secure data access
- Indexes for performance

### API Layer  
- `supabase/functions/users/index.ts` (router)
- `supabase/functions/users/getProfile.ts` (handler)
- `supabase/functions/users/updateProfile.ts` (handler)
- Authentication middleware

### Type Safety
- `contracts/users/types.ts` (TypeScript interfaces)
- `contracts/users/schemas.ts` (Zod validation)

## Development Workflow

1. **Define** your service in YAML
2. **Generate** all code: `brickend generate`
3. **Deploy** to Supabase: `brickend deploy` 
4. **Test** your endpoints
5. **Iterate** by updating YAML and regenerating

## Validation Strategy

The MVP validates success through a complete users service:

- ✅ CLI generates working code from YAML
- ✅ Database migration creates secure tables
- ✅ API endpoints work with authentication
- ✅ Type contracts enable frontend integration
- ✅ End-to-end flow: YAML → deploy → test

## Next Steps

See `mvp-project.md` for the complete implementation plan organized into 5 phases:

1. **P-01**: Core CLI Infrastructure 
2. **P-02**: Database Generation
3. **P-03**: API Layer
4. **P-04**: Security Implementation
5. **P-05**: Type Safety

Each phase has detailed module breakdowns and acceptance criteria for systematic development.
