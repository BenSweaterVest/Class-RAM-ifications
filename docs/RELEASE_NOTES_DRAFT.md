# Release Notes Draft

Last updated: March 27, 2026

---

## Session: March 27, 2026

### Pause System
- Escape key toggles pause when the game is active (not during narrative or legend overlay).
- Full `applyPauseCompensation()` coverage: phaseFlashUntil, postBarrierInvulnerabilityUntil, and all spawn/effect timers shift forward by the pause duration on resume.
- HUD shows "PAUSED" status while paused.
- Touch guard in `handleTouchGestureEnd` prevents accidental tap-resume on touch devices.

### Barrier-Clear Effects
- White flash overlay on barrier clear (~300ms, phaseFlashUntil).
- Rainbow sparkle particles spread across the canvas on each barrier clear.
- 3-second post-barrier invulnerability window (postBarrierInvulnerabilityUntil); invulnerability glow arc drawn under the player sprite.

### SFX Additions And Distinctions
- `barrierWarning`: 8-pulse escalating Sonic-drowning beep when a barrier wall spawns. Cancelable via generation counter; `cancelBarrierWarning()` called in `resetGame()` prevents phantom beeps on quick restart.
- `chainLoss`: short square beep when an obstacle hits the tail member of the chain (chain attrition).
- `lifeLost`: sawtooth 2-tone descending sequence when an obstacle hits the player directly (life loss).
- `narrativeSomber` retuned to a sine wave — mournful and clearly distinct from the game-over sound.

### BGM Ducking During Narrative
- BGM ducks to 5% volume when any narrative popup opens.
- BGM restores to 24% when the popup is closed.

### Attempt Counter And Allies Gathered
- `localStorage` key `classRamAttempts` increments on each `resetGame()` call.
- `totalAlliesGathered` tracks HTG members collected during the current run.
- Both shown on the You Lose screen: "Allies gathered: X  ·  Attempt: Y".

### Debug Shortcuts
- F2: toggles debug overlay listing all shortcuts.
- Alt+1 through Alt+5: force-opens narrative popups 1–5.
- Alt+0: forces You Lose state immediately.
- Not exposed in any player-facing UI.

### PWA Support
- `manifest.json` at root: name "Class RAM-ifications", short_name "Class RAM", display standalone, orientation landscape.
- `sw.js` service worker: cache name `class-ram-v2`, cache-first for assets, network-first for navigation.
- Favicon set: favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png — all in `assets/favicon/`.
- Orphaned `assets/favicon/site.webmanifest` removed.

### Open Graph And Twitter Card Meta Tags
- og:title, og:description, og:image, og:type added to `index.html`.
- twitter:card, twitter:title, twitter:description, twitter:image added to `index.html`.
- theme-color meta: `#0a0a0a`.

### Touch And Win Hint Fix
- Win/restart hint text is now device-aware: "Tap to restart" on touch, "Press R or Enter to restart" on desktop.
- `gameEndedAt` cooldown (1.5s) prevents accidental tap restart on the lose screen.

### Difficulty Default Fix
- Difficulty mode now falls back to `organize` if no value is stored in localStorage, preventing undefined behavior on first load.

### Win Screen Simplification
- Win moment is popup 5 (phase4Clear / EO 12968 card). The separate win canvas overlay has been removed; the final narrative card is now the win moment.

---

## Runner RC Draft 1 — March 25, 2026

### Summary

This release candidate shifts the primary experience to the runner pivot while preserving legacy mode as a regression reference path.

### Highlights

- Runner is now default at `index.html`.
- Legacy remains available at `index.html?mode=legacy`.
- Runner core loop includes lane movement, dash, chain collection, barrier events, solidarity activation, precedent progression, and courtroom finale resolution.
- Narrative checkpoints now pause gameplay at key milestones until explicit continue.
- Narrative continue controls are hardened for click, touch, and keyboard progression.
- Intro checkpoint text now opens with direct court-case context before gameplay guidance.
- Solidarity feedback now explains readiness and failure reasons.
- Sprite-backed rendering is active with geometry fallback resilience in both runner and legacy.
- Runner people readability is improved with member/suit scale variation and pride-color member variation.
- New phase backgrounds, historical checkpoint cards, and eight named HTG member sprites are installed.
- Runner now includes mute, dark/bright theme, restart, richer legend cards, and first-pass mobile swipe/tap support.

### Verification Improvements

- Added scripted contract checks:
  - `scripts/check_asset_sync.js`
  - `scripts/check_runner_contract.js`
  - `scripts/check_smoke_contract.js`
- Added one-command verification bundle:
  - `scripts/run_all_checks.js`

### Documentation Additions

- Program-wide status snapshot: `docs/PROGRAM_STATUS.md`
- Release candidate snapshot: `docs/RELEASE_CANDIDATE_STATUS.md`
- Go/no-go decision template: `docs/GO_NO_GO_TEMPLATE.md`

### Known Open Decision Gates At Time Of RC Draft 1

- Final acceptance on the rounds 3 and 4 easing pass
- Mobile bottom-sheet conversion for the info-card row
- Long-term handling of source asset folder
- Post-release cleanup of retired generic runner follower/collectible art

### Planned Before Release Sign-Off

- Complete full local manual smoke checklist
- Complete live deploy smoke validation
- Finalize blocker/non-blocker go/no-go outcome
