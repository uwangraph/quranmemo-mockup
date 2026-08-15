<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import StatsPills from '$lib/components/StatsPills.svelte';
    
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

<div class="topbar learn-topbar">
    <StatsPills showStreak={true} onOpenStreak={onOpenStreakModal} />

    <button class="notification-button" type="button" onclick={() => appState.go('reminders')} aria-label="Notifikasi" title="Notifikasi">
        <i class="ti ti-bell"></i>
    </button>
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
    .learn-topbar { justify-content: space-between; width: 100%; }
    .notification-button {
        width: 36px; height: 36px; padding: 0;
        display: inline-flex; align-items: center; justify-content: center;
        border: 1px solid #d6dee8; border-radius: 50%;
        background: #fff; color: #7c8a99; font-size: 19px;
        cursor: pointer; font-family: inherit;
        box-shadow: 0 4px 0 #d6dee8;
        transition: transform .12s ease, box-shadow .12s ease;
    }
    .notification-button:hover { transform: translateY(2px); box-shadow: 0 2px 0 #d6dee8; }
    .notification-button:active { transform: translateY(4px); box-shadow: none; }

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
</style>
