# Release Notes Draft

Version: Runner RC Draft 1
Date: March 22, 2026

## Summary

This release candidate shifts the primary experience to the runner pivot while preserving legacy mode as a regression reference path.

## Highlights

- Runner is now default at `index.html`.
- Legacy remains available at `index.html?mode=legacy`.
- Runner core loop includes lane movement, dash, chain collection, barrier events, solidarity activation, precedent progression, and courtroom finale resolution.
- Narrative checkpoints now pause gameplay at key milestones until explicit continue.
- Narrative continue controls are hardened for click, touch, and keyboard progression.
- Intro checkpoint text now opens with direct court-case context before gameplay guidance.
- Solidarity feedback now explains readiness and failure reasons.
- Sprite-backed rendering is active with geometry fallback resilience in both runner and legacy.
- Runner people readability is improved with member/suit scale variation and pride-color member variation.

## Verification Improvements

- Added scripted contract checks:
  - `scripts/check_asset_sync.js`
  - `scripts/check_runner_contract.js`
  - `scripts/check_smoke_contract.js`
- Added one-command verification bundle:
  - `scripts/run_all_checks.js`

## Documentation Additions

- Program-wide status snapshot: `docs/PROGRAM_STATUS.md`
- Release candidate snapshot: `docs/RELEASE_CANDIDATE_STATUS.md`
- Go/no-go decision template: `docs/GO_NO_GO_TEMPLATE.md`

## Known Open Decision Gates

- Final public title and naming copy
- Difficulty and tuning profile (including solidarity threshold policy)
- Narrative tone/reading-length preference
- Audio release policy (SFX-only vs include BGM)
- Long-term handling of source asset folder

## Planned Before Release Sign-Off

- Complete full local manual smoke checklist
- Complete live deploy smoke validation
- Finalize blocker/non-blocker go/no-go outcome
