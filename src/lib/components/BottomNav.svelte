<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    let { active = 'learn' } = $props();

    // Make items reactive so they update when language changes
    const items = $derived([
        { id: 'learn', icon: 'ti-home', label: i18n.t('nav.learn') },
        { id: 'murojaah', icon: 'ti-refresh', label: i18n.t('nav.murojaah') },
        { id: 'tadabbur', icon: 'ti-book', label: i18n.t('nav.tadabbur') },
        { id: 'quests', icon: 'ti-gift', label: i18n.t('nav.quests') },
        { id: 'halaqah', icon: 'ti-users', label: i18n.t('nav.halaqah') },
        { id: 'league', icon: 'ti-trophy', label: i18n.t('nav.league') },
        { id: 'profile', icon: 'ti-user', label: i18n.t('nav.profile') }
    ]);
    function getFlaticon(id) {
        const mapping = {
            'learn': 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png',
            'murojaah': 'https://cdn-icons-png.flaticon.com/512/3468/3468081.png',
            'tadabbur': 'https://cdn-icons-png.flaticon.com/512/2947/2947998.png',
            'quests': 'https://cdn-icons-png.flaticon.com/512/4006/4006326.png', 
            'halaqah': 'https://cdn-icons-png.flaticon.com/512/3364/3364024.png',
            'league': 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png',
            'profile': 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        };
        return mapping[id] || 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png';
    }
</script>


<div class="bottom-nav">
    {#each items as item}
        <button 
            class="nav-item" 
            class:active={active === item.id}
            onclick={() => appState.go(item.id)}
        >
            <img src={getFlaticon(item.id)} alt="" style="width: 22px; height: 22px; object-fit: contain; filter: {active === item.id ? 'none' : 'grayscale(100%) opacity(60%)'}; transition: all 0.2s; margin-bottom: 2px;" />
            <span>{item.label}</span>
        </button>
    {/each}
</div>

<style>
    .bottom-nav {
        display: flex;
        background: #fff;
        border-top: 2px solid #e5e5e5;
        padding: 8px 0 4px;
        margin-top: auto;
    }
    .nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        cursor: pointer;
        padding: 4px 0;
        border: none;
        background: none;
    }
    .nav-item i {
        font-size: 22px;
        color: #afafaf;
    }
    .nav-item.active i {
        color: #00978A;
    }
    .nav-item span {
        font-size: 9px;
        font-weight: 700;
        color: #afafaf;
        font-family: "Nunito", sans-serif;
    }
    .nav-item.active span {
        color: #00978A;
    }
</style>
