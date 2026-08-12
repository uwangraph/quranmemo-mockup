<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    let activeTab = $state('my-community');
    let communityView = $state('all-member');
    // LEARDERBOARD.md: papan halaqah & komunitas punya versi Global dan Regional,
    // masing-masing dalam empat periode.
    let scope = $state('global');
    let activePeriod = $state('weekly');

    const MY_REGION = 'ID';
    const periods = $derived([
        { id: 'weekly', label: i18n.t('lb.weekly') },
        { id: 'monthly', label: i18n.t('lb.monthly') },
        { id: 'alltime', label: i18n.t('lb.alltime') },
        { id: 'event', label: i18n.t('lb.event') },
    ]);
    const isExplore = $derived(activeTab === 'explore-halaqah' || activeTab === 'explore-komunitas');

    // Angka per periode, sejalan dengan layar Liga.
    const periodScale = $derived({ weekly: 0.12, monthly: 0.4, alltime: 1, event: 0.25 }[activePeriod] ?? 1);
    const scaled = (n) => Math.round(n * periodScale);

    // XP yang disumbangkan pengguna ini ke halaqahnya lewat setoran (XP.md).
    const myHalaqahContribution = $derived(appState.user.halaqahXp ?? 0);

    const tabs = $derived([
        { id: 'my-community', label: i18n.t('lb.tab_my_community') || 'Komunitasku', icon: 'ti-users' },
        { id: 'my-halaqah', label: i18n.t('lb.tab_my_halaqah') || 'Halaqahku', icon: 'ti-hand-stop' },
        { id: 'explore-komunitas', label: 'Eksplor Komunitas', icon: 'ti-buildings' },
        { id: 'explore-halaqah', label: 'Eksplor Halaqah', icon: 'ti-book-2' },
    ]);

    // Mock Data for Explore (Global)
    const halaqahList = $derived([
        { name: 'Halaqah Al-Fatih', xp: scaled(12400), members: 15, avatar: 'ti-users', region: 'ID' },
        { name: 'Halaqah An-Nur', xp: scaled(11200), members: 18, avatar: 'ti-users', region: 'MY' },
        { name: 'Halaqah Al-Huda', xp: scaled(9800), members: 12, avatar: 'ti-users', region: 'ID' },
        { name: 'Halaqah Ar-Rahman', xp: scaled(8500), members: 20, avatar: 'ti-users', region: 'SA' },
        { name: 'Halaqah Al-Amin', xp: scaled(7200), members: 10, avatar: 'ti-users', region: 'NG' },
    ].sort((a, b) => b.xp - a.xp).map((h, i) => ({ ...h, rank: i + 1 })));

    const komunitasList = $derived([
        { name: 'Pesantren Al-Hikmah', xp: scaled(45200), members: 120, halaqah: 8, avatar: 'ti-buildings', region: 'ID' },
        { name: 'Madrasah An-Nur', xp: scaled(38900), members: 85, halaqah: 6, avatar: 'ti-mosque', region: 'MY' },
        { name: 'QuranHub Global', xp: scaled(32100), members: 200, halaqah: 12, avatar: 'ti-globe', region: 'SA' },
        { name: 'Tahfiz Center', xp: scaled(28700), members: 65, halaqah: 4, avatar: 'ti-books', region: 'ID' },
    ].sort((a, b) => b.xp - a.xp).map((k, i) => ({ ...k, rank: i + 1 })));

    // Mock Data for "My Community"
    const myCommunityMembers = $derived([
        { name: 'Siti Nurhaliza', xp: scaled(3200), avatar: 'ti-user-circle', halaqah: 'Al-Fatih' },
        { name: i18n.t('lb.you') || 'Kamu', xp: appState.xpForPeriod(activePeriod), avatar: 'ti-user-circle', halaqah: 'Al-Fatih', isMe: true },
        { name: 'Ahmad Dani', xp: scaled(2100), avatar: 'ti-user-circle', halaqah: 'An-Nur' },
        { name: 'Budi Utomo', xp: scaled(1800), avatar: 'ti-user-circle', halaqah: 'Al-Fatih' },
        { name: 'Sarah W.', xp: scaled(1500), avatar: 'ti-user-circle', halaqah: 'An-Nur' },
        { name: 'Rizky B.', xp: scaled(1200), avatar: 'ti-user-circle', halaqah: 'Al-Huda' },
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 })));

    const myCommunityHalaqahs = $derived([
        { name: 'Halaqah Al-Fatih', xp: scaled(8200), members: 15, avgXp: 547, avatar: 'ti-users' },
        { name: 'Halaqah An-Nur', xp: scaled(6800), members: 12, avgXp: 567, avatar: 'ti-users' },
        { name: 'Halaqah Al-Huda', xp: scaled(5400), members: 10, avgXp: 540, avatar: 'ti-users' },
    ].sort((a, b) => b.xp - a.xp).map((h, i) => ({ ...h, rank: i + 1 })));

    const myHalaqahMembers = $derived([
        { name: 'Siti Nurhaliza', xp: scaled(3200), avatar: 'ti-user-circle' },
        { name: i18n.t('lb.you') || 'Kamu', xp: appState.xpForPeriod(activePeriod), avatar: 'ti-user-circle', isMe: true },
        { name: 'Budi Utomo', xp: scaled(1800), avatar: 'ti-user-circle' },
        { name: 'Dewi Sartika', xp: scaled(1600), avatar: 'ti-user-circle' },
        { name: 'Hasan Ali', xp: scaled(1400), avatar: 'ti-user-circle' },
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 })));

    // Peringkat regional adalah daftar global yang disaring per negara, lalu
    // dinomori ulang — kalau tidak, peringkat 1 regional bisa tampil sebagai #4.
    function scoped(list) {
        if (scope === 'global') return list;
        return list.filter(x => x.region === MY_REGION).map((x, i) => ({ ...x, rank: i + 1 }));
    }

    function getCurrentData() {
        if (activeTab === 'explore-halaqah') return scoped(halaqahList);
        if (activeTab === 'explore-komunitas') return scoped(komunitasList);
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
        <button onclick={() => appState.go('league')} style="background: none; border: none; cursor: pointer; display: flex; align-items: center;" title={i18n.t('nav.league')}>
            <i class="ti ti-arrow-left" style="font-size: 20px; color: #fff;"></i>
        </button>
        <span style="font-size: 16px; font-weight: 900; color: #fff; flex: 1; text-align: center;">
            <i class="ti ti-hand-stop"></i> Hub Komunitas & Halaqah
        </span>
        <div style="width: 20px"></div>
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
                    <span class="tab-icon"><i class="ti {tab.icon}"></i></span>
                    <span class="tab-label">{tab.label}</span>
                </button>
            {/each}
        </div>

        {#if isExplore}
            <div class="scope-toggle">
                <button class="ctog" class:active={scope === 'global'} onclick={() => scope = 'global'}>
                    <i class="ti ti-globe"></i> {i18n.t('lb.tab_global_user')}
                </button>
                <button class="ctog" class:active={scope === 'regional'} onclick={() => scope = 'regional'}>
                    <i class="ti ti-map-pin"></i> {i18n.t('lb.tab_regional')}
                </button>
            </div>
        {/if}

        <div class="period-bar">
            {#each periods as p}
                <button class="period-btn" class:active={activePeriod === p.id} onclick={() => activePeriod = p.id}>
                    {p.label}
                </button>
            {/each}
        </div>

        {#if activeTab === 'my-community'}
            <div class="info-banner">
                <div class="info-banner-icon"><i class="ti ti-buildings"></i></div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Pesantren Al-Hikmah</div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf;">120 {i18n.t('lb.members')} · 8 {i18n.t('lb.tab_halaqah')} · {i18n.t('lb.private')}</div>
                </div>
            </div>
            <div class="community-toggle">
                <button class="ctog" class:active={communityView === 'all-member'} onclick={() => communityView = 'all-member'}>
                    <i class="ti ti-users"></i> {i18n.t('lb.all_members') || 'Semua Anggota'}
                </button>
                <button class="ctog" class:active={communityView === 'per-halaqah'} onclick={() => communityView = 'per-halaqah'}>
                    <i class="ti ti-book-2"></i> {i18n.t('lb.per_halaqah') || 'Per Halaqah'}
                </button>
            </div>
        {:else if activeTab === 'my-halaqah'}
            <div class="info-banner">
                <div class="info-banner-icon"><i class="ti ti-users"></i></div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Halaqah Al-Fatih</div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf;">15/20 {i18n.t('lb.members')} · Pesantren Al-Hikmah</div>
                </div>
            </div>
            <!-- Setiap setoran anggota menyumbang XP ke halaqahnya (XP.md — XP Halaqah).
                 Sebelumnya angka ini dicatat tapi tidak pernah terlihat di mana pun. -->
            <div class="contrib-card">
                <span class="contrib-icon"><i class="ti ti-hand-stop"></i></span>
                <div style="flex:1; min-width:0;">
                    <div class="contrib-label">{i18n.t('lb.src_halaqah')}</div>
                    <div class="contrib-sub">{i18n.t('halaqah.your_contribution')}</div>
                </div>
                <span class="contrib-val">+{myHalaqahContribution.toLocaleString()} XP</span>
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
                    <div class="rank-avatar"><i class="ti {r.members ? 'ti-buildings' : 'ti-user-circle'}"></i></div>
                    <div class="rank-info">
                        <div class="rank-name">
                            {r.name}
                            {#if r.isMe}
                                <span class="me-badge">{i18n.t('lb.you_badge')}</span>
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
    <!-- Halaqah kini sub-layar dari Liga, jadi tab Liga yang disorot. -->
    <BottomNav active="league" />
</div>

<style>
    .contrib-card {
        display: flex; align-items: center; gap: 12px; margin: 0 16px 4px;
        background: #f5f3ff; border: 2px solid #ddd6fe; border-radius: 14px; padding: 12px;
    }
    .contrib-icon { font-size: 22px; }
    .contrib-label { font-size: 13px; font-weight: 900; color: #5b21b6; }
    .contrib-sub { font-size: 10px; font-weight: 700; color: #7c3aed; margin-top: 2px; }
    .contrib-val { font-size: 15px; font-weight: 900; color: #7c3aed; white-space: nowrap; }

    .scope-toggle {
        display: flex; gap: 8px; padding: 10px 16px 0; background: #fff;
    }
    .period-bar { display: flex; padding: 10px 16px; background: #fff; }
    .period-btn {
        flex: 1; min-width: 0; padding: 8px 0;
        border: 2px solid #e5e5e5; background: #f7f7f7;
        font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
        color: #afafaf; cursor: pointer; transition: all 0.2s;
    }
    .period-btn:first-child { border-radius: 10px 0 0 10px; }
    .period-btn:last-child { border-radius: 0 10px 10px 0; }
    .period-btn.active {
        background: #0284c7; color: #fff; border-color: #0284c7; position: relative; z-index: 1;
    }

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
