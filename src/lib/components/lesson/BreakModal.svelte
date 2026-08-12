<script>
    import { fade, fly } from 'svelte/transition';
    import { i18n } from '$lib/i18n.svelte.js';
    let { showBreakModal, onContinue, onExit } = $props();
</script>

{#if showBreakModal}
<div class="completion-overlay" transition:fade={{duration: 200}}>
    <div class="completion-card" transition:fly={{y: 20, duration: 300}}>
        <div class="break-emoji"><i class="ti ti-coffee"></i></div>
        <div class="congrats-headline">{i18n.t('break.title')}</div>
        <p class="break-description">
            {i18n.t('break.description')}
        </p>
        <div class="button-column">
            <button class="btn-duo btn-green" onclick={onContinue}>
                {i18n.t('break.continue')}
            </button>
            <button class="btn-duo btn-outline" onclick={onExit}>
                {i18n.t('break.exit')}
            </button>
        </div>
    </div>
</div>
{/if}

<style>
    .completion-overlay {
        position: absolute;
        inset: 0;
        background: rgba(248, 250, 252, 0.94);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
    }
    .completion-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 5px;
        border-radius: 28px;
        padding: 30px 24px 28px;
        width: 90%;
        max-width: 340px;
        text-align: center;
        box-shadow: 0 7px 0 #e2e8f0, 0 12px 28px rgba(15, 23, 42, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .break-emoji {
        display: grid;
        place-items: center;
        width: 68px;
        height: 68px;
        margin-bottom: 14px;
        border-radius: 50%;
        background: #fff7ed;
        color: #f59e0b;
        font-size: 40px;
        line-height: 1;
    }
    .congrats-headline {
        font-size: 20px;
        font-weight: 900;
        color: #00978a;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }
    .break-description {
        font-size: 13px;
        color: #64748b;
        margin: 12px 0 22px;
        line-height: 1.6;
        font-weight: 500;
    }
    .button-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
    /* Tombolnya sengaja TIDAK didefinisikan ulang di sini. .btn-duo/.btn-green/
       .btn-outline sudah ada di app.css sebagai gaya acuan bersama (box-shadow
       untuk efek 3D, bukan border-bottom-width yang ikut menentukan tinggi
       elemen). Definisi lokal sebelumnya menimpa itu dengan border-bottom-width
       yang menyusut saat hover/aktif — pola lama yang sama yang bikin elemen di
       sekitarnya ikut bergeser — dan border outline-nya (#f1f5f9) nyaris tidak
       kelihatan di atas kartu putih. */
</style>
