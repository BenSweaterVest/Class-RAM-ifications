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
| [docs/ROADMAP.md](docs/ROADMAP.md) | **Status, sprints, and decisions** – start here |
| [docs/QUESTIONS-FOR-PRODUCT.md](docs/QUESTIONS-FOR-PRODUCT.md) | Product questions in groups (4–5 per group) with options and recommendations |
| [docs/GDD.md](docs/GDD.md) | Game Design Document – mechanics, visuals |
| [docs/HISTORY.md](docs/HISTORY.md) | Historical case background (HTG v. DISCO) |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Technical guide for contributors |

## Deploy to Cloudflare Pages

1. Create a [Cloudflare Pages](https://dash.cloudflare.com/) project
2. Add secrets to your GitHub repo:
   - `CLOUDFLARE_API_TOKEN` – from [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - `CLOUDFLARE_ACCOUNT_ID` – from your Cloudflare dashboard URL
3. Push to `main` – the workflow deploys automatically

## Tech

- Vanilla JavaScript + Canvas
- Procedural SFX via Web Audio API (no asset files)
- No build step – static HTML/JS
- CRT-inspired aesthetic with scanline overlay
