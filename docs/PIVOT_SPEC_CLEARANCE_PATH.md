# Pivot Specification

Title: The Clearance Path: HTG vs DISCO (working)
Project: Class RAM-ifications
Status: Approved design direction, implementation in progress
Last updated: March 21, 2026

## 1. Executive Summary

This pivot repositions the project from a tower-defense structure into a short-session lane-runner with an explicit systemic barrier mechanic.

Narrative framing:

- Player embodies Timothy Dooling in 1980s Silicon Valley
- Standard bureaucracy is dodgeable
- Specialized anti-gay investigation barriers are not survivable solo
- Collective organizing enables legal precedent and progression

Session target:

- 3 to 5 minutes
- Procedural escalation
- Mobile browser first, desktop parity

## 2. Core Gameplay Loop

1. Run: player navigates five lanes and avoids standard obstacle waves.
2. Organize: player collects isolated workers, building a trailing solidarity chain.
3. Survive: systemic wall event appears and blocks all lanes.
4. Activate: solidarity action converts chain into temporary precedent shield.
5. Advance: successful barrier bypass grants multiplier and escalates wave pressure.

## 3. Mechanics Specification

### 3.1 Input and Movement

- Playfield: fixed isometric-feel five-lane grid
- Input:
	- left/right lane switch (tap or key)
	- dash trigger with cooldown
	- solidarity activation button when conditions are met
- Lane switch cooldown baseline: 0.1s
- Dash baseline: 1.0s duration at 1.5x speed

### 3.2 Chain of Solidarity

- Collecting a member increments chain length and appends follower
- Followers mirror player path with temporal offset (elastic train)
- Tail-loss rule: obstacle contact trims from back of chain first
- Chain count is both score potential and survival resource

### 3.3 Standard Obstacle Families

- Suits: rhythmic traversal and occasional short dash
- Filing cabinets: forecasted lane danger then lane descent
- Polygraph bots: temporary lane lock and path denial

Implementation note:

- Keep obstacle logic deterministic per seed where possible for balancing and reproducibility

### 3.4 Special Condition Barrier

Object type: SpecialConditionBarrier

Properties:

- Spans all five lanes
- Triggered by wave schedule events
- Collides as hard fail unless shield state active

Behavior:

- Spawns with foreground warning window
- Requires chain threshold (baseline 5)
- On solidarity activation, enters temporary pass-through state

### 3.5 Solidarity Activation

Trigger conditions:

- Barrier in activation radius
- chainLinkCount >= threshold

Effects:

- temporary precedent shield state
- audiovisual surge cue
- barrier bypass permission
- chain consumed (default full consumption)
- precedentEstablished counter increments

## 4. Run Progression and End State

- Wave speed and density increase over time
- Final symbolic courtroom stage is mechanically overwhelming
- If precedentEstablished >= targetCount (baseline 3), outcome transitions to Executive Order 12968 sequence

This preserves historical framing:

- legal pathway presented as partial win through precedent and policy, not fantasy domination

## 5. Asset Requirements

### 5.1 Characters and Obstacles

- Player_Timothy (run, dash, struck, merge)
- HTG_Follower_Type01-05 (run, merge, struck)
- Enemy_Suit
- Enemy_FilingCabinet
- Enemy_PolygraphBot
- Barrier_GayInvestigationUnit (multi-tile spanning wall)
- Collectible_HTGMember

### 5.2 Effects and UI

- FX_SolidarityHeart (chain connector pulse)
- FX_PrecedentShield (activation state)
- FX_RedTapePit (edge hazard atmosphere)
- GridTile_CorporateLogic
- Environment_Background
- UI_SolidarityButton with inactive/active/urgent states
- CRT overlay shader

### 5.3 Audio

- Score_BureaucracyDrill (main loop)
- Score_SolidarityDefiant (activation surge)
- Score_CourtroomConclusion (endgame pressure)
- SFX set: step, collect, clash, surge, game over

## 6. Engineering Migration Plan

### Stage A: Runner Foundation

- lane controls
- dash timing
- obstacle spawn loop
- chain count and life system

### Stage B: Barrier and Solidarity

- barrier scheduler and warning UI
- threshold gate
- shield state and bypass

### Stage C: Historical Finale and Polish

- precedent counters and ending transition
- mobile touch parity
- audio mode transitions

## 7. Non-Negotiable Design Pillars

- Systemic barrier must feel qualitatively different from normal obstacles
- Collective action must be mechanically necessary, not decorative
- Mobile readability and response latency are first-class constraints
- Historical framing should remain explicit and legible in UI messaging

## 8. Open Calibration Values

- chain threshold (default 5)
- solidarity active duration
- wall warning lead time
- dash cooldown and invulnerability policy
- chain consumption model (full vs partial)

## 9. Implementation Notes for This Repository

- Keep legacy mode available until runner mode reaches barrier-loop parity
- Use query-parameter mode switching during transition
- Maintain static-host compatibility, no build step required
