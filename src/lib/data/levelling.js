// Struktur mini target dari docs/LEVELLING.md.
//
// Dokumen itu menyusun setiap level sebagai deretan "tangga" (ladder). Tiap tangga
// punya sekumpulan mini target dan diakhiri sebuah gerbang: checkpoint (setoran) atau
// badge. Berkas ini hanya memuat strukturnya — progres dan status node dihitung di
// RoadmapPath, supaya data dan tampilan tidak saling mengunci.

// ── BEGINNER (Juz Amma) ────────────────────────────────────────────────────
// Urutan tangga di dokumen ditulis dari bawah ke atas (tangga pertama paling akhir
// disebut). Di sini sudah diurutkan sesuai jalan yang ditempuh pengguna.
export const BEGINNER_LADDERS = [
    {
        id: 'b1',
        name: 'An-Naas — Ad-Dhuha',
        gate: 'checkpoint',
        surahs: [
            'An-Nas', 'Al-Falaq', 'Al-Ikhlas', 'Al-Lahab', 'An-Nasr', 'Al-Kafirun',
            'Al-Kautsar', 'Al-Maun', 'Quraisy', 'Al-Fil', 'Al-Humazah', 'Al-Asr',
            'At-Takatsur', 'Al-Qariah', 'Al-Adiyat', 'Az-Zalzalah', 'Al-Bayyinah',
            'Al-Qadr', 'Al-Alaq', 'At-Tin', 'Al-Insyirah', 'Ad-Dhuha'
        ]
    },
    {
        id: 'b2',
        name: 'Al-Layl — At-Takwir',
        gate: 'checkpoint',
        surahs: [
            'Al-Layl', 'Asy-Syams', 'Al-Balad', 'Al-Fajr', 'Al-Ghasyiyah', 'Al-Ala',
            'At-Tariq', 'Al-Buruj', 'Al-Insyiqaq', 'Al-Mutaffifin', 'Al-Infitar', 'At-Takwir'
        ]
    },
    {
        id: 'b3',
        name: 'An-Naziat — An-Naba',
        gate: 'badge',   // dokumen: "badge per juz" — penutup Juz Amma
        surahs: ['An-Naziat', 'An-Naba']
    }
];

// ── MID (Juz 29, Juz 28, + dua surah opsional) ─────────────────────────────
// Satu juz = satu tangga, dipecah per kelompok surah.
export const MID_LADDERS = [
    {
        id: 'm29',
        name: 'Juz 29',
        gate: 'badge',
        groups: [
            ['Al-Mulk', 'Al-Qalam', 'Al-Haqqah'],
            ['Al-Maarij', 'Nuh', 'Al-Jinn', 'Al-Muzzammil'],
            ['Al-Mudatsir', 'Al-Qiyamah', 'Al-Insan', 'Al-Mursalat']
        ]
    },
    {
        id: 'm28',
        name: 'Juz 28',
        gate: 'badge',
        groups: [
            ['Al-Mujadalah', 'Al-Hasyr', 'Al-Mumtahanah'],
            ['As-Saff', 'Al-Jumuah', 'Al-Munafiqun'],
            ['At-Taghabun', 'At-Talaq', 'At-Tahrim']
        ]
    },
    // Dokumen menandai keduanya opsional: boleh dibuka di Mid, boleh disimpan untuk Pro.
    { id: 'mwaqiah', name: 'Al-Waqiah', gate: 'checkpoint', optional: true, groups: [['Al-Waqiah']] },
    { id: 'mrahman', name: 'Ar-Rahman', gate: 'checkpoint', optional: true, groups: [['Ar-Rahman']] }
];

// ── PRO (Juz 1-27) ─────────────────────────────────────────────────────────
// Urutan juz mengikuti dokumen apa adanya — bukan 1→27, melainkan dimulai dari
// juz-juz belakang yang lebih akrab, lalu turun ke depan.
export const PRO_JUZ_ORDER = [
    26, 27, 21, 22, 23, 24, 25,
    16, 17, 18, 19, 20,
    11, 12, 13, 14, 15,
    6, 7, 8, 9, 10,
    1, 2, 3, 4, 5
];

// Tiap juz dibagi empat blok lima halaman (LEVELLING.md — mini target Pro).
export const PRO_PAGE_BLOCKS = [
    { from: 1, to: 5 },
    { from: 6, to: 10 },
    { from: 11, to: 15 },
    { from: 16, to: 20 }
];

export const PRO_LADDERS = PRO_JUZ_ORDER.map((juz) => ({
    id: `p${juz}`,
    name: `Juz ${juz}`,
    juz,
    gate: 'badge',   // dokumen: "Badge per surah dan per juz"
    blocks: PRO_PAGE_BLOCKS
}));

// Jumlah mini target dalam satu tangga, apa pun bentuk levelnya.
export function ladderTargetCount(ladder) {
    if (ladder.surahs) return ladder.surahs.length;
    if (ladder.groups) return ladder.groups.length;
    if (ladder.blocks) return ladder.blocks.length;
    return 0;
}

export function laddersFor(learningPath) {
    if (learningPath === 'pro') return PRO_LADDERS;
    if (learningPath === 'mid') return MID_LADDERS;
    return BEGINNER_LADDERS;
}
