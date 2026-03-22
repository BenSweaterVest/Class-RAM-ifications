# Live Verification Runbook

Use this after a Cloudflare Pages deployment to validate release readiness quickly and consistently.

## 1. Open Build

- Open deployed URL in desktop browser.
- Confirm page loads with no blocking startup errors.

## 2. Runner Default Validation

- Open `index.html` path.
- Confirm mode banner reads `MODE: runner`.
- Confirm runner controls are visible and tower controls are hidden.
- Validate controls:
  - `ArrowUp` / `ArrowDown` lane movement
  - `ArrowLeft` slow
  - `ArrowRight` or `D` dash
  - `Space` solidarity (near active barrier with sufficient chain)
  - `R` restart
- Validate narrative checkpoints block and continue as expected.

## 3. Legacy Regression Validation

- Open `index.html?mode=legacy`.
- Confirm mode banner reads `MODE: legacy`.
- Confirm tower controls are visible and runner controls are hidden.
- Validate legacy controls:
  - `1`-`4` select towers
  - click canvas to place tower
  - `M` mute
  - `R` restart

## 4. Gameplay Flow Validation

- Runner:
  - confirm obstacle waves, member collection, chain growth
  - confirm obstacle-specific effects (suit chain shred, cabinet slowdown, bot lane lock)
  - confirm barrier warning and active collision behavior
  - confirm solidarity pass-through and precedent increment
- Legacy:
  - confirm case/auditor flow and stage transitions

## 5. Visual/Asset Validation

- Confirm sprites load in both modes.
- Confirm no missing-asset hard failures.
- If possible, inspect console for repeated sprite load errors.

## 6. Audio Validation

- Confirm SFX initialize on first user interaction.
- Confirm mute toggle behavior works.
- If BGM is enabled for release, confirm autoplay policy-safe start and mute behavior.

## 7. Evidence Capture

Record in go/no-go report:

- Deploy run URL
- Browser/device matrix used
- Pass/fail per section
- Blockers and non-blockers
- Final recommendation (GO/NO-GO)
