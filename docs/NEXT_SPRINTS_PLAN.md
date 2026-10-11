# Next Sprints Plan

Last updated: September 11, 2026

## Status: All Implementation Sprints Complete

The project is feature-complete, verified, and real-device tested. A review pass on September 11, 2026 fixed the remaining functional bugs. The only remaining work is deploy and live sign-off, both owner actions.

## What Shipped (All Sprints)

**Sprint 1 — Mobile UX:** Bottom-sheet info cards, swipe/tap controls, touch hint, gameEndedAt cooldown.

**Sprint 2 — Balance and Feel:** ROUND_PROFILES + DIFFICULTY_MODES scalars; three difficulty modes (story/organize/resist).

**Sprint 3 — Validation and Release Features:** Playwright smoke, pause (Escape + applyPauseCompensation), barrier-clear effects, SFX additions (barrierWarning/chainLoss/lifeLost/narrativeSomber retuned), attempt counter, BGM ducking, debug shortcuts (Alt+0–5/F2), PWA, OG/Twitter meta.

**Sprint 4 — Post-Release Cleanup:** Retired generic follower/collectible/enemy/barrier assets removed.

**Sprint 5 — Win Screen and Closeout:** Win screen (fireworks, disco balls, per-phase stats, all-time total), narrative SFX looping, AudioContext fix, narrative SFX volumes boosted, legacy mode retired, repo pruned (duplicate source folder, generation metadata, GitHub Actions workflow, stale scripts/docs removed), HOW TO PLAY / ABOUT modal buttons added to mode-banner.

**Sprint 6 (September 11, 2026), Review Fixes:** frame-rate-independent movement, offline-capable service worker (class-ram-v5), single keyboard handler, audio unlock gate, modal and hidden-tab pause with one shared pause clock, run countdown and loss reasons, debug gating behind `?debug`, service worker precache check, npm test / serve / smoke scripts, deterministic smoke liveness check, doc sync.

## Locked Decisions

- Public title: `Class RAM-ifications`
- Default theme: dark mode
- Mobile: swipe/tap, bottom sheet
- Audio: BGM non-blocking; SFX procedural
- Difficulty default: `organize`
- Narrative copy: locked
- No content expansion or sharing features planned

## Deploy (Remaining Owner Actions)

1. Run `npm test` and `npm run smoke` (both passed September 11, 2026)
2. Commit, push to main; Cloudflare Pages deploys automatically
3. Follow `docs/LIVE_VERIFICATION_RUNBOOK.md`
4. Fill in `docs/GO_NO_GO_TEMPLATE.md` and sign off
