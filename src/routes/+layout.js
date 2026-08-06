// Mockup ini sepenuhnya berjalan di klien: seluruh state ada di localStorage dan
// `appState`/`i18n` adalah singleton module-scope. Dengan SSR aktif, satu instance
// state akan dipakai bersama lintas request di worker yang sama.
export const ssr = false;
