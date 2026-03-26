# Next Sprints Plan

Last updated: March 26, 2026

## Project Refresh

### Where We Are

- Runner mode is the primary shipped experience and is stable.
- Legacy mode remains available as a reference/regression path.
- The historical arc, narrative checkpoints, art promotion, and HTG roster integration are in place.
- The runner HUD, history cards, legend cards, theme/audio controls, and basic mobile gestures are implemented.
- Scripted verification is green:
  - `node scripts/run_all_checks.js`
  - `node scripts/smoke_runner_focus.js`
- The biggest remaining gaps are polish, validation depth, and release-readiness closure rather than missing core features.

### Where We Want To Be

- A release-ready runner build that feels intentional on both desktop and mobile.
- Slightly easier rounds 3 and 4, with rounds 1 and 2 preserved as-is.
- A mobile info experience that uses a pausing bottom sheet from the existing card row rather than the interim narrow-screen rail.
- Clear release evidence: local smoke, live verification, and consciously accepted open issues.
- Cleaner docs and asset intent so the repo itself is enough to resume work without chat history.

## Locked Product Decisions

- Public title: `Class RAM-ifications`
- Default first-visit theme: dark mode
- Mobile control style: swipe/tap, not persistent gameplay buttons
- Mobile info UX target: bottom sheet from the existing card row
- Mobile info sheet behavior: pauses gameplay while open
- Audio stance: keep BGM implemented, but treat startup failure as non-blocking for release
- Generic retired runner ally art: remove after first public release, not before
- Difficulty direction: keep rounds 1 and 2 as they are; ease rounds 3 and 4 slightly
- Release go/no-go bar: script checks + local smoke + owner visual review

## Sprint 1: Mobile UX Follow-Through

### Goal

Convert the current interim mobile card rail behavior into the intended bottom-sheet interaction while preserving desktop behavior.

### Autonomous Work

- Replace the current narrow-screen legend rail with a mobile bottom sheet triggered from the existing card row.
- Ensure the bottom sheet pauses gameplay on open and resumes cleanly on close.
- Keep desktop legend-card behavior unchanged.
- Update touch-specific smoke coverage to verify the new mobile info behavior.
- Update docs and screenshots/descriptions if the interaction changes materially.

### Needs Owner Input / Assistance

- Quick visual acceptance on the final bottom-sheet feel.
- Confirmation that the sheet density/readability feels right on a real phone.

### Exit Criteria

- Mobile no longer relies on the horizontal rail as the primary info experience.
- Expanded mobile info is readable and obviously paused.
- Focused smoke still passes after the change.

Current status:

- Implemented. Remaining work is owner acceptance on real-phone readability/feel.

## Sprint 2: Balance And Feel

### Goal

Make rounds 3 and 4 a little easier without flattening the earlier run.

### Autonomous Work

- Reduce late-phase obstacle pressure slightly.
- Make barrier/Solidarity timing a bit more forgiving in the final phases.
- Keep phase 1 and 2 feel unchanged as much as possible.
- Add/update balancing notes if constants change materially.

### Needs Owner Input / Assistance

- Acceptance call on whether rounds 3 and 4 now feel “a little easier” rather than substantially easier.
- Optional playtest notes on whether narrative readability improved.

### Exit Criteria

- A full run still feels coherent.
- The late game is less punishing than the current state.
- Rounds 1 and 2 still feel right.

Current status:

- Initial easing pass implemented. Remaining work is acceptance on whether the change feels “slightly easier” rather than too soft.

## Sprint 3: Validation And Release Evidence

### Goal

Raise confidence from “implemented and smoke-tested” to “release candidate with evidence.”

### Autonomous Work

- Expand Playwright/browser automation beyond the focused runner smoke where practical.
- Convert pending local manual smoke into explicit pass/fail notes.
- Tighten release/readiness docs so they agree on current decisions and open risks.
- Verify BGM behavior remains safe under the chosen non-blocking release stance.

### Needs Owner Input / Assistance

- Owner visual review of the current release candidate.
- Real-phone / real-tablet spot checks.
- Final live environment go/no-go signoff.

### Exit Criteria

- Manual local smoke is recorded.
- Release candidate docs match the repo state.
- Remaining open items are conscious release calls, not unknowns.

Current status (March 26, 2026):

- Playwright smoke expanded: gameplay liveness check added to `smoke_runner_focus.js` (verifies all control API methods don't throw + canvas updates within 1 second confirming game loop active).
- Doc consolidation complete: `BACKLOG_TRIAGE.md` removed (superseded), `PIVOT_DECISIONS_SUMMARY.md` section 9 updated to current decisions, `MOBILE_GESTURE_PLAN.md` marked as implemented historical spec, `DEVELOPMENT.md` updated to reflect gestures live in `runner_mode.js`.
- Remaining autonomous Sprint 3 work: local manual smoke conversion and BGM verification.
- Remaining owner-input Sprint 3 work: real-device spot checks and live go/no-go.

## Sprint 4: Post-Release Cleanup / Hardening

### Goal

Clean up repo structure and reduce lingering ambiguity after the first public release.

### Autonomous Work

- Remove retired generic follower/collectible runner art from both mirrored asset folders.
- Re-run asset parity checks after cleanup.
- Consolidate duplicated documentation where helpful.
- Consider modest legacy-mode smoke expansion if it remains part of the supported repo.
- Use `docs/POST_RELEASE_ASSET_CLEANUP.md` as the bounded cleanup checklist.

### Needs Owner Input / Assistance

- Approval before removing archived art if priorities change after release.
- Decision on the long-term role of `class_ram_ifications assets/` as a maintained mirror vs. source archive.

### Exit Criteria

- Active vs. archived art is clearer.
- Doc duplication is reduced.
- The repo is easier to maintain after release.

## Cross-Cutting Open Questions

### Owner / Product Questions

- Does the bottom sheet feel right visually once implemented on a real phone?
- Are rounds 3 and 4 “slightly easier” in the right way after tuning?
- Is the current release-ready visual polish sufficient for first public exposure?
- When live, does the deployed build earn go/no-go signoff?

### Technical / Repo Questions

- How far should Playwright coverage expand before diminishing returns kick in?
- Should legacy mode keep receiving regression coverage, or stay as a lower-priority reference path?
- Should release/handoff docs consolidate further into fewer primary documents after this sprint cycle?

## Suggested Working Order

1. Mobile bottom sheet
2. Late-phase difficulty easing
3. Local manual smoke + doc sync
4. Real-device spot checks
5. Live verification and go/no-go
6. Post-release asset cleanup
