# Class RAM-ifications – Status & Next Steps

**Last updated:** March 2025

---

## Current status

**Implemented:** Full run (1984→1995), four towers (Coder, Attorney, Activist, Encryption), burden/lives, Subpoenas (9th Circuit + 1995), procedural SFX + M mute, BGM hook, stage banner, high score (best year + stages), win/lose + Retry. Deploy workflow ready (Cloudflare Pages).

**Not yet:** 32×32 pixel art (placeholders in use). Optional: add BGM file; set deploy secrets and go live.

**Where we want to be (near term):** Game live on Cloudflare Pages; optional art and BGM when you’re ready. No new features until after first playtest.

---

## Todos & open questions

| Item | Who | Notes |
|------|-----|------|
| Set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in GitHub | You | Required for deploy |
| Push to `main` or run deploy workflow; verify URL | You | After secrets set |
| Optional: add 32×32 sprites (Art Pipeline in DEVELOPMENT.md) | You / when ready | Placeholders work until then |
| Optional: add BGM file + wire in audio | You / when ready | See DEVELOPMENT.md → Audio |
| Difficulty tuning (e.g. lives, spawn rates) | After playtest | Open question; no change until feedback |

Doc/code fixes from this pass: GDD resolution set to 800×400; DEVELOPMENT project structure lists ROADMAP; Global State corrected (no `currentYear`, `isMonochrome` is a function). Nothing else blocking.

---

## Design decisions (locked in)

| Topic | Decision |
|-------|----------|
| Tower placement | Click anywhere, no overlap |
| Lives | Carry over for whole run |
| Stage length | 60s per stage |
| 1995 win | Survive 60s (files may be DENIED) |
| Subpoenas | 9th Circuit + 1995 only |
| Art | Placeholders until you add per-entity PNGs |
| Audio | Original or CC0/CC-BY only |
| High score | Best year reached + stages completed |

---

## What’s next

1. **Deploy:** Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub (Settings → Secrets and variables → Actions), push to `main` or run the workflow, then verify the live URL.
2. **Optional – Art:** Add 32×32 sprites per [DEVELOPMENT.md](DEVELOPMENT.md) (Art Pipeline).
3. **Optional – BGM:** Add `assets/bgm.ogg` and wire with `window.bgm.setTrack('assets/bgm.ogg')` + `bgm.play()` on first user gesture; see DEVELOPMENT.md → Audio → How to add BGM.

---

## Future options (no commitment)

- **Mobile:** Touch controls for tower placement.
- **Difficulty:** Easy/Normal toggle (e.g. more lives, slower auditors).
- **Accessibility:** Reduce motion or simplified visuals (see GDD §9).
