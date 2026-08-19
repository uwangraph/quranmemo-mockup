<script>
    import { appState, MURAJAAH_DUE_DAYS } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import UserTopbar from '$lib/components/UserTopbar.svelte';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import TadabburPanel from '$lib/components/TadabburPanel.svelte';

    // Tab Murojaah di bottom nav memuat dua sub-tab. Tab aktif diturunkan dari
    // layar yang sedang terbuka, bukan dari state lokal, supaya tautan langsung ke
    // Tadabbur dari roadmap tetap mendarat di tab yang benar.
    const tab = $derived(appState.currentScreen === 'tadabbur' ? 'tadabbur' : 'murojaah');

    const due = $derived(appState.murajaahDue);
    let activeSurah = $state(null);
    let completed = $state(false);

    function startReview(item) {
        activeSurah = item.surah;
        completed = false;
    }

    function finishReview() {
        if (!activeSurah) return;
        appState.markMurajaah(activeSurah);
        completed = true;
    }

    function closeReview() {
        activeSurah = null;
        completed = false;
    }
</script>

<div class="screen murajaah-screen">
    <UserTopbar title={tab === 'tadabbur' ? i18n.t('nav.tadabbur') : i18n.t('nav.murojaah')} showBack={false} />

    <div class="sub-tabs" role="tablist">
        <button class="sub-tab" class:active={tab === 'murojaah'} role="tab"
            aria-selected={tab === 'murojaah'} onclick={() => appState.go('murojaah')}>
            <i class="ti ti-refresh"></i> {i18n.t('nav.murojaah')}
        </button>
        <button class="sub-tab" class:active={tab === 'tadabbur'} role="tab"
            aria-selected={tab === 'tadabbur'} onclick={() => appState.go('tadabbur')}>
            <i class="ti ti-books"></i> {i18n.t('nav.tadabbur')}
        </button>
    </div>


    {#if tab === 'tadabbur'}
        <TadabburPanel />
    {:else if activeSurah}
        <div class="review-panel">
            <div class="review-icon"><i class="ti ti-refresh"></i></div>
            <div class="eyebrow">SESI MURAJAAH</div>
            <h1>{activeSurah}</h1>
            <p>Ulangi hafalanmu dengan tenang dan pastikan ayatnya tetap lancar.</p>

            <div class="review-card">
                <i class="ti ti-book"></i>
                <div>
                    <strong>{activeSurah}</strong>
                    <span>Target review hari ini</span>
                </div>
            </div>

            {#if completed}
                <div class="success-message"><i class="ti ti-circle-check"></i> Murajaah selesai. Hafalanmu sudah diperbarui.</div>
                <button class="btn-duo btn-green" onclick={closeReview}>KEMBALI KE DAFTAR</button>
            {:else}
                <button class="btn-duo btn-green" onclick={finishReview}>SELESAI MURAJAAH</button>
                <button class="btn-duo btn-outline" onclick={closeReview}>BATAL</button>
            {/if}
        </div>
    {:else}
        <div class="scroll-content murajaah-content">
            <section class="hero-card">
                <div class="hero-icon"><i class="ti ti-refresh"></i></div>
                <div>
                    <div class="eyebrow">JAGA HAFALANMU</div>
                    <h1>Prioritas Murajaah</h1>
                    <p>{#if due.length > 0}{due.length} surah perlu diulang hari ini{:else}Semua hafalanmu sedang terjaga{/if}</p>
                </div>
                <div class="hero-count">{due.length}</div>
            </section>

            {#if due.length > 0}
                <div class="section-heading">
                    <span>PERLU DIULANG</span>
                    <small>Lebih dari {MURAJAAH_DUE_DAYS} hari</small>
                </div>
                <div class="due-list">
                    {#each due as item}
                        <article class="due-card">
                            <div class="surah-icon"><i class="ti ti-book"></i></div>
                            <div class="due-copy">
                                <h2>{item.surah}</h2>
                                <p>{i18n.t('murajaah.last_reviewed', { days: item.days })}</p>
                            </div>
                            <button class="btn-duo btn-green review-button" onclick={() => startReview(item)}>MURAJAAH</button>
                        </article>
                    {/each}
                </div>
            {:else}
                <div class="empty-card">
                    <div><i class="ti ti-confetti"></i></div>
                    <h2>Belum ada yang perlu dimurajaah</h2>
                    <p>Terus jaga ritme hafalanmu. Daftar ini akan terisi saat ada surah yang belum diulang.</p>
                </div>
            {/if}
        </div>
    {/if}
    <BottomNav active="murojaah" />
</div>

<style>
    /* Dua sub-tab di dalam satu tab bottom nav. Penanda aktifnya garis bawah plus
       warna, bukan warna saja, agar tetap terbaca oleh pengguna yang kesulitan
       membedakan warna — sejalan dengan penanda di bottom nav. */
    .sub-tabs {
        display: flex; gap: 4px; padding: 0 16px;
        background: #fff; border-bottom: 2px solid #e5e5e5; flex-shrink: 0;
    }
    .sub-tab {
        flex: 1; min-width: 0; min-height: 44px;
        display: flex; align-items: center; justify-content: center; gap: 6px;
        background: none; border: none; cursor: pointer;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
        color: #94a3b8; border-bottom: 3px solid transparent; margin-bottom: -2px;
    }
    .sub-tab i { font-size: 16px; }
    .sub-tab.active { color: var(--duo-green); border-bottom-color: var(--duo-green); }

    .murajaah-screen { background: #f8fafc; }
    .murajaah-content { padding: 16px; }
    .hero-card {
        display: flex; align-items: center; gap: 12px; position: relative;
        padding: 20px; border-radius: 20px; color: #fff;
        background: linear-gradient(135deg, #14b8a6, #00978a);
        box-shadow: 0 4px 0 #007a70;
    }
    .hero-icon { font-size: 32px; flex-shrink: 0; }
    .eyebrow { font-size: 10px; font-weight: 900; letter-spacing: 1px; opacity: .78; }
    .hero-card h1, .review-panel h1 { margin: 3px 0 0; font-size: 21px; font-weight: 900; }
    .hero-card p, .review-panel p { margin: 4px 0 0; font-size: 12px; font-weight: 700; opacity: .9; line-height: 1.4; }
    .hero-count { margin-left: auto; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,.22); font-size: 15px; font-weight: 900; }
    .section-heading { display: flex; justify-content: space-between; align-items: center; margin: 22px 0 10px; color: #64748b; }
    .section-heading span { font-size: 11px; font-weight: 900; letter-spacing: .8px; }
    .section-heading small { font-size: 10px; font-weight: 800; color: #94a3b8; }
    .due-list { display: flex; flex-direction: column; gap: 10px; }
    .due-card { display: flex; align-items: center; gap: 10px; min-height: 76px; box-sizing: border-box; padding: 12px; background: #fff; border: 2px solid #99e5dc; border-bottom: 3px solid #5ccfc2; border-radius: 16px; }
    .surah-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #e8f8f6; color: #00978a; font-size: 21px; flex-shrink: 0; }
    .due-copy { flex: 1; min-width: 0; }
    .due-copy h2 { margin: 0; color: #1e293b; font-size: 15px; font-weight: 900; }
    .due-copy p { margin: 3px 0 0; color: #008f83; font-size: 11px; font-weight: 700; }
    .review-button { width: auto; min-height: 40px; padding: 10px 12px; font-size: 10px; border-radius: 11px; flex-shrink: 0; }
    .empty-card { margin-top: 24px; padding: 28px 20px; text-align: center; background: #fff; border: 2px solid #e2e8f0; border-radius: 18px; color: #64748b; }
    .empty-card > div { font-size: 38px; }
    .empty-card h2 { margin: 10px 0 5px; color: #1e293b; font-size: 16px; }
    .empty-card p { margin: 0; font-size: 12px; font-weight: 700; line-height: 1.5; }
    .review-panel { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 28px 20px; text-align: center; }
    .review-icon { font-size: 42px; }
    .review-panel .eyebrow { color: #00978a; }
    .review-panel h1 { color: #1e293b; }
    .review-panel p { max-width: 300px; color: #64748b; }
    .review-card { width: 100%; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 16px; margin: 10px 0; text-align: left; background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; }
    .review-card > i { font-size: 26px; color: #00978a; }
    .review-card div { display: flex; flex-direction: column; gap: 3px; }
    .review-card strong { color: #1e293b; font-size: 15px; }
    .review-card span { color: #64748b; font-size: 11px; font-weight: 700; }
    .review-panel .btn-duo { max-width: 360px; }
    .review-panel .btn-outline { color: #00978a; border-color: #d1d5db; }
    .success-message { width: 100%; box-sizing: border-box; padding: 12px; border-radius: 12px; background: #ecfdf5; color: #047857; font-size: 12px; font-weight: 800; }
</style>
