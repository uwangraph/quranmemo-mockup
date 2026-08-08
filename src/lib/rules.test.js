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

// ── STREAK.md: grafik pekanan harus mencerminkan tanggal, bukan urutan ────
// Replika weekDays(): tujuh hari terakhir, tiap kolom ditentukan tanggalnya.
function weekDays(activeDays, today) {
    const t = Date.parse(today);
    const active = new Set(activeDays);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(t - (6 - i) * DAY_MS);
        const key = d.toISOString().split('T')[0];
        return { date: key, dow: d.getUTCDay(), done: active.has(key), isToday: i === 6 };
    });
}

{
    const today = '2026-08-07';
    // Aktif hari ini, lalu bolong tiga hari, lalu aktif tiga hari sebelumnya.
    const active = [daysAgo(today,6), daysAgo(today,5), daysAgo(today,4), today];
    const w = weekDays(active, today);
    assert.deepEqual(w.map(d => d.done), [true, true, true, false, false, false, true],
        'hari bolong wajib tampil sebagai bolong, bukan tergeser hilang');
    assert.equal(w[6].isToday, true);
    assert.equal(w[6].date, today);
    // Kolom paling kiri adalah enam hari lalu, bukan slot tetap Senin.
    assert.equal(w[0].date, daysAgo(today, 6));
}

{
    // Pengguna yang lama tidak hafalan: seluruh pekan kosong, tidak ada sisa lama.
    const today = '2026-08-07';
    const w = weekDays([daysAgo(today, 30)], today);
    assert.deepEqual(w.map(d => d.done), [false, false, false, false, false, false, false]);
}

// ── LEARDERBOARD.md: XP dipisah per periode, bukan total yang sama diulang ──
function weekKeyOf(day) {
    const d = new Date(Date.parse(day));
    const shift = (d.getUTCDay() + 6) % 7;   // 0 = Senin
    return new Date(d.getTime() - shift * DAY_MS).toISOString().split('T')[0];
}

function makeXp(user, today) {
    const wk = () => weekKeyOf(today), mk = () => today.slice(0, 7);
    return {
        addXp(n) {
            const b = user.xpBuckets;
            if (b.weekKey !== wk()) { b.weekKey = wk(); b.week = 0; }
            if (b.monthKey !== mk()) { b.monthKey = mk(); b.month = 0; }
            b.week += n; b.month += n; b.event += n; user.xp += n;
        },
        forPeriod(p) {
            const b = user.xpBuckets;
            if (p === 'weekly') return b.weekKey === wk() ? b.week : 0;
            if (p === 'monthly') return b.monthKey === mk() ? b.month : 0;
            if (p === 'event') return b.event;
            return user.xp;
        }
    };
}

{
    const u = { xp: 0, xpBuckets: { weekKey: null, week: 0, monthKey: null, month: 0, event: 0 } };
    const x = makeXp(u, '2026-08-07');     // Jumat
    x.addXp(50); x.addXp(30);
    assert.equal(x.forPeriod('weekly'), 80);
    assert.equal(x.forPeriod('monthly'), 80);
    assert.equal(x.forPeriod('alltime'), 80);
}

{
    // Pekan berganti: ember pekanan kosong lagi, bulanan & all-time tetap.
    const u = { xp: 200, xpBuckets: { weekKey: weekKeyOf('2026-08-07'), week: 200, monthKey: '2026-08', month: 200, event: 200 } };
    const x = makeXp(u, '2026-08-12');     // Rabu pekan berikutnya
    assert.equal(x.forPeriod('weekly'), 0, 'pekanan reset setiap Senin');
    assert.equal(x.forPeriod('monthly'), 200, 'bulanan belum reset');
    assert.equal(x.forPeriod('alltime'), 200);
    x.addXp(10);
    assert.equal(x.forPeriod('weekly'), 10);
    assert.equal(x.forPeriod('monthly'), 210);
}

{
    // Bulan berganti: bulanan kosong, all-time tidak pernah reset.
    const u = { xp: 500, xpBuckets: { weekKey: weekKeyOf('2026-08-28'), week: 90, monthKey: '2026-08', month: 500, event: 500 } };
    const x = makeXp(u, '2026-09-03');
    assert.equal(x.forPeriod('monthly'), 0);
    assert.equal(x.forPeriod('alltime'), 500);
}

// ── LEVELLING.md: surah tanpa konten tidak boleh diganti diam-diam ────────
{
    // Replika surahByName(): pencocokan longgar terhadap penulisan nama di dokumen.
    const SURAHS = { 'al-insyirah': { id: 'al-insyirah', verses: new Array(8) } };
    const surahByName = (name) => {
        if (!name) return null;
        const key = String(name).toLowerCase().replace(/[^a-z]/g, '');
        return Object.values(SURAHS).find(s => s.id.replace(/[^a-z]/g, '') === key) ?? null;
    };

    assert.ok(surahByName('Al-Insyirah'), 'surah dengan konten harus ketemu');
    assert.equal(surahByName('Al-Mulk'), null, 'surah tanpa konten wajib null, bukan surah lain');
    assert.equal(surahByName('An-Nas'), null);
    assert.equal(surahByName(null), null);
}

// ── Progres dicatat per surah, tidak lagi satu penghitung global ──────────
{
    const progress = { surahs: {} };
    const advance = (id, i) => { if ((progress.surahs[id] ?? 0) === i) progress.surahs[id] = i + 1; };
    advance('al-insyirah', 0);
    advance('al-insyirah', 1);
    advance('al-mulk', 0);
    assert.equal(progress.surahs['al-insyirah'], 2);
    assert.equal(progress.surahs['al-mulk'], 1, 'progres surah lain terpisah');
    advance('al-insyirah', 5);
    assert.equal(progress.surahs['al-insyirah'], 2, 'lompat ayat tidak menambah progres');
}

// ── LEVELLING.md: mini target hanya "selesai" kalau benar-benar dikerjakan ──
// Replika ladderState(): target tanpa konten bukan selesai dan bukan terkunci.
function ladderState(ladder, completedTargets, hasContent) {
    const done = new Set(completedTargets);
    const targets = ladder.surahs.map((name, index) => ({
        index, name, available: hasContent(name), done: done.has(index)
    }));
    const playable = targets.find(t => !t.done && t.available) ?? null;
    return {
        targets, playable,
        pending: targets.filter(t => !t.done && !t.available),
        availableAllDone: targets.every(t => t.done || !t.available)
    };
}

{
    const ladder = { surahs: ['An-Nas', 'Al-Falaq', 'Al-Insyirah', 'Ad-Dhuha'] };
    const has = (n) => n === 'Al-Insyirah';

    const st = ladderState(ladder, [], has);
    assert.equal(st.playable.name, 'Al-Insyirah', 'target aktif adalah yang kontennya ada');
    assert.deepEqual(st.targets.map(t => t.done), [false, false, false, false],
        'tidak ada satu pun target diklaim selesai hanya karena posisi awal');
    assert.equal(st.pending.length, 3, 'tiga target menunggu konten');
    assert.equal(st.availableAllDone, false);
}

{
    // Setelah satu-satunya target bertanggung konten selesai: tidak ada lagi yang
    // bisa dimainkan, dan gerbang TIDAK boleh terbuka karena masih ada yang belum.
    const ladder = { surahs: ['An-Nas', 'Al-Insyirah'] };
    const has = (n) => n === 'Al-Insyirah';
    const st = ladderState(ladder, [1], has);
    assert.equal(st.playable, null);
    assert.equal(st.availableAllDone, true, 'semua yang tersedia sudah tuntas');
    assert.equal(st.targets.every(t => t.done), false, 'gerbang tetap tertutup');
}

{
    // Gerbang baru terbuka kalau seluruh mini target tuntas.
    const ladder = { surahs: ['An-Nas', 'Al-Insyirah'] };
    const st = ladderState(ladder, [0, 1], () => true);
    assert.equal(st.targets.every(t => t.done), true);
    assert.equal(st.playable, null);
}

console.log('rules: semua kasus lolos');
