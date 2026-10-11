# Program Status

Last updated: September 11, 2026

## Current State

**Review pass complete. Ready to deploy.**

- Live URL: https://class-ram-ifications.pages.dev/ (Cloudflare Pages, direct GitHub integration)
- Runner mode is the sole experience; legacy tower-defense mode retired.
- 32 sprites in `assets/processed/`. All duplicate/legacy files removed from repo.

## Feature Summary

- Runner loop: 5 lanes, 3 obstacle classes, 4 barriers to clear, Solidarity gating, 3-minute run with HUD countdown
- Frame-rate-independent movement (same pace on 30, 60, and 120 Hz displays)
- 5 narrative checkpoints with illustrated card art, tone SFX (looping while open), BGM ducking
- 3 difficulty modes: story / organize (default) / resist
- Win screen: fireworks, disco balls, per-phase ally stats, all-time total, "Play Again?"
- You Lose screen: reason for the loss, allies gathered, attempt counter (localStorage)
- One pause system for Escape, story cards, info cards, info modals, and hidden tabs; input ignored while paused; tap resumes on touch
- Barrier-clear effects: white flash, rainbow sparkles, 3-second invulnerability glow arc
- Mobile: swipe/tap controls, touch hint, pausing bottom-sheet info cards
- PWA: manifest.json, sw.js (class-ram-v5), favicon set, absolute OG/Twitter meta; works offline after first visit
- HOW TO PLAY / ABOUT buttons in the mode banner; opening one pauses the run
- Audio: procedural SFX gated on the first user gesture; M key and MUTE button stay in sync
- Debug shortcuts (F2, Alt+0-6) and `window.runnerDebug` only with `?debug` in the URL
- Accessibility: reduced-motion users skip the barrier flash; hints follow the actual input device; difficulty dropdown works by keyboard; Escape closes an open info card

## Verification (September 11, 2026)

- `npm test` (`scripts/run_all_checks.js`): **PASS** (syntax for runner_mode.js, mode-loader.js, audio.js; runner contract; smoke contract; service worker precache list)
- `scripts/smoke_mode_shell.js`: **PASS**
- `scripts/smoke_runner_focus.js`: **PASS**, 3 of 3 runs (the liveness check was previously flaky)
- `scripts/smoke_full_run.js`: **PASS** (4 barriers on story difficulty in 123 s, 5 narrative cards, win overlay, EO 12968 status, all-time ally total persisted)
- Behavior probe in headless Chromium (scratch script, not committed): no audio scheduled before the first gesture; one game key handler; R ignored on a story card; timer counts and holds while paused; M syncs the mute label; one Solidarity attempt per Space; modals pause and resume; an Escape pause survives a modal; hidden tab pauses; `?debug` gating; mobile tap continues a card and resumes a pause; one cache entry per script after repeated loads; no console errors
- Offline reload with the static server stopped: **PASS**
- Not re-tested on hardware since March 28, 2026: real-device swipe comfort and balance. Frame scaling changes nothing at 60 Hz, which is where balance was tuned.

## Remaining Owner Actions

1. Commit and push to main; Cloudflare Pages deploys automatically
2. Follow `docs/LIVE_VERIFICATION_RUNBOOK.md` on the live URL
3. Fill in `docs/GO_NO_GO_TEMPLATE.md` and sign off
