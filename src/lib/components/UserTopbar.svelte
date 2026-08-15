<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    let { title = '', backTo = 'learn', rightIcon = '', rightTo = '', onBack = null, showBack = true } = $props();
</script>

<div class="topbar user-topbar">
    {#if showBack}
        <button class="user-topbar-btn" type="button" onclick={() => onBack ? onBack() : appState.go(backTo)} aria-label={i18n.t('common.back')}>
            <i class="ti ti-arrow-left"></i>
        </button>
    {:else}
        <span class="user-topbar-side" aria-hidden="true"></span>
    {/if}
    <span class="user-topbar-title">{title}</span>
    {#if rightIcon}
        <button class="user-topbar-btn" type="button" onclick={() => rightTo && appState.go(rightTo)} aria-label={title}>
            <i class="ti {rightIcon}"></i>
        </button>
    {:else}
        <span class="user-topbar-side" aria-hidden="true"></span>
    {/if}
</div>

<style>
    .user-topbar { justify-content: space-between; gap: 10px; min-height: 56px; padding: 9px 14px; background: #fff; border-bottom: 1px solid #e5e7eb; }
    .user-topbar-btn { width: 38px; height: 38px; flex: 0 0 38px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; color: #64748b; cursor: pointer; box-shadow: 0 3px 0 #cbd5e1; transition: transform .1s ease, box-shadow .1s ease; }
    .user-topbar-btn:hover { transform: translateY(1px); box-shadow: 0 2px 0 #cbd5e1; }
    .user-topbar-btn:active { transform: translateY(3px); box-shadow: none; }
    .user-topbar-title { flex: 1; min-width: 0; text-align: center; color: #1e293b; font-size: 16px; font-weight: 900; }
    .user-topbar-side { width: 38px; flex: 0 0 38px; }
</style>
