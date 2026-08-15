<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    let { active = 'learn' } = $props();

    // Maksimal 5 tab agar label tetap terbaca di lebar ponsel.
    // Tadabbur dicapai lewat node di roadmap, Halaqah lewat tab di layar Liga.
    const items = $derived([
        { id: 'learn', label: i18n.t('nav.learn'), icon: 'ti-book-2' },
        { id: 'murojaah', label: i18n.t('nav.murojaah'), icon: 'ti-refresh' },
        { id: 'marketplace', label: i18n.t('nav.submission'), icon: 'ti-microphone' },
        { id: 'league', label: i18n.t('nav.league'), icon: 'ti-trophy' },
        { id: 'profile', label: i18n.t('nav.profile'), icon: 'ti-user-circle' }
    ]);
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
            <i class="ti {item.icon} nav-icon" aria-hidden="true"></i>
            <span class="nav-label">{item.label}</span>
        </button>
    {/each}
</nav>

<style>
    .bottom-nav {
        display: flex;
        background: #fff;
        border-top: 2px solid #e5e5e5;
        padding: 10px 8px 6px;
        margin-top: auto;
        gap: 4px;
    }
    .nav-item {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        /* Target sentuh minimal 48px agar nyaman untuk jari anak maupun lansia. */
        min-height: 64px;
        padding: 6px 4px;
        border: none;
        background: none;
        border-radius: 14px;
        color: #475569;
        transition: transform .1s ease, background-color .1s ease;
    }

    /* Batang penanda tab aktif — pembeda non-warna (WCAG 1.4.1). */
    .nav-marker {
        position: absolute;
        top: -10px;
        width: 0;
        height: 4px;
        border-radius: 0 0 4px 4px;
        background: var(--duo-green, #00978A);
        transition: width 0.15s ease;
    }
    .nav-item.active .nav-marker {
        width: 32px;
    }

    .nav-icon {
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        color: currentColor;
        transition: transform 0.2s ease, color 0.2s ease;
    }
    .nav-item.active .nav-icon {
        color: var(--duo-green-dark, #007A70);
        transform: scale(1.04);
    }

    .nav-label {
        /* rem agar ukuran teks ikut pengaturan ukuran font di perangkat pengguna. */
        font-size: 0.75rem;
        line-height: 1.2;
        font-weight: 800;
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
        transform: translateY(3px);
        background: #f0fdfa;
    }
    .nav-item:hover {
        background: #f8fffe;
        transform: translateY(1px);
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
