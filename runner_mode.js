const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const gameContainer = document.getElementById('game-container');

const uiPrecedent = document.getElementById('precedent-val');
const uiLives = document.getElementById('lives-val');
const uiStatus = document.getElementById('status-val');
const uiYear = document.getElementById('year-val');
const runnerNarrativePanel = document.getElementById('runner-narrative');
const runnerNarrativeTitle = document.getElementById('runner-narrative-title');
const runnerNarrativeBody = document.getElementById('runner-narrative-body');
const runnerNarrativeNextButton = document.getElementById('runner-narrative-next');
const runnerLegend = document.getElementById('runner-legend');
const runnerTouchHint = document.getElementById('runner-touch-hint');
const runnerLegendSheet = document.getElementById('runner-legend-sheet');
const runnerLegendSheetBackdrop = document.getElementById('runner-legend-sheet-backdrop');
const runnerLegendSheetTitle = document.getElementById('runner-legend-sheet-title');
const runnerLegendSheetBody = document.getElementById('runner-legend-sheet-body');
const runnerLegendSheetClose = document.getElementById('runner-legend-sheet-close');

const LANES = [70, 130, 190, 250, 310];
const RUN_DURATION_MS = 180000;
const WALL_WARNING_MS = 1800;
const SOLIDARITY_RANGE_PX = 140;
const PRECEDENT_TARGET = 4;
const WITHIN_ROUND_RAMP = 0.4;

// Per-round profiles (normal difficulty). Index = precedentEstablished (barriers cleared so far).
// barrier demand = chainThreshold * memberSpawnMs / wallIntervalMs
// R0: 22%  R1: 30%  R2: 38%  R3: 47%  — gradual, coherent escalation each round.
const ROUND_PROFILES = [
    { wallIntervalMs: 26000, chainThreshold: 3, memberSpawnMs: 1800, obstacleBase: 1.00, solidarityRangePx: SOLIDARITY_RANGE_PX,      tooLateBufferPx: -30, shieldDurationMs: 1800 },
    { wallIntervalMs: 23000, chainThreshold: 4, memberSpawnMs: 1700, obstacleBase: 1.15, solidarityRangePx: SOLIDARITY_RANGE_PX + 10,  tooLateBufferPx: -34, shieldDurationMs: 1900 },
    { wallIntervalMs: 21000, chainThreshold: 5, memberSpawnMs: 1600, obstacleBase: 1.30, solidarityRangePx: SOLIDARITY_RANGE_PX + 20,  tooLateBufferPx: -38, shieldDurationMs: 2050 },
    { wallIntervalMs: 19000, chainThreshold: 6, memberSpawnMs: 1500, obstacleBase: 1.50, solidarityRangePx: SOLIDARITY_RANGE_PX + 28,  tooLateBufferPx: -44, shieldDurationMs: 2200 },
];

// Difficulty mode scalars applied on top of the round profile.
const DIFFICULTY_MODES = {
    story:    { wallMult: 1.30, thresholdOffset: -1, memberMult: 0.85, obstacleMult: 0.75, speedMult: 0.85 },
    organize: { wallMult: 1.00, thresholdOffset:  0, memberMult: 1.00, obstacleMult: 1.00, speedMult: 1.00 },
    resist:   { wallMult: 0.85, thresholdOffset:  1, memberMult: 1.15, obstacleMult: 1.25, speedMult: 1.15 },
};

const PHASE_YEAR_BY_PRECEDENT = [1984, 1987, 1990, 1995, 1995];
const PHASE_BACKGROUND_KEY_BY_PRECEDENT = [
    'backgroundPhase1',
    'backgroundPhase2',
    'backgroundPhase3',
    'backgroundPhase4',
    'backgroundPhase4'
];

let lives = 3;
let score = 0;
let chainCount = 0;
let precedentEstablished = 0;
let gameActive = true;
let gameWon = false;
let laneLockedUntil = 0;
let laneLockCooldownUntil = 0;
let courtroomFinaleActive = false;
let pendingVictoryAfterNarrative = false;
let gameEndedAt = 0;

let runStart = 0;
let roundStart = 0;
let activeDifficulty = 'organize';
let lastSpawn = 0;
let lastMemberSpawn = 0;
let lastWall = 0;
let nextPatternAt = 0;
let pendingSpawns = [];

let obstacles = [];
let members = [];
let wall = null;
let particles = [];
let solidarityFeedbackText = '';
let solidarityFeedbackUntil = 0;
let laneLockFeedbackText = '';
let laneLockFeedbackUntil = 0;
let narrativePaused = false;
let legendPaused = false;
let narrativeQueue = [];
let narrativePauseStartedAt = 0;
let legendPauseStartedAt = 0;
const shownNarrativeKeys = new Set();
let debugOverlayEnabled = false;
let collectedMembers = [];
let legendExpandedCardId = '';
let legendRosterRotationIndex = 0;
let legendRosterRotationInterval = 0;
let activeTouchGesture = null;
let touchHintDismissed = false;
let touchGestureCooldownUntil = 0;
let gamePaused = false;
let gamePauseStartedAt = 0;
let phaseFlashUntil = 0;
let postBarrierInvulnerabilityUntil = 0;
let totalAlliesGathered = 0;
let currentAttemptNumber = 0;
let runnerLegendItems = [];

const TOUCH_TAP_MAX_DISTANCE = 14;
const TOUCH_SWIPE_MIN_DISTANCE = 28;

const player = {
    x: 180,
    targetX: 180,
    lane: 2,
    targetLane: 2,
    y: LANES[2],
    speed: 0,
    slowUntil: 0,
    laneCooldownUntil: 0,
    horizontalCooldownUntil: 0,
    hitFlashUntil: 0,
    trail: []
};

const NARRATIVE_COPY = {
    intro: {
        title: '1984: The Investigation Begins',
        tone: 'neutral',
        body: 'You are Timothy Dooling - nuclear fusion engineer at Lockheed Missiles and Space Company, former Army intelligence officer, and member of High Tech Gays.\n\nDISCO flagged your clearance application not because of your record, but because you belonged to HTG. A process that normally takes six weeks stretched into a year. By the time it cleared, Lockheed had laid you off.\n\nHTG voted to join your suit as co-plaintiff. The class action was filed August 29, 1984.\n\nCollect HTG members to build your chain. Activate Solidarity at each barrier. Establish the precedents that make policy change possible.'
    },
    phase1Clear: {
        title: 'The Suit Is Filed',
        tone: 'hopeful',
        body: 'August 29, 1984. Attorney Richard Gayer filed the formal complaint against the Department of Defense and DISCO in San Francisco Federal Court.\n\nThe suit made national news the same day - covered on Channel 4 and in the San Francisco Chronicle, Examiner, and Mercury.\n\nDISCO had 60 days to respond. The government moved immediately for dismissal.\n\nThe case survived. HTG grew to nearly 700 members. The fight was just beginning.\n\nNext stop: Federal District Court.'
    },
    phase2Clear: {
        title: '1987: Henderson Rules',
        tone: 'happy',
        body: 'On August 19, 1987, US District Judge Thelton Henderson ruled in HTG\'s favor.\n\nHe found "no rational basis for subjecting all gay applicants to expanded investigations" that straight applicants never faced - calling the policy "founded upon deep-seated prejudice" that "casts gay people as innately inferior."\n\nHe ordered DISCO to stop.\n\nThe government appealed immediately. Henderson stayed his own ruling pending that appeal.\n\nThe win was real. It just wasn\'t over.\n\nNext stop: 9th Circuit Court of Appeals.'
    },
    phase3Clear: {
        title: '1990: The Reversal',
        tone: 'somber',
        body: 'On February 2, 1990, three judges of the 9th Circuit reversed Henderson\'s ruling.\n\nTheir reasoning: homosexuality is "behavioral, not immutable," gay people "are not without political power," and the DoD had a rational basis for its policy because counterintelligence agencies target homosexuals.\n\nHTG petitioned for the full 28-judge court to rehear the case. Two dissenting judges called the refusal "a grave error." The petition failed.\n\nThe legal path was closed. But the fight wasn\'t over.\n\nNext stop: Washington DC.'
    },
    phase4Victory: {
        title: 'August 2, 1995: Executive Order 12968',
        tone: 'victory',
        body: 'President Clinton signed Executive Order 12968, formally prohibiting discrimination in security clearance decisions on the basis of sexual orientation.\n\nThe courts hadn\'t gotten there. Three judges of the 9th Circuit had made sure of that.\n\nBut eleven years of organized resistance - class actions, newsletters, fundraisers, member by member - had made the political cost of inaction too high.\n\nThe administrative exclusion that started with Timothy Dooling\'s clearance delay at Lockheed was finally, formally, on the record as wrong.\n\nEXECUTIVE ORDER 12968'
    }
};

const NARRATIVE_SEQUENCE = ['intro', 'phase1Clear', 'phase2Clear', 'phase3Clear', 'phase4Victory'];

const NARRATIVE_CARD_BY_KEY = {
    intro: 'card01',
    phase1Clear: 'card02',
    phase2Clear: 'card03',
    phase3Clear: 'card04',
    phase4Victory: 'card05'
};

const PRIDE_MEMBER_VARIANTS = [
    { key: 'htgAlex', color: '#ff1493', colorName: 'Hot Pink', meaning: 'Sexuality', characterName: 'Alex' },
    { key: 'htgCarmen', color: '#e53935', colorName: 'Red', meaning: 'Life', characterName: 'Carmen' },
    { key: 'htgMarcus', color: '#fb8c00', colorName: 'Orange', meaning: 'Healing', characterName: 'Marcus' },
    { key: 'htgSam', color: '#fdd835', colorName: 'Yellow', meaning: 'Sunlight', characterName: 'Sam' },
    { key: 'htgJordan', color: '#43a047', colorName: 'Green', meaning: 'Nature', characterName: 'Jordan' },
    { key: 'htgDani', color: '#00acc1', colorName: 'Turquoise', meaning: 'Art/Magic', characterName: 'Dani' },
    { key: 'htgRobin', color: '#3949ab', colorName: 'Indigo', meaning: 'Serenity', characterName: 'Robin' },
    { key: 'htgEvelyn', color: '#7e57c2', colorName: 'Violet', meaning: 'Spirit', characterName: 'Evelyn' }
];

const PLAYER_MIN_X = 88;
const PLAYER_MAX_X = canvas.width - 120;

const runnerSpriteAssets = {};
const runnerSpriteState = {};

const RUNNER_SPRITE_PATHS = {
    player: 'assets/processed/PLAYER_01_TimothyDoolingPlayerCharacter_00001_.png',
    htgAlex: 'assets/processed/HTG_01_HTGMemberAlex_00001_.png',
    htgCarmen: 'assets/processed/HTG_02_HTGMemberCarmen_00001_.png',
    htgMarcus: 'assets/processed/HTG_03_HTGMemberMarcus_00001_.png',
    htgSam: 'assets/processed/HTG_04_HTGMemberSam_00001_.png',
    htgJordan: 'assets/processed/HTG_05_HTGMemberJordan_00001_.png',
    htgDani: 'assets/processed/HTG_06_HTGMemberDani_00001_.png',
    htgRobin: 'assets/processed/HTG_07_HTGMemberRobin_00001_.png',
    htgEvelyn: 'assets/processed/HTG_08_HTGMemberEvelyn_00001_.png',
    suit: 'assets/processed/ENEMY_02_CorporateSuit_00001_.png',
    cabinet: 'assets/processed/VintageSLOW_CABINET_v4_SlowObstacle-FilingCabinet_00001_.png',
    bot: 'assets/processed/LOCK_BOT_v3_LaneLockObstacle-SurveillanceBot_00001_.png',
    wall: 'assets/processed/BARRIER_v5_BarrierWall-SecurityDoor_00001_.png',
    heartFx: 'assets/processed/FX_01_SolidarityHeart_00001_.png',
    shieldFx: 'assets/processed/FX_02_PrecedentShield_00001_.png',
    tapeFx: 'assets/processed/FX_03_RedTapePit_00001_.png',
    uiSolidarityInactive: 'assets/processed/UI_01_SolidarityButtonInactive_00001_.png',
    uiSolidarityActive: 'assets/processed/UI_02_SolidarityButtonActive_00001_.png',
    uiSolidarityUrgent: 'assets/processed/UI_03_SolidarityButtonUrgent_00001_.png',
    gridTile: 'assets/processed/ENV_01_CorporateLogicGridTile_00001_.png',
    background: 'assets/processed/ENV_02_RunnerModeBackground_00001_.png',
    backgroundPhase1: 'assets/processed/BG_01_v3_BackgroundSiliconValley_00001_.png',
    backgroundPhase2: 'assets/processed/BG_02_v1_BackgroundDistrictCourt_00001_.png',
    backgroundPhase3: 'assets/processed/BG_03_BackgroundAppealsCourt_00001_.png',
    backgroundPhase4: 'assets/processed/BG_04_v3_BackgroundWashingtonDC_00001_.png',
    card01: 'assets/processed/CARD_01_CardIntro1984_00001_.png',
    card02: 'assets/processed/CARD_02_CardSuitFiled1984_00001_.png',
    card03: 'assets/processed/CARD_03_CardHendersonRules1987_00001_.png',
    card04: 'assets/processed/CARD_04_CardReversal1990_00001_.png',
    card05: 'assets/processed/CARD_05_CardExecutiveOrder1995_00001_.png'
};

const RUNNER_SPRITE_SPECS = {
    player: { w: 26, h: 26 },
    htgAlex: { w: 16, h: 22 },
    htgCarmen: { w: 15, h: 22 },
    htgMarcus: { w: 15, h: 22 },
    htgSam: { w: 16, h: 22 },
    htgJordan: { w: 15, h: 23 },
    htgDani: { w: 15, h: 23 },
    htgRobin: { w: 14, h: 22 },
    htgEvelyn: { w: 14, h: 22 },
    suit: { w: 32, h: 30 },
    cabinet: { w: 28, h: 26 },
    bot: { w: 24, h: 24 },
    wall: { w: 80, h: 320 },
    heartFx: { w: 10, h: 10 },
    shieldFx: { w: 74, h: 74 },
    tapeFx: { w: 18, h: 18 },
    uiSolidarityInactive: { w: 20, h: 20 },
    uiSolidarityActive: { w: 20, h: 20 },
    uiSolidarityUrgent: { w: 20, h: 20 },
    gridTile: { w: 20, h: 20 },
    background: { w: 360, h: 240 },
    backgroundPhase1: { w: 360, h: 240 },
    backgroundPhase2: { w: 360, h: 240 },
    backgroundPhase3: { w: 360, h: 240 },
    backgroundPhase4: { w: 360, h: 240 },
    card01: { w: 680, h: 380 },
    card02: { w: 680, h: 380 },
    card03: { w: 680, h: 380 },
    card04: { w: 680, h: 380 },
    card05: { w: 680, h: 380 }
};

function loadRunnerSprite(key, src) {
    const img = new Image();
    runnerSpriteState[key] = 'loading';
    img.onload = () => {
        runnerSpriteAssets[key] = applyRunnerChromaKey(img);
        runnerSpriteState[key] = 'loaded';
    };
    img.onerror = () => {
        runnerSpriteState[key] = 'error';
    };
    img.src = src;
}

function loadRunnerSprites() {
    Object.entries(RUNNER_SPRITE_PATHS).forEach(([key, src]) => loadRunnerSprite(key, src));
}

function getRunnerSprite(key) {
    return runnerSpriteState[key] === 'loaded' ? runnerSpriteAssets[key] : null;
}

function applyRunnerChromaKey(source) {
    try {
        const off = document.createElement('canvas');
        off.width = source.naturalWidth || source.width;
        off.height = source.naturalHeight || source.height;
        const offCtx = off.getContext('2d', { willReadFrequently: true });
        offCtx.drawImage(source, 0, 0);

        const imageData = offCtx.getImageData(0, 0, off.width, off.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const magenta = r >= 245 && g <= 20 && b >= 245;
            const green = g >= 245 && r <= 20 && b <= 20;
            if (magenta || green) {
                data[i + 3] = 0;
            }
        }

        offCtx.putImageData(imageData, 0, 0);
        return off;
    } catch (err) {
        console.warn('Runner chroma key processing failed; using raw sprite image fallback.', err);
        return source;
    }
}

function drawRunnerSprite(key, x, y, fallbackDraw, sizeOverride, drawOptions) {
    const img = getRunnerSprite(key);
    if (!img) {
        fallbackDraw();
        return;
    }

    const spec = sizeOverride || RUNNER_SPRITE_SPECS[key] || { w: 24, h: 24 };
    if (drawOptions && drawOptions.filter) {
        ctx.save();
        ctx.filter = drawOptions.filter;
        ctx.drawImage(img, x - spec.w / 2, y - spec.h / 2, spec.w, spec.h);
        ctx.restore();
        return;
    }
    ctx.drawImage(img, x - spec.w / 2, y - spec.h / 2, spec.w, spec.h);
}

function playSfx(name) {
    if (window.sfx && typeof window.sfx[name] === 'function') window.sfx[name]();
}

function clearCollectedMembers() {
    collectedMembers = [];
}

function addCollectedMember(memberVariant) {
    collectedMembers.unshift(memberVariant);
    chainCount = collectedMembers.length;
    totalAlliesGathered += 1;
}

function trimCollectedMembers(count = 1) {
    if (count <= 0 || !collectedMembers.length) return false;
    collectedMembers.splice(Math.max(0, collectedMembers.length - count), count);
    chainCount = collectedMembers.length;
    return true;
}

function getCollectedMemberForFollower(index) {
    return collectedMembers[index] || PRIDE_MEMBER_VARIANTS[index % PRIDE_MEMBER_VARIANTS.length];
}

function resetGame() {
    lives = 3;
    score = 0;
    chainCount = 0;
    precedentEstablished = 0;
    gameActive = true;
    gameWon = false;
    gameEndedAt = 0;
    laneLockedUntil = 0;
    laneLockCooldownUntil = 0;
    courtroomFinaleActive = false;
    pendingVictoryAfterNarrative = false;

    const diffSelect = document.getElementById('difficulty-select');
    activeDifficulty = (diffSelect && diffSelect.value) || 'organize';

    runStart = performance.now();
    roundStart = runStart;
    lastSpawn = runStart;
    lastMemberSpawn = runStart - 1400;
    lastWall = runStart;
    nextPatternAt = runStart;

    obstacles = [];
    members = [];
    wall = null;
    particles = [];
    pendingSpawns = [];
    if (window.sfx) window.sfx.cancelBarrierWarning();
    clearCollectedMembers();
    narrativePaused = false;
    legendPaused = false;
    narrativeQueue = [];
    shownNarrativeKeys.clear();
    legendExpandedCardId = '';
    legendPauseStartedAt = 0;
    touchGestureCooldownUntil = 0;
    gamePaused = false;
    gamePauseStartedAt = 0;
    phaseFlashUntil = 0;
    postBarrierInvulnerabilityUntil = 0;
    totalAlliesGathered = 0;
    currentAttemptNumber = (parseInt(localStorage.getItem('classRamAttempts') || '0')) + 1;
    localStorage.setItem('classRamAttempts', String(currentAttemptNumber));

    player.x = 180;
    player.targetX = 180;
    player.lane = 2;
    player.targetLane = 2;
    player.y = LANES[2];
    player.laneCooldownUntil = 0;
    player.horizontalCooldownUntil = 0;
    player.slowUntil = 0;
    player.trail = [];

    laneLockFeedbackText = '';
    laneLockFeedbackUntil = 0;

    enqueueNarrative('intro');
    showNextNarrative();

    updateUI();
}

function updateTouchHintVisibility() {
    if (!document.body || !runnerTouchHint) return;
    const hidden = narrativePaused || legendPaused || !gameActive;
    document.body.classList.toggle('touch-hint-hidden', hidden);
    document.body.classList.toggle('touch-hint-dismissed', touchHintDismissed);
}

function dismissTouchHint() {
    touchHintDismissed = true;
    updateTouchHintVisibility();
}

function isMobileLegendSheetMode() {
    return Boolean(document.body && document.body.classList.contains('touch-ui') && window.innerWidth <= 680);
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatLegendText(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
}

function updateLegendSheet(item) {
    if (!runnerLegendSheet || !runnerLegendSheetTitle || !runnerLegendSheetBody) return;
    if (!item) {
        runnerLegendSheetTitle.textContent = 'Info';
        runnerLegendSheetBody.innerHTML = '';
        return;
    }
    runnerLegendSheetTitle.textContent = item.title;
    const descriptionHtml = item.description
        ? `<p>${formatLegendText(item.description)}</p>`
        : '';
    runnerLegendSheetBody.innerHTML = `${descriptionHtml}${item.expandedHtml || ''}`;
}

function setLegendSheetOpen(open) {
    if (!runnerLegendSheet || !document.body) return;
    runnerLegendSheet.classList.toggle('is-open', open);
    runnerLegendSheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('legend-sheet-open', open);
    if (runnerLegendSheetBackdrop) {
        runnerLegendSheetBackdrop.hidden = !open;
    }
    if (open && runnerLegendSheetClose) {
        runnerLegendSheetClose.focus();
    }
}

function enqueueNarrative(key) {
    if (shownNarrativeKeys.has(key)) return;
    shownNarrativeKeys.add(key);
    narrativeQueue.push(key);
}

function debugForceNarrative(key) {
    // Force-show a narrative card regardless of whether it was already seen.
    // Clears any currently queued narratives first so the target shows immediately.
    narrativeQueue = [];
    shownNarrativeKeys.delete(key);
    enqueueNarrative(key);
    showNextNarrative();
}

function showNextNarrative() {
    if (!runnerNarrativePanel || !narrativeQueue.length) {
        narrativePaused = false;
        return;
    }

    const nextKey = narrativeQueue.shift();
    const copy = NARRATIVE_COPY[nextKey];
    if (!copy) {
        narrativePaused = false;
        return;
    }

    const sequenceIndex = NARRATIVE_SEQUENCE.indexOf(nextKey);
    const progressLabel = sequenceIndex >= 0
        ? `${sequenceIndex + 1}/${NARRATIVE_SEQUENCE.length}`
        : '?/?';

    const tone = copy.tone || 'neutral';
    const toneClass = `runner-narrative-theme-${tone}`;

    narrativePaused = true;
    narrativePauseStartedAt = performance.now();
    if (window.bgm) window.bgm.setVolume(0.05);
    if (runnerNarrativePanel) {
        runnerNarrativePanel.classList.remove(
            'runner-narrative-theme-neutral',
            'runner-narrative-theme-hopeful',
            'runner-narrative-theme-happy',
            'runner-narrative-theme-somber',
            'runner-narrative-theme-victory'
        );
        runnerNarrativePanel.classList.add(toneClass);
        const narrativeCardKey = NARRATIVE_CARD_BY_KEY[nextKey];
        const cardPath = narrativeCardKey ? RUNNER_SPRITE_PATHS[narrativeCardKey] : '';
        runnerNarrativePanel.style.backgroundImage = cardPath
            ? `linear-gradient(90deg, rgba(3, 18, 3, 0.22), rgba(3, 18, 3, 0.04)), url(${cardPath})`
            : '';
    }

    if (runnerNarrativeTitle) runnerNarrativeTitle.textContent = `History Checkpoint ${progressLabel}: ${copy.title}`;
    if (runnerNarrativeBody) runnerNarrativeBody.textContent = copy.body;
    runnerNarrativePanel.style.display = 'block';
    if (runnerNarrativeNextButton) runnerNarrativeNextButton.focus();
    playSfx(`narrative${tone.charAt(0).toUpperCase()}${tone.slice(1)}`);
    updateUI();
}

function advanceNarrative() {
    const now = performance.now();
    if (narrativePauseStartedAt > 0) {
        applyPauseCompensation(Math.max(0, now - narrativePauseStartedAt));
        narrativePauseStartedAt = 0;
    }

    if (runnerNarrativePanel) runnerNarrativePanel.style.display = 'none';
    if (narrativeQueue.length) {
        showNextNarrative();
        return;
    }
    narrativePaused = false;
    if (window.bgm) window.bgm.setVolume(0.24);
    touchGestureCooldownUntil = now + 240;

    if (pendingVictoryAfterNarrative) {
        pendingVictoryAfterNarrative = false;
        gameActive = false;
        gameWon = true;
        gameEndedAt = performance.now();
    }

    updateUI();
}

function setLegendPaused(paused) {
    if (legendPaused === paused) return;

    const now = performance.now();
    if (paused) {
        legendPaused = true;
        legendPauseStartedAt = now;
        updateUI();
        return;
    }

    if (legendPauseStartedAt > 0) {
        applyPauseCompensation(Math.max(0, now - legendPauseStartedAt));
        legendPauseStartedAt = 0;
    }
    legendPaused = false;
    updateUI();
}

function collapseLegendCards() {
    legendExpandedCardId = '';
    if (runnerLegend) {
        runnerLegend.querySelectorAll('.legend-card.is-expanded').forEach(card => {
            card.classList.remove('is-expanded');
            card.setAttribute('aria-expanded', 'false');
        });
    }
    updateLegendSheet(null);
    setLegendSheetOpen(false);
    setLegendPaused(false);
}

function setLegendExpandedCard(cardId) {
    if (!runnerLegend) return;
    const cards = Array.from(runnerLegend.querySelectorAll('.legend-card'));
    const usingMobileSheet = isMobileLegendSheetMode();
    legendExpandedCardId = cardId;
    cards.forEach(card => {
        const expanded = card.dataset.cardId === cardId;
        card.classList.toggle('is-expanded', expanded);
        card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    if (usingMobileSheet) {
        const item = runnerLegendItems.find(entry => entry.id === cardId);
        updateLegendSheet(item || null);
        setLegendSheetOpen(Boolean(item));
    } else {
        setLegendSheetOpen(false);
    }
    setLegendPaused(Boolean(cardId));
}

function toggleLegendCard(cardId) {
    if (!cardId) return;
    if (legendExpandedCardId === cardId) {
        collapseLegendCards();
        return;
    }
    setLegendExpandedCard(cardId);
}

function getCurrentThreshold() {
    return getRoundProfile().chainThreshold;
}

function getCurrentPhaseYear() {
    const idx = Math.min(precedentEstablished, PHASE_YEAR_BY_PRECEDENT.length - 1);
    return PHASE_YEAR_BY_PRECEDENT[idx];
}

function getCurrentBackgroundKey() {
    const idx = Math.min(precedentEstablished, PHASE_BACKGROUND_KEY_BY_PRECEDENT.length - 1);
    return PHASE_BACKGROUND_KEY_BY_PRECEDENT[idx];
}

function getRoundProfile() {
    const idx = Math.min(precedentEstablished, ROUND_PROFILES.length - 1);
    const base = ROUND_PROFILES[idx];
    const diff = DIFFICULTY_MODES[activeDifficulty] || DIFFICULTY_MODES.organize;
    return {
        wallIntervalMs:    Math.round(base.wallIntervalMs * diff.wallMult),
        chainThreshold:    Math.max(1, base.chainThreshold + diff.thresholdOffset),
        memberSpawnMs:     Math.round(base.memberSpawnMs * diff.memberMult),
        obstacleBase:      base.obstacleBase * diff.obstacleMult,
        solidarityRangePx: base.solidarityRangePx,
        tooLateBufferPx:   base.tooLateBufferPx,
        shieldDurationMs:  base.shieldDurationMs,
        speedMult:         diff.speedMult,
    };
}

function spawnRainbowSparkles(now) {
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff7f', '#00aaff', '#8b00ff', '#ff1493'];
    for (let i = 0; i < 48; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: now + 350 + Math.random() * 500,
            rainbow: true,
            color: colors[i % colors.length]
        });
    }
}

function handleBarrierClear() {
    const clearNow = performance.now();
    roundStart = clearNow;
    precedentEstablished += 1;
    score += 100;
    courtroomFinaleActive = precedentEstablished >= 3;
    phaseFlashUntil = clearNow + 600;
    postBarrierInvulnerabilityUntil = clearNow + 3000;
    spawnRainbowSparkles(clearNow);

    if (precedentEstablished === 1) enqueueNarrative('phase1Clear');
    if (precedentEstablished === 2) enqueueNarrative('phase2Clear');
    if (precedentEstablished === 3) enqueueNarrative('phase3Clear');
    if (precedentEstablished >= PRECEDENT_TARGET) {
        enqueueNarrative('phase4Victory');
        pendingVictoryAfterNarrative = true;
    }

    showNextNarrative();
}

function shiftTimer(value, delta) {
    if (!value || value <= 0) return value;
    return value + delta;
}

function applyPauseCompensation(deltaMs) {
    if (!deltaMs) return;

    runStart += deltaMs;
    roundStart += deltaMs;
    lastSpawn += deltaMs;
    lastMemberSpawn += deltaMs;
    lastWall += deltaMs;
    nextPatternAt += deltaMs;

    laneLockedUntil = shiftTimer(laneLockedUntil, deltaMs);
    laneLockCooldownUntil = shiftTimer(laneLockCooldownUntil, deltaMs);

    player.slowUntil = shiftTimer(player.slowUntil, deltaMs);
    player.laneCooldownUntil = shiftTimer(player.laneCooldownUntil, deltaMs);
    player.horizontalCooldownUntil = shiftTimer(player.horizontalCooldownUntil, deltaMs);

    laneLockFeedbackUntil = shiftTimer(laneLockFeedbackUntil, deltaMs);
    phaseFlashUntil = shiftTimer(phaseFlashUntil, deltaMs);
    postBarrierInvulnerabilityUntil = shiftTimer(postBarrierInvulnerabilityUntil, deltaMs);

    if (wall) {
        wall.warningUntil = shiftTimer(wall.warningUntil, deltaMs);
        wall.activeUntil = shiftTimer(wall.activeUntil, deltaMs);
    }

    pendingSpawns.forEach(spawn => {
        spawn.at += deltaMs;
    });
}

function handleNarrativeContinue(e) {
    if (e) {
        e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.sfx) window.sfx.init();
    advanceNarrative();
}

function updateUI() {
    if (uiPrecedent) uiPrecedent.textContent = `${chainCount}/${getCurrentThreshold()} chain | ${precedentEstablished} cleared`;
    if (uiLives) uiLives.textContent = String(lives);
    if (uiStatus) {
        if (gameWon) uiStatus.textContent = 'EXECUTIVE ORDER 12968';
        else if (!gameActive) uiStatus.textContent = 'RUN FAILED';
        else if (narrativePaused) uiStatus.textContent = 'PAUSED: STORY CHECKPOINT';
        else if (legendPaused) uiStatus.textContent = 'PAUSED: INFO CARD';
        else if (gamePaused) uiStatus.textContent = 'PAUSED';
        else if (courtroomFinaleActive) uiStatus.textContent = 'COURTROOM GAUNTLET';
        else if (laneLockedUntil > performance.now()) uiStatus.textContent = 'LANE LOCKED';
        else if (wall) uiStatus.textContent = 'BARRIER ACTIVE';
        else uiStatus.textContent = 'CLEARANCE PATH';
    }
    if (uiYear) {
        uiYear.textContent = String(getCurrentPhaseYear());
    }
    updateTouchHintVisibility();
}

function handleTouchGestureStart(e) {
    if (!e || e.pointerType !== 'touch' || e.isPrimary === false) return;
    if (!canvas || !gameContainer) return;
    if (runnerNarrativePanel && runnerNarrativePanel.contains(e.target)) return;
    if (legendPaused || narrativePaused) return;

    if (window.sfx) window.sfx.init();

    activeTouchGesture = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now()
    };

    if (typeof e.preventDefault === 'function') e.preventDefault();
}

function handleTouchGestureMove(e) {
    if (!activeTouchGesture || !e || e.pointerId !== activeTouchGesture.pointerId) return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
}

function handleTouchGestureEnd(e) {
    if (!activeTouchGesture || !e || e.pointerId !== activeTouchGesture.pointerId) return;
    const gesture = activeTouchGesture;
    activeTouchGesture = null;

    const now = performance.now();
    const dx = e.clientX - gesture.startX;
    const dy = e.clientY - gesture.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (typeof e.preventDefault === 'function') e.preventDefault();

    if (narrativePaused || legendPaused) return;
    if (gamePaused) return;
    if (now < touchGestureCooldownUntil) return;

    if (absX <= TOUCH_TAP_MAX_DISTANCE && absY <= TOUCH_TAP_MAX_DISTANCE) {
        dismissTouchHint();
        if (!gameActive) {
            if (now - gameEndedAt < 1500) return;
            resetGame();
            return;
        }
        attemptSolidarityActivation(now);
        return;
    }

    if (Math.max(absX, absY) < TOUCH_SWIPE_MIN_DISTANCE) return;

    dismissTouchHint();
    if (!gameActive) {
        if (now - gameEndedAt < 1500) return;
        resetGame();
        return;
    }

    if (absY > absX) {
        if (dy < 0) tryMoveLane(-1);
        else tryMoveLane(1);
        return;
    }

    if (dx < 0) triggerSlow();
    else triggerDash();
}

function handleTouchGestureCancel(e) {
    if (!activeTouchGesture || !e || e.pointerId !== activeTouchGesture.pointerId) return;
    activeTouchGesture = null;
}

function renderRunnerLegend() {
    if (!runnerLegend) return;

    const htgExpandedHtml =
        '<div class="htg-card-explainer">Real people with real jobs at real defense contractors.\nHTG wasn\'t a protest group, it was a social organization that decided they needed to fight back.\nCollect them. Solidarity only works if you show up together.<br><br>Represented by eight members, each tied to a color from the original pride flag and its meaning.</div>' +
        '<div class="htg-mini-grid">' +
        PRIDE_MEMBER_VARIANTS.map(member => (
            `<div class="htg-mini-card">` +
            `<img src="${RUNNER_SPRITE_PATHS[member.key]}" alt="${member.characterName}">` +
            `<div class="htg-mini-line">` +
            `<strong>${member.characterName}</strong>` +
            `<span class="htg-sep">|</span>` +
            `<span>${member.colorName}</span>` +
            `<span class="htg-sep">|</span>` +
            `<span>${member.meaning}</span>` +
            `</div>` +
            `</div>`
        )).join('') +
        '</div>';

    runnerLegendItems = [
        {
            id: 'contender',
            path: RUNNER_SPRITE_PATHS.player,
            label: 'Timothy Dooling (Contender)',
            title: 'Contender',
            description: 'You are Timothy Dooling, a former army officer and a nuclear fusion engineer at Lockheed Missiles and Space Co.\nYou applied for a Secret industrial clearance in 1983. Despite having held an Army clearance less than a year prior, you were denied for your "homosexual activity."\n\nNow you must Dodge hazards, build solidarity, and survive long enough to change the world.'
        },
        {
            id: 'htg-members',
            path: RUNNER_SPRITE_PATHS[PRIDE_MEMBER_VARIANTS[legendRosterRotationIndex].key],
            label: 'HTG Members (Ally Chain)',
            imageId: 'runner-legend-htg-preview',
            title: 'HTG Members',
            description: '',
            expandedHtml: htgExpandedHtml
        },
        {
            id: 'suit',
            path: RUNNER_SPRITE_PATHS.suit,
            label: 'Suit (Damage)',
            title: 'DISCO Investigator (Suit)',
            description: 'A Defense Industrial Security Clearance Office field agent.\nArmed with a manual that classifies homosexuality alongside alcoholism and psychosis.\nAuthorized to investigate "the nature and full extent of deviant acts."\nAvoid them or lose members of your chain, or if you are alone, your life.',
            imageStyle: 'filter:grayscale(1) saturate(0.15) contrast(1.1);'
        },
        {
            id: 'cabinet',
            path: RUNNER_SPRITE_PATHS.cabinet,
            label: 'Cabinet (Slow)',
            title: 'Cabinet (SLOW)',
            description: 'DISCO may grant clearances to gay applicants eventually.\nBut "eventually" meant months of intrusive questioning about sexual partners, meeting places, and "disclosed proclivities."\nA process designed to take six weeks that stretched years. The delay was more than a punishment, it was there to deter you. It slows you down.'
        },
        {
            id: 'bot',
            path: RUNNER_SPRITE_PATHS.bot,
            label: 'Bot (LOCK)',
            title: 'Bot (LOCK)',
            description: 'The Defense Investigative Security Clearance Office didn\'t rely on agents alone.\nPolygraph machines. Surveillance equipment. Automated screening systems that flagged HTG membership before a human ever read your file. The apparatus locks your options before you even know it\'s there.'
        },
        {
            id: 'wall',
            path: RUNNER_SPRITE_PATHS.wall,
            label: 'Policy (Barrier Wall)',
            title: 'Policy (Barrier Wall)',
            description: 'The Defense Industrial Security Clearance Office didn\'t need to fire you. It just needed to make clearance impossible.\nNo individual decision. No single agent. Just a policy that said gay applicants required expanded review, indefinitely. Only solidarity breaks through. Build your chain and push.'
        }
    ];

    const spriteCards = runnerLegendItems.map(item => (
        `<button class="legend-card" type="button" tabindex="0" data-card-id="${item.id}" aria-expanded="false">` +
        `<img ${item.imageId ? `id="${item.imageId}"` : ''} src="${item.path}" alt="${item.label}" ${item.imageStyle ? `style="${item.imageStyle}"` : ''}>` +
        `<span class="legend-card-label">${item.label}</span>` +
        `<div class="legend-tooltip"><strong>${item.title}</strong>${item.description ? item.description : ''}${item.expandedHtml || ''}</div>` +
        `</button>`
    )).join('');

    runnerLegend.style.display = 'block';
    runnerLegend.innerHTML =
        '<div class="runner-legend-grid">' + spriteCards + '</div>';

    if (legendRosterRotationInterval) {
        clearInterval(legendRosterRotationInterval);
    }
    const rosterPreview = document.getElementById('runner-legend-htg-preview');
    if (rosterPreview) {
        legendRosterRotationInterval = window.setInterval(() => {
            if (legendExpandedCardId === 'htg-members') return;
            legendRosterRotationIndex = (legendRosterRotationIndex + 1) % PRIDE_MEMBER_VARIANTS.length;
            rosterPreview.src = RUNNER_SPRITE_PATHS[PRIDE_MEMBER_VARIANTS[legendRosterRotationIndex].key];
        }, 1100);
    }
}

function setSolidarityFeedback(text, durationMs = 1200) {
    solidarityFeedbackText = text;
    solidarityFeedbackUntil = performance.now() + durationMs;
    if (uiStatus && gameActive) uiStatus.textContent = text;
}

function setLaneLockFeedback(text, durationMs = 1000) {
    laneLockFeedbackText = text;
    laneLockFeedbackUntil = performance.now() + durationMs;
}

function enqueueSpawn(now, delayMs, kind, lane) {
    pendingSpawns.push({
        at: now + delayMs,
        kind,
        lane
    });
}

function createObstacle(now, type, lane) {
    const sm = getRoundProfile().speedMult;
    let speed = (2.1 + Math.random() * 1.2) * sm;
    let w = 24;
    let h = 18;
    let renderW = 24;
    let renderH = 18;
    if (type === 'cabinet') {
        speed = 2.5 * sm;
        w = 26;
        h = 20;
        renderW = 28;
        renderH = 26;
    }
    if (type === 'bot') {
        speed = 1.8 * sm;
        w = 34;
        h = 22;
        renderW = 24;
        renderH = 24;
    }
    if (type === 'suit') {
        const scale = 0.84 + Math.random() * 0.32;
        w = Math.round(24 * scale);
        h = Math.round(20 * scale);
        renderW = Math.round(32 * scale);
        renderH = Math.round(30 * scale);
    }
    obstacles.push({
        type,
        lane,
        x: canvas.width + 30,
        y: LANES[lane],
        w,
        h,
        renderW,
        renderH,
        speed,
        lockTriggered: false,
        lockDurationMs: 1500,
        telegraphUntil: type === 'cabinet' ? now + 450 : 0
    });
}

function schedulePatterns(now) {
    const profile = getRoundProfile();
    const roundElapsed = now - roundStart;
    const withinRoundScale = 1 + WITHIN_ROUND_RAMP * Math.min(1, roundElapsed / profile.wallIntervalMs);
    const spawnEvery = 1400 / (withinRoundScale * profile.obstacleBase);
    if (now < nextPatternAt) return;
    nextPatternAt = now + spawnEvery;

    const roll = Math.random();
    if (roll < 0.45) {
        const startLane = Math.floor(Math.random() * (LANES.length - 2));
        enqueueSpawn(now, 0, 'suit', startLane);
        enqueueSpawn(now, 140, 'suit', startLane + 1);
        enqueueSpawn(now, 280, 'suit', startLane + 2);
        return;
    }

    if (roll < 0.78) {
        const lane = Math.floor(Math.random() * LANES.length);
        enqueueSpawn(now, 0, 'warning', lane);
        enqueueSpawn(now, 520, 'cabinet', lane);
        return;
    }

    const lane = Math.floor(Math.random() * LANES.length);
    enqueueSpawn(now, 0, 'bot', lane);
}

function processPendingSpawns(now) {
    if (!pendingSpawns.length) return;
    const ready = [];
    const waiting = [];
    for (const spawn of pendingSpawns) {
        if (spawn.at <= now) ready.push(spawn);
        else waiting.push(spawn);
    }
    pendingSpawns = waiting;

    for (const spawn of ready) {
        if (spawn.kind === 'warning') {
            particles.push({
                x: canvas.width - 18,
                y: LANES[spawn.lane],
                vx: 0,
                vy: 0,
                life: now + 600,
                warning: true
            });
            continue;
        }
        createObstacle(now, spawn.kind, spawn.lane);
    }
}

function spawnMember(now) {
    if (now - lastMemberSpawn < getRoundProfile().memberSpawnMs) return;
    lastMemberSpawn = now;
    const lane = Math.floor(Math.random() * LANES.length);
    const scale = 0.84 + Math.random() * 0.32;
    const renderW = Math.round(18 * scale);
    const renderH = Math.round(26 * scale);
    const w = Math.round(20 * scale);
    const h = Math.round(24 * scale);
    const prideVariant = PRIDE_MEMBER_VARIANTS[Math.floor(Math.random() * PRIDE_MEMBER_VARIANTS.length)];
    members.push({
        x: canvas.width + 20,
        y: LANES[lane],
        lane,
        w,
        h,
        renderW,
        renderH,
        spriteKey: prideVariant.key,
        prideColor: prideVariant.color,
        prideName: prideVariant.colorName,
        prideMeaning: prideVariant.meaning,
        characterName: prideVariant.characterName,
        speed: 2
    });
}

function maybeSpawnWall(now) {
    const profile = getRoundProfile();
    if (wall || now - lastWall < profile.wallIntervalMs) return;
    lastWall = now;
    wall = {
        x: canvas.width + 90,
        y: 40,
        w: 80,
        h: canvas.height - 80,
        speed: 2.3,
        warningUntil: now + WALL_WARNING_MS,
        activeUntil: 0,
        passed: false
    };
    playSfx('barrierWarning');
}

function getSolidarityState(now) {
    if (!gameActive) {
        return { ready: false, reason: 'Run ended (press R)' };
    }
    if (!wall) {
        return { ready: false, reason: 'No barrier to activate against' };
    }
    const profile = getRoundProfile();
    if (chainCount < profile.chainThreshold) {
        return {
            ready: false,
            reason: `Need ${profile.chainThreshold - chainCount} more chain`
        };
    }

    const distanceToWall = wall.x - player.x;
    if (distanceToWall > profile.solidarityRangePx) {
        return { ready: false, reason: 'Too early, wait for barrier' };
    }
    if (distanceToWall < profile.tooLateBufferPx) {
        return { ready: false, reason: 'Too late, barrier passed' };
    }

    return { ready: true, reason: 'Ready' };
}

function canActivateSolidarity(now) {
    return getSolidarityState(now).ready;
}

function activateSolidarity(now) {
    wall.activeUntil = now + getRoundProfile().shieldDurationMs;
    clearCollectedMembers();
    chainCount = 0;
    playSfx('stageAdvance');

    for (let i = 0; i < 24; i++) {
        particles.push({
            x: player.x,
            y: player.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: now + 500 + Math.random() * 500
        });
    }

    updateUI();
}

function attemptSolidarityActivation(now) {
    const solidarityState = getSolidarityState(now);
    if (!solidarityState.ready) {
        setSolidarityFeedback(`SOLIDARITY: ${solidarityState.reason}`);
        updateUI();
        return false;
    }

    activateSolidarity(now);
    setSolidarityFeedback('SOLIDARITY ACTIVATED');
    return true;
}

function collide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y - a.h / 2 < b.y + b.h / 2 && a.y + a.h / 2 > b.y - b.h / 2;
}

function getFollowerHitboxes() {
    const boxes = [];
    // Tighten spacing as chain grows so tail followers keep up and don't lag
    // into obstacles. Chain 1-2: 6 steps; chain 3-5: 5; chain 6-8: 4; chain 9+: 3.
    const trailStep = Math.max(3, 6 - Math.floor(chainCount / 3));
    for (let i = 0; i < chainCount; i++) {
        const idx = Math.max(0, player.trail.length - 1 - i * trailStep);
        const t = player.trail[idx] || { x: player.x - i * 6, y: player.y };
        boxes.push({ x: t.x - 4, y: t.y, w: 8, h: 12 });
    }
    return boxes;
}

function applyTailLoss() {
    if (trimCollectedMembers(1)) {
        playSfx('chainLoss');
        updateUI();
        return true;
    }
    return false;
}

function applyObstacleEffect(obstacle, now) {
    if (obstacle.type === 'cabinet') {
        player.slowUntil = Math.max(player.slowUntil, now + 1700);
        setSolidarityFeedback('HIT: CABINET SLOWDOWN');
        return;
    }
    if (obstacle.type === 'bot') {
        if (now < laneLockCooldownUntil) {
            setLaneLockFeedback('BOT CONTACT DEFLECTED');
            return;
        }
        laneLockedUntil = Math.max(laneLockedUntil, now + 1700);
        laneLockCooldownUntil = now + 1100;
        setLaneLockFeedback('LANE LOCK: BOT CONTACT');
        setSolidarityFeedback('HIT: BOT LANE LOCK');
        return;
    }
    if (obstacle.type === 'suit') {
        if (trimCollectedMembers(1)) {
            setSolidarityFeedback('HIT: SUIT SHREDS EXTRA CHAIN');
        }
    }
}

function update(now) {
    if (!gameActive) return;
    if (narrativePaused) return;
    if (legendPaused) return;
    if (gamePaused) return;

    const elapsed = now - runStart;
    if (elapsed >= RUN_DURATION_MS && !gameWon) {
        gameActive = false;
        gameWon = precedentEstablished >= PRECEDENT_TARGET;
        gameEndedAt = performance.now();
        if (gameWon) playSfx('win');
        else playSfx('gameOver');
        updateUI();
        return;
    }

    schedulePatterns(now);
    processPendingSpawns(now);
    spawnMember(now);
    maybeSpawnWall(now);

    const isSlowed = player.slowUntil > now;

    if (player.targetX !== player.x) {
        const dx = player.targetX - player.x;
        const xStep = isSlowed ? 4 : 8;
        if (Math.abs(dx) <= xStep) {
            player.x = player.targetX;
        } else {
            player.x += Math.sign(dx) * xStep;
        }
    }

    if (player.targetLane !== player.lane) {
        const targetY = LANES[player.targetLane];
        const dy = targetY - player.y;
        const laneStep = isSlowed ? 4 : 6;
        if (Math.abs(dy) < laneStep) {
            player.y = targetY;
            player.lane = player.targetLane;
        } else {
            player.y += Math.sign(dy) * laneStep;
        }
    }

    // Record the runner's current position; follower spacing comes from historical sampling.
    player.trail.push({ x: player.x - 20, y: player.y });
    if (player.trail.length > 60) player.trail.shift();

    obstacles.forEach(o => {
        o.x -= o.speed;
    });
    obstacles = obstacles.filter(o => o.x + o.w > -20);

    members.forEach(m => { m.x -= m.speed; });
    members = members.filter(m => m.x + m.w > -20);

    if (wall) {
        if (now > wall.warningUntil) {
            wall.x -= wall.speed;
        }
        if (wall.x + wall.w < -20) wall = null;
    }

    const playerHitbox = { x: player.x - 8, y: player.y, w: 16, h: 22 };
    const followerHitboxes = getFollowerHitboxes();

    for (const o of obstacles) {
        if (o.telegraphUntil > now) continue;
        if (now < postBarrierInvulnerabilityUntil) continue;

        let consumedByChain = false;
        for (const follower of followerHitboxes) {
            if (collide(follower, o)) {
                consumedByChain = applyTailLoss();
                o.x = -999;
                break;
            }
        }
        if (consumedByChain) continue;

        if (collide(playerHitbox, o)) {
            const chainAbsorbed = applyTailLoss();
            if (!chainAbsorbed) {
                lives -= 1;
                player.hitFlashUntil = now + 200;
                playSfx('lifeLost');
                if (lives <= 0) {
                    gameActive = false;
                    gameEndedAt = performance.now();
                    playSfx('gameOver');
                }
            }
            applyObstacleEffect(o, now);
            o.x = -999;
            updateUI();
            break;
        }
    }

    for (const m of members) {
        if (collide(playerHitbox, m)) {
            addCollectedMember(PRIDE_MEMBER_VARIANTS.find(variant => variant.key === m.spriteKey) || PRIDE_MEMBER_VARIANTS[0]);
            score += 10;
            m.x = -999;
            playSfx('fileCleared');
            updateUI();
        }
    }

    if (wall) {
        const wallHit = playerHitbox.x + playerHitbox.w > wall.x && playerHitbox.x < wall.x + wall.w;
        const shieldActive = wall.activeUntil > now;
        const wallLive = now > wall.warningUntil;
        if (wallHit && wallLive && !shieldActive && now >= postBarrierInvulnerabilityUntil) {
            gameActive = false;
            gameEndedAt = performance.now();
            playSfx('gameOver');
            updateUI();
        }
        if (wallHit && wallLive && shieldActive && !wall.passed) {
            wall.passed = true;
            handleBarrierClear();
            updateUI();
        }
    }

    particles = particles.filter(p => p.life > now);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
    });
}

function drawGrid() {
    const background = getRunnerSprite(getCurrentBackgroundKey()) || getRunnerSprite('background');
    if (background) {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const gridTile = getRunnerSprite('gridTile');
    if (gridTile) {
        ctx.save();
        ctx.globalAlpha = 0.16;
        for (let x = 0; x < canvas.width; x += 52) {
            for (let y = 44; y < canvas.height - 20; y += 52) {
                ctx.drawImage(gridTile, x, y, 16, 16);
            }
        }
        ctx.restore();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (let i = 0; i < LANES.length; i++) {
        const y = LANES[i];
        ctx.strokeStyle = '#0f2a0f';
        ctx.beginPath();
        ctx.moveTo(0, y + 14);
        ctx.lineTo(canvas.width, y + 14);
        ctx.stroke();
    }
}

function draw() {
    drawGrid();

    members.forEach(m => {
        const centerX = m.x + m.w / 2;
        drawRunnerSprite(m.spriteKey, centerX, m.y, () => {
            ctx.fillStyle = m.prideColor;
            ctx.beginPath();
            ctx.arc(centerX, m.y, Math.max(4, Math.floor(m.w * 0.45)), 0, Math.PI * 2);
            ctx.fill();
        }, { w: m.renderW, h: m.renderH });
    });

    obstacles.forEach(o => {
        const spriteKey = o.type === 'suit' ? 'suit' : o.type === 'cabinet' ? 'cabinet' : 'bot';
        if (o.telegraphUntil > performance.now()) {
            const tapeFx = getRunnerSprite('tapeFx');
            if (tapeFx) {
                ctx.drawImage(tapeFx, o.x - 8, o.y - 14, o.w + 16, o.h + 12);
            } else {
                ctx.fillStyle = '#ff9900';
                ctx.fillRect(o.x - 6, o.y - o.h / 2 - 4, o.w + 12, o.h + 8);
            }
        }
        const drawOptions = o.type === 'suit' ? { filter: 'grayscale(1) saturate(0.15) contrast(1.1)' } : null;
        drawRunnerSprite(spriteKey, o.x + o.w / 2, o.y, () => {
            if (o.type === 'suit') ctx.fillStyle = '#6a6a6a';
            if (o.type === 'cabinet') ctx.fillStyle = '#8899aa';
            if (o.type === 'bot') ctx.fillStyle = '#33aaff';
            ctx.fillRect(o.x, o.y - o.h / 2, o.w, o.h);
        }, { w: o.renderW, h: o.renderH }, drawOptions);
    });

    if (wall) {
        const now = performance.now();
        const active = wall.activeUntil > performance.now();
        const warning = now < wall.warningUntil;
        const wallSprite = getRunnerSprite('wall');
        if (wallSprite) {
            ctx.drawImage(wallSprite, wall.x, wall.y, wall.w, wall.h);
            ctx.fillStyle = active ? 'rgba(255,105,180,0.25)' : 'rgba(180,30,30,0.35)';
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        } else {
            ctx.fillStyle = active ? 'rgba(255,105,180,0.4)' : 'rgba(180,30,30,0.85)';
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        }
        if (warning) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Courier New';
            ctx.fillText('BARRIER WARNING', wall.x + 6, wall.y + 22);
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(0, canvas.height - 14, canvas.width, 14);
            ctx.fillStyle = '#ffffff';
            ctx.fillText('ORGANIZE NOW', 8, canvas.height - 3);
        }
        if (active) {
            drawRunnerSprite('shieldFx', wall.x + wall.w / 2, wall.y + wall.h / 2, () => {
                ctx.strokeStyle = '#ff99cc';
                ctx.strokeRect(wall.x + 4, wall.y + 4, wall.w - 8, wall.h - 8);
            });
        }
    }

    const trailStep = Math.max(3, 6 - Math.floor(chainCount / 3));
    for (let i = 0; i < chainCount; i++) {
        const idx = Math.max(0, player.trail.length - 1 - i * trailStep);
        const t = player.trail[idx] || { x: player.x - i * 6, y: player.y };
        const followerMember = getCollectedMemberForFollower(i);
        drawRunnerSprite(followerMember.key, t.x, t.y, () => {
            ctx.fillStyle = followerMember.color;
            ctx.fillRect(t.x, t.y - 6, 8, 12);
        }, { w: 14, h: 20 });
    }

    if (performance.now() < postBarrierInvulnerabilityUntil) {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#88ffcc';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawRunnerSprite('player', player.x, player.y, () => {
        ctx.fillStyle = player.hitFlashUntil > performance.now() ? '#ff4444' : '#d9c38a';
        ctx.fillRect(player.x - 8, player.y - 11, 16, 22);
    });

    particles.forEach(p => {
        if (p.rainbow) {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            return;
        }
        if (p.warning) {
            drawRunnerSprite('tapeFx', p.x, p.y, () => {
                ctx.fillStyle = '#ff9900';
                ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            });
            return;
        }

        drawRunnerSprite('heartFx', p.x, p.y, () => {
            ctx.fillStyle = '#ff99cc';
            ctx.fillRect(p.x, p.y, 3, 3);
        });
    });

    if (phaseFlashUntil > 0) {
        const flashRemaining = phaseFlashUntil - performance.now();
        if (flashRemaining > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${((flashRemaining / 600) * 0.88).toFixed(3)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            phaseFlashUntil = 0;
        }
    }

    ctx.fillStyle = '#00ff00';
    ctx.font = '12px Courier New';
    const solidarityState = getSolidarityState(performance.now());
    const threshold = getCurrentThreshold();
    const solidarityLine = solidarityState.ready
        ? `SOLIDARITY: READY (SPACE) [THRESHOLD ${threshold}]`
        : `SOLIDARITY: ${solidarityState.reason}`;
    ctx.fillText(`CHAIN: ${chainCount}`, 10, 18);
    ctx.fillText(`PRECEDENT: ${precedentEstablished}/${PRECEDENT_TARGET}`, 10, 34);
    ctx.fillText(`SCORE: ${score}`, 10, 50);
    ctx.fillText(solidarityLine, 10, 66);
    if (laneLockedUntil > performance.now() && gameActive) {
        ctx.fillStyle = '#ff9900';
        ctx.fillText('LANE LOCKED', canvas.width - 106, 18);
    }
    if (laneLockFeedbackUntil > performance.now()) {
        ctx.fillStyle = '#ffd27d';
        ctx.fillText(laneLockFeedbackText, canvas.width - 240, 34);
    }
    if (solidarityFeedbackUntil > performance.now()) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff176';
        ctx.fillText(solidarityFeedbackText, canvas.width / 2, 64);
        ctx.restore();
    }
    if (courtroomFinaleActive && gameActive && !gameWon) {
        ctx.fillStyle = '#ff4444';
        ctx.fillText('COURTROOM FINALE: WASHINGTON DC', canvas.width / 2 - 126, 18);
    }
    if (gamePaused) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00ff00';
        ctx.font = '22px Courier New';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '12px Courier New';
        ctx.fillText('Press Escape to resume', canvas.width / 2, canvas.height / 2 + 16);
        ctx.restore();
    }

    if (!gameActive) {
        ctx.save();
        ctx.textAlign = 'center';
        if (gameWon) {
            ctx.fillStyle = '#00ff00';
            ctx.font = '11px Courier New';
            const isTouchUi = document.body && document.body.classList.contains('touch-ui');
            ctx.fillText(isTouchUi ? 'Tap to restart' : 'Press R or Enter to restart', canvas.width / 2, canvas.height - 10);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.fillRect(canvas.width / 2 - 230, canvas.height / 2 - 46, 460, 126);
            ctx.fillStyle = '#00ff00';
            ctx.font = '20px Courier New';
            ctx.fillText('You Lose', canvas.width / 2, canvas.height / 2 - 28);
            ctx.font = '14px Courier New';
            ctx.fillText('The real fight took eleven years.', canvas.width / 2, canvas.height / 2 - 2);
            ctx.fillText("You've got another few minutes.", canvas.width / 2, canvas.height / 2 + 18);
            ctx.font = '12px Courier New';
            ctx.fillText('Press R to try again.', canvas.width / 2, canvas.height / 2 + 42);
            ctx.font = '11px Courier New';
            ctx.fillStyle = '#aaffaa';
            ctx.fillText(`Allies gathered: ${totalAlliesGathered}  ·  Attempt: ${currentAttemptNumber}`, canvas.width / 2, canvas.height / 2 + 62);
        }
        ctx.restore();
    }

    if (debugOverlayEnabled) {
        drawDebugOverlay();
    }
}

function drawDebugOverlay() {
    const now = performance.now();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(canvas.width - 250, 6, 244, 230);
    ctx.strokeStyle = '#55ff55';
    ctx.strokeRect(canvas.width - 250, 6, 244, 230);

    ctx.fillStyle = '#a7ffa7';
    ctx.font = '11px Courier New';
    ctx.fillText('DEBUG (F2)', canvas.width - 236, 22);
    ctx.fillText(`difficulty: ${activeDifficulty}`, canvas.width - 236, 38);
    ctx.fillText(`active: ${gameActive}  paused: ${narrativePaused}`, canvas.width - 236, 52);
    ctx.fillText(`lane: ${player.lane}/${player.targetLane}`, canvas.width - 236, 66);
    ctx.fillText(`chain: ${chainCount}/${getCurrentThreshold()}`, canvas.width - 236, 80);
    ctx.fillText(`obstacles: ${obstacles.length}`, canvas.width - 236, 94);
    ctx.fillText(`members: ${members.length}`, canvas.width - 236, 108);
    const wallDx = wall ? Math.round(wall.x - player.x) : -1;
    ctx.fillText(`wall dx: ${wallDx}`, canvas.width - 236, 122);
    const profile = getRoundProfile();
    ctx.fillText(`wallMs: ${profile.wallIntervalMs}  spawnBase: ${profile.obstacleBase.toFixed(2)}`, canvas.width - 236, 136);
    ctx.fillStyle = '#55ff55';
    ctx.fillText('── debug shortcuts ──', canvas.width - 236, 158);
    ctx.fillStyle = '#a7ffa7';
    ctx.fillText('Alt+1..5  narrative cards', canvas.width - 236, 174);
    ctx.fillText('Alt+0     you-lose screen', canvas.width - 236, 188);
    ctx.fillText('Escape    pause / unpause', canvas.width - 236, 202);
    ctx.fillText('F2        toggle this overlay', canvas.width - 236, 216);
}

function loop(now) {
    update(now);
    draw();
    requestAnimationFrame(loop);
}

function tryMoveLane(direction) {
    const now = performance.now();
    if (now <= player.laneCooldownUntil || now <= laneLockedUntil || !gameActive) return;
    player.targetLane = Math.max(0, Math.min(LANES.length - 1, player.targetLane + direction));
    player.laneCooldownUntil = now + 100;
}

function clampPlayerX(value) {
    return Math.max(PLAYER_MIN_X, Math.min(PLAYER_MAX_X, value));
}

function tryMoveHorizontal(direction) {
    const now = performance.now();
    if (now <= player.horizontalCooldownUntil || !gameActive) return;
    const step = now < player.slowUntil ? 18 : 30;
    player.targetX = clampPlayerX(player.targetX + direction * step);
    player.horizontalCooldownUntil = now + 80;
}

function triggerDash() {
    tryMoveHorizontal(1);
}

function triggerSlow() {
    tryMoveHorizontal(-1);
}

function handleRunnerKeydown(e) {
    if (window.sfx) window.sfx.init();

    const key = e.key;
    const code = e.code;

    if (narrativePaused) {
        if (key === 'Enter') {
            e.preventDefault();
            advanceNarrative();
        }
        return;
    }

    if (key === 'r' || key === 'R') {
        e.preventDefault();
        resetGame();
        return;
    }

    if (key === 'm' || key === 'M') {
        e.preventDefault();
        if (window.sfx) window.sfx.toggleMute();
        return;
    }

    if (key === 'F2') {
        e.preventDefault();
        debugOverlayEnabled = !debugOverlayEnabled;
        return;
    }

    if (key === 'Escape') {
        e.preventDefault();
        if (!gameActive || narrativePaused || legendPaused) return;
        const now = performance.now();
        if (gamePaused) {
            applyPauseCompensation(Math.max(0, now - gamePauseStartedAt));
            gamePauseStartedAt = 0;
            gamePaused = false;
        } else {
            gamePaused = true;
            gamePauseStartedAt = now;
        }
        updateUI();
        return;
    }

    // Debug scene shortcuts — Alt+1..5 = force-show narrative cards, Alt+0 = you-lose
    if (e.altKey) {
        const debugNarrativeMap = {
            '1': 'intro',
            '2': 'phase1Clear',
            '3': 'phase2Clear',
            '4': 'phase3Clear',
            '5': 'phase4Victory'
        };
        if (debugNarrativeMap[key]) {
            e.preventDefault();
            debugForceNarrative(debugNarrativeMap[key]);
            return;
        }
        if (key === '0') {
            e.preventDefault();
            gameActive = false;
            gameWon = false;
            gameEndedAt = performance.now();
            updateUI();
            return;
        }
    }

    if (!gameActive) {
        // Only restart on explicit confirm keys (Enter) or movement keys.
        // Space is excluded — it fires solidarity and should not accidentally restart.
        if (
            key === 'Enter' ||
            key === 'ArrowDown' ||
            key === 'ArrowLeft' ||
            key === 'ArrowRight' ||
            key === 'ArrowUp' ||
            key === 'd' ||
            key === 'D'
        ) {
            e.preventDefault();
            resetGame();
        }
        return;
    }

    if (key === 'ArrowLeft') {
        e.preventDefault();
        triggerSlow();
        return;
    }

    if (key === 'a' || key === 'A') {
        e.preventDefault();
        triggerSlow();
        return;
    }

    if (key === 'ArrowUp') {
        e.preventDefault();
        tryMoveLane(-1);
        return;
    }

    if (key === 'ArrowRight') {
        e.preventDefault();
        triggerDash();
        return;
    }

    if (key === 'ArrowDown') {
        e.preventDefault();
        tryMoveLane(1);
        return;
    }

    if (key === 'd' || key === 'D') {
        e.preventDefault();
        triggerDash();
        return;
    }

    if (key === ' ' || code === 'Space') {
        e.preventDefault();
        attemptSolidarityActivation(performance.now());
    }
}

window.addEventListener('keydown', handleRunnerKeydown);
document.addEventListener('keydown', handleRunnerKeydown);
document.onkeydown = handleRunnerKeydown;

if (runnerNarrativeNextButton) {
    runnerNarrativeNextButton.addEventListener('pointerdown', handleNarrativeContinue);
    runnerNarrativeNextButton.addEventListener('click', handleNarrativeContinue);
    runnerNarrativeNextButton.addEventListener('touchstart', handleNarrativeContinue, { passive: false });
    runnerNarrativeNextButton.onclick = handleNarrativeContinue;
}

if (runnerNarrativePanel) {
    runnerNarrativePanel.addEventListener('click', e => {
        if (!narrativePaused) return;
        const target = e.target;
        if (target && target.id === 'runner-narrative-next') {
            handleNarrativeContinue(e);
        }
    });
}

if (runnerLegend) {
    runnerLegend.addEventListener('click', e => {
        const card = e.target.closest('.legend-card');
        if (!card) {
            collapseLegendCards();
            return;
        }
        e.preventDefault();
        toggleLegendCard(card.dataset.cardId || '');
    });
}

document.addEventListener('pointerdown', e => {
    if (!legendExpandedCardId || !runnerLegend) return;
    if (runnerLegend.contains(e.target)) return;
    if (runnerLegendSheet && runnerLegendSheet.contains(e.target)) return;
    collapseLegendCards();
});

if (runnerLegendSheetBackdrop) {
    runnerLegendSheetBackdrop.addEventListener('click', () => {
        collapseLegendCards();
    });
}

if (runnerLegendSheetClose) {
    runnerLegendSheetClose.addEventListener('click', () => {
        collapseLegendCards();
    });
}

window.addEventListener('resize', () => {
    if (!legendExpandedCardId) return;
    if (isMobileLegendSheetMode()) {
        const item = runnerLegendItems.find(entry => entry.id === legendExpandedCardId);
        updateLegendSheet(item || null);
        setLegendSheetOpen(Boolean(item));
    } else {
        setLegendSheetOpen(false);
    }
});

window.runnerControls = {
    slow: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveHorizontal(-1);
    },
    left: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveHorizontal(-1);
    },
    right: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveHorizontal(1);
    },
    up: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveLane(-1);
    },
    down: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveLane(1);
    },
    laneUp: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveLane(-1);
    },
    laneDown: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveLane(1);
    },
    dash: () => {
        if (!gameActive) {
            resetGame();
            return;
        }
        tryMoveHorizontal(1);
    },
    solidarity: () => {
        // Space/solidarity intentionally does NOT restart — use Enter, R, or the
        // Restart button so players aren't accidentally bounced past the fail screen.
        if (!gameActive) return;
        attemptSolidarityActivation(performance.now());
    },
    restart: () => {
        resetGame();
    }
};

if (canvas) {
    canvas.tabIndex = 0;
    canvas.addEventListener('pointerdown', () => {
        canvas.focus();
    });
}

if (gameContainer) {
    gameContainer.style.touchAction = 'none';
    gameContainer.addEventListener('pointerdown', handleTouchGestureStart, { passive: false });
    gameContainer.addEventListener('pointermove', handleTouchGestureMove, { passive: false });
    gameContainer.addEventListener('pointerup', handleTouchGestureEnd, { passive: false });
    gameContainer.addEventListener('pointercancel', handleTouchGestureCancel, { passive: false });
    gameContainer.addEventListener('touchmove', e => {
        if (activeTouchGesture && !narrativePaused && !legendPaused && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
    }, { passive: false });
}

if (document.body) {
    document.body.tabIndex = -1;
    window.addEventListener('load', () => {
        if (canvas) canvas.focus();
    });
}

loadRunnerSprites();
renderRunnerLegend();
resetGame();
requestAnimationFrame(loop);
