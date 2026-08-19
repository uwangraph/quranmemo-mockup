// Kurikulum tematik Tadabbur (docs/TADABBUR.md §2.2 & §2.3).
//
// PENTING soal pemetaan ayat: §4.4 menetapkan Indeks Quran (Ust. Pur) sebagai
// guardrail — "AI tidak boleh hubungkan ayat ke tema yang tidak tercatat di indeks".
// Indeks itu belum ada di repo ini, jadi daftar ayat tiap tema sengaja dibiarkan
// kosong. Menebak sendiri ayat mana yang cocok untuk sebuah tema persis melanggar
// aturan tersebut, dan tema tanpa ayat ditandai terus terang di antarmuka alih-alih
// diisi tebakan.
//
// Begitu indeksnya tersedia, cukup isi `verses` dengan rujukan "surah:ayat" —
// tidak ada perubahan kode yang diperlukan.

export const TADABBUR_THEMES = [
    { id: 'iman', nameKey: 'tadabbur.theme.iman', indexKey: 'tadabbur.theme.iman.index', segments: ['anak', 'remaja', 'dewasa'], verses: [] },
    { id: 'ibadah', nameKey: 'tadabbur.theme.ibadah', indexKey: 'tadabbur.theme.ibadah.index', segments: ['anak', 'remaja', 'dewasa'], verses: [] },
    { id: 'akhlak', nameKey: 'tadabbur.theme.akhlak', indexKey: 'tadabbur.theme.akhlak.index', segments: ['anak', 'remaja', 'dewasa'], verses: [] },
    { id: 'keluarga', nameKey: 'tadabbur.theme.keluarga', indexKey: 'tadabbur.theme.keluarga.index', segments: ['remaja', 'dewasa'], verses: [] },
    { id: 'sosial', nameKey: 'tadabbur.theme.sosial', indexKey: 'tadabbur.theme.sosial.index', segments: ['remaja', 'dewasa'], mvp: true, verses: [] },
    { id: 'jiwa', nameKey: 'tadabbur.theme.jiwa', indexKey: 'tadabbur.theme.jiwa.index', segments: ['remaja', 'dewasa'], mvp: true, verses: [] },
    { id: 'ilmu', nameKey: 'tadabbur.theme.ilmu', indexKey: 'tadabbur.theme.ilmu.index', segments: ['remaja', 'dewasa'], verses: [] },
    { id: 'kisah', nameKey: 'tadabbur.theme.kisah', indexKey: 'tadabbur.theme.kisah.index', segments: ['anak', 'remaja'], verses: [] },
    { id: 'alam', nameKey: 'tadabbur.theme.alam', indexKey: 'tadabbur.theme.alam.index', segments: ['anak', 'remaja'], verses: [] },
    { id: 'kepemimpinan', nameKey: 'tadabbur.theme.kepemimpinan', indexKey: 'tadabbur.theme.kepemimpinan.index', segments: ['dewasa'], verses: [] },
    { id: 'harta', nameKey: 'tadabbur.theme.harta', indexKey: 'tadabbur.theme.harta.index', segments: ['dewasa'], mvp: true, verses: [] },
    { id: 'jihad', nameKey: 'tadabbur.theme.jihad', indexKey: 'tadabbur.theme.jihad.index', segments: ['dewasa'], verses: [] }
];

// Segmentasi usia (§2.3). Pendekatan dan format jurnalnya berbeda per segmen.
export const TADABBUR_SEGMENTS = [
    { id: 'anak', nameKey: 'tadabbur.segment.anak', ageKey: 'tadabbur.segment.anak.age', icon: 'ti-mood-kid' },
    { id: 'remaja', nameKey: 'tadabbur.segment.remaja', ageKey: 'tadabbur.segment.remaja.age', icon: 'ti-user' },
    { id: 'dewasa', nameKey: 'tadabbur.segment.dewasa', ageKey: 'tadabbur.segment.dewasa.age', icon: 'ti-user-check' }
];

// Tujuh langkah tadabbur (§1.1 — materi Ust. Pur). Urutan dan maknanya mengikuti
// dokumen; `needsCorpus` menandai langkah yang isinya harus datang dari korpus
// tervalidasi, bukan dari tulisan sendiri.
export const TADABBUR_STEPS = [
    { id: 'baca', icon: 'ti-book-2', input: null },
    { id: 'tafsir', icon: 'ti-book', input: null, needsCorpus: 'tafsir' },
    { id: 'ulama', icon: 'ti-users', input: null, needsCorpus: 'ulama' },
    { id: 'faktual', icon: 'ti-world', input: 'text', needsCorpus: 'faktual' },
    { id: 'diri', icon: 'ti-heart', input: 'text' },
    { id: 'simpulkan', icon: 'ti-bulb', input: 'hikmah' },
    { id: 'amal', icon: 'ti-check', input: 'amal' }
];

// Prompt jurnal per segmen (§3.3). Yang disimpan di sini kunci terjemahannya,
// bukan kalimatnya, agar promptnya ikut bahasa yang sedang dipakai pengguna.
export const JOURNAL_PROMPTS = {
    faktual: {
        anak: 'tadabbur.prompt.faktual.anak',
        remaja: 'tadabbur.prompt.faktual.remaja',
        dewasa: 'tadabbur.prompt.faktual.dewasa'
    },
    diri: {
        anak: 'tadabbur.prompt.diri.anak',
        remaja: 'tadabbur.prompt.diri.remaja',
        dewasa: 'tadabbur.prompt.diri.dewasa'
    }
};

export const themeById = (id) => TADABBUR_THEMES.find((t) => t.id === id) ?? null;

// Tema yang benar-benar bisa dijalankan: sudah punya rujukan ayat dari indeks.
export const themeIsReady = (theme) => (theme?.verses?.length ?? 0) > 0;
