// Page shell: input mode detection, top-bar toggles, background music, and
// loading the game script. Game input itself lives in runner_mode.js.
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
    setupDifficultySelect();

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
    loadScript('runner_mode.js');

    function isLikelyTouchDevice() {
        // pointer:coarse = primary input is touch/stylus (not trackpad or mouse).
        // hover:none = primary input cannot hover (rules out macOS — trackpad/mouse
        //   always supports hover even if Safari incorrectly reports pointer:coarse).
        // max-width:900px excludes touch-capable laptops and desktop monitors —
        //   those should use keyboard layout regardless of touch capability.
        return window.matchMedia('(pointer: coarse) and (hover: none) and (max-width: 900px)').matches;
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

        // The M key toggles mute from runner_mode.js; audio.js announces every change.
        window.addEventListener('sfx-mute-changed', syncMuteLabel);
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

    function setupDifficultySelect() {
        const difficultySelect = document.getElementById('difficulty-select');
        if (!difficultySelect) return;
        // Hand focus back to the game after a choice so the arrow keys move
        // the player again instead of changing the selection.
        difficultySelect.addEventListener('change', () => difficultySelect.blur());
    }

    function applyCompactState(compact) {
        document.body.classList.toggle('compact-ui', compact);
        if (compactUiToggle) {
            compactUiToggle.textContent = `COMPACT UI: ${compact ? 'ON' : 'OFF'}`;
        }
    }

    // No cache-busting query string: the service worker caches runner_mode.js
    // by URL, and a unique URL per load would miss the cache every time and
    // break offline play. Bump CACHE_NAME in sw.js to ship a new build.
    function loadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    }
})();
