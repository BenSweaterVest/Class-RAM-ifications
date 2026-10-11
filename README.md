# Class RAM-ifications

A historical arcade runner inspired by High Tech Gays v. Defense Industrial Security Clearance Office (1984-1995).

Live: https://class-ram-ifications.pages.dev/

## What Is This?

A runner game about building collective strength under escalating institutional pressure. You play Timothy Dooling. Collect HTG members, survive hazards, clear barriers with Solidarity, and advance through five historical checkpoints to Executive Order 12968.

## Play

Open `index.html` directly, or serve the folder locally:

```bash
npm run serve
```

Then open http://127.0.0.1:4173/.

## Run Targets

- Run length: 3 minutes, shown as a countdown in the HUD
- Barrier clears required for victory: 4
- Phase chain thresholds: 3, 4, 5, 6 (base; shifted by difficulty mode)
- Difficulty modes: story / organize (default) / resist
- Narrative checkpoints: 5 (intro, three phase clears, final EO 12968 card)
- HTG roster: eight named pride-flag members used for pickups and the follower chain
- Installable as a PWA (manifest.json + sw.js); playable offline after the first visit

## Controls

Keyboard:

- Up / Down: change lane
- Left / A: move left
- Right / D: move right
- Space: Solidarity
- Escape: pause / unpause (closes an open info card first)
- M: mute / unmute
- R: restart at any time
- Enter: restart after the run ends

Touch (phones and small tablets):

- Swipe up / down: change lane
- Swipe left / right: move left / right
- Tap: Solidarity
- Tap while paused: resume
- Tap after the run ends: restart (a short cooldown prevents accidental restarts)

The run pauses on its own while the HOW TO PLAY or ABOUT window is open and when the browser tab is hidden.

## Gameplay Summary

- Collect HTG members to grow your chain.
- Avoid suits (chain loss), cabinets (slowdown), and bots (lane lock).
- When a barrier approaches and your chain meets the phase threshold, activate Solidarity to clear it.
- Each clear advances the phase and opens the next history card.
- The fourth clear opens the Executive Order 12968 card, then the win screen.
- The run ends if you lose all three lives, reach a barrier without Solidarity, or run out of time.

## Verification

```bash
npm test
```

runs `scripts/run_all_checks.js`: syntax checks, the runner and smoke contract checks, and the service worker precache check.

The browser smoke tests need a local server in a second terminal:

```bash
npm run serve
```

```bash
npm run smoke
```

`npm run smoke` runs the shell smoke, the runner smoke, and a full end-to-end run (about two minutes) that clears all four barriers and checks the win screen.

## Debugging

Open the game with `?debug` in the URL to enable the F2 overlay, the Alt+digit scene shortcuts, and `window.runnerDebug` (a state snapshot and an obstacle-immunity switch, used by the full-run smoke). Details in docs/DEVELOPMENT.md.

## Key Docs

- docs/GDD.md
- docs/DEVELOPMENT.md
- docs/MECHANICS_GUIDE.md
- docs/KNOWN_ISSUES.md
- docs/RELEASE_NOTES.md
- docs/PROGRAM_STATUS.md

## Historical Note

The game follows the arc from discriminatory clearance treatment in 1984 to the policy correction of Executive Order 12968 in 1995. Background in docs/HISTORY.md.
