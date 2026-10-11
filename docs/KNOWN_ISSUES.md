# Known Issues And Deferred Items

Last updated: September 11, 2026

## Open

No open functional issues. Items worth knowing:

- Real-device testing (phone swipe comfort, balance) was last done March 28, 2026, before the frame-timing change. At 60 Hz the change is a no-op; a 120 Hz device is worth a look during live verification.
- The full-run smoke (scripts/smoke_full_run.js) plays on story difficulty with obstacle immunity. It proves the barrier, narrative, and win path, not the balance of a real run.

## Resolved September 11, 2026 (review pass, second round)

- The automated smokes never played through all four barriers. `scripts/smoke_full_run.js` now does, steering toward pickups and pressing Solidarity when the game reports it ready, through a `?debug`-only `window.runnerDebug` hook (state snapshot plus obstacle immunity; the wall is never exempt). It runs as part of `npm run smoke`.
- The ABOUT modal's archive.org thumbnails were blank offline. The service worker now caches those two opaque image responses after the first online view.
- iPads in landscape are wider than the touch-ui layout cutoff and got "Press R or Enter" hints with no keyboard. Hint text now follows the actual input: touch-ui layout, a coarse pointer with no hover, or any touch gesture seen this session.
- Escape did nothing while an info card was expanded. It now closes the card; restarting also collapses an open card, which previously stayed visually expanded after R.
- The difficulty dropdown could not be changed by keyboard because the game handler swallowed the arrow keys. Keys targeting a select are left alone, and the select blurs after a change so the arrows return to the player.
- The white barrier flash now respects `prefers-reduced-motion`.

## Resolved September 11, 2026 (review pass, first round)

- Movement was tied to the display refresh rate: obstacles, the wall, and pickups moved twice as fast on 120 Hz screens and half as fast at 30 fps, where a Solidarity shield could expire before the wall arrived. Every per-frame step is now scaled by the measured frame interval.
- The game script was loaded with a unique `?v=` query string on every visit, which bypassed the service worker cache, grew the cache by one copy per load, and made offline play fail. The query string is gone and the worker ignores search params when matching.
- Two window keydown handlers (mode-loader.js and runner_mode.js) both handled game keys. One Space press made two Solidarity attempts, the second of which overwrote the "SOLIDARITY ACTIVATED" message, and R restarted the run while a story card was open. The loader handler is removed and the contract check fails if one comes back.
- Story-card SFX scheduled oscillators into a suspended AudioContext before the first gesture; they all played at once on the first click or key. Nothing is scheduled until the page has seen a pointer or key event.
- HOW TO PLAY and ABOUT did not pause the run. They now pause it and resume on close, leaving an Escape pause in place if the player set one first.
- The M key toggled mute without updating the MUTE button label.
- Movement and Solidarity keys were accepted while paused, and a Solidarity activation made during a pause had its shield extended by the pause length. Input is ignored while paused.
- Story cards, info cards, and Escape each kept their own pause clock; overlapping pauses compensated timers twice. One shared clock replaces them, and it also covers obstacle telegraphs, particle lifetimes, hit flash, and feedback text.
- The lose screen always said "Press R to try again", including on touch devices. The hint matches the input mode, and the screen names why the run ended (lives, barrier, or time).
- The 3-minute limit ended runs with no warning. The HUD shows a countdown.
- The narrative continue button was bound to pointerdown, touchstart, click, and onclick, so one click advanced up to three times. A single click binding remains, with a guard in advanceNarrative.
- Debug shortcuts (F2, Alt+0-6) worked for every player; Alt+6 wrote fake allies into the all-time total. They require `?debug` in the URL.
- `tooLateBufferPx` in the round profiles could never apply because a wall that passes the player ends the run first. The field and its branch are removed; the Solidarity HUD line reports "Active" or "Barrier cleared" instead.
- A tap on the win screen background counted as a restart gesture, and the "Play Again?" button restarted twice on touch. Gestures that start on the win screen are ignored.
- A hidden tab froze rendering but not the millisecond timers, so spawns piled up for the return. The run pauses itself when the tab is hidden; a tap resumes on touch devices.
- Open Graph and Twitter image URLs were relative, which link scrapers do not resolve. They are absolute, and og:url plus a meta description were added.
- manifest.json start_url still pointed at a retired `?mode=runner` parameter.
- The runner smoke test's liveness check hashed a small corner of a static background for one second and failed intermittently. It hashes the whole frame over 2.4 seconds.
- HOW TO PLAY said to "collect all 8 HTG members"; the goal is the phase threshold and the chain has no cap. Copy corrected, and M / R / Enter behavior documented.
- `npm test` printed an error; it runs the check bundle, with `npm run serve` and `npm run smoke` alongside.

## Resolved Earlier

- Safari macOS touch-ui: a MacBook in Safari received the mobile experience because Safari misreported `pointer: coarse`. Fixed by adding `hover: none` to `isLikelyTouchDevice()` in mode-loader.js.
- Safari iOS suit grayscale: suit sprites rendered in full color on iOS Safari < 18 because `ctx.filter` is unsupported there. Grayscale and contrast are baked into the sprite pixels at load time in `applyRunnerChromaKey()`.
- Balance accepted by owner after real-device testing (March 28, 2026).
- Legacy tower-defense mode retired and removed.
