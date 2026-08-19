<script>
    // Header tunggal untuk semua layar admin.
    //
    // Sebelumnya tiap layar menulis headernya sendiri: AdminDashboard memakai bilah
    // ungu bertingkat dua dengan lencana LIVE, sedangkan AdminUsers dan AdminMusyrif
    // memakai bilah putih polos berisi judul saja. Akibatnya berpindah antar layar
    // admin terasa seperti berpindah aplikasi. Semua kini memakai bentuk yang sama;
    // yang berbeda hanya ikon, judul, dan subjudulnya.
    let { icon = 'ti-shield-check', title, subtitle, live = false, onBack = null } = $props();
    import { i18n } from '$lib/i18n.svelte.js';
</script>

<div class="admin-topbar">
    {#if onBack}
        <button class="admin-back" onclick={onBack} aria-label={i18n.t('common.close')}>
            <i class="ti ti-arrow-left"></i>
        </button>
    {/if}
    <i class="ti {icon} admin-mark"></i>
    <div class="admin-heading">
        <div class="admin-title">{title}</div>
        {#if subtitle}<div class="admin-subtitle">{subtitle}</div>{/if}
    </div>
    {#if live}
        <div class="live-badge"><span class="live-dot"></span>{i18n.t('admin.dash.live')}</div>
    {/if}
    <button class="icon-btn-white" aria-label={i18n.t('nav.main')}>
        <i class="ti ti-bell"></i>
        <span class="notif-dot"></span>
    </button>
</div>

<style>
    .admin-topbar {
        display: flex; align-items: center; gap: 10px;
        padding: 14px 16px; flex-shrink: 0;
        background: var(--admin-purple); color: #fff;
    }
    .admin-back {
        background: none; border: none; color: #fff; cursor: pointer;
        font-size: 18px; display: flex; align-items: center;
        width: 28px; height: 28px; margin-left: -4px; flex-shrink: 0;
    }
    .admin-mark { font-size: 18px; flex-shrink: 0; }
    /* min-width: 0 agar judul panjang terpotong rapi, bukan mendorong lencana keluar. */
    .admin-heading { flex: 1; min-width: 0; }
    .admin-title {
        font-size: 13px; font-weight: 900; letter-spacing: -0.3px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .admin-subtitle {
        font-size: 9px; font-weight: 700; opacity: 0.7; text-transform: uppercase;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .live-badge {
        display: flex; align-items: center; gap: 4px; flex-shrink: 0;
        background: rgba(255,255,255,0.18); border-radius: 99px;
        padding: 3px 8px; font-size: 8px; font-weight: 900;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .live-dot {
        width: 5px; height: 5px; border-radius: 50%; background: #4ade80;
        box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
        animation: live-pulse 1.8s infinite;
    }
    @keyframes live-pulse {
        70% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
        100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }
    @media (prefers-reduced-motion: reduce) { .live-dot { animation: none; } }

    .icon-btn-white {
        position: relative; flex-shrink: 0;
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(255,255,255,0.18); border: none; color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; cursor: pointer;
    }
    .notif-dot {
        position: absolute; top: 6px; right: 7px;
        width: 6px; height: 6px; border-radius: 50%;
        background: #ff4b4b; border: 1.5px solid var(--admin-purple);
    }
</style>
