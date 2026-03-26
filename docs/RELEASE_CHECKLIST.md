# First Release Checklist

Use this checklist before calling the first public build ready.

Companion references:

- [docs/RELEASE_CANDIDATE_STATUS.md](RELEASE_CANDIDATE_STATUS.md)
- [docs/GO_NO_GO_TEMPLATE.md](GO_NO_GO_TEMPLATE.md)

## Product Readiness

- [ ] The full 1984 to 1995 run is playable without blocking bugs
- [ ] Sprite alignment is good enough that gameplay reads clearly
- [ ] HUD text, tower hint text, and end screens are readable
- [ ] Difficulty feels acceptable through at least one full run, including the intended slight easing of rounds 3 and 4

## Runner Pivot Readiness

- [ ] `index.html` (runner default) is playable with no blocking errors
- [ ] `index.html?mode=legacy` remains playable as regression reference
- [ ] Lane switching and dash controls are responsive on desktop and mobile
- [ ] Mobile info cards use the intended bottom-sheet treatment and pause gameplay when open
- [ ] Solidarity threshold and barrier timing are understandable without external explanation
- [ ] Precedent shield behavior is visually and mechanically clear
- [ ] Historical finale messaging and Executive Order transition are correct

## Repo And Asset Readiness

- [ ] Runtime sprites are present in `assets/processed/`
- [ ] A decision has been made about keeping or trimming `class_ram_ifications assets/`
- [ ] A decision has been made about the deleted `asset_digester_template.html`
- [ ] The intended release files are committed intentionally

## Audio Readiness

- [x] Release stance recorded: BGM remains implemented but is non-blocking for release
- [ ] If BGM starts in the release build, the asset and mute behavior are verified

## Deployment Readiness

- [ ] [docs/DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) has been completed
- [ ] The live URL has been checked after deployment
- [ ] Any release-blocking issues discovered on live have been fixed or consciously deferred
