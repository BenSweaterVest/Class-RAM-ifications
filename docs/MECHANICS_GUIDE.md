# Mechanics Guide

Last updated: September 11, 2026

## Objective

Clear 4 barriers within a 3-minute run by activating Solidarity at the right moment while meeting rising phase thresholds. Clearing the fourth barrier (PRECEDENT_TARGET = 4) wins the game.

## Run Timer

Each run allows 180 seconds of active play (RUN_DURATION_MS). The HUD shows the remaining time as m:ss. The clock holds during every kind of pause (story cards, info cards, Escape, info modals, hidden tab). Running out of time ends the run with a You Lose screen that says so.

## Phase Thresholds

Chain length required to clear each barrier (base values, shifted by difficulty mode):

- Clear 1 requires chain 3
- Clear 2 requires chain 4
- Clear 3 requires chain 5
- Clear 4 requires chain 6

## Difficulty Modes

Selected from the top-bar dropdown; takes effect on the next restart.

- `story`: longer wall intervals (x1.30), threshold -1, slower obstacles (x0.85), fewer spawns (x0.75)
- `organize`: default; all scalars at 1.0
- `resist`: tighter wall intervals (x0.85), threshold +1, faster obstacles (x1.15), denser spawns (x1.25)

If no difficulty has been selected, the game defaults to `organize`.

## Frame Timing

Movement is defined in pixels per frame at 60 Hz and multiplied by the measured frame interval on every tick, so obstacles, the barrier wall, pickups, the player, and particles cover the same distance per second on 30 Hz, 60 Hz, and 120 Hz displays. Spawn cadence, wall intervals, and effect durations are in milliseconds. One frame can advance the world by at most three 60 Hz steps (MAX_FRAME_SCALE), which keeps a stalled tab from teleporting obstacles onto the player.

## Controls

Keyboard:
- Left / A: move left
- Right / D: move right
- Up / Down: change lane
- Space: attempt Solidarity
- Escape: pause / unpause (closes an open info card first)
- M: mute / unmute
- R: restart at any time, including mid-run
- Enter: restart after the run ends (the movement keys also restart)

Touch (small touch devices):
- Swipe left / right: move
- Swipe up / down: change lane
- Tap: attempt Solidarity
- Tap while paused: resume
- Tap after the run ends: restart, after a 1.5-second cooldown

Info overlays:
- HOW TO PLAY and ABOUT buttons (mode banner, far left)
- Opening either pauses the run. Closing it resumes, unless the player had already paused with Escape, in which case the pause stays.
- While a modal is open, game keys are ignored. Escape, the CLOSE button, and a backdrop click close it.

## Pause

One pause clock covers every reason the simulation can stop: story cards, expanded info cards, Escape, the info modals, and a hidden browser tab (the game pauses itself on `visibilitychange`). Timers are shifted once by the total time the simulation stood still, so overlapping pauses are not compensated twice.

While paused:
- The HUD reads PAUSED and the canvas says how to resume.
- Movement, lane changes, and Solidarity are ignored. R still restarts and M still toggles mute.
- The run timer holds.

Compensated on resume: run and round clocks, spawn cadence, wall warning and shield timers, pending spawns, slow / lane-lock / cooldown timers, hit flash, post-barrier flash and invulnerability, feedback text timers, obstacle telegraphs, and particle lifetimes.

## Obstacles

- Suit: removes chain members
- Cabinet: temporary movement slow; a 450 ms red-tape telegraph shows before it becomes solid
- Bot: temporary lane lock, with a short cooldown before a second bot can lock again

## Chain and Lives

- The player leads a chain of collected HTG members. Chain length is not capped.
- An obstacle touching the tail removes the last member (chainLoss SFX).
- An obstacle touching the player while the chain is not empty removes a member instead of a life. A suit takes a second member on top of that ("SUIT SHREDS EXTRA CHAIN"). Cabinets and bots also apply their slow or lock.
- An obstacle touching the player with an empty chain costs one life (lifeLost SFX).
- 3 lives total. Losing all 3 ends the run.

## Solidarity Rules

Solidarity is ready only when:
- The run is active and not paused
- A barrier exists, has not been cleared, and is not already shielded
- The current chain meets or exceeds the phase threshold
- The barrier is within the phase's activation range (140 px in round 1, widening each round)

The window closes on contact. An unshielded barrier that reaches the player ends the run in that same frame, so there is no separate "too late" state. The HUD line shows the current reason whenever Solidarity is not ready.

On success:
- Chain is spent
- The barrier is shielded for the phase's shield duration; passing through it clears it and increments precedentEstablished
- Barrier-clear effects trigger (see below)
- The relevant narrative checkpoint card opens

## Barrier-Clear Effects

When a barrier is successfully cleared:
1. White flash overlay for 600 ms (phaseFlashUntil). Skipped when the OS asks for reduced motion (`prefers-reduced-motion`).
2. Rainbow sparkle particles across the canvas.
3. A 3-second post-barrier invulnerability window (postBarrierInvulnerabilityUntil); a glow arc is drawn under the player during it.

## Barrier Warning Sound

When a new barrier wall spawns, an 8-pulse escalating beep plays (barrierWarning SFX). The beep is cancelable: if the game is restarted before it finishes, a generation counter stops any in-flight pulse from firing.

## Narrative Checkpoints (5)

1. `intro`: 1984 court-case context (opens at game start)
2. `phase1Clear`: Phase 1 cleared (hopeful tone)
3. `phase2Clear`: Phase 2 cleared (happy tone)
4. `phase3Clear`: Phase 3 cleared (somber tone)
5. `phase4Victory`: Phase 4 cleared / EO 12968 victory (victory tone); this is the win moment

Continue with the button (click or tap) or Enter. Space is ignored while a card is open, so a Solidarity press that lands as a card opens cannot skip it.

BGM ducks to 5% volume while a narrative popup is open and restores to 24% when the popup is closed. Each checkpoint has a tone-specific SFX cue that repeats every 2.8 seconds while the card is open.

## Win Condition

Clearing the 4th barrier triggers popup 5 (phase4Victory). After the player advances past that popup, the game resolves to the win state. A win screen overlay appears showing:
- Fireworks launching from multiple directions (some multi-color)
- Bouncing disco balls
- Per-phase ally counts labeled by year and level (for example "1984 (Level 1)")
- All-time allies gathered on this machine (localStorage)
- "Play Again?" button, which restarts at the same difficulty

## Lose Condition

The run ends when any of these happens:
- All 3 lives are lost
- An unshielded, live barrier reaches the player, regardless of chain length
- The 3-minute timer runs out

The You Lose screen names the reason, then shows the allies gathered this run, the attempt number (localStorage `classRamAttempts`), and a restart hint that matches the input mode ("Tap to try again." on touch, "Press R or Enter to try again." on desktop). Touch hints are chosen when the layout is touch-ui, when the device reports a coarse pointer with no hover (an iPad in landscape), or after any touch gesture in the session.

## Visual / Tone Layer

- Popup themes apply per checkpoint tone: neutral / hopeful / happy / somber / victory.
- Late-game status banner indicates the Washington DC finale segment.
- Phase backgrounds are selected by precedent count with ENV_02 as safe fallback.

## Audio Start

No sound is scheduled before the first pointer or key press. The story-card SFX loop starts on its next tick after that gesture, and the same press starts the background music.

## Debug Shortcuts

Available only when the page is opened with `?debug` in the URL (for example `index.html?debug`). Without it the keys do nothing.

- F2: toggle debug overlay (lists all shortcuts)
- Alt+1 through Alt+5: force-open narrative popups 1-5
- Alt+0: force You Lose
- Alt+6: force You Win (fake per-phase ally counts; adds to the all-time total)
- `window.runnerDebug`: `snapshot()` returns read-only run state; `setInvulnerable(true)` lets obstacles pass through (the barrier wall is never exempt). Used by scripts/smoke_full_run.js.

## Notes For Playtesting

- Confirm threshold readability in HUD text and that the timer is legible.
- Confirm narrative pause/continue is reliable via click, touch, and keyboard.
- Confirm HOW TO PLAY pauses the run and closing it resumes.
- Confirm tone distinction between narrativeSomber (sine wave, mournful) and game-over states.
- Confirm chainLoss and lifeLost sounds are distinct and situationally appropriate.
- Confirm barrierWarning beep cancels cleanly on fast restart.
- Confirm post-barrier invulnerability glow arc is visible and the 3-second window feels fair.
- On a high-refresh display, confirm obstacles move at the same pace as on a 60 Hz one.
