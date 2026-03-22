# Development Guide

Last updated: March 22, 2026

## Runtime Ownership

- runner_mode.js: primary game logic, narrative, phase thresholds, collision/update/draw
- mode-loader.js: mode routing and setup
- audio.js: procedural SFX + BGM hooks
- index.html: UI shell and narrative theme styles
- game.js: legacy reference mode

## Implemented Runner Contracts

- 5 narrative keys in NARRATIVE_COPY
- 5-step sequence in NARRATIVE_SEQUENCE
- Phase thresholds in PHASE_CHAIN_THRESHOLDS = [3, 5, 7, 9]
- Precedent target PRECEDENT_TARGET = 4
- Phase-based year mapping and background key mapping

## Barrier-Clear Flow

On successful shielded barrier contact:
- wall.passed = true
- precedentEstablished += 1
- score += 100
- enqueue phase-specific narrative card
- if final phase reached, enqueue victory card and mark pending victory

Victory finalization occurs after final narrative advance.

## Narrative Styling + Sound

- runner-narrative-theme-neutral
- runner-narrative-theme-hopeful
- runner-narrative-theme-happy
- runner-narrative-theme-somber
- runner-narrative-theme-victory

Audio cues:
- narrativeNeutral
- narrativeHopeful
- narrativeHappy
- narrativeSomber
- narrativeVictory

## Backgrounds

Runtime chooses phase background by precedent count.
If phase asset is missing, fallback is ENV_02 default background.

Expected optional assets:
- ENV_03_SiliconValleyOffice_00001_.png
- ENV_04_DistrictCourtroom_00001_.png
- ENV_05_AppealsCourtroom_00001_.png
- ENV_06_WashingtonDCCorridor_00001_.png

## Validation Commands

- node scripts/run_all_checks.js
- node scripts/smoke_runner_focus.js (with server running)

## Maintenance Rules

- Keep docs and smoke assertions synchronized with narrative copy changes.
- Prefer additive fallbacks over hard asset assumptions.
- Keep legacy mode untouched unless requested.
