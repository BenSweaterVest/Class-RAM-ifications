# Development Guide

Last updated: March 27, 2026

## Runtime Ownership

- runner_mode.js: primary game logic, narrative, phase thresholds, collision/update/draw, pause, SFX triggers
- mode-loader.js: mode routing and setup
- audio.js: procedural SFX + BGM hooks
- index.html: UI shell, narrative theme styles, PWA meta, OG/Twitter meta
- game.js: legacy reference mode

## Current Runner Shell

- Keyboard and touch controls both supported. Touch gesture handling (swipe/tap) is implemented in `runner_mode.js` (`handleTouchGestureStart/Move/End/Cancel`).
- Top utility bar holds mute, theme, difficulty selector, and restart controls.
- Bottom hint text and legend-card rail are the primary on-page teaching surfaces.
- The earlier hidden touch-control/help shell was removed during closeout cleanup.
- `docs/MOBILE_GESTURE_PLAN.md` is the historical spec for gesture implementation; real-device tuning remains an open owner task.

## Difficulty System

Three named modes selectable from the top-bar dropdown (takes effect on next restart):

- `story` — longer wall intervals (×1.30), threshold −1, slower obstacles (×0.85), fewer spawns (×0.75)
- `organize` — default; all scalars at 1.0
- `resist` — tighter wall intervals (×0.85), threshold +1, faster obstacles (×1.15), denser spawns (×1.25)

If no difficulty value is stored, the game falls back to `organize`.

Base per-round profiles live in `ROUND_PROFILES` (runner_mode.js). `DIFFICULTY_MODES` holds the scalars. `getRoundProfile()` merges them and is the single source of truth for all difficulty-sensitive values: `wallIntervalMs`, `chainThreshold`, `memberSpawnMs`, `obstacleBase`, `solidarityRangePx`, `shieldDurationMs`, `speedMult`.

Obstacle pressure ramps 40% within each round (`WITHIN_ROUND_RAMP = 0.4`) then resets on barrier clear. Difficulty is captured from the dropdown at `resetGame()` and locked for the run.

## Implemented Runner Contracts

- 5 narrative keys in NARRATIVE_COPY
- 5-step sequence in NARRATIVE_SEQUENCE (intro, phase1Clear, phase2Clear, phase3Clear, phase4Clear)
- Per-round base chain thresholds: [3, 4, 5, 6] via ROUND_PROFILES — scaled by difficulty mode
- Precedent target PRECEDENT_TARGET = 4
- Phase-based year mapping and background key mapping

## Pause Feature

Escape key toggles pause when the game is active (not during a narrative popup or legend overlay).

`applyPauseCompensation(pauseDurationMs)` is called on resume and shifts all active timestamps forward by the pause duration. Covered timers:
- `phaseFlashUntil` (post-barrier white flash)
- `postBarrierInvulnerabilityUntil` (3-second invulnerability window)
- All obstacle and member spawn timers
- Shield expiry and slow/lock effect timers

The HUD renders "PAUSED" text while paused. On touch devices, a guard in `handleTouchGestureEnd` prevents a tap on the paused canvas from resuming the game accidentally.

## Barrier-Clear Flow

On successful shielded barrier contact:
- wall.passed = true
- precedentEstablished += 1
- score += 100
- White flash overlay activates (phaseFlashUntil, ~300ms)
- Rainbow sparkle particles spawned across the canvas
- Post-barrier invulnerability starts (postBarrierInvulnerabilityUntil, 3 seconds); invulnerability glow arc drawn under player sprite
- Phase-specific narrative card enqueued
- If final phase reached, victory card enqueued and pending victory marked

Victory finalizes after the player advances past the final narrative card (popup 5). No separate win canvas overlay exists.

## New SFX

All sounds are procedurally generated in `audio.js`.

### chainLoss
- Trigger: obstacle hits the tail member of the player's chain.
- Sound: short square wave beep.
- Distinct from lifeLost — indicates chain attrition, not life loss.

### lifeLost
- Trigger: obstacle hits the player directly (no chain member to absorb the hit).
- Sound: sawtooth wave, 2-tone descending sequence.
- Represents direct injury distinct from chain attrition.

### barrierWarning
- Trigger: a new barrier wall spawns.
- Sound: 8-pulse escalating beep sequence (Sonic-drowning style).
- Cancelable: each call to `playBarrierWarning()` increments a generation counter. Each scheduled pulse checks the generation before firing; stale pulses from a previous run are silently dropped. `cancelBarrierWarning()` is called in `resetGame()` to ensure clean state.

### narrativeSomber
- Sound: sine wave, mournful tone — intentionally distinct from the game-over sound.

### auditorHit
- Trigger: auditor hits a tower (legacy mode context). Present in audio.js.

## Attempt Counter And Allies Stat

- `localStorage` key `classRamAttempts` is read and incremented each time `resetGame()` is called.
- `totalAlliesGathered` tracks HTG members collected during the current run.
- Both values are displayed on the You Lose screen: "Allies gathered: X  ·  Attempt: Y".

## Debug Shortcuts

All debug shortcuts are handled in `runner_mode.js` keyboard handler. They are not exposed in any player-facing UI.

- F2: toggles a debug overlay that lists all available shortcuts.
- Alt+1 through Alt+5: force-opens narrative popups 1–5 respectively.
- Alt+0: forces the You Lose state immediately.

## PWA Support

- `manifest.json` at repo root:
  - name: "Class RAM-ifications"
  - short_name: "Class RAM"
  - display: standalone
  - orientation: landscape
- `sw.js` service worker at repo root:
  - Cache name: `class-ram-v2`
  - Strategy: cache-first for assets, network-first for navigation requests.
- Favicon set in `assets/favicon/`: favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png.
- Linked from `<head>` in `index.html`.
- `assets/favicon/site.webmanifest` was deleted (orphaned; manifest.json at root is authoritative).

## Meta Tags

`index.html` includes:
- `theme-color` meta: `#0a0a0a`
- Open Graph meta tags (og:title, og:description, og:image, og:type)
- Twitter Card meta tags (twitter:card, twitter:title, twitter:description, twitter:image)

## Narrative Styling + Sound

Theme classes applied to the popup container:
- runner-narrative-theme-neutral
- runner-narrative-theme-hopeful
- runner-narrative-theme-happy
- runner-narrative-theme-somber
- runner-narrative-theme-victory

Audio cues (procedural, in audio.js):
- narrativeNeutral
- narrativeHopeful
- narrativeHappy
- narrativeSomber (sine wave, mournful)
- narrativeVictory

BGM behavior during narrative:
- On popup open: BGM volume ducks to 5%.
- On popup close: BGM volume restores to 24%.

## Backgrounds

Runtime chooses phase background by precedent count. If a phase asset fails to load, fallback is ENV_02 default background.

Promoted phase backgrounds:
- BG_01_v3_BackgroundSiliconValley_00001_.png
- BG_02_v1_BackgroundDistrictCourt_00001_.png
- BG_03_BackgroundAppealsCourt_00001_.png
- BG_04_v3_BackgroundWashingtonDC_00001_.png

Promoted narrative popup cards:
- CARD_01_CardIntro1984_00001_.png
- CARD_02_CardSuitFiled1984_00001_.png
- CARD_03_CardHendersonRules1987_00001_.png
- CARD_04_CardReversal1990_00001_.png
- CARD_05_CardExecutiveOrder1995_00001_.png

Runner obstacle sprites:
- ENEMY_02_CorporateSuit_00001_.png (suit)
- VintageSLOW_CABINET_v4_SlowObstacle-FilingCabinet_00001_.png (cabinet)
- LOCK_BOT_v3_LaneLockObstacle-SurveillanceBot_00001_.png (bot)
- BARRIER_v5_BarrierWall-SecurityDoor_00001_.png (barrier wall)

Runner HTG member roster:
- HTG_01_HTGMemberAlex_00001_.png
- HTG_02_HTGMemberCarmen_00001_.png
- HTG_03_HTGMemberMarcus_00001_.png
- HTG_04_HTGMemberSam_00001_.png
- HTG_05_HTGMemberJordan_00001_.png
- HTG_06_HTGMemberDani_00001_.png
- HTG_07_HTGMemberRobin_00001_.png
- HTG_08_HTGMemberEvelyn_00001_.png

## Validation Commands

- `node scripts/run_all_checks.js` — full verification bundle (run before every deploy)
- `node scripts/smoke_runner_focus.js` (with local static server running)

## Maintenance Rules

- Keep docs and smoke assertions synchronized with narrative copy changes.
- Prefer additive fallbacks over hard asset assumptions.
- Keep `assets/processed/` and `class_ram_ifications assets/` PNGs mirrored so `check_asset_sync` stays green.
- Keep legacy mode untouched unless explicitly requested.
- Debug shortcuts must not appear in any player-facing UI surface.
