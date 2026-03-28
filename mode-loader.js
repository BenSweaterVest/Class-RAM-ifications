(function () {
    const compactUiToggle = document.getElementById('compact-ui-toggle');
    const audioMuteToggle = document.getElementById('audio-mute-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const restartToggle = document.getElementById('restart-toggle');
    const runnerNarrative = document.getElementById('runner-narrative');

    const touchCapable = isLikelyTouchDevice();
    applyInputMode(touchCapable);
    setupMuteToggle();
    setupThemeToggle();
    setupRestartToggle();
    setupCompactUiMode(touchCapable);

    document.body.dataset.mode = 'runner';
    if (runnerNarrative) runnerNarrative.style.display = 'none';
    if (restartToggle) restartToggle.style.display = 'inline-block';
    if (window.bgm) {
        window.bgm.setTrack([
            'assets/DiscoMusic.ogg',
            'assets/DiscoMusic.mp3'
        ]);
        window.bgm.armAutoplay();
    }
    bindRunnerKeyboardFallback();
    loadScript('runner_mode.js');

    function isLikelyTouchDevice() {
        // pointer:coarse = primary input is touch/stylus (not trackpad or mouse).
        // max-width:900px excludes touch-capable laptops and desktop monitors —
        // those should use keyboard layout and keyboard control hints regardless
        // of whether the screen technically supports touch.
        return window.matchMedia('(pointer: coarse) and (max-width: 900px)').matches;
    }

    function applyInputMode(touchCapable) {
        document.body.classList.toggle('touch-ui', touchCapable);
        document.body.classList.toggle('desktop-ui', !touchCapable);
    }

    function setupCompactUiMode(touchCapable) {
        if (!compactUiToggle) return;
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

    function setupRestartToggle() {
        if (!restartToggle) return;

        restartToggle.onclick = () => {
            const controls = window.runnerControls;
            if (controls && typeof controls.restart === 'function') {
                controls.restart();
                return;
            }
            window.location.reload();
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
