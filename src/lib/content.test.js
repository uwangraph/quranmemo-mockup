// Pemeriksaan integritas konten hafalan. Jalankan: node src/lib/content.test.js
//
// Isi surahs.generated.js berasal dari sumber terverifikasi lewat scripts/fetch-surah.js.
// Berkas ini menjaga agar hasilnya tetap utuh: jumlah ayat sesuai mushaf, basmalah
// tidak menyelinap ke dalam ayat pertama, latihan selalu punya jawaban benarnya, dan
// setiap ayat punya terjemahan di seluruh bahasa antarmuka.
import assert from 'node:assert/strict';
import { SURAHS, surahByName } from './data/surahs.js';
import translations from './data/translations.generated.js';
import { BEGINNER_LADDERS } from './data/levelling.js';
import en from './locales/en.js';
import id from './locales/id.js';
import ms from './locales/ms.js';
import ha from './locales/ha.js';
import fr from './locales/fr.js';
import ar from './locales/ar.js';

// Terjemahan ayat bisa datang dari berkas locale (surah yang ditulis lebih dulu)
// atau dari berkas hasil bangkitan. Yang penting bagi pengguna adalah salah satunya
// ada; kalau tidak, layar menampilkan kunci mentah seperti "quran.93_4_translation".
const DICTS = { en, id, ms, ha, fr, ar };
const hasTranslation = (lang, key) => Boolean(DICTS[lang]?.[key] || translations[lang]?.[key]);
const fillBlanks = (template, answers) => {
    let result = template;
    for (const answer of answers) result = result.replace('___', answer);
    return result;
};

// Jumlah ayat resmi tiap surah, dipakai sebagai pemeriksaan silang terhadap API.
const AYAT = {
    114: 6, 113: 5, 112: 4, 111: 5, 110: 3, 109: 6, 108: 3, 107: 7, 106: 4, 105: 5,
    104: 9, 103: 3, 102: 8, 101: 11, 100: 11, 99: 8, 98: 8, 97: 5, 96: 19, 95: 8,
    94: 8, 93: 11, 92: 21, 91: 15, 90: 20, 89: 30, 88: 26, 87: 19, 86: 17, 85: 22,
    84: 25, 83: 36, 82: 19, 81: 29, 79: 46, 78: 40
};

const LANGS = Object.keys(translations);
let verseCount = 0;

for (const surah of Object.values(SURAHS)) {
    const where = `${surah.name} (${surah.number})`;

    assert.equal(surah.verses.length, AYAT[surah.number],
        `${where}: jumlah ayat tidak sesuai mushaf`);

    surah.verses.forEach((v, i) => {
        verseCount++;
        assert.equal(v.verseNumber, i + 1, `${where}: nomor ayat melompat`);
        assert.ok(v.arabic.trim(), `${where} ayat ${v.verseNumber}: teks Arab kosong`);
        assert.ok(!/^بِسْمِ\s+\S*للَّه/.test(v.arabic),
            `${where} ayat ${v.verseNumber}: basmalah menyelinap ke dalam ayat`);
        assert.ok(v.words.length > 0, `${where} ayat ${v.verseNumber}: daftar kata kosong`);

        // Tanda mushaf yang berdiri sendiri (sajdah ۩, rub' el hizb ۞) bukan kata.
        // Kalau ikut terhitung, audio per-kata meleset satu posisi dan pilihan
        // latihan berisi simbol alih-alih kata.
        v.words.forEach((w) => assert.match(w, /[\u0621-\u064A]/,
            `${where} ayat ${v.verseNumber}: "${w}" bukan kata, tanda mushaf ikut terhitung`));
        assert.ok(!/^بسم\s+الله/.test(v.arabic.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, '')),
            `${where} ayat ${v.verseNumber}: basmalah menyelinap ke dalam ayat`);
        assert.equal(v.words.join(' '), v.arabic,
            `${where} ayat ${v.verseNumber}: pemecahan kata tidak menyusun ulang ayatnya`);

        // Latihan tidak berguna kalau jawaban benarnya tidak ada di antara pilihan.
        assert.ok(v.frontChoices.includes(v.frontCorrect), `${where} ayat ${v.verseNumber}: frontCorrect hilang dari pilihan`);
        assert.ok(v.endChoices.includes(v.endCorrect), `${where} ayat ${v.verseNumber}: endCorrect hilang dari pilihan`);
        assert.ok(v.middleChoices.includes(v.middleCorrect), `${where} ayat ${v.verseNumber}: middleCorrect hilang dari pilihan`);
        v.twoCorrect.forEach((w) => assert.ok(v.twoChoices.includes(w),
            `${where} ayat ${v.verseNumber}: twoCorrect hilang dari pilihan`));

        // Kunci jawaban harus benar-benar menunjuk posisi yang ditanyakan,
        // bukan sekadar kata yang kebetulan ada di ayat.
        const frontCount = Math.min(2, Math.max(1, v.words.length - 1));
        const middleIndex = v.words.length > 2 ? Math.floor(v.words.length / 2) : 0;
        assert.equal(v.frontCorrect, v.words.slice(0, frontCount).join(' '),
            `${where} ayat ${v.verseNumber}: frontCorrect salah posisi`);
        assert.equal(v.endCorrect, v.words.at(-1),
            `${where} ayat ${v.verseNumber}: endCorrect salah posisi`);
        assert.equal(v.middleCorrect, v.words[middleIndex],
            `${where} ayat ${v.verseNumber}: middleCorrect salah posisi`);
        const twoBlankIndices = v.twoBlank.split(' ')
            .map((part, index) => part === '___' ? index : -1)
            .filter((index) => index >= 0);
        assert.deepEqual(v.twoCorrect, twoBlankIndices.map((index) => v.words[index]),
            `${where} ayat ${v.verseNumber}: twoCorrect salah posisi`);

        // Pola ayat yang tampil di layar harus benar-benar kembali menjadi ayat
        // asli setelah kunci dimasukkan. Ini menangkap blank/kunci yang tidak
        // sinkron meskipun teks kuncinya sendiri ada di pilihan.
        assert.equal(fillBlanks(v.frontBlank, v.frontCorrect.split(' ')), v.arabic,
            `${where} ayat ${v.verseNumber}: frontBlank tidak cocok dengan ayat`);
        assert.equal(fillBlanks(v.endBlank, [v.endCorrect]), v.arabic,
            `${where} ayat ${v.verseNumber}: endBlank tidak cocok dengan ayat`);
        assert.equal(fillBlanks(v.middleBlank, [v.middleCorrect]), v.arabic,
            `${where} ayat ${v.verseNumber}: middleBlank tidak cocok dengan ayat`);
        assert.equal(fillBlanks(v.twoBlank, v.twoCorrect), v.arabic,
            `${where} ayat ${v.verseNumber}: twoBlank tidak cocok dengan ayat`);

        // Setiap ayat wajib punya terjemahan di seluruh bahasa antarmuka, kalau tidak
        // pengguna akan melihat kunci mentah seperti "quran.93_4_translation".
        for (const lang of LANGS) {
            assert.ok(hasTranslation(lang, v.translationKey),
                `${where} ayat ${v.verseNumber}: terjemahan ${lang} hilang`);
        }
    });
}

// Seluruh mini target jalur Beginner harus benar-benar bisa dimainkan.
for (const ladder of BEGINNER_LADDERS) {
    const missing = ladder.surahs.filter((n) => !surahByName(n));
    assert.deepEqual(missing, [], `tangga ${ladder.name}: surah tanpa konten ${missing.join(', ')}`);
}

// Nama di data tangga dan di registry harus saling kenal, kalau tidak roadmap
// menunjuk surah yang seolah tidak ada kontennya.
assert.ok(surahByName('Ad-Dhuha'), 'penulisan Ad-Dhuha tidak dikenali registry');
assert.ok(surahByName('Al-Insyirah'), 'penulisan Al-Insyirah tidak dikenali registry');
assert.equal(surahByName('Al-Mulk'), null, 'surah tanpa konten harus null, bukan surah lain');

console.log(`content: ${Object.keys(SURAHS).length} surah, ${verseCount} ayat, ${LANGS.length} bahasa — semua lolos`);
