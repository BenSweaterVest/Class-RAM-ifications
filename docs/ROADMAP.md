# Roadmap

Last updated: September 11, 2026

## Completed

- Runner-first architecture established; legacy tower-defense mode retired and removed.
- Core movement / obstacles / collection / barrier / solidarity loop.
- 5-card historical narrative flow (intro + 4 phase clears), illustrated card art, tone SFX.
- Dynamic phase thresholds (3/4/5/6) + difficulty modes (story / organize / resist).
- Narrative SFX looping while popup is open; AudioContext resume fix.
- Promoted phase backgrounds, checkpoint cards, and named HTG roster (8 members).
- Runner HUD, legend cards, theme toggle, compact UI, and checkpoint UX.
- Mobile swipe/tap controls, touch hint, bottom-sheet info cards.
- Pause system: Escape, story and info cards, info modals, and hidden tab share one clock; input blocked while paused; tap resumes on touch.
- Barrier-clear effects: white flash, rainbow sparkles, 3-second invulnerability glow arc.
- Win screen: fireworks (multi-direction, multi-color), disco balls, per-phase stats, all-time total.
- PWA: manifest.json, sw.js (class-ram-v5), favicon set, absolute OG/Twitter meta tags; offline play after first visit.
- Attempt counter and totalAlliesGathered shown on You Lose screen.
- All legacy/retired assets removed; repo pruned; source mirror folder removed.
- Verification green (September 11, 2026): `npm test` (syntax, contracts, precache list) and `npm run smoke` (shell, runner, full four-barrier run).
- Real-device testing complete. Balance accepted.
- HOW TO PLAY / ABOUT modal buttons: keyboard + touchscreen controls, objective, historical quote, HTG links, Inspired By grid.
- Post-testing bug fixes: Safari macOS touch-ui (`hover: none` guard in isLikelyTouchDevice), Safari iOS suit grayscale (ImageData pre-processing; ctx.filter removed).
- September 11, 2026 review pass: frame-rate-independent movement, offline-capable service worker, single key handler, audio unlock gate, modal and hidden-tab pause, run countdown and loss reasons, debug gating, precache check, doc sync. Details in docs/KNOWN_ISSUES.md.

## Pending (Owner Action Only)

- Commit and push; deploy to https://class-ram-ifications.pages.dev/
- Live verification per `docs/LIVE_VERIFICATION_RUNBOOK.md`
- Go/no-go signoff per `docs/GO_NO_GO_TEMPLATE.md`

## Locked Product Decisions

- Public title: `Class RAM-ifications`
- Default first-visit theme: dark mode
- Mobile control style: swipe/tap, not persistent gameplay buttons
- Mobile info UX: pausing bottom sheet from legend card row
- Audio stance: BGM implemented, non-blocking for release if startup fails
- Difficulty default: `organize`
- Narrative copy: locked
- No content expansion, leaderboard, or sharing features planned
