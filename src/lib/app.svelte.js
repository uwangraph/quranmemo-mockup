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

// Hard Refresh detection for Mockup (Cmd+Shift+R / Ctrl+Shift+R)
if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
            localStorage.removeItem('quranmemo_user');
        }
    });

    if (!sessionStorage.getItem('quranmemo_session_active')) {
        // Only clear on completely new tab/window, not on normal refresh
        // localStorage.removeItem('quranmemo_user'); 
        sessionStorage.setItem('quranmemo_session_active', 'true');
    }
}

export function createAppState() {
    let currentScreen = $state('learn');
    let theme = $state('user'); // user, musyrif, admin
    let mockupMode = $state('mobile'); // mobile, desktop
    let selectedVerseIndex = $state(0); 
    let selectedNodeType = $state('lesson'); // 'lesson' | 'checkpoint'
    let musyrifBalance = $state(1250); // In-memory only — resets on every page load/refresh
    
    // Persistent User Data
    let user = $state(getStoredData('quranmemo_user', {
        name: "Ahmad Fulan",
        xp: 2450,
        gems: 0,
        streak: 7,
        maxStreak: 12,          // Runtunan terbanyak sepanjang masa
        streakHistory: [true, true, false, true, true, true, true], // 7 hari terakhir (index 0 = paling lama)
        streakFreezes: 1,       // Jumlah Rukhsah Harian yang dimiliki
        streakRepairsUsed: 0,   // Berapa kali Tebus Hari dipakai bulan ini (maks 2)
        inventory: [],
        progress: {
            surah_094: 2
        },
        level: 'pemula',
        learningPath: 'beginner',
        showLatin: true,
        loginStreak: 1,
        lastLoginDate: null,
        scheduledBooking: {
            musyrifName: 'Ust. Ahmad Zaki',
            time: '2026-05-22T15:00:00', // ISO string waktu setoran
            surah: 'Ad-Dhuha',
            juz: 30
        },
        badges: [
            { id: 'b1', icon: '🔥', name: 'Langkah Pertama', desc: 'Menyelesaikan 3 hari streak berturut-turut', earned: true },
            { id: 'b2', icon: '📅', name: 'Satu Pekan Istiqomah', desc: 'Menyelesaikan 7 hari streak berturut-turut', earned: true },
            { id: 'b3', icon: '🏅', name: 'Penghafal Juz 30', desc: 'Menyelesaikan seluruh hafalan Juz 30', earned: true },
            { id: 'b4', icon: '💎', name: 'Sebulan Teguh', desc: 'Menyelesaikan 30 hari streak berturut-turut', earned: false },
            { id: 'b5', icon: '🛡️', name: 'Penghafal Setia', desc: 'Mencapai 100 hari streak berturut-turut', earned: false },
            { id: 'b6', icon: '👑', name: 'Istiqomah Sejati', desc: 'Mencapai 365 hari streak berturut-turut. Lencana Permanen!', earned: false }
        ],
        certificates: [
            { id: 'c1', title: 'Sertifikat Hafalan Juz 30', type: 'Hafalan', date: '2026-01-15', icon: '📜' },
            { id: 'c2', title: 'Sertifikat Tahsin Dasar', type: 'Tahsin', date: '2025-11-20', icon: '🎓' }
        ],
        dailyQuests: {
            date: null,
            completedAll: false,
            quests: [
                { id: 'q1', text: 'Selesaikan 1 tahap hafalan', max: 1, current: 0, xp: 10, claimed: false },
                { id: 'q2', text: 'Dapatkan 3 jawaban benar', max: 3, current: 0, xp: 15, claimed: false },
                { id: 'q3', text: 'Mulai sesi hari ini', max: 1, current: 0, xp: 20, claimed: false }
            ]
        }
    }));

    // Ensure fallback properties exist for old users
    if (user.level === undefined) user.level = 'pemula';
    if (user.showLatin === undefined) user.showLatin = true;
    if (user.learningPath === undefined) user.learningPath = 'beginner';
    if (user.gems === undefined) { user.gems = user.coins || 350; delete user.coins; }
    if (user.gems === undefined) { user.gems = user.coins || 350; delete user.coins; }
    if (user.loginStreak === undefined) user.loginStreak = 1;
    if (user.lastLoginDate === undefined) user.lastLoginDate = null;
    if (user.maxStreak === undefined) user.maxStreak = user.streak || 1;
    if (user.streakHistory === undefined) user.streakHistory = [true, true, false, true, true, true, true];
    if (user.streakFreezes === undefined) user.streakFreezes = 1;
    if (user.streakRepairsUsed === undefined) user.streakRepairsUsed = 0;
    if (user.scheduledBooking === undefined) user.scheduledBooking = { musyrifName: 'Ust. Ahmad Zaki', time: '2026-05-22T15:00:00', surah: 'Ad-Dhuha', juz: 30 };
    if (user.badges === undefined) user.badges = [
        { id: 'b1', icon: '🔥', name: 'Langkah Pertama', desc: 'Menyelesaikan 3 hari streak berturut-turut', earned: true },
        { id: 'b2', icon: '📅', name: 'Satu Pekan Istiqomah', desc: 'Menyelesaikan 7 hari streak berturut-turut', earned: true },
        { id: 'b3', icon: '🏅', name: 'Penghafal Juz 30', desc: 'Menyelesaikan seluruh hafalan Juz 30', earned: true },
        { id: 'b4', icon: '💎', name: 'Sebulan Teguh', desc: 'Menyelesaikan 30 hari streak berturut-turut', earned: false },
        { id: 'b5', icon: '🛡️', name: 'Penghafal Setia', desc: 'Mencapai 100 hari streak berturut-turut', earned: false },
        { id: 'b6', icon: '👑', name: 'Istiqomah Sejati', desc: 'Mencapai 365 hari streak berturut-turut. Lencana Permanen!', earned: false }
    ];
    if (user.certificates === undefined) user.certificates = [
        { id: 'c1', title: 'Sertifikat Hafalan Juz 30', type: 'Hafalan', date: '2026-01-15', icon: '📜' },
        { id: 'c2', title: 'Sertifikat Tahsin Dasar', type: 'Tahsin', date: '2025-11-20', icon: '🎓' }
    ];
    
    const defaultQuests = [
        { id: 'q1', text: 'Selesaikan 1 tahap hafalan', max: 1, current: 0, xp: 10, claimed: false },
        { id: 'q2', text: 'Dapatkan 3 jawaban benar tanpa salah', max: 3, current: 0, xp: 15, claimed: false },
        { id: 'q3', text: 'Selesaikan 1 Murojaah instan', max: 1, current: 0, xp: 10, claimed: false }
    ];
    if (user.dailyQuests === undefined || user.dailyQuests.date === undefined) {
        user.dailyQuests = { date: null, completedAll: false, quests: defaultQuests };
    }

    function checkDailyReset() {
        const now = new Date();
        const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const serverNow = new Date(utcMs + (3600000 * 7)); // UTC+7
        const todayStr = serverNow.toISOString().split('T')[0];

        // 2. Check Daily Quests Reset
        if (user.dailyQuests.date !== todayStr) {
            user.dailyQuests = {
                date: todayStr,
                completedAll: false,
                quests: [
                    { id: 'q1', text: 'Selesaikan 1 tahap hafalan', max: 1, current: 0, xp: 10, claimed: false },
                    { id: 'q2', text: 'Dapatkan 3 jawaban benar beruntun', max: 3, current: 0, xp: 15, claimed: false },
                    { id: 'q3', text: 'Selesaikan 1 Murojaah instan', max: 1, current: 0, xp: 20, claimed: false }
                ]
            };
            saveUser();
        }
    }
    
    // Run check on initialization
    if (typeof window !== 'undefined') {
        checkDailyReset();
    }

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

    // Daily Login Reward system (streak-based)
    // Returns reward info if a new-day login is detected, else null.
    function checkLoginReward() {
        if (typeof window === 'undefined') return null;
        const now = new Date();
        const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const serverNow = new Date(utcMs + (3600000 * 7)); // UTC+7
        const todayStr = serverNow.toISOString().split('T')[0]; // YYYY-MM-DD

        if (user.lastLoginDate === todayStr) {
            return null; // Already claimed today
        }

        // Check if yesterday was logged in (for streak continuation)
        const yesterday = new Date(serverNow);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const isConsecutive = user.lastLoginDate === yesterdayStr;

        const newStreak = isConsecutive ? user.loginStreak + 1 : 1;

        // Reward schedule: streak day → XP reward
        // Milestone days: 7→15, 14→20, 30→30, other days (1-6)→5
        let xpReward = 5;
        if (newStreak === 30) xpReward = 30;
        else if (newStreak === 14) xpReward = 20;
        else if (newStreak === 7) xpReward = 15;

        return { xpReward, streakDay: newStreak };
    }

    function claimLoginReward(xpReward, streakDay) {
        if (typeof window === 'undefined') return;
        const now = new Date();
        const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const serverNow = new Date(utcMs + (3600000 * 7));
        const todayStr = serverNow.toISOString().split('T')[0];

        user.lastLoginDate = todayStr;
        user.loginStreak = streakDay;
        user.xp += xpReward;
        saveUser();
    }

    function updateQuestProgress(questId, amount = 1) {
        if (!user.dailyQuests) return;
        const q = user.dailyQuests.quests.find(x => x.id === questId);
        if (q && !q.claimed && q.current < q.max) {
            q.current = Math.min(q.max, q.current + amount);
            saveUser();
        }
    }

    function claimQuestReward(questId) {
        if (!user.dailyQuests) return;
        const q = user.dailyQuests.quests.find(x => x.id === questId);
        if (q && !q.claimed && q.current >= q.max) {
            q.claimed = true;
            if (q.id === 'q1') user.xp += 10;
            if (q.id === 'q2') user.xp += 15;
            if (q.id === 'q3') user.xp += 20;
            
            // Check if all completed
            if (user.dailyQuests.quests.every(x => x.claimed)) {
                user.dailyQuests.completedAll = true;
                user.xp += 35; // Bonus for completing all
            }
            saveUser();
        }
    }

    // ====== Streak-related functions ======

    // Gunakan Rukhsah Harian (Streak Freeze) — cegah streak putus 1 hari
    function useStreakFreeze() {
        if (user.streakFreezes > 0) {
            user.streakFreezes -= 1;
            saveUser();
            return true;
        }
        return false;
    }

    // Tebus Hari (Streak Repair) — kembalikan streak yang sudah putus
    function repairStreak() {
        if (user.streakRepairsUsed < 2 && user.streak === 0) {
            user.streak = 1;
            user.streakRepairsUsed += 1;
            saveUser();
            return true;
        }
        return false;
    }

    // Simulasi tambah streak (untuk demo di mockup)
    function addStreak(days = 1) {
        user.streak = Math.min(user.streak + days, 999);
        if (user.streak > user.maxStreak) user.maxStreak = user.streak;
        // Geser streak history
        const newHistory = [...user.streakHistory.slice(1), true];
        user.streakHistory = newHistory;
        // Cek milestone badge
        const milestones = [3, 7, 30, 100, 365];
        const badgeIds = ['b1', 'b2', 'b4', 'b5', 'b6'];
        milestones.forEach((m, i) => {
            if (user.streak >= m) {
                const badge = user.badges.find(b => b.id === badgeIds[i]);
                if (badge) badge.earned = true;
            }
        });
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
        get selectedNodeType() { return selectedNodeType; },
        set selectedNodeType(val) { selectedNodeType = val; },
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
        toggleLatin,
        checkLoginReward,
        claimLoginReward,
        updateQuestProgress,
        claimQuestReward,
        useStreakFreeze,
        repairStreak,
        addStreak
    };
}

export const appState = createAppState();
