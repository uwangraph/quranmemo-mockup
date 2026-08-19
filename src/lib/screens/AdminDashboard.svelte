<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
    import AdminOverviewTab from '$lib/components/admin/AdminOverviewTab.svelte';
    import AdminUsersTab from '$lib/components/admin/AdminUsersTab.svelte';
    import AdminMusyrifTab from '$lib/components/admin/AdminMusyrifTab.svelte';

    let activeTab = $state('overview');
</script>

<div class="screen">
    <AdminHeader
        title={i18n.t('admin.dash.title')}
        subtitle={i18n.t('admin.dash.analytics')}
        live />

    <!-- Tab Nav -->
    <div class="tab-nav">
        {#each [['overview','ti-chart-bar',i18n.t('admin.dash.tab_overview')], ['users','ti-users',i18n.t('admin.dash.tab_users')], ['musyrif','ti-chalkboard-teacher',i18n.t('admin.dash.tab_musyrif')]] as [id, icon, label]}
            <button
                class="tab-btn"
                class:active={activeTab === id}
                onclick={() => activeTab = id}
            >
                <i class="ti {icon}"></i> {label}
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
