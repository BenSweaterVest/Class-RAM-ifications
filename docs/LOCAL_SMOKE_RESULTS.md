# Local Smoke Results

Date: March 25, 2026

## Scripted Verification

- node scripts/check_asset_sync.js: PASS
- node scripts/check_runner_contract.js: PASS
- node scripts/check_smoke_contract.js: PASS
- node scripts/run_all_checks.js: PASS
- node scripts/smoke_runner_focus.js: PASS
- node scripts/smoke_mode_shell.js: PASS

## Focused Smoke Coverage

- Narrative continue via click: PASS
- Narrative continue via Enter fallback: PASS
- Space does not dismiss history checkpoints: PASS
- Intro narrative copy assertion (Timothy Dooling lead): PASS
- Control semantics wiring: PASS
- Obstacle legend/help coherence: PASS
- Pride-color visual variation sampling: PASS (latest reruns observed 6-8 active color buckets)
- Mobile viewport hint/restart/touch-action sanity: PASS
- Mobile touch-hint visibility and first-gesture dismissal: PASS
- Mobile bottom-sheet info card behavior and pause state: PASS
- Runner/legacy mode shell routing sanity: PASS

## Notes

- Asset sync now validates 44 mirrored PNGs across `assets/processed/` and `class_ram_ifications assets/`.
- Focused smoke was rerun repeatedly during March 25 UI/art/mobile polish and remained green, including the bottom-sheet mobile info flow.

## Manual Smoke

Manual browser/device smoke remains pending owner execution, especially real phone/tablet tuning for swipe thresholds and landscape comfort.
