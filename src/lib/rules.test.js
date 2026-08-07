// Self-check aturan XP, setoran, dan Murajaah Alert. Jalankan: node src/lib/rules.test.js
//
// app.svelte.js memanggil createAppState() saat diimpor, dan rune $state hanya ada
// setelah kompilasi Svelte — jadi berkas ini menguji aturannya lewat replika murni,
// sama seperti streak.test.js. Kalau aturan di sana berubah, samakan replika di bawah.
import assert from 'node:assert/strict';

const DAY_MS = 86400000;
const MURAJAAH_DUE_DAYS = 14;

// Replika XP dari docs/XP.md.
const XP = { step: 4, dailyMissionTotal: 35, checkpoint: 100, setoran: 50, mumtaz: 75, halaqahPerSetoran: 25 };

function surahCompletionXp(ayatCount) {
    if (ayatCount <= 20) return 50;
    if (ayatCount <= 60) return 80;
    if (ayatCount <= 80) return 125;
    if (ayatCount <= 100) return 150;
    if (ayatCount <= 150) return 180;
    if (ayatCount <= 200) return 175;
    return 250;
}

function streakGemsFor(day) {
    if (day >= 22) return 3;
    if (day >= 15) return 5;
    if (day >= 8) return 4;
    return 3;
}

// Replika recordSetoran() + markSurahReviewed(), dengan "hari ini" bisa disuntik.
function makeSetoran(user, today) {
    function recordSetoran({ sessionId, surah, grade = 'jayyid' }) {
        if (!sessionId || user.setoranIds.includes(sessionId)) return null;
        const bonus = grade === 'mumtaz' ? XP.mumtaz : 0;
        const gained = XP.setoran + bonus;
        user.xp += gained;
        user.halaqahXp += XP.halaqahPerSetoran;
        user.setoranIds = [...user.setoranIds, sessionId];
        if (surah) user.murajaahLog = { ...user.murajaahLog, [surah]: today };
        return { setoran: XP.setoran, bonus, total: gained, halaqah: XP.halaqahPerSetoran };
    }

    function murajaahDue() {
        return Object.entries(user.murajaahLog ?? {})
            .map(([surah, date]) => ({ surah, date, days: Math.round((Date.parse(today) - Date.parse(date)) / DAY_MS) }))
            .filter((x) => x.days > MURAJAAH_DUE_DAYS)
            .sort((a, b) => b.days - a.days);
    }

    return { recordSetoran, murajaahDue };
}

const baseUser = (over = {}) => ({ xp: 0, halaqahXp: 0, setoranIds: [], murajaahLog: {}, ...over });
const daysAgo = (today, n) => new Date(Date.parse(today) - n * DAY_MS).toISOString().split('T')[0];

// ── XP.md: tabel penyelesaian surah ────────────────────────────────────────
{
    assert.equal(surahCompletionXp(1), 50);
    assert.equal(surahCompletionXp(20), 50);
    assert.equal(surahCompletionXp(21), 80);
    assert.equal(surahCompletionXp(60), 80);
    assert.equal(surahCompletionXp(80), 125);
    assert.equal(surahCompletionXp(100), 150);
    assert.equal(surahCompletionXp(150), 180);
    // Tabel XP.md memang turun di tingkat ini; dikunci agar perubahannya disengaja.
    assert.equal(surahCompletionXp(200), 175);
    assert.equal(surahCompletionXp(286), 250);
}

// ── STREAK.md: hadiah gems per fase runtunan ───────────────────────────────
{
    assert.equal(streakGemsFor(1), 3);
    assert.equal(streakGemsFor(7), 3);
    assert.equal(streakGemsFor(8), 4);
    assert.equal(streakGemsFor(14), 4);
    assert.equal(streakGemsFor(15), 5);
    assert.equal(streakGemsFor(21), 5);
    assert.equal(streakGemsFor(22), 3);
    assert.equal(streakGemsFor(30), 3);
}

// ── XP.md: misi harian satu paket bernilai 35 XP ───────────────────────────
{
    const quests = [{ xp: 15 }, { xp: 20 }];
    assert.equal(quests.reduce((n, q) => n + q.xp, 0), XP.dailyMissionTotal);
}

// ── XP.md: setoran biasa = 50 XP, halaqah dapat 25 XP ──────────────────────
{
    const u = baseUser();
    const r = makeSetoran(u, '2026-08-07').recordSetoran({ sessionId: 's1', surah: 'Al-Mulk', grade: 'jayyid' });
    assert.equal(r.total, 50);
    assert.equal(u.xp, 50);
    assert.equal(u.halaqahXp, 25);
}

// ── XP.md: nilai mumtaz menambah 75 XP di atas XP setoran ──────────────────
{
    const u = baseUser();
    const r = makeSetoran(u, '2026-08-07').recordSetoran({ sessionId: 's1', surah: 'Al-Mulk', grade: 'mumtaz' });
    assert.equal(r.bonus, 75);
    assert.equal(u.xp, 125);
}

// ── Idempoten: membuka ulang layar ulasan sesi yang sama tidak membayar dua kali.
{
    const u = baseUser();
    const s = makeSetoran(u, '2026-08-07');
    s.recordSetoran({ sessionId: 's1', surah: 'Al-Mulk', grade: 'mumtaz' });
    const second = s.recordSetoran({ sessionId: 's1', surah: 'Al-Mulk', grade: 'mumtaz' });
    assert.equal(second, null);
    assert.equal(u.xp, 125);
    assert.equal(u.halaqahXp, 25);
}

// ── STREAK.md: hanya surah yang lewat 14 hari yang jadi prioritas revisi ───
{
    const today = '2026-08-07';
    const u = baseUser({
        murajaahLog: {
            'Al-Mulk': daysAgo(today, 18),
            'Ad-Dhuha': daysAgo(today, 22),
            'Al-Insyirah': daysAgo(today, 3),
            'An-Naba': daysAgo(today, 14)   // tepat 14 hari — belum lewat
        }
    });
    const due = makeSetoran(u, today).murajaahDue();
    assert.deepEqual(due.map((d) => d.surah), ['Ad-Dhuha', 'Al-Mulk'], 'yang paling lama menganggur di urutan pertama');
}

// ── Setoran adalah verifikasi terbaru: surahnya keluar dari daftar revisi ──
{
    const today = '2026-08-07';
    const u = baseUser({ murajaahLog: { 'Al-Mulk': daysAgo(today, 18) } });
    const s = makeSetoran(u, today);
    assert.equal(s.murajaahDue().length, 1);
    s.recordSetoran({ sessionId: 's1', surah: 'Al-Mulk', grade: 'jayyid' });
    assert.equal(s.murajaahDue().length, 0, 'setoran menyetel ulang hitungan murajaah surah itu');
}

console.log('rules: 8/8 lolos');
