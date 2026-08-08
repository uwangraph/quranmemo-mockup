// Pembangkit konten hafalan dari sumber terverifikasi.
//
// Jalankan: node scripts/fetch-surah.js 114 113 112 ...
//
// Teks Arab, transliterasi, dan terjemahan diambil apa adanya dari API dan tidak
// pernah disusun sendiri. Sumbernya:
//   - Arab          : quran-uthmani (Tanzil, riwayat Hafs)
//   - Transliterasi : en.transliteration
//   - Terjemahan ID : id.indonesian (Kemenag)
// Naskah Al-Quran terlalu penting untuk ditulis dari ingatan; berkas ini ada supaya
// penambahan surah menjadi proses yang dapat diulang dan diperiksa, bukan pengetikan.
//
// Data latihan (isian depan/tengah/akhir beserta pengecohnya) DITURUNKAN secara
// mekanis dari teks yang sudah diambil — seluruh pilihan jawaban adalah potongan
// kata dari ayat surah itu sendiri, bukan karangan.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.alquran.cloud/v1/surah';
const EDITIONS = { arabic: 'quran-uthmani', latin: 'en.transliteration' };

// Terjemahan resmi per bahasa antarmuka. Untuk locale Arab dipakai teks ayat dalam
// ortografi sederhana, mengikuti konvensi yang sudah ada di berkas locale: makna
// ayat dalam bahasa Arab adalah ayat itu sendiri, bukan tafsir yang jauh lebih panjang.
const TRANSLATIONS = {
    en: 'en.sahih',          // Saheeh International
    id: 'id.indonesian',     // Kemenag
    ms: 'ms.basmeih',        // Abdullah Muhammad Basmeih
    fr: 'fr.hamidullah',     // Muhammad Hamidullah
    ha: 'ha.gumi',           // Abubakar Mahmoud Gumi
    ar: 'quran-simple'
};

// API menyisipkan basmalah di awal ayat 1 setiap surah kecuali Al-Fatihah dan
// At-Taubah. Basmalah bukan bagian ayat 1 pada surah-surah tersebut.
//
// Pemotongan dilakukan per token, bukan pencocokan pola: penulisan diakritik
// basmalah berbeda antar edisi, dan pola yang meleset akan diam-diam menyisakan
// basmalah di dalam ayat pertama.
const BASMALAH_WORDS = 4;

// Harakat dilucuti sebelum mencocokkan. Sebagian surah menulis basmalah dengan
// syaddah (بِّسْمِ), sehingga pencocokan langsung ke bentuk berharakat meleset dan
// basmalah tertinggal di dalam ayat pertama.
const stripHarakat = (t) => t
    .replace(/[\u064B-\u0652\u0653-\u0655\u0670\u06D6-\u06ED]/g, '')
    .replace(/[\u0671\u0622\u0623\u0625]/g, 'ا')
    .replace(/\u0670/g, '');

const startsWithBasmalah = (t) => /^بسم\s+الله/.test(stripHarakat(t).replace(/\s+/g, ' ').trim());
const startsWithBasmalahLatin = (t) => /^bis?mi/i.test(t);

function dropBasmalah(text, isLatin) {
    const hit = isLatin ? startsWithBasmalahLatin(text) : startsWithBasmalah(text);
    if (!hit) return text;
    return text.split(/\s+/).slice(BASMALAH_WORDS).join(' ');
}

// Tanda mushaf yang berdiri sendiri — sajdah (۩) dan rub' el hizb (۞) — bukan kata
// yang dilafalkan. Membiarkannya membuat jumlah kata bertambah, sehingga audio
// per-kata meleset satu posisi dan pilihan latihan berisi simbol, bukan kata.
const ARABIC_LETTER = /[\u0621-\u064A]/;
const isWord = (token) => ARABIC_LETTER.test(token);
const toWords = (text) => text.split(/\s+/).filter(Boolean).filter(isWord);

const slug = (s) => s.toLowerCase().replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// API membatasi laju permintaan. Tanpa percobaan ulang, pengambilan puluhan surah
// gagal di tengah jalan dan menyisakan berkas hasil yang tidak lengkap.
async function edition(number, id, attempt = 0) {
    const r = await fetch(`${API}/${number}/${id}`);
    if (r.status === 429 || r.status >= 500) {
        if (attempt >= 5) throw new Error(`${id} surah ${number}: HTTP ${r.status} setelah 6 percobaan`);
        await sleep(1500 * (attempt + 1));
        return edition(number, id, attempt + 1);
    }
    if (!r.ok) throw new Error(`${id} surah ${number}: HTTP ${r.status}`);
    const j = await r.json();
    if (j.code !== 200) throw new Error(`${id} surah ${number}: ${j.status}`);
    return j.data;
}

// Ambil n pengecoh dari kumpulan kandidat, tanpa mengulang jawaban benar.
function distractors(pool, correct, n) {
    const seen = new Set([correct]);
    const out = [];
    for (const c of pool) {
        if (out.length >= n) break;
        if (seen.has(c)) continue;
        seen.add(c);
        out.push(c);
    }
    // Kalau surahnya terlalu pendek untuk menyediakan pengecoh, biarkan apa adanya —
    // lebih baik pilihan lebih sedikit daripada pengecoh yang dikarang.
    return out;
}

const shuffleStable = (arr, seed) =>
    arr.map((v, i) => [((i + 1) * 9301 + seed * 49297) % 233280, v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

function buildVerse(number, i, arabicText, latinText, words, latinWords, allWords, allPairs) {
    const n = words.length;
    const verseNumber = i + 1;
    const audio = `https://everyayah.com/data/Husary_128kbps/${String(number).padStart(3, '0')}${String(verseNumber).padStart(3, '0')}.mp3`;

    const frontCount = Math.min(2, Math.max(1, n - 1));
    const frontCorrect = words.slice(0, frontCount).join(' ');
    const frontBlank = [...Array(frontCount).fill('___'), ...words.slice(frontCount)].join(' ');
    const frontBlankLatin = [...Array(frontCount).fill('___'), ...latinWords.slice(frontCount)].join(' ');

    const endCorrect = words[n - 1];
    const endBlank = [...words.slice(0, n - 1), '___'].join(' ');
    const endBlankLatin = [...latinWords.slice(0, n - 1), '___'].join(' ');

    const mid = n > 2 ? Math.floor(n / 2) : 0;
    const middleCorrect = words[mid];
    const middleBlank = words.map((w, k) => (k === mid ? '___' : w)).join(' ');
    const middleBlankLatin = latinWords.map((w, k) => (k === mid ? '___' : w)).join(' ');

    const twoCount = Math.min(2, Math.max(1, n - 1));
    const twoCorrect = words.slice(0, twoCount);
    const twoBlank = [...Array(twoCount).fill('___'), ...words.slice(twoCount)].join(' ');

    const otherWords = allWords.filter((w) => !words.includes(w));
    const otherPairs = allPairs.filter((p) => p !== frontCorrect);

    return {
        verseNumber,
        arabic: arabicText,
        translationKey: `quran.${number}_${verseNumber}_translation`,
        transliteration: latinText,
        audio,
        words,
        frontBlank,
        frontBlankLatin,
        frontCorrect,
        frontChoices: shuffleStable([frontCorrect, ...distractors(otherPairs, frontCorrect, 2)], verseNumber),
        endBlank,
        endBlankLatin,
        endCorrect,
        endChoices: shuffleStable([endCorrect, ...distractors(otherWords, endCorrect, 2)], verseNumber + 1),
        middleBlank,
        middleBlankLatin,
        middleCorrect,
        middleChoices: shuffleStable([middleCorrect, ...distractors(otherWords, middleCorrect, 2)], verseNumber + 2),
        twoBlank,
        twoCorrect,
        twoChoices: shuffleStable([...twoCorrect, ...distractors(otherWords, twoCorrect[0], 2)], verseNumber + 3)
    };
}

export async function fetchSurah(number, displayName) {
    const langs = Object.keys(TRANSLATIONS);
    const ids = [EDITIONS.arabic, EDITIONS.latin, ...langs.map((l) => TRANSLATIONS[l])];
    const fetched = [];
    for (const id of ids) {
        fetched.push(await edition(number, id));
        await sleep(120);
    }
    const [ar, la, ...tr] = fetched;

    const keepBasmalah = number === 1 || number === 9;   // Al-Fatihah & At-Taubah
    const strip = (t, i, isLatin) => (i === 0 && !keepBasmalah ? dropBasmalah(t, isLatin) : t);
    const arabic = ar.ayahs.map((a, i) => toWords(strip(a.text, i, false)).join(' '));
    const latin = la.ayahs.map((a, i) => strip(a.text, i, true).trim());
    // Basmalah juga menempel di ayat 1 pada edisi terjemahan.
    const translations = {};
    langs.forEach((l, k) => {
        translations[l] = tr[k].ayahs.map((a, i) =>
            (i === 0 && !keepBasmalah && l === 'ar' ? dropBasmalah(a.text, false) : a.text).trim()
        );
    });

    const wordsPer = arabic.map((t) => t.split(/\s+/).filter(Boolean));
    const latinPer = latin.map((t) => t.split(/\s+/).filter(Boolean));
    wordsPer.forEach((w, i) => {
        if (w.join(' ') !== arabic[i]) throw new Error(`surah ${number} ayat ${i + 1}: pemecahan kata tidak konsisten`);
    });
    const allWords = [...new Set(wordsPer.flat())];
    const allPairs = [...new Set(wordsPer.filter((w) => w.length >= 2).map((w) => w.slice(0, 2).join(' ')))];

    const verses = arabic.map((t, i) =>
        buildVerse(number, i, t, latin[i], wordsPer[i], latinPer[i], allWords, allPairs)
    );

    // Nama tampilan berasal dari data tangga (LEVELLING.md), bukan dari API, supaya
    // penamaan di roadmap dan registry selalu cocok.
    const name = displayName || ar.englishName;
    return {
        id: slug(name),
        name,
        nameAr: ar.name,
        number,
        juz: ar.ayahs[0].juz,
        verses,
        translations
    };
}

// ── CLI ────────────────────────────────────────────────────────────────────
// Argumen: <nomor>[=<Nama tampilan>]  — nama diambil dari data tangga LEVELLING.md.
const args = process.argv.slice(2).map((a) => {
    const [num, name] = a.split('=');
    return { number: Number(num), name };
}).filter((a) => a.number >= 1 && a.number <= 114);

if (args.length === 0) {
    console.error('Pakai: node scripts/fetch-surah.js <nomor>[=<Nama>] [...]');
    process.exit(1);
}

const out = {};
const trans = {};
for (const { number, name } of args) {
    const s = await fetchSurah(number, name);
    const { translations, ...data } = s;
    out[s.id] = data;
    Object.entries(translations).forEach(([lang, list]) => {
        trans[lang] ??= {};
        list.forEach((t, i) => { trans[lang][`quran.${number}_${i + 1}_translation`] = t; });
    });
    console.error(`  ${String(number).padStart(3)} ${s.name.padEnd(14)} ${s.verses.length} ayat`);
}

// Ditulis sebagai modul JS, bukan JSON: impor JSON di Node ESM menuntut import
// attribute, sehingga berkas JSON tidak bisa dipakai skrip dan berkas uji biasa.
const banner = (what) =>
    `// DIBANGKITKAN OTOMATIS oleh scripts/fetch-surah.js — jangan disunting tangan.\n` +
    `// ${what}\n` +
    `// Sumber: Tanzil (quran-uthmani) via api.alquran.cloud, beserta edisi\n` +
    `// transliterasi dan terjemahan resmi tiap bahasa.\n\n`;

const dir = path.join(process.cwd(), 'src/lib/data');
fs.writeFileSync(path.join(dir, 'surahs.generated.js'),
    banner('Konten hafalan per surah.') + 'export default ' + JSON.stringify(out, null, 2) + ';\n');
fs.writeFileSync(path.join(dir, 'translations.generated.js'),
    banner('Terjemahan ayat per bahasa antarmuka.') + 'export default ' + JSON.stringify(trans, null, 2) + ';\n');
console.error(`\n${Object.keys(out).length} surah -> src/lib/data/surahs.generated.js`);
console.error(`${Object.keys(trans.id ?? {}).length} ayat x ${Object.keys(trans).length} bahasa -> src/lib/data/translations.generated.js`);
