# Game Design Document

Project: Class RAM-ifications
Last updated: March 22, 2026
Direction: Runner-first historical arcade experience

## Design Intent

Model legal/political struggle as readable arcade systems:
- collect people,
- absorb pressure,
- organize at timing windows,
- force institutional change.

## Current Core Loop

1. Move across 5 lanes and dodge procedural hazards.
2. Collect HTG members to build chain.
3. Meet phase threshold and activate Solidarity at barrier.
4. Clear barrier, advance phase, show narrative card.
5. Repeat until 4 barriers are cleared.
6. Resolve with EO 12968 victory card.

## Phase Model

- Phase 1 threshold: 3
- Phase 2 threshold: 5
- Phase 3 threshold: 7
- Phase 4 threshold: 9

Narrative checkpoints (5 total):
- Intro
- Phase 1 clear
- Phase 2 clear
- Phase 3 clear
- Phase 4 victory

## Win / Lose

Win:
- Clear 4 barriers (4 precedents) and complete final narrative card.

Lose:
- Hit live barrier without active shield.
- Timer expires before required clears.

## Systems Snapshot

- Obstacle classes: suit, cabinet, bot.
- Effects: extra chain loss, slow, lane lock.
- Barrier cadence: 25s baseline, 15s in late pressure segment.
- Solidarity gating: distance + phase threshold.
- Backgrounds: phase-based key selection with fallback.
- Narrative: modal checkpoints with pause-time compensation.

## UX/Tone

Popup tone classes:
- neutral
- hopeful
- happy
- somber
- victory

Each checkpoint also has a dedicated SFX cue.

## Constraints

- Legacy mode remains available for regression continuity.
- Missing phase backgrounds must not break runtime (fallback required).
- Documentation must stay aligned to implemented thresholds and narrative copy.
