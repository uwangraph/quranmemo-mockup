// src/lib/app.svelte.js
function getStoredData(key, defaultData) {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
    }
    return defaultData;
}

function setStoredData(key, data) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Hard Refresh state reset engine using Performance Navigation & Cache Analysis
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (sessionStorage.getItem('quranmemo_just_reset') === 'true') {
            sessionStorage.removeItem('quranmemo_just_reset');
            return;
        }
        
        setTimeout(() => {
            const resources = performance.getEntriesByType('resource');
            let checkedCount = 0;
            let cacheCount = 0;
            
            for (const r of resources) {
                if (r.name.includes('.js') || r.name.includes('.css') || r.name.includes('.png')) {
                    if (r.encodedBodySize > 0) {
                        checkedCount++;
                        if (r.transferSize === 0) {
                            cacheCount++;
                        }
                    }
                }
            }
            
            // Hard refresh is detected if none of the loaded resources came from cache (cacheCount === 0)
            if (checkedCount > 0 && cacheCount === 0) {
                console.log("⚠️ HARD REFRESH DETECTED! Clearing state and resetting data...");
                localStorage.removeItem('quranmemo_user');
                sessionStorage.setItem('quranmemo_just_reset', 'true');
                window.location.reload();
            }
        }, 120);
    });
}

export function createAppState() {
    let currentScreen = $state('learn');
    let theme = $state('user'); // user, musyrif, admin
    let mockupMode = $state('mobile'); // mobile, desktop
    let selectedVerseIndex = $state(0); 
    
    // Persistent User Data
    let user = $state(getStoredData('quranmemo_user', {
        name: "Ahmad Fulan",
        xp: 2450,
        coins: 350,
        streak: 7,
        hearts: 5,
        maxHearts: 5,
        inventory: [], // bought items
        progress: {
            surah_094: 2 // which verse index they are currently at (0-indexed). 2 means Verse 1 and 2 are done.
        },
        level: 'pemula', // pemula, menengah, mahir
        showLatin: true
    }));

    // Ensure fallback properties exist
    if (user.level === undefined) user.level = 'pemula';
    if (user.showLatin === undefined) user.showLatin = true;

    // Method to save user state to localStorage
    function saveUser() {
        setStoredData('quranmemo_user', user);
    }

    function setUserLevel(levelValue) {
        user.level = levelValue;
        if (levelValue === 'pemula') {
            user.showLatin = true;
        } else {
            user.showLatin = false;
        }
        saveUser();
    }

    function toggleLatin() {
        user.showLatin = !user.showLatin;
        saveUser();
    }

    // Initialize selectedVerseIndex based on progress
    selectedVerseIndex = user.progress.surah_094;
    
    const screenLabels = {
        onboarding: "Onboarding",
        learn: "Learn",
        murojaah: "Marketplace",
        feedback: "Session Feedback",
        league: "League",
        musyrif: "Musyrif Dashboard",
        livemarking: "Live Marking",
        "musyrif-earnings": "Earnings & Analytics",
        lesson: "Lesson",
        tadabbur: "Tadabbur",
        profile: "Profile",
        language: "Language",
        "admin-users": "Monitor Users",
        "admin-musyrif": "Monitor Musyrif",
    };

    function go(id) {
        currentScreen = id;
        
        // Theme switching logic
        if (id === 'musyrif' || id === 'livemarking' || id === 'musyrif-earnings') {
            theme = 'musyrif';
        } else if (id.startsWith('admin-')) {
            theme = 'admin';
        } else {
            theme = 'user';
        }
    }

    function setMockupMode(mode) {
        mockupMode = mode;
    }

    return {
        get currentScreen() { return currentScreen; },
        get theme() { return theme; },
        get mockupMode() { return mockupMode; },
        set mockupMode(val) { mockupMode = val; },
        get selectedVerseIndex() { return selectedVerseIndex; },
        set selectedVerseIndex(val) { selectedVerseIndex = val; },
        get screenLabels() { return screenLabels; },
        get user() { return user; },
        saveUser,
        go,
        setMockupMode,
        setUserLevel,
        toggleLatin
    };
}

export const appState = createAppState();
