# YAML Formatting Guide for Brickend

## Overview

This guide covers YAML syntax, formatting best practices, and common mistakes when creating service.yaml files for Brickend. Following these guidelines ensures your service definitions are valid and generate correct code.

## YAML Basics

### Indentation Rules

YAML uses **spaces only** for indentation. **Never use tabs.**

```yaml
# ✅ Correct - 2 spaces per level
service:
  name: "users"
  description: "User service"
  
# ❌ Wrong - tabs or inconsistent spacing  
service:
	name: "users"
 description: "User service"
```

**Standard**: Use 2 spaces per indentation level.

### Data Types

#### Strings

```yaml
# ✅ Quoted strings (recommended)
name: "user_profiles"
description: "User data table"

# ✅ Unquoted (if no special characters)
name: user_profiles

# ❌ Avoid - mixing quotes
name: "user_profiles'
description: 'User data table"
```

**Best Practice**: Always quote strings to avoid parsing issues.

#### Numbers

```yaml
# ✅ Integers
port: 3000
max_connections: 100

# ✅ Decimals  
timeout: 30.5
rate: 0.95

# ❌ Don't quote numbers
port: "3000"  # This becomes a string!
```

#### Booleans

```yaml
# ✅ Correct boolean values
enabled: true
required: false
nullable: true

# ❌ Don't quote booleans
enabled: "true"    # This becomes a string!
required: "false"  # This becomes a string!
```

#### Arrays

```yaml
# ✅ Multi-line array (recommended for readability)
fields:
  - name: "id"
    type: "uuid"
  - name: "email"
    type: "text"

# ✅ Inline array (for simple values)
tags: ["user", "profile", "auth"]

# ❌ Inconsistent formatting
fields:
  - name: "id"
  - name: "email",
    type: "text"  # Wrong comma usage
```

#### Objects

```yaml
# ✅ Nested objects
security:
  auth:
    required: true
    type: "supabase_jwt"
  rate_limit:
    requests_per_minute: 60

# ❌ Inconsistent indentation
security:
  auth:
   required: true     # Wrong indentation
    type: "supabase_jwt"
```

## Service.yaml Specific Guidelines

### Section Order

Always organize sections in this order:

```yaml
# 1. Service metadata (required)
service:
  name: "users"
  description: "User management"
  version: "1.0.0"

# 2. Database table (required)
table:
  name: "user_profiles"
  # ... table definition

# 3. API endpoints (required)
endpoints:
  - name: "getProfile"
    # ... endpoint definition

# 4. Security configuration (required)
security:
  auth:
    required: true
    # ... security settings
```

### Field Naming Conventions

```yaml
# ✅ Use snake_case for database fields
fields:
  - name: "user_id"      # Good
  - name: "created_at"   # Good
  - name: "display_name" # Good

# ❌ Don't use other cases for database fields  
fields:
  - name: "userId"       # Wrong - camelCase
  - name: "CreatedAt"    # Wrong - PascalCase
  - name: "display-name" # Wrong - kebab-case

# ✅ Use camelCase for endpoint names
endpoints:
  - name: "getProfile"      # Good
  - name: "updateProfile"   # Good
  - name: "listUsers"       # Good

# ❌ Don't use other cases for endpoints
endpoints:
  - name: "get_profile"     # Wrong - snake_case
  - name: "GetProfile"      # Wrong - PascalCase
```

### Comments

Use comments to document complex logic:

```yaml
table:
  name: "user_profiles"
  fields:
    - name: "id"
      type: "uuid"
      primary_key: true
      default: "gen_random_uuid()"  # Auto-generate UUID
      
    - name: "email"
      type: "text"
      unique: true                  # Enforce unique emails
      nullable: false
      
  rls:
    enabled: true
    policies:
      # Allow users to see their own profile data
      - name: "Users can view own profile"
        operation: "SELECT"
        condition: "auth.uid() = id"
```

## Common Mistakes and Solutions

### 1. Indentation Errors

```yaml
# ❌ Wrong - inconsistent indentation
service:
  name: "users"
 description: "User service"    # Wrong indentation
  version: "1.0.0"

# ✅ Correct - consistent 2-space indentation
service:
  name: "users"
  description: "User service"
  version: "1.0.0"
```

### 2. Missing Quotes

```yaml
# ❌ Problematic - special characters without quotes
description: User's profile data  # Apostrophe causes issues
path: /api/v1/users              # Leading slash might cause issues

# ✅ Safe - quoted strings
description: "User's profile data"
path: "/api/v1/users"
```

### 3. Array Formatting

```yaml
# ❌ Wrong - mixed formatting
fields:
  - name: "id", type: "uuid"     # Don't use commas
  - name: "email"
    type: text                   # Missing quotes

# ✅ Correct - consistent object formatting
fields:
  - name: "id"
    type: "uuid"
  - name: "email"  
    type: "text"
```

### 4. Boolean and Number Quoting

```yaml
# ❌ Wrong - quoting non-strings
nullable: "false"        # String, not boolean!
port: "3000"            # String, not number!
required: "true"        # String, not boolean!

# ✅ Correct - proper types
nullable: false         # Boolean
port: 3000             # Number  
required: true         # Boolean
```

### 5. Duplicate Keys

```yaml
# ❌ Wrong - duplicate keys (last one wins)
security:
  auth:
    required: true
  auth:
    type: "supabase_jwt"  # Overwrites the above!

# ✅ Correct - single key with nested values
security:
  auth:
    required: true
    type: "supabase_jwt"
```

### 6. Missing Required Fields

```yaml
# ❌ Wrong - missing required fields
service:
  name: "users"
  # Missing description and version!

table:
  name: "user_profiles"
  # Missing fields array!

# ✅ Correct - all required fields present
service:
  name: "users"
  description: "User management service"
  version: "1.0.0"

table:
  name: "user_profiles"
  description: "User profile data"
  fields:
    - name: "id"
      type: "uuid"
      primary_key: true
```

## Validation Checklist

Before running `brickend generate`, verify your YAML:

### ✅ Syntax Check
- [ ] No tabs - only spaces for indentation
- [ ] Consistent 2-space indentation
- [ ] Quoted strings for safety
- [ ] Proper boolean/number types (unquoted)
- [ ] No duplicate keys

### ✅ Required Sections
- [ ] `service` with name, description, version
- [ ] `table` with name, fields, rls
- [ ] `endpoints` with at least one endpoint
- [ ] `security` with auth configuration

### ✅ Naming Conventions
- [ ] Service name: lowercase with underscores
- [ ] Table/field names: snake_case
- [ ] Endpoint names: camelCase
- [ ] Index names: descriptive with prefix

### ✅ Security Requirements
- [ ] RLS enabled on table
- [ ] At least one RLS policy defined  
- [ ] Auth required specified on all endpoints
- [ ] Valid auth type specified

## Tools and Validation

### YAML Linting

Use a YAML linter to catch syntax errors:

```bash
# Install yamllint
pip install yamllint

# Check your service file
yamllint services/users.yaml
```

### IDE Extensions

Recommended VS Code extensions:
- **YAML**: Syntax highlighting and validation
- **Better Comments**: Enhanced comment styling
- **Indent Rainbow**: Visualize indentation levels

### Online Validators

- [YAML Lint](http://www.yamllint.com/) - Online syntax checker
- [Code Beautify](https://codebeautify.org/yaml-validator) - YAML validator

## Best Practices Summary

1. **Use 2 spaces** for indentation (never tabs)
2. **Quote all strings** to avoid parsing issues
3. **Follow naming conventions** for each context
4. **Include comments** for complex logic
5. **Validate syntax** before generating code
6. **Order sections** consistently (service → table → endpoints → security)
7. **Use descriptive names** for fields, endpoints, and policies
8. **Test your YAML** with online validators

## Example Template

Use this template as a starting point:

```yaml
# Service metadata
service:
  name: "your_service"
  description: "Description of your service"
  version: "1.0.0"

# Database table definition
table:
  name: "your_table"
  description: "Description of your table"
  
  fields:
    - name: "id"
      type: "uuid"
      primary_key: true
      default: "gen_random_uuid()"
      
    - name: "created_at"
      type: "timestamptz"
      default: "now()"
      nullable: false
    
    # Add your fields here...

  indexes:
    - name: "idx_your_table_created_at"
      fields: ["created_at"]

  rls:
    enabled: true
    policies:
      - name: "Description of your policy"
        operation: "SELECT"
        condition: "auth.uid() = user_id"

# API endpoints
endpoints:
  - name: "getItem"
    method: "GET"
    path: "/your-service/items/{id}"
    description: "Get a specific item"
    auth_required: true
    path_params:
      id:
        type: "uuid"
        required: true

# Security configuration
security:
  auth:
    required: true
    type: "supabase_jwt"
  rate_limit:
    requests_per_minute: 60
```

Copy this template and modify it for your specific service needs.
