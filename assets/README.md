# Assets

`assets/` is the runtime asset folder.

## Subfolders

- `processed/` — gameplay sprites (runtime source of truth, 38 PNGs)
- `favicon/` — browser and PWA icons (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`)

## Audio

`DiscoMusic.ogg` / `DiscoMusic.mp3` live directly under `assets/` and are referenced by `mode-loader.js`.

## Canonical Image Documentation

For the full, up-to-date inventory of all committed PNG image assets, see:

- [docs/ASSET_IMAGE_CATALOG.md](../docs/ASSET_IMAGE_CATALOG.md)

## Source / Mirror

`class_ram_ifications assets/` at repo root is the source mirror used for sync verification.
Every committed PNG in `assets/processed/` must appear there too (checked by `scripts/check_asset_sync.js`).
