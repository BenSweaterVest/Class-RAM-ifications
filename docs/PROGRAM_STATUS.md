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
- Runner legend now uses six equal-width info cards with expanded historical text.
- Utility bar now includes mute and bright/dark mode toggles.
- Earlier hidden runner help/touch-control shell has been pruned from the codebase.

## Verification State

- run_all_checks: PASS
- smoke_runner_focus: PASS (March 25 post-art integration rerun)

## Open Non-Code Dependency

No external art dependency is blocking runner mode. The new background, card, and HTG member PNGs are now committed in both mirrored asset folders.

## Release Readiness Snapshot

Engineering: strong
Documentation: synchronized in core guides and asset metadata
Live deploy evidence: still pending
Device-matrix signoff: still pending owner validation
