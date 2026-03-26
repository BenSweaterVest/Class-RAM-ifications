# Development Guide

Last updated: March 25, 2026

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
If a phase asset fails to load, fallback is ENV_02 default background.

Promoted phase backgrounds:
- BG_01_v3_BackgroundSiliconValley_00001_.png
- BG_02_v1_BackgroundDistrictCourt_00001_.png
- BG_03_BackgroundAppealsCourt_00001_.png
- BG_04_v3_BackgroundWashingtonDC_00001_.png

Promoted narrative popup cards:
- CARD_01_CardIntro1984_00001_.png
- CARD_02_CardSuitFiled1984_00001_.png
- CARD_03_CardHendersonRules1987_00001_.png
- CARD_04_CardReversal1990_00001_.png
- CARD_05_CardExecutiveOrder1995_00001_.png

Runner HTG member roster:
- HTG_01_HTGMemberAlex_00001_.png
- HTG_02_HTGMemberCarmen_00001_.png
- HTG_03_HTGMemberMarcus_00001_.png
- HTG_04_HTGMemberSam_00001_.png
- HTG_05_HTGMemberJordan_00001_.png
- HTG_06_HTGMemberDani_00001_.png
- HTG_07_HTGMemberRobin_00001_.png
- HTG_08_HTGMemberEvelyn_00001_.png

## Validation Commands

- node scripts/run_all_checks.js
- node scripts/smoke_runner_focus.js (with server running)

## Maintenance Rules

- Keep docs and smoke assertions synchronized with narrative copy changes.
- Prefer additive fallbacks over hard asset assumptions.
- Keep `assets/processed/` and `class_ram_ifications assets/` PNGs mirrored so `check_asset_sync` stays green.
- Keep legacy mode untouched unless requested.
