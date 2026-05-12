// src/lib/app.svelte.js
export function createAppState() {
    let currentScreen = $state('onboarding');
    let theme = $state('user'); // user, musyrif, admin
    
    const screenLabels = {
        onboarding: "✨ Onboarding",
        learn: "🏠 Learn",
        murojaah: "🤝 Marketplace",
        feedback: "⭐ Session Feedback",
        league: "🏆 League",
        musyrif: "👳 Musyrif Dashboard",
        livemarking: "🔴 Live Marking",
        "musyrif-earnings": "💰 Earnings & Analytics",
        lesson: "📖 Lesson",
        tadabbur: "📚 Tadabbur",
        profile: "👤 Profile",
        language: "🌍 Language",
        "admin-users": "👥 Monitor Users",
        "admin-musyrif": "👨‍🏫 Monitor Musyrif",
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

    return {
        get currentScreen() { return currentScreen; },
        get theme() { return theme; },
        get screenLabels() { return screenLabels; },
        go
    };
}

export const appState = createAppState();
