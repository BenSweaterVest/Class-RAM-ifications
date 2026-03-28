# Live Verification Runbook

Use this after a Cloudflare Pages deployment to validate release readiness quickly and consistently.

## 1. Open Build

- Open deployed URL in desktop browser.
- Confirm page loads with no blocking startup errors.

## 2. Runner Startup Validation

- Open `index.html`.
- Confirm runner legend row appears below the game.
- Confirm intro history checkpoint appears immediately and blocks gameplay.
- Validate controls:
  - `ArrowUp` and `ArrowDown` lane change
  - `ArrowLeft` / `A` move left
  - `ArrowRight` / `D` move right
  - `Space` Solidarity (near active barrier, chain meets phase threshold)
  - `Escape` pause / unpause
  - `R` restart
- Validate shell utilities:
  - mute toggle
  - bright/dark mode toggle
  - difficulty selector (story / organize / resist)
  - restart button
- Validate narrative checkpoints block and continue as expected.
- Confirm BGM ducks during popup open and restores on close.
- Confirm Escape key pauses and unpauses; HUD shows "PAUSED".

## 3. Gameplay Flow Validation

- Confirm obstacle waves, member collection, chain growth.
- Confirm obstacle-specific effects (suit chain shred, cabinet slowdown, bot lane lock).
- Confirm barrier warning SFX and active collision behavior.
- Confirm solidarity pass-through and precedent increment.
- Confirm win screen appears after phase4Victory is dismissed: fireworks, disco balls, per-phase ally stats, all-time machine total.
- Confirm "Play Again?" restarts with same difficulty.

## 4. Visual/Asset Validation

- Confirm sprites load correctly; no missing-asset hard failures.
- Inspect console for repeated sprite load errors.
- On a phone-sized viewport, confirm tapping a runner info card opens a bottom sheet and pauses gameplay.
- Confirm manifest.json is served correctly (PWA installability prompt in Chrome/Edge).
- Confirm sw.js registers without console errors (cache name: class-ram-v3).

## 5. Audio Validation

- Confirm SFX initialize on first user interaction.
- Confirm mute toggle behavior works for both SFX and BGM.
- If BGM starts, confirm autoplay policy-safe start and mute behavior.
- If BGM does not start, confirm that is treated as non-blocking.

## 6. Evidence Capture

Record in go/no-go report:

- Deploy run URL
- Browser/device matrix used
- Pass/fail per section
- Blockers and non-blockers
- Final recommendation (GO/NO-GO)
