# Release Notes — Class RAM-ifications

Live: https://class-ram-ifications.pages.dev/

---

## v1.1 Review Pass (September 11, 2026)

A code review of the v1 build found a set of functional bugs. All are fixed in this pass; the full list with root causes is in docs/KNOWN_ISSUES.md.

Gameplay
- Movement no longer depends on the display refresh rate. Obstacles, the wall, and pickups cover the same distance per second on 30, 60, and 120 Hz screens.
- The HUD shows the 3-minute countdown, and the You Lose screen says why the run ended (lives, barrier, or time). The restart hint matches the input mode.
- Pausing blocks movement and Solidarity. Story cards, info cards, Escape, the info modals, and a hidden tab share one pause clock, so overlapping pauses no longer compensate timers twice.
- HOW TO PLAY and ABOUT pause the run while open. A hidden browser tab pauses it too; on touch devices a tap resumes.
- One Space press makes one Solidarity attempt (a duplicate key handler in the loader was removed), and R no longer restarts while a story card is open.
- Debug shortcuts require `?debug` in the URL.
- Escape closes an open info card before it pauses, and restarting collapses one. The difficulty dropdown can be changed by keyboard.
- Players with reduced motion enabled skip the white barrier flash. Hint text says "Tap" on tablets that have no keyboard.

Audio
- No sound is scheduled before the first click or key, which removes the burst of stacked beeps that played on the first gesture.
- The M key updates the MUTE button.

PWA and sharing
- The game script is cached under a stable URL, so the app works offline after the first visit and the cache no longer grows on every load. Service worker cache is `class-ram-v5`.
- Link previews use absolute image URLs; og:url and a meta description were added.
- The ABOUT thumbnails from archive.org are cached after the first online view, so they show offline.

Tooling
- `npm test` runs the check bundle, which now includes a service worker precache check; `npm run serve` and `npm run smoke` cover the Playwright smokes. The runner smoke's liveness check is deterministic.
- `scripts/smoke_full_run.js` plays a complete run through all four barriers and checks the win path, using a `?debug`-only `window.runnerDebug` hook.
- `.gitattributes` pins LF line endings and `.editorconfig` records the indent styles, so clones on any OS match the repository.
- The standard `mobile-web-app-capable` meta tag sits alongside the Apple one, which removes a Chrome deprecation warning.

---

## v1 (March 28, 2026)

## What It Is

A historical arcade runner about *High Tech Gays v. Defense Industrial Security Clearance Office* (1984–1995). You play as Timothy Dooling, a nuclear fusion engineer whose clearance was caught in DISCO's discriminatory investigation policy. Collect HTG members, survive hazards, and clear institutional barriers with Solidarity to reach Executive Order 12968.

---

## Core Game

- **Runner loop:** 5 lanes, 3 obstacle classes (suit / cabinet / bot), 4 barriers to clear, PRECEDENT_TARGET = 4
- **Chain system:** collect 8 named HTG members; chain length gates Solidarity activation
- **Phase thresholds:** 3 → 4 → 5 → 6 (base, scaled by difficulty)
- **Solidarity:** activated at barrier when chain ≥ threshold; spends chain, clears barrier, advances phase
- **Difficulty modes:** story / organize (default) / resist — scalars on wall interval, threshold, obstacle speed, spawn density
- **Pause:** Escape key with timer compensation (v1.1 adds the shared pause clock and tap-to-resume)

## Narrative

5 historical checkpoints: intro (1984) → phase 1–3 clears → phase 4 victory (EO 12968). Each checkpoint has:
- Illustrated card art as backplate
- Tone-specific SFX (neutral / hopeful / happy / somber / victory)
- SFX loops with 2800ms gap while popup is open
- BGM ducks to 5% during popup; restores to 24% on close

## Win / Lose

**Win:** clear 4 barriers → advance past phase4Victory popup → win screen overlay:
- Procedural fireworks (multi-direction, some multi-color)
- Bouncing disco balls
- Per-phase ally counts labeled by year and level
- All-time machine total (localStorage)
- "Play Again?" restarts at same difficulty

**Lose:** run out of 3 lives, hit a barrier without Solidarity, or run out of time. Shows the reason, allies gathered this run, and attempt count.

## Mobile

- Swipe/tap controls on genuine small touch devices (pointer:coarse + max-width:900px)
- Touch hint dismisses after first gesture
- Legend info cards open as pausing bottom sheet on narrow layouts
- 1.5s cooldown prevents accidental tap-restart on lose screen

## Art

8 named HTG members (pride-flag colors: Alex/Hot Pink → Evelyn/Violet), 4 phase backgrounds, 5 narrative cards, player/obstacle/UI sprites. All generated via FLUX.2 Klein + Python pipeline; committed in `assets/processed/`.

## UI

- **HOW TO PLAY** button (mode-banner, far left): modal with keyboard controls, touchscreen controls, and objective reference
- **ABOUT** button (mode-banner): Dr. Kris Norman quote, links to HTG v. DISCO site and Wikipedia, Inspired By grid (Frogger, Robot Unicorn Attack — archive.org)
- Modals close on backdrop click, ✕ CLOSE button, or Escape; opening one pauses the run (v1.1)
- Both buttons and modals fully support dark and light mode

## Bug Fixes (Post-Testing)

- **Safari macOS touch-ui:** MacBook users in Safari were incorrectly receiving the mobile swipe experience. Safari was misreporting `pointer: coarse`; fixed by adding `hover: none` as a third detection guard — macOS always reports `hover: hover`.
- **Safari iOS suit sprites:** Suit obstacles rendered in full color on iOS Safari < 18 because `ctx.filter` (Canvas 2D) is silently unsupported on those versions. Fixed by baking grayscale+contrast into the sprite's pixel data at load time via `ImageData`, making it work everywhere.
- **Service worker:** Bumped to `class-ram-v4` to ensure all existing visitors get fresh copies of updated scripts.

## Tech

- Static SPA, no build step — Cloudflare Pages via direct GitHub integration
- PWA: manifest.json, sw.js (cache name `class-ram-v5` as of v1.1), favicon set, OG/Twitter meta tags
- Procedural SFX via Web Audio API; BGM via HTMLAudioElement
- Debug shortcuts (dev only, behind `?debug` as of v1.1): F2 overlay, Alt+0–6
