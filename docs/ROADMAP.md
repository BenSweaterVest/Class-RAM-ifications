# Roadmap

Last updated: March 27, 2026

## Completed

- Runner-first architecture established.
- Core movement/obstacles/collection loop implemented.
- Barrier + Solidarity progression implemented.
- 5-card historical narrative flow implemented.
- Dynamic phase thresholds (3/4/5/6) implemented.
- Difficulty modes (story / organize / resist) with per-stat scalars implemented.
- Tone-specific popup visuals and SFX implemented.
- Promoted phase backgrounds, checkpoint cards, and named HTG roster art installed.
- Runner HUD, legend cards, theme toggle, and checkpoint UX polished.
- Mobile swipe/tap controls, bottom-sheet info layout, and narrow-screen legend behavior implemented.
- Escape key pause/unpause with full applyPauseCompensation() coverage.
- Barrier-clear effects: white flash, rainbow sparkles, 3-second invulnerability glow arc.
- PWA support: manifest.json, sw.js (cache name class-ram-v2), favicon set, OG/Twitter meta tags.
- Attempt counter and totalAlliesGathered shown on You Lose screen.
- Post-release asset cleanup: retired FOLLOWER_01-05, COLLECTIBLE_01, old ENEMY_03/04, BARRIER_01 removed.
- Verification scripts and focused smoke in place (gameplay liveness check included).

## Remaining (Owner Action Only)

- Real-phone and real-tablet spot checks for swipe comfort, readability, and pause behavior.
- Final acceptance check on rounds 3 and 4 feel after the easing pass.
- Run `node scripts/run_all_checks.js` immediately before deploying.
- Live environment go/no-go signoff.

## Near-Term Product Direction

- Public title: `Class RAM-ifications`.
- Dark mode remains the first-visit default.
- Touch devices use swipe/tap controls plus a lightweight hint, not persistent gameplay buttons.
- Mobile info experience uses a pausing bottom sheet on narrow touch layouts.
- BGM remains implemented but non-blocking for release.

Companion planning detail: `docs/NEXT_SPRINTS_PLAN.md`
