// Service Worker — Class RAM-ifications
// Bump CACHE_NAME whenever static assets change to force a refresh on existing installs.
const CACHE_NAME = 'class-ram-v2';

const STATIC_ASSETS = [
    './',
    './index.html',
    './mode-loader.js',
    './runner_mode.js',
    './game.js',
    './audio.js',
    './manifest.json',
    // Audio
    './assets/DiscoMusic.ogg',
    './assets/DiscoMusic.mp3',
    // Favicons
    './assets/favicon/favicon.ico',
    './assets/favicon/favicon-16x16.png',
    './assets/favicon/favicon-32x32.png',
    './assets/favicon/apple-touch-icon.png',
    './assets/favicon/android-chrome-192x192.png',
    './assets/favicon/android-chrome-512x512.png',
    // Sprites
    './assets/processed/BARRIER_v5_BarrierWall-SecurityDoor_00001_.png',
    './assets/processed/BG_01_v3_BackgroundSiliconValley_00001_.png',
    './assets/processed/BG_02_v1_BackgroundDistrictCourt_00001_.png',
    './assets/processed/BG_03_BackgroundAppealsCourt_00001_.png',
    './assets/processed/BG_04_v3_BackgroundWashingtonDC_00001_.png',
    './assets/processed/CARD_01_CardIntro1984_00001_.png',
    './assets/processed/CARD_02_CardSuitFiled1984_00001_.png',
    './assets/processed/CARD_03_CardHendersonRules1987_00001_.png',
    './assets/processed/CARD_04_CardReversal1990_00001_.png',
    './assets/processed/CARD_05_CardExecutiveOrder1995_00001_.png',
    './assets/processed/ENEMY_01_DISCOAuditor_00001_.png',
    './assets/processed/ENEMY_02_CorporateSuit_00001_.png',
    './assets/processed/ENV_01_CorporateLogicGridTile_00001_.png',
    './assets/processed/ENV_02_RunnerModeBackground_00001_.png',
    './assets/processed/FILE_01_CaseFile_00001_.png',
    './assets/processed/FX_01_SolidarityHeart_00001_.png',
    './assets/processed/FX_02_PrecedentShield_00001_.png',
    './assets/processed/FX_03_RedTapePit_00001_.png',
    './assets/processed/HTG_01_HTGMemberAlex_00001_.png',
    './assets/processed/HTG_02_HTGMemberCarmen_00001_.png',
    './assets/processed/HTG_03_HTGMemberMarcus_00001_.png',
    './assets/processed/HTG_04_HTGMemberSam_00001_.png',
    './assets/processed/HTG_05_HTGMemberJordan_00001_.png',
    './assets/processed/HTG_06_HTGMemberDani_00001_.png',
    './assets/processed/HTG_07_HTGMemberRobin_00001_.png',
    './assets/processed/HTG_08_HTGMemberEvelyn_00001_.png',
    './assets/processed/LOCK_BOT_v3_LaneLockObstacle-SurveillanceBot_00001_.png',
    './assets/processed/PLAYER_01_TimothyDoolingPlayerCharacter_00001_.png',
    './assets/processed/PROJ_01_BooleanBitProjectile_00001_.png',
    './assets/processed/PROJ_02_PrecedentProjectile_00001_.png',
    './assets/processed/TOWER_01_CoderTower_00001_.png',
    './assets/processed/TOWER_02_AttorneyTower_00001_.png',
    './assets/processed/TOWER_03_ActivistTower_00001_.png',
    './assets/processed/TOWER_04_EncryptionTower_00001_.png',
    './assets/processed/UI_01_SolidarityButtonInactive_00001_.png',
    './assets/processed/UI_02_SolidarityButtonActive_00001_.png',
    './assets/processed/UI_03_SolidarityButtonUrgent_00001_.png',
    './assets/processed/VintageSLOW_CABINET_v4_SlowObstacle-FilingCabinet_00001_.png',
];

// Install: cache everything up front
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: purge any old cache versions
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch: cache-first for assets, network-first for navigation
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Navigation requests: try network, fall back to cached index.html
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Everything else: serve from cache if available, otherwise fetch and cache
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (response && response.status === 200 && url.origin === self.location.origin) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
