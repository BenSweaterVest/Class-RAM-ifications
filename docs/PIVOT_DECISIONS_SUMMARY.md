# Pivot Decisions Summary

Last updated: March 27, 2026
Scope: implementation decisions already reflected in repository code/docs.

## 1. Runtime Strategy

Decision:

- Keep dual runtime modes during migration.

Implementation:

- Runner mode is default at `index.html`.
- Legacy mode is preserved at `index.html?mode=legacy`.
- Mode routing is handled in `mode-loader.js`.

Rationale:

- Preserves a stable playable baseline while runner mechanics iterate.

## 2. Pivot Direction

Decision:

- Move from tower-defense primary loop to runner-first design.

Implementation:

- Runner design is primary in `docs/GDD.md` and `docs/PIVOT_SPEC_CLEARANCE_PATH.md`.
- Sprint planning is aligned in `docs/TODOS.md`.

Rationale:

- Better supports short-session accessibility and the systemic barrier metaphor.

## 3. Core Runner Mechanics

Decision:

- Runner loop must include: lane movement, dash, collection chain, obstacle pressure, systemic barrier, solidarity activation, precedent counter.

Implementation:

- Implemented in `runner_mode.js`.
- Obstacle scheduling uses pattern waves (suit/cabinet/bot).
- Tail-first chain loss implemented.
- Barrier warning SFX (8-pulse escalating beep, generation-counter cancelable) implemented.
- Barrier activation window and post-barrier invulnerability (3 seconds) implemented.
- Precedent establishment tracked and surfaced in HUD.

Rationale:

- Enforces collective-action-as-mechanic rather than optional flavor.

## 4. Historical Finale

Decision:

- Add symbolic courtroom finale and EO 12968 outcome condition.

Implementation:

- Courtroom phase activates late-run in `runner_mode.js`.
- Outcome resolves to EO 12968 messaging when precedent target is met (PRECEDENT_TARGET = 4).
- Win moment is popup 5 (phase4Clear) — no separate win canvas overlay.

Rationale:

- Preserves historical framing and explicit policy-through-precedent arc.

## 5. Mobile Parity

Decision:

- Keep runner mode readable on smaller screens and add a gesture-first mobile layer without reviving the old touch button shell.

Implementation:

- Responsive legend and narrative layouts remain in `index.html`.
- `isLikelyTouchDevice()` requires both pointer:coarse AND max-width:900px; `touch-ui` class applied to body only on genuine small touch devices.
- Touch-capable devices get swipe/tap runner controls, a touch-specific hint, and mobile HUD/layout adjustments.
- Mobile info cards use the bottom-sheet pattern and pause gameplay while open.
- `gameEndedAt` cooldown (1.5s) prevents accidental tap restart on the lose screen.
- Win/restart hint text adapts: "Tap to restart" on touch, "Press R or Enter to restart" on desktop.
- Keyboard control and restart/mute/theme flows remain active in `runner_mode.js` and `mode-loader.js`.
- The earlier hidden touch-control shell was removed during closeout cleanup.

Rationale:

- Preserves smaller-screen compatibility without covering the playfield with persistent buttons or carrying dead on-screen control UI.

## 6. Asset Pipeline And Runtime Source Of Truth

Decision:

- Keep `assets/processed/` as runtime asset source while retaining source-generation assets and metadata.

Implementation:

- Runtime sprites loaded from `assets/processed/`.
- Source artifacts retained under `class_ram_ifications assets/` + manifest/roster files.
- Retired FOLLOWER_01-05 and COLLECTIBLE_01 removed from both folders post-release.
- Cataloged comprehensively in `docs/ASSET_IMAGE_CATALOG.md`.

Current note:

- Long-term role of `class_ram_ifications assets/` (maintained mirror vs. source archive) remains a post-release decision.

Rationale:

- Allows deterministic regeneration while preserving runtime simplicity.

## 7. Runner Visual Integration

Decision:

- Replace runner placeholder entity rendering with sprite-backed draws where possible, retaining fallbacks.

Implementation:

- Sprite preloading and draw paths added in `runner_mode.js`.
- Fallback geometry retained for resilience if a sprite fails to load.
- Runtime chroma-key processing with safe fallback behavior is active in both `game.js` and `runner_mode.js`.

Rationale:

- Improves visual parity now without sacrificing robustness.

## 8. Validation And Release Posture

Decision:

- Continue enforcing syntax checks and checklist-driven smoke/deploy gating.

Implementation:

- Syntax checks run on key scripts before each deploy.
- `node scripts/run_all_checks.js` is the pre-deploy gate.
- `docs/SMOKE_TEST.md`, `docs/DEPLOY_CHECKLIST.md`, and `docs/RELEASE_CHECKLIST.md` updated for runner needs.

Rationale:

- Keeps migration quality controlled despite staged rollout.

## 9. Post-Sprint Decisions (All Resolved)

The following items were pending as of March 25–26, 2026 and are now resolved:

- Public title: `Class RAM-ifications` — locked and in use.
- Audio policy: BGM implemented, non-blocking for release — locked.
- Mobile parity: swipe/tap gestures, bottom sheet for info cards, dark mode default — fully implemented.
- Rounds 3 and 4 difficulty: initial easing pass complete — pending owner acceptance on feel only.
- Phase thresholds: confirmed as 3/4/5/6 (not 3/5/7/9) — corrected in all docs.
- Pause key: Escape — implemented with full applyPauseCompensation() coverage.
- BGM ducking during narrative: yes — ducks to 5% on popup open, restores to 24% on close.
- PWA: yes — manifest.json + sw.js service worker (cache name class-ram-v2) + favicon set in assets/favicon/.
- Debug shortcut set: F2 for overlay, Alt+0 for force-lose, Alt+1–5 for force-narrative — implemented, not player-facing.
- Win screen: popup 5 (phase4Clear) is the win moment — no separate win canvas overlay.

Still open:

- `class_ram_ifications assets/` long-term role (maintained mirror vs. source archive) — deferred to post-release.
- Manual live deploy sign-off once hosted build is verified.
