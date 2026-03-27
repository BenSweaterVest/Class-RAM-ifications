# Image Asset Catalog

Last verified: March 27, 2026
Scope: all committed PNG image assets mirrored between `assets/processed/` and `class_ram_ifications assets/`.

## Current Source Of Truth

- Runtime loader reads PNGs from `assets/processed/`.
- Source mirror stays in `class_ram_ifications assets/`.
- `scripts/check_asset_sync.js` expects both folders to contain the same PNG filenames with matching hashes.
- Lightweight metadata now lives in:
  - `class_ram_ifications assets/manifest.json`
  - `class_ram_ifications_roster.json`

Current state:

- Mirrored PNG count: 38
- Mirror status: 1:1 across both folders (verified by check_asset_sync.js)

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
- `VintageSLOW_CABINET_v4_SlowObstacle-FilingCabinet_00001_.png`
- `LOCK_BOT_v3_LaneLockObstacle-SurveillanceBot_00001_.png`
- `BARRIER_v5_BarrierWall-SecurityDoor_00001_.png`
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

## Legacy / Shared Pack

- `TOWER_01_CoderTower_00001_.png`
- `TOWER_02_AttorneyTower_00001_.png`
- `TOWER_03_ActivistTower_00001_.png`
- `TOWER_04_EncryptionTower_00001_.png`
- `ENEMY_01_DISCOAuditor_00001_.png`
- `FILE_01_CaseFile_00001_.png`
- `PROJ_01_BooleanBitProjectile_00001_.png`
- `PROJ_02_PrecedentProjectile_00001_.png`

## Retired (Removed)

The following sprites were removed from both mirrored asset folders during the March 26, 2026 cleanup pass:

- `FOLLOWER_01` through `FOLLOWER_05` — generic ally sprites, replaced by the eight named HTG members
- `COLLECTIBLE_01_HTGMemberCollectible_00001_.png` — generic collectible, retired with the follower set
- `ENEMY_03_FilingCabinet_00001_.png` — replaced by `VintageSLOW_CABINET_v4`
- `ENEMY_04_PolygraphBot_00001_.png` — replaced by `LOCK_BOT_v3`
- `BARRIER_01_GayInvestigationUnitWall_00001_.png` — replaced by `BARRIER_v5`

## Measured Dimensions

- Background cards and phase backgrounds are `512x512`.
- The eight promoted HTG member sprites use portrait-style source canvases ranging from `116x456` to `332x476`.
- Mirrored files do not share one universal source dimension; runtime draw size is controlled in `runner_mode.js`.

## Runtime Usage Notes

- Runner mode maps the eight named HTG members directly for both pickups and follower-chain rendering.
- Narrative popup text is text-driven, but card art is rendered behind the modal content.
- If a promoted phase background fails to load, runner mode falls back to `ENV_02_RunnerModeBackground_00001_.png`.
- Legacy mode remains isolated and continues to use the older tower-defense sprite set.

## Change Procedure

1. Add or replace the PNG in `class_ram_ifications assets/`.
2. Mirror the same PNG into `assets/processed/`.
3. Update `class_ram_ifications assets/manifest.json` if the active/retired collection list changed.
4. Update `class_ram_ifications_roster.json` if the HTG roster, card set, or background set changed.
5. Update this catalog when active usage or archive status changes.
6. Run `node scripts/run_all_checks.js`.
