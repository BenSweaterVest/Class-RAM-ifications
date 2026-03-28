# Release Notes — Class RAM-ifications v1

Date: March 28, 2026
Live: https://class-ram-ifications.pages.dev/

---

## What It Is

A historical arcade runner about *High Tech Gays v. Defense Industrial Security Clearance Office* (1984–1995). You play as Timothy Dooling, a nuclear fusion engineer whose clearance was caught in DISCO's discriminatory investigation policy. Collect HTG members, survive hazards, and clear institutional barriers with Solidarity to reach Executive Order 12968.

---

## Core Game

- **Runner loop:** 5 lanes, 3 obstacle classes (suit / cabinet / bot), 4 barriers to clear, PRECEDENT_TARGET = 4
- **Chain system:** collect 8 named HTG members; chain length gates Solidarity activation
- **Phase thresholds:** 3 → 4 → 5 → 6 (base, scaled by difficulty)
- **Solidarity:** activated at barrier when chain ≥ threshold; spends chain, clears barrier, advances phase
- **Difficulty modes:** story / organize (default) / resist — scalars on wall interval, threshold, obstacle speed, spawn density
- **Pause:** Escape key with full timer compensation; touch guard prevents accidental tap-resume

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

**Lose:** run out of 3 lives, or hit barrier without Solidarity. Shows allies gathered this run + attempt count.

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
- Modals close on backdrop click, ✕ CLOSE button, or Escape (without triggering game pause)
- Both buttons and modals fully support dark and light mode

## Tech

- Static SPA, no build step — Cloudflare Pages via direct GitHub integration
- PWA: manifest.json, sw.js (cache name `class-ram-v3`), favicon set, OG/Twitter meta tags
- Procedural SFX via Web Audio API; BGM via HTMLAudioElement
- Debug shortcuts (dev only, not player-facing): F2 overlay, Alt+0–6
