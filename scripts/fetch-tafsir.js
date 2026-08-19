// Pembangkit korpus tafsir untuk modul Tadabbur.
//
// Jalankan: node scripts/fetch-tafsir.js            (semua surah di registry)
//           node scripts/fetch-tafsir.js 94 93      (surah tertentu saja)
//
// docs/TADABBUR.md §4.1 menetapkan aturan yang tidak bisa dilanggar: konten hanya
// boleh berasal dari korpus yang sudah divalidasi ulama, dan lebih baik tidak
// menjawab daripada menjawab dengan tidak sahih. Karena itu tafsir di sini DIAMBIL
// apa adanya dari kitab tafsir terbitan lewat api.alquran.cloud — tidak diringkas,
// tidak disusun ulang, dan tidak pernah ditulis dari ingatan.
//
// Sumber yang dipakai:
//   - id.jalalayn  : Tafsir Jalalayn (Indonesia)
//   - ar.muyassar  : Tafsir Al-Muyassar (Arab) — termasuk daftar §4.4
//
// Catatan keterbatasan: §4.4 juga menyebut Tafsir As-Sa'di, Ibnu Katsir, dan
// At-Tabari. Ketiganya tidak tersedia di API ini, jadi belum masuk korpus. Setiap
// kutipan menyimpan nama sumbernya agar layar bisa menyebutkannya secara terbuka,
// dan ayat tanpa tafsir tidak akan dikarang — layarnya menyatakan belum tersedia.
import fs from 'node:fs';
import path from 'node:path';
import { SURAHS } from '../src/lib/data/surahs.js';

const API = 'https://api.alquran.cloud/v1/surah';

const EDITIONS = [
    { id: 'id.jalalayn', lang: 'id', name: 'Tafsir Jalalain' },
    { id: 'ar.muyassar', lang: 'ar', name: 'Tafsir Al-Muyassar' }
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// API membatasi laju permintaan; tanpa percobaan ulang, pengambilan puluhan surah
// gagal di tengah dan menyisakan korpus yang tidak lengkap.
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

// Tafsir Jalalain menyisipkan penanda kurung untuk potongan ayat yang sedang
// dijelaskan. Dibiarkan apa adanya — merapikannya berarti menyunting teks tafsir.
const clean = (t) => String(t).replace(/\s+/g, ' ').trim();

async function fetchSurahTafsir(number) {
    const out = {};
    for (const ed of EDITIONS) {
        const data = await edition(number, ed.id);
        data.ayahs.forEach((a) => {
            const key = `${number}:${a.numberInSurah}`;
            out[key] ??= {};
            out[key][ed.lang] = { source: ed.name, text: clean(a.text) };
        });
        await sleep(120);
    }
    return out;
}

// ── CLI ────────────────────────────────────────────────────────────────────
const requested = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= 114);
const numbers = requested.length
    ? requested
    : [...new Set(Object.values(SURAHS).map((s) => s.number))].sort((a, b) => a - b);

const corpus = {};
for (const n of numbers) {
    const entries = await fetchSurahTafsir(n);
    Object.assign(corpus, entries);
    console.error(`  ${String(n).padStart(3)}  ${Object.keys(entries).length} ayat`);
}

const banner =
    `// DIBANGKITKAN OTOMATIS oleh scripts/fetch-tafsir.js — jangan disunting tangan.\n` +
    `// Korpus tafsir untuk modul Tadabbur, dikunci per "surah:ayat".\n` +
    `// Sumber: ${EDITIONS.map((e) => e.name).join(', ')} via api.alquran.cloud.\n` +
    `// Teks diambil apa adanya; tidak diringkas dan tidak disusun ulang (TADABBUR.md §4.1).\n\n`;

fs.writeFileSync(
    path.join(process.cwd(), 'src/lib/data/tafsir.generated.js'),
    banner + 'export default ' + JSON.stringify(corpus, null, 1) + ';\n'
);
console.error(`\n${Object.keys(corpus).length} ayat -> src/lib/data/tafsir.generated.js`);
