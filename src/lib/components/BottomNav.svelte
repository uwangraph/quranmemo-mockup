<script>
    import { appState } from '$lib/app.svelte.js';
    let { active = 'learn' } = $props();

    const items = [
        { id: 'learn', icon: 'ti-home', label: 'Belajar' },
        { id: 'murojaah', icon: 'ti-refresh', label: 'Murojaah' },
        { id: 'tadabbur', icon: 'ti-book', label: 'Tadabbur' },
        { id: 'league', icon: 'ti-trophy', label: 'Liga' },
        { id: 'profile', icon: 'ti-user', label: 'Profil' }
    ];
</script>

<div class="bottom-nav">
    {#each items as item}
        <button 
            class="nav-item" 
            class:active={active === item.id}
            onclick={() => appState.go(item.id)}
        >
            <i class="ti {item.icon}"></i>
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
        color: #58cc02;
    }
    .nav-item span {
        font-size: 9px;
        font-weight: 700;
        color: #afafaf;
        font-family: "Nunito", sans-serif;
    }
    .nav-item.active span {
        color: #58cc02;
    }
</style>
