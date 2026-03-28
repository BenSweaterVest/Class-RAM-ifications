/**
 * Procedural SFX via Web Audio API. No asset files; 8-bit style beeps.
 * Context starts on first user gesture (click/key).
 *
 * Also exposes a simple BGM hook (file-based, no default track).
 */
(function () {
    let ctx = null;
    let muted = false;
    let bgmAudio = null;
    let bgmArmed = false;
    let barrierWarnGen = 0;

    function getContext() {
        if (ctx) return ctx;
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        ctx = new C();
        return ctx;
    }

    function beep(freq, duration, type, volume = 0.15) {
        if (muted) return;
        const ac = getContext();
        if (!ac) return;
        const now = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);
        osc.type = type || 'square';
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    }

    function stopBgm() {
        if (bgmAudio) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
            bgmAudio = null;
        }
    }

    function resolvePlayableTrack(source) {
        if (!source) return null;
        if (typeof source === 'string') return source;
        if (!Array.isArray(source)) return null;

        const probe = document.createElement('audio');
        for (const candidate of source) {
            if (!candidate || typeof candidate !== 'string') continue;
            const ext = candidate.split('.').pop()?.toLowerCase() || '';
            let mime = '';
            if (ext === 'ogg' || ext === 'oga') mime = 'audio/ogg';
            else if (ext === 'mp3') mime = 'audio/mpeg';
            else if (ext === 'm4a' || ext === 'aac') mime = 'audio/mp4';
            else if (ext === 'wav') mime = 'audio/wav';
            else if (ext === 'opus') mime = 'audio/ogg; codecs=opus';

            if (!mime || probe.canPlayType(mime) !== '') return candidate;
        }
        return source.find(s => typeof s === 'string') || null;
    }

    function playBgmIfAllowed() {
        if (!bgmAudio || muted) return;
        bgmAudio.play().catch(() => {});
    }

    function randomizeBgmStart(audio) {
        if (!audio || audio.dataset.randomizedStart === 'true') return;
        const duration = Number(audio.duration);
        if (!Number.isFinite(duration) || duration <= 1) return;

        const maxStart = Math.max(0, duration - 0.5);
        audio.currentTime = Math.random() * maxStart;
        audio.dataset.randomizedStart = 'true';
    }

    function armBgmAutoplay() {
        if (bgmArmed) return;
        bgmArmed = true;

        const start = () => {
            playBgmIfAllowed();
            window.removeEventListener('pointerdown', start, true);
            window.removeEventListener('touchstart', start, true);
            window.removeEventListener('keydown', start, true);
            bgmArmed = false;
        };

        window.addEventListener('pointerdown', start, true);
        window.addEventListener('touchstart', start, true);
        window.addEventListener('keydown', start, true);
    }

    window.sfx = {
        init() {
            const ac = getContext();
            if (ac && ac.state === 'suspended') ac.resume();
        },
        isMuted() {
            return muted;
        },
        toggleMute() {
            muted = !muted;
            if (bgmAudio) {
                if (muted) bgmAudio.pause();
                else playBgmIfAllowed();
            }
        },
        placeTower() {
            beep(440, 0.08, 'square', 0.12);
        },
        fileCleared() {
            beep(880, 0.06, 'square', 0.1);
        },
        fileDenied() {
            beep(220, 0.15, 'sawtooth', 0.12);
        },
        auditorHit() {
            beep(330, 0.04, 'square', 0.08);
        },
        auditorKilled() {
            beep(660, 0.1, 'square', 0.1);
        },
        gameOver() {
            beep(200, 0.3, 'sawtooth', 0.15);
        },
        win() {
            beep(523, 0.1, 'square', 0.12);
            setTimeout(() => beep(659, 0.1, 'square', 0.12), 100);
            setTimeout(() => beep(784, 0.15, 'square', 0.12), 200);
        },
        stageAdvance() {
            beep(700, 0.06, 'square', 0.12);
        },
        narrativeNeutral() {
            beep(700, 0.14, 'square', 0.20);
            setTimeout(() => beep(600, 0.16, 'square', 0.16), 140);
        },
        narrativeHopeful() {
            beep(494, 0.12, 'triangle', 0.19);
            setTimeout(() => beep(554, 0.15, 'triangle', 0.19), 110);
        },
        narrativeHappy() {
            beep(523, 0.10, 'square', 0.20);
            setTimeout(() => beep(659, 0.12, 'square', 0.20), 100);
            setTimeout(() => beep(784, 0.16, 'square', 0.20), 200);
        },
        narrativeSomber() {
            beep(262, 0.28, 'sine', 0.20);
            setTimeout(() => beep(220, 0.34, 'sine', 0.18), 200);
        },
        narrativeVictory() {
            beep(523, 0.10, 'square', 0.20);
            setTimeout(() => beep(659, 0.12, 'square', 0.20), 100);
            setTimeout(() => beep(784, 0.14, 'square', 0.20), 200);
            setTimeout(() => beep(1046, 0.26, 'triangle', 0.22), 310);
        },
        chainLoss() {
            beep(280, 0.06, 'square', 0.07);
        },
        lifeLost() {
            beep(220, 0.12, 'sawtooth', 0.13);
            setTimeout(() => beep(175, 0.18, 'sawtooth', 0.10), 100);
        },
        barrierWarning() {
            // Escalating pulses over ~1750ms — pacing gets faster, pitch rises.
            // Each callback captures the current generation; if cancelBarrierWarning()
            // has been called since (increments the counter), the beep is silently dropped.
            const gen = ++barrierWarnGen;
            const pulses = [
                { delay: 0,    freq: 330, dur: 0.14 },
                { delay: 480,  freq: 345, dur: 0.12 },
                { delay: 900,  freq: 362, dur: 0.11 },
                { delay: 1180, freq: 382, dur: 0.10 },
                { delay: 1390, freq: 405, dur: 0.09 },
                { delay: 1545, freq: 430, dur: 0.08 },
                { delay: 1655, freq: 458, dur: 0.08 },
                { delay: 1735, freq: 490, dur: 0.07 },
            ];
            pulses.forEach(({ delay, freq, dur }) => {
                setTimeout(() => { if (barrierWarnGen === gen) beep(freq, dur, 'square', 0.07); }, delay);
            });
        },
        cancelBarrierWarning() {
            barrierWarnGen++;
        }
    };

    // Simple BGM hook using HTMLAudioElement; no default track.
    window.bgm = {
        /**
         * Set the BGM track URL (e.g. 'assets/bgm.ogg') or fallback array.
         * Does not autoplay; call play() after a user gesture.
         */
        setTrack(source) {
            const url = resolvePlayableTrack(source);
            if (!url) return;
            stopBgm();
            try {
                bgmAudio = new Audio(url);
                bgmAudio.loop = true;
                bgmAudio.preload = 'auto';
                bgmAudio.volume = 0.24;
                bgmAudio.addEventListener('loadedmetadata', () => randomizeBgmStart(bgmAudio), { once: true });
            } catch (_) {
                bgmAudio = null;
            }
        },
        play() {
            playBgmIfAllowed();
        },
        armAutoplay() {
            armBgmAutoplay();
        },
        stop() {
            stopBgm();
        },
        setVolume(value) {
            if (!bgmAudio) return;
            const v = Math.max(0, Math.min(1, Number(value)));
            bgmAudio.volume = Number.isFinite(v) ? v : bgmAudio.volume;
        }
    };
})();
