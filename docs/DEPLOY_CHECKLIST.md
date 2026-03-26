# Deploy Verification Checklist

Use this checklist when preparing or validating a Cloudflare Pages deployment.

Companion references:

- [docs/DEPLOY_DRY_RUN.md](DEPLOY_DRY_RUN.md)
- [docs/LIVE_VERIFICATION_RUNBOOK.md](LIVE_VERIFICATION_RUNBOOK.md)

## Before Deploy

- [ ] Confirm the repo contains the intended runtime sprites under `assets/processed/`
- [ ] Confirm `node --check game.js` passes
- [ ] Review [docs/SMOKE_TEST.md](SMOKE_TEST.md) and resolve any known blocking gameplay issues
- [ ] Confirm `.github/workflows/deploy.yml` still points at the correct Cloudflare Pages project name
- [ ] Confirm `CLOUDFLARE_API_TOKEN` exists in GitHub Actions secrets
- [ ] Confirm `CLOUDFLARE_ACCOUNT_ID` exists in GitHub Actions secrets

## Trigger Deploy

- [ ] Push the intended branch to `main` or trigger the workflow manually
- [ ] Confirm the GitHub Actions run starts successfully
- [ ] Confirm the Cloudflare Pages step completes without errors

## Live Verification

- [ ] Open the deployed URL
- [ ] Run the startup, control, gameplay flow, and stage progression checks from [docs/SMOKE_TEST.md](SMOKE_TEST.md)
- [ ] Confirm the mobile bottom-sheet info flow still works on a phone-sized viewport
- [ ] Confirm runtime sprites load correctly on the live build
- [ ] Confirm mute and restart behavior still work on the live build
- [ ] If BGM starts in the live build, confirm music behavior is correct on first user gesture
- [ ] If BGM does not start, confirm the build is still acceptable under the non-blocking audio policy

## Sign-Off

- [ ] Capture any deploy-specific issues in `docs/TODOS.md` or `docs/ROADMAP.md`
- [ ] Decide whether the deploy is good enough to treat as the current public build
