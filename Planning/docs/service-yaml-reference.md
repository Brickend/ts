# Service YAML Reference Guide

## Overview

This document provides the complete reference for creating `service.yaml` files in Brickend. A service definition describes your data model, API endpoints, and security policies in a single YAML file that generates a complete backend service.

## Basic Structure

```yaml
service:          # Service metadata and configuration
table:            # Database table definition  
endpoints:        # API endpoints to generate
security:         # Authentication and authorization
```

## Service Section

Define basic service information and metadata.

```yaml
service:
  name: "users"                    # Required: Service name (alphanumeric, underscores)
  description: "User management"   # Required: Human-readable description
  version: "1.0.0"                # Required: Semantic version
```

### Rules
- **name**: Must be lowercase, alphanumeric with underscores only
- **description**: Brief explanation of service purpose
- **version**: Follow semantic versioning (major.minor.patch)

## Table Section

Define the database table structure, constraints, and indexes.

### Basic Table Definition

```yaml
table:
  name: "user_profiles"           # Required: Table name (snake_case)
  description: "User data table"  # Required: Table description
  fields: []                      # Required: Array of field definitions
  indexes: []                     # Optional: Performance indexes
  rls: {}                        # Required: Row Level Security configuration
```

### Field Definitions

Each field must specify:

```yaml
fields:
  - name: "id"                    # Required: Field name (snake_case)
    type: "uuid"                  # Required: PostgreSQL data type
    primary_key: true             # Optional: Mark as primary key
    nullable: false               # Optional: Allow NULL values (default: true)
    unique: true                  # Optional: Unique constraint (default: false)
    default: "gen_random_uuid()"  # Optional: Default value expression
```

#### Supported Data Types

| Type | Description | Example |
|------|-------------|---------|
| `uuid` | UUID identifier | `123e4567-e89b-12d3-a456-426614174000` |
| `text` | Variable length text | Any string |
| `varchar(n)` | Limited length text | Max n characters |
| `integer` | 32-bit integer | `42` |
| `bigint` | 64-bit integer | `9223372036854775807` |
| `decimal(p,s)` | Precise decimal | `decimal(10,2)` for currency |
| `boolean` | True/false | `true`, `false` |
| `timestamptz` | Timestamp with timezone | `2025-01-25T10:30:00Z` |
| `date` | Date only | `2025-01-25` |
| `jsonb` | JSON binary data | `{"key": "value"}` |

#### Field Constraints

```yaml
# Required field (cannot be NULL)
- name: "email"
  type: "text"
  nullable: false

# Unique constraint
- name: "username"
  type: "text"
  unique: true

# Default values
- name: "created_at"
  type: "timestamptz"
  default: "now()"
  nullable: false

# Primary key (automatically NOT NULL and UNIQUE)
- name: "id"
  type: "uuid"
  primary_key: true
  default: "gen_random_uuid()"
```

### Indexes

Define indexes for query performance:

```yaml
indexes:
  - name: "idx_users_email"       # Required: Index name
    fields: ["email"]             # Required: Fields to index
    unique: true                  # Optional: Unique index (default: false)
    
  - name: "idx_users_created"
    fields: ["created_at"]
    
  - name: "idx_users_name_email"  # Composite index
    fields: ["display_name", "email"]
```

### Row Level Security (RLS)

Define security policies for data access:

```yaml
rls:
  enabled: true                   # Required: Enable RLS on table
  policies:                       # Required: Array of security policies
    - name: "Users can view own profile"     # Required: Policy description
      operation: "SELECT"                    # Required: SQL operation
      condition: "auth.uid() = id"           # Required: SQL condition
      
    - name: "Users can update own profile"
      operation: "UPDATE"
      condition: "auth.uid() = id"
      
    - name: "Users can insert own profile"
      operation: "INSERT"
      condition: "auth.uid() = id"
```

#### RLS Operations
- `SELECT`: Read access control
- `INSERT`: Create access control  
- `UPDATE`: Modify access control
- `DELETE`: Delete access control

#### Common RLS Patterns

```yaml
# User owns the record
condition: "auth.uid() = user_id"

# User is member of organization
condition: "EXISTS (SELECT 1 FROM org_memberships WHERE user_id = auth.uid() AND org_id = table.org_id)"

# Public read access
condition: "true"

# Admin only access
condition: "EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')"
```

## Endpoints Section

Define the API endpoints to generate for your service.

### Basic Endpoint Structure

```yaml
endpoints:
  - name: "getProfile"            # Required: Method name (camelCase)
    method: "GET"                 # Required: HTTP method
    path: "/users/me"             # Required: URL path
    description: "Get user profile" # Required: Endpoint description
    auth_required: true           # Required: Require authentication
    request_body: {}              # Optional: Request body schema
    query_params: {}              # Optional: Query parameters
    path_params: {}               # Optional: Path parameters
```

### HTTP Methods

- `GET`: Retrieve data
- `POST`: Create new resource
- `PUT`: Update existing resource  
- `PATCH`: Partial update
- `DELETE`: Remove resource

### Request Parameters

#### Query Parameters

```yaml
query_params:
  limit:
    type: "number"
    required: false
    default: 20
    min: 1
    max: 100
    
  search:
    type: "string"
    required: false
    min_length: 2
    
  active_only:
    type: "boolean"  
    required: false
    default: true
```

#### Path Parameters

```yaml
path_params:
  id:
    type: "uuid"
    required: true
    description: "User ID"
```

#### Request Body

```yaml
request_body:
  display_name:
    type: "string"
    required: true
    min_length: 1
    max_length: 100
    
  bio:
    type: "string"
    required: false
    max_length: 500
    
  avatar_url:
    type: "string"
    required: false
    format: "url"
```

### Parameter Types and Validation

| Type | Validation Options | Example |
|------|-------------------|---------|
| `string` | `min_length`, `max_length`, `pattern`, `format` | Email, URL validation |
| `number` | `min`, `max`, `integer` | Age, count limits |
| `boolean` | None | True/false flags |
| `uuid` | None | ID references |
| `array` | `items`, `min_items`, `max_items` | Tag lists |

## Security Section

Configure authentication, authorization, and rate limiting.

```yaml
security:
  auth:
    required: true                # Required: Enforce authentication
    type: "supabase_jwt"          # Required: Auth method
    
  organization:
    required: false               # Optional: Multi-tenant context
    header: "X-Org-Id"           # Header name for org ID
    
  rate_limit:
    requests_per_minute: 60       # Rate limit per user
    burst: 10                     # Burst allowance
```

### Authentication Types

- `supabase_jwt`: Supabase JWT token validation
- `api_key`: API key authentication (future)
- `basic`: Basic auth (future)

## Complete Example

```yaml
# Complete service definition example
service:
  name: "users"
  description: "User management service with profiles"
  version: "1.0.0"

table:
  name: "user_profiles"
  description: "User profile information"
  
  fields:
    - name: "id"
      type: "uuid"
      primary_key: true
      default: "gen_random_uuid()"
      
    - name: "email"
      type: "text"
      unique: true
      nullable: false
      
    - name: "display_name"
      type: "text"
      nullable: false
      
    - name: "created_at"
      type: "timestamptz"
      default: "now()"
      nullable: false

  indexes:
    - name: "idx_users_email"
      fields: ["email"]
      unique: true

  rls:
    enabled: true
    policies:
      - name: "Users can view own profile"
        operation: "SELECT"
        condition: "auth.uid() = id"

endpoints:
  - name: "getProfile"
    method: "GET"
    path: "/users/me"
    description: "Get current user profile"
    auth_required: true
    
  - name: "updateProfile"
    method: "PUT"
    path: "/users/me"
    description: "Update user profile"
    auth_required: true
    request_body:
      display_name:
        type: "string"
        required: false
        max_length: 100

security:
  auth:
    required: true
    type: "supabase_jwt"
  rate_limit:
    requests_per_minute: 60
```

## Validation Rules

1. **Required Sections**: `service`, `table`, `endpoints`, `security`
2. **Naming Conventions**: 
   - Service names: lowercase, underscores
   - Field names: snake_case
   - Endpoint names: camelCase
3. **Security**: All tables must have RLS enabled
4. **Primary Keys**: Each table must have a primary key
5. **Authentication**: All endpoints must specify `auth_required`

## Common Patterns

### User Profile Service
- Primary key: `uuid` with `gen_random_uuid()`
- Required fields: `email`, `display_name`, `created_at`
- RLS: User can only access their own data

### Multi-tenant Service
- Include `org_id` field in all tables
- RLS checks organization membership
- Use `X-Org-Id` header for context

### Audit Trail
- Include `created_at`, `updated_at` timestamp fields
- Include `created_by`, `updated_by` user references
- Never allow DELETE operations

## Troubleshooting

### Common Errors

**"Primary key required"**
- Solution: Add a field with `primary_key: true`

**"RLS must be enabled"**
- Solution: Set `rls.enabled: true` and define policies

**"Invalid field type"**
- Solution: Use supported PostgreSQL types from reference table

**"Duplicate endpoint names"**
- Solution: Ensure all endpoint names are unique within service

**"Invalid auth configuration"**
- Solution: Set `security.auth.required` and valid `type`
