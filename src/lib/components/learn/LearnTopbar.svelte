<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    let showToast = $state(false);
    let { onOpenStreakModal } = $props();

    $effect(() => {
        let innerTimer;
        const outerTimer = setTimeout(() => {
            showToast = true;
            innerTimer = setTimeout(() => (showToast = false), 4000);
        }, 800);
        return () => {
            clearTimeout(outerTimer);
            clearTimeout(innerTimer);
        };
    });
</script>

<div class="topbar" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
    <!-- Streak pill — bisa diklik untuk detail -->
    <button class="streak-pill" onclick={onOpenStreakModal} title={i18n.t('streak.view_details')}>
        <i class="ti ti-flame"></i>
        <span>{appState.user.streak}</span>
    </button>
    
    <div class="xp-pill">
        <i class="ti ti-star"></i><span>{appState.user.xp}</span>
    </div>
    
    <div class="gems-pill" onclick={() => appState.go('murojaah')} role="button" tabindex="0">
        <i class="ti ti-diamond gem-icon" aria-hidden="true"></i><span>{appState.user.gems}</span>
    </div>
</div>

{#if showToast}
    <div class="achievement-toast">
        <div style="font-size: 28px"><i class="ti ti-medal"></i></div>
        <div style="flex: 1">
            <div style="font-size: 12px; font-weight: 900; color: #007A70">{i18n.t('learn.streak_days')}</div>
            <div style="font-size: 11px; font-weight: 700; color: #afafaf">{i18n.t('learn.streak_msg')}</div>
        </div>
        <button onclick={() => showToast = false} class="close-toast">✕</button>
    </div>
{/if}

<style>
    .achievement-toast {
        position: absolute;
        top: 70px;
        left: 12px;
        right: 12px;
        background: #fff;
        border-radius: 16px;
        border: 2px solid #ffc800;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 100;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: slideDown 0.4s ease-out;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .close-toast { background: none; border: none; cursor: pointer; color: #afafaf; font-size: 18px; }
    .streak-pill {
        display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800;
        color: #ff6200; background: #fff7ed; border: 2px solid #fed7aa;
        padding: 5px 12px; border-radius: 100px; cursor: pointer;
        transition: all 0.15s; font-family: 'Nunito', sans-serif;
    }
    .streak-pill:hover { background: #fff0df; transform: scale(1.05); }
    .xp-pill {
        display: inline-flex; align-items: center; justify-content: center; gap: 4px;
        min-width: 46px; height: 32px; padding: 0 10px; box-sizing: border-box;
        border: 2px solid #ffe08a; border-radius: 999px; background: #fff3c4; color: #d99000;
        font-size: 14px; font-weight: 900; line-height: 1; font-family: 'Nunito', sans-serif;
    }
    .xp-pill i { color: #e5a900; }
    .gems-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-width: 46px;
        height: 32px;
        box-sizing: border-box;
        padding: 0 10px;
        border: 0;
        border-radius: 999px;
        background: #e1f5fe;
        color: #1cb0f6;
        font-size: 14px;
        font-weight: 900;
        line-height: 1;
        cursor: pointer;
        font-family: 'Nunito', sans-serif;
    }
    .gem-icon {
        display: inline-block;
        flex: 0 0 auto;
        color: #1cb0f6 !important;
        font-size: 16px;
        line-height: 1;
    }
    .gems-pill span { line-height: 1; }
</style>
