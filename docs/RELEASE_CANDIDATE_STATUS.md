# Release Candidate Status Snapshot

Date: March 25, 2026
Mode focus: Runner default (`index.html`), legacy reference (`index.html?mode=legacy`)

## Build And Script Validation

### Syntax Checks

Executed:

- `node --check game.js`
- `node --check runner_mode.js`
- `node --check mode-loader.js`
- `node --check audio.js`
- `node --check scripts/check_asset_sync.js`
- `node --check scripts/check_runner_contract.js`
- `node --check scripts/check_smoke_contract.js`

Result:

- PASS: no syntax failures

### Verification Scripts

Executed:

- `node scripts/check_asset_sync.js`
- `node scripts/check_runner_contract.js`
- `node scripts/check_smoke_contract.js`
- `node scripts/run_all_checks.js`

Result:

- PASS: source/runtime PNG parity (44/44)
- PASS: runner contract checks
- PASS: smoke contract checks
- PASS: full verification bundle (`run_all_checks`)

### Focused Browser Smoke

Executed:

- `node scripts/smoke_runner_focus.js` (against local static server)

Result:

- PASS: narrative continue reliability (click + Enter fallback)
- PASS: Space key no longer skips history checkpoints
- PASS: intro historical framing starts with court-case context
- PASS: control semantics + obstacle-effect legend/hint/help wiring
- PASS: pride-color visual variation signal (6 active color buckets)
- PASS: promoted narrative cards and HTG roster did not break focused browser smoke

## Checklist Status (Current)

### Smoke Checklist

Reference: `docs/SMOKE_TEST.md`

- Scripted preflight: complete
- Focused browser smoke: complete
- Manual local smoke: pending full execution record
- Manual live smoke: pending

### Deploy Checklist

Reference: `docs/DEPLOY_CHECKLIST.md`

- Cloudflare workflow config present
- Local deploy dry-run evidence recorded in `docs/DEPLOY_DRY_RUN.md`
- Secret validation in target environment: pending
- Live deploy validation: pending

### Release Checklist

Reference: `docs/RELEASE_CHECKLIST.md`

- Runner readiness: implementation largely in place, manual validation pending
- Repo/asset decisions: partially open (retired generic follower art cleanup still optional)
- Audio policy decision: open

## Deferred / Open Decision Gates

- Final public title and naming copy
- Difficulty tuning profile and solidarity threshold confirmation
- Narrative tone and reading-length approval
- Audio policy for first release (SFX-only or include BGM)
- Long-term handling of retired generic follower/collectible PNGs

## Suggested Immediate Next Actions

1. Execute full local manual smoke and convert `docs/LOCAL_SMOKE_RESULTS.md` manual sections from pending to pass/fail.
2. Decide whether to delete archived generic follower/collectible assets after release.
3. Use `docs/LIVE_VERIFICATION_RUNBOOK.md` after deploy and populate `docs/GO_NO_GO_TEMPLATE.md`.
