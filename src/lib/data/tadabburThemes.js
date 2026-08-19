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
    { id: 'iman', name: 'Iman & Tauhid', index: 'Bab 1 (Pasal I-II), Bab 2 (Pasal I-III)', segments: ['anak', 'remaja', 'dewasa'], verses: [] },
    { id: 'ibadah', name: 'Ibadah', index: 'Bab 1 (Pasal IV-VIII)', segments: ['anak', 'remaja', 'dewasa'], verses: [] },
    { id: 'akhlak', name: 'Akhlak & Karakter', index: 'Bab IX (Akhlak Terpuji & Tercela)', segments: ['anak', 'remaja', 'dewasa'], verses: [] },
    { id: 'keluarga', name: 'Keluarga', index: 'Bab VIII (Pasal V — Keluarga)', segments: ['remaja', 'dewasa'], verses: [] },
    { id: 'sosial', name: 'Masyarakat & Sosial', index: 'Bab VIII (Pasal IX), Bab XII', segments: ['remaja', 'dewasa'], mvp: true, verses: [] },
    { id: 'jiwa', name: 'Jiwa & Kesehatan Mental', index: 'Bab IX (Sabar, Ketenangan, Harapan), Bab II (Tawakal)', segments: ['remaja', 'dewasa'], mvp: true, verses: [] },
    { id: 'ilmu', name: 'Ilmu & Akal', index: 'Bab IV (Keutamaan Ilmu, Sains & Teknologi)', segments: ['remaja', 'dewasa'], verses: [] },
    { id: 'kisah', name: 'Kisah Para Nabi', index: 'Bab XIV (Sejarah & Kisah-kisah)', segments: ['anak', 'remaja'], verses: [] },
    { id: 'alam', name: 'Alam & Tanda Kekuasaan Allah', index: 'Bab IV §15 (Bukti Ilmiah)', segments: ['anak', 'remaja'], verses: [] },
    { id: 'kepemimpinan', name: 'Kepemimpinan & Peran', index: 'Bab XII (Negara), Bab VIII (Pasal III-IV)', segments: ['dewasa'], verses: [] },
    { id: 'harta', name: 'Ekonomi & Harta', index: 'Bab X (Harta & Ekonomi)', segments: ['dewasa'], mvp: true, verses: [] },
    { id: 'jihad', name: 'Jihad & Perjuangan', index: 'Bab VII (Jihad dalam Islam)', segments: ['dewasa'], verses: [] }
];

// Segmentasi usia (§2.3). Pendekatan dan format jurnalnya berbeda per segmen.
export const TADABBUR_SEGMENTS = [
    { id: 'anak', name: 'Anak', age: '7–12 tahun', icon: 'ti-mood-kid' },
    { id: 'remaja', name: 'Remaja', age: '13–18 tahun', icon: 'ti-user' },
    { id: 'dewasa', name: 'Dewasa', age: '19+ tahun', icon: 'ti-user-check' }
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

// Prompt jurnal per segmen (§3.3). Ini teks antarmuka, bukan konten keagamaan,
// jadi boleh disusun di sini — berbeda dengan tafsir yang wajib dari korpus.
export const JOURNAL_PROMPTS = {
    faktual: {
        anak: 'Ayat ini mengingatkan aku pada kejadian…',
        remaja: 'Kejadian apa di sekitarmu belakangan ini yang nyambung dengan ayat ini?',
        dewasa: 'Peristiwa atau fenomena apa yang kamu lihat belakangan ini yang tercermin dalam ayat ini?'
    },
    diri: {
        anak: 'Ayat ini mengajarkan aku bahwa…',
        remaja: 'Bagian hidupmu yang mana yang paling tersentuh ayat ini?',
        dewasa: 'Tulis seperti surat kepada dirimu sendiri: apa yang ayat ini ingin kamu ubah?'
    }
};

export const themeById = (id) => TADABBUR_THEMES.find((t) => t.id === id) ?? null;

// Tema yang benar-benar bisa dijalankan: sudah punya rujukan ayat dari indeks.
export const themeIsReady = (theme) => (theme?.verses?.length ?? 0) > 0;
