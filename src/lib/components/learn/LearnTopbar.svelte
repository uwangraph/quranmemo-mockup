<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    let showToast = $state(false);

    $effect(() => {
        const timer = setTimeout(() => {
            showToast = true;
            setTimeout(() => showToast = false, 4000);
        }, 800);
        return () => clearTimeout(timer);
    });
</script>

<div class="topbar">
    <div class="streak-pill">
        <i class="ti ti-flame"></i> {appState.user.streak}
    </div>
    <div style="flex: 1; display: flex; justify-content: center">
        <span style="font-size: 18px; font-weight: 900; color: var(--duo-green); letter-spacing: -1px;">{i18n.t('learn.title')}</span>
    </div>
    <div style="display: flex; gap: 12px;">
        <div class="points-pill" onclick={() => appState.go('murojaah')}>
            <i class="ti ti-bolt-filled"></i> {appState.user.xp}
        </div>
    </div>
</div>

{#if showToast}
    <div class="achievement-toast">
        <div style="font-size: 28px">🥇</div>
        <div style="flex: 1">
            <div style="font-size: 12px; font-weight: 900; color: #cc7000">{i18n.t('learn.streak_days')}</div>
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
    .streak-pill { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800; color: #ff9600; }
    .points-pill { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800; color: #ff9600; cursor: pointer; border: 2px solid #fff7e6; padding: 4px 10px; border-radius: 100px; background: #fffbf2; }
</style>
