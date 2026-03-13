# Development Guide

Technical documentation for contributors and maintainers of Class RAM-ifications.

---

## Tech Stack

- **Runtime:** Browser (Chrome, Firefox, Safari, Edge)
- **Language:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas 2D
- **Build:** None – static files only
- **Hosting:** Cloudflare Pages (or any static host)

---

## Project Structure

```
Class-RAM-ifications/
├── index.html          # Entry point, CRT overlay, UI
├── game.js             # Game loop, classes, logic
├── audio.js            # Procedural SFX (Web Audio API)
├── README.md           # User-facing overview
├── docs/
│   ├── GDD.md          # Game Design Document
│   ├── HISTORY.md      # Historical case background
│   └── DEVELOPMENT.md  # This file
└── .github/
    └── workflows/
        └── deploy.yml  # Cloudflare Pages deployment
```

---

## Architecture

### Game Loop
- `requestAnimationFrame` drives the main loop
- Each frame: clear → spawn → update → draw → next frame

### Core Classes
| Class | File | Responsibility |
|-------|------|----------------|
| `CaseFile` | game.js | Files moving left→right, burden state |
| `Auditor` | game.js | Enemies moving right→left; can Subpoena in late stages |
| `LogicTower` | game.js | Boolean Bits; slows Auditors on hit |
| `AttorneyTower` | game.js | Precedents; heavy damage |
| `ActivistTower` | game.js | Heals Burden on nearby Case Files |
| `EncryptionTower` | game.js | Firewall; protects towers from Subpoenas |
| `BooleanBit`, `Precedent` | game.js | Projectiles |

### Global State
- `precedent`, `lives`, `gameActive`, `currentYear`, `isMonochrome`
- Arrays: `caseFiles`, `auditors`, `towers`, `projectiles`
- `lanes` – Y-positions of the 4 motherboard lanes

### Collision
- `rectsOverlap(a, b)` – AABB overlap for hitboxes
- `dist(a, b)` – Euclidean distance for range checks

### Audio
- `audio.js` – Procedural SFX via Web Audio API (no asset files). `window.sfx.init()` on first user gesture; then `sfx('placeTower')`, `sfx('fileCleared')`, etc. from game.js. Supports `window.sfx.toggleMute()` and optional BGM via `window.bgm.setTrack(url)`, `window.bgm.play()`, `window.bgm.stop()`.

---

## Running Locally

### Option 1: Direct file
Open `index.html` in a browser. Some features (e.g., fetch) may be limited by CORS when using `file://`.

### Option 2: Local server (recommended)
```bash
npx serve .
# or
python -m http.server 8000
# or
npx live-server
```

Then open `http://localhost:3000` (or the port shown).

---

## Deployment (Cloudflare Pages)

### Prerequisites
1. Cloudflare account
2. GitHub repo with this project

### Setup
1. Create a Cloudflare Pages project named `class-ram-ifications`
2. Add GitHub repository secrets:
   - `CLOUDFLARE_API_TOKEN` – Create at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) with "Cloudflare Pages" permissions
   - `CLOUDFLARE_ACCOUNT_ID` – Found in the Cloudflare dashboard URL

### Trigger
- Push to `main` branch
- Or run the workflow manually from the Actions tab

---

## Adding New Towers

1. Define a class (e.g., `AttorneyTower`) with `update(now)` and `draw()`
2. Add to `towers` array on placement
3. In `gameLoop`, call `t.update(now)` and `t.draw()`
4. Add click handler logic or a tower-select UI

### Tower Template
```javascript
class MyTower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.w = 32;
        this.h = 32;
    }
    get hitbox() {
        return { x: this.x - 16, y: this.y - 16, w: this.w, h: this.h };
    }
    update(now) { /* firing logic */ }
    draw() { /* render */ }
}
```

---

## Constants (Tuning)

| Constant | Location | Default | Description |
|----------|----------|---------|-------------|
| `TOWER_TYPES.*.cost` | game.js | 50 / 75 / 60 / 80 | Precedent cost for Coder / Attorney / Activist / Encryption |
| `TOWER_TYPES.*.range` | game.js | 120 / 100 / 90 / 100 | Attack / heal / firewall radius per tower |
| `TOWER_TYPES.*.fireRate` | game.js | 800 / 1200 / 200 / – | ms between shots / heals (Encryption has no fireRate) |
| `STAGES[*].duration` | game.js | 60000 | ms per stage (1984, 1987, 1990, 1995) |
| `STAGES[*].spawnMult` | game.js | 1 / 0.8 / 1.3 / 1.5 | Multiplier on base spawn intervals |
| `STAGES[*].speedMult` | game.js | 1 / 0.9 / 1.5 / 1.8 | Multiplier on base Auditor speed |
| Base case spawn interval | game.js | 2000 | ms between case file spawns (before `spawnMult`) |
| Base auditor spawn interval | game.js | 3000 | ms between auditor spawns (before `spawnMult`) |
| Burden increment | game.js | 3 | per frame when Auditor overlaps file |
| High score key | game.js | `classRamificationsHighScore` | `localStorage` key for best run |

---

## Art Pipeline (When You Add Sprites)

- Initial approach: **per-entity PNG files**, e.g. `assets/tower_coder.png`, `assets/tower_attorney.png`, `assets/auditor.png`, etc.
- Integration plan:
  - Load images once at startup using `new Image()` and `img.src = 'assets/…'`.
  - In each `draw()` method, replace `fillRect` with `drawImage` calls positioned at the tower/file/auditor coordinates.
  - Keep rectangle drawing code around as a fallback until all sprites are ready.
- If you later want a single sprite sheet:
  - Create an atlas (grid of 32×32 tiles).
  - Replace per-entity draws with `drawImage(atlas, sx, sy, 32, 32, x, y, 32, 32)`.
  - Update this section with the atlas layout and coordinates.

---

## Code Style

- ES6+ (classes, arrow functions, `const`/`let`)
- No external dependencies
- Comments for non-obvious logic
- CamelCase for classes, camelCase for variables/functions
