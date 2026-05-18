<script>
    import { appState } from '$lib/app.svelte.js';

    const leagueRankings = $derived([
        { name: "Anda", xp: appState.user.xp, isMe: true, avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
        { name: "Ust. Ridwan", xp: 1420, avatar: "https://cdn-icons-png.flaticon.com/512/3996/3996562.png" },
        { name: "Aisyah", xp: 1380, avatar: "https://cdn-icons-png.flaticon.com/512/3996/3996570.png" },
    ].sort((a, b) => b.xp - a.xp).map((item, i) => ({ ...item, rank: i + 1 })));
</script>

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
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
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

<style>
    .sidebar-column { display: none; }
    :global(.desktop-browser) .sidebar-column { display: flex; flex-direction: column; gap: 24px; width: 340px; flex-shrink: 0; }
    :global(.tablet) .sidebar-column { display: none; }

    .daily-goal-card { background: #fff; border: 2px solid #e5e5e5; border-radius: 16px; padding: 14px; }
    .desktop-sidebar-card { display: none; }
    :global(.desktop-browser) .desktop-sidebar-card, :global(.tablet) .desktop-sidebar-card { display: block; border-bottom-width: 4px; box-shadow: 0 4px 0 #e5e5e5; border-radius: 20px; }
    
    .goal-bar-bg { height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden; }
    .goal-bar-fill { height: 100%; background: #ff9600; border-radius: 4px; }

    .desktop-widget { background: #fff; border: 2px solid #e5e5e5; border-radius: 20px; padding: 18px; box-shadow: 0 4px 0 #e5e5e5; transition: transform 0.2s, box-shadow 0.2s; }
    .desktop-widget:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #e5e5e5; }
    
    .widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .widget-title { font-size: 11px; font-weight: 900; color: #afafaf; text-transform: uppercase; letter-spacing: 1px; }
    .widget-action { font-size: 12px; font-weight: 800; color: #ff9600; }

    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 10px; }
    .calendar-grid .day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; border-radius: 50%; color: #afafaf; border: 2px solid #e5e5e5; }
    .calendar-grid .day.active { background: #ffebe6; color: #ff9600; border-color: #ff9600; }
    .calendar-grid .day.current { background: #ff9600; color: #fff; border-color: #ff9600; animation: pulseStreak 2s infinite; }
    @keyframes pulseStreak { 0% { box-shadow: 0 0 0 0 rgba(255, 150, 0, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(255, 150, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 150, 0, 0); } }
    .streak-msg { font-size: 11px; font-weight: 700; color: #777; line-height: 1.4; }

    .quest-list { display: flex; flex-direction: column; gap: 8px; }
    .quest-item { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 800; color: #4b5563; padding: 4px 0; }
    .quest-item .check-icon { font-size: 13px; font-weight: 900; color: #ccc; }
    .quest-item.completed .check-icon { color: var(--duo-green); }
    .quest-item.completed .quest-text { text-decoration: line-through; color: #9ca3af; }
    .quest-item .quest-reward { margin-left: auto; color: var(--duo-green); font-size: 11px; }

    .league-rank-preview { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .rank-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 10px; font-size: 11px; font-weight: 800; background: #f8fafc; border: 1px solid #e2e8f0; }
    .rank-item.first { background: #fffbef; border-color: #fde047; }
    .rank-item.you { background: #ecfdf5; border-color: #6ee7b7; color: #047857; }
    .rank-num { width: 14px; font-size: 10px; color: #94a3b8; }
    .rank-item.first .rank-num { color: #eab308; }
    .rank-item.you .rank-num { color: #10b981; }
    .rank-item .avatar { font-size: 14px; }
    .rank-item .name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rank-item .xp { color: #64748b; }
    .league-footer { font-size: 10px; font-weight: 700; color: #94a3b8; text-align: center; }
</style>
