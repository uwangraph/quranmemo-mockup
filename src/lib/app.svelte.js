// src/lib/app.svelte.js
function getStoredData(key, defaultData) {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return defaultData;
            }
        }
    }
    return defaultData;
}

function setStoredData(key, data) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Hard Refresh detection for Mockup (Cmd+Shift+R / Ctrl+Shift+R)
if (typeof window !== 'undefined' && !window.__quranmemoKeydownRegistered) {
    window.__quranmemoKeydownRegistered = true;
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
    let marketplaceTab = $state('toko');
    let musyrifBalance = $state(1250); // In-memory only — resets on every page load/refresh
    
    // Persistent User Data
    let user = $state(getStoredData('quranmemo_user', {
        name: "Ahmad Fulan",
        xp: 0,
        gems: 0,
        streak: 0,
        maxStreak: 0,          // Runtunan terbanyak sepanjang masa
        streakHistory: [false, false, false, false, false, false, false], // 7 hari terakhir (index 0 = paling lama)
        streakFreezes: 1,       // Jumlah Rukhsah Harian yang dimiliki
        streakRepairsUsed: 0,   // Berapa kali Tebus Hari dipakai bulan ini (maks 2)
        inventory: [],
        progress: {
            surah_094: 0
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
            { id: 'c1', title: 'certificate.juz30_title', type: 'certificate.memorization', date: '2026-01-15', icon: '📜' },
            { id: 'c2', title: 'certificate.tahsin_title', type: 'certificate.tahsin', date: '2025-11-20', icon: '🎓' }
        ],
        dailyQuests: {
            date: null,
            completedAll: false,
            quests: [
                { id: 'q1', text: 'quest.complete_step', max: 1, current: 0, xp: 10, claimed: false },
                { id: 'q2', text: 'quest.three_correct', max: 3, current: 0, xp: 10, claimed: false },
                { id: 'q3', text: 'quest.start_today', max: 1, current: 0, xp: 15, claimed: false }
            ]
        }
    }));

    // Ensure fallback properties exist for old users
    if (user.level === undefined) user.level = 'pemula';
    if (user.showLatin === undefined) user.showLatin = true;
    if (user.learningPath === undefined) user.learningPath = 'beginner';
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
        { id: 'c1', title: 'certificate.juz30_title', type: 'certificate.memorization', date: '2026-01-15', icon: '📜' },
        { id: 'c2', title: 'certificate.tahsin_title', type: 'certificate.tahsin', date: '2025-11-20', icon: '🎓' }
    ];
    
    const defaultQuests = [
        { id: 'q1', text: 'quest.complete_step', max: 1, current: 0, xp: 10, claimed: false },
        { id: 'q2', text: 'quest.three_correct_no_mistake', max: 3, current: 0, xp: 10, claimed: false },
        { id: 'q3', text: 'quest.complete_instant_review', max: 1, current: 0, xp: 15, claimed: false }
    ];
    if (user.dailyQuests === undefined || user.dailyQuests.date === undefined) {
        user.dailyQuests = { date: null, completedAll: false, quests: defaultQuests };
    }

    let pendingRewardInfo = $state(null);

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
                    { id: 'q1', text: 'quest.complete_step', max: 1, current: 0, xp: 10, claimed: false },
                    { id: 'q2', text: 'quest.three_correct_streak', max: 3, current: 0, xp: 10, claimed: false },
                    { id: 'q3', text: 'quest.complete_instant_review', max: 1, current: 0, xp: 15, claimed: false }
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

    // Weekly streak reward system (streak-based)
    // Returns reward info if a new-day streak continuation is detected after daily target completion.
    function checkLoginReward() {
        if (typeof window === 'undefined') return null;
        const now = new Date();
        const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const serverNow = new Date(utcMs + (3600000 * 7)); // UTC+7
        const todayStr = serverNow.toISOString().split('T')[0]; // YYYY-MM-DD

        if (user.lastLoginDate === todayStr) {
            return null; // Already claimed today
        }

        const targetQuest = user.dailyQuests?.quests?.find(x => x.id === 'q1');
        if (!targetQuest || targetQuest.current < targetQuest.max) {
            return null; // No valid daily target completed yet
        }

        // Check if yesterday was logged in (for streak continuation)
        const yesterday = new Date(serverNow);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const isConsecutive = user.lastLoginDate === yesterdayStr;

        const newStreak = isConsecutive ? user.loginStreak + 1 : 1;

        // Reward schedule berdasarkan target streak (STREAK.md):
        // 1-7 hari: 3 gems energy
        // 8-14 hari: 4 gems energy
        // 15-21 hari: 5 gems energy
        // 22-30 hari: 3 gems energy
        let gemsReward = 3;
        if (newStreak >= 22) gemsReward = 3;
        else if (newStreak >= 15) gemsReward = 5;
        else if (newStreak >= 8) gemsReward = 4;
        else gemsReward = 3;

        return { gemsReward, streakDay: newStreak };
    }

    function claimLoginReward(gemsReward, streakDay) {
        if (typeof window === 'undefined') return;
        const now = new Date();
        const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const serverNow = new Date(utcMs + (3600000 * 7));
        const todayStr = serverNow.toISOString().split('T')[0];

        user.lastLoginDate = todayStr;
        user.loginStreak = streakDay;
        user.gems += gemsReward;
        pendingRewardInfo = null;
        saveUser();
    }

    function triggerLoginRewardCheck() {
        const info = checkLoginReward();
        if (info) pendingRewardInfo = info;
        return info;
    }

    function clearPendingRewardInfo() {
        pendingRewardInfo = null;
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
            // XP per misi sesuai docs: total 1 misi harian = 35 XP (dibagi 3 misi)
            // q1: 10 XP, q2: 10 XP, q3: 15 XP → total 35 XP
            user.xp += q.xp;
            
            // Check if all completed → bonus agar total = 35 XP
            if (user.dailyQuests.quests.every(x => x.claimed)) {
                user.dailyQuests.completedAll = true;
                // Bonus sudah termasuk dalam xp per quest (total 35 XP)
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
        get marketplaceTab() { return marketplaceTab; },
        set marketplaceTab(val) { marketplaceTab = val; },
        get screenLabels() { return screenLabels; },
        get user() { return user; },
        get pendingRewardInfo() { return pendingRewardInfo; },
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
        addStreak,
        triggerLoginRewardCheck,
        clearPendingRewardInfo
    };
}

export const appState = createAppState();
