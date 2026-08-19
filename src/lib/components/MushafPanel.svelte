<script>
    // Mushaf — membaca ayat yang kontennya sudah ada di aplikasi.
    //
    // Selain untuk dibaca, layar ini memenuhi TADABBUR.md §3.6: "ayat yang sudah
    // ditadabburi diberi tanda khusus di mushaf hafalan", dan menyediakan tombol
    // langsung "Tadabburi ayat ini" dari sisi mushaf.
    //
    // Cakupannya jujur mengikuti isi registry konten — 36 surah Juz 30 — bukan
    // seluruh 114 surah. Surah tanpa konten tidak ditampilkan sebagai halaman kosong.
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import { SURAHS } from '$lib/data/surahs.js';

    // Urut menurun seperti urutan mushaf pada Juz 30 (An-Naba di depan, An-Nas di
    // belakang) supaya sejalan dengan cara orang membaca juznya.
    const surahs = $derived(Object.values(SURAHS).sort((a, b) => a.number - b.number).reverse());

    let openSurahId = $state(null);
    const openSurah = $derived(openSurahId ? SURAHS[openSurahId] : null);

    // Ayat dianggap hafal bila progres surah sudah melewati indeksnya.
    const memorizedCount = (id) => appState.surahProgress(id);
    const isMemorized = (id, i) => memorizedCount(id) > i;
    const isReflected = (id, verseNumber) =>
        Boolean(appState.getTadabburJournal(id, verseNumber)?.completedAt);

    // Satu pemutar dipakai bergantian: memutar ayat lain menghentikan yang sedang
    // berbunyi, supaya dua ayat tidak pernah terdengar bertumpuk.
    let audio = null;
    let playingKey = $state(null);

    function toggleAudio(verse) {
        const key = `${openSurah.id}:${verse.verseNumber}`;
        if (playingKey === key) {
            audio?.pause();
            playingKey = null;
            return;
        }
        audio?.pause();
        audio = new Audio(verse.audio);
        audio.onended = () => (playingKey = null);
        audio.play().catch(() => (playingKey = null));
        playingKey = key;
    }

    // Melepas pemutar saat panel ditutup; tanpa ini audio terus berbunyi setelah
    // pengguna berpindah tab.
    $effect(() => () => audio?.pause());

    function openTadabbur(verseIndex) {
        audio?.pause();
        playingKey = null;
        appState.openTadabburFor(openSurah.id, verseIndex);
    }
</script>

<div class="mushaf-panel">
    {#if openSurah}
        <button class="panel-back" onclick={() => { audio?.pause(); playingKey = null; openSurahId = null; }}>
            <i class="ti ti-arrow-left"></i> {i18n.t('mushaf.all_surahs')}
        </button>

        <div class="scroll-content">
            <div class="surah-head">
                <div class="surah-name-ar">{openSurah.nameAr}</div>
                <div class="surah-name">{openSurah.name}</div>
                <div class="surah-meta">
                    {i18n.t('mushaf.surah_meta', { number: openSurah.number, count: openSurah.verses.length, juz: openSurah.juz })}
                </div>
            </div>

            {#each openSurah.verses as v, i}
                {@const hafal = isMemorized(openSurah.id, i)}
                {@const ditadabburi = isReflected(openSurah.id, v.verseNumber)}
                <article class="ayah" class:hafal>
                    <div class="ayah-top">
                        <span class="ayah-num">{v.verseNumber}</span>
                        <div class="ayah-marks">
                            {#if hafal}
                                <span class="mark hafal-mark"><i class="ti ti-check"></i> {i18n.t('mushaf.mark_memorized')}</span>
                            {/if}
                            <!-- §3.6: tanda khusus untuk ayat yang sudah ditadabburi -->
                            {#if ditadabburi}
                                <span class="mark tadabbur-mark"><i class="ti ti-books"></i> {i18n.t('mushaf.mark_reflected')}</span>
                            {/if}
                        </div>
                    </div>

                    <div class="arabic">{v.arabic}</div>
                    <div class="latin">{v.transliteration}</div>
                    <div class="translation">{i18n.t(v.translationKey)}</div>

                    <div class="ayah-actions">
                        <button class="ayah-btn" onclick={() => toggleAudio(v)}>
                            <i class="ti {playingKey === `${openSurah.id}:${v.verseNumber}` ? 'ti-player-pause' : 'ti-player-play'}"></i>
                            {i18n.t(playingKey === `${openSurah.id}:${v.verseNumber}` ? 'mushaf.pause' : 'mushaf.listen')}
                        </button>
                        <button class="ayah-btn tadabbur" onclick={() => openTadabbur(i)}>
                            <i class="ti ti-books"></i> {i18n.t('mushaf.reflect_this')}
                        </button>
                    </div>
                </article>
            {/each}

            <div style="height: 20px;"></div>
        </div>
    {:else}
        <div class="scroll-content">
            <p class="scope-note">
                <i class="ti ti-info-circle"></i> {i18n.t('mushaf.scope_note', { count: surahs.length })}
            </p>

            <div class="surah-list">
                {#each surahs as s}
                    {@const done = memorizedCount(s.id)}
                    {@const reflected = s.verses.filter((v) => isReflected(s.id, v.verseNumber)).length}
                    <button class="surah-row" onclick={() => (openSurahId = s.id)}>
                        <span class="surah-num">{s.number}</span>
                        <div class="surah-copy">
                            <div class="surah-row-name">{s.name}</div>
                            <div class="surah-row-meta">
                                {s.verses.length} {i18n.t('tadabbur.stat_verses')}
                                {#if done > 0} · {i18n.t('mushaf.memorized_of', { done, total: s.verses.length })}{/if}
                                {#if reflected > 0} · {reflected} {i18n.t('mushaf.mark_reflected')}{/if}
                            </div>
                        </div>
                        <span class="surah-row-ar">{s.nameAr}</span>
                    </button>
                {/each}
            </div>

            <div style="height: 20px;"></div>
        </div>
    {/if}
</div>

<style>
    .mushaf-panel {
        flex: 1; min-height: 0; display: flex; flex-direction: column;
        background: #f8fafc;
    }
    .scroll-content { flex: 1; min-height: 0; overflow-y: auto; padding: 12px 16px; }

    .panel-back {
        display: flex; align-items: center; gap: 6px;
        margin: 10px 16px 0; padding: 6px 10px; min-height: 34px;
        background: none; border: none; cursor: pointer;
        font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
        color: #64748b; align-self: flex-start;
    }

    .scope-note {
        display: flex; align-items: flex-start; gap: 8px; margin: 0 0 14px;
        background: #fff; border: 1.5px solid #e5e5e5; border-radius: 12px;
        padding: 10px 12px; font-size: 11px; font-weight: 600;
        color: #64748b; line-height: 1.55;
    }
    .scope-note i { font-size: 14px; flex-shrink: 0; }

    /* ── Daftar surah ── */
    .surah-list { display: flex; flex-direction: column; gap: 8px; }
    .surah-row {
        display: flex; align-items: center; gap: 12px; width: 100%;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 14px;
        padding: 12px; cursor: pointer; font-family: 'Nunito', sans-serif;
        text-align: left; min-height: 60px;
    }
    .surah-num {
        width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
        background: #e6faf8; color: var(--duo-green);
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 900;
    }
    .surah-copy { flex: 1; min-width: 0; }
    .surah-row-name { font-size: 14px; font-weight: 900; color: #1e293b; }
    .surah-row-meta { font-size: 10px; font-weight: 700; color: #94a3b8; margin-top: 2px; }
    .surah-row-ar {
        font-family: 'Amiri', serif; font-size: 18px; color: var(--duo-green);
        flex-shrink: 0; direction: rtl;
    }

    /* ── Kepala surah ── */
    .surah-head {
        background: #fff; border: 2px solid #e5e5e5; border-radius: 16px;
        padding: 18px; margin-bottom: 14px; text-align: center;
    }
    .surah-name-ar { font-family: 'Amiri', serif; font-size: 28px; color: #1e293b; direction: rtl; }
    .surah-name { font-size: 15px; font-weight: 900; color: var(--duo-green); margin-top: 6px; }
    .surah-meta { font-size: 11px; font-weight: 700; color: #94a3b8; margin-top: 4px; }

    /* ── Ayat ── */
    .ayah {
        background: #fff; border: 2px solid #e5e5e5; border-radius: 16px;
        padding: 14px; margin-bottom: 10px;
    }
    .ayah.hafal { border-color: #99f6e4; }
    .ayah-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
    .ayah-num {
        width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
        background: #f1f5f9; color: #475569;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 900;
    }
    .ayah.hafal .ayah-num { background: var(--duo-green); color: #fff; }
    .ayah-marks { display: flex; gap: 5px; flex-wrap: wrap; }
    .mark {
        display: inline-flex; align-items: center; gap: 3px;
        border-radius: 99px; padding: 2px 8px; font-size: 9px; font-weight: 900;
    }
    .hafal-mark { background: #e6faf8; color: #0f766e; }
    .tadabbur-mark { background: #ede9fe; color: #6d28d9; }

    .arabic {
        font-family: 'Amiri', serif; font-size: 24px; line-height: 2.1;
        color: #1e293b; direction: rtl; text-align: right;
    }
    .latin { font-size: 11px; font-weight: 700; color: #94a3b8; margin-top: 8px; font-style: italic; }
    .translation { font-size: 12px; font-weight: 600; color: #475569; line-height: 1.6; margin-top: 6px; }

    .ayah-actions { display: flex; gap: 8px; margin-top: 12px; }
    .ayah-btn {
        flex: 1; min-width: 0; min-height: 38px;
        display: flex; align-items: center; justify-content: center; gap: 5px;
        background: #f8fafc; border: 2px solid #e5e5e5; border-radius: 10px;
        font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
        color: #475569; cursor: pointer;
    }
    .ayah-btn.tadabbur { background: #f5f3ff; border-color: #ddd6fe; color: #6d28d9; }
</style>
