# Mobile Gesture Plan

Last updated: March 26, 2026
Status: IMPLEMENTED — this document is a historical spec. All gesture and bottom-sheet work is live in `runner_mode.js` and `index.html`. Real-device tuning remains the only open item.

## Goal

Make runner mode usable on phones and tablets without reintroducing the old on-screen button shell.

Primary interaction model:

- swipe up/down: lane change
- swipe left/right: horizontal shift
- tap: Solidarity
- utility actions stay in visible top chrome (`mute`, `theme`, restart via keyboard-equivalent fallback/UI decision later)

## Why This Direction

- The runner already uses discrete directional moves, so swipe maps naturally.
- Tap for Solidarity keeps the play area cleaner than persistent action buttons.
- Gesture-first mobile play avoids obscuring the canvas with large controls.
- The old hidden touch-control shell has already been removed, so a fresh gesture layer is cleaner than reviving it.

## Scope

### 1. Gesture Capture Layer

Files:

- `runner_mode.js`
- `index.html`

Work:

- Attach pointer/touch gesture tracking to the game container or canvas.
- Ignore gestures while a history checkpoint or expanded info card is open.
- Use a minimum movement threshold before classifying a swipe.
- Resolve swipes to the dominant axis only.
- Prevent page scroll/overscroll inside the play area while active.

Current state:

- Pointer-based touch gesture handling is wired in `runner_mode.js`.
- `touch-action: none` is applied to the game container during play.
- Loader-level duplicate gesture handling was removed so mobile input only resolves once.

### 2. Action Mapping

Files:

- `runner_mode.js`

Work:

- Swipe up -> `tryMoveLane(-1)`
- Swipe down -> `tryMoveLane(1)`
- Swipe left -> `triggerSlow()`
- Swipe right -> `triggerDash()`
- Tap -> `attemptSolidarityActivation(performance.now())`

Current state:

- Swipe/tap mappings are implemented.
- A short post-checkpoint touch cooldown is in place to reduce accidental activations.
- Real-device tuning is still needed for thresholds and feel.

### 3. Mobile Layout Adjustments

Files:

- `index.html`
- `mode-loader.js`

Work:

- Improve mobile breakpoints for:
  - top utility bar
  - HUD stats
  - six-card legend row
  - bottom instructional text
  - checkpoint modal sizing
- Convert mobile info expansion from the interim row treatment to the chosen bottom-sheet presentation.

Current state:

- Utility bar, HUD, legend row, touch hint, and checkpoint modal all have initial mobile behavior.
- Narrow touch layouts now open info cards in a pausing bottom sheet from the existing card row.
- More tuning is still needed for narrow-screen readability and comfort on real devices.

### 4. UX Safeguards

Files:

- `runner_mode.js`
- `index.html`

Work:

- Do not allow accidental Solidarity taps to dismiss checkpoint modals.
- Keep card expansion tap-only while paused.
- Consider a short tap cooldown after modal close if accidental activation appears during testing.
- Add small mobile-specific hint text if needed.

Current state:

- Touch-specific bottom hint text is now active on touch-capable devices.
- A visible restart utility was added to top chrome for mobile sessions.
- A small in-canvas touch hint is shown at the start of touch sessions and dismissed after first gesture.

### 5. Validation

Files:

- `scripts/smoke_runner_focus.js`
- `docs/SMOKE_TEST.md`
- `docs/LOCAL_SMOKE_RESULTS.md`

Work:

- Add at least one mobile-viewport smoke path.
- Add manual checks for Safari iPhone and Chrome Android.
- Validate portrait and landscape behavior.

Current state:

- Focused smoke now includes a mobile viewport sanity check, touch-hint visibility/dismissal assertions, and bottom-sheet pause/readability assertions.
- Real-device manual validation remains open.

## Open Decisions

- Should tap always mean Solidarity, or only when the tap lands inside the lower half of the playfield?
- Do we want a mobile-only tutorial card explaining swipe/tap on first load?

## Recommended Implementation Order

1. Gesture detection plus dominant-axis swipe classification
2. Tap-to-Solidarity
3. Mobile CSS/layout pass
4. Mobile smoke checks
5. Real-device tuning

## Success Criteria

- A first-time mobile player can move, switch lanes, and activate Solidarity without visible gameplay buttons.
- No accidental page scrolling while controlling the runner.
- Checkpoints and info cards remain readable and tappable.
- Focused smoke still passes after mobile gesture support is added.
