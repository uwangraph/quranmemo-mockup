import id from './locales/id.js';
import en from './locales/en.js';
import ms from './locales/ms.js';
import ha from './locales/ha.js';
import fr from './locales/fr.js';
import ar from './locales/ar.js';

export const locales = [
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ms', label: 'Melayu', flag: '🇲🇾' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

const dicts = { id, en, ms, ha, fr, ar };

// Older localStorage records stored Indonesian copy instead of translation keys.
// Resolve those values transparently so existing progress also follows the active locale.
const legacyKeys = {
    'Selesaikan 1 tahap hafalan': 'quest.complete_step',
    'Dapatkan 3 jawaban benar': 'quest.three_correct',
    'Mulai sesi hari ini': 'quest.start_today',
    'Dapatkan 3 jawaban benar tanpa salah': 'quest.three_correct_no_mistake',
    'Dapatkan 3 jawaban benar beruntun': 'quest.three_correct_streak',
    'Selesaikan 1 Murojaah instan': 'quest.complete_instant_review',
    'Sertifikat Hafalan Juz 30': 'certificate.juz30_title',
    'Sertifikat Tahsin Dasar': 'certificate.tahsin_title',
    'Hafalan': 'certificate.memorization',
    'Tahsin': 'certificate.tahsin'
};

export function createI18n() {
    let locale = $state('en');
    
    function t(key, params = {}) { 
        const resolvedKey = legacyKeys[key] || key;
        let text = dicts[locale]?.[resolvedKey] || dicts['en']?.[resolvedKey] || resolvedKey; 
        if (params) {
            Object.keys(params).forEach(k => {
                text = text.split(`{${k}}`).join(params[k]);
            });
        }
        return text; 
    }
    
    function getDir() { 
        return locales.find(l => l.code === locale)?.dir || 'ltr'; 
    }
    
    return {
        get locale() { return locale; },
        set locale(v) { 
            if (dicts[v]) locale = v; 
        },
        t, 
        getDir
    };
}

export const i18n = createI18n();
