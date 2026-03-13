# Product Questions – Answer in Groups

Use this when reviewing with the team or making decisions. Each group has **background**, **question**, **options (A/B/C…) with pros/cons**, and a **recommendation** where it fits.

---

## Group 1 – Placement, UX & Progression (4 questions)

### 1. Tower placement rules

**Background:** In tower defense, placement is either free (click anywhere valid) or constrained (grid, fixed “tower spots”). We currently allow click anywhere with no overlap. The GDD says towers sit on “circuit board traces between the lanes,” which could mean free or a soft grid.

**Question:** How should tower placement work?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Keep current: click anywhere, no overlap with other towers | Familiar from many browser TDs; fast to place; no grid art needed | Can feel loose; “between lanes” is implied, not enforced |
| **B** | Invisible grid (e.g. 32×32 or 40×40): snap to grid, no overlap | Clear, predictable; easy to show “valid” spots | Need to define grid and possibly forbid lanes |
| **C** | Fixed “tower spots” (e.g. N spots between lanes, shown as pads) | Strongest “between the lanes” feel; very clear | More level design; less flexibility |

**Recommendation:** **A** for now (ship faster, match current build). Add **B** or **C** later if you want a more “classic TD” feel.

---

### 2. Attorney Tower visuals

**Background:** We have Logic Tower (cyan block). Attorney is “Litigation” – heavy damage, “Precedents.” Art is still placeholder; we need a simple rule for how towers look until you have 32×32 art.

**Question:** How should the Attorney Tower look in the current placeholder phase?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Same 32×32 block as Logic, different color (e.g. red/gold) | Minimal work; clear “different tower” | Less character per tower |
| **B** | Same size, different shape (e.g. triangle or diamond) and color | More distinct at a glance | Slightly more draw code |
| **C** | Same as Logic until real art: both blocks, label in UI only | Fastest | Harder to tell apart in the heat of play |

**Recommendation:** **A** – different color (e.g. gold/amber for “Precedent”) so players can tell towers apart immediately.

---

### 3. Lives across stages

**Background:** In arcade runs, lives often carry over (one pool for the whole run). In more casual TD, lives sometimes reset per level so each stage feels fair. Our run has four stages (1984 → 1995).

**Question:** Do lives reset each stage or carry over for the whole run?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Carry over: one life pool for the full run | Classic arcade; tension builds; one “campaign” feel | Later stages can feel brutal if you’re low on lives |
| **B** | Reset each stage: 3 lives per stage | Forgiving; each stage is self-contained | Less tension; can feel repetitive |
| **C** | Carry over, but refill to 3 at start of 1987 (District Court “victory”) | Thematic bump after the win; still some carry tension | Slightly more rules to explain |

**Recommendation:** **A** (carry over) for a classic arcade feel; we can tune starting lives (e.g. 4) if it’s too harsh.

---

### 4. Activist Tower: range vs strength

**Background:** The Activist reduces Burden on Case Files in range. In TD, “healer” or support towers are often either large range + weak effect (aura) or small range + strong effect (focused). We need a direction for balance.

**Question:** How should the Activist’s heal feel?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Large range, weak heal (e.g. −2 Burden/tick in a big radius) | Safe “cover the board” support | Can feel underwhelming per file |
| **B** | Small range, strong heal (e.g. −8 Burden/tick in a small radius) | Strong “save this file” moment | Placement matters a lot; can feel finicky |
| **C** | Medium range, medium heal (e.g. −4 Burden/tick, radius between A and B) | Familiar “support tower” feel; flexible | Need to tune the middle |

**Recommendation:** **C** (medium/medium) so the Activist is useful without dominating and fits common TD support tropes.

---

## Group 2 – Scope & Assets (5 questions)

### 5. Stage length (confirm or override)

**Background:** We’ve assumed **fixed time per stage** (e.g. 60s each) from genre norms. You can keep that or change it.

**Question:** How do we decide when a stage ends?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Fixed time per stage (e.g. 60s each; 1985 might be shorter as intro) | Simple; predictable; easy to tune | No “early finish” reward |
| **B** | Survive until N cleared files per stage | Goal-oriented; skilled players advance faster | Need to set N per stage; can drag if underpowered |
| **C** | Mix: 1984/1987 by time; 1990/1995 by “survive 60s” | Early stages tutorial-like; late stages pure survival | Two systems to implement and explain |

**Recommendation:** **A** (fixed time) – matches the locked-in decision and keeps the design simple.

---

### 6. 1995 win condition (confirm or override)

**Background:** We’ve assumed win = **survive 60 seconds in 1995** (no “zero DENIED” requirement).

**Question:** What exactly is the 1995 win?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Survive 60 seconds; files can be DENIED, lives can drop | Clear, achievable; classic survival win | Thematic “perfect run” isn’t required |
| **B** | Survive 60 seconds AND no file DENIED in that 60s | Thematic “clear the pipeline” | Much harder; may need separate “hard mode” |
| **C** | Survive 60 seconds AND still have ≥1 life | Slightly stricter than A | Middle ground |

**Recommendation:** **A** – keep “survive 60s” as the win; add **B** as an optional hard mode later if you want.

---

### 7. Subpoenas: when they appear (confirm or override)

**Background:** We’ve assumed **Subpoenas only in later stages** (9th Circuit + 1995) so new mechanics don’t overwhelm early game.

**Question:** When can Auditors (or a new enemy) use Subpoenas to disable towers?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | 9th Circuit (1990) and 1995 only | Clear difficulty ramp; Encryption Expert matters in late game | None for genre |
| **B** | All stages, but rare in 1984/1987 | Introduces mechanic early | Risk of frustration before players have tools |
| **C** | 1995 only | One “final exam” stage with the mechanic | 1990 stays simpler |

**Recommendation:** **A** – 9th Circuit and 1995 only, as already decided.

---

### 8. Art source (placeholders vs custom)

**Background:** GDD calls for 32×32 pixel art; we currently use colored rectangles. Asset source affects scope and timeline.

**Question:** Who provides art for Case File, Auditors, towers, and any UI sprites?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Keep placeholders (shapes/colors) until you make or commission art | Ship without blocking on assets | Less “finished” look |
| **B** | You (or a collaborator) create art (e.g. OpenSCAD → PNG, Aseprite, etc.) | Full control; fits theme | Takes time; we integrate when ready |
| **C** | Use CC0 / free asset packs for now, replace later | Quick visual upgrade | May not match Federal/Neon theme |

**Recommendation:** **A** or **B** – ship with placeholders (**A**) unless you’re already planning custom art (**B**); avoid **C** unless you find a pack that fits the aesthetic.

---

### 9. Audio license

**Background:** GDD mentions chiptune and SFX. Shipping music/sounds requires clear rights (original, CC, or licensed).

**Question:** How do we handle music and SFX rights?

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A** | Original or CC0 / CC-BY only (you or we create, or use free packs) | Safe to ship; no royalties | May need to commission or search for good fits |
| **B** | Licensed track (e.g. “I Will Survive” chiptune cover) | Thematic punch | Cost and license terms; need to confirm commercial use |
| **C** | No BGM for now; SFX only (original or CC0) | Simpler; no music rights | Less atmosphere until BGM added |

**Recommendation:** **A** or **C** – **C** (SFX only, original/CC0) is the lowest risk; add BGM later with **A** (original or CC) when you’re ready.

---

## After you answer

- Note your choices (e.g. “Group 1: 1A, 2A, 3A, 4C” and “Group 2: 5A, 6A, 7A, 8A, 9C”).
- We’ll update ROADMAP and the GDD with those decisions and implement accordingly.
