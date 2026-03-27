# Program Status

Last updated: March 27, 2026

## Current State

- Runner mode is default and stable.
- Legacy mode remains available for reference.
- Narrative system: 5 checkpoints (intro, phase1Clear, phase2Clear, phase3Clear, phase4Clear).
- Dynamic phase thresholds per round: 3, 4, 5, 6 (chain required to clear barrier).
- DIFFICULTY_MODES: story / organize / resist with per-stat scalars; default fallback is 'organize'.
- Victory resolves through popup 5 (phase4Clear / EO 12968 card) — no separate win canvas overlay.
- Pause system: Escape key toggles pause; full applyPauseCompensation() covers all active timers including phaseFlashUntil and postBarrierInvulnerabilityUntil; touch guard prevents accidental tap-resume.
- Barrier-clear effects: white flash overlay (~300ms), rainbow sparkle particles across canvas, 3-second post-barrier invulnerability with glow arc drawn under the player sprite.
- SFX: chainLoss (square beep, tail member lost), lifeLost (sawtooth 2-tone, direct player hit), barrierWarning (8-pulse escalating beep, cancelable via generation counter), narrativeSomber (sine wave, mournful), narrativeVictory, narrativeNeutral, narrativeHopeful, narrativeHappy, auditorHit.
- BGM ducks to 5% volume when a narrative popup opens and restores to 24% on close.
- Attempt counter: stored in localStorage key 'classRamAttempts', increments each resetGame(). Shown on You Lose screen alongside totalAlliesGathered.
- Debug shortcuts: F2 shows debug overlay with all shortcuts; Alt+1–5 forces narrative popups 1–5; Alt+0 forces You Lose state.
- PWA: manifest.json at root (name: "Class RAM-ifications", short_name: "Class RAM", display: standalone, orientation: landscape); sw.js service worker with cache name class-ram-v2 (cache-first for assets, network-first for navigation); favicon set in assets/favicon/.
- Open Graph and Twitter Card meta tags present in index.html.
- Touch/mobile: isLikelyTouchDevice() requires both pointer:coarse and max-width:900px; touch-ui class applied to body; gameEndedAt cooldown (1.5s) prevents accidental tap restart.
- Win/restart hint text adapts: "Tap to restart" on touch devices, "Press R or Enter to restart" on desktop.
- Popup tone styling and tone-specific SFX implemented.
- Phase background selection uses promoted location-specific art.
- Narrative popup cards rendered as artwork backplates with text overlay.
- Runner collectible/follower art uses the eight named HTG pride-roster members.
- Runner legend uses six top-level info cards with a pausing bottom-sheet adaptation on narrow touch layouts.
- Utility bar includes mute, bright/dark mode, difficulty selector, and restart controls.
- Retired FOLLOWER_01-05 and COLLECTIBLE_01 removed from both asset folders.

## Where The Project Wants To Be

- A polished, historically grounded runner release that is readable, playable, and emotionally clear on both desktop and mobile.
- A release candidate with manual smoke evidence, live verification evidence, and only consciously accepted non-blockers.
- A runner mode whose mobile UI matches the desktop intent rather than feeling like a fallback adaptation.
- A code/doc state where active assets, retired assets, and release decisions are all explicit and low-drift.

## Verification State

- run_all_checks: last passed March 26, 2026 — rerun pending to confirm current state.
- smoke_runner_focus: last passed March 26, 2026 (includes gameplay liveness check, mobile viewport sanity, and touch-hint dismissal).

## Open Non-Code Dependency

No external art dependency is blocking runner mode. All background, card, and HTG member PNGs are committed in both mirrored asset folders.

## Release Readiness Snapshot

Engineering: strong — all planned features implemented
Documentation: synchronized with current feature set (March 27 rewrite)
SFX audit: complete
Debug shortcuts: implemented, hidden from normal player view (F2 required)
Live deploy evidence: still pending
Device-matrix signoff: still pending real-device validation and owner signoff

Pre-deploy requirement: run `node scripts/run_all_checks.js` and confirm all checks pass.
