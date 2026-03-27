# Local Smoke Results

Last full scripted run: March 26, 2026
Last updated: March 27, 2026
Status: Rerun pending — March 27 changes (Escape pause, barrier-clear effects, SFX additions, PWA, debug shortcuts, stats, BGM ducking) are not covered by the March 25 evidence below.

Pre-deploy requirement: run `node scripts/run_all_checks.js` and confirm all checks pass before deploying.

## Scripted Verification (March 25–26 run)

- node scripts/check_asset_sync.js: PASS
- node scripts/check_runner_contract.js: PASS
- node scripts/check_smoke_contract.js: PASS
- node scripts/run_all_checks.js: PASS (last passed March 26)
- node scripts/smoke_runner_focus.js: PASS (includes gameplay liveness check, mobile viewport sanity, touch-hint dismissal)
- node scripts/smoke_mode_shell.js: PASS

## Focused Smoke Coverage (March 25)

- Narrative continue via click: PASS
- Narrative continue via Enter fallback: PASS
- Space does not dismiss history checkpoints: PASS
- Intro narrative copy assertion (Timothy Dooling lead): PASS
- Control semantics wiring: PASS
- Obstacle legend/help coherence: PASS
- Pride-color visual variation sampling: PASS (6–8 active color buckets observed)
- Mobile viewport hint/restart/touch-action sanity: PASS
- Mobile touch-hint visibility and first-gesture dismissal: PASS
- Mobile bottom-sheet info card behavior and pause state: PASS
- Runner/legacy mode shell routing sanity: PASS

## Notes

- Asset sync validates 38 mirrored PNGs across `assets/processed/` and `class_ram_ifications assets/` (post March 26 cleanup).
- Focused smoke was rerun repeatedly during March 25 UI/art/mobile polish and remained green.

## Manual Smoke

Manual browser/device smoke remains pending owner execution, especially real phone/tablet tuning for swipe thresholds and landscape comfort.
