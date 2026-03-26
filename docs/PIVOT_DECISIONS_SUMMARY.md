# Pivot Decisions Summary

Last updated: March 26, 2026
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
- Sprint planning is aligned in `docs/ROADMAP.md` and `docs/TODOS.md`.

Rationale:

- Better supports short-session accessibility and the systemic barrier metaphor.

## 3. Core Runner Mechanics

Decision:

- Runner loop must include: lane movement, dash, collection chain, obstacle pressure, systemic barrier, solidarity activation, precedent counter.

Implementation:

- Implemented in `runner_mode.js`.
- Obstacle scheduling uses pattern waves (suit/cabinet/bot).
- Tail-first chain loss implemented.
- Barrier warning and activation window implemented.
- Precedent establishment tracked and surfaced in HUD.

Rationale:

- Enforces collective-action-as-mechanic rather than optional flavor.

## 4. Historical Finale

Decision:

- Add symbolic courtroom finale and EO 12968 outcome condition.

Implementation:

- Courtroom phase activates late-run in `runner_mode.js`.
- Outcome resolves to EO messaging when precedent target is met.

Rationale:

- Preserves historical framing and explicit policy-through-precedent arc.

## 5. Mobile Parity

Decision:

- Keep runner mode readable on smaller screens and add a gesture-first mobile layer without reviving the old touch button shell.

Implementation:

- Responsive legend and narrative layouts remain in `index.html`.
- Touch-capable devices now get swipe/tap runner controls, a touch-specific hint, and mobile HUD/layout adjustments.
- Keyboard control and restart/mute/theme flows remain active in `runner_mode.js` and `mode-loader.js`.
- The earlier hidden touch-control shell was removed during closeout cleanup instead of being reused.

Rationale:

- Preserves smaller-screen compatibility without covering the playfield with persistent buttons or carrying dead on-screen control UI that no longer matches the shipped experience.

## 6. Asset Pipeline And Runtime Source Of Truth

Decision:

- Keep `assets/processed/` as runtime asset source while retaining source-generation assets and metadata.

Implementation:

- Runtime sprites loaded from `assets/processed/`.
- Source artifacts retained under `class_ram_ifications assets/` + manifest/roster files.
- Cataloged comprehensively in `docs/ASSET_IMAGE_CATALOG.md`.

Current note:

- Source/runtime asset folders now include a larger 27-image pack with semantic role mapping active in runner mode.

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

- Syntax checks repeatedly run on key scripts.
- `docs/SMOKE_TEST.md`, `docs/DEPLOY_CHECKLIST.md`, and `docs/RELEASE_CHECKLIST.md` updated for runner needs.

Rationale:

- Keeps migration quality controlled despite staged rollout.

## 9. Remaining Open Decisions

Decided (as of March 25–26, 2026):

- Public title: `Class RAM-ifications` — locked.
- Audio policy: BGM implemented, non-blocking for release — locked.
- Mobile parity: swipe/tap gestures, bottom sheet for info cards, dark mode default — implemented.
- Rounds 3 and 4 difficulty: initial easing pass complete — pending owner acceptance on feel.

Still open:

- `class_ram_ifications assets/` long-term role (maintained mirror vs. source archive) — Sprint 4 decision.
- Manual live deploy sign-off once hosted build is verified.

See `docs/NEXT_SPRINTS_PLAN.md` for the authoritative sprint breakdown and open questions.
