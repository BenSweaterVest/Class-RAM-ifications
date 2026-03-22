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

- [ ] `node scripts/check_asset_sync.js`
- [ ] `node scripts/check_runner_contract.js`
- [ ] `node scripts/check_smoke_contract.js`
- [ ] `node scripts/run_all_checks.js`

### Manual Smoke

- [ ] Local runner mode smoke complete
- [ ] Local legacy mode smoke complete
- [ ] Live smoke complete after deploy

## 5. Release Decision Gates

- [ ] Title/naming copy approved
- [ ] Difficulty profile approved
- [ ] Solidarity threshold policy approved
- [ ] Narrative copy/tone approved
- [ ] Audio policy approved
- [ ] Source-asset retention policy approved

## 6. Post-Decision Actions

If GO:

- Deployment timestamp:
- Live URL:
- Post-deploy validation owner:

If NO-GO:

- Required fix list:
- Re-evaluation trigger:
