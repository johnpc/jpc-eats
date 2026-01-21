# CI/CD Configuration

## Pre-commit Hooks

TypeScript type checking runs automatically on commit via `lint-staged`:

- Runs `tsc --noEmit` on all `.ts` and `.tsx` files
- Prevents commits with type errors

## GitHub Actions

### Type Check Workflow

Runs on all PRs and pushes to main:

- Installs dependencies
- Runs `tsc --noEmit` to catch type errors

## Branch Protection (Recommended)

To prevent Dependabot from introducing breaking changes, configure branch protection on `main`:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select: `typecheck` (from GitHub Actions)
   - ✅ Require pull request reviews before merging (1 approval)

This ensures:

- All PRs (including Dependabot) must pass type checks
- Manual review required before merging
- Breaking changes caught before deployment
