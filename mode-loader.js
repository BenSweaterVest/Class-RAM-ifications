(function () {
    const modeBanner = document.getElementById('mode-banner');
    const modeLabel = document.getElementById('mode-label');
    const towerSelect = document.getElementById('tower-select');
    const runnerControls = document.getElementById('runner-controls');
    const runnerControlsToggle = document.getElementById('runner-controls-toggle');
    const compactUiToggle = document.getElementById('compact-ui-toggle');
    const audioMuteToggle = document.getElementById('audio-mute-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const precedentLabel = document.getElementById('precedent-label');
    const runnerHelp = document.getElementById('runner-help');
    const runnerNarrative = document.getElementById('runner-narrative');
    const hint = document.getElementById('tower-hint');

    const params = new URLSearchParams(window.location.search);
    const rawMode = params.get('mode');
    const mode = rawMode === 'legacy' ? 'legacy' : 'runner';
    setupMuteToggle();
    setupThemeToggle();
    setupCompactUiMode();

    document.body.dataset.mode = mode;
    if (mode === 'runner') {
        if (towerSelect) towerSelect.style.display = 'none';
        if (runnerControls) runnerControls.style.display = 'none';
        if (runnerHelp) runnerHelp.style.display = 'none';
        if (runnerNarrative) runnerNarrative.style.display = 'none';
        if (precedentLabel) precedentLabel.textContent = '';
        if (hint) {
            hint.innerHTML = 'Runner controls: Up/Down lanes, Left/A move left, Right/D move right, Space Solidarity (burst through the barrier).<br>Collect HTG allies; avoid suits/cabinets/bots/get through the barriers.';
        }
        if (window.bgm) {
            window.bgm.setTrack([
                'assets/DiscoMusic.ogg',
                'assets/DiscoMusic.mp3'
            ]);
            window.bgm.armAutoplay();
        }
        bindRunnerKeyboardFallback();
        loadScript('runner_mode.js');
    } else {
        if (window.bgm) window.bgm.stop();
        if (runnerHelp) runnerHelp.style.display = 'none';
        if (runnerNarrative) runnerNarrative.style.display = 'none';
        if (runnerControls) runnerControls.style.display = 'none';
        if (precedentLabel) precedentLabel.textContent = 'PRECEDENT:';
        loadScript('game.js');
    }

    function isLikelyTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );
    }

    function setupCompactUiMode() {
        if (!compactUiToggle) return;

        const touchCapable = isLikelyTouchDevice();
        let compact = localStorage.getItem('compactUiMode') === 'on';

        if (touchCapable) {
            compactUiToggle.style.display = 'none';
            document.body.classList.remove('compact-ui');
            return;
        }

        compactUiToggle.style.display = 'inline-block';
        applyCompactState(compact);

        compactUiToggle.onclick = () => {
            compact = !compact;
            localStorage.setItem('compactUiMode', compact ? 'on' : 'off');
            applyCompactState(compact);
        };
    }

    function setupMuteToggle() {
        if (!audioMuteToggle) return;

        const syncMuteLabel = () => {
            const muted = window.sfx && typeof window.sfx.isMuted === 'function'
                ? window.sfx.isMuted()
                : false;
            audioMuteToggle.textContent = `MUTE: ${muted ? 'ON' : 'OFF'}`;
        };

        audioMuteToggle.onclick = () => {
            if (window.sfx && typeof window.sfx.toggleMute === 'function') {
                window.sfx.toggleMute();
            }
            syncMuteLabel();
        };

        syncMuteLabel();
    }

    function setupThemeToggle() {
        if (!themeToggle) return;

        let lightMode = localStorage.getItem('siteTheme') === 'light';
        applyTheme(lightMode);

        themeToggle.onclick = () => {
            lightMode = !lightMode;
            localStorage.setItem('siteTheme', lightMode ? 'light' : 'dark');
            applyTheme(lightMode);
        };
    }

    function applyTheme(lightMode) {
        document.body.classList.toggle('light-mode', lightMode);
        if (themeToggle) {
            themeToggle.textContent = lightMode ? 'DARK MODE' : 'BRIGHT MODE';
        }
    }

    function applyCompactState(compact) {
        document.body.classList.toggle('compact-ui', compact);
        if (compactUiToggle) {
            compactUiToggle.textContent = `COMPACT UI: ${compact ? 'ON' : 'OFF'}`;
        }
    }

    function bindRunnerKeyboardFallback() {
        window.addEventListener('keydown', e => {
            const controls = window.runnerControls;
            if (!controls) return;

            const key = e.key;
            const code = e.code;

            if (key === 'r' || key === 'R') {
                e.preventDefault();
                controls.restart();
                return;
            }
            if (key === 'ArrowLeft') {
                e.preventDefault();
                controls.slow();
                return;
            }
            if (key === 'a' || key === 'A') {
                e.preventDefault();
                controls.slow();
                return;
            }
            if (key === 'ArrowUp') {
                e.preventDefault();
                controls.up();
                return;
            }
            if (key === 'ArrowRight') {
                e.preventDefault();
                controls.dash();
                return;
            }
            if (key === 'ArrowDown') {
                e.preventDefault();
                controls.down();
                return;
            }
            if (key === 'd' || key === 'D') {
                e.preventDefault();
                controls.dash();
                return;
            }
            if (key === ' ' || code === 'Space') {
                e.preventDefault();
                controls.solidarity();
            }
        });
    }

    function loadScript(src) {
        const script = document.createElement('script');
        script.src = `${src}?v=${Date.now()}`;
        script.defer = true;
        document.body.appendChild(script);
    }
})();
