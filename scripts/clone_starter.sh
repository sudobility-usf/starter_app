#!/bin/bash

# clone_starter.sh - Clone all 6 starter projects to a new app
#
# Usage:
#   ./clone_starter.sh
#   ./clone_starter.sh "Cravings"
#
# This script copies the 6 starter projects (types, api, client, lib, app, app_rn)
# into new directories with the given app name, and updates all package names,
# imports, and references accordingly.
#
# Prerequisites:
#   - All 6 starter_* directories must exist as siblings
#   - git must be installed

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

SUFFIXES=("types" "api" "client" "lib" "app" "app_rn")
EXCLUDE_DIRS=(".git" "node_modules" "dist" "build" ".turbo" ".cache")

# ============================================================================
# Functions
# ============================================================================

prompt_app_name() {
    if [ -n "${1:-}" ]; then
        APP_NAME="$1"
    else
        read -rp "Enter the app name (e.g., Cravings): " APP_NAME
    fi

    if [ -z "$APP_NAME" ]; then
        echo "Error: App name cannot be empty."
        exit 1
    fi

    # Derive lowercase name: lowercase + remove non-alphanumeric
    APP_LOWER=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]')

    if [ -z "$APP_LOWER" ]; then
        echo "Error: App name must contain at least one alphanumeric character."
        exit 1
    fi
}

confirm() {
    echo ""
    echo "=== Clone Configuration ==="
    echo "  App Name:     $APP_NAME"
    echo "  Project Name: $APP_LOWER"
    echo ""
    echo "  Will create:"
    for suffix in "${SUFFIXES[@]}"; do
        echo "    ${APP_LOWER}_${suffix}/"
    done
    echo ""
    echo "  From:"
    for suffix in "${SUFFIXES[@]}"; do
        echo "    starter_${suffix}/"
    done
    echo ""
    read -rp "Proceed? [y/N] " answer
    if [[ ! "$answer" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
}

copy_project() {
    local suffix="$1"
    local src="starter_${suffix}"
    local dst="${APP_LOWER}_${suffix}"

    if [ ! -d "$src" ]; then
        echo "⚠️  Source directory $src not found, skipping"
        return 1
    fi

    if [ -d "$dst" ]; then
        echo "⚠️  Destination directory $dst already exists, skipping"
        return 1
    fi

    echo "📁 Copying $src → $dst"

    # Build rsync exclude args
    local exclude_args=()
    for dir in "${EXCLUDE_DIRS[@]}"; do
        exclude_args+=("--exclude=$dir")
    done

    rsync -a "${exclude_args[@]}" "$src/" "$dst/"
}

rename_in_file() {
    local file="$1"
    local old="$2"
    local new="$3"

    if [ -f "$file" ]; then
        # Use different sed syntax for macOS vs Linux
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|${old}|${new}|g" "$file"
        else
            sed -i "s|${old}|${new}|g" "$file"
        fi
    fi
}

rename_in_all_sources() {
    local dir="$1"
    local old="$2"
    local new="$3"

    # Find all .ts, .tsx, .js, .jsx files in src/
    if [ -d "$dir/src" ]; then
        find "$dir/src" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
            rename_in_file "$file" "$old" "$new"
        done
    fi
}

process_project() {
    local suffix="$1"
    local dst="${APP_LOWER}_${suffix}"

    if [ ! -d "$dst" ]; then
        return
    fi

    echo "🔧 Processing $dst"

    # --- package.json ---
    if [ -f "$dst/package.json" ]; then
        # Rename package name
        rename_in_file "$dst/package.json" "@sudobility/starter_${suffix}" "@sudobility/${APP_LOWER}_${suffix}"
        rename_in_file "$dst/package.json" "\"starter_${suffix}\"" "\"${APP_LOWER}_${suffix}\""

        # Rename all starter dependencies
        for dep_suffix in "${SUFFIXES[@]}"; do
            rename_in_file "$dst/package.json" "@sudobility/starter_${dep_suffix}" "@sudobility/${APP_LOWER}_${dep_suffix}"
        done

        # Rename keywords
        rename_in_file "$dst/package.json" "\"starter\"" "\"${APP_LOWER}\""
    fi

    # --- Source code imports ---
    for dep_suffix in "${SUFFIXES[@]}"; do
        rename_in_all_sources "$dst" "@sudobility/starter_${dep_suffix}" "@sudobility/${APP_LOWER}_${dep_suffix}"
    done

    # --- CLAUDE.md ---
    if [ -f "$dst/CLAUDE.md" ]; then
        # Replace package references
        for dep_suffix in "${SUFFIXES[@]}"; do
            rename_in_file "$dst/CLAUDE.md" "starter_${dep_suffix}" "${APP_LOWER}_${dep_suffix}"
        done
        # Replace display name references (Starter → AppName)
        rename_in_file "$dst/CLAUDE.md" "Starter" "$APP_NAME"
        rename_in_file "$dst/CLAUDE.md" "starter" "$APP_LOWER"
    fi
}

process_api_specific() {
    local dst="${APP_LOWER}_api"

    if [ ! -d "$dst" ]; then
        return
    fi

    echo "🔧 Processing API-specific files in $dst"

    # Rename PostgreSQL schema name
    if [ -f "$dst/src/db/schema.ts" ]; then
        rename_in_file "$dst/src/db/schema.ts" "pgSchema(\"starter\")" "pgSchema(\"${APP_LOWER}\")"
        rename_in_file "$dst/src/db/schema.ts" "starter_histories_user_idx" "${APP_LOWER}_histories_user_idx"
    fi

    # Rename env var references in .env.example
    if [ -f "$dst/.env.example" ]; then
        rename_in_file "$dst/.env.example" "Starter API" "${APP_NAME} API"
        rename_in_file "$dst/.env.example" "starter" "${APP_LOWER}"
    fi

    # Generate blank .env from .env.example
    generate_blank_env "$dst"
}

process_app_specific() {
    local dst="${APP_LOWER}_app"

    if [ ! -d "$dst" ]; then
        return
    fi

    echo "🔧 Processing App-specific files in $dst"

    # Update push_all.sh
    if [ -f "$dst/scripts/push_all.sh" ]; then
        for dep_suffix in "${SUFFIXES[@]}"; do
            rename_in_file "$dst/scripts/push_all.sh" "starter_${dep_suffix}" "${APP_LOWER}_${dep_suffix}"
        done
    fi

    # Generate blank .env from .env.example
    generate_blank_env "$dst"
}

process_app_rn_specific() {
    local dst="${APP_LOWER}_app_rn"

    if [ ! -d "$dst" ]; then
        return
    fi

    echo "🔧 Processing React Native-specific files in $dst"

    # Update app.json
    if [ -f "$dst/app.json" ]; then
        rename_in_file "$dst/app.json" "Starter App" "${APP_NAME}"
        rename_in_file "$dst/app.json" "starter-app" "${APP_LOWER}-app"
        rename_in_file "$dst/app.json" "com.sudobility.starter" "com.sudobility.${APP_LOWER}"
    fi
}

generate_blank_env() {
    local dir="$1"

    if [ ! -f "$dir/.env.example" ]; then
        echo "  ⚠️  No .env.example found in $dir"
        return
    fi

    echo "  📝 Generating blank .env from .env.example"

    # Copy .env.example to .env, blanking out values but keeping comments and structure
    # Keep lines that are comments (#) or empty, blank out KEY=VALUE lines
    # Exception: keep default values for PORT, NODE_ENV, BUN_ENV, VITE_DEV_MODE, VITE_SHOW_PERFORMANCE_MONITOR
    while IFS= read -r line; do
        if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
            # Comment or empty line - keep as-is
            echo "$line"
        elif [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*) ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            # Keep defaults for certain keys
            case "$key" in
                PORT|NODE_ENV|BUN_ENV|VITE_DEV_MODE|VITE_SHOW_PERFORMANCE_MONITOR|VITE_API_URL)
                    echo "${key}=${value}"
                    ;;
                *)
                    echo "${key}="
                    ;;
            esac
        else
            echo "$line"
        fi
    done < "$dir/.env.example" > "$dir/.env"

    # Ensure .env is in .gitignore
    if [ -f "$dir/.gitignore" ]; then
        if ! grep -q "^\.env$" "$dir/.gitignore"; then
            echo "" >> "$dir/.gitignore"
            echo "# Environment variables" >> "$dir/.gitignore"
            echo ".env" >> "$dir/.gitignore"
            echo ".env.local" >> "$dir/.gitignore"
        fi
    fi
}

init_git_repo() {
    local dst="$1"

    if [ ! -d "$dst" ]; then
        return
    fi

    echo "  🔀 Initializing git repo in $dst"
    (
        cd "$dst"
        git init -q
        git add -A
        git commit -q -m "Initial commit: cloned from starter"
    )
}

# ============================================================================
# Main
# ============================================================================

main() {
    # Determine the base directory (where starter projects live)
    # The script should be run from the parent directory of all starter_* projects
    # or we detect it based on the script location
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    # Try to find starter projects relative to the script
    # Script is at starter_app/plans/clone_starter.sh, so base is ../../
    BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

    # Verify starter projects exist
    if [ ! -d "$BASE_DIR/starter_types" ]; then
        echo "Error: Cannot find starter_types in $BASE_DIR"
        echo "Make sure all starter_* projects are in the same parent directory."
        exit 1
    fi

    cd "$BASE_DIR"

    echo "🚀 Starter Project Cloner"
    echo "========================="
    echo "Base directory: $BASE_DIR"

    # Get app name
    prompt_app_name "${1:-}"

    # Confirm
    confirm

    echo ""
    echo "=== Step 1: Copying projects ==="
    for suffix in "${SUFFIXES[@]}"; do
        copy_project "$suffix"
    done

    echo ""
    echo "=== Step 2: Renaming packages and imports ==="
    for suffix in "${SUFFIXES[@]}"; do
        process_project "$suffix"
    done

    echo ""
    echo "=== Step 3: Project-specific processing ==="
    process_api_specific
    process_app_specific
    process_app_rn_specific

    echo ""
    echo "=== Step 4: Initializing git repos ==="
    for suffix in "${SUFFIXES[@]}"; do
        init_git_repo "${APP_LOWER}_${suffix}"
    done

    echo ""
    echo "✨ Done! Created ${#SUFFIXES[@]} projects:"
    for suffix in "${SUFFIXES[@]}"; do
        echo "  ✅ ${APP_LOWER}_${suffix}/"
    done

    echo ""
    echo "Next steps:"
    echo "  1. Create GitHub repos for each project"
    echo "  2. Set git remotes: git remote add origin <url>"
    echo "  3. Fill in .env files in ${APP_LOWER}_api and ${APP_LOWER}_app"
    echo "  4. Run 'bun install' in each project"
    echo "  5. Update app-specific content (icons, descriptions, etc.)"
}

main "$@"
