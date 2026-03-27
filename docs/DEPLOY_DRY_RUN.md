# Deploy Dry Run Evidence

Date: March 22, 2026 (original dry run)
Last updated: March 27, 2026
Scope: checks that can be validated locally before secret-backed deploy execution.

## Status

This dry run was captured on March 22, 2026. Significant changes have been made since then (asset cleanup, PWA support, difficulty modes, Escape pause, barrier-clear effects, SFX additions). The current PNG count is 38 (was 27 at dry-run time due to subsequent promotions and the March 26 retirement pass).

Before deploying, re-run `node scripts/run_all_checks.js` to confirm current state is green. See `docs/RELEASE_CHECKLIST.md` for the full pre-deploy gate.

## Original Before-Deploy Evidence (March 22)

- Runtime assets folder exists: `True`
- Runtime PNG count in `assets/processed`: `27` (now 38 after asset promotions and cleanup)
- `node --check game.js`: `PASS`
- Workflow project name in `.github/workflows/deploy.yml`: `class-ram-ifications`
- `node scripts/run_all_checks.js`: `PASS`

## Items Requiring Environment Access (Not Verifiable Here)

- `CLOUDFLARE_API_TOKEN` presence in GitHub secrets
- `CLOUDFLARE_ACCOUNT_ID` presence in GitHub secrets
- GitHub Actions deploy execution outcome
- Cloudflare Pages live URL verification

## Recommended Next Step

- Run `node scripts/run_all_checks.js` to confirm all checks pass on the current codebase.
- Complete `docs/RELEASE_CHECKLIST.md` in target environment and attach run URL + live validation notes to the go/no-go report.
