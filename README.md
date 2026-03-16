# Class RAM-ifications

A 2D arcade tower defense game inspired by *High Tech Gays v. Defense Industrial Security Clearance Office* (1984–1995). **Federal-Core** (monochrome/IBM green) vs. **Neon-Tech** (rainbow/synthwave). Protect the Clearance Pipeline from DISCO Auditors so case files reach "Cleared" status before the 1995 Executive Order.

## Play

Open `index.html` in a browser, or deploy to [Cloudflare Pages](https://pages.cloudflare.com/).

```bash
npx serve .   # then open http://localhost:3000
```

## Controls

- **1–4** or click tower buttons to select: Coder (50), Attorney (75), Activist (60), Encryption (80)
- **Click** on the canvas to place the selected tower
- **R** to Retry after game over
- **M** to toggle SFX mute
- Case Files move left→right; Auditors move right→left
- If an Auditor touches a Case File, its Burden bar fills with Red Tape
- Burden = 100 → file DENIED, lose 1 Life
- File reaches the right edge → Cleared, gain 20 Precedent
- Survive 60 seconds in each stage (1984→1987→1990→1995) to win

## Documentation

| Document | Description |
|----------|-------------|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Current status and next steps |
| [docs/GDD.md](docs/GDD.md) | Game Design Document – mechanics, visuals |
| [docs/HISTORY.md](docs/HISTORY.md) | Historical case (HTG v. DISCO) |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Technical guide – run, deploy, constants, art, BGM |

## Deploy to Cloudflare Pages

1. Create a [Cloudflare Pages](https://dash.cloudflare.com/) project (e.g. `class-ram-ifications`).
2. In GitHub: **Settings → Secrets and variables → Actions**; add:
   - `CLOUDFLARE_API_TOKEN` – from [API Tokens](https://dash.cloudflare.com/profile/api-tokens) (Cloudflare Pages edit permission).
   - `CLOUDFLARE_ACCOUNT_ID` – from your Cloudflare dashboard URL.
3. Push to `main` (or run the **Deploy to Cloudflare Pages** workflow from the Actions tab).
4. **Verify:** Open the live URL; confirm play, stage advances, tower placement, win/lose, Retry (R), mute (M), and high score on game over.

## Tech

- Vanilla JavaScript + Canvas
- Procedural SFX via Web Audio API (no asset files)
- No build step – static HTML/JS
- CRT-inspired aesthetic with scanline overlay
