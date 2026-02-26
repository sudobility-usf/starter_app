# Plan: Clone Starter Projects Script

## Context

We need a standalone bash script that clones all 6 starter projects (starter_types, starter_api, starter_client, starter_lib, starter_app, starter_app_rn) into a new app with a user-provided name. This enables rapid creation of new apps from the starter template.

## Pre-requisite: Rename VITE_STARTER_API_URL → VITE_API_URL

Before the clone script, update starter_app to use `VITE_API_URL` instead of `VITE_STARTER_API_URL` so the cloned apps use a generic env var name.

**Files to modify in starter_app:**
- `src/config/constants.ts` — change `import.meta.env.VITE_STARTER_API_URL` → `import.meta.env.VITE_API_URL`
- `src/vite-env.d.ts` — rename the type declaration
- `.env` — rename the variable
- `.env.example` — rename the variable
- `CLAUDE.md` — update references

## Clone Script: `scripts/clone_starter.sh`

Standalone bash script in the scripts directory.

### User interaction

1. Prompt for **app name** (e.g., "Cravings")
2. Derive `APP_LOWER` = lowercase, non-alphanumeric removed (e.g., "cravings")
3. Prompt for **target directory** (defaults to current dir)
4. Confirm with user before proceeding

### What it does for each of the 6 projects

For each `starter_{suffix}` project:

1. **Clone from GitHub** — `git clone --depth 1 --branch main` from `git@github.com:sudobility-usf/starter_{suffix}.git`
2. **Init fresh git repo** — remove `.git`, `git init` in the new directory
3. **Rename package name** in `package.json`:
   - `@sudobility/starter_{suffix}` → `@sudobility/{app_lower}_{suffix}`
   - `starter_{suffix}` → `{app_lower}_{suffix}` (for private packages like api, app_rn)
4. **Rename dependencies** in `package.json`:
   - `@sudobility/starter_types` → `@sudobility/{app_lower}_types`
   - `@sudobility/starter_client` → `@sudobility/{app_lower}_client`
   - `@sudobility/starter_lib` → `@sudobility/{app_lower}_lib`
5. **Rename imports in source code** (`src/**/*.ts`, `src/**/*.tsx`):
   - All `@sudobility/starter_*` → `@sudobility/{app_lower}_*`
6. **Rename keywords** in `package.json` — replace `"starter"` keyword
7. **Update CLAUDE.md** — replace all `starter`/`Starter` references with new names

### Project-specific handling

**starter_api → {app_lower}_api:**
- Rename PostgreSQL schema: `pgSchema("starter")` → `pgSchema("{app_lower}")`
- Rename DB index: `starter_histories_user_idx` → `{app_lower}_histories_user_idx`
- Rename .env.example comments
- Generate blank `.env` from `.env.example`

**starter_app → {app_lower}_app:**
- Update `scripts/push_all.sh` — replace all `starter_` references
- Generate blank `.env` from `.env.example`

**starter_app_rn → {app_lower}_app_rn:**
- Update `app.json`: displayName, slug, bundleIdentifier, package

### .env generation

For `_api` and `_app` projects, generate `.env` files with:
- Same structure and comments as `.env.example`
- All values blanked out (except defaults like `PORT=8022`, `NODE_ENV=development`, `VITE_API_URL`, `VITE_DEV_MODE`)
- `.env` is already in `.gitignore` for both projects

### Initial git commit

After all replacements, each new project gets:
```bash
git init && git add -A && git commit -m "Initial commit: cloned from starter"
```

## Usage

```bash
# From anywhere:
./scripts/clone_starter.sh

# Or with app name as argument:
./scripts/clone_starter.sh "Cravings"
```

## Next steps after cloning

1. Create GitHub repos for each project
2. Set git remotes: `git remote add origin <url>`
3. Fill in `.env` files in `{app}_api` and `{app}_app`
4. Run `bun install` in each project
5. Update app-specific content (icons, descriptions, etc.)
