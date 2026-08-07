// Pemeriksa cakupan terjemahan. Jalankan: npm run check:i18n
//
// Bahasa Inggris dipakai sebagai acuan karena fungsi t() jatuh ke sana ketika
// sebuah kunci tidak ditemukan. Kunci yang hilang tidak membuat aplikasi rusak,
// tetapi diam-diam menampilkan teks Inggris kepada pengguna — persis kegagalan
// yang tidak terlihat sampai diperiksa.
import en from './locales/en.js';
import id from './locales/id.js';
import ms from './locales/ms.js';
import ha from './locales/ha.js';
import fr from './locales/fr.js';
import ar from './locales/ar.js';

const dicts = { id, ms, ha, fr, ar };

// Kunci yang memang sengaja dikosongkan, beserta alasannya.
const ALLOWED_MISSING = {
    'verse.94.': 'terjemahan ayat Quran — menunggu rujukan terjemahan resmi'
};

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const htmlTags = (s) => [...String(s).matchAll(/<\/?(\w+)>/g)].map((m) => m[1]).sort().join(',');
const isAllowed = (key) => Object.keys(ALLOWED_MISSING).some((p) => key.startsWith(p));

const enKeys = Object.keys(en);
let problems = 0;
const skipped = [];

for (const [code, dict] of Object.entries(dicts)) {
    const missing = [];
    const mismatched = [];

    for (const key of enKeys) {
        if (!(key in dict)) {
            (isAllowed(key) ? skipped : missing).push(key);
            continue;
        }
        if (placeholders(en[key]) !== placeholders(dict[key])) {
            mismatched.push(`${key} — placeholder {…} tidak cocok`);
        }
        if (htmlTags(en[key]) !== htmlTags(dict[key])) {
            mismatched.push(`${key} — tag HTML tidak cocok`);
        }
        if (!String(dict[key]).trim()) {
            mismatched.push(`${key} — nilai kosong`);
        }
    }

    const stale = Object.keys(dict).filter((k) => !(k in en));

    if (missing.length || mismatched.length) {
        problems += missing.length + mismatched.length;
        console.error(`\n✗ ${code}`);
        if (missing.length) console.error(`  hilang (${missing.length}): ${missing.join(', ')}`);
        for (const m of mismatched) console.error(`  ${m}`);
    } else {
        const translated = enKeys.filter((k) => k in dict).length;
        console.log(`✓ ${code} — ${translated}/${enKeys.length} kunci`);
    }

    if (stale.length) {
        console.warn(`  ⚠ ${code} punya ${stale.length} kunci usang (tidak ada di en.js): ${stale.join(', ')}`);
    }
}

if (skipped.length) {
    const reasons = [...new Set(Object.values(ALLOWED_MISSING))];
    console.log(`\nℹ Sengaja dilewati: ${reasons.join('; ')}`);
}

if (problems > 0) {
    console.error(`\n${problems} masalah terjemahan ditemukan.`);
    process.exit(1);
}
console.log('\nCakupan terjemahan lengkap.');
