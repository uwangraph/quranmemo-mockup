<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    let { active = 'learn' } = $props();

    // Maksimal 5 tab agar label tetap terbaca di lebar ponsel.
    // Tadabbur dicapai lewat node di roadmap, Halaqah lewat tab di layar Liga.
    const items = $derived([
        { id: 'learn', label: i18n.t('nav.learn') },
        { id: 'murojaah', label: i18n.t('nav.murojaah') },
        { id: 'quests', label: i18n.t('nav.quests') },
        { id: 'league', label: i18n.t('nav.league') },
        { id: 'profile', label: i18n.t('nav.profile') }
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


<nav class="bottom-nav" aria-label={i18n.t('nav.main')}>
    {#each items as item}
        <button
            class="nav-item"
            class:active={active === item.id}
            aria-current={active === item.id ? 'page' : undefined}
            onclick={() => appState.go(item.id)}
        >
            <!-- Penanda tab aktif berupa batang, bukan warna saja, agar tetap terbaca
                 oleh pengguna dengan keterbatasan membedakan warna. -->
            <span class="nav-marker" aria-hidden="true"></span>
            <img src={getFlaticon(item.id)} alt="" class="nav-icon" />
            <span class="nav-label">{item.label}</span>
        </button>
    {/each}
</nav>

<style>
    .bottom-nav {
        display: flex;
        background: #fff;
        border-top: 2px solid #e5e5e5;
        padding: 8px 0 4px;
        margin-top: auto;
    }
    .nav-item {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        cursor: pointer;
        /* Target sentuh minimal 48px agar nyaman untuk jari anak maupun lansia. */
        min-height: 48px;
        padding: 4px 0;
        border: none;
        background: none;
        border-radius: 12px;
        transition: background 0.15s;
    }

    /* Batang penanda tab aktif — pembeda non-warna (WCAG 1.4.1). */
    .nav-marker {
        position: absolute;
        top: -8px;
        width: 0;
        height: 4px;
        border-radius: 0 0 4px 4px;
        background: var(--duo-green-dark, #007A70);
        transition: width 0.15s ease;
    }
    .nav-item.active .nav-marker {
        width: 32px;
    }

    .nav-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
        /* Ikon tab non-aktif tetap dibuat abu-abu, tetapi tanpa penurunan opasitas
           supaya bentuknya tetap jelas terlihat. */
        filter: grayscale(100%);
        transition: filter 0.2s;
    }
    .nav-item.active .nav-icon {
        filter: none;
    }

    .nav-label {
        /* rem agar ukuran teks ikut pengaturan ukuran font di perangkat pengguna. */
        font-size: 0.6875rem;
        line-height: 1.2;
        font-weight: 700;
        /* #616161 = rasio kontras 6.19:1 terhadap latar putih (sebelumnya #afafaf, 2.19:1 — gagal WCAG AA). */
        color: #616161;
        font-family: "Nunito", sans-serif;
        max-width: 100%;
        padding: 0 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .nav-item.active .nav-label {
        /* #007A70 = 5.23:1 (sebelumnya #00978A, 3.62:1 — gagal WCAG AA). */
        color: var(--duo-green-dark, #007A70);
        font-weight: 900;
    }

    /* Umpan balik saat ditekan — penting agar pengguna yakin sentuhannya diterima. */
    .nav-item:active {
        background: #f0f0f0;
    }
    .nav-item:focus-visible {
        outline: 3px solid var(--duo-green-dark, #007A70);
        outline-offset: -3px;
    }

    @media (prefers-reduced-motion: reduce) {
        .nav-item,
        .nav-marker,
        .nav-icon {
            transition: none;
        }
    }
</style>
