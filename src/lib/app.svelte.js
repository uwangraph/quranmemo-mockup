// src/lib/app.svelte.js
export function createAppState() {
    let currentScreen = $state('onboarding');
    let theme = $state('user'); // user, musyrif, admin
    let mockupMode = $state('mobile'); // mobile, desktop
    let selectedVerseIndex = $state(2); // 0-indexed, default to index 2 (Verse 3)
    
    
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
        go,
        setMockupMode
    };
}

export const appState = createAppState();

