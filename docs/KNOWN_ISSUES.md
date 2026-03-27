# Known Issues And Deferred Items

Last updated: March 27, 2026

## Confirmed Non-Blocking

- Balance values remain provisional (run pacing, barrier cadence, chain economy). Owner acceptance on rounds 3 and 4 feel is still open.
- Focused automation covers narrative continue reliability, intro framing, control/effect semantics wiring, pride-color visual variation, and gameplay liveness (canvas frame-change assertion), but does not replace full gameplay-path browser smoke.
- Mobile gesture controls are implemented and smoke-tested at mobile viewport, but real-device tuning and validation are still open.
- Mobile info cards use the chosen bottom-sheet pattern on narrow touch layouts; real-device comfort and readability still need owner validation.

## Fixed This Session

- Phantom barrierWarning beeps on quick restart: fixed via generation counter in `audio.js`. Each `playBarrierWarning()` call increments the counter; each scheduled pulse checks its captured generation before firing. `cancelBarrierWarning()` is called in `resetGame()` to ensure no in-flight pulses fire after restart.
- `phaseFlashUntil` and `postBarrierInvulnerabilityUntil` not compensated during pause: fixed — both timestamps are now included in `applyPauseCompensation()` along with all other active timers.
- Legacy mode (game.js): `Date.now()` vs `performance.now()` time-source mismatch causing permanent auditor slow duration and incorrect disabled-tower visual state. Fixed by replacing all `Date.now()` calls in game.js timing comparisons with `performance.now()`.

## Decisions Pending

- Long-term treatment of source asset folder (`class_ram_ifications assets/`): maintained mirror vs. source archive. Deferred to post-release.
- Final acceptance on rounds 3 and 4 feel after the easing pass — owner call.
- Manual live deploy sign-off once the hosted build is verified.

## Notes

This file captures consciously deferred items after smoke and release checks. Items are not blocking unless explicitly noted.
