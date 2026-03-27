# Manual Smoke Test Checklist

Use this checklist after gameplay, UI, asset, audio, or deployment-related changes.

## Scripted Preflight (Fast Regression Check)

- [ ] Run `node scripts/check_asset_sync.js`
- [ ] Run `node scripts/check_runner_contract.js`
- [ ] Run `node scripts/check_smoke_contract.js`
- [ ] Run `node scripts/run_all_checks.js`
- [ ] With a local server running, run `node scripts/smoke_runner_focus.js`
- [ ] With a local server running, run `node scripts/smoke_mode_shell.js`

## Runner Pivot Mode Startup

- [ ] Open `index.html` (runner is default)
- [ ] Confirm tower buttons are hidden
- [ ] Confirm runner legend row appears below the game
- [ ] Confirm intro history checkpoint appears immediately and blocks gameplay
- [ ] Confirm game starts without console errors blocking startup

## Legacy Mode Startup

- [ ] Open `index.html?mode=legacy`
- [ ] Confirm tower buttons are visible
- [ ] Confirm runner narrative overlay is hidden
- [ ] Confirm tower-defense hint text is present

## Runner Pivot Controls

- [ ] Press `ArrowUp` / `W` and `ArrowDown` / `S` to change lanes
- [ ] Press `ArrowLeft` / `A` to move left
- [ ] Press `ArrowRight` / `D` to move right
- [ ] Press `Space` near a barrier when chain threshold is met and confirm Solidarity activation
- [ ] Press `Escape` and confirm game pauses (HUD shows "PAUSED"); press again to unpause
- [ ] Press `R` to restart run after fail or success
- [ ] Press `M` and confirm mute toggles
- [ ] Toggle bright/dark mode and confirm the UI shell updates cleanly
- [ ] Change difficulty selector and confirm it takes effect after next restart

## Runner Pivot Mobile Touch Controls

- [ ] Swipe up/down and confirm lane changes
- [ ] Swipe left/right and confirm horizontal movement
- [ ] Tap and confirm Solidarity attempts/activation
- [ ] Confirm the touch hint shows initially and dismisses after first gesture
- [ ] Confirm the top-bar restart button still works on touch layouts

## Runner Narrative Checkpoints

- [ ] Confirm intro narrative card (CARD_01) appears at run start and blocks gameplay until continue
- [ ] Confirm phase1Clear narrative card appears after first successful barrier pass
- [ ] Confirm phase2Clear narrative card appears after second successful barrier pass
- [ ] Confirm phase3Clear narrative card appears after third successful barrier pass
- [ ] Confirm phase4Clear (EO 12968 victory card) appears after fourth barrier pass and resolves to win state
- [ ] Confirm `Enter` and the continue button advance narrative cards
- [ ] Confirm `Space` does not dismiss narrative cards
- [ ] Confirm BGM ducks during popup and restores on close

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
- [ ] Confirm info cards pause gameplay when open
- [ ] On mobile-sized layout, confirm tapping a legend card opens a bottom sheet and pauses gameplay

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
- [ ] If BGM starts, confirm mute affects it too
- [ ] If BGM does not start, confirm gameplay still remains fully usable

## Asset Fallback

- [ ] Temporarily simulate a missing sprite path and confirm fallback shapes still render the game as playable

## Deploy Verification

- [ ] After deploy, repeat the startup, controls, and stage progression checks on the live URL
