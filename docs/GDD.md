# Game Design Document: Class RAM-ifications

**Version:** 1.0  
**Last Updated:** March 2025  
**Genre:** 2D Arcade Tower Defense  
**Platform:** Web (HTML5/Canvas)

---

## 1. Executive Summary

**Class RAM-ifications** is a browser-based tower defense game inspired by *High Tech Gays v. Defense Industrial Security Clearance Office* (1984–1995). Players protect a "Clearance Pipeline" from DISCO Auditors so case files reach "Cleared" status before President Clinton's 1995 Executive Order ends the discriminatory policy.

The game contrasts **Federal-Core** (monochrome, IBM green, bureaucratic) with **Neon-Tech** (rainbow, synthwave, Silicon Valley activism) to create a distinctive visual identity.

---

## 2. Historical Context

The game is based on the real case:

- **High Tech Gays (HTG)** – A social organization of gay tech workers in San Jose, founded 1983
- **DISCO** – Defense Industrial Security Clearance Office, which denied/restricted clearances for LGBTQ+ applicants
- **1987** – District Court ruled in HTG's favor (quasi-suspect class, heightened scrutiny)
- **1990** – 9th Circuit reversed, upholding DISCO's policy
- **1995** – Executive Order 12968 prohibited denial of clearances based on sexual orientation

See [HISTORY.md](./HISTORY.md) for a fuller account.

---

## 3. Core Concept

| Real-World Concept | Game Mechanic |
|--------------------|---------------|
| Security clearance applications | Case Files moving through lanes |
| DISCO investigators/auditors | Auditors moving against the flow |
| Red tape, extra scrutiny | Burden bar filling on contact |
| Legal precedent | Currency for placing towers |
| District Court victory | Suspect Class buff (2× damage) |
| 9th Circuit reversal | Monochrome shift, harder difficulty |
| Executive Order 12968 | Win condition |

---

## 4. Visual Aesthetic

### 4.1 DISCO Side (Enemies / Bureaucracy)
- **Palette:** CGA-style – black backgrounds, grays, flickering green text
- **Enemies:** Drab, blocky, monochrome
- **UI elements:** Green on black, terminal-like

### 4.2 HTG Side (Player / Resistance)
- **Palette:** 16-bit rainbow, neon accents
- **Towers:** Bright cyan, magenta, rainbow effects
- **Cleared files:** Rainbow burst on success

### 4.3 Display
- **Resolution:** 800×480 (CRT-inspired)
- **Overlay:** Subtle scanlines, chromatic aberration
- **Shift:** 9th Circuit stage dims to monochrome

---

## 5. Core Gameplay Mechanics

### 5.1 The Status Pipeline
- **Layout:** 4 horizontal lanes (motherboard traces)
- **Direction:** Case Files move **left → right** (Pending → Cleared)
- **Enemies:** Auditors move **right → left**

### 5.2 Case Files
- Spawn on the left in a random lane
- Move toward the right edge
- **Burden bar:** Fills when an Auditor overlaps the file
- **Burden = 100:** File DENIED → lose 1 Life
- **Reach right edge:** File Cleared → gain 20 Precedent

### 5.3 Auditors
- Spawn on the right
- Move left along lanes
- On overlap with a Case File: increase that file's Burden
- Can be destroyed by towers for +15 Precedent

### 5.4 Towers (The "Classes")
Placed on the board by clicking. Each has a cost and role:

| Tower | Class | Cost | Effect |
|-------|-------|------|--------|
| **Coder** | Logic | 50 | Fires Boolean Bits; slows enemies |
| **Attorney** | Litigation | 75 | Fires Precedents; heavy damage |
| **Activist** | Community | 60 | Heals Burden on nearby files |
| **Encryption Expert** | Security | 80 | Firewall; protects towers from Subpoenas |

**Current implementation:** All four towers (Coder, Attorney, Activist, Encryption Expert).

### 5.5 Resources
- **Precedent:** Earned by clearing files (+20) and killing Auditors (+15). Spent on towers.
- **Lives:** Start at 3. Lose 1 when a file is DENIED (Burden = 100). **Lives carry over** for the whole run (no reset per stage).

### 5.6 Design Decisions (Locked In)
- **Placement:** Click anywhere, no overlap with other towers (no grid or fixed spots).
- **Attorney visuals:** Same 32×32 block as Coder, different color (e.g. gold/amber).
- **Activist:** Medium range, medium Burden heal.
- **Art:** Placeholders until custom art; **Audio:** original or CC0/CC-BY only.

---

## 6. Difficulty & Progression

### 6.1 The "Appeal" Difficulty Spike
- **Level 1 (District Court):** Bright colors, Suspect Class buff (2× damage), cheaper towers
- **Level 2 (9th Circuit):** Monochrome shift, Rational Basis ruling, higher costs, 1.5× enemy speed

### 6.2 Arcade Stages (Planned)

| Stage | Year | Event | Difficulty |
|-------|------|-------|------------|
| 01 | 1984 | The Investigation Begins | Easy – tutorial |
| 02 | 1987 | District Court Victory | Bonus – high rainbow energy |
| 03 | 1990 | 9th Circuit Reversal | Hard – monochrome shift |
| 04 | 1995 | The Executive Order | Survival – hold 60 seconds to win |

**Current implementation:** Four stages (1984→1987→1990→1995), 60s each; win = survive 60s in 1995.

---

## 7. Technical Specifications

### 7.1 Engine
- Vanilla JavaScript + Canvas API
- No external game engine (Phaser optional for future)

### 7.2 Assets
- **Sprites:** 32×32 pixel art (placeholders until custom art).
- **Audio:** Original or CC0/CC-BY only (8-bit chiptune, SFX).
- **Fonts:** Courier New, monospace

### 7.3 Hosting
- Static HTML/JS
- Deploy via GitHub Actions → Cloudflare Pages

---

## 8. Implementation Status

See **[docs/ROADMAP.md](ROADMAP.md)** for current status, sprint breakdown, and open questions.

| Feature | Status |
|---------|--------|
| Case Files + movement | ✅ |
| Auditors + spawning | ✅ |
| Burden collision | ✅ |
| Lives system (carry over) | ✅ |
| Logic Tower (Coder) + slow | ✅ |
| Attorney Tower | ✅ |
| Activist Tower | ✅ |
| Encryption Expert Tower | ✅ |
| Tower placement + select (1–4) | ✅ |
| Boolean Bits, Precedents | ✅ |
| Suspect Class buff | ✅ |
| Stage progression (1984→1995) | ✅ |
| Win condition (60s in 1995) | ✅ |
| Subpoenas (9th Circuit + 1995) | ✅ |
| Win/lose screens + Retry | ✅ |
| Audio (procedural SFX) | ✅ |
| 32×32 pixel art assets | ❌ (placeholders) |

---

## 9. Future Considerations

- **Subpoenas:** Enemy ability to disable towers (countered by Encryption Expert)
- **Slowing:** Logic Tower slow effect on hit
- **Save/load:** LocalStorage for high scores
- **Mobile:** Touch controls for tower placement
