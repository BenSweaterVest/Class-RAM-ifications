# Assets

`assets/` is the runtime asset folder.

## Runtime Expectations

Current expected contents:

- `processed/` for gameplay sprites and projectiles
- optional BGM file such as `bgm.ogg` or `bgm.mp3`
- `New/` may be used as a temporary staging folder before PNGs are promoted into the mirrored canonical folders

## Canonical Image Documentation

For the full, up-to-date inventory of all committed PNG image assets, see:

- [docs/ASSET_IMAGE_CATALOG.md](../docs/ASSET_IMAGE_CATALOG.md)

That catalog includes:

- complete runtime and source file map
- current measured PNG dimensions
- active vs retained asset status
- asset role and mirror expectations

## Source-Generation Files

Source/reference metadata lives at repo root and under:

- `class_ram_ifications assets/`
- `class_ram_ifications assets/manifest.json`
- `class_ram_ifications_roster.json`

`assets/processed/` remains the runtime source of truth, but every committed PNG is expected to be mirrored into `class_ram_ifications assets/` for sync verification.
