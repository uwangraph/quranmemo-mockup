<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import AdminOverviewTab from '$lib/components/admin/AdminOverviewTab.svelte';
    import AdminUsersTab from '$lib/components/admin/AdminUsersTab.svelte';
    import AdminMusyrifTab from '$lib/components/admin/AdminMusyrifTab.svelte';

    let activeTab = $state('overview');
</script>

<div class="screen">
    <!-- Header -->
    <div class="topbar" style="background: var(--admin-purple); color: #fff; border-bottom: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">🛡️</span>
            <div>
                <div style="font-size: 13px; font-weight: 900; letter-spacing: -0.3px;">Admin Dashboard</div>
                <div style="font-size: 9px; font-weight: 700; opacity: 0.7; text-transform: uppercase;">QuranMemo Analytics</div>
            </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div class="live-badge">
                <span class="live-dot"></span>LIVE
            </div>
            <button class="icon-btn-white">
                <i class="ti ti-bell"></i>
                <span class="notif-dot"></span>
            </button>
        </div>
    </div>

    <!-- Tab Nav -->
    <div class="tab-nav">
        {#each [['overview','📊','Ikhtisar'], ['users','👥','Pengguna'], ['musyrif','👳','Musyrif']] as [id, icon, label]}
            <button
                class="tab-btn"
                class:active={activeTab === id}
                onclick={() => activeTab = id}
            >
                {icon} {label}
            </button>
        {/each}
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 14px; padding-bottom: 24px; gap: 12px; display: flex; flex-direction: column;">
        {#if activeTab === 'overview'}
            <AdminOverviewTab />
        {:else if activeTab === 'users'}
            <AdminUsersTab />
        {:else if activeTab === 'musyrif'}
            <AdminMusyrifTab />
        {/if}
    </div>
</div>

<style>
    /* ======= TOPBAR ======= */
    .topbar {
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .live-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255,255,255,0.2);
        color: #fff;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1px;
        padding: 4px 8px;
        border-radius: 20px;
    }
    .live-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ef4444;
        animation: pulse-dot 1.2s infinite;
        flex-shrink: 0;
    }
    @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    .icon-btn-white {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        position: relative;
    }
    .notif-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 7px;
        height: 7px;
        background: #ef4444;
        border-radius: 50%;
        border: 1.5px solid #7c5cfc;
    }

    /* ======= TABS ======= */
    .tab-nav {
        display: flex;
        border-bottom: 2px solid #f0f0f0;
        background: #fff;
    }
    .tab-btn {
        flex: 1;
        background: none;
        border: none;
        font-family: 'Nunito', sans-serif;
        font-size: 10px;
        font-weight: 800;
        color: #afafaf;
        padding: 10px 4px;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }
    .tab-btn.active {
        color: var(--admin-purple);
        border-bottom-color: var(--admin-purple);
    }
</style>