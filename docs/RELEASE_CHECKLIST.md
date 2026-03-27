# First Release Checklist

Last updated: March 27, 2026

Use this checklist before calling the first public build ready.

Companion references:

- [docs/RELEASE_CANDIDATE_STATUS.md](RELEASE_CANDIDATE_STATUS.md)
- [docs/GO_NO_GO_TEMPLATE.md](GO_NO_GO_TEMPLATE.md)

## Pre-Deploy Gate

- [ ] `node scripts/run_all_checks.js` passes (run immediately before deploy)

## Product Readiness

- [x] The full 1984 to 1995 run is playable without blocking bugs
- [x] Sprite alignment is good enough that gameplay reads clearly
- [x] HUD text, hint text, and end screens are readable
- [ ] Difficulty feels acceptable through at least one full run, including the intended slight easing of rounds 3 and 4 — pending owner acceptance
- [x] Phase thresholds are correct: 3, 4, 5, 6 (not 3/5/7/9)
- [x] Win condition: popup 5 (phase4Clear) is the win moment; no separate win canvas overlay

## Runner Pivot Readiness

- [x] `index.html` (runner default) is playable with no blocking errors
- [x] `index.html?mode=legacy` remains playable as regression reference
- [x] Lane switching and dash controls are responsive on desktop
- [ ] Lane switching and swipe controls are comfortable on real mobile hardware
- [x] Mobile info cards use the intended bottom-sheet treatment and pause gameplay when open
- [x] Solidarity threshold and barrier timing are understandable without external explanation
- [x] Barrier-clear effects (flash, sparkles, invulnerability glow arc) are visible and feel correct
- [x] Post-barrier invulnerability window (3 seconds) is functional
- [x] Precedent shield behavior is visually and mechanically clear
- [x] Historical finale messaging and Executive Order transition are correct
- [x] Escape key pauses and unpauses correctly; "PAUSED" shown in HUD
- [x] Touch devices: tap on paused canvas does nothing (no accidental resume)

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

- [x] Debug shortcuts (F2, Alt+0–5) are functional for development use
- [x] Debug shortcuts are not accessible or visible from any player-facing UI surface

## PWA Readiness

- [x] manifest.json present at root with correct name, short_name, display, and orientation
- [x] sw.js service worker present; cache name class-ram-v2; strategies correct
- [x] Favicon set complete in assets/favicon/ (ico, 32x32, 16x16, apple-touch-icon)
- [x] Favicon links in index.html head are correct
- [x] Open Graph and Twitter Card meta tags present in index.html
- [x] theme-color meta present (#0a0a0a)
- [ ] PWA installability verified in Chrome/Edge on desktop and mobile

## Repo And Asset Readiness

- [x] Runtime sprites are present in `assets/processed/`
- [x] Retired FOLLOWER_01-05 and COLLECTIBLE_01 removed from both asset folders
- [x] assets/New/ staging folder removed
- [x] assets/favicon/site.webmanifest orphan removed
- [ ] A decision has been made about the long-term role of `class_ram_ifications assets/`
- [x] The intended release files are committed intentionally

## Deployment Readiness

- [ ] [docs/DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) has been completed
- [ ] The live URL has been checked after deployment
- [ ] Any release-blocking issues discovered on live have been fixed or consciously deferred
