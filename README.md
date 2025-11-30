# Brickend CLI

CLI tool for scaffolding Brickend packages and database schemas in monorepos.

## Installation

### For Development (Local Installation)

To install the CLI globally for development and testing:

```bash
cd ts
bun install
bun link --global
```

After linking, you can use `brickend` from any directory:

```bash
# From any monorepo
brickend add package my-package
brickend add schema auth users
```

**How `bun link` works:**
- Creates a global symlink to your local development directory
- Changes to the source code are immediately available (no rebuild needed)
- Perfect for development since Bun runs TypeScript directly
- Only need to run `bun link --global` once (unless you move/delete the project)

**Uninstall:**
```bash
bun unlink --global @brickend/cli
```

## Commands

### `brickend add package [name]`

Scaffold a new package in the monorepo.

**Arguments:**
- `[name]` - Package name (without workspace scope). If omitted, you'll be prompted interactively.

**Examples:**
```bash
# Interactive mode
brickend add package

# With package name
brickend add package my-feature
```

**Features:**
- Creates package structure with all required folders
- Generates `package.json` with workspace scope (detected from root package.json)
- Sets up TypeScript configuration
- Configures ESLint
- Creates barrel export files (`index.ts`) in each folder
- Optionally creates an initial database schema

### `brickend add schema [package] [table]`

Create a new database schema in a package using [Supabase declarative schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas).

**Arguments:**
- `[package]` - Package name. If omitted, you'll be prompted to select from available packages.
- `[table]` - Table name in snake_case. If omitted, you'll be prompted interactively.

**Examples:**
```bash
# Interactive mode - select package and enter table name
brickend add schema

# Specify package, prompt for table name
brickend add schema auth

# Specify both package and table
brickend add schema auth users
```

**Features:**
- Global schema numbering across all packages (001, 002, 003, etc.)
- Creates schemas in `packages/*/src/schemas/NNN_table.sql`
- All tables include default fields:
  - `id` - UUID primary key with auto-generation
  - `created_at` - Timestamp with default now()
  - `updated_at` - Timestamp with auto-update trigger
  - `deleted_at` - Timestamp for soft deletes (nullable)
- Auto-generates `updated_at` trigger function

## Features

- ✅ Validates monorepo structure (checks for `package.json` with `workspaces` and `packages/` directory)
- ✅ Detects workspace name from root `package.json` and uses it as package scope
- ✅ Creates package structure with all required folders:
  - `components/` - React components
  - `pages/` - Page components
  - `hooks/` - React hooks
  - `schemas/` - Zod schemas (TypeScript)
  - `functions/` - Utility functions
  - `endpoints/` - API endpoints
- ✅ Database schema generation with Supabase declarative schemas
- ✅ Global schema numbering across all packages
- ✅ Generates `package.json` with detected workspace scope
- ✅ Sets up TypeScript configuration
- ✅ Configures ESLint
- ✅ Creates barrel export files (`index.ts`) in each folder

## Generated Package Structure

```
packages/my-package/
├── package.json
├── tsconfig.json
├── eslint.config.js
└── src/
    ├── components/
    │   └── index.ts
    ├── pages/
    │   └── index.ts
    ├── hooks/
    │   └── index.ts
    ├── schemas/
    │   ├── index.ts
    │   └── 001_table_name.sql  # Database schemas (Supabase)
    ├── functions/
    │   └── index.ts
    └── endpoints/
        └── index.ts
```

## Database Schema Format

Schemas are created in `packages/*/src/schemas/NNN_table.sql` format where:
- `NNN` is a 3-digit zero-padded number (001, 002, etc.)
- Numbers are globally incremented across all packages
- Table names use snake_case convention

**Example schema file (`001_users.sql`):**
```sql
-- Schema: 001_users
-- Package: @workspace/auth

create table "public"."users" (
  "id" uuid primary key default gen_random_uuid(),
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  "deleted_at" timestamptz
);

-- Trigger for updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
  before update on "public"."users"
  for each row execute function update_updated_at();
```

## Requirements

- Must be run from within a monorepo root directory
- Monorepo must have:
  - `package.json` with `workspaces` field including `packages/*`
  - `packages/` directory
- Bun runtime (for executing the CLI)

## Development

### Setup

1. Install dependencies:
```bash
cd ts
bun install
```

2. Link globally for testing:
```bash
bun link --global
```

3. Verify installation:
```bash
brickend --help
```

### Development Workflow

Since `bun link` creates a symlink to your source code:
- **Changes are instant** - Edit any file in `src/` and test immediately
- **No build step needed** - Bun runs TypeScript directly
- **Test from any monorepo** - Use `brickend` commands from any directory

### Build (Optional)

If you need to build for production:

```bash
bun run build
```

### Testing Commands

```bash
# Test package creation
brickend add package my-test-package

# Test schema creation
brickend add schema my-test-package users
```

## Help

Get help for any command:

```bash
brickend --help
brickend add --help
brickend add package --help
brickend add schema --help
```

