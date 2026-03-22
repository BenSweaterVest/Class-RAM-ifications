# Balancing Worksheet

Last updated: March 22, 2026
Purpose: capture tuning presets and playtest observations for runner balance decisions.

## Current Baseline

- Solidarity threshold: 5
- Run duration: 180000 ms
- Courtroom phase at: 135000 ms
- Courtroom duration: 45000 ms
- Wall interval: 25000 ms (15000 ms in courtroom finale)
- Wall warning: 1800 ms

## Candidate Presets

### Preset A: Casual

- Solidarity threshold: 4
- Wall interval: 28000 ms
- Wall warning: 2200 ms
- Obstacle density multiplier target: -15% vs baseline

### Preset B: Balanced (Current Target)

- Solidarity threshold: 5
- Wall interval: 25000 ms
- Wall warning: 1800 ms
- Obstacle density multiplier target: baseline

### Preset C: High-Pressure

- Solidarity threshold: 6
- Wall interval: 22000 ms
- Wall warning: 1500 ms
- Obstacle density multiplier target: +15% vs baseline

## Playtest Capture Template

For each run:

- Date:
- Preset:
- Input type (keyboard/touch):
- Outcome (fail/success):
- Time survived:
- Precedents established:
- Barrier failures count:
- Notes on fairness/readability:

## Decision Criteria

- At least 70% of target users can understand solidarity timing within first 2 runs.
- At least 60% of balanced-profile runs reach courtroom phase.
- Barrier failures should feel attributable to player timing, not unreadable telegraphing.
