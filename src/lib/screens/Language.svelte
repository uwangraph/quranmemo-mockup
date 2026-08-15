<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n, locales } from '$lib/i18n.svelte.js';
    import UserTopbar from '$lib/components/UserTopbar.svelte';
    
    function selectLanguage(code) {
        i18n.locale = code;
        appState.go('profile');
    }
</script>

<div class="screen">
    <UserTopbar title={i18n.t('settings.language')} backTo="profile" />

    <div class="scroll-content" style="padding: 16px;">
        <div class="lang-grid">
            {#each locales as l}
                <button 
                    class="lang-card" 
                    class:active={i18n.locale === l.code}
                    onclick={() => selectLanguage(l.code)}
                >
                    <div class="flag-circle">{l.flag}</div>
                    <div class="lang-name">{l.label}</div>
                    {#if i18n.locale === l.code}
                        <div class="check-icon"><i class="ti ti-check"></i></div>
                    {/if}
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .lang-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .lang-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border-radius: 16px;
        border: 2px solid #e5e5e5;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
    }
    .lang-card:active {
        transform: translateY(2px);
    }
    .lang-card.active {
        border-color: #00978a;
        background: #e8f8f6;
    }
    .flag-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #f7f7f7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        border: 2px solid #e5e5e5;
    }
    .active .flag-circle {
        border-color: #00978a;
        background: #fff;
    }
    .lang-name {
        flex: 1;
        font-size: 16px;
        font-weight: 800;
        color: #3c3c3c;
    }
    .active .lang-name {
        color: #00978a;
    }
    .check-icon {
        color: #00978a;
        font-size: 20px;
        font-weight: 900;
    }
</style>
