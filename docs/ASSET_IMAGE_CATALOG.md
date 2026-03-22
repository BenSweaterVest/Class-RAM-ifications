# Image Asset Catalog

Last verified: March 21, 2026 (post-refresh sync)
Scope: all PNG image assets currently committed to this repository.

## Source Of Truth

During the pivot, image assets are split into two folders:

- Runtime images loaded by the game: `assets/processed/`
- Generation/source images and metadata: `class_ram_ifications assets/`

Current state:

- Both folders contain the same 27 PNG files.
- `assets/processed/` should be treated as canonical for runtime loading.
- `class_ram_ifications assets/manifest.json` and `class_ram_ifications_roster.json` remain canonical for generation metadata.

Current measured dimensions:

- All 27 committed PNG files are currently `512x512`.

## Complete PNG Inventory

All entries exist in both folders with the same filename and binary content.

### Legacy-Core Pack (currently wired)

- `TOWER_01_CoderTower_00001_.png`
- `TOWER_02_AttorneyTower_00001_.png`
- `TOWER_03_ActivistTower_00001_.png`
- `TOWER_04_EncryptionTower_00001_.png`
- `ENEMY_01_DISCOAuditor_00001_.png`
- `FILE_01_CaseFile_00001_.png`
- `PROJ_01_BooleanBitProjectile_00001_.png`
- `PROJ_02_PrecedentProjectile_00001_.png`

### Runner-Expanded Pack (present, partially mapped)

- `PLAYER_01_TimothyDoolingPlayerCharacter_00001_.png`
- `FOLLOWER_01_HTGFollowerType01_00001_.png`
- `FOLLOWER_02_HTGFollowerType02_00001_.png`
- `FOLLOWER_03_HTGFollowerType03_00001_.png`
- `FOLLOWER_04_HTGFollowerType04_00001_.png`
- `FOLLOWER_05_HTGFollowerType05_00001_.png`
- `ENEMY_02_CorporateSuit_00001_.png`
- `ENEMY_03_FilingCabinet_00001_.png`
- `ENEMY_04_PolygraphBot_00001_.png`
- `BARRIER_01_GayInvestigationUnitWall_00001_.png`
- `COLLECTIBLE_01_HTGMemberCollectible_00001_.png`
- `FX_01_SolidarityHeart_00001_.png`
- `FX_02_PrecedentShield_00001_.png`
- `FX_03_RedTapePit_00001_.png`
- `UI_01_SolidarityButtonInactive_00001_.png`
- `UI_02_SolidarityButtonActive_00001_.png`
- `UI_03_SolidarityButtonUrgent_00001_.png`
- `ENV_01_CorporateLogicGridTile_00001_.png`
- `ENV_02_RunnerModeBackground_00001_.png`

## Metadata Map

Generation metadata is defined in:

- `class_ram_ifications assets/manifest.json`
- `class_ram_ifications_roster.json`

Each entry captures:

- prompt
- seed
- chroma target RGB
- tolerance/fringe overrides
- category and expected size (roster)

## Runtime Usage Notes

- Legacy mode (`index.html?mode=legacy`) references the legacy-core pack via the sprite map in `game.js`.
- Runner mode (`index.html`, default) now uses sprite-backed rendering via `runner_mode.js` with fallback geometry for resilience.
- Runner mode now maps the expanded pack by semantic role (player, follower variants, enemies, barrier, collectibles, FX, UI states, and environment).
- If a sprite fails to load, legacy mode falls back to built-in shape rendering.

## Quality And Consistency Observations

- Current committed PNG dimensions are larger than roster design targets.
- This is valid for runtime because draw specs in `game.js` control rendered footprint.
- If strict source dimensions are needed for future tooling, regenerate/normalize to target sizes from the roster.

## Change Procedure (When Adding Or Replacing Images)

1. Add or update the PNG in `class_ram_ifications assets/`.
2. Mirror the runtime copy in `assets/processed/`.
3. Update metadata in `class_ram_ifications assets/manifest.json`.
4. Update metadata in `class_ram_ifications_roster.json`.
5. Update this catalog inventory so docs remain complete.
6. Run manual checks in `docs/SMOKE_TEST.md` (startup + sprite rendering).

## Coverage Statement

As of the date above, this document covers every committed `.png` file in the repository.