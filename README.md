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

- Run length: 180 seconds
- Barrier clears required for victory: 4
- Phase chain thresholds: 3 -> 5 -> 7 -> 9
- Narrative checkpoints: 5 (intro, phase 1 clear, phase 2 clear, phase 3 clear, final EO 12968 card)
- Narrative popup cards: illustrated card backplates with live text overlay
- HTG roster: eight named pride-flag members reused for pickups and follower chain

## Controls

- Up/Down: lane change
- Left/A: move left
- Right/D: move right
- Space: Solidarity
- R: restart
- M: mute

Touch controls are supported and toggleable.

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
```

## Key Docs

- docs/GDD.md
- docs/DEVELOPMENT.md
- docs/MECHANICS_GUIDE.md
- docs/TODOS.md
- docs/ROADMAP.md
- docs/PROGRAM_STATUS.md

## Historical Note

The game reflects the arc from discriminatory clearance treatment to policy correction in 1995 through Executive Order 12968.
