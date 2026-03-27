# Release Candidate Status Snapshot

Date: March 27, 2026
Mode focus: Runner default (`index.html`), legacy reference (`index.html?mode=legacy`)

## Build And Script Validation

### Syntax Checks

Previously executed (March 26, 2026):

- `node --check game.js`
- `node --check runner_mode.js`
- `node --check mode-loader.js`
- `node --check audio.js`
- `node --check scripts/check_asset_sync.js`
- `node --check scripts/check_runner_contract.js`
- `node --check scripts/check_smoke_contract.js`

Result (March 26):

- PASS: no syntax failures

Note: rerun required to confirm syntax is still clean after March 27 feature additions.

### Verification Scripts

Previously executed (March 26, 2026):

- `node scripts/check_asset_sync.js`
- `node scripts/check_runner_contract.js`
- `node scripts/check_smoke_contract.js`
- `node scripts/run_all_checks.js`

Result (March 26):

- PASS: source/runtime PNG parity (44/44)
- PASS: runner contract checks
- PASS: smoke contract checks
- PASS: full verification bundle (`run_all_checks`)

Pending: rerun `node scripts/run_all_checks.js` to confirm current state after March 27 session.

### Focused Browser Smoke

Previously executed (March 26, 2026):

- `node scripts/smoke_runner_focus.js` (against local static server)
- `node scripts/smoke_mode_shell.js` (against local static server)

Result (March 26):

- PASS: narrative continue reliability (click + Enter fallback)
- PASS: Space key no longer skips history checkpoints
- PASS: intro historical framing starts with court-case context
- PASS: control semantics + obstacle-effect legend/hint/help wiring
- PASS: pride-color visual variation signal (observed 6-8 active color buckets)
- PASS: promoted narrative cards and HTG roster did not break focused browser smoke
- PASS: mobile viewport sanity (touch hint text, restart visibility, `touch-action: none`)
- PASS: mobile touch hint shows on first load and dismisses after first gesture
- PASS: mobile info cards open as a bottom sheet and pause gameplay on narrow touch layouts
- PASS: default runner and legacy shell routing both match current UI expectations
- PASS: gameplay liveness check (control API methods do not throw, canvas updates within 1 second)

Pending: rerun smoke after March 27 session to verify new features (pause, barrier-clear effects, PWA, debug shortcuts).

## Checklist Status (Current)

### Smoke Checklist

Reference: `docs/SMOKE_TEST.md`

- Scripted preflight: complete (March 26)
- Focused browser smoke: complete (March 26) — rerun pending for March 27 additions
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

- Runner readiness: fully implemented on desktop; mobile real-device validation pending
- Repo/asset decisions: retired generic follower/collectible art removed; long-term source folder role still open
- Audio policy: settled — BGM implemented, non-blocking for release; SFX audit complete
- PWA: implemented — manifest.json, sw.js, favicons, OG/Twitter meta

## Deferred / Open Decision Gates

- Final acceptance on rounds 3 and 4 feel after the easing pass — owner call
- Mobile gesture threshold tuning on real devices
- Long-term role of `class_ram_ifications assets/` (maintained mirror vs. source archive)
- Manual live deploy sign-off once hosted build is verified

## Suggested Immediate Next Actions

1. Run `node scripts/run_all_checks.js` to confirm all checks pass after March 27 session.
2. Execute full local manual smoke and convert `docs/LOCAL_SMOKE_RESULTS.md` manual sections from pending to pass/fail.
3. Tune swipe/tap feel on real phones and confirm portrait/landscape comfort and pause behavior.
4. Get acceptance on the current rounds 3 and 4 easing pass.
5. Use `docs/LIVE_VERIFICATION_RUNBOOK.md` after deploy and populate `docs/GO_NO_GO_TEMPLATE.md`.
