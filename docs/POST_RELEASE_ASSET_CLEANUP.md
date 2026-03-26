# Post-Release Asset Cleanup Plan

Last updated: March 25, 2026

## Purpose

Prepare the first post-release cleanup pass that removes retired generic runner ally art while preserving asset parity and documentation clarity.

## Assets Targeted For Removal

These files are retained today only for archival continuity and are no longer wired into active runner mode:

- `FOLLOWER_01_HTGFollowerType01_00001_.png`
- `FOLLOWER_02_HTGFollowerType02_00001_.png`
- `FOLLOWER_03_HTGFollowerType03_00001_.png`
- `FOLLOWER_04_HTGFollowerType04_00001_.png`
- `FOLLOWER_05_HTGFollowerType05_00001_.png`
- `COLLECTIBLE_01_HTGMemberCollectible_00001_.png`

They currently exist in both:

- `assets/processed/`
- `class_ram_ifications assets/`

## Preconditions

- First public release is complete.
- No intention remains to reuse the generic follower/collectible art for runner mode.
- Owner has not reversed the current post-release cleanup decision.

## Cleanup Steps

1. Remove the six retired PNGs from `assets/processed/`.
2. Remove the same six retired PNGs from `class_ram_ifications assets/`.
3. Update `class_ram_ifications assets/manifest.json`.
4. Update `class_ram_ifications_roster.json`.
5. Update `docs/ASSET_IMAGE_CATALOG.md`.
6. Update any release/readiness docs that still mention the retired pack as an open decision.
7. Run:
   - `node scripts/check_asset_sync.js`
   - `node scripts/run_all_checks.js`

## Validation Expectations

- Asset parity remains 1:1 between the two mirrored folders.
- No active runtime reference points at any removed generic follower/collectible file.
- Runner mode still uses the eight named `HTG_0x` sprites for allies and chain members.

## Risks

- Removing files from only one mirrored folder will fail asset-sync checks.
- Stale metadata/docs could leave the repo appearing inconsistent even if the runtime is fine.
- If release priorities change and archival continuity becomes more important than cleanup, this task should be deferred rather than rushed.
