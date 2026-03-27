# Post-Release Asset Cleanup

Last updated: March 26, 2026

## Status: COMPLETE

The pre-release cleanup pass was executed on March 26, 2026. All retired generic follower/collectible PNGs and superseded obstacle sprites have been removed from both mirrored asset folders.

## Removed

- `FOLLOWER_01_HTGFollowerType01_00001_.png` through `FOLLOWER_05_HTGFollowerType05_00001_.png` — generic ally sprites, replaced by eight named HTG members
- `COLLECTIBLE_01_HTGMemberCollectible_00001_.png` — generic collectible, retired with the follower set
- `ENEMY_03_FilingCabinet_00001_.png` — replaced by `VintageSLOW_CABINET_v4_SlowObstacle-FilingCabinet_00001_.png`
- `ENEMY_04_PolygraphBot_00001_.png` — replaced by `LOCK_BOT_v3_LaneLockObstacle-SurveillanceBot_00001_.png`
- `BARRIER_01_GayInvestigationUnitWall_00001_.png` — replaced by `BARRIER_v5_BarrierWall-SecurityDoor_00001_.png`

## Current state

- Both `assets/processed/` and `class_ram_ifications assets/` contain exactly 38 PNGs, fully synchronized.
- `manifest.json` and `class_ram_ifications_roster.json` updated to reflect current filenames.
- `node scripts/run_all_checks.js` passes: asset sync, runner contract, smoke contract all green.
