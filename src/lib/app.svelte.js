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

const DAY_MS = 86400000;

// Grace Period 4 jam (STREAK.md): hari hafalan baru dianggap berganti pukul 04.00,
// bukan tepat tengah malam, supaya penghafal malam tidak kehilangan runtunan.
const GRACE_HOURS = 4;

// Semua batas hari memakai waktu server UTC+7 (WIB), bukan zona waktu perangkat.
function serverNow() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3600000 * 7));
}

function dayKey(date) {
    return date.toISOString().split('T')[0];
}

// Tanggal "hari hafalan" — sudah digeser mundur oleh grace period, sehingga
// pukul 00.00–03.59 masih terhitung sebagai hari sebelumnya.
function streakDayKey(date = serverNow()) {
    return dayKey(new Date(date.getTime() - GRACE_HOURS * 3600000));
}

// Jarak hari antara sebuah tanggal (YYYY-MM-DD) dan hari hafalan berjalan.
function daysSince(dayStr) {
    return Math.round((Date.parse(streakDayKey()) - Date.parse(dayStr)) / DAY_MS);
}

// Penanda bulan (YYYY-MM) untuk semua reset bulanan.
function monthKey(date = serverNow()) {
    return streakDayKey(date).slice(0, 7);
}

// ====== Besaran XP (XP.md) ======
// Satu-satunya sumber angka XP di aplikasi; layar mana pun yang menampilkan
// atau memberi XP membacanya dari sini agar tidak pernah berbeda dengan dokumen.
export const XP = {
    step: 4,              // 1 step hafalan benar
    dailyMissionTotal: 35, // total misi harian (XP.md: "1 misi harian = 35 XP")
    checkpoint: 100,
    setoran: 50,
    mumtaz: 75,
    halaqahPerSetoran: 25
};

// XP penyelesaian satu surah, berdasarkan jumlah ayatnya (tabel XP.md).
export function surahCompletionXp(ayatCount) {
    if (ayatCount <= 20) return 50;
    if (ayatCount <= 60) return 80;
    if (ayatCount <= 80) return 125;
    if (ayatCount <= 100) return 150;
    if (ayatCount <= 150) return 180;
    if (ayatCount <= 200) return 175; // sesuai tabel XP.md, meski lebih kecil dari tingkat sebelumnya
    return 250;
}

// Murajaah & Revision Alert (STREAK.md): surah yang terakhir diverifikasi lebih dari
// 14 hari lalu naik jadi prioritas revisi.
export const MURAJAAH_DUE_DAYS = 14;

// Hadiah gems per hari runtunan (STREAK.md).
function streakGemsFor(day) {
    if (day >= 22) return 3;
    if (day >= 15) return 5;
    if (day >= 8) return 4;
    return 3;
}

// Rukhsah Harian tambahan yang diberikan saat sebuah milestone runtunan tercapai.
const STREAK_MILESTONES = [
    { days: 3, badgeId: 'b1', freezes: 1 },
    { days: 7, badgeId: 'b2', freezes: 1 },
    { days: 30, badgeId: 'b4', freezes: 2 },
    { days: 100, badgeId: 'b5', freezes: 3 },
    { days: 365, badgeId: 'b6', freezes: 0 }
];

// Dua misi harian dari MISSION.md, tetapi jumlah XP-nya mengikuti XP.md:
// satu paket misi harian bernilai 35 XP, dibagi 15 (log in) + 20 (hafal 1 ayat).
export function makeDailyQuests() {
    return [
        { id: 'm_login', text: 'quest.daily_login', max: 1, current: 0, xp: 15, claimed: false },
        { id: 'm_verse', text: 'quest.memorize_verse', max: 1, current: 0, xp: 20, claimed: false }
    ];
}

export function createAppState() {
    let currentScreen = $state('learn');
    let theme = $state('user'); // user, musyrif, admin
    let mockupMode = $state('mobile'); // mobile, desktop
    let selectedVerseIndex = $state(0); 
    let selectedNodeType = $state('lesson'); // 'lesson' | 'checkpoint'
    let selectedTadabburKey = $state(null);  // node Tadabbur yang sedang dibuka
    let marketplaceTab = $state('toko');
    let marketplaceSurah = $state('Al-Insyirah');
    let marketplaceAyah = $state('');
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
        streakMilestonesGranted: [], // Milestone yang bonus rukhsahnya sudah diberikan
        pendingRepair: null,    // { startedDay, targetsDone } — Tebus Hari yang sedang berjalan
        rewardGems: 0,          // Gems energy hasil reward streak — direset tiap tanggal 2
        monthlyResetKey: null,  // Bulan (YYYY-MM) terakhir reset bulanan dijalankan
        lastActiveDate: null,   // Hari terakhir menyelesaikan 1 step hafalan aktif (YYYY-MM-DD)
        dailyTargetsDone: { day: null, count: 0 }, // Jumlah target selesai pada hari berjalan
        // Tanggal verifikasi terakhir tiap surah — dasar Murajaah Alert (STREAK.md).
        // Data awal sengaja berisi surah yang sudah lewat 14 hari agar alurnya terlihat di mockup.
        murajaahLog: {
            'An-Nas': dayKey(new Date(serverNow().getTime() - 18 * DAY_MS)),
            'Ad-Duha': dayKey(new Date(serverNow().getTime() - 22 * DAY_MS)),
            'Al-Insyirah': dayKey(new Date(serverNow().getTime() - 3 * DAY_MS))
        },
        setoranIds: [],   // ID sesi setoran yang XP-nya sudah diberikan
        halaqahXp: 0,     // XP yang disumbangkan ke halaqah (25 per setoran anggota)
        inventory: [],
        progress: {
            surah_094: 0,
            tadabbur: [],  // key node Tadabbur yang sudah diselesaikan
            // Posisi di struktur tangga LEVELLING.md, terpisah per level karena
            // pengguna bisa berpindah jalur tanpa kehilangan posisi jalur lamanya.
            // Beginner mulai di mini target ke-21 (Al-Insyirah), surah yang lessonnya ada.
            ladderProgress: {
                beginner: { ladderIndex: 0, targetIndex: 20 },
                mid: { ladderIndex: 0, targetIndex: 0 },
                pro: { ladderIndex: 0, targetIndex: 0 }
            }
        },
        level: 'pemula',
        learningPath: 'beginner',
        // Hasil Placement Test (ONBOARDING.md). Kategori ditentukan musyrif, bukan sistem.
        placement: {
            canRead: null,          // true | false — jawaban gate question
            status: 'not_started',  // not_started | pending | done
            category: null,         // 'rbq' | 'rtq' | 'tahfidz'
            submittedAt: null,      // ISO — waktu rekaman Maryam 1-10 dikirim
            musyrifName: null,
            resultSeen: false,      // notifikasi hasil sudah dibaca user
            everMemorized: null,    // pernah menghafal atau belum
            memorizedSurahs: [],    // checklist surat/juz yang pernah dihafal
            recommendation: null,   // { surah, juz, note } dari musyrif
            followRecommendation: null // user ikut rekomendasi atau pilih sendiri
        },
        pathMode: 'roadmap',        // 'roadmap' (Roadmap Levelling) | 'self' (Self-paced)
        selfPacedTarget: null,      // target pilihan sendiri saat pathMode === 'self'
        // Preferensi pengingat (STREAK.md — Onboarding Key Question)
        reminder: {
            dailyTarget: 1,         // jumlah ayat per hari
            preferredTime: '05:00', // waktu hafalan pilihan
            level: 'ringan'         // ringan | sedang | kritis
        },
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
        dailyQuests: { date: null, completedAll: false, quests: makeDailyQuests() },
        monthlyMission: { month: null, loginDays: 0, versesMemorized: 0, xpEarned: 0 }
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
    if (!Array.isArray(user.streakMilestonesGranted)) user.streakMilestonesGranted = [];
    if (user.pendingRepair === undefined) user.pendingRepair = null;
    if (user.rewardGems === undefined) user.rewardGems = 0;
    if (user.monthlyResetKey === undefined) user.monthlyResetKey = null;
    if (user.dailyTargetsDone === undefined) user.dailyTargetsDone = { day: null, count: 0 };
    if (user.murajaahLog === undefined) user.murajaahLog = {
        'An-Nas': dayKey(new Date(serverNow().getTime() - 18 * DAY_MS)),
        'Ad-Duha': dayKey(new Date(serverNow().getTime() - 22 * DAY_MS)),
        'Al-Insyirah': dayKey(new Date(serverNow().getTime() - 3 * DAY_MS))
    };
    if (!Array.isArray(user.setoranIds)) user.setoranIds = [];
    if (user.halaqahXp === undefined) user.halaqahXp = 0;
    if (user.lastActiveDate === undefined) user.lastActiveDate = null;
    if (user.pathMode === undefined) user.pathMode = 'roadmap';
    if (user.selfPacedTarget === undefined) user.selfPacedTarget = null;
    if (user.reminder === undefined) user.reminder = { dailyTarget: 1, preferredTime: '05:00', level: 'ringan' };
    if (user.placement === undefined) user.placement = {
        canRead: null, status: 'not_started', category: null, submittedAt: null,
        musyrifName: null, resultSeen: false, everMemorized: null, memorizedSurahs: [],
        recommendation: null, followRecommendation: null
    };
    if (user.monthlyMission === undefined) user.monthlyMission = { month: null, loginDays: 0, versesMemorized: 0, xpEarned: 0 };
    if (!Array.isArray(user.progress?.tadabbur)) user.progress.tadabbur = [];
    if (user.progress.ladderProgress === undefined) user.progress.ladderProgress = {
        beginner: { ladderIndex: 0, targetIndex: 20 },
        mid: { ladderIndex: 0, targetIndex: 0 },
        pro: { ladderIndex: 0, targetIndex: 0 }
    };
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
    
    // Misi lama (q1/q2/q3) diganti oleh set MISSION.md; misi yang ID atau nilai XP-nya
    // tidak lagi cocok dibuang, agar pengguna lama tidak tersangkut aturan yang sudah mati.
    const questSpec = makeDailyQuests();
    if (user.dailyQuests === undefined || user.dailyQuests.date === undefined ||
        user.dailyQuests.quests?.length !== questSpec.length ||
        !user.dailyQuests.quests.every((q, i) => q.id === questSpec[i].id && q.xp === questSpec[i].xp)) {
        user.dailyQuests = { date: null, completedAll: false, quests: makeDailyQuests() };
    }

    let pendingRewardInfo = $state(null);

    function checkDailyReset() {
        const todayStr = streakDayKey();

        if (user.dailyQuests.date !== todayStr) {
            user.dailyQuests = { date: todayStr, completedAll: false, quests: makeDailyQuests() };
            saveUser();
        }

        if (user.dailyTargetsDone?.day !== todayStr) {
            user.dailyTargetsDone = { day: todayStr, count: 0 };
            saveUser();
        }

        // Misi "log in harian" (MISSION.md) terpenuhi oleh kehadiran itu sendiri —
        // membuka aplikasi hari ini sudah merupakan buktinya. XP-nya tetap harus diklaim.
        const login = user.dailyQuests.quests.find(q => q.id === 'm_login');
        if (login && login.current < login.max) {
            login.current = login.max;
            saveUser();
        }
    }

    // Reset bulanan (STREAK.md): gems energy hasil reward dihapus tanggal 2 setiap
    // bulan, jatah Tebus Hari kembali penuh, dan 1 Rukhsah gratis diberikan.
    function checkMonthlyReset() {
        const now = serverNow();
        const key = monthKey(now);
        if (user.monthlyResetKey === key) return;

        // Kunjungan pertama hanya menandai bulan berjalan. Menjalankan resetnya di sini
        // akan menghadiahi rukhsah bulanan kedua kepada pengguna yang baru mendaftar.
        if (user.monthlyResetKey === null) {
            user.monthlyResetKey = key;
            saveUser();
            return;
        }

        // Menunggu tanggal 2 — sebelum itu bulan baru belum "dibuka".
        const dayOfMonth = Number(streakDayKey(now).slice(8));
        if (dayOfMonth < 2) return;

        user.gems = Math.max(0, user.gems - (user.rewardGems || 0));
        user.rewardGems = 0;
        user.streakRepairsUsed = 0;
        user.streakFreezes += 1; // 1 Rukhsah gratis per bulan
        user.monthlyResetKey = key;
        saveUser();
    }

    // Misi bulanan mengakumulasi capaian harian sepanjang bulan berjalan.
    function checkMonthlyMissionReset() {
        const key = monthKey();
        if (user.monthlyMission.month !== key) {
            user.monthlyMission = { month: key, loginDays: 0, versesMemorized: 0, xpEarned: 0 };
            saveUser();
        }
    }

    // Run check on initialization
    if (typeof window !== 'undefined') {
        checkMonthlyReset();
        checkMonthlyMissionReset();
        checkDailyReset();
        evaluateStreak();
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
        const todayStr = streakDayKey();

        if (user.lastLoginDate === todayStr) {
            return null; // Already claimed today
        }

        const targetQuest = user.dailyQuests?.quests?.find(x => x.id === 'm_verse');
        if (!targetQuest || targetQuest.current < targetQuest.max) {
            return null; // No valid daily target completed yet
        }

        // Check if yesterday was logged in (for streak continuation)
        const isConsecutive = !!user.lastLoginDate && daysSince(user.lastLoginDate) === 1;

        const newStreak = isConsecutive ? user.loginStreak + 1 : 1;

        return { gemsReward: streakGemsFor(newStreak), streakDay: newStreak };
    }

    function claimLoginReward(gemsReward, streakDay) {
        if (typeof window === 'undefined') return;
        user.lastLoginDate = streakDayKey();
        user.loginStreak = streakDay;
        user.gems += gemsReward;
        // Dicatat terpisah agar reset tanggal 2 hanya menghapus gems hasil reward.
        user.rewardGems = (user.rewardGems || 0) + gemsReward;
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
            // MISSION.md: log in harian 50 XP, hafal 1 ayat 50 XP.
            user.xp += q.xp;

            // Misi bulanan hanya mengakumulasi misi harian yang benar-benar diklaim.
            checkMonthlyMissionReset();
            if (q.id === 'm_login') user.monthlyMission.loginDays += 1;
            if (q.id === 'm_verse') user.monthlyMission.versesMemorized += 1;
            user.monthlyMission.xpEarned += q.xp;

            if (user.dailyQuests.quests.every(x => x.claimed)) {
                user.dailyQuests.completedAll = true;
            }
            saveUser();
        }
    }

    // Tandai satu node Tadabbur sebagai selesai. Idempoten agar membuka ulang
    // node yang sama tidak menggandakan catatannya.
    function completeTadabbur(key) {
        if (!key || user.progress.tadabbur.includes(key)) return false;
        user.progress.tadabbur = [...user.progress.tadabbur, key];
        saveUser();
        return true;
    }

    // ====== Streak-related functions ======

    // Buka lencana milestone yang sudah terlampaui oleh runtunan saat ini, sekaligus
    // memberikan bonus Rukhsah Harian sesuai STREAK.md. Bonus hanya sekali per
    // milestone — pengguna yang putus lalu mengulang tetap dapat lencananya, tapi
    // tidak bisa memanen rukhsah berkali-kali dari milestone yang sama.
    function unlockStreakBadges() {
        STREAK_MILESTONES.forEach((m) => {
            if (user.streak < m.days) return;

            const badge = user.badges.find(b => b.id === m.badgeId);
            if (badge) badge.earned = true;

            if (m.freezes > 0 && !user.streakMilestonesGranted.includes(m.days)) {
                user.streakFreezes += m.freezes;
                user.streakMilestonesGranted = [...user.streakMilestonesGranted, m.days];
            }
        });
    }

    // Evaluasi runtunan saat aplikasi dibuka: putuskan jika ada hari yang terlewat.
    // Rukhsah Harian menutup tepat satu hari bolong secara otomatis (STREAK.md).
    function evaluateStreak() {
        if (!user.lastActiveDate) return;
        const gap = daysSince(user.lastActiveDate);
        if (gap <= 1) return; // hari ini atau kemarin — runtunan masih aman

        if (gap === 2 && user.streakFreezes > 0) {
            user.streakFreezes -= 1;
            // Majukan penanda agar rukhsah tidak terpakai dua kali untuk hari yang sama.
            user.lastActiveDate = dayKey(new Date(Date.parse(streakDayKey()) - DAY_MS));
            saveUser();
            return;
        }

        // Streak putus. Jendela Tebus Hari cuma 24 jam (STREAK.md), jadi kesempatan
        // menebus hanya dibuka pada hari pertama setelah hari yang terlewat.
        // Hanya saat runtunan benar-benar baru putus; pemanggilan ulang di hari yang
        // sama tidak boleh menghapus tawaran penebusan yang sedang berjalan.
        const streakLost = user.streak;
        user.streak = 0;
        if (streakLost > 0) {
            user.pendingRepair = (gap === 2 && user.streakRepairsUsed < 2)
                ? { startedDay: streakDayKey(), targetsDone: 0, lostStreak: streakLost }
                : null;
        }
        saveUser();
    }

    // Tebus Hari berlaku hanya selama hari ia ditawarkan.
    function repairOffer() {
        if (!user.pendingRepair) return null;
        if (user.pendingRepair.startedDay !== streakDayKey()) return null;
        return user.pendingRepair;
    }

    // Dipanggil ketika pengguna menyelesaikan minimal 1 step hafalan aktif.
    // Hanya menambah runtunan satu kali per hari (STREAK.md).
    function markDailyProgress() {
        const todayStr = streakDayKey();

        // Selalu catat jumlah target hari ini — dipakai Tebus Hari (sesi double).
        if (user.dailyTargetsDone?.day !== todayStr) {
            user.dailyTargetsDone = { day: todayStr, count: 0 };
        }
        user.dailyTargetsDone.count += 1;

        const offer = repairOffer();
        if (offer) {
            offer.targetsDone = user.dailyTargetsDone.count;
            // Dua target selesai hari ini → hari yang terlewat tertebus.
            if (offer.targetsDone >= 2) {
                user.streak = offer.lostStreak;
                user.streakRepairsUsed += 1;
                user.pendingRepair = null;
            }
        }

        if (user.lastActiveDate === todayStr) {
            saveUser();
            return false;
        }

        evaluateStreak(); // pastikan hari bolong sudah diperhitungkan sebelum menambah

        user.streak = Math.min(user.streak + 1, 999);
        if (user.streak > user.maxStreak) user.maxStreak = user.streak;
        user.streakHistory = [...user.streakHistory.slice(1), true];
        user.lastActiveDate = todayStr;
        unlockStreakBadges();
        saveUser();
        return true;
    }

    // Gunakan Rukhsah Harian (Streak Freeze) — cegah streak putus 1 hari
    function useStreakFreeze() {
        if (user.streakFreezes > 0) {
            user.streakFreezes -= 1;
            saveUser();
            return true;
        }
        return false;
    }

    // Tebus Hari (Streak Repair) — mengaktifkan penebusan. Streak baru kembali
    // setelah pengguna menyelesaikan dua target di hari yang sama, bukan seketika.
    function repairStreak() {
        const offer = repairOffer();
        if (!offer || user.streakRepairsUsed >= 2) return false;

        offer.targetsDone = user.dailyTargetsDone?.day === streakDayKey() ? user.dailyTargetsDone.count : 0;
        if (offer.targetsDone >= 2) {
            user.streak = offer.lostStreak;
            user.streakRepairsUsed += 1;
            user.pendingRepair = null;
            saveUser();
            return true;
        }
        saveUser();
        return false;
    }

    // Simulasi tambah streak (untuk demo di mockup)
    function addStreak(days = 1) {
        user.streak = Math.min(user.streak + days, 999);
        if (user.streak > user.maxStreak) user.maxStreak = user.streak;
        user.streakHistory = [...user.streakHistory.slice(1), true];
        user.lastActiveDate = streakDayKey();
        unlockStreakBadges();
        saveUser();
    }

    // ====== Placement Test (ONBOARDING.md) ======

    function updatePlacement(patch) {
        user.placement = { ...user.placement, ...patch };
        saveUser();
    }

    // Kirim rekaman QS Maryam 1-10 untuk diverifikasi musyrif (SLA maks 1x24 jam).
    function submitPlacementRecording() {
        updatePlacement({ status: 'pending', submittedAt: new Date().toISOString(), musyrifName: 'Ust. Ahmad Zaki' });
    }

    // Keputusan musyrif. Sistem tidak pernah menentukan kategori sendiri —
    // fungsi ini yang dipanggil ketika hasil verifikasi masuk.
    function setPlacementResult(category, recommendation = null) {
        updatePlacement({ status: 'done', category, recommendation, resultSeen: false });
        // RBQ/RTQ artinya bacaan diperbaiki dulu; jalur hafalan tetap terbuka (free will).
        setLearningPath(category === 'tahfidz' ? 'mid' : 'beginner');
    }

    // Sisa waktu SLA verifikasi dalam jam (null jika tidak sedang menunggu).
    function placementSlaHoursLeft() {
        if (user.placement?.status !== 'pending' || !user.placement.submittedAt) return null;
        const elapsed = Date.now() - Date.parse(user.placement.submittedAt);
        return Math.max(0, Math.ceil((DAY_MS - elapsed) / 3600000));
    }

    function setPathMode(mode, target = null) {
        user.pathMode = mode; // 'roadmap' | 'self'
        user.selfPacedTarget = target;
        saveUser();
    }

    function setReminderPrefs(patch) {
        user.reminder = { ...user.reminder, ...patch };
        saveUser();
    }

    // ====== Setoran ke musyrif (XP.md) ======

    // Mencatat satu setoran yang sudah diverifikasi musyrif dan memberikan XP-nya.
    // `sessionId` membuat fungsi ini idempoten — membuka ulang layar ulasan sesi
    // yang sama tidak boleh membayar XP dua kali.
    function recordSetoran({ sessionId, surah, grade = 'jayyid' }) {
        if (!sessionId || user.setoranIds.includes(sessionId)) return null;

        const bonus = grade === 'mumtaz' ? XP.mumtaz : 0;
        const gained = XP.setoran + bonus;

        user.xp += gained;
        // Setiap anggota yang setoran menyumbang XP ke halaqahnya (XP.md — XP Halaqah).
        user.halaqahXp += XP.halaqahPerSetoran;
        user.setoranIds = [...user.setoranIds, sessionId];

        // Setoran adalah verifikasi terbaru surah itu — sekaligus menyetel ulang
        // hitungan Murajaah Alert untuknya.
        if (surah) markSurahReviewed(surah);

        saveUser();
        return { setoran: XP.setoran, bonus, total: gained, halaqah: XP.halaqahPerSetoran };
    }

    // ====== Murajaah & Revision Alert (STREAK.md) ======

    function markSurahReviewed(surah) {
        user.murajaahLog = { ...user.murajaahLog, [surah]: streakDayKey() };
        saveUser();
    }

    // Surah yang lebih dari 14 hari tidak diulang, yang paling lama menganggur dulu.
    function murajaahDue() {
        return Object.entries(user.murajaahLog ?? {})
            .map(([surah, date]) => ({ surah, date, days: daysSince(date) }))
            .filter((x) => x.days > MURAJAAH_DUE_DAYS)
            .sort((a, b) => b.days - a.days);
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
        reminders: "Reminders",
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
        get selectedTadabburKey() { return selectedTadabburKey; },
        set selectedTadabburKey(val) { selectedTadabburKey = val; },
        get marketplaceTab() { return marketplaceTab; },
        set marketplaceTab(val) { marketplaceTab = val; },
        get marketplaceSurah() { return marketplaceSurah; },
        set marketplaceSurah(val) { marketplaceSurah = val; },
        get marketplaceAyah() { return marketplaceAyah; },
        set marketplaceAyah(val) { marketplaceAyah = val; },
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
        markDailyProgress,
        completeTadabbur,
        triggerLoginRewardCheck,
        clearPendingRewardInfo,
        get repairOffer() { return repairOffer(); },
        updatePlacement,
        submitPlacementRecording,
        setPlacementResult,
        placementSlaHoursLeft,
        setPathMode,
        setReminderPrefs,
        recordSetoran,
        markSurahReviewed,
        get murajaahDue() { return murajaahDue(); }
    };
}

export const appState = createAppState();
