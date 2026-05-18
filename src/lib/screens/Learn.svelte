<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';
    
    let showToast = $state(false);

    const units = [
        { id: 1, title: "Surah Al-Insyirah", description: "Kelapangan hati & kemudahan", color: "#00978A" }
    ];

    const nodes = $derived.by(() => {
        const progress = appState.user.progress.surah_094;
        const getStatus = (idx) => progress > idx ? "completed" : (progress === idx ? "current" : "locked");
        
        return [
            { id: 1, type: "lesson", verseIndex: 0, status: getStatus(0), title: "Ayat 1" },
            { id: 2, type: "lesson", verseIndex: 1, status: getStatus(1), title: "Ayat 2" },
            { id: 3, type: "lesson", verseIndex: 2, status: getStatus(2), title: "Ayat 3" },
            { id: 4, type: "tadabbur", status: progress >= 3 ? "completed" : "locked", title: "Tadabbur 1-3" },
            { id: 5, type: "lesson", verseIndex: 3, status: getStatus(3), title: "Ayat 4" },
            { id: 6, type: "lesson", verseIndex: 4, status: getStatus(4), title: "Ayat 5" },
            { id: 7, type: "lesson", verseIndex: 5, status: getStatus(5), title: "Ayat 6" },
            { id: 8, type: "lesson", verseIndex: 6, status: getStatus(6), title: "Ayat 7" },
            { id: 9, type: "lesson", verseIndex: 7, status: getStatus(7), title: "Ayat 8" },
            { id: 10, type: "checkpoint", status: progress >= 8 ? "current" : "locked", title: "Setor 1 Surah Penuh" }
        ];
    });

    $effect(() => {
        const timer = setTimeout(() => {
            showToast = true;
            setTimeout(() => showToast = false, 4000);
        }, 800);
        return () => clearTimeout(timer);
    });

    const leagueRankings = $derived([
        { name: "Anda", xp: appState.user.xp, isMe: true, avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
        { name: "Ust. Ridwan", xp: 1420, avatar: "https://cdn-icons-png.flaticon.com/512/3996/3996562.png" },
        { name: "Aisyah", xp: 1380, avatar: "https://cdn-icons-png.flaticon.com/512/3996/3996570.png" },
    ].sort((a, b) => b.xp - a.xp).map((item, i) => ({ ...item, rank: i + 1 })));
</script>

<div class="screen">
    <div class="topbar">
        <div class="streak-pill">
            <i class="ti ti-flame"></i> {appState.user.streak}
        </div>
        <div style="flex: 1; display: flex; justify-content: center">
            <span style="font-size: 18px; font-weight: 900; color: var(--duo-green); letter-spacing: -1px;">{i18n.t('learn.title')}</span>
        </div>
        <div style="display: flex; gap: 12px;">
            <div class="points-pill" onclick={() => appState.go('murojaah')}>
                <i class="ti ti-bolt-filled"></i> {appState.user.xp}
            </div>
        </div>
    </div>

    {#if showToast}
        <div class="achievement-toast">
            <div style="font-size: 28px">🥇</div>
            <div style="flex: 1">
                <div style="font-size: 12px; font-weight: 900; color: #cc7000">{i18n.t('learn.streak_days')}</div>
                <div style="font-size: 11px; font-weight: 700; color: #afafaf">{i18n.t('learn.streak_msg')}</div>
            </div>
            <button onclick={() => showToast = false} class="close-toast">✕</button>
        </div>
    {/if}

    <div class="scroll-content no-scrollbar" style="background: #fff;">
        <div class="learn-layout-container">
            
            <!-- Left Column: Memorization Path -->
            <div class="path-column">
                <div class="unit-banner">
                    <div class="unit-badge">{i18n.t('learn.unit')} 1</div>
                    <div style="font-size: 22px; font-weight: 900; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">Surah Al-Insyirah</div>
                    <div style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 4px;">Kelapangan Hati & Kemudahan</div>
                    <div class="unit-guide-btn">
                        <i class="ti ti-notebook"></i> {i18n.t('learn.guide') || 'GUIDE'}
                    </div>
                </div>

                <!-- Daily goal card: visible only in mobile phone mockup -->
                <div class="daily-goal-card mobile-only-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Target Poin Gratis</span>
                        <span style="font-size: 12px; font-weight: 800; color: #afafaf;">24 / 60</span>
                    </div>
                    <div class="goal-bar-bg">
                        <div class="goal-bar-fill" style="width: 40%"></div>
                    </div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf; margin-top: 6px; display: flex; align-items: center; gap: 4px;">
                        <i class="ti ti-info-circle"></i> Reset dalam 12 hari
                    </div>
                </div>

                <div class="path-container">
                    {#each nodes as node, i}
                        <div class="node-wrapper" style="margin-left: {i % 2 === 0 ? '20px' : '-20px'}">
                            <button 
                                class="node-btn {node.type} {node.status}" 
                                onclick={() => {
                                    if (node.status !== 'locked') {
                                        if (node.type === 'lesson') {
                                            appState.selectedVerseIndex = node.verseIndex;
                                            appState.go('lesson');
                                        } else {
                                            appState.go(node.type);
                                        }
                                    }
                                }}
                            >
                                {#if node.type === 'review'}
                                    <i class="ti ti-refresh"></i>
                                {:else if node.type === 'tadabbur'}
                                    <i class="ti ti-books"></i>
                                {:else if node.type === 'checkpoint'}
                                    <i class="ti ti-trophy"></i>
                                {:else}
                                    <i class="ti ti-book"></i>
                                {/if}

                                {#if node.status === 'current'}
                                    <div class="node-popover">{i18n.t('learn.start')}</div>
                                {/if}
                            </button>
                            <div class="node-title">{node.title}</div>
                        </div>

                        {#if i < nodes.length - 1}
                            <div class="connector {nodes[i+1].status}"></div>
                        {/if}
                    {/each}
                </div>
            </div>

            <!-- Right Column: Interactive Sidebar Widgets (Visible only in desktop mockup) -->
            <div class="sidebar-column">
                
                <!-- Daily Goal Card -->
                <div class="daily-goal-card desktop-sidebar-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 13px; font-weight: 900; color: #3c3c3c;">Target Poin Gratis</span>
                        <span style="font-size: 12px; font-weight: 800; color: #afafaf;">24 / 60</span>
                    </div>
                    <div class="goal-bar-bg">
                        <div class="goal-bar-fill" style="width: 40%"></div>
                    </div>
                    <div style="font-size: 10px; font-weight: 700; color: #afafaf; margin-top: 6px; display: flex; align-items: center; gap: 4px;">
                        <i class="ti ti-info-circle"></i> Reset dalam 12 hari
                    </div>
                </div>

                <!-- Consistency/Streak Calendar -->
                <div class="desktop-widget streak-widget">
                    <div class="widget-header">
                        <span class="widget-title">Konsistensi Hafalan</span>
                        <span class="widget-action">7 Hari 🔥</span>
                    </div>
                    <div class="calendar-grid">
                        <span class="day active">S</span>
                        <span class="day active">S</span>
                        <span class="day active">R</span>
                        <span class="day active">K</span>
                        <span class="day active">J</span>
                        <span class="day active">S</span>
                        <span class="day current">M</span>
                    </div>
                    <div class="streak-msg">Luar biasa! Hafalanmu aktif dan terjaga dengan sangat baik.</div>
                </div>

                <!-- Daily Quests -->
                <div class="desktop-widget quest-widget">
                    <div class="widget-header">
                        <span class="widget-title">Misi Harian</span>
                        <span class="widget-action">1 / 3 Selesai</span>
                    </div>
                    <div class="quest-list">
                        <div class="quest-item completed">
                            <span class="check-icon">✓</span>
                            <span class="quest-text">Murojaah 2 sesi</span>
                            <span class="quest-reward">+10 XP</span>
                        </div>
                        <div class="quest-item">
                            <span class="check-icon">○</span>
                            <span class="quest-text">Jawab 10 kuis susun kata</span>
                            <span class="quest-reward">+15 XP</span>
                        </div>
                        <div class="quest-item">
                            <span class="check-icon">○</span>
                            <span class="quest-text">Dengar audio Qari 5 menit</span>
                            <span class="quest-reward">+10 XP</span>
                        </div>
                    </div>
                </div>

                <!-- Fastabiqul Khairat League Snapshot -->
                <div class="desktop-widget league-widget" onclick={() => appState.go('league')} style="cursor: pointer;">
                    <div class="widget-header">
                        <span class="widget-title">Liga Pekan Ini</span>
                        <span class="widget-action" style="color: #00978A; display: flex; align-items: center; gap: 4px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" alt="" style="width: 16px; height: 16px; object-fit: contain;" />
                            Liga Safir
                        </span>
                    </div>
                    <div class="league-rank-preview">
                        {#each leagueRankings.slice(0, 3) as r}
                            <div class="rank-item" class:you={r.isMe} class:first={r.rank === 1}>
                                <span class="rank-num">{r.rank}</span>
                                <img src="{r.avatar}" alt="{r.name}" style="width: 28px; height: 28px; object-fit: contain; border-radius: 50%;" />
                                <span class="name">{r.name}</span>
                                <span class="xp">{r.xp} XP</span>
                            </div>
                        {/each}
                    </div>
                    <div class="league-footer">Top 5 naik ke Liga Berlian · 2 hari lagi</div>
                </div>

            </div>

        </div>

        <div style="height: 100px;"></div>
    </div>

    <BottomNav active="learn" />
</div>

<style>
    .unit-banner {
        background: linear-gradient(135deg, var(--duo-green), var(--duo-green-dark));
        padding: 24px 20px;
        margin: 10px 16px 20px;
        border-radius: 20px;
        box-shadow: 0 6px 0 #00665d;
        position: relative;
        overflow: hidden;
    }
    .unit-banner::after {
        content: '';
        position: absolute;
        right: -20px;
        top: -20px;
        width: 100px;
        height: 100px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
    }
    .unit-badge {
        font-size: 11px;
        font-weight: 900;
        color: rgba(255,255,255,0.7);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
    }
    .unit-guide-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(0,0,0,0.15);
        color: #fff;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 800;
        margin-top: 12px;
        cursor: pointer;
    }
    .path-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
    }
    .node-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 2;
    }
    .node-btn {
        width: 60px;
        height: 56px;
        border-radius: 50%;
        border: none;
        border-bottom: 6px solid #e5e5e5;
        background: #e5e5e5;
        color: #afafaf;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transition: all 0.1s;
    }
    .node-btn:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }

    /* Node Status Colors */
    .node-btn.completed { background: var(--duo-green); border-bottom-color: var(--duo-green-dark); color: #fff; }
    .node-btn.current { 
        background: var(--duo-green); border-bottom-color: var(--duo-green-dark); color: #fff; 
        animation: pulse 2s infinite;
    }
    .node-btn.locked { background: #e5e5e5; border-bottom-color: #afafaf; color: #afafaf; cursor: not-allowed; }

    /* Node Types Styling */
    .node-btn.tadabbur.completed { background: #ce82ff; border-bottom-color: #a52adb; }
    .node-btn.checkpoint.completed { background: #ffc800; border-bottom-color: #e5a000; }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 151, 138, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(0, 151, 138, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 151, 138, 0); }
    }

    .node-popover {
        position: absolute;
        top: -40px;
        background: #fff;
        border: 2px solid #e5e5e5;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 900;
        color: var(--duo-green);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .node-popover::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #e5e5e5;
    }

    .node-title {
        font-size: 13px;
        font-weight: 800;
        color: #3c3c3c;
        margin-top: 8px;
    }

    .connector {
        width: 8px;
        height: 40px;
        background: #e5e5e5;
        margin: 4px 0;
        z-index: 1;
    }
    .connector.completed, .connector.current { background: #d7ffb2; }

    .achievement-toast {
        position: absolute;
        top: 70px;
        left: 12px;
        right: 12px;
        background: #fff;
        border-radius: 16px;
        border: 2px solid #ffc800;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 100;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: slideDown 0.4s ease-out;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .close-toast { background: none; border: none; cursor: pointer; color: #afafaf; font-size: 18px; }
    .streak-pill { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800; color: #ff9600; }
    .points-pill { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800; color: #ff9600; cursor: pointer; border: 2px solid #fff7e6; padding: 4px 10px; border-radius: 100px; background: #fffbf2; }
    
    .daily-goal-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 16px;
        padding: 14px;
    }
    .mobile-only-card {
        margin: 0 16px 20px;
        display: block;
    }
    .desktop-sidebar-card {
        display: none;
    }
    .goal-bar-bg {
        height: 8px;
        background: #e5e5e5;
        border-radius: 4px;
        overflow: hidden;
    }
    .goal-bar-fill {
        height: 100%;
        background: #ff9600;
        border-radius: 4px;
    }

    /* ========================================================
       DESKTOP RESPONSIVE LAYOUT STYLING (USING GLOBAL SELECTOR)
       ======================================================== */
    
    .learn-layout-container {
        display: block;
        width: 100%;
    }
    .path-column {
        width: 100%;
    }
    .sidebar-column {
        display: none;
    }

    /* Target desktop/tablet mockup mode wrapper */
    :global(.desktop-browser) .learn-layout-container {
        display: flex;
        gap: 36px;
        padding: 30px 24px;
        max-width: 1200px;
        margin: 0 auto;
        align-items: flex-start;
    }

    :global(.tablet) .learn-layout-container {
        display: block;
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
    }

    :global(.desktop-browser) .path-column {
        flex: 1;
        max-width: 700px;
    }
    :global(.tablet) .path-column {
        width: 100%;
        max-width: 100%;
    }

    :global(.desktop-browser) .sidebar-column {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 340px;
        flex-shrink: 0;
    }
    :global(.tablet) .sidebar-column {
        display: none;
    }

    :global(.desktop-browser) .mobile-only-card {
        display: none;
    }
    :global(.tablet) .mobile-only-card {
        display: block;
        margin: 0 0 20px;
    }

    :global(.desktop-browser) .desktop-sidebar-card,
    :global(.tablet) .desktop-sidebar-card {
        display: block;
        border-bottom-width: 4px;
        box-shadow: 0 4px 0 #e5e5e5;
        border-radius: 20px;
    }

    :global(.desktop-browser) .unit-banner,
    :global(.tablet) .unit-banner {
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
    }

    /* Desktop Widget Styling */
    .desktop-widget {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 20px;
        padding: 18px;
        box-shadow: 0 4px 0 #e5e5e5;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .desktop-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 0 #e5e5e5;
    }
    .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 8px;
    }
    .widget-title {
        font-size: 11px;
        font-weight: 900;
        color: #afafaf;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .widget-action {
        font-size: 12px;
        font-weight: 800;
        color: #ff9600;
    }

    /* Streak Calendar widget grid */
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
        margin-bottom: 10px;
    }
    .calendar-grid .day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
        border-radius: 50%;
        color: #afafaf;
        border: 2px solid #e5e5e5;
    }
    .calendar-grid .day.active {
        background: #ffebe6;
        color: #ff9600;
        border-color: #ff9600;
    }
    .calendar-grid .day.current {
        background: #ff9600;
        color: #fff;
        border-color: #ff9600;
        animation: pulseStreak 2s infinite;
    }
    @keyframes pulseStreak {
        0% { box-shadow: 0 0 0 0 rgba(255, 150, 0, 0.4); }
        70% { box-shadow: 0 0 0 8px rgba(255, 150, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 150, 0, 0); }
    }
    .streak-msg {
        font-size: 11px;
        font-weight: 700;
        color: #777;
        line-height: 1.4;
    }

    /* Quest list styling */
    .quest-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .quest-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 12px;
        font-weight: 800;
        color: #4b5563;
        padding: 4px 0;
    }
    .quest-item .check-icon {
        font-size: 13px;
        font-weight: 900;
        color: #ccc;
    }
    .quest-item.completed .check-icon {
        color: var(--duo-green);
    }
    .quest-item.completed .quest-text {
        text-decoration: line-through;
        color: #9ca3af;
    }
    .quest-item .quest-reward {
        margin-left: auto;
        color: var(--duo-green);
        font-size: 11px;
    }

    /* League ranking preview styling */
    .league-rank-preview {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 10px;
    }
    .rank-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 800;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
    }
    .rank-item.first {
        background: #fffbef;
        border-color: #fde047;
    }
    .rank-item.you {
        background: #ecfdf5;
        border-color: #6ee7b7;
        color: #047857;
    }
    .rank-num {
        width: 14px;
        font-size: 10px;
        color: #94a3b8;
    }
    .rank-item.first .rank-num {
        color: #eab308;
    }
    .rank-item.you .rank-num {
        color: #10b981;
    }
    .rank-item .avatar {
        font-size: 14px;
    }
    .rank-item .name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .rank-item .xp {
        color: #64748b;
    }
    .league-footer {
        font-size: 10px;
        font-weight: 700;
        color: #94a3b8;
        text-align: center;
    }
</style>
