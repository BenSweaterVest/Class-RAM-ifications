# Known Issues And Deferred Items

Last updated: March 25, 2026

## Confirmed Non-Blocking

- Balance values remain provisional (run pacing, barrier cadence, chain economy).
- Focused automation currently covers narrative continue reliability, intro framing, control/effect semantics wiring, and pride-color visual variation, but does not yet replace full gameplay-path browser smoke.
- Mobile gesture controls now run from `runner_mode.js`, and focused smoke includes a mobile viewport sanity pass, but real-device tuning and validation are still open.
- Mobile info cards now use the chosen bottom-sheet pattern on narrow touch layouts, but real-device comfort/readability still needs validation.

## Fixed This Session

- Legacy mode (game.js): `Date.now()` vs `performance.now()` time-source mismatch. Affected: auditor slow duration (permanent instead of 2s) and disabled-tower visual state. Fixed by replacing all `Date.now()` calls in game.js timing comparisons with `performance.now()`.

## Decisions Pending

- Long-term treatment of source asset folder (`class_ram_ifications assets/`).
- Final post-tuning acceptance on rounds 3 and 4 after the easing pass lands.
- Whether the release-ready docs should consolidate further around a single sprint/handoff surface.

## Notes

This file is intended to capture consciously deferred items after smoke/release checks.

## Next Milestone Candidates

- Expand browser-level automated checks (Playwright) from focused runner assertions into full gameplay-path coverage (controls, obstacle effects, barrier outcomes, and restart loop).
- Add a recorded release-candidate snapshot document that captures script check results + checklist state.
- Add a compact balancing worksheet (barrier cadence, chain threshold outcomes, run length by skill band).
