// Self-check modul Tadabbur. Jalankan: node src/lib/tadabbur.test.js
//
// createAppState() memakai rune $state yang hanya ada setelah kompilasi Svelte,
// jadi aturan jurnalnya diuji lewat replika murni — pola yang sama seperti
// streak.test.js. Kalau aturan di app.svelte.js berubah, samakan replika di bawah.
import assert from 'node:assert/strict';
import { TADABBUR_STEPS, TADABBUR_THEMES, TADABBUR_SEGMENTS, themeIsReady, JOURNAL_PROMPTS } from './data/tadabburThemes.js';
import en from './locales/en.js';
import TAFSIR from './data/tafsir.generated.js';
import { SURAHS } from './data/surahs.js';

// ── Replika jurnal (app.svelte.js) ─────────────────────────────────────────
function makeJournal(user, now = '2026-08-19T10:00:00.000Z') {
    const key = (s, v) => `${s}:${v}`;
    return {
        get: (s, v) => user.tadabburJournal[key(s, v)] ?? null,
        save(s, v, patch) {
            const k = key(s, v);
            const prev = user.tadabburJournal[k] ?? { createdAt: now };
            user.tadabburJournal[k] = { ...prev, ...patch, surahId: s, verseNumber: v, updatedAt: now };
        },
        complete(s, v) {
            const k = key(s, v);
            const e = user.tadabburJournal[k];
            if (!e || e.completedAt) return false;
            user.tadabburJournal[k] = { ...e, completedAt: now };
            return true;
        },
        history: () => Object.values(user.tadabburJournal).filter((e) => e.completedAt)
    };
}

const blank = () => ({ tadabburJournal: {} });

// ── §1.1: tujuh langkah, sesuai urutan dokumen ────────────────────────────
{
    assert.equal(TADABBUR_STEPS.length, 7, 'framework Ust. Pur punya tepat 7 langkah');
    assert.deepEqual(
        TADABBUR_STEPS.map((s) => s.id),
        ['baca', 'tafsir', 'ulama', 'faktual', 'diri', 'simpulkan', 'amal'],
        'urutan langkah harus mengikuti §1.1'
    );
    // Langkah terakhir adalah amal: "tadabbur tanpa amal adalah tadabbur yang belum selesai".
    assert.equal(TADABBUR_STEPS.at(-1).id, 'amal');
}

// ── §3.3: jurnal harus benar-benar tersimpan, bukan hilang saat layar ditutup ──
{
    const u = blank();
    const j = makeJournal(u);
    j.save('an-nas', 1, { diri: 'Aku sering cemas berlebihan.' });
    assert.equal(j.get('an-nas', 1).diri, 'Aku sering cemas berlebihan.');

    // Menyimpan sebagian tidak boleh menghapus isian langkah sebelumnya.
    j.save('an-nas', 1, { hikmah: 'Perlindungan sejati hanya dari Allah.' });
    assert.equal(j.get('an-nas', 1).diri, 'Aku sering cemas berlebihan.',
        'menyimpan hikmah tidak boleh menghapus refleksi diri');
    assert.equal(j.get('an-nas', 1).hikmah, 'Perlindungan sejati hanya dari Allah.');
}

// ── Jurnal terpisah per ayat ───────────────────────────────────────────────
{
    const u = blank();
    const j = makeJournal(u);
    j.save('an-nas', 1, { diri: 'catatan ayat 1' });
    j.save('an-nas', 2, { diri: 'catatan ayat 2' });
    assert.equal(j.get('an-nas', 1).diri, 'catatan ayat 1');
    assert.equal(j.get('an-nas', 2).diri, 'catatan ayat 2', 'ayat lain punya jurnalnya sendiri');
}

// ── Sesi selesai hanya dihitung sekali ─────────────────────────────────────
{
    const u = blank();
    const j = makeJournal(u);
    j.save('an-nas', 1, { hikmah: 'x', amal: 'y' });
    assert.equal(j.complete('an-nas', 1), true);
    assert.equal(j.complete('an-nas', 1), false, 'sesi yang sama tidak boleh dihitung dua kali');
    assert.equal(j.history().length, 1);
}

// ── Riwayat hanya berisi sesi yang tuntas ──────────────────────────────────
{
    const u = blank();
    const j = makeJournal(u);
    j.save('an-nas', 1, { diri: 'baru mulai' });          // belum selesai
    j.save('al-falaq', 1, { hikmah: 'a', amal: 'b' });
    j.complete('al-falaq', 1);
    assert.equal(j.history().length, 1, 'sesi yang belum tuntas tidak masuk riwayat');
    assert.equal(j.history()[0].surahId, 'al-falaq');
}

// ── §4.4: tema tanpa rujukan indeks tidak boleh diklaim siap ───────────────
{
    assert.equal(TADABBUR_THEMES.length, 12, '§2.2 mencantumkan 12 tema utama');
    // Indeks Quran belum ada di repo, jadi tidak boleh ada tema yang mengaku siap
    // dengan ayat hasil tebakan.
    const claimingReady = TADABBUR_THEMES.filter(themeIsReady);
    assert.deepEqual(claimingReady, [],
        'tema tidak boleh punya ayat sebelum Indeks Quran tersedia');
}

// ── §2.3: prompt jurnal tersedia untuk ketiga segmen usia ─────────────────
// Datanya kini menyimpan kunci terjemahan, bukan kalimat. Memastikan kuncinya ada
// saja tidak cukup — kunci yang salah ketik tetap lolos dan muncul mentah di layar,
// jadi setiap kunci diperiksa sampai ke kamusnya.
{
    for (const field of ['faktual', 'diri']) {
        for (const seg of ['anak', 'remaja', 'dewasa']) {
            const key = JOURNAL_PROMPTS[field][seg];
            assert.ok(key, `prompt ${field} untuk segmen ${seg} hilang`);
            assert.ok(en[key], `kunci prompt ${key} tidak ada di kamus`);
        }
    }
}

// ── Tema dan segmen memakai kunci yang benar-benar ada di kamus ───────────
{
    for (const theme of TADABBUR_THEMES) {
        assert.ok(en[theme.nameKey], `kunci nama tema ${theme.id} tidak ada di kamus`);
        assert.ok(en[theme.indexKey], `kunci indeks tema ${theme.id} tidak ada di kamus`);
    }
    for (const seg of TADABBUR_SEGMENTS) {
        assert.ok(en[seg.nameKey], `kunci nama segmen ${seg.id} tidak ada di kamus`);
        assert.ok(en[seg.ageKey], `kunci usia segmen ${seg.id} tidak ada di kamus`);
    }
}

// ── Korpus tafsir sejalan dengan konten ayat ──────────────────────────────
{
    let missing = [];
    let counted = 0;
    for (const surah of Object.values(SURAHS)) {
        for (const v of surah.verses) {
            counted++;
            const entry = TAFSIR[`${surah.number}:${v.verseNumber}`];
            if (!entry?.id?.text) missing.push(`${surah.name}:${v.verseNumber}`);
            // Sumbernya wajib tercatat — layar menyebutkannya secara terbuka.
            else if (!entry.id.source) missing.push(`${surah.name}:${v.verseNumber} (tanpa sumber)`);
        }
    }
    assert.deepEqual(missing.slice(0, 5), [], `ayat tanpa tafsir: ${missing.length}`);
    console.log(`tadabbur: ${counted} ayat punya tafsir bersumber`);
}

console.log('tadabbur: semua kasus lolos');
