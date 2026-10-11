# TODOs

Last updated: September 11, 2026

---

## Status: Ready To Deploy

The September 11 review pass is complete and verified locally: `npm test` green, both Playwright smokes green (runner smoke 3 of 3 runs), offline reload verified with the static server stopped. The remaining tasks are owner actions.

---

## Remaining (Owner Actions)

- [ ] Commit the review pass and push to main; Cloudflare Pages deploys to https://class-ram-ifications.pages.dev/
- [ ] Follow `docs/LIVE_VERIFICATION_RUNBOOK.md` on the live URL, including the offline reload check and, if available, a 120 Hz display
- [ ] Fill in `docs/GO_NO_GO_TEMPLATE.md` and sign off

---

## Completed: September 11, 2026 Review Pass

- [x] Frame-rate-independent movement (frameScale in loop/update; trail sampled at a fixed cadence)
- [x] Service worker: no cache-busting query on the game script; ignoreSearch on match; cache bumped to class-ram-v5; offline reload verified
- [x] Single keyboard handler (loader fallback removed; contract check fails if a second one appears)
- [x] Audio unlock gate; no oscillators scheduled before the first gesture
- [x] HOW TO PLAY / ABOUT pause the run and swallow game keys while open
- [x] M key keeps the MUTE button label in sync
- [x] One shared pause clock; input ignored while paused; telegraphs, particles, hit flash, and feedback timers compensated
- [x] Hidden tab pauses the run; tap resumes on touch
- [x] Run countdown in the HUD; You Lose screen names the reason; restart hint matches the input mode
- [x] Narrative continue bound once, with a re-entry guard
- [x] Debug shortcuts behind `?debug`
- [x] Dead tooLateBufferPx config removed; Solidarity HUD reports "Active" / "Barrier cleared"
- [x] Win-screen taps no longer restart; Play Again fires once on touch
- [x] Absolute og:image / twitter:image, og:url, meta description; manifest start_url
- [x] Smoke liveness check made deterministic; mobile smoke taps the continue button
- [x] scripts/check_sw_assets.js added to the bundle; npm test / serve / smoke scripts
- [x] Full four-barrier run smoke (scripts/smoke_full_run.js, part of `npm run smoke`) through a `?debug`-only `window.runnerDebug` hook
- [x] Reduced-motion users skip the barrier flash; touch hints follow the actual input device (iPad landscape); ABOUT thumbnails cached for offline
- [x] Escape closes an open info card; restart collapses one; difficulty dropdown usable by keyboard
- [x] `.gitattributes` (LF) and `.editorconfig` added; `mobile-web-app-capable` meta added beside the Apple tag
- [x] Docs synchronized with the changes above

## Completed Earlier

- [x] Runner-first architecture established.
- [x] Core movement / obstacles / collection / barrier / solidarity loop.
- [x] 5-card narrative system: illustrated card art, pause, BGM ducking, tone SFX, looping while open.
- [x] Dynamic phase thresholds (3/4/5/6) + difficulty modes (story / organize / resist).
- [x] Named HTG member roster (8 pride-flag characters) for pickups and follower chain.
- [x] Phase backgrounds, narrative card art, obstacle and UI sprites.
- [x] Mobile swipe/tap controls, touch hint, pausing bottom-sheet info cards.
- [x] Escape pause with timer compensation.
- [x] Barrier-clear effects: flash, sparkles, 3-second invulnerability glow arc.
- [x] Win screen: fireworks, disco balls, per-phase stats by year/level, all-time machine total, "Play Again?".
- [x] You Lose screen: allies gathered this run + attempt counter.
- [x] PWA: manifest.json, sw.js, favicon set, OG/Twitter meta.
- [x] Legacy tower-defense mode retired and fully removed.
- [x] Repo pruned: duplicate source asset folder, generation metadata, GitHub Actions workflow, stale scripts and docs removed.
- [x] Real-device testing complete (March 28, 2026). Balance accepted. Narrative copy locked.
- [x] HOW TO PLAY and ABOUT modal buttons in the mode banner.
- [x] Safari macOS touch-ui fix (`hover: none` guard in `isLikelyTouchDevice()`).
- [x] Safari iOS suit grayscale fix (grayscale baked into ImageData at load; `ctx.filter` removed).
