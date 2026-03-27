# Next Sprints Plan

Last updated: March 27, 2026

## Status: All Sprints Complete

All four planned sprints have shipped. The project is in a post-implementation, pre-release-signoff state.

## What Shipped

**Sprint 1 — Mobile UX Follow-Through:** Mobile bottom sheet replaces the interim narrow-screen rail. Sheet pauses gameplay on open and resumes cleanly on close. Desktop behavior unchanged.

**Sprint 2 — Balance And Feel:** Rounds 3 and 4 eased via ROUND_PROFILES and DIFFICULTY_MODES scalars. Rounds 1 and 2 unchanged. Three difficulty modes (story/organize/resist) implemented with 'organize' as the default fallback.

**Sprint 3 — Validation And Release Evidence:** Playwright smoke expanded with gameplay liveness check. Doc consolidation complete (BACKLOG_TRIAGE.md removed, PIVOT_DECISIONS_SUMMARY.md updated, DEVELOPMENT.md refreshed). Pause feature (Escape), barrier-clear effects (flash + sparkles + invulnerability), new SFX (barrierWarning, chainLoss, lifeLost, narrativeSomber retuned), attempt counter, allies gathered stat, BGM ducking, debug shortcuts (Alt+0–5, F2), PWA (manifest.json + sw.js + favicons), OG/Twitter meta tags, and win screen simplification all implemented.

**Sprint 4 — Post-Release Cleanup:** Retired FOLLOWER_01-05 and COLLECTIBLE_01 removed from both mirrored asset folders. Asset parity checks re-run and green. assets/New/ staging folder and assets/favicon/site.webmanifest orphan removed.

## Locked Product Decisions

- Public title: `Class RAM-ifications`
- Default first-visit theme: dark mode
- Mobile control style: swipe/tap, not persistent gameplay buttons
- Mobile info UX: bottom sheet from the existing card row; pauses gameplay while open
- Audio stance: BGM implemented, non-blocking for release if startup fails
- Difficulty default: `organize`
- Win moment: popup 5 (phase4Clear) — no separate win canvas overlay
- Phase thresholds: 3, 4, 5, 6 (base, scaled by difficulty mode)

## Remaining Owner Tasks Before Any Future Work Begins

1. Run `node scripts/run_all_checks.js` and confirm all checks pass.
2. Real-phone and real-tablet spot checks for swipe comfort, readability, and pause behavior.
3. Final acceptance check on rounds 3 and 4 feel.
4. Live environment go/no-go signoff.
