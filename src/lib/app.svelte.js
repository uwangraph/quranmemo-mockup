// src/lib/app.svelte.js
export function createAppState() {
    let currentScreen = $state('onboarding');
    let theme = $state('user'); // user, musyrif, admin
    
    const screenLabels = {
        onboarding: "✨ Onboarding",
        learn: "🏠 Belajar",
        murojaah: "🤝 Marketplace Musyrif",
        league: "🏆 Liga Fastabiqul",
        musyrif: "👳 Dashboard Musyrif",
        livemarking: "🔴 Live Marking",
        lesson: "📖 Hafalan",
        tadabbur: "📚 Tadabbur",
        profile: "👤 Profil",
        language: "🌍 Ganti Bahasa",
        "admin-users": "👥 Monitor User",
        "admin-musyrif": "👨‍🏫 Monitor Musyrif",
    };

    function go(id) {
        currentScreen = id;
        
        // Theme switching logic
        if (id === 'musyrif' || id === 'livemarking') {
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
