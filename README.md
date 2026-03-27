# Class RAM-ifications

An in-progress historical arcade project inspired by High Tech Gays v. Defense Industrial Security Clearance Office (1984-1995).

## What Is This?

A runner game about building collective strength under escalating institutional pressure. You collect HTG members, survive hazards, clear barriers with Solidarity, and advance through five historical narrative checkpoints.

## Play

- Runner mode (default): index.html
- Legacy mode: index.html?mode=legacy

Run locally:

```bash
npx serve .
```

## Current Runner Targets

- Barrier clears required for victory: 4
- Phase chain thresholds: 3 -> 4 -> 5 -> 6 (base; scaled by difficulty mode)
- Difficulty modes: story / organize (default) / resist
- Narrative checkpoints: 5 (intro, phase 1 clear, phase 2 clear, phase 3 clear, final EO 12968 card)
- Narrative popup cards: illustrated card backplates with live text overlay
- HTG roster: eight named pride-flag members reused for pickups and follower chain
- PWA: installable via manifest.json + sw.js service worker

## Controls

- Up / W or Down / S: lane change
- Left / A: move left
- Right / D: move right
- Space: Solidarity
- Escape: pause / unpause
- R / Enter: restart (on lose or win screen)
- M: mute

On touch-capable devices, the runner now supports swipe/tap input:

- Swipe up/down: lane change
- Swipe left/right: horizontal shift
- Tap: Solidarity

## Gameplay Summary

- Collect HTG members to increase chain.
- Avoid suits, cabinets, and bots.
- Use Solidarity only when barrier is near and current phase threshold is met.
- Each successful barrier clear advances narrative and phase state.
- Final clear unlocks Executive Order 12968 victory card.

## Verification

Run full checks:

```bash
node scripts/run_all_checks.js
```

Focused runner smoke (with local server):

```bash
npx http-server . -p 4173 -c-1
node scripts/smoke_runner_focus.js
node scripts/smoke_mode_shell.js
```

## Key Docs

- docs/GDD.md
- docs/DEVELOPMENT.md
- docs/MECHANICS_GUIDE.md
- docs/NEXT_SPRINTS_PLAN.md
- docs/TODOS.md
- docs/ROADMAP.md
- docs/PROGRAM_STATUS.md

## Historical Note

The game reflects the arc from discriminatory clearance treatment to policy correction in 1995 through Executive Order 12968.
