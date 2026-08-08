// Registry konten hafalan per surah.
//
// Sebelumnya seluruh ayat Al-Insyirah ditulis langsung di dalam Lesson.svelte, dan
// setiap level memakainya kembali apa pun surah yang tertulis di roadmap — sehingga
// jalur Mid menjanjikan "Al-Mulk (1-15)" tetapi menyajikan ayat Al-Insyirah.
//
// Menambah surah baru kini murni pekerjaan data. Teks Arab, transliterasi, dan
// pilihan pengecoh WAJIB berasal dari mushaf terverifikasi, bukan disusun sendiri —
// sejalan dengan kebijakan repo ini yang tidak mengarang terjemahan Al-Quran.
// Surah tanpa entri di sini akan ditandai "konten belum tersedia" oleh antarmuka,
// bukan diam-diam diganti surah lain.

// Surah yang diambil lewat scripts/fetch-surah.js. Berkas JSON-nya hasil bangkitan
// dan tidak disunting tangan — jalankan ulang skripnya untuk menambah surah.
import generated from './surahs.generated.js';

export const SURAHS = {
    ...generated,
    'al-insyirah': {
        id: 'al-insyirah',
        name: 'Al-Insyirah',
        nameAr: 'الشرح',
        number: 94,
        juz: 30,
    verses: [
        {
            verseNumber: 1,
            arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
            translationKey: "quran.94_1_translation",
            transliteration: "Alam nashrah laka shadrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094001.mp3",
            words: ["أَلَمْ", "نَشْرَحْ", "لَكَ", "صَدْرَكَ"],
            frontBlank: "___ ___ لَكَ صَدْرَكَ",
            frontBlankLatin: "___ ___ laka shadrak",
            frontCorrect: "أَلَمْ نَشْرَحْ",
            frontChoices: ["أَلَمْ نَشْرَحْ", "وَوَضَعْنَا عَنكَ", "فَإِذَا فَرَغْتَ"],
            endBlank: "أَلَمْ نَشْرَحْ لَكَ ___",
            endBlankLatin: "alam nashrah laka ___",
            endCorrect: "صَدْرَكَ",
            endChoices: ["وِزْرَكَ", "صَدْرَكَ", "ظَهْرَكَ"],
            middleBlank: "أَلَمْ ___ لَكَ صَدْرَكَ",
            middleBlankLatin: "alam ___ laka shadrak",
            middleCorrect: "نَشْرَحْ",
            middleChoices: ["عَنكَ", "نَشْرَحْ", "وِزْرَكَ"],
            twoBlank: "أَلَمْ ___ ___ صَدْرَكَ",
            twoCorrect: ["نَشْرَحْ", "لَكَ"],
            twoChoices: ["عَنكَ", "لَكَ", "نَشْرَحْ", "وِزْرَكَ"]
        },
        {
            verseNumber: 2,
            arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ",
            translationKey: "quran.94_2_translation",
            transliteration: "Wa wadha'na 'anka wizrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094002.mp3",
            words: ["وَوَضَعْنَا", "عَنكَ", "وِزْرَكَ"],
            frontBlank: "___ ___ وِزْرَكَ",
            frontBlankLatin: "___ ___ wizrak",
            frontCorrect: "وَوَضَعْنَا عَنكَ",
            frontChoices: ["وَوَضَعْنَا عَنكَ", "أَلَمْ نَشْرَحْ", "ٱلَّذِىٓ أَنقَضَ"],
            endBlank: "وَوَضَعْنَا عَنكَ ___",
            endBlankLatin: "wa wadha'na 'anka ___",
            endCorrect: "وِزْرَكَ",
            endChoices: ["صَدْرَكَ", "وِزْرَكَ", "ظَهْرَكَ"],
            middleBlank: "وَوَضَعْنَا ___ وِزْرَكَ",
            middleBlankLatin: "wa wadha'na ___ wizrak",
            middleCorrect: "عَنكَ",
            middleChoices: ["لَكَ", "عَنكَ", "مَعَ"],
            twoBlank: "___ ___ وِزْرَكَ",
            twoCorrect: ["وَوَضَعْنَا", "عَنكَ"],
            twoChoices: ["وَوَضَعْنَا", "عَنكَ", "أَلَمْ", "نَشْرَحْ"]
        },
        {
            verseNumber: 3,
            arabic: "ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ",
            translationKey: "quran.94_3_translation",
            transliteration: "Alladzi anqadha zhahrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094003.mp3",
            words: ["ٱلَّذِىٓ", "أَنقَضَ", "ظَهْرَكَ"],
            frontBlank: "___ ___ ظَهْرَكَ",
            frontBlankLatin: "___ ___ zhahrak",
            frontCorrect: "ٱلَّذِىٓ أَنقَضَ",
            frontChoices: ["ٱلَّذِىٓ أَنقَضَ", "وَوَضَعْنَا عَنكَ", "فَإِنَّ مَعَ"],
            endBlank: "ٱلَّذِىٓ أَنقَضَ ___",
            endBlankLatin: "alladzi anqadha ___",
            endCorrect: "ظَهْرَكَ",
            endChoices: ["وِزْرَكَ", "صَدْرَكَ", "ظَهْرَكَ"],
            middleBlank: "ٱلَّذِىٓ ___ ظَهْرَكَ",
            middleBlankLatin: "alladzi ___ zhahrak",
            middleCorrect: "أَنقَضَ",
            middleChoices: ["أَنقَضَ", "فَرَغْتَ", "عَنكَ"],
            twoBlank: "___ ___ ظَهْرَكَ",
            twoCorrect: ["ٱلَّذِىٓ", "أَنقَضَ"],
            twoChoices: ["ٱلَّذِىٓ", "أَنقَضَ", "وَوَضَعْنَا", "صَدْرَكَ"]
        },
        {
            verseNumber: 4,
            arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ",
            translationKey: "quran.94_4_translation",
            transliteration: "Wa rafa'na laka dzikrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094004.mp3",
            words: ["وَرَفَعْنَا", "لَكَ", "ذِكْرَكَ"],
            frontBlank: "___ ___ ذِكْرَكَ",
            frontBlankLatin: "___ ___ dzikrak",
            frontCorrect: "وَرَفَعْنَا لَكَ",
            frontChoices: ["وَرَفَعْنَا لَكَ", "فَإِنَّ مَعَ", "وَوَضَعْنَا عَنكَ"],
            endBlank: "وَرَفَعْنَا لَكَ ___",
            endBlankLatin: "wa rafa'na laka ___",
            endCorrect: "ذِكْرَكَ",
            endChoices: ["وِزْرَكَ", "ذِكْرَكَ", "يُسْرًا"],
            middleBlank: "وَرَفَعْنَا ___ ذِكْرَكَ",
            middleBlankLatin: "wa rafa'na ___ dzikrak",
            middleCorrect: "لَكَ",
            middleChoices: ["عَنكَ", "لَكَ", "مَعَ"],
            twoBlank: "___ ___ ذِكْرَكَ",
            twoCorrect: ["وَرَفَعْنَا", "لَكَ"],
            twoChoices: ["وَرَفَعْنَا", "لَكَ", "ٱلَّذِىٓ", "أَنقَضَ"]
        },
        {
            verseNumber: 5,
            arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            translationKey: "quran.94_5_translation",
            transliteration: "Fa inna ma'al 'usri yusra",
            audio: "https://everyayah.com/data/Husary_128kbps/094005.mp3",
            words: ["فَإِنَّ", "مَعَ", "ٱلْعُسْرِ", "يُسْرًا"],
            frontBlank: "___ ___ ٱلْعُسْرِ يُسْرًا",
            frontBlankLatin: "___ ___ al-'usri yusra",
            frontCorrect: "فَإِنَّ مَعَ",
            frontChoices: ["فَإِنَّ مَعَ", "إِنَّ مَعَ", "أَلَمْ نَشْرَحْ"],
            endBlank: "فَإِنَّ مَعَ ٱلْعُسْرِ ___",
            endBlankLatin: "fa inna ma'a al-'usri ___",
            endCorrect: "يُسْرًا",
            endChoices: ["يُسْرًا", "وِزْرَكَ", "فَٱنصَبْ"],
            middleBlank: "فَإِنَّ مَعَ ___ يُسْرًا",
            middleBlankLatin: "fa inna ma'a ___ yusra",
            middleCorrect: "ٱلْعُسْرِ",
            middleChoices: ["رَبِّكَ", "ٱلْعُسْرِ", "صَدْرَكَ"],
            twoBlank: "فَإِنَّ ___ ___ يُسْرًا",
            twoCorrect: ["مَعَ", "ٱلْعُسْرِ"],
            twoChoices: ["مَعَ", "ٱلْعُسْرِ", "لَكَ", "عَنكَ"]
        },
        {
            verseNumber: 6,
            arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            translationKey: "quran.94_6_translation",
            transliteration: "Inna ma'al 'usri yusra",
            audio: "https://everyayah.com/data/Husary_128kbps/094006.mp3",
            words: ["إِنَّ", "مَعَ", "ٱلْعُسْرِ", "يُسْرًا"],
            frontBlank: "___ ___ ٱلْعُسْرِ يُسْرًا",
            frontBlankLatin: "___ ___ al-'usri yusra",
            frontCorrect: "إِنَّ مَعَ",
            frontChoices: ["إِنَّ مَعَ", "فَإِنَّ مَعَ", "وَإِلَىٰ رَبِّكَ"],
            endBlank: "إِنَّ مَعَ ٱلْعُسْرِ ___",
            endBlankLatin: "inna ma'a al-'usri ___",
            endCorrect: "يُسْرًا",
            endChoices: ["يُسْرًا", "فَٱنصَبْ", "وِزْرَكَ"],
            middleBlank: "إِنَّ مَعَ ___ يُسْرًا",
            middleBlankLatin: "inna ma'a ___ yusra",
            middleCorrect: "ٱلْعُسْرِ",
            middleChoices: ["ٱلْعُسْرِ", "رَبِّكَ", "لَكَ"],
            twoBlank: "إِنَّ ___ ___ يُسْرًا",
            twoCorrect: ["مَعَ", "ٱلْعُسْرِ"],
            twoChoices: ["مَعَ", "ٱلْعُسْرِ", "عَنكَ", "فَرَغْتَ"]
        },
        {
            verseNumber: 7,
            arabic: "فَإِذَا فَرَغْتَ فَٱنصَبْ",
            translationKey: "quran.94_7_translation",
            transliteration: "Fa idza faraghta fanshab",
            audio: "https://everyayah.com/data/Husary_128kbps/094007.mp3",
            words: ["فَإِذَا", "فَرَغْتَ", "فَٱنصَبْ"],
            frontBlank: "___ ___ فَٱنصَبْ",
            frontBlankLatin: "___ ___ fanshab",
            frontCorrect: "فَإِذَا فَرَغْتَ",
            frontChoices: ["فَإِذَا فَرَغْتَ", "وَإِلَىٰ رَبِّكَ", "وَوَضَعْنَا عَنكَ"],
            endBlank: "فَإِذَا فَرَغْتَ ___",
            endBlankLatin: "fa idza faraghta ___",
            endCorrect: "فَٱنصَبْ",
            endChoices: ["فَٱرْغَبْ", "فَٱنصَبْ", "صَدْرَكَ"],
            middleBlank: "فَإِذَا ___ فَٱنصَبْ",
            middleBlankLatin: "fa idza ___ fanshab",
            middleCorrect: "فَرَغْتَ",
            middleChoices: ["أَنقَضَ", "فَرَغْتَ", "مَعَ"],
            twoBlank: "___ ___ فَٱنصَبْ",
            twoCorrect: ["فَإِذَا", "فَرَغْتَ"],
            twoChoices: ["فَإِذَا", "فَرَغْتَ", "إِنَّ", "وَإِلَىٰ"]
        },
        {
            verseNumber: 8,
            arabic: "وَإِلَىٰ رَبِّكَ فَٱرْغَبْ",
            translationKey: "quran.94_8_translation",
            transliteration: "Wa ila rabbika farghab",
            audio: "https://everyayah.com/data/Husary_128kbps/094008.mp3",
            words: ["وَإِلَىٰ", "رَبِّكَ", "فَٱرْغَبْ"],
            frontBlank: "___ ___ فَٱرْغَبْ",
            frontBlankLatin: "___ ___ farghab",
            frontCorrect: "وَإِلَىٰ رَبِّكَ",
            frontChoices: ["وَإِلَىٰ رَبِّكَ", "فَإِذَا فَرَغْتَ", "وَوَضَعْنَا عَنكَ"],
            endBlank: "وَإِلَىٰ رَبِّكَ ___",
            endBlankLatin: "wa ila rabbika ___",
            endCorrect: "فَٱرْغَبْ",
            endChoices: ["فَٱنصَبْ", "فَٱرْغَبْ", "يُسْرًا"],
            middleBlank: "وَإِلَىٰ ___ فَٱرْغَبْ",
            middleBlankLatin: "wa ila ___ farghab",
            middleCorrect: "رَبِّكَ",
            middleChoices: ["عَنكَ", "رَبِّكَ", "لَكَ"],
            twoBlank: "___ ___ فَٱرْغَبْ",
            twoCorrect: ["وَإِلَىٰ", "رَبِّكَ"],
            twoChoices: ["وَإِلَىٰ", "رَبِّكَ", "فَإِذَا", "فَرَغْتَ"]
        }
    ]
    }
};

// Konten satu surah berdasarkan namanya di data tangga (LEVELLING.md).
// Pencocokan dilonggarkan karena penulisan nama di dokumen tidak selalu seragam
// (Ad-Dhuha / Ad-Duha, Al-Layl / Al-Lail).
export function surahByName(name) {
    if (!name) return null;
    const key = String(name).toLowerCase().replace(/[^a-z]/g, '');
    return Object.values(SURAHS).find(s => s.id.replace(/[^a-z]/g, '') === key) ?? null;
}

export function hasContent(name) {
    return surahByName(name) !== null;
}
