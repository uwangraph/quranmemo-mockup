<script>
    import { appState } from '$lib/app.svelte.js';
    import { fade } from 'svelte/transition';
    import TajwidCard from '$lib/components/tajwid/TajwidCard.svelte';

    let { onClose = null, isModal = false } = $props();

    // State untuk accordion - mana yang sedang terbuka
    let openCategory = $state(null);
    let openItem = $state(null);

    function toggleCategory(index) {
        openCategory = openCategory === index ? null : index;
        openItem = null; // reset item saat ganti kategori
    }

    function toggleItem(key) {
        openItem = openItem === key ? null : key;
    }

    import { tajweedCategories } from '$lib/data/tajweed.js';

</script>

<div class="screen {isModal ? 'modal-overlay' : ''}" in:fade={{duration: 200}}>
    <!-- Header -->
    <header class="app-header">
        <button class="icon-btn" onclick={() => { if (onClose) onClose(); else appState.go('lesson'); }}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <h1 class="page-title">Info Tajwid</h1>
        <div style="width: 40px;"></div>
    </header>

    <!-- Scrollable Content -->
    <main class="tajwid-content">
        <p class="subtitle">Tap setiap hukum untuk melihat penjelasan & contoh</p>

        {#each tajweedCategories as cat, catIdx}
            <div in:fade={{delay: catIdx * 60, duration: 300}}>
                <TajwidCard 
                    {cat} 
                    isOpen={openCategory === catIdx} 
                    onToggle={() => toggleCategory(catIdx)}
                    openItem={openCategory === catIdx ? openItem : null}
                    onToggleItem={(itemKey) => toggleItem(itemKey)}
                />
            </div>
        {/each}

        <div style="height: 48px;"></div>
    </main>
</div>

<style>
    .screen {
        width: 100%;
        height: 100%;
        background-color: #f1f5f9;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    }

    .screen.modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
    }

    .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        height: 58px;
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        flex-shrink: 0;
        z-index: 10;
    }

    .icon-btn {
        background: none;
        border: none;
        font-size: 22px;
        color: #334155;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background 0.18s;
    }
    .icon-btn:hover { background: #f1f5f9; }

    .page-title {
        font-size: 17px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
    }

    .tajwid-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 14px;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .subtitle {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
        margin: 0 0 4px 0;
        letter-spacing: 0.2px;
    }

    </style>
