# Class RAM-ifications – Roadmap & Status

**Last updated:** March 2025

**Quick ref:** Vision is largely done. Remaining: polish, optional BGM, art when you have it, deploy verification.

---

## Decisions from Genre Conventions (Locked In)

These are set using common tower-defense and arcade conventions so we can implement without blocking; you can override when you answer the question groups.

| Topic | Decision | Why (genre norm) |
|-------|----------|-------------------|
| **Stage length** | Fixed time per stage (e.g. 60s each) | Arcade TD usually uses timed stages or fixed waves; fixed time is simple and predictable. |
| **1995 win condition** | Win = survive 60 seconds in 1995 (no "zero DENIED" requirement) | "Survive X seconds" is the standard survival win; extra "perfect" requirement can be a later hard mode. |
| **Subpoenas** | Only in later stages (9th Circuit + 1995) | New mechanics in later stages only is standard; keeps early game readable. |

---

## Product Decisions (Locked In)

From [QUESTIONS-FOR-PRODUCT.md](QUESTIONS-FOR-PRODUCT.md); all recommendations adopted.

| # | Topic | Decision |
|---|--------|----------|
| 1 | **Tower placement** | Click anywhere, no overlap (no grid/spots for now). |
| 2 | **Attorney Tower visuals** | Same 32×32 block as Logic, different color (e.g. gold/amber for Precedent). |
| 3 | **Lives** | Carry over for the whole run (no reset per stage). |
| 4 | **Activist** | Medium range, medium heal (support-tower feel). |
| 5 | **Stage length** | Fixed time per stage (e.g. 60s each). |
| 6 | **1995 win** | Survive 60 seconds; files may be DENIED. |
| 7 | **Subpoenas** | 9th Circuit + 1995 only. |
| 8 | **Art** | Placeholders until custom art is ready. |
| 9 | **Audio** | Original or CC0/CC-BY only (safe to ship). |

---

## Where We Are (Current State)

### Implemented ✅
- **Core loop:** Case Files move left→right; Auditors move right→left on 4 lanes
- **Burden system:** Auditor overlap fills Burden; 100% = file DENIED, −1 Life
- **Lives:** Start at 3; game over at 0
- **Precedent:** +20 cleared file, +15 kill Auditor; spend 50 to place Logic Tower
- **All four towers:** Coder, Attorney, Activist, Encryption; tower select (1–4)
- **Suspect Class buff:** 2× damage in District Court mode
- **Stage progression:** 1984→1995 (60s each); win = survive 60s in 1995
- **Audio:** Procedural SFX (place tower, cleared, denied, hit, kill, game over, win)
- **Docs:** GDD, HISTORY, DEVELOPMENT, README
- **Deploy:** GitHub Actions → Cloudflare Pages workflow (needs secrets set)

### Not Yet Implemented ❌
- 32×32 pixel art assets (placeholders in use; procedural SFX implemented)

---

## Where We Want to Be (Vision)

1. ~~Full arcade run: 1984→1995 with clear win~~ ✅  
2. ~~All four tower classes with distinct mechanics~~ ✅  
3. ~~Thematic feel: CRT, Federal vs Neon, SFX~~ ✅ (BGM optional)  
4. **Docs and deploy:** GDD/docs current; Cloudflare Pages live (you set secrets).

**Remaining:** Polish/balance, optional BGM, 32×32 art when you have it, deploy verification.

---

## Next Sprints (What's Left)

### Sprint A – Polish & Balance
**Goal:** Feel-good tweaks and one place to tune numbers.

| Item | Type | Notes |
|------|------|--------|
| **Balance table** | Implement | Single constants section or doc table (spawn, costs, damage, stage multipliers) for easy tuning. |
| **Stage transition feedback** | Polish | Brief on-screen "1987" / "1990" or SFX when stage advances. |
| **SFX mute toggle** | Polish | Optional: mute/unmute button or M key. |
| **High score (LocalStorage)** | Optional | Save best year reached or stage; show on game over. |

**Open questions:** None for minimum scope. High score: "year reached" vs "stages completed" if you care.

---

### Sprint B – Optional BGM & Art Readiness
**Goal:** Support BGM if you add it; keep art path clear.

| Item | Type | Notes |
|------|------|--------|
| **BGM hook** | Implement | Optional: load/play one track (e.g. assets/bgm.ogg), loop, volume 0.3; no file until you add one. |
| **Art load path** | Doc | Note in DEVELOPMENT.md: where to drop 32×32 sprites and how game.js would switch to sprite blits. |

**Open questions (need your input):**
- [ ] **BGM:** Procedural loop (Web Audio, no file) now, or leave silent until you have a track?  
- [ ] **Art:** When you have sprites, single sheet vs per-tower files?  

---

### Sprint C – Deploy & Ship
**Goal:** Game live on Cloudflare Pages.

| Item | Type | Notes |
|------|------|--------|
| **Deploy verification** | Doc | README or DEVELOPMENT: confirm workflow; note setting CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in GitHub. |
| **Post-deploy check** | Manual | You run deploy, open live URL, confirm playable. |

**Open questions:** None; you provide secrets and run deploy.

---

## Open Questions (Current)

All current questions are answered. Latest decisions:

| # | Topic | Decision |
|---|-------|----------|
| 1 | BGM | Add a hook for a **file-based track** (no default); you’ll drop in a track later. |
| 2 | Art pipeline | **Per-entity sprite files** first (one PNG per tower/entity); move to an atlas later if needed. |
| 3 | High score | Track both **best year reached** and **stages completed** (optional feature in Sprint A). |

---

## How to Use This Doc

- **Implementable work:** Sprint A/C items are actionable now; Sprint B items are scoped with your decisions.
- **Need input:** Only if you change your mind on BGM, art pipeline, or high-score behavior.
- **Priorities:** Reorder sprints if you prefer (e.g. deploy first, then polish).

When we start a sprint, copy the relevant rows into todos; this doc stays the single place for status and next steps.
