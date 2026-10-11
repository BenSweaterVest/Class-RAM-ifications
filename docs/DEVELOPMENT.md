# Development Guide

Last updated: September 11, 2026

## Runtime Ownership

- runner_mode.js: game logic, narrative, phase thresholds, collision/update/draw, pause, run timer, keyboard and touch input, SFX triggers
- mode-loader.js: page shell setup (input-mode detection, top-bar toggles, BGM track, loading runner_mode.js). It registers no game key handler.
- audio.js: procedural SFX, audio unlock on first gesture, BGM hooks
- index.html: UI shell, styles, PWA and link-preview meta, info modals (inline script)
- sw.js: service worker precache list and fetch strategy
- scripts/: check bundle and Playwright smoke tests

## Current Runner Shell

- Keyboard and touch controls both live in `runner_mode.js` (`handleRunnerKeydown`, `handleTouchGestureStart/Move/End/Cancel`).
- Top utility bar holds HOW TO PLAY and ABOUT (far left) plus mute, theme, difficulty selector, restart, and compact-UI controls (right). Opening a modal calls `runnerControls.pause()`; closing it calls `runnerControls.resume()` only if the modal introduced the pause. A capture-phase keydown listener closes the modal on Escape and swallows other game keys while it is open (Tab still moves focus).
- The HUD row shows chain/threshold, lives, status, phase year, and the run countdown (`#time-val`).
- The difficulty `<select>` keeps native keyboard handling while focused (the game key handler ignores events whose target is a select) and blurs itself after a change so the arrow keys return to the player.
- Bottom hint text and the legend-card rail are the on-page teaching surfaces.
- Real-device testing of swipe/tap comfort and balance was done March 28, 2026.

## Frame Timing

`loop()` computes `frameScale = (now - lastFrameAt) / (1000 / 60)`, capped at `MAX_FRAME_SCALE` (3), and passes it to `update()` and `updateWinEffects()`. Every per-frame movement (player steps, obstacles, members, wall, particles, fireworks, disco balls) multiplies by it, and the follower trail is sampled through an accumulator so spacing stays constant. Speeds in the source are therefore "pixels per 60 Hz frame". Timers stay in milliseconds and are not scaled.

When adding movement, multiply the step by `frameScale`. When adding a timer, add it to `applyPauseCompensation()`.

## Difficulty System

Three named modes selectable from the top-bar dropdown (takes effect on next restart):

- `story`: longer wall intervals (x1.30), threshold -1, slower obstacles (x0.85), fewer spawns (x0.75)
- `organize`: default; all scalars at 1.0
- `resist`: tighter wall intervals (x0.85), threshold +1, faster obstacles (x1.15), denser spawns (x1.25)

If no difficulty value is stored, the game falls back to `organize`.

Base per-round profiles live in `ROUND_PROFILES` (runner_mode.js). `DIFFICULTY_MODES` holds the scalars. `getRoundProfile()` merges them and is the single source of truth for all difficulty-sensitive values: `wallIntervalMs`, `chainThreshold`, `memberSpawnMs`, `obstacleBase`, `solidarityRangePx`, `shieldDurationMs`, `speedMult`.

Obstacle pressure ramps 40% within each round (`WITHIN_ROUND_RAMP = 0.4`) then resets on barrier clear. Difficulty is captured from the dropdown at `resetGame()` and locked for the run.

## Implemented Runner Contracts

- 5 narrative keys in NARRATIVE_COPY
- 5-step sequence in NARRATIVE_SEQUENCE (intro, phase1Clear, phase2Clear, phase3Clear, phase4Victory)
- Per-round base chain thresholds: [3, 4, 5, 6] via ROUND_PROFILES, shifted by difficulty mode
- Precedent target PRECEDENT_TARGET = 4
- Run length RUN_DURATION_MS = 180000
- Phase-based year mapping and background key mapping

## Pause System

State: `narrativePaused`, `legendPaused`, `gamePaused`, plus `simulationPausedSince`, the one clock they share.

- `isSimulationPaused()` is the single question `update()`, the input handlers, and `getSolidarityState()` ask.
- `syncPauseClock()` runs after any flag changes. It starts the clock on the first pause and, when the last pause ends, calls `applyPauseCompensation(elapsed)` once.
- `setGamePaused(paused)` is the Escape / modal / hidden-tab entry point. It refuses to pause while a story card or info card already has the game stopped, and returns whether the state changed.
- `runnerControls.pause()`, `resume()`, and `isPaused()` expose it to the page shell.
- `document` `visibilitychange` pauses the run when the tab is hidden.
- Touch: a tap while paused resumes, since a phone has no Escape key.
- Escape with an info card expanded collapses the card instead of toggling pause. `resetGame()` collapses any open card.

`applyPauseCompensation(deltaMs)` shifts: runStart, roundStart, spawn and wall clocks, nextPatternAt, pending spawns, lane lock and its cooldown, player slow / cooldown / hit-flash timers, feedback text timers, phase flash, post-barrier invulnerability, wall warning and shield, obstacle telegraphs, and particle lifetimes.

The run timer readout (`updateTimeDisplay`) uses `simulationPausedSince` as its reference while paused, so the displayed time holds.

## Run End

`endRun(reason)` is the only place a run ends in failure. `reason` is `lives`, `barrier`, or `timeout`, and `getRunEndReasonText()` turns it into the first line of the You Lose screen. Victory goes through `advanceNarrative()` after the phase4Victory card, which also plays the win SFX and opens the win overlay.

## Sprite Grayscale Processing

`applyRunnerChromaKey(source, applyGrayscale)` accepts an optional second argument. When `true`, after chroma-key removal, each non-transparent pixel is converted to grayscale and contrast-boosted (equivalent to CSS `grayscale(1) contrast(1.1)`). This is used for suit sprites:

```javascript
runnerSpriteAssets[key] = applyRunnerChromaKey(img, key === 'suit');
```

This replaces `ctx.filter`, which Safari iOS < 18 silently ignores. Baking the effect into the ImageData at load time works everywhere, and `drawRunnerSprite` has no filter path anymore.

## Barrier-Clear Flow

On successful shielded barrier contact:
- wall.passed = true
- precedentEstablished += 1
- score += 100
- White flash overlay activates (phaseFlashUntil, 600 ms)
- Rainbow sparkle particles spawned across the canvas
- Post-barrier invulnerability starts (postBarrierInvulnerabilityUntil, 3 seconds); invulnerability glow arc drawn under player sprite
- Phase-specific narrative card enqueued
- If final phase reached, victory card enqueued and pending victory marked

Victory finalizes after the player advances past the final narrative card (popup 5).

## Audio

All sounds are procedurally generated in `audio.js`.

Unlock: `beep()` returns early until `unlocked` is set. A capture-phase pointerdown / touchstart / keydown listener on window sets it and resumes the context. A context created before a gesture stays suspended with `currentTime` at 0, and every oscillator scheduled in that state plays at once when it resumes; the gate prevents that burst. `sfx.init()` remains as an explicit unlock for handlers that want it.

Mute: `sfx.toggleMute()` dispatches `sfx-mute-changed` on window. mode-loader.js listens and refreshes the MUTE button, so the M key and the button stay in sync.

SFX: fileCleared (pickup), stageAdvance (Solidarity), chainLoss, lifeLost, barrierWarning, gameOver, win, and the five narrative cues.

- chainLoss: obstacle hits the tail member; short square beep.
- lifeLost: obstacle hits the player with an empty chain; sawtooth 2-tone.
- barrierWarning: new barrier spawns; 8 escalating pulses over about 1.75 s. Each call increments a generation counter and each scheduled pulse checks it before firing, so `cancelBarrierWarning()` in `resetGame()` drops stale pulses.
- narrativeSomber: sine wave, deliberately unlike the game-over sound.

## Attempt Counter And Allies Stat

- `localStorage` key `classRamAttempts` is read and incremented each time `resetGame()` is called.
- `totalAlliesGathered` tracks HTG members collected during the current run.
- Both values are displayed on the You Lose screen: "Allies gathered: X  ·  Attempt: Y".
- `classRamTotalAllies` accumulates across wins and is shown on the win screen.

## Debug Shortcuts

`DEBUG_ENABLED` is true only when the URL has a `debug` query parameter (`index.html?debug`). Without it, F2 and the Alt shortcuts do nothing.

- F2: debug overlay listing state and shortcuts
- Alt+1 through Alt+5: force narrative popups
- Alt+0: force You Lose (reason `lives`)
- Alt+6: force You Win with fake per-phase counts (this writes to the all-time localStorage total)

`window.runnerDebug` (also `?debug` only) exposes `snapshot()`, a read-only copy of the run state (flags, lives, chain and threshold, precedents, player position and lanes, wall position and phase, member positions, the current Solidarity state), and `setInvulnerable(value)`, which makes `update()` skip obstacle collisions. `scripts/smoke_full_run.js` uses both to play a complete run; the barrier wall check is never skipped, so a missed Solidarity still fails the test.

## Accessibility

- `prefers-reduced-motion: reduce` skips the full-screen barrier flash (`REDUCED_MOTION`). Sparkles and fireworks still play.
- Hint text on the pause and lose screens uses `prefersTouchHints()`: touch-ui layout, a coarse pointer with no hover, or a touch gesture seen this session.
- Legend cards are buttons; Enter and Space toggle them, Escape closes an expanded one.
- The info modals move focus to their close button on open and return game keys only after they close.

## PWA Support

- manifest.json: name, short_name, start_url `./`, display standalone, orientation landscape, icons.
- sw.js: CACHE_NAME `class-ram-v5`. Precaches index, scripts, manifest, audio, favicons, and all 32 sprites. Navigation requests are network-first with the cached index as fallback; everything else is cache-first with `ignoreSearch: true`.
- Shipping a change to any cached file requires bumping CACHE_NAME. Do not add cache-busting query strings to script URLs; the contract check fails on `Date.now()` in mode-loader.js.
- `scripts/check_sw_assets.js` fails the bundle if a precached path is missing on disk, a sprite in assets/processed is not precached, or a manifest icon is missing.
- The two archive.org thumbnails in the ABOUT modal are cached at runtime as opaque responses (`isInspiredByThumbnail` in sw.js) so they still show offline after one online view.

## Meta Tags

`index.html` head includes theme-color, a meta description, Open Graph (title, description, type, url, image), and Twitter Card tags. Image URLs are absolute (https://class-ram-ifications.pages.dev/...) because link scrapers do not resolve relative paths.

Both `mobile-web-app-capable` and `apple-mobile-web-app-capable` are present. Safari reads the Apple name; Chrome reads the standard one and logs a deprecation warning if only the Apple name is there. The manifest's `display: standalone` is what actually governs installed behavior on Chromium.

## Narrative Styling + Sound

Theme classes applied to the popup container:
- runner-narrative-theme-neutral
- runner-narrative-theme-hopeful
- runner-narrative-theme-happy
- runner-narrative-theme-somber
- runner-narrative-theme-victory

Audio cues (procedural, in audio.js): narrativeNeutral, narrativeHopeful, narrativeHappy, narrativeSomber, narrativeVictory. The cue repeats every 2.8 s while the card is open.

BGM behavior during narrative:
- On popup open: BGM volume ducks to 5%.
- On popup close: BGM volume restores to 24%.

## Backgrounds

Runtime chooses phase background by precedent count. If a phase asset fails to load, fallback is the ENV_02 default background.

Phase backgrounds:
- BG_01_v3_BackgroundSiliconValley_00001_.png
- BG_02_v1_BackgroundDistrictCourt_00001_.png
- BG_03_BackgroundAppealsCourt_00001_.png
- BG_04_v3_BackgroundWashingtonDC_00001_.png

Narrative popup cards:
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

- `npm test` (or `node scripts/run_all_checks.js`): syntax, runner contract, smoke contract, service worker precache list. Run before every deploy.
- `npm run serve`, then in another terminal `npm run smoke`: Playwright shell smoke, runner smoke, and the full-run smoke (about two minutes) against http://127.0.0.1:4173.

## Repo Conventions

- Line endings: `.gitattributes` sets `* text=auto eol=lf`, so every text file is stored and checked out as LF regardless of a machine's `core.autocrlf`. Image and audio files are marked binary.
- Editor settings: `.editorconfig` mirrors that (LF, UTF-8, final newline) and records the indent styles already in use: 4 spaces in the game files and index.html, 2 spaces in `scripts/` and package.json. Markdown keeps trailing whitespace.
- If a file ever shows as modified with no visible change, it is a line-ending difference; `git add --renormalize .` fixes it.

## Maintenance Rules

- Keep docs and smoke assertions synchronized with narrative copy changes.
- Prefer additive fallbacks over hard asset assumptions.
- runner_mode.js owns keyboard input. Do not add a second window keydown handler for game keys.
- New per-frame motion multiplies by frameScale; new timers go into applyPauseCompensation().
- Bump CACHE_NAME in sw.js whenever a cached file changes.
- Debug shortcuts stay behind `?debug` and off every player-facing surface.
