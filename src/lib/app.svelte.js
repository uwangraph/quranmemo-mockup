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

// Hard Refresh detection: sessionStorage is wiped on hard refresh, localStorage is not.
// If our session marker is missing → this is a fresh start → reset localStorage data.
if (typeof window !== 'undefined') {
    if (!sessionStorage.getItem('quranmemo_session_active')) {
        // Tab closed or new tab detected — reset persistent mock data
        localStorage.removeItem('quranmemo_user');
    }
    // Mark this session as active (survives soft navigation, wiped on tab close)
    sessionStorage.setItem('quranmemo_session_active', 'true');
}

export function createAppState() {
    let currentScreen = $state('learn');
    let theme = $state('user'); // user, musyrif, admin
    let mockupMode = $state('mobile'); // mobile, desktop
    let selectedVerseIndex = $state(0); 
    let musyrifBalance = $state(1250); // In-memory only — resets on every page load/refresh
    
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
        level: 'pemula', // pemula, menengah, mahir (controls Latin display)
        learningPath: 'beginner', // beginner, mid, pro (controls roadmap/mini-target)
        showLatin: true
    }));

    // Ensure fallback properties exist
    if (user.level === undefined) user.level = 'pemula';
    if (user.showLatin === undefined) user.showLatin = true;
    if (user.learningPath === undefined) user.learningPath = 'beginner';

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

    function setLearningPath(path) {
        user.learningPath = path; // 'beginner' | 'mid' | 'pro'
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
        get musyrifBalance() { return musyrifBalance; },
        setMusyrifBalance(val) {
            musyrifBalance = val;
        },
        saveUser,
        go,
        setMockupMode,
        setUserLevel,
        setLearningPath,
        toggleLatin
    };
}

export const appState = createAppState();
