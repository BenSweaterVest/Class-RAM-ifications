# Universal Pixel Art Asset Generation Guide

## For Claude Code Agents Writing Asset Rosters

This document defines the rules for writing prompts that feed into the headless FLUX.2 Klein + Python generation pipeline. Every prompt you write will be:

1. Sent to ComfyUI via API (FLUX.2 Klein 9B, Qwen3 text encoder, no LoRA)
2. Downscaled via nearest-exact interpolation (produces hard pixel grid)
3. Upscaled back via nearest-exact (preserves pixel blocks)
4. Post-processed by a Python script (chroma key removal, edge erosion, auto-trim)

Understanding this pipeline is critical. The model has excellent prompt adherence via the Qwen3 encoder, but the post-processing is mathematical — it doesn't understand context, only color values. Your prompts must produce images that survive the math.

---

## JSON Roster Format

```json
{
  "game": "loaves_and_fishes",
  "default_chroma": "magenta",
  "assets": [
    {
      "id": "APOSTLE_01",
      "category": "Apostle Portrait",
      "expected_size": "256x256",
      "prompt": "...",
      "tolerance_override": 45,
      "fringe_tolerance_override": 80
    }
  ]
}
```

### Required fields per asset:
- `id` — Unique identifier (e.g., APOSTLE_01, FISH_12, BOSS_03). Used for `--only` flag and manifest.
- `category` — Short label used in filename. Use only letters, spaces, and parentheses. No slashes.
- `expected_size` — One of: `"64x64"` (icons), `"128x128"` (sprites/fish), `"256x256"` (portraits/bosses), or `"original"` (backgrounds).
- `prompt` — The complete generation prompt. Must follow all rules below.

### Optional fields:
- `tolerance_override` — Primary chroma key tolerance (default 45). Increase for assets with unusual background bleed.
- `fringe_tolerance_override` — Edge erosion tolerance (default 80). Increase to 90-100 for assets with glow effects or complex edges.

---

## Prompt Structure

Every sprite/creature/character prompt must follow this order:

```
[Subject description with visual anchors]
[Style line]
[Single sprite line]
[Shadow direction line]
[Drop shadow prohibition]
[Background line]
[Chroma avoidance line OR purple subject exception]
```

### 1. Subject Description — Visual Anchors

Every character needs at least 5 concrete differentiators to prevent same-face syndrome:

- Facing direction ("facing 3/4 right", "facing left")
- Hair (color + style)
- Facial hair (or lack thereof)
- Skin tone
- Body type
- Clothing color and type
- Held item
- Unique feature (scar, headband, glowing eyes)
- Age indicator
- Pose cue
- Expression

Be specific. "An old man in a robe" produces generic output. "A stocky, barrel-chested older man (50s) with a bald head, grey fringe of hair, thick bushy white beard, tanned deeply weathered skin, wearing a plain brown fisherman's tunic, holding a large iron key" produces a recognizable character.

### 2. Style Line

Always include explicitly. The pipeline has no style LoRA — the prompt is the only style control.

**Default (most assets):**
```
Style: 16-bit retro RPG pixel art, flat colors, sharp pixel grid, strictly 2D sprite.
```

**For characters and creatures that benefit from outlines:**
```
Style: 16-bit retro character art with clean dark outlines.
```

**For ethereal/ghostly/smoke subjects where hard outlines would look wrong:**
```
Style: 16-bit retro RPG sprite with soft-edged pixel rendering, no hard outlines.
```

Outlines are a default, not a mandate. Override per-asset when appropriate.

### 3. Single Sprite Rule

Include on EVERY prompt except backgrounds:

```
Generate a single sprite only. Do not show multiple views, angles, or duplicates.
```

For multi-figure scenes (like boss battles with multiple characters), clarify:
```
Generate a single sprite only — all [N] figures must be in one image, not duplicated or shown separately.
```

### 4. Shadow Direction

Never let the AI choose shadow colors. Without explicit direction, it defaults to purple/magenta for dark tones, which collides with chroma key removal.

**Standard assets (Loaves and Fishes, HexDesk):**
```
Use dark grey and charcoal for body shading.
```

**Dark/possessed/demonic/undead assets:**
```
Use dark grey, charcoal black, and muted teal for all body shading. Do not use purple, violet, or magenta for shading.
```

**Necromon assets (undead/gothic theme):**
```
Use sickly grey-green, bone white, and charcoal for all body shading. Do not use green, lime, or yellow-green for shading.
```

Note: Necromon uses green as default chroma, so its shadow avoidance language prohibits green tones instead of purple.

### 5. Drop Shadow Prohibition

Include on ALL sprite and creature prompts (not backgrounds):

```
No drop shadow, no ground shadow, no cast shadow beneath the character.
```

This removes the dark puddle/glow under a character's feet. The game engine handles cast shadows dynamically. Ground shadows in the generated image waste pixels, fight chroma removal, and look wrong when composited in-engine.

Exception: Boss sprites with intentional ground effects (like Legion's shadow vortex) can omit this line, but note the decision in the roster as a comment.

### 6. Background Line

**For magenta chroma (default for Loaves and Fishes, HexDesk):**
```
Background: solid flat magenta (#FF00FF).
```

**For green chroma (default for Necromon, exception for purple subjects):**
```
Background: solid flat green (#00FF00).
```

**For backgrounds/environments:**
Do NOT include any background color line. Describe the full scene. Set `expected_size` to `"original"`.

### 7. Chroma Avoidance Line

This prevents the AI from using colors in the subject that would be destroyed by chroma key removal.

**When using magenta background:**
```
Do not use pink, magenta, or purple tones in the character's skin or clothing.
```

**When using green background:**
```
Do not use green, lime, or yellow-green tones in the character.
```

### 8. Purple/Pink Subject Exception

If the subject IS intentionally purple (a violet betta fish, a dark eel with purple scales, a demon with purple skin), do NOT include the magenta chroma avoidance line. Instead:

- Switch to green background: `Background: solid flat green (#00FF00).`
- Use green avoidance: `Do not use green, lime, or yellow-green tones in the character.`
- Add a note: `IMPORTANT: This subject is intentionally purple/violet.`

Rule of thumb: if more than 20% of the subject's visible area is purple, pink, or magenta, switch to green chroma.

---

## Visual Effects in Pixel Art

All magical effects — glows, auras, divine light, dark energy, sparkles — must be described as pixel art effects, not photorealistic effects.

**WRONG (produces gradient blending that creates fringe halos):**
```
A soft, warm divine glow emanates outward from its body like a golden aura.
```

**RIGHT (produces hard-edged pixel blocks that survive chroma key):**
```
Bright golden pixel blocks radiate outward from its body in a starburst pattern with hard edges. No gradient blending, no translucent edges.
```

**WRONG:**
```
Faint dark smoky shadow trails behind it like a cloak.
```

**RIGHT:**
```
Dark charcoal pixel blocks trail behind it in a jagged pattern with sharp edges.
```

If an asset absolutely requires a soft glow effect (rare), increase its `fringe_tolerance_override` to 90-100 in the roster JSON and accept that minor manual cleanup may be needed.

---

## Asset Type Reference

| Type | Size | Chroma | Pixelation | Notes |
|------|------|--------|------------|-------|
| Portrait (bust) | 256x256 | Yes | Yes | Characters, apostles, NPCs |
| Sprite (full body) | 128x128 or 256x256 | Yes | Yes | Battle sprites, creatures |
| Fish/creature | 128x128 | Yes | Yes | Pokémon-equivalent party members |
| Boss | 256x256 | Yes | Yes | Large multi-figure or dramatic scenes |
| Icon (item) | 64x64 | Yes | Yes | Bread, potions, equipment |
| Background | original | No | No | Battle arenas, town scenes |

---

## Per-Game Configuration

### Loaves and Fishes
- **Theme:** Biblical setting, warm tones, historical Middle Eastern aesthetic
- **Default chroma:** Magenta (#FF00FF)
- **Shadow palette:** Dark grey, charcoal, warm brown
- **Shadow avoidance:** No purple, violet, or magenta in shading
- **Green chroma exceptions:** Betta Together (purple fish), Holy Eel (purple with golden runes), any demon/spirit with purple skin
- **Type system colors:** Holy (gold/white), Water (blue/silver), Earth (brown/green), Spirit (pale blue/cyan), Dark (charcoal/red/black)
- **Special note:** Dark-type assets need explicit shadow color direction to prevent purple bleed. Use "dark grey, charcoal black, and muted teal for all body shading."

### Necromon
- **Theme:** Dark gothic, undead, necromancy, bone and decay
- **Default chroma:** Green (#00FF00) — because purple/magenta are core palette colors for undead, dark magic, and corruption
- **Shadow palette:** Sickly grey-green, bone white, charcoal black
- **Shadow avoidance:** No green, lime, or yellow-green in shading
- **Magenta chroma exceptions:** Assets that are intentionally bright green (nature spirits, poison creatures, plant-based undead)
- **Outline style:** Varies — skeletal/hard subjects use dark outlines, ghostly/ethereal subjects use soft-edged rendering

### HexDesk
- **Theme:** Modern office meets magical realm, corporate-fantasy hybrid, clean UI aesthetic
- **Default chroma:** Magenta (#FF00FF)
- **Shadow palette:** Dark grey, navy, charcoal
- **Shadow avoidance:** No purple, violet, or magenta in shading
- **Green chroma exceptions:** Any purple-themed magical effects or characters
- **Special note:** UI elements and icons should be especially clean and readable at small sizes. Favor simplicity over detail for anything that displays at 64x64 or smaller.

---

## Worked Examples

### Standard Apostle Portrait (Loaves and Fishes)

```json
{
  "id": "APOSTLE_01",
  "category": "Apostle Portrait",
  "expected_size": "256x256",
  "prompt": "Generate a single 2D stylized RPG pixel art bust portrait of \"Peter the Apostle\" facing 3/4 left. He is a stocky, barrel-chested older man (50s) with a bald head, grey fringe of hair around the sides, and a thick bushy white beard. Tanned, deeply weathered skin. He wears a plain brown fisherman's tunic and holds a large iron key in one hand. Expression: Gritty and determined. Style: 16-bit retro character art with clean dark outlines. Generate a single sprite only. Do not show multiple views, angles, or duplicates. No drop shadow, no ground shadow, no cast shadow beneath the character. Use dark grey and charcoal for body shading. Background: solid flat magenta (#FF00FF). Do not use pink, magenta, or purple tones in the character's skin or clothing."
}
```

### Dark-Type Fish (Loaves and Fishes)

```json
{
  "id": "FISH_11",
  "category": "Dark Fish",
  "expected_size": "128x128",
  "prompt": "Generate a single 2D 16-bit retro RPG pixel art sprite of a \"Red Herring\" facing left with its body angled slightly as if sneaking away. It is an Atlantic Herring — a small, sleek, streamlined fish with a forked tail, a single dorsal fin, and large silvery scales. Colors: deep suspicious crimson-red body with dark charcoal-grey shading along its back and dark red fins. Its belly is a darker burgundy. Its eye is narrow, shifty, and side-glancing. Dark charcoal pixel blocks trail behind it in a jagged smoky pattern with sharp edges. A tiny dark question mark hovers above its head. Style: 16-bit retro RPG pixel art, flat colors, sharp pixel grid, strictly 2D sprite. Generate a single sprite only. Do not show multiple views, angles, or duplicates. No drop shadow, no ground shadow, no cast shadow beneath the character. Use dark charcoal grey for all shading. Do not use purple, violet, or magenta for shading. Background: solid flat magenta (#FF00FF). Do not use pink, magenta, or purple tones in the fish."
}
```

### Purple Subject on Green Chroma (Loaves and Fishes)

```json
{
  "id": "FISH_15",
  "category": "Spirit Fish",
  "expected_size": "128x128",
  "prompt": "Generate a single 2D 16-bit retro RPG pixel art sprite of a \"Betta Together\" facing left in an elegant display pose with all fins fully flared. It is a Siamese Fighting Fish (Betta splendens) with an extremely long, flowing, ruffled tail fin that drapes downward, large fanned-out pectoral fins, and a prominent dorsal crest. Colors: rich deep violet body with dark indigo fin edges that gradient into soft lavender at the translucent tips. Its scales have an iridescent shimmer. Its eye is bright and confident. Style: 16-bit retro RPG pixel art, flat colors, sharp pixel grid, strictly 2D sprite. Generate a single sprite only. Do not show multiple views, angles, or duplicates. No drop shadow, no ground shadow. Background: solid flat green (#00FF00). Do not use green, lime, or yellow-green tones in the fish. IMPORTANT: This subject is intentionally purple/violet.",
  "fringe_tolerance_override": 90
}
```

### Undead Creature (Necromon)

```json
{
  "id": "NECRO_01",
  "category": "Undead Minion",
  "expected_size": "128x128",
  "prompt": "Generate a single 2D 16-bit retro RPG pixel art sprite of a \"Skeletal Hound\" facing right in an aggressive stance. A reanimated dog skeleton with exposed ribs, a cracked skull with one glowing purple eye socket, and tattered remnants of grey fur clinging to its spine. Faint purple necromantic energy forms hard-edged pixel blocks around its joints — no gradient blending, no translucent edges. Style: 16-bit retro RPG pixel art, flat colors, sharp pixel grid, strictly 2D sprite. Generate a single sprite only. Do not show multiple views, angles, or duplicates. No drop shadow, no ground shadow, no cast shadow beneath the creature. Use sickly grey-green, bone white, and charcoal for all body shading. Do not use green, lime, or yellow-green for shading. Background: solid flat green (#00FF00). Do not use green, lime, or yellow-green tones in the creature."
}
```

### Background Scene (any game)

```json
{
  "id": "ENV_01",
  "category": "Background Scene",
  "expected_size": "original",
  "prompt": "Generate a single 2D pixel art RPG battle background scene of a stone courtyard in ancient Jerusalem. Cracked sandstone floor tiles, two weathered stone pillars on either side, a low wall at the back with a view of distant clay buildings and a pale blue sky. Warm afternoon light casting long shadows from the pillars. Dusty, sun-baked atmosphere. Style: 16-bit retro RPG background. This is a full scene — fill the entire canvas with no empty space. Do not include any characters or creatures."
}
```

### Item Icon (any game)

```json
{
  "id": "ITEM_01",
  "category": "Bread Item",
  "expected_size": "64x64",
  "prompt": "Generate a single 2D pixel art icon of a round pita bread loaf viewed from above at a slight angle. Golden-brown crust with darker brown spots from baking. A slight puff in the center showing it is freshly baked. Simple, clean, minimal detail — this must read clearly at 64x64 pixels. Style: 16-bit retro RPG item icon. Generate a single icon only, no duplicates. No drop shadow. Background: solid flat magenta (#FF00FF). Do not use pink or purple tones."
}
```

---

## Checklist Before Submitting a Roster

For every asset in the roster, verify:

- [ ] `id` is unique across the entire roster
- [ ] `expected_size` matches the asset type table above
- [ ] Prompt includes the style line
- [ ] Prompt includes single sprite language (unless background)
- [ ] Prompt includes shadow direction with explicit colors
- [ ] Prompt includes drop shadow prohibition (unless background or boss with intentional ground effects)
- [ ] Prompt includes background color line (unless background scene)
- [ ] Prompt includes chroma avoidance line matching the background color
- [ ] Purple/pink subjects use green chroma with green avoidance language
- [ ] Visual effects described as hard-edged pixel blocks, not gradients
- [ ] No slashes in category name
- [ ] Assets with glow effects have `fringe_tolerance_override` set to 90-100
