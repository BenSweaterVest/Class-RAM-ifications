(function () {
    const modeBanner = document.getElementById('mode-banner');
    const modeLabel = document.getElementById('mode-label');
    const towerSelect = document.getElementById('tower-select');
    const runnerControls = document.getElementById('runner-controls');
    const runnerControlsToggle = document.getElementById('runner-controls-toggle');
    const compactUiToggle = document.getElementById('compact-ui-toggle');
    const runnerHelp = document.getElementById('runner-help');
    const runnerNarrative = document.getElementById('runner-narrative');
    const hint = document.getElementById('tower-hint');

    const params = new URLSearchParams(window.location.search);
    const rawMode = params.get('mode');
    const mode = rawMode === 'legacy' ? 'legacy' : 'runner';
    setupCompactUiMode();

    document.body.dataset.mode = mode;
    if (modeLabel) {
        modeLabel.textContent = `MODE: ${mode}`;
    } else if (modeBanner) {
        modeBanner.textContent = `MODE: ${mode}`;
    }

    if (mode === 'runner') {
        if (towerSelect) towerSelect.style.display = 'none';
        if (runnerControls) runnerControls.style.display = 'block';
        if (runnerHelp) runnerHelp.style.display = 'block';
        if (runnerNarrative) runnerNarrative.style.display = 'none';
        setupRunnerTouchControls();
        if (hint) {
            hint.textContent = 'Runner controls: Up/Down lanes, Left/A move left, Right/D move right, Space Solidarity. Collect pride allies; avoid suits/cabinets/bots.';
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
        loadScript('game.js');
    }

    function setupRunnerTouchControls() {
        if (!runnerControls) return;

        const runnerTouch = document.getElementById('runner-touch');
        const touchCapable = isLikelyTouchDevice();
        const stored = localStorage.getItem('runnerTouchControls');
        let expanded = touchCapable;
        if (stored === 'show') expanded = true;
        if (stored === 'hide') expanded = false;

        applyRunnerControlVisibility(expanded, touchCapable, runnerTouch);

        if (!runnerControlsToggle) return;
        runnerControlsToggle.style.display = 'inline-block';
        runnerControlsToggle.onclick = () => {
            expanded = !expanded;
            localStorage.setItem('runnerTouchControls', expanded ? 'show' : 'hide');
            applyRunnerControlVisibility(expanded, touchCapable, runnerTouch);
        };
    }

    function applyRunnerControlVisibility(expanded, touchCapable, runnerTouch) {
        if (runnerTouch) {
            runnerTouch.style.display = expanded ? 'flex' : 'none';
        }
        if (runnerControlsToggle) {
            const prefix = expanded ? 'HIDE' : 'SHOW';
            const suffix = touchCapable ? 'TOUCH CONTROLS' : 'ON-SCREEN CONTROLS';
            runnerControlsToggle.textContent = `${prefix} ${suffix}`;
        }
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
