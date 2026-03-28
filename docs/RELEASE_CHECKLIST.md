# First Release Checklist

Last updated: March 28, 2026

Use this checklist before calling the first public build ready.

Companion references:

- [docs/GO_NO_GO_TEMPLATE.md](GO_NO_GO_TEMPLATE.md)

## Pre-Deploy Gate

- [x] `node scripts/run_all_checks.js` passes — **PASSED March 28, 2026** (modals are inline HTML/JS in index.html; not in checked scripts)

## Product Readiness

- [x] The full 1984 to 1995 run is playable without blocking bugs
- [x] Sprite alignment is good enough that gameplay reads clearly
- [x] HUD text, hint text, and end screens are readable
- [x] Difficulty feels acceptable through at least one full run — accepted by owner after real-device testing (March 28, 2026)
- [x] Phase thresholds are correct: 3, 4, 5, 6 (not 3/5/7/9)
- [x] Win condition: popup 5 (phase4Victory) is the win moment; win screen overlay with fireworks, disco balls, and per-phase ally stats appears after

## Runner Pivot Readiness

- [x] `index.html` is playable with no blocking errors
- [x] Lane switching and dash controls are responsive on desktop
- [x] Lane switching and swipe controls are comfortable on real mobile hardware — verified on real device (March 28, 2026)
- [x] Mobile info cards use the intended bottom-sheet treatment and pause gameplay when open
- [x] Solidarity threshold and barrier timing are understandable without external explanation
- [x] Barrier-clear effects (flash, sparkles, invulnerability glow arc) are visible and feel correct
- [x] Post-barrier invulnerability window (3 seconds) is functional
- [x] Precedent shield behavior is visually and mechanically clear
- [x] Historical finale messaging and Executive Order transition are correct
- [x] Escape key pauses and unpauses correctly; "PAUSED" shown in HUD
- [x] Touch devices: tap on paused canvas does nothing (no accidental resume)
- [x] HOW TO PLAY and ABOUT modal buttons implemented in mode-banner (keyboard + touch controls, historical context and attribution; Escape closes without triggering pause)

## Audio Readiness

- [x] Release stance recorded: BGM remains implemented but is non-blocking for release
- [x] chainLoss SFX (square beep) plays on tail member hit
- [x] lifeLost SFX (sawtooth 2-tone) plays on direct player hit
- [x] barrierWarning SFX (8-pulse escalating beep) plays on barrier spawn
- [x] barrierWarning cancels cleanly on quick restart (generation counter)
- [x] narrativeSomber is a sine wave tone, distinct from game-over sound
- [x] BGM ducks to 5% on narrative popup open; restores to 24% on close
- [ ] BGM startup and mute behavior verified in the live build

## SFX Audit

- [x] All SFX audited and distinct: chainLoss / lifeLost / barrierWarning / narrativeSomber / narrativeVictory confirmed non-conflicting

## Persistence And Stats

- [x] Attempt counter (localStorage 'classRamAttempts') increments correctly on each restart
- [x] totalAlliesGathered displayed on You Lose screen alongside attempt number

## Debug Shortcuts

- [x] Debug shortcuts (F2, Alt+0–6) are functional for development use
- [x] Debug shortcuts are not accessible or visible from any player-facing UI surface

## PWA Readiness

- [x] manifest.json present at root with correct name, short_name, display, and orientation
- [x] sw.js service worker present; cache name class-ram-v3; strategies correct
- [x] Favicon set complete in assets/favicon/ (ico, 32x32, 16x16, apple-touch-icon)
- [x] Favicon links in index.html head are correct
- [x] Open Graph and Twitter Card meta tags present in index.html
- [x] theme-color meta present (#0a0a0a)
- [ ] PWA installability verified in Chrome/Edge on desktop and mobile

## Repo And Asset Readiness

- [x] Runtime sprites are present in `assets/processed/` (32 PNGs)
- [x] All retired/legacy assets removed (FOLLOWER_01-05, COLLECTIBLE_01, TOWER_01-04, PROJ_01-02)
- [x] Source mirror folder and generation metadata removed (project is feature-complete)
- [x] assets/New/ staging folder removed
- [x] assets/favicon/site.webmanifest orphan removed
- [x] The intended release files are committed intentionally

## Deployment Readiness

- [ ] All deployment readiness items in this checklist have been completed
- [ ] The live URL has been checked after deployment
- [ ] Any release-blocking issues discovered on live have been fixed or consciously deferred
