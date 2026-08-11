<script>
    // Murajaah & Revision Alert (STREAK.md).
    //
    // Terpisah dari pengingat streak: ini bukan soal hadir hari ini, melainkan soal
    // hafalan lama yang mulai menguap. Surah yang lebih dari 14 hari tidak diverifikasi
    // naik jadi prioritas revisi, yang paling lama menganggur di urutan teratas.
    import { appState, MURAJAAH_DUE_DAYS } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    const due = $derived(appState.murajaahDue);

    // Daftar penuh bisa panjang; yang mendesak cukup beberapa teratas.
    let expanded = $state(false);
    const shown = $derived(expanded ? due : due.slice(0, 2));

    // Membuka toko murojaah dengan surah tersebut sudah terpilih, supaya
    // pengguna tidak perlu mencarinya lagi dari nol.
    function bookMurajaah(surah) {
        appState.marketplaceSurah = surah;
        appState.marketplaceTab = 'toko';
        appState.go('murojaah');
    }
</script>

{#if due.length > 0}
    <div class="murajaah-card">
        <div class="mc-head">
            <span class="mc-icon">🔄</span>
            <div style="flex:1; min-width:0;">
                <div class="mc-title">{i18n.t('murajaah.title')}</div>
                <div class="mc-sub">{i18n.t('murajaah.subtitle', { days: MURAJAAH_DUE_DAYS })}</div>
            </div>
            <span class="mc-count">{due.length}</span>
        </div>

        <div class="mc-list">
            {#each shown as item}
                <div class="mc-item">
                    <div style="flex:1; min-width:0; text-align:left;">
                        <div class="mc-surah">{item.surah}</div>
                        <div class="mc-days">{i18n.t('murajaah.last_reviewed', { days: item.days })}</div>
                    </div>
                    <button type="button" class="btn-duo btn-orange btn-xs btn-auto mc-cta" onclick={() => bookMurajaah(item.surah)}>
                        {i18n.t('murajaah.review_now')}
                    </button>
                </div>
            {/each}
        </div>

        {#if due.length > 2}
            <button class="mc-more" onclick={() => (expanded = !expanded)}>
                {expanded ? i18n.t('murajaah.show_less') : i18n.t('murajaah.show_all', { count: due.length })}
            </button>
        {/if}
    </div>
{/if}

<style>
    .murajaah-card {
        margin: 10px 16px 0;
        background: linear-gradient(135deg, #fff7ed, #fffbf5);
        border: 2px solid #fed7aa;
        border-bottom-width: 4px;
        border-radius: 18px;
        padding: 14px;
    }
    :global(.desktop-browser) .murajaah-card { margin: 0 0 16px; }
    :global(.tablet) .murajaah-card { margin: 0 0 16px; }

    .mc-head { display: flex; align-items: center; gap: 10px; }
    .mc-icon { font-size: 22px; }
    .mc-title { font-size: 14px; font-weight: 900; color: #92400e; }
    .mc-sub { font-size: 11px; font-weight: 700; color: #b45309; margin-top: 2px; line-height: 1.4; }
    .mc-count {
        background: #ff6200; color: #fff; font-size: 12px; font-weight: 900;
        min-width: 24px; height: 24px; border-radius: 99px;
        display: flex; align-items: center; justify-content: center; padding: 0 7px;
    }

    .mc-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
    .mc-item {
        display: flex; align-items: center; gap: 10px;
        background: #fff; border: 2px solid #fed7aa; border-radius: 12px;
        padding: 10px 12px; cursor: default; font-family: 'Nunito', sans-serif;
        min-height: 52px; border-bottom: 3px solid #fed7aa;
    }
    .mc-surah { font-size: 14px; font-weight: 900; color: #1e293b; }
    .mc-days { font-size: 11px; font-weight: 700; color: #b45309; margin-top: 2px; }
    /* Bentuk & warna dari gaya tombol bersama; di sini hanya penempatannya. */
    .mc-cta { flex-shrink: 0; align-self: center; }

    .mc-more {
        width: 100%; margin-top: 10px; padding: 8px; min-height: 40px;
        background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer;
        font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800; color: #b45309;
    }
    .mc-more:hover { transform: translateY(1px); border-bottom-color: #fed7aa; }
    .mc-more:active { transform: translateY(3px); border-bottom-color: transparent; }
</style>
