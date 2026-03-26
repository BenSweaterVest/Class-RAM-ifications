# Program Status

Last updated: March 25, 2026

## Current State

- Runner mode is default and stable.
- Legacy mode remains available for reference.
- Narrative system migrated to 5 checkpoints.
- Dynamic phase thresholds implemented: 3/5/7/9.
- Victory now resolves through final EO 12968 narrative card.
- Popup tone styling and tone-specific SFX implemented.
- Phase background selection now uses promoted location-specific art.
- Narrative popup cards are installed and rendered behind the historical text.
- Runner collectible/follower art now uses the eight named HTG pride-roster members.
- Runner legend now uses six top-level info cards, with a pausing bottom-sheet adaptation on narrow touch layouts.
- Utility bar now includes mute, bright/dark mode, and restart controls.
- Touch-capable devices now get first-pass swipe/tap controls plus a mobile touch hint.
- Rounds 3 and 4 have received an initial easing pass while rounds 1 and 2 remain unchanged.
- Earlier hidden runner help/touch-control shell has been pruned from the codebase.

## Where The Project Wants To Be

- A polished, historically grounded runner release that is readable, playable, and emotionally clear on both desktop and mobile.
- A release candidate with manual smoke evidence, live verification evidence, and only consciously accepted non-blockers.
- A runner mode whose mobile UI matches the desktop intent instead of feeling like a fallback adaptation.
- A code/doc state where active assets, retired assets, and release decisions are all explicit and low-drift.

## Verification State

- run_all_checks: PASS
- smoke_runner_focus: PASS (March 25 rerun including mobile viewport sanity and touch-hint dismissal checks)

## Open Non-Code Dependency

No external art dependency is blocking runner mode. The new background, card, and HTG member PNGs are now committed in both mirrored asset folders.

## Release Readiness Snapshot

Engineering: strong
Documentation: synchronized in core guides and asset metadata
Live deploy evidence: still pending
Device-matrix signoff: still pending real-device validation / owner signoff

Primary next-step planning reference: `docs/NEXT_SPRINTS_PLAN.md`
