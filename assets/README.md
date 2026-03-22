# Assets

`assets/` is the runtime asset folder.

## Runtime Expectations

Current expected contents:

- `processed/` for gameplay sprites and projectiles
- optional BGM file such as `bgm.ogg` or `bgm.mp3`

## Canonical Image Documentation

For the full, up-to-date inventory of all committed PNG image assets, see:

- [docs/ASSET_IMAGE_CATALOG.md](../docs/ASSET_IMAGE_CATALOG.md)

That catalog includes:

- complete runtime and source file map
- current measured PNG dimensions
- design target dimensions from roster metadata
- asset role and chroma-key strategy

## Source-Generation Files

Non-runtime source-generation files live at repo root and under:

- `class_ram_ifications assets/`
- `class_ram_ifications assets/manifest.json`
- `class_ram_ifications_roster.json`

During migration, `assets/processed/` remains the runtime source of truth.
