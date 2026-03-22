# Manual Smoke Test Checklist

Use this checklist after gameplay, UI, asset, audio, or deployment-related changes.

## Scripted Preflight (Fast Regression Check)

- [ ] Run `node scripts/check_asset_sync.js`
- [ ] Run `node scripts/check_runner_contract.js`
- [ ] Run `node scripts/check_smoke_contract.js`
- [ ] Run `node scripts/run_all_checks.js`

## Runner Pivot Mode Startup

- [ ] Open `index.html` (runner is default)
- [ ] Confirm mode banner shows `MODE: runner`
- [ ] Confirm tower buttons are hidden and solidarity button is visible
- [ ] Confirm game starts without console errors blocking startup

## Legacy Mode Startup

- [ ] Open `index.html?mode=legacy`
- [ ] Confirm mode banner shows `MODE: legacy`
- [ ] Confirm tower buttons are visible and runner controls are hidden

## Runner Pivot Controls

- [ ] Press `ArrowUp` and `ArrowDown` to change lanes
- [ ] Press `ArrowLeft` and confirm temporary slow effect
- [ ] Press `ArrowRight` and `D` and confirm dash behavior
- [ ] Press `Space` or click `SOLIDARITY` near a barrier when chain threshold is met
- [ ] Press `R` to restart run after fail or success

## Runner Pivot Mobile Touch Controls

- [ ] Tap `SLOW` and confirm temporary slow effect
- [ ] Tap `DASH` button and confirm speed burst behavior
- [ ] Tap `LANE UP` and `LANE DOWN` buttons to change lanes
- [ ] Tap `SOLIDARITY` button near an active barrier when threshold is met
- [ ] Tap `RESTART` button after fail or success and confirm clean reset

## Runner Narrative Checkpoints

- [ ] Confirm intro narrative card appears at run start and blocks gameplay until `CONTINUE`
- [ ] Confirm first precedent narrative card appears after first successful barrier pass
- [ ] Confirm second precedent narrative card appears after second successful barrier pass
- [ ] Confirm courtroom narrative card appears at courtroom transition
- [ ] Confirm `Enter`, `Space`, and `CONTINUE` all advance narrative cards

## Runner Pivot Core Flow

- [ ] Confirm standard obstacles spawn and move across the playfield
- [ ] Confirm collectible members increase chain count
- [ ] Confirm player collision with obstacles reduces lives
- [ ] Confirm suit collisions shred extra chain beyond baseline tail loss behavior
- [ ] Confirm cabinet collisions apply temporary slowdown
- [ ] Confirm bot interactions apply lane-lock timing pressure
- [ ] Confirm systemic wall appears on schedule
- [ ] Confirm wall is fatal without active solidarity
- [ ] Confirm solidarity bypass consumes chain and allows wall pass-through
- [ ] Confirm failed solidarity attempts show reason feedback (too early, too late, no barrier, or insufficient chain)

## Runner Pivot Sprite Wiring

- [ ] Confirm runner player, follower, obstacle, and wall entities render via image sprites
- [ ] Temporarily break one runner sprite path and confirm fallback geometry remains playable
- [ ] Restore sprite path and confirm image rendering returns without runtime errors

## Local Startup

- [ ] Start a local server from the repo root
- [ ] Open the game in a browser without console errors blocking startup
- [ ] Confirm sprites appear from `assets/processed/`

## Core Controls

- [ ] Click each tower button and confirm the selected button state and hint text update
- [ ] Press `1` through `4` and confirm keyboard selection updates the same UI state
- [ ] Click the canvas and confirm the selected tower places if enough precedent is available
- [ ] Confirm towers cannot overlap when placed

## Gameplay Flow

- [ ] Confirm case files spawn and move left to right
- [ ] Confirm auditors spawn and move right to left
- [ ] Confirm Coder projectiles slow auditors
- [ ] Confirm Attorney projectiles damage and kill auditors
- [ ] Confirm Activist tower reduces burden on nearby files
- [ ] Confirm Encryption tower protects nearby towers from subpoenas
- [ ] Confirm precedent increases on cleared files and defeated auditors
- [ ] Confirm lives decrease when a file is denied

## Stage Progression

- [ ] Confirm status/year UI updates during stage changes
- [ ] Confirm 1990 and 1995 stages enter the monochrome/harder phase
- [ ] Confirm winning the 1995 stage reaches the cleared end screen
- [ ] Confirm losing all lives reaches the game over screen
- [ ] Confirm `R` restarts cleanly from the 1984 stage

## Audio

- [ ] Confirm SFX initialize on first click or key press
- [ ] Confirm `M` toggles mute without breaking gameplay
- [ ] If BGM is in use, confirm mute affects it too

## Asset Fallback

- [ ] Temporarily simulate a missing sprite path and confirm fallback shapes still render the game as playable

## Deploy Verification

- [ ] After deploy, repeat the startup, controls, and stage progression checks on the live URL
