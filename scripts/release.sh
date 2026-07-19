#!/usr/bin/env bash
set -euo pipefail

# Release script for picobel.
#
#   pnpm release patch|minor|major [--dry-run]
#
# Runs every step of the release ritual in order, refusing to start if
# any preflight check fails. --dry-run does everything except commit,
# tag, publish, and push (and reverts the version bump afterwards).

BUMP="${1:-}"
DRY_RUN="${2:-}"

if [[ "$BUMP" != "patch" && "$BUMP" != "minor" && "$BUMP" != "major" ]]; then
    echo "Usage: pnpm release <patch|minor|major> [--dry-run]"
    exit 1
fi

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

# --- Preflight -------------------------------------------------------------

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "main" ]]; then
    echo "✗ Releases happen from main (currently on '$BRANCH')."
    exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
    echo "✗ Working tree is not clean. Commit or stash first."
    exit 1
fi

echo "· Fetching origin/main..."
git fetch origin main --quiet
if [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]]; then
    echo "✗ Local main is not in sync with origin/main. Pull (or push) first."
    exit 1
fi

if ! npm whoami > /dev/null 2>&1; then
    echo "✗ Not logged in to npm. Run 'npm login' first."
    exit 1
fi

CURRENT="$(node -p "require('./packages/picobel/package.json').version")"
NEXT="$(node -e "
    const [maj, min, pat] = '$CURRENT'.split('.').map(Number);
    const bump = '$BUMP';
    console.log(
        bump === 'major' ? \`\${maj + 1}.0.0\`
        : bump === 'minor' ? \`\${maj}.\${min + 1}.0\`
        : \`\${maj}.\${min}.\${pat + 1}\`
    );
")"

if git rev-parse "v${NEXT}" > /dev/null 2>&1; then
    echo "✗ Tag v${NEXT} already exists (points at $(git rev-parse --short "v${NEXT}"))."
    echo "  If it's from an abandoned release attempt, delete it first:"
    echo "    git tag -d v${NEXT}"
    exit 1
fi

echo "· Releasing picobel $CURRENT → ${NEXT}"

# --- Verify ----------------------------------------------------------------

echo "· Installing dependencies (frozen lockfile)..."
pnpm install --frozen-lockfile

echo "· Running checks (lint, typecheck, tests)..."
pnpm --filter=picobel check

# --- Bump & build ----------------------------------------------------------

echo "· Bumping version..."
(cd packages/picobel && npm version "$BUMP" --no-git-tag-version > /dev/null)

echo "· Building (bundles, versioned bundle, declarations)..."
pnpm --filter=picobel build

if [[ "$DRY_RUN" == "--dry-run" ]]; then
    echo "· Dry run: npm publish --dry-run"
    (cd packages/picobel && npm publish --dry-run)
    echo "· Dry run complete. Reverting version bump and rebuilt artifacts..."
    git checkout -- .
    # Remove untracked build output (e.g. the new versioned bundle) so
    # the clean-tree preflight passes on the next run. Everything in
    # build/ is regenerable, so this is safe.
    git clean -f -q packages/picobel/build/
    exit 0
fi

# --- Commit, tag, publish, push --------------------------------------------

echo "· Committing and tagging v${NEXT}..."
git add packages/picobel/package.json packages/picobel/build/
git commit -m "chore: release v${NEXT}"
git tag -a "v${NEXT}" -m "${NEXT}"

echo "· Publishing to npm..."
(cd packages/picobel && npm publish)

echo "· Pushing commit and tag..."
git push origin main --follow-tags

echo "✓ Released picobel@${NEXT}"
