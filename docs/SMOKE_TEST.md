# Manual Smoke Test Checklist

Use this checklist after gameplay, UI, asset, audio, or deployment-related changes.

## Scripted Preflight (Fast Regression Check)

- [ ] Run `node scripts/check_runner_contract.js`
- [ ] Run `node scripts/check_smoke_contract.js`
- [ ] Run `node scripts/run_all_checks.js`
- [ ] With a local server running, run `node scripts/smoke_runner_focus.js`
- [ ] With a local server running, run `node scripts/smoke_mode_shell.js`

## Runner Startup

- [ ] Open `index.html`
- [ ] Confirm runner legend row appears below the game
- [ ] Confirm intro history checkpoint appears immediately and blocks gameplay
- [ ] Confirm game starts without console errors blocking startup

## Runner Controls

- [ ] Press `ArrowUp` and `ArrowDown` to change lanes
- [ ] Press `ArrowLeft` / `A` to move left
- [ ] Press `ArrowRight` / `D` to move right
- [ ] Press `Space` near a barrier when chain threshold is met and confirm Solidarity activation
- [ ] Press `Escape` and confirm game pauses (HUD shows "PAUSED"); press again to unpause
- [ ] Press `R` to restart run after fail or success
- [ ] Toggle mute and confirm BGM and SFX both respond
- [ ] Toggle bright/dark mode and confirm the UI shell updates cleanly
- [ ] Change difficulty selector and confirm it takes effect after next restart

## Mobile Touch Controls

- [ ] Swipe up/down and confirm lane changes
- [ ] Swipe left/right and confirm horizontal movement
- [ ] Tap and confirm Solidarity attempts/activation
- [ ] Confirm the touch hint shows initially and dismisses after first gesture
- [ ] Confirm the top-bar restart button works on touch layouts
- [ ] On mobile-sized layout, confirm tapping a legend card opens a bottom sheet and pauses gameplay

## Info Modals (HOW TO PLAY / ABOUT)

- [ ] Click HOW TO PLAY — confirm modal opens with keyboard controls, touchscreen controls, and objective sections
- [ ] Click ABOUT — confirm modal opens with Dr. Kris Norman quote, HTG links, and Inspired By grid with images
- [ ] Click ✕ CLOSE — confirm modal closes
- [ ] Click backdrop area outside panel — confirm modal closes
- [ ] Press Escape while modal is open — confirm modal closes without triggering game pause
- [ ] Confirm modals render correctly in both dark and light mode

## Narrative Checkpoints

- [ ] Confirm intro narrative card (CARD_01) appears at run start and blocks gameplay until continue
- [ ] Confirm phase1Clear narrative card appears after first successful barrier pass
- [ ] Confirm phase2Clear narrative card appears after second successful barrier pass
- [ ] Confirm phase3Clear narrative card appears after third successful barrier pass
- [ ] Confirm phase4Victory (EO 12968 victory card) appears after fourth barrier pass
- [ ] Confirm win screen appears after dismissing phase4Victory: fireworks, disco balls, per-phase stats, all-time total
- [ ] Confirm `Enter` and the continue button advance narrative cards
- [ ] Confirm `Space` does not dismiss narrative cards
- [ ] Confirm BGM ducks during popup and restores on close

## Core Flow

- [ ] Confirm standard obstacles spawn and move across the playfield
- [ ] Confirm collectible members increase chain count
- [ ] Confirm player collision with obstacles reduces lives
- [ ] Confirm suit collisions shred extra chain beyond baseline tail loss behavior
- [ ] Confirm cabinet collisions apply temporary slowdown
- [ ] Confirm bot interactions apply lane-lock timing pressure
- [ ] Confirm systemic wall appears on schedule
- [ ] Confirm wall is fatal without active solidarity
- [ ] Confirm solidarity bypass consumes chain and allows wall pass-through
- [ ] Confirm info cards pause gameplay when open

## Sprite Wiring

- [ ] Confirm player, follower, obstacle, and wall entities render via image sprites
- [ ] Temporarily break one sprite path and confirm fallback geometry remains playable

## Local Startup

- [ ] Start a local server from the repo root
- [ ] Open the game in a browser without console errors
- [ ] Confirm sprites appear from `assets/processed/`

## Audio

- [ ] Confirm SFX initialize on first click or key press
- [ ] Confirm mute toggle affects both SFX and BGM
- [ ] Confirm barrier warning pulses and cancels cleanly on restart
- [ ] Confirm narrative SFX plays and loops while popup is open

## Deploy Verification

- [ ] After deploy, repeat the startup, controls, and core flow checks on the live URL
