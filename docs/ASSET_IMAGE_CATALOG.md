# Image Asset Catalog

Last verified: March 25, 2026
Scope: all committed PNG image assets mirrored between `assets/processed/` and `class_ram_ifications assets/`.

## Current Source Of Truth

- Runtime loader reads PNGs from `assets/processed/`.
- Source mirror stays in `class_ram_ifications assets/`.
- `scripts/check_asset_sync.js` expects both folders to contain the same PNG filenames with matching hashes.
- Lightweight metadata now lives in:
  - `class_ram_ifications assets/manifest.json`
  - `class_ram_ifications_roster.json`

Current state:

- Mirrored PNG count: 44
- Mirror status: expected to stay 1:1 across both folders

## Active Runner Art

### Core runner gameplay

- `PLAYER_01_TimothyDoolingPlayerCharacter_00001_.png`
- `HTG_01_HTGMemberAlex_00001_.png`
- `HTG_02_HTGMemberCarmen_00001_.png`
- `HTG_03_HTGMemberMarcus_00001_.png`
- `HTG_04_HTGMemberSam_00001_.png`
- `HTG_05_HTGMemberJordan_00001_.png`
- `HTG_06_HTGMemberDani_00001_.png`
- `HTG_07_HTGMemberRobin_00001_.png`
- `HTG_08_HTGMemberEvelyn_00001_.png`
- `ENEMY_02_CorporateSuit_00001_.png`
- `ENEMY_03_FilingCabinet_00001_.png`
- `ENEMY_04_PolygraphBot_00001_.png`
- `BARRIER_01_GayInvestigationUnitWall_00001_.png`
- `FX_01_SolidarityHeart_00001_.png`
- `FX_02_PrecedentShield_00001_.png`
- `FX_03_RedTapePit_00001_.png`
- `UI_01_SolidarityButtonInactive_00001_.png`
- `UI_02_SolidarityButtonActive_00001_.png`
- `UI_03_SolidarityButtonUrgent_00001_.png`
- `ENV_01_CorporateLogicGridTile_00001_.png`
- `ENV_02_RunnerModeBackground_00001_.png`

### Phase backgrounds

- `BG_01_v3_BackgroundSiliconValley_00001_.png`
- `BG_02_v1_BackgroundDistrictCourt_00001_.png`
- `BG_03_BackgroundAppealsCourt_00001_.png`
- `BG_04_v3_BackgroundWashingtonDC_00001_.png`

### Narrative popup cards

- `CARD_01_CardIntro1984_00001_.png`
- `CARD_02_CardSuitFiled1984_00001_.png`
- `CARD_03_CardHendersonRules1987_00001_.png`
- `CARD_04_CardReversal1990_00001_.png`
- `CARD_05_CardExecutiveOrder1995_00001_.png`

## Retained But Not Currently Wired In Runner Mode

- `FOLLOWER_01_HTGFollowerType01_00001_.png`
- `FOLLOWER_02_HTGFollowerType02_00001_.png`
- `FOLLOWER_03_HTGFollowerType03_00001_.png`
- `FOLLOWER_04_HTGFollowerType04_00001_.png`
- `FOLLOWER_05_HTGFollowerType05_00001_.png`
- `COLLECTIBLE_01_HTGMemberCollectible_00001_.png`

Current note:

- These files still exist in both mirrored asset folders for archival/repository continuity, but runner mode now derives active ally visuals from the eight named `HTG_0x` sprites instead.

## Legacy / Shared Pack

- `TOWER_01_CoderTower_00001_.png`
- `TOWER_02_AttorneyTower_00001_.png`
- `TOWER_03_ActivistTower_00001_.png`
- `TOWER_04_EncryptionTower_00001_.png`
- `ENEMY_01_DISCOAuditor_00001_.png`
- `FILE_01_CaseFile_00001_.png`
- `PROJ_01_BooleanBitProjectile_00001_.png`
- `PROJ_02_PrecedentProjectile_00001_.png`

## Measured Dimensions

- Background cards and phase backgrounds are `512x512`.
- The eight promoted HTG member sprites use portrait-style source canvases ranging from `116x456` to `332x476`.
- Mirrored files do not share one universal source dimension anymore; runtime draw size is controlled in `runner_mode.js`.

## Runtime Usage Notes

- Runner mode now maps the eight named HTG members directly for both pickups and follower-chain rendering.
- Narrative popup text remains text-driven, but card art is rendered behind the modal content.
- If a promoted phase background fails to load, runner mode falls back to `ENV_02_RunnerModeBackground_00001_.png`.
- Legacy mode remains isolated and continues to use the older tower-defense sprite set.

## Change Procedure

1. Add or replace the PNG in `class_ram_ifications assets/`.
2. Mirror the same PNG into `assets/processed/`.
3. Update `class_ram_ifications assets/manifest.json` if the active/retired collection list changed.
4. Update `class_ram_ifications_roster.json` if the HTG roster, card set, or background set changed.
5. Update this catalog when active usage or archive status changes.
6. Run `node scripts/run_all_checks.js`.
