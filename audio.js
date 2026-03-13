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
            bgmAudio = null;
        }
    }

    window.sfx = {
        init() {
            getContext();
        },
        isMuted() {
            return muted;
        },
        toggleMute() {
            muted = !muted;
            if (bgmAudio) {
                if (muted) bgmAudio.pause();
                else bgmAudio.play().catch(() => {});
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
        }
    };

    // Simple BGM hook using HTMLAudioElement; no default track.
    window.bgm = {
        /**
         * Set the BGM track URL (e.g. 'assets/bgm.ogg').
         * Does not autoplay; call play() after a user gesture.
         */
        setTrack(url) {
            if (!url) return;
            stopBgm();
            try {
                bgmAudio = new Audio(url);
                bgmAudio.loop = true;
                bgmAudio.volume = 0.3;
            } catch (_) {
                bgmAudio = null;
            }
        },
        play() {
            if (!bgmAudio || muted) return;
            bgmAudio.play().catch(() => {});
        },
        stop() {
            stopBgm();
        }
    };
})();
