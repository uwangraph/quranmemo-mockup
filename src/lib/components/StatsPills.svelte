<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    let { showStreak = false, onOpenStreak = null } = $props();
</script>

<div class="stats-pills">
    {#if showStreak}
        <button class="streak-pill" type="button" onclick={() => onOpenStreak?.()} title={i18n.t('streak.view_details')}>
            <i class="ti ti-flame" aria-hidden="true"></i><span>{appState.user.streak}</span>
        </button>
    {/if}
    <div class="xp-pill" aria-label={`XP: ${appState.user.xp}`}>
        <i class="ti ti-star" aria-hidden="true"></i><span>{appState.user.xp}</span>
    </div>
    <button class="gems-pill" type="button" onclick={() => appState.go('marketplace')} aria-label="Buka saldo gems">
        <i class="ti ti-diamond gem-icon" aria-hidden="true"></i><span>{appState.user.gems}</span>
    </button>
</div>

<style>
    .stats-pills { display: flex; align-items: center; gap: 10px; }
    .streak-pill,
    .xp-pill,
    .gems-pill {
        display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        min-width: 46px; height: 32px; box-sizing: border-box; padding: 0 10px;
        border: 1px solid; border-radius: 999px; font: 900 14px/1 'Nunito', sans-serif;
    }
    .streak-pill,
    .gems-pill {
        cursor: pointer;
        transition: transform .12s ease, box-shadow .12s ease, background-color .12s ease;
    }
    .streak-pill { color: #ff6200; background: #fff7ed; border-color: #ff6200; box-shadow: 0 3px 0 #ff6200; }
    .xp-pill { color: #d99000; background: #fff3c4; border-color: #d99000; box-shadow: 0 3px 0 #d99000; }
    .gems-pill { color: #1cb0f6; background: #e1f5fe; border-color: #1cb0f6; box-shadow: 0 3px 0 #1cb0f6; }
    .streak-pill i { color: #ff6200; }
    .xp-pill i { color: #e5a900; }
    .gem-icon { display: inline-block; flex: 0 0 auto; color: #1cb0f6 !important; font-size: 16px; line-height: 1; }
    .streak-pill:hover { transform: translateY(1px); box-shadow: 0 2px 0 #ff6200; background: #fff0df; }
    .gems-pill:hover { transform: translateY(1px); box-shadow: 0 2px 0 #1cb0f6; background: #d8f1fc; }
    .streak-pill:active,
    .gems-pill:active { transform: translateY(3px); box-shadow: none; }
</style>
