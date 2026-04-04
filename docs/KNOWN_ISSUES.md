# Known Issues And Deferred Items

Last updated: March 28, 2026

## Confirmed Non-Blocking

- Focused automation (smoke_runner_focus.js) covers narrative continue reliability, intro framing, control/effect semantics, pride-color visual variation, and gameplay liveness, but does not include a full gameplay-path browser walk-through of all 4 barrier clears.

## No Open Blockers

All previously deferred items are resolved. Two post-launch bugs were found and fixed:
- **Safari macOS touch-ui:** MacBook (2020) in Safari was incorrectly receiving the mobile experience. Root cause: Safari misreporting `pointer: coarse` on macOS. Fixed by adding `hover: none` as a third guard in `isLikelyTouchDevice()` in mode-loader.js — macOS always reports `hover: hover` regardless of pointer misreports.
- **Safari iOS suit grayscale:** Suit sprites were rendering in full color on iOS Safari < 18. Root cause: `ctx.filter` (Canvas 2D) is unsupported on Safari iOS < 18 and silently no-ops. Fixed by baking grayscale+contrast into the sprite ImageData during load in `applyRunnerChromaKey()`, eliminating the `ctx.filter` call entirely. Service worker bumped to class-ram-v4 to force a re-cache of updated scripts.

All other previously deferred items:
- Balance: accepted by owner after real-device testing (March 28)
- Mobile gesture comfort: validated on real device (March 28)
- Source asset folder: removed (March 28)
- Legacy mode: retired and removed

## Notes

This file captures consciously deferred items. Items are not blocking unless explicitly noted.
