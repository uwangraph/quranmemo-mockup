// src/lib/app.svelte.js
import { laddersFor, ladderTargetCount } from './data/levelling.js';
import { surahByName } from './data/surahs.js';
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

// Penanda pekan ISO: tanggal hari Senin pada pekan berjalan. Papan peringkat
// pekanan reset setiap Senin 00.00 (LEARDERBOARD.md).
function weekKey(date = serverNow()) {
    const d = new Date(Date.parse(streakDayKey(date)));
    const shift = (d.getUTCDay() + 6) % 7;   // 0 = Senin
    return dayKey(new Date(d.getTime() - shift * DAY_MS));
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

// Jadwal setoran contoh selalu dihitung relatif terhadap hari ini: dua hari lagi
// pukul 15.00. Tanggal mati di data contoh akan berubah menjadi jadwal yang sudah
// lewat begitu waktu berjalan.
function seedBooking() {
    const d = new Date(Date.now() + 2 * DAY_MS);
    d.setHours(15, 0, 0, 0);
    return { musyrifName: 'Ust. Ahmad Zaki', time: d.toISOString(), surah: 'Ad-Dhuha', juz: 30 };
}

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
    // Sesi setoran aktif, dibagikan oleh POV user dan musyrif.
    let liveSession = $state({
        studentName: 'Ahmad Hafidz',
        musyrifName: 'Ust. Malik',
        surah: 'Al-Insyirah',
        ayah: '1-8',
        sessionId: 'instant-al-insyirah-1-8'
    });
    let musyrifBalance = $state(1250); // In-memory only — resets on every page load/refresh
    
    // Persistent User Data
    let user = $state(getStoredData('quranmemo_user', {
        name: "Ahmad Fulan",
        xp: 0,
        gems: 0,
        streak: 0,
        maxStreak: 0,          // Runtunan terbanyak sepanjang masa
        activeDays: [],         // Tanggal (YYYY-MM-DD) yang punya minimal 1 step hafalan
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
            'Ad-Dhuha': dayKey(new Date(serverNow().getTime() - 22 * DAY_MS)),
            'Al-Insyirah': dayKey(new Date(serverNow().getTime() - 3 * DAY_MS))
        },
        setoranIds: [],   // ID sesi setoran yang XP-nya sudah diberikan
        halaqahXp: 0,     // XP yang disumbangkan ke halaqah (25 per setoran anggota)
        // XP per periode papan peringkat. All-time memakai user.xp.
        xpBuckets: { weekKey: null, week: 0, monthKey: null, month: 0, event: 0 },
        inventory: [],
        progress: {
            surahs: {},         // id surah -> jumlah ayat yang sudah selesai
            tadabbur: [],  // key node Tadabbur yang sudah diselesaikan
            // Posisi di struktur tangga LEVELLING.md, terpisah per level karena
            // pengguna bisa berpindah jalur tanpa kehilangan posisi jalur lamanya.
            // Beginner mulai di mini target ke-21 (Al-Insyirah), surah yang lessonnya ada.
            completedLadders: [],  // id tangga yang gerbangnya sudah dilewati
            // completedTargets mencatat mini target yang benar-benar diselesaikan.
            // Model lama memakai satu pointer targetIndex, sehingga menempatkan
            // pengguna di Al-Insyirah berarti menandai 20 surah sebelumnya seolah
            // sudah tuntas padahal tidak pernah dikerjakan.
            ladderProgress: {
                beginner: { ladderIndex: 0, completedTargets: [] },
                mid: { ladderIndex: 0, completedTargets: [] },
                pro: { ladderIndex: 0, completedTargets: [] }
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
        scheduledBooking: seedBooking(),
        badges: [
            { id: 'b1', icon: 'ti-flame', name: 'Langkah Pertama', desc: 'Menyelesaikan 3 hari streak berturut-turut', earned: false },
            { id: 'b2', icon: 'ti-calendar', name: 'Satu Pekan Istiqomah', desc: 'Menyelesaikan 7 hari streak berturut-turut', earned: false },
            { id: 'b3', icon: 'ti-medal', name: 'Penghafal Juz 30', desc: 'Menyelesaikan seluruh hafalan Juz 30', earned: false },
            { id: 'b4', icon: 'ti-diamond', name: 'Sebulan Teguh', desc: 'Menyelesaikan 30 hari streak berturut-turut', earned: false },
            { id: 'b5', icon: 'ti-shield-check', name: 'Penghafal Setia', desc: 'Mencapai 100 hari streak berturut-turut', earned: false },
            { id: 'b6', icon: 'ti-crown', name: 'Istiqomah Sejati', desc: 'Mencapai 365 hari streak berturut-turut. Lencana Permanen!', earned: false }
        ],
        certificates: [],   // Diberikan saat seluruh tangga sebuah level tuntas

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
    // streakHistory lama menyimpan tujuh slot posisi yang hanya bergeser saat ada hari
    // berhasil, sehingga hari bolong tidak pernah tercatat dan grafik pekanan bisa
    // menampilkan pekan yang tidak pernah terjadi. Diganti daftar tanggal aktif.
    if (!Array.isArray(user.activeDays)) {
        // Rekonstruksi dari data yang masih bisa dipercaya: runtunan sepanjang N hari
        // yang berakhir di lastActiveDate berarti N hari terakhir itu aktif.
        const days = [];
        if (user.lastActiveDate) {
            const end = Date.parse(user.lastActiveDate);
            for (let i = 0; i < Math.max(1, user.streak || 0); i++) {
                days.unshift(dayKey(new Date(end - i * DAY_MS)));
            }
        }
        user.activeDays = days;
    }
    delete user.streakHistory;
    if (user.streakFreezes === undefined) user.streakFreezes = 1;
    if (user.streakRepairsUsed === undefined) user.streakRepairsUsed = 0;
    if (!Array.isArray(user.streakMilestonesGranted)) user.streakMilestonesGranted = [];
    if (user.pendingRepair === undefined) user.pendingRepair = null;
    if (user.rewardGems === undefined) user.rewardGems = 0;
    if (user.monthlyResetKey === undefined) user.monthlyResetKey = null;
    if (user.dailyTargetsDone === undefined) user.dailyTargetsDone = { day: null, count: 0 };
    if (user.murajaahLog === undefined) user.murajaahLog = {
        'An-Nas': dayKey(new Date(serverNow().getTime() - 18 * DAY_MS)),
        'Ad-Dhuha': dayKey(new Date(serverNow().getTime() - 22 * DAY_MS)),
        'Al-Insyirah': dayKey(new Date(serverNow().getTime() - 3 * DAY_MS))
    };
    if (!Array.isArray(user.setoranIds)) user.setoranIds = [];
    if (user.halaqahXp === undefined) user.halaqahXp = 0;
    if (user.xpBuckets === undefined) user.xpBuckets = { weekKey: null, week: 0, monthKey: null, month: 0, event: 0 };
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
    if (!Array.isArray(user.progress.completedLadders)) user.progress.completedLadders = [];
    if (!user.progress.surahs) {
        // Progres lama hanya mengenal satu surah; pindahkan ke kunci surahnya.
        const legacy = user.progress.surah_094;   // penghitung tunggal sebelum registry surah
        user.progress.surahs = legacy ? { 'al-insyirah': legacy } : {};
        delete user.progress.surah_094;
    }
    if (user.progress.ladderProgress === undefined) user.progress.ladderProgress = {
        beginner: { ladderIndex: 0, completedTargets: [] },
        mid: { ladderIndex: 0, completedTargets: [] },
        pro: { ladderIndex: 0, completedTargets: [] }
    };
    // Pointer targetIndex lama tidak membedakan "sudah dikerjakan" dari "dilewati
    // karena posisi awal". Karena hanya Al-Insyirah yang pernah bisa dimainkan,
    // yang dipindahkan hanya progres yang benar-benar terbukti dari data surah.
    Object.entries(user.progress.ladderProgress).forEach(([path, pos]) => {
        if (Array.isArray(pos.completedTargets)) return;
        pos.completedTargets = [];
        delete pos.targetIndex;
    });
    if (user.scheduledBooking === undefined) user.scheduledBooking = seedBooking();
    // Jadwal contoh yang sudah lewat dimajukan kembali. Data mockup dengan tanggal
    // mati pasti basi, dan jadwal basi tampil sebagai sesi yang seolah berlangsung
    // sekarang di layar profil.
    if (user.scheduledBooking && Date.parse(user.scheduledBooking.time) < Date.now()) {
        user.scheduledBooking = { ...user.scheduledBooking, ...seedBooking() };
    }
    if (user.badges === undefined) user.badges = [
        { id: 'b1', icon: 'ti-flame', name: 'Langkah Pertama', desc: 'Menyelesaikan 3 hari streak berturut-turut', earned: false },
        { id: 'b2', icon: 'ti-calendar', name: 'Satu Pekan Istiqomah', desc: 'Menyelesaikan 7 hari streak berturut-turut', earned: false },
        { id: 'b3', icon: 'ti-medal', name: 'Penghafal Juz 30', desc: 'Menyelesaikan seluruh hafalan Juz 30', earned: false },
        { id: 'b4', icon: 'ti-diamond', name: 'Sebulan Teguh', desc: 'Menyelesaikan 30 hari streak berturut-turut', earned: false },
        { id: 'b5', icon: 'ti-shield-check', name: 'Penghafal Setia', desc: 'Mencapai 100 hari streak berturut-turut', earned: false },
        { id: 'b6', icon: 'ti-crown', name: 'Istiqomah Sejati', desc: 'Mencapai 365 hari streak berturut-turut. Lencana Permanen!', earned: false }
    ];
    if (user.certificates === undefined) user.certificates = [];
    // Data contoh lama menandai lencana dan sertifikat sebagai sudah diraih untuk
    // setiap pengguna baru. Dibersihkan sekali agar profil tidak memamerkan
    // pencapaian yang tidak pernah terjadi.
    if (!user.achievementsReset) {
        user.certificates = user.certificates.filter(c => c.id !== 'c1' && c.id !== 'c2');
        ['b1', 'b2', 'b3'].forEach(id => {
            const b = user.badges.find(x => x.id === id);
            if (b) b.earned = false;
        });
        user.achievementsReset = true;
    }
    
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
            addXp(q.xp);

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
        recordActiveDay(todayStr);
        user.lastActiveDate = todayStr;
        unlockStreakBadges();
        saveUser();
        return true;
    }

    // Catat satu hari aktif. Daftarnya dibatasi supaya tidak tumbuh tanpa henti;
    // 400 hari cukup untuk menopang milestone terpanjang (365 hari).
    function recordActiveDay(day) {
        if (user.activeDays.includes(day)) return;
        user.activeDays = [...user.activeDays, day].sort().slice(-400);
    }

    // Tujuh hari terakhir menurut hari hafalan, masing-masing dengan tanggal aslinya.
    // Hari bolong ikut terwakili, karena posisinya ditentukan tanggal — bukan urutan
    // kedatangan seperti pada streakHistory yang lama.
    function weekDays() {
        const today = Date.parse(streakDayKey());
        const active = new Set(user.activeDays ?? []);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today - (6 - i) * DAY_MS);
            const key = dayKey(d);
            return { date: key, dow: d.getUTCDay(), done: active.has(key), isToday: i === 6 };
        });
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
        recordActiveDay(streakDayKey());
        user.lastActiveDate = streakDayKey();
        unlockStreakBadges();
        saveUser();
    }

    // ====== Surah yang sedang dikerjakan ======

    // Nama mini target yang sedang berjalan pada tangga aktif. Untuk Beginner ini
    // nama surah; untuk Mid sekelompok surah; untuk Pro sebuah blok halaman.
    function currentTargetName() {
        if (user.pathMode === 'self' && user.selfPacedTarget) return user.selfPacedTarget;
        return ladderState().playable?.name ?? null;
    }

    // Konten surah yang sedang dikerjakan, atau null bila belum tersedia.
    function activeSurah() {
        return surahByName(currentTargetName());
    }

    function surahProgress(id) {
        return user.progress.surahs?.[id] ?? 0;
    }

    function advanceSurahProgress(id, verseIndex) {
        if (surahProgress(id) === verseIndex) {
            user.progress.surahs = { ...user.progress.surahs, [id]: verseIndex + 1 };
            saveUser();
        }
    }

    // Satu-satunya pintu penambahan XP. Selain menambah total sepanjang masa, XP
    // juga masuk ke ember pekanan/bulanan/event supaya papan peringkat per periode
    // menampilkan angka yang benar-benar berbeda, bukan total yang sama diulang.
    function addXp(amount) {
        if (!amount) return;
        const b = user.xpBuckets;
        const wk = weekKey(), mk = monthKey();
        if (b.weekKey !== wk) { b.weekKey = wk; b.week = 0; }
        if (b.monthKey !== mk) { b.monthKey = mk; b.month = 0; }
        b.week += amount;
        b.month += amount;
        b.event += amount;
        user.xp += amount;
        saveUser();
    }

    // XP untuk periode papan peringkat tertentu.
    function xpForPeriod(period) {
        const b = user.xpBuckets;
        if (period === 'weekly') return b.weekKey === weekKey() ? b.week : 0;
        if (period === 'monthly') return b.monthKey === monthKey() ? b.month : 0;
        if (period === 'event') return b.event;
        return user.xp;
    }

    // ====== Kemajuan tangga (LEVELLING.md) ======

    // Keadaan lengkap tangga yang sedang ditempuh. Dipakai roadmap maupun layar
    // lesson supaya keduanya tidak pernah berbeda pendapat soal target aktif.
    function ladderState(path = user.learningPath) {
        const ladders = laddersFor(path);
        const pos = user.progress.ladderProgress[path] ?? { ladderIndex: 0, completedTargets: [] };
        const ladderIndex = Math.min(pos.ladderIndex, ladders.length - 1);
        const ladder = ladders[ladderIndex];
        const total = ladderTargetCount(ladder);
        const doneSet = new Set(pos.completedTargets ?? []);

        const targets = Array.from({ length: total }, (_, i) => {
            const name = targetNameAt(ladder, i);
            const available = name !== null && surahByName(name) !== null;
            return { index: i, name, available, done: doneSet.has(i) };
        });

        // Target aktif adalah yang pertama belum selesai DAN kontennya tersedia.
        // Target tanpa konten tidak diklaim selesai, hanya belum bisa dikerjakan.
        const playable = targets.find(t => !t.done && t.available) ?? null;
        const pending = targets.filter(t => !t.done && !t.available);
        const availableAllDone = targets.every(t => t.done || !t.available);

        return { ladders, ladderIndex, ladder, targets, playable, pending, availableAllDone };
    }

    // Nama mini target ke-i pada sebuah tangga, apa pun bentuk levelnya.
    function targetNameAt(ladder, i) {
        if (ladder.surahs) return ladder.surahs[i];
        if (ladder.groups) return ladder.groups[i]?.[0] ?? null;
        return null;   // blok halaman Pro belum dipetakan ke satu surah
    }

    // Dipanggil ketika checkpoint sebuah mini target selesai. Tanpa ini posisi tangga
    // tidak pernah bergerak dan gerbang penutupnya terkunci selamanya.
    function completeMiniTarget() {
        const path = user.learningPath;
        const st = ladderState(path);
        if (!st.playable) return false;

        const pos = user.progress.ladderProgress[path];
        pos.completedTargets = [...new Set([...pos.completedTargets, st.playable.index])];

        // Gerbang hanya terlewati kalau seluruh mini target tangga ini tuntas —
        // termasuk yang kontennya belum ada. Melewatkannya lebih awal berarti
        // memberi lencana juz untuk surah yang tidak pernah dihafal.
        const after = ladderState(path);
        if (after.targets.every(t => t.done)) {
            passLadderGate(after.ladder);
            if (pos.ladderIndex + 1 < after.ladders.length) {
                pos.ladderIndex += 1;
                pos.completedTargets = [];
            }
        }

        saveUser();
        return true;
    }

    // Gerbang tangga: checkpoint sudah dibayar XP-nya di layar lesson, sedangkan
    // gerbang bertipe badge memberi lencana per juz sesuai LEVELLING.md.
    function passLadderGate(ladder) {
        if (user.progress.completedLadders.includes(ladder.id)) return;
        user.progress.completedLadders = [...user.progress.completedLadders, ladder.id];

        // Seluruh tangga level ini tuntas → lencana level dan sertifikatnya.
        const all = laddersFor(user.learningPath);
        if (all.every(l => user.progress.completedLadders.includes(l.id))) {
            grantLevelCompletion(user.learningPath);
        }

        if (ladder.gate === 'badge') {
            const id = `ladder_${ladder.id}`;
            if (!user.badges.some(b => b.id === id)) {
                user.badges = [...user.badges, {
                    id, icon: 'ti-medal', name: ladder.name,
                    desc: `Menuntaskan ${ladder.name}`, earned: true, dynamic: true
                }];
            }
        }
    }

    // Penyelesaian satu level penuh: lencana levelnya plus sertifikat.
    function grantLevelCompletion(path) {
        if (path === 'beginner') {
            const b3 = user.badges.find(b => b.id === 'b3');
            if (b3) b3.earned = true;
        }
        const id = `cert_${path}`;
        if (user.certificates.some(c => c.id === id)) return;
        user.certificates = [...user.certificates, {
            id, title: `certificate.level_${path}`, type: 'certificate.memorization',
            date: dayKey(serverNow()), icon: 'ti-file-text'
        }];
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

    // ====== Verifikasi Placement oleh musyrif ======
    //
    // Layar review terpisah menggantikan tiga tombol kategori instan di dasbor:
    // musyrif mendengar rekaman, menulis catatan, dan memberi rekomendasi surah
    // sebelum menjatuhkan kategori — bukan menebak dari nama santri saja.

    let placementReview = $state(null);      // entri antrean yang sedang dibuka musyrif
    // Keputusan untuk entri contoh (bukan santri di perangkat ini) — in-memory saja,
    // sama seperti musyrifBalance, karena entri contoh tidak punya objek user
    // sungguhan untuk menyimpan hasilnya.
    let demoPlacementDecisions = $state({});

    function openPlacementReview(entry) {
        placementReview = entry;
    }

    function closePlacementReview() {
        placementReview = null;
    }

    // Dipanggil dari layar review. Untuk santri di perangkat ini, keputusannya
    // masuk ke placement test sungguhan; untuk entri contoh, disimpan di memori.
    function submitPlacementReview({ category, note, surahName }) {
        if (!placementReview) return;
        const surah = surahName ? surahByName(surahName) : null;
        const trimmedNote = note?.trim() || null;
        const recommendation = (surah || trimmedNote)
            ? { surah: surah?.name ?? null, juz: surah?.juz ?? null, note: trimmedNote }
            : null;

        if (placementReview.self) {
            setPlacementResult(category, recommendation);
        } else {
            demoPlacementDecisions = { ...demoPlacementDecisions, [placementReview.id]: { category, recommendation } };
        }
        placementReview = null;
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

        addXp(gained);
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

    function markMurajaah(surah) {
        if (!surah) return;
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

    
    const screenLabels = {
        onboarding: "Onboarding",
        learn: "Learn",
        murojaah: "Murajaah",
        feedback: "Session Feedback",
        league: "League",
        musyrif: "Musyrif Dashboard",
        "placement-review": "Placement Review",
        livemarking: "Live Marking",
        "user-livemarking": "Live Setoran",
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
        if (id === 'musyrif' || id === 'livemarking' || id === 'musyrif-earnings' || id === 'placement-review') {
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
        get liveSession() { return liveSession; },
        setLiveSession(session) { liveSession = { ...liveSession, ...session }; },
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
        get weekDays() { return weekDays(); },
        completeMiniTarget,
        get ladderState() { return ladderState(); },
        get currentTargetName() { return currentTargetName(); },
        get activeSurah() { return activeSurah(); },
        surahProgress,
        advanceSurahProgress,
        addXp,
        xpForPeriod,
        updatePlacement,
        submitPlacementRecording,
        setPlacementResult,
        placementSlaHoursLeft,
        get placementReview() { return placementReview; },
        get demoPlacementDecisions() { return demoPlacementDecisions; },
        openPlacementReview,
        closePlacementReview,
        submitPlacementReview,
        setPathMode,
        setReminderPrefs,
        recordSetoran,
        markMurajaah,
        markSurahReviewed,
        get murajaahDue() { return murajaahDue(); }
    };
}

export const appState = createAppState();
