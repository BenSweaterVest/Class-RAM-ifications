# Manual Smoke Test Checklist

Use this checklist after gameplay, UI, asset, audio, or deployment-related changes.

## Scripted Preflight (Fast Regression Check)

- [ ] Run `npm test` (syntax, contract checks, service worker precache list)
- [ ] Start `npm run serve`, then run `npm run smoke` in a second terminal (about three minutes; includes a full four-barrier run)

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
- [ ] Press `Escape` and confirm game pauses (HUD shows "PAUSED", TIME holds, arrows and Space do nothing); press again to unpause
- [ ] Confirm the TIME readout counts down from 3:00 during play
- [ ] Press `R` to restart (works mid-run too); press `Enter` on the lose screen and confirm it restarts
- [ ] Press `M` and confirm the MUTE button label changes with it
- [ ] Toggle mute and confirm BGM and SFX both respond
- [ ] Toggle bright/dark mode and confirm the UI shell updates cleanly
- [ ] Change difficulty selector and confirm it takes effect after next restart
- [ ] Tab to the difficulty dropdown, change it with the arrow keys, and confirm the arrows then move the player again

## Desktop / Browser Parity

- [ ] On macOS Safari, confirm the desktop experience loads (not mobile swipe UI)
- [ ] On a phone or tablet (no keyboard), confirm the mobile swipe UI loads

## Mobile Touch Controls

- [ ] Swipe up/down and confirm lane changes
- [ ] Swipe left/right and confirm horizontal movement
- [ ] Tap and confirm Solidarity attempts/activation
- [ ] Confirm the touch hint shows initially and dismisses after first gesture
- [ ] Confirm the top-bar restart button works on touch layouts
- [ ] On mobile-sized layout, confirm tapping a legend card opens a bottom sheet and pauses gameplay
- [ ] Switch to another app mid-run, come back, and confirm the game is paused and a tap resumes it

## Info Modals (HOW TO PLAY / ABOUT)

- [ ] Click HOW TO PLAY — confirm modal opens with keyboard controls, touchscreen controls, and objective sections
- [ ] Click ABOUT — confirm modal opens with Dr. Kris Norman quote, HTG links, and Inspired By grid with images
- [ ] Click ✕ CLOSE — confirm modal closes
- [ ] Click backdrop area outside panel — confirm modal closes
- [ ] Open a modal mid-run: HUD reads PAUSED and TIME holds; close it and confirm play resumes
- [ ] Pause with Escape first, open and close a modal, and confirm the game stays paused
- [ ] Press Escape while a modal is open and confirm only the modal closes
- [ ] Press arrows or Space while a modal is open and confirm the game ignores them
- [ ] Confirm modals render correctly in both dark and light mode

## Narrative Checkpoints

- [ ] Confirm intro narrative card (CARD_01) appears at run start and blocks gameplay until continue
- [ ] Confirm phase1Clear narrative card appears after first successful barrier pass
- [ ] Confirm phase2Clear narrative card appears after second successful barrier pass
- [ ] Confirm phase3Clear narrative card appears after third successful barrier pass
- [ ] Confirm phase4Victory (EO 12968 victory card) appears after fourth barrier pass
- [ ] Confirm win screen appears after dismissing phase4Victory: fireworks, disco balls, per-phase stats, all-time total
- [ ] Confirm `Enter` and the continue button advance narrative cards, one card per press or click
- [ ] Confirm `Space` and `R` do nothing while a narrative card is open
- [ ] Confirm BGM ducks during popup and restores on close

## Core Flow

- [ ] Confirm standard obstacles spawn and move across the playfield
- [ ] Confirm collectible members increase chain count
- [ ] Confirm player collision with obstacles reduces lives
- [ ] Confirm suit collisions shred extra chain beyond baseline tail loss behavior
- [ ] Confirm cabinet collisions apply temporary slowdown
- [ ] Confirm bot interactions apply lane-lock timing pressure
- [ ] Confirm systemic wall appears on schedule
- [ ] Confirm wall is fatal without active solidarity and the lose screen says the barrier closed
- [ ] Let the clock run out and confirm the lose screen says time ran out
- [ ] Switch browser tabs mid-run, return, and confirm the game is paused rather than flooded with obstacles
- [ ] Confirm solidarity bypass consumes chain and allows wall pass-through
- [ ] Confirm info cards pause gameplay when open, and that Escape closes the card

## Sprite Wiring

- [ ] Confirm player, follower, obstacle, and wall entities render via image sprites
- [ ] Confirm suit obstacles appear grayscale/desaturated (not full color) — check on iOS Safari specifically
- [ ] Temporarily break one sprite path and confirm fallback geometry remains playable

## Local Startup

- [ ] Start a local server from the repo root
- [ ] Open the game in a browser without console errors
- [ ] Confirm sprites appear from `assets/processed/`

## Audio

- [ ] Confirm the first click or key press produces one normal sound, not a stacked burst
- [ ] Confirm mute toggle affects both SFX and BGM
- [ ] Confirm barrier warning pulses and cancels cleanly on restart
- [ ] Confirm narrative SFX plays and loops while popup is open

## Offline / PWA

- [ ] Load the page once, stop the local server (or set DevTools Network to Offline), reload, and confirm the game boots
- [ ] Confirm DevTools > Application > Cache Storage shows `class-ram-v5` only, with a single `runner_mode.js` entry after several reloads
- [ ] Open ABOUT once online, go offline, reopen ABOUT, and confirm the two thumbnails still show

## Reduced Motion

- [ ] With the OS reduced-motion setting on, clear a barrier and confirm there is no white flash (sparkles still play)

## Frame Rate

- [ ] If a 120 Hz display is available, confirm obstacle and wall speed match a 60 Hz display

## Debug Gating

- [ ] Confirm F2 and Alt+digit do nothing on a normal URL and work with `?debug`

## Deploy Verification

- [ ] After deploy, repeat the startup, controls, core flow, and offline checks on the live URL
