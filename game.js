const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tower types
const TOWER_TYPES = {
    CODER: { id: 1, cost: 50, key: '1', name: 'Coder (Logic)', hint: 'Boolean Bits • Slows' },
    ATTORNEY: { id: 2, cost: 75, key: '2', name: 'Attorney (Litigation)', hint: 'Precedents • Heavy damage' },
    ACTIVIST: { id: 3, cost: 60, key: '3', name: 'Activist (Community)', hint: 'Heals Burden' },
    ENCRYPTION: { id: 4, cost: 80, key: '4', name: 'Encryption Expert', hint: 'Firewall • Protects towers' }
};

// Stage config: { year, title, duration, monochrome, spawnMultiplier, auditorSpeedMultiplier, canSubpoena }
const STAGES = [
    { year: 1984, title: 'The Investigation Begins', duration: 60000, monochrome: false, spawnMult: 1, speedMult: 1, canSubpoena: false },
    { year: 1987, title: 'District Court Victory', duration: 60000, monochrome: false, spawnMult: 0.8, speedMult: 0.9, canSubpoena: false },
    { year: 1990, title: '9th Circuit Reversal', duration: 60000, monochrome: true, spawnMult: 1.3, speedMult: 1.5, canSubpoena: true },
    { year: 1995, title: 'The Executive Order', duration: 60000, monochrome: true, spawnMult: 1.5, speedMult: 1.8, canSubpoena: true }
];

// Game State
let precedent = 100;
let lives = 3;
let gameActive = true;
let gameWon = false;
let selectedTowerType = TOWER_TYPES.CODER;
let currentStageIndex = 0;
let stageStartTime = 0;
let stageBannerText = '';
let stageBannerUntil = 0;

let bestYear = null;
let bestStages = null;
let highScoreUpdated = false;
const HIGH_SCORE_KEY = 'classRamificationsHighScore';

const lanes = [50, 150, 250, 350];
let caseFiles = [];
let auditors = [];
let towers = [];
let projectiles = [];

function getCurrentStage() { return STAGES[currentStageIndex]; }
function isMonochrome() { return getCurrentStage().monochrome; }

function sfx(name) {
    if (window.sfx && typeof window.sfx[name] === 'function') window.sfx[name]();
}

function loadHighScore() {
    try {
        const raw = localStorage.getItem(HIGH_SCORE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        bestYear = data.bestYear ?? null;
        bestStages = data.bestStages ?? null;
    } catch (_) {
        bestYear = null;
        bestStages = null;
    }
}

function saveHighScore(year, stages) {
    try {
        const payload = { bestYear: year, bestStages: stages };
        localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(payload));
    } catch (_) {
        // ignore
    }
}

function updateHighScore() {
    const stage = getCurrentStage();
    const year = stage.year;
    const stagesCompleted = gameWon ? STAGES.length : currentStageIndex;

    if (bestYear == null ||
        year > bestYear ||
        (year === bestYear && (bestStages == null || stagesCompleted > bestStages))) {
        bestYear = year;
        bestStages = stagesCompleted;
        saveHighScore(bestYear, bestStages);
    }
}

// Hitbox helpers
function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function isTowerProtected(tower) {
    return towers.some(enc => enc instanceof EncryptionTower && enc !== tower && dist(enc, tower) <= enc.range);
}

// --- Case File ---
class CaseFile {
    constructor(laneIndex) {
        this.x = 0;
        this.y = lanes[laneIndex];
        this.laneIndex = laneIndex;
        this.speed = 1 + Math.random();
        this.burden = 0;
        this.cleared = false;
        this.w = 30;
        this.h = 20;
    }

    get hitbox() { return { x: this.x, y: this.y - 15, w: this.w, h: this.h }; }

    update() {
        this.x += this.speed;
        if (this.x > canvas.width) this.cleared = true;
    }

    draw() {
        ctx.fillStyle = this.cleared ? '#ff00ff' : '#d4af37';
        ctx.fillRect(this.x, this.y - 15, this.w, this.h);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 25, (this.burden / 100) * this.w, 5);
    }
}

// --- Auditor ---
class Auditor {
    constructor(laneIndex, canSubpoena = false) {
        this.x = canvas.width + 20;
        this.y = lanes[laneIndex];
        this.laneIndex = laneIndex;
        this.baseSpeed = 1.5 + Math.random() * 0.5;
        this.speed = this.baseSpeed;
        this.slowUntil = 0;
        this.w = 24;
        this.h = 20;
        this.health = 30;
        this.canSubpoena = canSubpoena;
        this.subpoenaCooldown = 0;
    }

    get hitbox() { return { x: this.x, y: this.y - 10, w: this.w, h: this.h }; }

    update(now) {
        const stage = getCurrentStage();
        const slowMult = now < this.slowUntil ? 0.5 : 1;
        this.speed = this.baseSpeed * stage.speedMult * slowMult;
        this.x -= this.speed;

        // Subpoena logic
        if (this.canSubpoena && stage.canSubpoena && now > this.subpoenaCooldown) {
            for (const t of towers) {
                if (t.disabledUntil > now) continue;
                if (isTowerProtected(t)) continue;
                if (dist(this, t) < 80) {
                    t.disabledUntil = now + 4000;
                    this.subpoenaCooldown = now + 8000;
                    break;
                }
            }
        }
    }

    draw() {
        ctx.fillStyle = isMonochrome() ? '#555' : '#333';
        ctx.fillRect(this.x, this.y - 10, this.w, this.h);
        ctx.strokeStyle = '#00ff00';
        ctx.strokeRect(this.x, this.y - 10, this.w, this.h);
    }
}

// --- Logic Tower (Coder) ---
class LogicTower {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.range = 120;
        this.fireRate = 800;
        this.lastShot = 0;
        this.w = 32; this.h = 32;
        this.disabledUntil = 0;
    }

    get hitbox() { return { x: this.x - 16, y: this.y - 16, w: this.w, h: this.h }; }

    findNearestAuditor() {
        let nearest = null, minD = Infinity;
        for (const a of auditors) {
            const d = dist(this, a);
            if (d <= this.range && d < minD) { minD = d; nearest = a; }
        }
        return nearest;
    }

    update(now) {
        if (now < this.disabledUntil) return;
        if (now - this.lastShot < this.fireRate) return;
        const target = this.findNearestAuditor();
        if (target) {
            this.lastShot = now;
            projectiles.push(new BooleanBit(this.x, this.y, target));
        }
    }

    draw() {
        const disabled = Date.now() < this.disabledUntil;
        ctx.fillStyle = disabled ? '#333' : '#00aaff';
        ctx.fillRect(this.x - 16, this.y - 16, this.w, this.h);
        ctx.strokeStyle = disabled ? '#555' : '#00ffff';
        ctx.strokeRect(this.x - 16, this.y - 16, this.w, this.h);
        if (!disabled) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// --- Attorney Tower ---
class AttorneyTower {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.range = 100;
        this.fireRate = 1200;
        this.lastShot = 0;
        this.w = 32; this.h = 32;
        this.disabledUntil = 0;
    }

    get hitbox() { return { x: this.x - 16, y: this.y - 16, w: this.w, h: this.h }; }

    findNearestAuditor() {
        let nearest = null, minD = Infinity;
        for (const a of auditors) {
            const d = dist(this, a);
            if (d <= this.range && d < minD) { minD = d; nearest = a; }
        }
        return nearest;
    }

    update(now) {
        if (now < this.disabledUntil) return;
        if (now - this.lastShot < this.fireRate) return;
        const target = this.findNearestAuditor();
        if (target) {
            this.lastShot = now;
            projectiles.push(new Precedent(this.x, this.y, target));
        }
    }

    draw() {
        const disabled = Date.now() < this.disabledUntil;
        ctx.fillStyle = disabled ? '#333' : '#d4af37';
        ctx.fillRect(this.x - 16, this.y - 16, this.w, this.h);
        ctx.strokeStyle = disabled ? '#555' : '#ffaa00';
        ctx.strokeRect(this.x - 16, this.y - 16, this.w, this.h);
        if (!disabled) {
            ctx.strokeStyle = 'rgba(255, 170, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// --- Activist Tower ---
class ActivistTower {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.range = 90;
        this.healRate = 4;
        this.lastHeal = 0;
        this.w = 32; this.h = 32;
        this.disabledUntil = 0;
    }

    get hitbox() { return { x: this.x - 16, y: this.y - 16, w: this.w, h: this.h }; }

    update(now) {
        if (now < this.disabledUntil) return;
        if (now - this.lastHeal < 200) return;
        this.lastHeal = now;
        for (const file of caseFiles) {
            if (file.cleared) continue;
            if (dist(this, file) <= this.range) {
                file.burden = Math.max(0, file.burden - this.healRate);
            }
        }
    }

    draw() {
        const disabled = Date.now() < this.disabledUntil;
        ctx.fillStyle = disabled ? '#333' : '#ff69b4';
        ctx.fillRect(this.x - 16, this.y - 16, this.w, this.h);
        ctx.strokeStyle = disabled ? '#555' : '#ff1493';
        ctx.strokeRect(this.x - 16, this.y - 16, this.w, this.h);
        if (!disabled) {
            ctx.strokeStyle = 'rgba(255, 105, 180, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// --- Encryption Expert Tower ---
class EncryptionTower {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.range = 100;
        this.w = 32; this.h = 32;
        this.disabledUntil = 0;
    }

    get hitbox() { return { x: this.x - 16, y: this.y - 16, w: this.w, h: this.h }; }

    update() {}

    draw() {
        const disabled = Date.now() < this.disabledUntil;
        ctx.fillStyle = disabled ? '#333' : '#9370db';
        ctx.fillRect(this.x - 16, this.y - 16, this.w, this.h);
        ctx.strokeStyle = disabled ? '#555' : '#8a2be2';
        ctx.strokeRect(this.x - 16, this.y - 16, this.w, this.h);
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// --- Boolean Bit (projectile, applies slow) ---
class BooleanBit {
    constructor(x, y, target) {
        this.x = x; this.y = y;
        this.target = target;
        this.speed = 6;
        this.damage = 10 * (isMonochrome() ? 1 : 2);
        this.w = 6; this.h = 6;
    }

    update() {
        const dx = this.target.x - this.x, dy = this.target.y - this.y;
        const d = Math.hypot(dx, dy) || 1;
        this.x += (dx / d) * this.speed;
        this.y += (dy / d) * this.speed;
    }

    onHit() {
        this.target.slowUntil = Date.now() + 2000;
    }

    draw() {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - 3, this.y - 3, this.w, this.h);
    }
}

// --- Precedent (projectile, heavy damage) ---
class Precedent {
    constructor(x, y, target) {
        this.x = x; this.y = y;
        this.target = target;
        this.speed = 5;
        this.damage = 25 * (isMonochrome() ? 1 : 2);
        this.w = 8; this.h = 8;
    }

    update() {
        const dx = this.target.x - this.x, dy = this.target.y - this.y;
        const d = Math.hypot(dx, dy) || 1;
        this.x += (dx / d) * this.speed;
        this.y += (dy / d) * this.speed;
    }

    onHit() {}

    draw() {
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(this.x - 4, this.y - 4, this.w, this.h);
    }
}

// --- Spawn Logic ---
let lastCaseSpawn = 0;
let lastAuditorSpawn = 0;

function spawnCaseFile(now) {
    const stage = getCurrentStage();
    const interval = 2000 / stage.spawnMult;
    if (now - lastCaseSpawn < interval) return;
    lastCaseSpawn = now;
    caseFiles.push(new CaseFile(Math.floor(Math.random() * 4)));
}

function spawnAuditor(now) {
    const stage = getCurrentStage();
    const interval = 3000 / stage.spawnMult;
    if (now - lastAuditorSpawn < interval) return;
    lastAuditorSpawn = now;
    auditors.push(new Auditor(Math.floor(Math.random() * 4), stage.canSubpoena));
}

// --- Collision: Auditor vs Case File (Burden) ---
function checkAuditorCaseCollisions() {
    for (const auditor of auditors) {
        const ah = auditor.hitbox;
        for (const file of caseFiles) {
            if (file.cleared) continue;
            if (rectsOverlap(ah, file.hitbox)) {
                file.burden += 3;
                if (file.burden >= 100) {
                    file.burden = 100;
                    file.cleared = true;
                    lives--;
                    document.getElementById('lives-val').innerText = lives;
                    sfx('fileDenied');
                    if (lives <= 0) {
                        gameActive = false;
                        sfx('gameOver');
                    }
                }
            }
        }
    }
}

// --- Stage Management ---
function updateStage(now) {
    const stage = getCurrentStage();
    const elapsed = now - stageStartTime;
    if (elapsed >= stage.duration) {
        if (currentStageIndex === STAGES.length - 1) {
            gameWon = true;
            gameActive = false;
            sfx('win');
            return;
        }
        currentStageIndex++;
        stageStartTime = now;
        const next = getCurrentStage();
        document.getElementById('status-val').innerText = next.title.toUpperCase();
        document.getElementById('year-val').innerText = next.year;
        document.getElementById('status-val').style.color = next.monochrome ? 'red' : '#00ff00';
        stageBannerText = `${next.year} – ${next.title}`;
        stageBannerUntil = now + 2000;
        sfx('stageAdvance');
    }
}

function updateUI() {
    const stage = getCurrentStage();
    document.getElementById('status-val').innerText = stage.title.toUpperCase();
    document.getElementById('year-val').innerText = stage.year;
    document.getElementById('status-val').style.color = stage.monochrome ? 'red' : '#00ff00';
    document.getElementById('tower-hint').innerText = `${selectedTowerType.name} (${selectedTowerType.cost}) • ${selectedTowerType.hint}`;
}

// --- Main Game Loop ---
function gameLoop(now = 0) {
    if (!gameActive) {
        drawEndScreen();
        return;
    }

    updateStage(now);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (now < stageBannerUntil && stageBannerText) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '20px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(stageBannerText.toUpperCase(), canvas.width / 2, 30);
    }

    ctx.strokeStyle = isMonochrome() ? '#333' : '#004400';
    ctx.lineWidth = 2;
    lanes.forEach(y => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    });

    spawnCaseFile(now);
    spawnAuditor(now);

    auditors.forEach(a => a.update(now));
    auditors.forEach(a => a.draw());

    checkAuditorCaseCollisions();

    caseFiles = caseFiles.filter(file => {
        file.update();
        if (file.cleared) {
            if (file.x > canvas.width) {
                precedent += 20;
                sfx('fileCleared');
            }
            document.getElementById('precedent-val').innerText = precedent;
            return false;
        }
        file.draw();
        return true;
    });

    towers.forEach(t => t.update(now));
    towers.forEach(t => t.draw());

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.update();
        p.draw();
        if (dist(p, p.target) < 15) {
            if (p.onHit) p.onHit();
            p.target.health -= p.damage;
            sfx('auditorHit');
            if (p.target.health <= 0) {
                auditors = auditors.filter(a => a !== p.target);
                precedent += 15;
                document.getElementById('precedent-val').innerText = precedent;
                sfx('auditorKilled');
            }
            projectiles.splice(i, 1);
        } else if (p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
            projectiles.splice(i, 1);
        }
    }

    auditors = auditors.filter(a => a.x > -50);

    requestAnimationFrame(gameLoop);
}

function drawEndScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!highScoreUpdated) {
        updateHighScore();
        highScoreUpdated = true;
    }

    ctx.fillStyle = gameWon ? '#00ff00' : 'red';
    ctx.font = '36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(gameWon ? 'CLEARED! Executive Order 12968' : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Courier New';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(gameWon ? 'Security clearances no longer denied for sexual orientation.' : 'Press R to Retry', canvas.width / 2, canvas.height / 2 + 20);
    if (bestYear != null) {
        ctx.font = '18px Courier New';
        ctx.fillStyle = '#00ff00';
        const stagesLabel = bestStages != null ? bestStages : 0;
        ctx.fillText(`Best run: ${bestYear} (stages: ${stagesLabel})`, canvas.width / 2, canvas.height / 2 + 50);
    }
}

function placeTower(x, y) {
    const cost = selectedTowerType.cost;
    if (precedent < cost) return;

    const newBox = { x: x - 16, y: y - 16, w: 32, h: 32 };
    if (towers.some(t => rectsOverlap(newBox, t.hitbox))) return;

    precedent -= cost;
    document.getElementById('precedent-val').innerText = precedent;
    sfx('placeTower');

    switch (selectedTowerType.id) {
        case 1: towers.push(new LogicTower(x, y)); break;
        case 2: towers.push(new AttorneyTower(x, y)); break;
        case 3: towers.push(new ActivistTower(x, y)); break;
        case 4: towers.push(new EncryptionTower(x, y)); break;
    }
}

// --- Tower Placement ---
canvas.addEventListener('click', (e) => {
    if (window.sfx) window.sfx.init();
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    placeTower(x, y);
});

// --- Tower Select (keys 1-4) ---
document.addEventListener('keydown', (e) => {
    if (window.sfx) window.sfx.init();
    if (e.key === '1') selectedTowerType = TOWER_TYPES.CODER;
    else if (e.key === '2') selectedTowerType = TOWER_TYPES.ATTORNEY;
    else if (e.key === '3') selectedTowerType = TOWER_TYPES.ACTIVIST;
    else if (e.key === '4') selectedTowerType = TOWER_TYPES.ENCRYPTION;
    else if (e.key === 'm' || e.key === 'M') {
        if (window.sfx && typeof window.sfx.toggleMute === 'function') {
            window.sfx.toggleMute();
        }
    }
    else if (e.key === 'r' || e.key === 'R') {
        if (!gameActive) resetGame();
    }
    updateUI();
});

// --- Reset ---
function resetGame() {
    precedent = 100;
    lives = 3;
    gameActive = true;
    gameWon = false;
    currentStageIndex = 0;
    stageStartTime = performance.now();
    caseFiles = [];
    auditors = [];
    towers = [];
    projectiles = [];
    lastCaseSpawn = 0;
    lastAuditorSpawn = 0;
    document.getElementById('precedent-val').innerText = precedent;
    document.getElementById('lives-val').innerText = lives;
    updateUI();
    requestAnimationFrame(gameLoop);
}

// Start
loadHighScore();
updateUI();
stageStartTime = performance.now();
gameLoop(stageStartTime);
