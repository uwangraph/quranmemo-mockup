// Self-check logika runtunan (streak). Jalankan: node src/lib/streak.test.js
//
// createAppState() bergantung pada rune $state yang hanya ada setelah kompilasi Svelte,
// jadi berkas ini menguji aturan hariannya lewat replika murni dari app.svelte.js.
// Kalau aturan di sana berubah, samakan replika di bawah ini.
import assert from 'node:assert/strict';

const DAY_MS = 86400000;
const GRACE_HOURS = 4;
const dayKey = (date) => date.toISOString().split('T')[0];

// Replika streakDayKey(): pukul 00.00–03.59 masih terhitung hari sebelumnya.
export function streakDayKey(isoInstant) {
    return dayKey(new Date(Date.parse(isoInstant) - GRACE_HOURS * 3600000));
}

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
        const streakLost = user.streak;
        user.streak = 0;
        // Hanya saat runtunan benar-benar baru putus; pemanggilan ulang di hari yang
        // sama tidak boleh menghapus tawaran penebusan yang sedang berjalan.
        if (streakLost > 0) {
            user.pendingRepair = (gap === 2 && user.streakRepairsUsed < 2)
                ? { startedDay: today, targetsDone: 0, lostStreak: streakLost }
                : null;
        }
    }

    function markDailyProgress() {
        if (user.dailyTargetsDone.day !== today) user.dailyTargetsDone = { day: today, count: 0 };
        user.dailyTargetsDone.count += 1;

        const offer = user.pendingRepair?.startedDay === today ? user.pendingRepair : null;
        if (offer) {
            offer.targetsDone = user.dailyTargetsDone.count;
            if (offer.targetsDone >= 2) {
                user.streak = offer.lostStreak;
                user.streakRepairsUsed += 1;
                user.pendingRepair = null;
            }
        }

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
    streakRepairsUsed: 0,
    pendingRepair: null,
    dailyTargetsDone: { day: null, count: 0 },
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

// 8. Grace Period: hafalan pukul 02.00 masih dihitung sebagai hari sebelumnya,
//    sehingga penghafal malam tidak kehilangan runtunan (STREAK.md).
{
    assert.equal(streakDayKey('2026-08-07T02:30:00Z'), '2026-08-06');
    assert.equal(streakDayKey('2026-08-07T04:00:00Z'), '2026-08-07');
    assert.equal(streakDayKey('2026-08-07T23:59:00Z'), '2026-08-07');
}

// 9. Tebus Hari: satu target belum cukup — streak baru pulih setelah target kedua.
{
    const u = baseUser({ streak: 12, maxStreak: 12, lastActiveDate: '2026-08-04' });
    const s = makeStreak(u, '2026-08-06');
    s.evaluateStreak();
    assert.equal(u.streak, 0);
    assert.equal(u.pendingRepair.lostStreak, 12);

    s.markDailyProgress();
    assert.equal(u.streak, 1, 'target pertama hanya membuka runtunan baru');
    assert.ok(u.pendingRepair, 'penebusan masih berjalan');

    s.markDailyProgress();
    assert.equal(u.streak, 12, 'target kedua mengembalikan runtunan lama');
    assert.equal(u.streakRepairsUsed, 1);
    assert.equal(u.pendingRepair, null);
}

// 10. Jendela Tebus Hari hanya 24 jam: bolos dua hari tidak menawarkan penebusan.
{
    const u = baseUser({ streak: 12, maxStreak: 12, lastActiveDate: '2026-08-03' });
    makeStreak(u, '2026-08-06').evaluateStreak();
    assert.equal(u.streak, 0);
    assert.equal(u.pendingRepair, null);
}

// 11. Tebus Hari maksimal 2× per bulan.
{
    const u = baseUser({ streak: 12, maxStreak: 12, streakRepairsUsed: 2, lastActiveDate: '2026-08-04' });
    makeStreak(u, '2026-08-06').evaluateStreak();
    assert.equal(u.pendingRepair, null, 'jatah penebusan bulan ini sudah habis');
}

console.log('streak: 11/11 lolos');
