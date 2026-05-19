<script>
    import { fade, fly } from 'svelte/transition';
    import { i18n } from '$lib/i18n.svelte.js';
    let { showBreakModal, onContinue, onExit } = $props();
</script>

{#if showBreakModal}
<div class="completion-overlay" transition:fade={{duration: 200}}>
    <div class="completion-card" transition:fly={{y: 20, duration: 300}}>
        <div class="break-emoji">☕</div>
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
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
    }
    .completion-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 6px;
        border-radius: 28px;
        padding: 36px 24px;
        width: 90%;
        max-width: 340px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .break-emoji {
        font-size: 56px;
        margin-bottom: 12px;
    }
    .congrats-headline {
        font-size: 20px;
        font-weight: 950;
        color: #f59e0b;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }
    .break-description {
        font-size: 13px;
        color: #64748b;
        margin: 12px 0 24px;
        line-height: 1.6;
        font-weight: 500;
    }
    .button-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
    .btn-duo {
        width: 100%;
        padding: 14px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        background: #fff;
        font-size: 13px;
        font-weight: 900;
        color: #afafaf;
        cursor: pointer;
        transition: all 0.1s ease;
        text-align: center;
        box-sizing: border-box;
    }
    .btn-duo:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .btn-duo.btn-green {
        background: #00978A;
        border-color: #00978A;
        border-bottom-color: #007A70;
        color: #fff;
    }
    .btn-duo.btn-outline {
        border-color: #f1f5f9;
        background: #fff;
        color: #64748b;
    }
</style>
