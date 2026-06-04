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

export function createI18n() {
    let locale = $state('en');
    
    function t(key, params = {}) { 
        let text = dicts[locale]?.[key] || dicts['en']?.[key] || key; 
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