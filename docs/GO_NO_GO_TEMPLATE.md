# Go / No-Go Report Template

Date:
Candidate reference (commit or branch):
Reviewer(s):

## 1. Executive Decision

- Decision: `GO` or `NO-GO`
- Rationale summary:

## 2. Blockers (Must Fix Before Release)

List each blocker with:

- ID:
- Area (gameplay, controls, narrative, assets, deploy, etc.):
- Reproduction steps:
- Severity:
- Proposed fix owner:
- Status:

## 3. Non-Blocking Issues (Can Defer)

List each non-blocking issue with:

- ID:
- Area:
- Impact:
- Deferral rationale:
- Target follow-up sprint:

## 4. Verification Evidence

### Scripted Checks

- [ ] `npm test` (syntax, runner contract, smoke contract, service worker precache list)
- [ ] `npm run smoke` with `npm run serve` running (shell smoke, runner smoke, full four-barrier run)

### Manual Smoke

- [ ] Local runner mode smoke complete (docs/SMOKE_TEST.md)
- [ ] Live smoke complete after deploy (docs/LIVE_VERIFICATION_RUNBOOK.md)
- [ ] Offline reload on the live URL boots the game
- [ ] Pace checked on a 120 Hz display, if one is available

## 5. Release Decision Gates

- [x] Title/naming copy approved (`Class RAM-ifications`)
- [x] Difficulty profile approved (owner, real-device testing, March 28, 2026)
- [x] Solidarity threshold policy approved (3 / 4 / 5 / 6, shifted by difficulty)
- [x] Narrative copy/tone approved (locked March 28, 2026)
- [x] Audio policy approved (`BGM` implemented but non-blocking for release)
- [x] Source-asset retention policy approved (source mirror removed; `assets/processed/` is the only runtime source)

## 6. Post-Decision Actions

If GO:

- Deployment timestamp:
- Live URL:
- Post-deploy validation owner:

If NO-GO:

- Required fix list:
- Re-evaluation trigger:
