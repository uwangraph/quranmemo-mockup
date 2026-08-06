// Self-check logika runtunan (streak). Jalankan: node src/lib/streak.test.js
//
// createAppState() bergantung pada rune $state yang hanya ada setelah kompilasi Svelte,
// jadi berkas ini menguji aturan hariannya lewat replika murni dari app.svelte.js.
// Kalau aturan di sana berubah, samakan replika di bawah ini.
import assert from 'node:assert/strict';

const DAY_MS = 86400000;
const dayKey = (date) => date.toISOString().split('T')[0];

// Replika evaluateStreak() + markDailyProgress(), dengan "hari ini" bisa disuntik.
function makeStreak(user, today) {
    const daysSince = (dayStr) => Math.round((Date.parse(today) - Date.parse(dayStr)) / DAY_MS);

    function evaluateStreak() {
        if (!user.lastActiveDate) return;
        const gap = daysSince(user.lastActiveDate);
        if (gap <= 1) return;
        if (gap === 2 && user.streakFreezes > 0) {
            user.streakFreezes -= 1;
            user.lastActiveDate = dayKey(new Date(Date.parse(today) - DAY_MS));
            return;
        }
        user.streak = 0;
    }

    function markDailyProgress() {
        if (user.lastActiveDate === today) return false;
        evaluateStreak();
        user.streak = Math.min(user.streak + 1, 999);
        if (user.streak > user.maxStreak) user.maxStreak = user.streak;
        user.streakHistory = [...user.streakHistory.slice(1), true];
        user.lastActiveDate = today;
        return true;
    }

    return { evaluateStreak, markDailyProgress };
}

const baseUser = (over = {}) => ({
    streak: 0,
    maxStreak: 0,
    streakFreezes: 0,
    streakHistory: [false, false, false, false, false, false, false],
    lastActiveDate: null,
    ...over
});

// 1. Pengguna baru: step pertama membuka runtunan di angka 1.
{
    const u = baseUser();
    makeStreak(u, '2026-08-06').markDailyProgress();
    assert.equal(u.streak, 1);
    assert.equal(u.maxStreak, 1);
    assert.equal(u.lastActiveDate, '2026-08-06');
    assert.equal(u.streakHistory.at(-1), true);
}

// 2. Idempoten: menyelesaikan lesson kedua di hari yang sama tidak menambah runtunan.
{
    const u = baseUser({ streak: 4, maxStreak: 4, lastActiveDate: '2026-08-06' });
    const added = makeStreak(u, '2026-08-06').markDailyProgress();
    assert.equal(added, false);
    assert.equal(u.streak, 4);
}

// 3. Hari berurutan menambah runtunan.
{
    const u = baseUser({ streak: 4, maxStreak: 4, lastActiveDate: '2026-08-05' });
    makeStreak(u, '2026-08-06').markDailyProgress();
    assert.equal(u.streak, 5);
    assert.equal(u.maxStreak, 5);
}

// 4. Bolos satu hari tanpa rukhsah: runtunan putus, mulai lagi dari 1.
{
    const u = baseUser({ streak: 9, maxStreak: 9, lastActiveDate: '2026-08-04' });
    makeStreak(u, '2026-08-06').markDailyProgress();
    assert.equal(u.streak, 1);
    assert.equal(u.maxStreak, 9, 'rekor terbaik tidak boleh ikut turun');
}

// 5. Bolos satu hari dengan rukhsah: runtunan lanjut, rukhsah terpakai satu.
{
    const u = baseUser({ streak: 9, maxStreak: 9, streakFreezes: 1, lastActiveDate: '2026-08-04' });
    makeStreak(u, '2026-08-06').markDailyProgress();
    assert.equal(u.streak, 10);
    assert.equal(u.streakFreezes, 0);
}

// 6. Rukhsah hanya menutup satu hari — bolos dua hari tetap putus.
{
    const u = baseUser({ streak: 9, maxStreak: 9, streakFreezes: 1, lastActiveDate: '2026-08-03' });
    makeStreak(u, '2026-08-06').markDailyProgress();
    assert.equal(u.streak, 1);
    assert.equal(u.streakFreezes, 1, 'rukhsah tidak terpakai kalau tidak menolong');
}

// 7. evaluateStreak() dipanggil berulang saat aplikasi dibuka ulang di hari yang sama
//    tidak boleh menghabiskan rukhsah lebih dari satu.
{
    const u = baseUser({ streak: 9, streakFreezes: 2, lastActiveDate: '2026-08-04' });
    const s = makeStreak(u, '2026-08-06');
    s.evaluateStreak();
    s.evaluateStreak();
    s.evaluateStreak();
    assert.equal(u.streakFreezes, 1);
    assert.equal(u.streak, 9);
}

console.log('streak: 7/7 lolos');
