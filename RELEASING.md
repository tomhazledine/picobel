# Releasing picobel

One command, run from the repo root on a clean, up-to-date `main`:

```bash
pnpm release patch   # bug fixes
pnpm release minor   # new features (e.g. new API like destroy())
pnpm release major   # breaking changes
```

Add `--dry-run` to rehearse everything (checks, bump, build, and
`npm publish --dry-run` so you can inspect the exact tarball contents)
without committing, tagging, publishing, or pushing:

```bash
pnpm release minor --dry-run
```

## What the script does, in order

1. **Preflight** — refuses to run unless: you're on `main`, the working
   tree is clean, local `main` matches `origin/main`, you're logged in
   to npm (`npm login` persists per-machine, so this usually only
   matters on a new computer), and the target tag doesn't already exist.
2. **Verify** — `pnpm install --frozen-lockfile` then the full `check`
   (lint + typecheck + tests).
3. **Bump** — `npm version <bump>` in `packages/picobel` (no git
   side-effects; the script handles the commit itself).
4. **Build** — regenerates `build/`, including the new versioned bundle
   (`picobel.<version>.js`) and the TypeScript declarations. These
   artifacts are committed on purpose: published hot-link URLs point at
   them (see the "Install manually" section of the package README).
5. **Commit + tag** — one commit (`chore: release vX.Y.Z`) containing
   the version bump and the rebuilt artifacts, tagged `vX.Y.Z`.
6. **Publish** — `npm publish` from `packages/picobel` (its
   `prepublishOnly` hook rebuilds as a belt-and-braces check; the
   tarball contents are controlled by `.npmignore` — verify anytime
   with `npm pack --dry-run`).
7. **Push** — `git push origin main --follow-tags`.

## Common failure modes

- **`ERR_PNPM_NO_PACKAGES_TO_VERSION`** — you ran `pnpm version` in the
  repo root; the root package is private. The script versions
  `packages/picobel` for you.
- **"Tag vX.Y.Z already exists"** — usually a leftover from an
  abandoned release attempt. If `git show vX.Y.Z` confirms it's stale,
  delete it with `git tag -d vX.Y.Z` (and
  `git push origin :refs/tags/vX.Y.Z` if it was pushed) and rerun.
- **npm asks for a one-time password** — expected if your npm account
  has 2FA on publish; the script waits for the prompt.
