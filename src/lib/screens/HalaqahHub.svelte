<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    let activeTab = $state('my-community');
    let communityView = $state('all-member');

    const tabs = $derived([
        { id: 'my-community', label: i18n.t('lb.tab_my_community') || 'Komunitasku', icon: '👥' },
        { id: 'my-halaqah', label: i18n.t('lb.tab_my_halaqah') || 'Halaqahku', icon: '🤝' },
        { id: 'explore-komunitas', label: 'Eksplor Komunitas', icon: '🏘️' },
        { id: 'explore-halaqah', label: 'Eksplor Halaqah', icon: '📖' },
    ]);

    // Mock Data for Explore (Global)
    const halaqahList = $derived([
        { name: 'Halaqah Al-Fatih', xp: 12400, members: 15, avatar: '🟢', region: '🇮🇩' },
        { name: 'Halaqah An-Nur', xp: 11200, members: 18, avatar: '🔵', region: '🇲🇾' },
        { name: 'Halaqah Al-Huda', xp: 9800, members: 12, avatar: '🟡', region: '🇮🇩' },
        { name: 'Halaqah Ar-Rahman', xp: 8500, members: 20, avatar: '🟣', region: '🇸🇦' },
        { name: 'Halaqah Al-Amin', xp: 7200, members: 10, avatar: '🟠', region: '🇳🇬' },
    ].sort((a, b) => b.xp - a.xp).map((h, i) => ({ ...h, rank: i + 1 })));

    const komunitasList = $derived([
        { name: 'Pesantren Al-Hikmah', xp: 45200, members: 120, halaqah: 8, avatar: '🏛️', region: '🇮🇩' },
        { name: 'Madrasah An-Nur', xp: 38900, members: 85, halaqah: 6, avatar: '🕌', region: '🇲🇾' },
        { name: 'QuranHub Global', xp: 32100, members: 200, halaqah: 12, avatar: '🌐', region: '🇸🇦' },
        { name: 'Tahfiz Center', xp: 28700, members: 65, halaqah: 4, avatar: '📚', region: '🇮🇩' },
    ].sort((a, b) => b.xp - a.xp).map((k, i) => ({ ...k, rank: i + 1 })));

    // Mock Data for "My Community"
    const myCommunityMembers = $derived([
        { name: 'Siti Nurhaliza', xp: 3200, avatar: '🧕', halaqah: 'Al-Fatih' },
        { name: i18n.t('lb.you') || 'Kamu', xp: appState.user.xp, avatar: '👤', halaqah: 'Al-Fatih', isMe: true },
        { name: 'Ahmad Dani', xp: 2100, avatar: '🧔', halaqah: 'An-Nur' },
        { name: 'Budi Utomo', xp: 1800, avatar: '👨', halaqah: 'Al-Fatih' },
        { name: 'Sarah W.', xp: 1500, avatar: '👩', halaqah: 'An-Nur' },
        { name: 'Rizky B.', xp: 1200, avatar: '👦', halaqah: 'Al-Huda' },
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 })));

    const myCommunityHalaqahs = $derived([
        { name: 'Halaqah Al-Fatih', xp: 8200, members: 15, avgXp: 547, avatar: '🟢' },
        { name: 'Halaqah An-Nur', xp: 6800, members: 12, avgXp: 567, avatar: '🔵' },
        { name: 'Halaqah Al-Huda', xp: 5400, members: 10, avgXp: 540, avatar: '🟡' },
    ].sort((a, b) => b.xp - a.xp).map((h, i) => ({ ...h, rank: i + 1 })));

    const myHalaqahMembers = $derived([
        { name: 'Siti Nurhaliza', xp: 3200, avatar: '🧕' },
        { name: i18n.t('lb.you') || 'Kamu', xp: appState.user.xp, avatar: '👤', isMe: true },
        { name: 'Budi Utomo', xp: 1800, avatar: '👨' },
        { name: 'Dewi Sartika', xp: 1600, avatar: '👩' },
        { name: 'Hasan Ali', xp: 1400, avatar: '🧔' },
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 })));

    function getCurrentData() {
        if (activeTab === 'explore-halaqah') return halaqahList;
        if (activeTab === 'explore-komunitas') return komunitasList;
        if (activeTab === 'my-community') {
            return communityView === 'all-member' ? myCommunityMembers : myCommunityHalaqahs;
        }
        if (activeTab === 'my-halaqah') return myHalaqahMembers;
        return myCommunityMembers;
    }

    const currentData = $derived(getCurrentData());

</script>

<div class="screen">
    <!-- Top Bar -->
    <div class="topbar" style="background: linear-gradient(135deg, #0284c7, #0ea5e9); padding: 14px 16px 10px;">
        <span style="font-size: 16px; font-weight: 900; color: #fff; flex: 1; text-align: center;">
            🤝 Hub Komunitas & Halaqah
        </span>
    </div>

    <div class="scroll-content no-scrollbar">
        <!-- Tab Scroller -->
        <div class="tab-scroller no-scrollbar">
            {#each tabs as tab}
                <button
                    class="tab-chip"
                    class:active={activeTab === tab.id}
                    onclick={() => { activeTab = tab.id; communityView = 'all-member'; }}
                >
                    <span class="tab-icon">{tab.icon}</span>
                    <span class="tab-label">{tab.label}</span>
                </button>
            {/each}
        </div>

        {#if activeTab === 'my-community'}
            <div class="info-banner">
                <div class="info-banner-icon">🏘️</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Pesantren Al-Hikmah</div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf;">120 {i18n.t('lb.members')} · 8 {i18n.t('lb.tab_halaqah')} · {i18n.t('lb.private')}</div>
                </div>
            </div>
            <div class="community-toggle">
                <button class="ctog" class:active={communityView === 'all-member'} onclick={() => communityView = 'all-member'}>
                    👤 {i18n.t('lb.all_members') || 'Semua Anggota'}
                </button>
                <button class="ctog" class:active={communityView === 'per-halaqah'} onclick={() => communityView = 'per-halaqah'}>
                    📖 {i18n.t('lb.per_halaqah') || 'Per Halaqah'}
                </button>
            </div>
        {:else if activeTab === 'my-halaqah'}
            <div class="info-banner">
                <div class="info-banner-icon">🟢</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Halaqah Al-Fatih</div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf;">15/20 {i18n.t('lb.members')} · Pesantren Al-Hikmah</div>
                </div>
            </div>
        {/if}

        <!-- Create Buttons for Explore Tabs -->
        {#if activeTab === 'explore-komunitas'}
            <div style="padding: 12px 16px;">
                <button class="create-btn" onclick={() => appState.go('create_community')}>
                    <i class="ti ti-plus"></i> Buat Komunitas Baru
                </button>
            </div>
        {/if}

        {#if activeTab === 'explore-halaqah'}
            <div style="padding: 12px 16px;">
                <button class="create-btn" onclick={() => appState.go('create_halaqah')}>
                    <i class="ti ti-plus"></i> Buat Halaqah Mandiri
                </button>
            </div>
        {/if}

        <div style="padding: 10px 16px; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">
            Peringkat Internal
        </div>

        <!-- Ranking List -->
        <div class="ranking-list">
            {#each currentData as r}
                <div class="rank-item" class:is-me={r.isMe}>
                    <div class="rank-num">{r.rank}</div>
                    <div class="rank-avatar">{r.avatar}</div>
                    <div class="rank-info">
                        <div class="rank-name">
                            {r.name}
                            {#if r.isMe}
                                <span class="me-badge">KAMU</span>
                            {/if}
                        </div>
                        {#if r.members}
                            <div class="rank-sub">{r.members} anggota{#if r.halaqah} · {r.halaqah} Halaqah{/if}</div>
                        {:else if r.halaqah && !r.members}
                            <div class="rank-sub">{r.halaqah}</div>
                        {/if}
                    </div>
                    <div class="rank-xp-col">
                        <div class="rank-xp">{r.xp.toLocaleString()}</div>
                        <div class="rank-xp-label">XP</div>
                    </div>
                </div>
            {/each}
        </div>

        <div style="height: 20px;"></div>
    </div>

    <!-- We add halaqah as active to bottom nav -->
    <BottomNav active="halaqah" />
</div>

<style>
    .tab-scroller {
        display: flex;
        gap: 6px;
        padding: 10px 12px;
        overflow-x: auto;
        background: #fff;
        border-bottom: 2px solid #f0f0f0;
    }
    .tab-chip {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 7px 12px;
        border-radius: 100px;
        border: 2px solid #e5e5e5;
        background: #fff;
        font-family: 'Nunito', sans-serif;
        font-size: 11px;
        font-weight: 800;
        color: #777;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
        flex-shrink: 0;
    }
    .tab-chip.active {
        background: #0284c7;
        color: #fff;
        border-color: #0284c7;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
    }
    .tab-icon { font-size: 13px; }
    .tab-label { font-size: 10px; }

    .info-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #f0f9ff;
        border-bottom: 2px solid #e0f2fe;
    }
    .info-banner-icon { font-size: 28px; }

    .community-toggle {
        display: flex;
        gap: 6px;
        padding: 8px 16px;
        background: #fff;
        border-bottom: 2px solid #f0f0f0;
    }
    .ctog {
        flex: 1;
        padding: 8px 10px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        background: #fff;
        font-family: 'Nunito', sans-serif;
        font-size: 11px;
        font-weight: 800;
        color: #777;
        cursor: pointer;
        transition: all 0.2s;
    }
    .ctog.active {
        background: #e0f2fe;
        border-color: #0ea5e9;
        color: #0284c7;
    }

    .ranking-list {
        padding: 0 12px;
    }
    .rank-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        margin-bottom: 6px;
        background: #fff;
        border: 2px solid #f0f0f0;
        transition: all 0.15s;
    }
    .rank-item.is-me {
        background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
        border-color: #0284c7;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.12);
    }
    .rank-num {
        font-size: 13px;
        font-weight: 900;
        color: #afafaf;
        width: 22px;
        text-align: center;
        flex-shrink: 0;
    }
    .is-me .rank-num { color: #0284c7; }
    .rank-avatar {
        width: 36px;
        height: 36px;
        background: #f7f7f7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
    }
    .rank-info {
        flex: 1;
        min-width: 0;
    }
    .rank-name {
        font-size: 12px;
        font-weight: 800;
        color: #3c3c3c;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .me-badge {
        font-size: 8px;
        font-weight: 900;
        background: #0284c7;
        color: #fff;
        padding: 1px 6px;
        border-radius: 100px;
    }
    .rank-sub {
        font-size: 10px;
        font-weight: 700;
        color: #afafaf;
        margin-top: 1px;
    }
    .rank-xp-col {
        text-align: right;
        flex-shrink: 0;
    }
    .rank-xp {
        font-size: 13px;
        font-weight: 900;
        color: #3c3c3c;
    }
    .rank-xp-label {
        font-size: 9px;
        font-weight: 700;
        color: #afafaf;
    }

    .create-btn {
        width: 100%;
        padding: 12px;
        background: #f0f9ff;
        color: #0284c7;
        border: 2px dashed #0284c7;
        border-radius: 12px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s;
    }
    .create-btn:active {
        background: #e0f2fe;
        transform: translateY(1px);
    }
</style>
