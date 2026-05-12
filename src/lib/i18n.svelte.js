export const locales = [
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ms', label: 'Melayu', flag: '🇲🇾' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

const dicts = {
    id: {
        "nav.learn": "Belajar",
        "nav.murojaah": "Murojaah",
        "nav.tadabbur": "Tadabbur",
        "nav.league": "Liga",
        "nav.profile": "Profil",
        "learn.title": "QuranMemo",
        "learn.unit": "Unit 1",
        "learn.start": "MULAI",
        "profile.title": "Profil",
        "profile.total_xp": "Total XP",
        "profile.streak": "Streak",
        "settings.language": "Bahasa Aplikasi"
    },
    en: {
        "nav.learn": "Learn",
        "nav.murojaah": "Review",
        "nav.tadabbur": "Reflect",
        "nav.league": "League",
        "nav.profile": "Profile",
        "learn.title": "QuranMemo",
        "learn.unit": "Unit 1",
        "learn.start": "START",
        "profile.title": "Profile",
        "profile.total_xp": "Total XP",
        "profile.streak": "Streak",
        "settings.language": "App Language"
    },
    ms: {
        "nav.learn": "Belajar",
        "nav.murojaah": "Ulangkaji",
        "nav.tadabbur": "Tadabbur",
        "nav.league": "Liga",
        "nav.profile": "Profil",
        "learn.title": "QuranMemo",
        "learn.unit": "Unit 1",
        "learn.start": "MULA",
        "profile.title": "Profil",
        "profile.total_xp": "Jumlah XP",
        "profile.streak": "Rantaian",
        "settings.language": "Bahasa Aplikasi"
    },
    ha: {
        "nav.learn": "Koya",
        "nav.murojaah": "Bita",
        "nav.tadabbur": "Tadabbur",
        "nav.league": "Gasar",
        "nav.profile": "Bayani",
        "learn.title": "QuranMemo",
        "learn.unit": "Raka'a 1",
        "learn.start": "FARA",
        "profile.title": "Bayani",
        "profile.total_xp": "Jimlar XP",
        "profile.streak": "Jere",
        "settings.language": "Harshen Application"
    },
    fr: {
        "nav.learn": "Apprendre",
        "nav.murojaah": "Réviser",
        "nav.tadabbur": "Méditer",
        "nav.league": "Ligue",
        "nav.profile": "Profil",
        "learn.title": "QuranMemo",
        "learn.unit": "Unité 1",
        "learn.start": "COMMENCER",
        "profile.title": "Profil",
        "profile.total_xp": "XP Total",
        "profile.streak": "Série",
        "settings.language": "Langue de l'application"
    },
    ar: {
        "nav.learn": "تَعَلَّم",
        "nav.murojaah": "مراجعة",
        "nav.tadabbur": "تدبر",
        "nav.league": "دوري",
        "nav.profile": "حسابي",
        "learn.title": "قرآن ميمو",
        "learn.unit": "الوحدة ١",
        "learn.start": "ابدأ",
        "profile.title": "حسابي",
        "profile.total_xp": "مجموع النقاط",
        "profile.streak": "أيام متتالية",
        "settings.language": "لغة التطبيق"
    }
};

export function createI18n() {
    let locale = $state('id');

    function t(key) {
        return dicts[locale]?.[key] || key;
    }

    function getDir() {
        return locales.find(l => l.code === locale)?.dir || 'ltr';
    }

    return {
        get locale() { return locale; },
        set locale(v) { locale = v; },
        t,
        getDir
    };
}

export const i18n = createI18n();
