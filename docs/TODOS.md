# TODOs

Last updated: March 26, 2026

## Completed This Session

- [x] Promoted new background, popup card, and HTG member art into mirrored runtime/source PNG folders.
- [x] Wired narrative popup cards as artwork backplates with text overlay on the left reading column.
- [x] Replaced generic runner HTG member variants with the eight named pride-flag roster members.
- [x] Updated follower chain rendering to reuse collected HTG identities.
- [x] Replaced stale prompt-heavy asset metadata with current lightweight manifest/roster documents.
- [x] Synchronized core docs to the promoted March 25 art set.
- [x] Polished runner HUD, legend-card system, checkpoint interaction flow, and theme/audio controls.
- [x] Installed new cabinet/bot obstacle art and revised all legend card historical copy.
- [x] Removed obsolete hidden runner help/touch-control shell and updated smoke/contracts accordingly.
- [x] Implemented a first-pass mobile runner layer: swipe/tap controls, touch hint, mobile HUD polish, and narrow-screen legend rail behavior.
- [x] Captured current product decisions for title, audio stance, mobile UX direction, and difficulty-adjustment targets.

## Remaining (Autonomous)

- [x] Replace the current narrow-screen legend rail with the decided mobile bottom-sheet pattern opened from the existing card row.
- [x] Make the mobile bottom sheet pause gameplay cleanly and resume cleanly on close.
- [x] Tune rounds 3 and 4 slightly easier while preserving the current feel of rounds 1 and 2.
- [x] Redesign difficulty system: unified ROUND_PROFILES table + DIFFICULTY_MODES scalars replacing the old independent time-ramp and ease profile; per-round ramp that resets on barrier clear; Story/Organize/Resist dropdown in top bar.
- [x] Update focused smoke and docs after the mobile bottom-sheet implementation lands.
- [x] Expand Playwright smoke: gameplay liveness check added (control API + canvas frame-change assertion).
- [x] Consolidate duplicated release/readiness notes: BACKLOG_TRIAGE.md removed, PIVOT_DECISIONS_SUMMARY.md updated, MOBILE_GESTURE_PLAN.md and DEVELOPMENT.md refreshed.
- [ ] Tune swipe/tap thresholds and move cadence on real mobile devices.
- [x] Prepare the post-release cleanup pass that removes retired generic follower/collectible PNGs from both mirrored asset folders.

## Remaining (Needs Owner Input)

- [x] Public release title: `Class RAM-ifications`.
- [x] Audio stance: keep BGM implemented, but non-blocking for release if it fails to start.
- [x] Mobile default theme: dark mode.
- [x] Mobile info pattern: bottom sheet from the existing card row, and it should pause gameplay.
- [ ] Final acceptance check on rounds 3 and 4 after the easing pass lands.
- [ ] Real-phone/real-tablet spot checks for swipe comfort and readability.
- [ ] Live environment go/no-go signoff.
