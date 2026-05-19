<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    // Active board type tab
    let activeTab = $state('global-user');
    // Period filter
    let activePeriod = $state('weekly');
    // Sub-view for community boards
    let communityView = $state('all-member');
    // Selected community/halaqah for detail view
    let selectedCommunity = $state(null);
    let selectedHalaqah = $state(null);

    const tabs = $derived([
        { id: 'global-user', label: i18n.t('lb.tab_global_user'), icon: '🌍' },
        { id: 'regional-user', label: i18n.t('lb.tab_regional'), icon: '🏳️' },
        { id: 'global-halaqah', label: i18n.t('lb.tab_halaqah'), icon: '📖' },
        { id: 'global-komunitas', label: i18n.t('lb.tab_komunitas'), icon: '🏘️' },
        { id: 'my-community', label: i18n.t('lb.tab_my_community'), icon: '👥' },
        { id: 'my-halaqah', label: i18n.t('lb.tab_my_halaqah'), icon: '🤝' },
    ]);

    const periods = $derived([
        { id: 'weekly', label: i18n.t('lb.weekly') },
        { id: 'monthly', label: i18n.t('lb.monthly') },
        { id: 'alltime', label: i18n.t('lb.alltime') },
    ]);

    // Mock data generators
    const globalUsers = $derived([
        { name: 'Siti Nurhaliza', xp: 4820, avatar: '🧕', country: '🇮🇩', streak: 42 },
        { name: 'Ahmad Dani', xp: 4350, avatar: '🧔', country: '🇮🇩', streak: 38 },
        { name: i18n.t('lb.you'), xp: appState.user.xp, avatar: '👤', country: '🇮🇩', streak: appState.user.streak, isMe: true },
        { name: 'Fatimah Az-Zahra', xp: 2100, avatar: '🧕', country: '🇲🇾', streak: 21 },
        { name: 'Omar Farooq', xp: 1950, avatar: '🧔', country: '🇸🇦', streak: 19 },
        { name: 'Aisha Bello', xp: 1800, avatar: '🧕', country: '🇳🇬', streak: 15 },
        { name: 'Yusuf Ibrahim', xp: 1650, avatar: '👨', country: '🇮🇩', streak: 12 },
        { name: 'Khadijah Musa', xp: 1500, avatar: '🧕', country: '🇲🇾', streak: 10 },
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 })));

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

    // My community members
    const myCommunityMembers = $derived([
        { name: 'Siti Nurhaliza', xp: 3200, avatar: '🧕', halaqah: 'Al-Fatih' },
        { name: i18n.t('lb.you'), xp: appState.user.xp, avatar: '👤', halaqah: 'Al-Fatih', isMe: true },
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

    // My halaqah members
    const myHalaqahMembers = $derived([
        { name: 'Siti Nurhaliza', xp: 3200, avatar: '🧕' },
        { name: i18n.t('lb.you'), xp: appState.user.xp, avatar: '👤', isMe: true },
        { name: 'Budi Utomo', xp: 1800, avatar: '👨' },
        { name: 'Dewi Sartika', xp: 1600, avatar: '👩' },
        { name: 'Hasan Ali', xp: 1400, avatar: '🧔' },
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 })));

    function getCurrentData() {
        if (activeTab === 'global-user' || activeTab === 'regional-user') return globalUsers;
        if (activeTab === 'global-halaqah') return halaqahList;
        if (activeTab === 'global-komunitas') return komunitasList;
        if (activeTab === 'my-community') {
            return communityView === 'all-member' ? myCommunityMembers : myCommunityHalaqahs;
        }
        if (activeTab === 'my-halaqah') return myHalaqahMembers;
        return globalUsers;
    }

    const currentData = $derived(getCurrentData());
    const top3 = $derived(currentData.slice(0, 3));
    const rest = $derived(currentData.slice(3));

    function getPeriodLabel() {
        if (activePeriod === 'weekly') return i18n.t('lb.reset_weekly');
        if (activePeriod === 'monthly') return i18n.t('lb.reset_monthly');
        return i18n.t('lb.reset_alltime');
    }

    function getMedalColor(rank) {
        if (rank === 1) return '#FFD700';
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return '#afafaf';
    }

    function getPodiumHeight(rank) {
        if (rank === 1) return '80px';
        if (rank === 2) return '60px';
        if (rank === 3) return '44px';
        return '40px';
    }
</script>

<div class="screen">
    <!-- Top Bar -->
    <div class="topbar" style="background: linear-gradient(135deg, #00978A, #00bfa5); padding: 14px 16px 10px;">
        <span style="font-size: 16px; font-weight: 900; color: #fff; flex: 1; text-align: center;">
            🏆 {i18n.t('lb.title')}
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

        <!-- Period Switcher -->
        <div class="period-bar">
            {#each periods as p}
                <button
                    class="period-btn"
                    class:active={activePeriod === p.id}
                    onclick={() => activePeriod = p.id}
                >
                    {p.label}
                </button>
            {/each}
        </div>

        <div class="period-info">
            <i class="ti ti-clock" style="font-size: 12px;"></i>
            {getPeriodLabel()}
        </div>

        <!-- Community sub-view toggle -->
        {#if activeTab === 'my-community'}
            <div class="community-toggle">
                <button class="ctog" class:active={communityView === 'all-member'} onclick={() => communityView = 'all-member'}>
                    👤 {i18n.t('lb.all_members')}
                </button>
                <button class="ctog" class:active={communityView === 'per-halaqah'} onclick={() => communityView = 'per-halaqah'}>
                    📖 {i18n.t('lb.per_halaqah')}
                </button>
            </div>
        {/if}

        <!-- Community/Halaqah Info Banner -->
        {#if activeTab === 'my-community'}
            <div class="info-banner">
                <div class="info-banner-icon">🏘️</div>
                <div>
                    <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Pesantren Al-Hikmah</div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf;">120 {i18n.t('lb.members')} · 8 {i18n.t('lb.tab_halaqah')} · {i18n.t('lb.private')}</div>
                </div>
            </div>
        {:else if activeTab === 'my-halaqah'}
            <div class="info-banner">
                <div class="info-banner-icon">🟢</div>
                <div>
                    <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Halaqah Al-Fatih</div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf;">15/20 {i18n.t('lb.members')} · Pesantren Al-Hikmah</div>
                </div>
            </div>
        {/if}

        <!-- Podium Top 3 -->
        {#if top3.length >= 3}
            <div class="podium-section">
                <!-- 2nd place -->
                <div class="podium-item">
                    <div class="podium-avatar" style="border-color: {getMedalColor(2)};">{top3[1].avatar}</div>
                    <div class="podium-name">{top3[1].name}</div>
                    <div class="podium-xp">{top3[1].xp.toLocaleString()} XP</div>
                    <div class="podium-bar" style="height: {getPodiumHeight(2)}; background: linear-gradient(to top, #e0e0e0, #f5f5f5);">
                        <span class="podium-rank" style="color: {getMedalColor(2)};">2</span>
                    </div>
                </div>
                <!-- 1st place -->
                <div class="podium-item first">
                    <div class="crown">👑</div>
                    <div class="podium-avatar gold" style="border-color: {getMedalColor(1)};">{top3[0].avatar}</div>
                    <div class="podium-name">{top3[0].name}</div>
                    <div class="podium-xp">{top3[0].xp.toLocaleString()} XP</div>
                    <div class="podium-bar" style="height: {getPodiumHeight(1)}; background: linear-gradient(to top, #FFD700, #FFF8DC);">
                        <span class="podium-rank" style="color: #b8860b;">1</span>
                    </div>
                </div>
                <!-- 3rd place -->
                <div class="podium-item">
                    <div class="podium-avatar" style="border-color: {getMedalColor(3)};">{top3[2].avatar}</div>
                    <div class="podium-name">{top3[2].name}</div>
                    <div class="podium-xp">{top3[2].xp.toLocaleString()} XP</div>
                    <div class="podium-bar" style="height: {getPodiumHeight(3)}; background: linear-gradient(to top, #CD7F32, #f5e6d3);">
                        <span class="podium-rank" style="color: #8B4513;">3</span>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Remaining Rankings -->
        <div class="ranking-list">
            {#each rest as r}
                <div class="rank-item" class:is-me={r.isMe}>
                    <div class="rank-num">{r.rank}</div>
                    <div class="rank-avatar">{r.avatar}</div>
                    <div class="rank-info">
                        <div class="rank-name">
                            {r.name}
                            {#if r.isMe}
                                <span class="me-badge">{i18n.t('lb.you_badge')}</span>
                            {/if}
                        </div>
                        {#if r.members}
                            <div class="rank-sub">{r.members} {i18n.t('lb.members')}{#if r.halaqah} · {r.halaqah} Halaqah{/if}</div>
                        {:else if r.halaqah && !r.members}
                            <div class="rank-sub">{r.halaqah}</div>
                        {:else if r.streak}
                            <div class="rank-sub">🔥 {r.streak} {i18n.t('lb.day_streak')}</div>
                        {/if}
                    </div>
                    <div class="rank-xp-col">
                        <div class="rank-xp">{r.xp.toLocaleString()}</div>
                        <div class="rank-xp-label">XP</div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- XP Source Info -->
        <div class="xp-info-card">
            <div style="font-size: 13px; font-weight: 900; color: #3c3c3c; margin-bottom: 8px;">
                ⚡ {i18n.t('lb.xp_sources')}
            </div>
            <div class="xp-row"><span>📝 {i18n.t('lb.xp_mini_target')}</span><span class="xp-val">+50 XP</span></div>
            <div class="xp-row"><span>📖 {i18n.t('lb.xp_checkpoint')}</span><span class="xp-val">+200 XP</span></div>
            <div class="xp-row"><span>🎤 {i18n.t('lb.xp_setoran')}</span><span class="xp-val">+100 XP</span></div>
            <div class="xp-row"><span>🔥 {i18n.t('lb.xp_streak')}</span><span class="xp-val">+25 XP</span></div>
            <div class="xp-row"><span>⭐ {i18n.t('lb.xp_mumtaz')}</span><span class="xp-val">+150 XP</span></div>
        </div>

        <div style="height: 20px;"></div>
    </div>

    <BottomNav active="league" />
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
        font-size: 10px;
        font-weight: 800;
        color: #777;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
        flex-shrink: 0;
    }
    .tab-chip.active {
        background: #00978A;
        color: #fff;
        border-color: #00978A;
        box-shadow: 0 2px 8px rgba(0, 151, 138, 0.3);
    }
    .tab-icon { font-size: 13px; }
    .tab-label { font-size: 10px; }

    .period-bar {
        display: flex;
        gap: 0;
        padding: 8px 16px;
        background: #fff;
    }
    .period-btn {
        flex: 1;
        padding: 8px 0;
        border: 2px solid #e5e5e5;
        background: #f7f7f7;
        font-family: 'Nunito', sans-serif;
        font-size: 11px;
        font-weight: 800;
        color: #afafaf;
        cursor: pointer;
        transition: all 0.2s;
    }
    .period-btn:first-child { border-radius: 10px 0 0 10px; }
    .period-btn:last-child { border-radius: 0 10px 10px 0; }
    .period-btn.active {
        background: #00978A;
        color: #fff;
        border-color: #00978A;
        z-index: 1;
        position: relative;
    }

    .period-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px;
        font-size: 10px;
        font-weight: 700;
        color: #afafaf;
        background: #fafafa;
    }

    .community-toggle {
        display: flex;
        gap: 6px;
        padding: 8px 16px;
        background: #fff;
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
        background: #DBF0EE;
        border-color: #00978A;
        color: #00978A;
    }

    .info-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        margin: 0 16px 4px;
        background: #f0faf9;
        border: 2px solid #DBF0EE;
        border-radius: 14px;
    }
    .info-banner-icon { font-size: 28px; }

    /* Podium */
    .podium-section {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 8px;
        padding: 20px 16px 0;
        background: #fff;
    }
    .podium-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 110px;
    }
    .podium-item.first { order: 0; }
    .podium-item:first-child { order: -1; }
    .podium-item:last-child { order: 1; }
    .crown {
        font-size: 20px;
        margin-bottom: -4px;
        animation: bounce 2s infinite;
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
    }
    .podium-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #f7f7f7;
        border: 3px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        margin-bottom: 4px;
    }
    .podium-avatar.gold {
        width: 52px;
        height: 52px;
        font-size: 26px;
        box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
    }
    .podium-name {
        font-size: 10px;
        font-weight: 800;
        color: #3c3c3c;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90px;
    }
    .podium-xp {
        font-size: 10px;
        font-weight: 900;
        color: #00978A;
        margin-bottom: 6px;
    }
    .podium-bar {
        width: 100%;
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 6px;
    }
    .podium-rank {
        font-size: 18px;
        font-weight: 900;
    }

    /* Ranking List */
    .ranking-list {
        padding: 10px 12px;
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
        background: linear-gradient(135deg, #e6faf8, #ddf4ff);
        border-color: #00978A;
        box-shadow: 0 2px 8px rgba(0, 151, 138, 0.12);
    }
    .rank-num {
        font-size: 13px;
        font-weight: 900;
        color: #afafaf;
        width: 22px;
        text-align: center;
        flex-shrink: 0;
    }
    .is-me .rank-num { color: #00978A; }
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
        background: #00978A;
        color: #fff;
        padding: 1px 6px;
        border-radius: 100px;
        text-transform: uppercase;
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

    /* XP Info Card */
    .xp-info-card {
        margin: 12px 12px 0;
        padding: 14px;
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 16px;
    }
    .xp-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        font-size: 11px;
        font-weight: 700;
        color: #555;
        border-bottom: 1px solid #f0f0f0;
    }
    .xp-row:last-child { border-bottom: none; }
    .xp-val {
        font-weight: 900;
        color: #00978A;
    }
</style>
