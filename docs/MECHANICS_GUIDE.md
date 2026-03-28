# Mechanics Guide

Last updated: March 27, 2026

## Objective

Clear 4 barriers by activating Solidarity at the right moment while meeting rising phase thresholds. Clearing all 4 barriers (PRECEDENT_TARGET = 4) wins the game.

## Phase Thresholds

Chain length required to clear each barrier (base values, scaled by difficulty mode):

- Clear 1 requires chain 3
- Clear 2 requires chain 4
- Clear 3 requires chain 5
- Clear 4 requires chain 6

## Difficulty Modes

Selected from the top-bar dropdown; takes effect on the next restart.

- `story` — longer wall intervals (×1.30), threshold −1, slower obstacles (×0.85), fewer spawns (×0.75)
- `organize` — default; all scalars at 1.0
- `resist` — tighter wall intervals (×0.85), threshold +1, faster obstacles (×1.15), denser spawns (×1.25)

If no difficulty has been selected, the game defaults to `organize`.

## Controls

**Keyboard:**
- Left / A: move left
- Right / D: move right
- Up / Down: lane change
- Space: attempt Solidarity
- R / Enter: restart (on lose or win screen)
- Escape: pause / unpause

**Touch (genuine small touch devices):**
- Swipe left/right: move between lanes
- Tap: attempt Solidarity

## Pause

Pressing Escape while the game is active (not during a narrative popup or legend overlay) toggles pause. The HUD displays "PAUSED" while paused. All active timers — including the post-barrier flash, post-barrier invulnerability window, and obstacle spawn cadence — are compensated when the game resumes so no time is lost or gained.

Tapping on the paused canvas on a touch device does nothing (a guard prevents accidental tap-resume).

## Obstacles

- Suit: higher chain attrition pressure (hits tail members)
- Cabinet: temporary movement slow
- Bot: temporary lane lock

## Chain and Lives

- The player leads a chain of collected HTG members.
- Obstacles hitting the tail remove the last chain member (chainLoss SFX plays — a short square beep).
- An obstacle hitting the player directly costs one life (lifeLost SFX plays — a sawtooth 2-tone).
- 3 lives total. Losing all 3 ends the run (You Lose screen).

## Solidarity Rules

Solidarity is ready only when:
- The run is active (not paused, not in narrative)
- A barrier exists and is in range
- The current chain meets or exceeds the phase threshold

On success:
- Chain is spent
- Barrier is cleared; precedentEstablished increments
- Barrier-clear effects trigger (see below)
- The relevant narrative checkpoint card opens

## Barrier-Clear Effects

When a barrier is successfully cleared:
1. White flash overlay appears for ~300ms (phaseFlashUntil).
2. Rainbow sparkle particles spread across the canvas.
3. A 3-second post-barrier invulnerability window begins (postBarrierInvulnerabilityUntil); an invulnerability glow arc is drawn under the player sprite during this window.

## Barrier Warning Sound

When a new barrier wall spawns, an 8-pulse escalating beep plays (barrierWarning SFX). The beep is cancelable — if the game is restarted before it finishes, a generation counter stops any in-flight pulse from firing.

## Narrative Checkpoints (5)

1. `intro` — 1984 court-case context (opens at game start)
2. `phase1Clear` — Phase 1 cleared (hopeful tone)
3. `phase2Clear` — Phase 2 cleared (happy tone)
4. `phase3Clear` — Phase 3 cleared (somber tone)
5. `phase4Victory` — Phase 4 cleared / EO 12968 victory (victory tone) — this is the win moment

BGM ducks to 5% volume while a narrative popup is open and restores to 24% when the popup is closed. Each checkpoint has a tone-specific SFX cue.

## Win Condition

Clearing the 4th barrier triggers popup 5 (phase4Victory). After the player advances past that popup, the game resolves to the win state. A win screen overlay appears showing:
- Fireworks launching from multiple directions (some multi-color)
- Bouncing disco balls
- Per-phase ally counts labeled by year and level (e.g., "1984 (Level 1)")
- All-time allies gathered across all machines (localStorage)
- "Play Again?" button — restarts at the same difficulty

## Lose Condition

- Running out of lives (3 total)
- An unshielded barrier collision while at 0 chain

The You Lose screen shows:
- Allies gathered this run (totalAlliesGathered)
- Attempt number (from localStorage 'classRamAttempts')
- "Tap to restart" (touch) or "Press R or Enter to restart" (desktop)

## Visual / Tone Layer

- Popup themes apply per checkpoint tone: neutral / hopeful / happy / somber / victory.
- Late-game status banner indicates the Washington DC finale segment.
- Phase backgrounds are selected by precedent count with ENV_02 as safe fallback.

## Debug Shortcuts

These are for development use only and are not shown to players:
- F2: toggle debug overlay (lists all shortcuts)
- Alt+1 through Alt+5: force-open narrative popups 1–5
- Alt+0: force You Lose state
- Alt+6: force You Win state (fake per-phase ally counts)

## Notes For Playtesting

- Confirm threshold readability in HUD text.
- Confirm narrative pause/continue is reliable via click, touch, and keyboard.
- Confirm tone distinction between narrativeSomber (sine wave, mournful) and game-over states.
- Confirm chainLoss and lifeLost sounds are distinct and situationally appropriate.
- Confirm barrierWarning beep cancels cleanly on fast restart.
- Confirm post-barrier invulnerability glow arc is visible and the 3-second window feels fair.
