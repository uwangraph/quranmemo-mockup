<script>
    import { appState } from "$lib/app.svelte.js";
    import { i18n } from "$lib/i18n.svelte.js";

    const leagueRankings = $derived(
        [
            {
                name: i18n.t("lb.you"),
                xp: appState.user.xp,
                isMe: true,
                avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            },
            {
                name: "Ust. Ridwan",
                xp: 1420,
                avatar: "https://cdn-icons-png.flaticon.com/512/3996/3996562.png",
            },
            {
                name: "Aisyah",
                xp: 1380,
                avatar: "https://cdn-icons-png.flaticon.com/512/3996/3996570.png",
            },
        ]
            .sort((a, b) => b.xp - a.xp)
            .map((item, i) => ({ ...item, rank: i + 1 })),
    );

    const dayInitials = $derived(
        (i18n.t("sidebar.day_initials") || "S,S,R,K,J,S,M").split(","),
    );
</script>

<div class="sidebar-column">
    <!-- Daily Goal Card -->
    <div class="daily-goal-card desktop-sidebar-card">
        <div
            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"
        >
            <span style="font-size: 13px; font-weight: 900; color: #3c3c3c;"
                >{i18n.t("learn.free_points_target")}</span
            >
            <span style="font-size: 12px; font-weight: 800; color: #afafaf;"
                >24 / 60</span
            >
        </div>
        <div class="goal-bar-bg">
            <div class="goal-bar-fill" style="width: 40%"></div>
        </div>
        <div
            style="font-size: 10px; font-weight: 700; color: #afafaf; margin-top: 6px; display: flex; align-items: center; gap: 4px;"
        >
            <i class="ti ti-info-circle"></i>
            {i18n.t("learn.reset_info")}
        </div>
    </div>

    <!-- Consistency/Streak Calendar -->
    <div class="desktop-widget streak-widget">
        <div class="widget-header">
            <span class="widget-title">{i18n.t("sidebar.consistency")}</span>
            <span class="widget-action"
                >{i18n
                    .t("sidebar.consistency_days")
                    .replace("{days}", appState.user.streak)}</span
            >
        </div>
        <div class="calendar-grid">
            {#each dayInitials as initial, i}
                <span class="day" class:active={i < 6} class:current={i === 6}
                    >{initial}</span
                >
            {/each}
        </div>
        <div class="streak-msg">{i18n.t("sidebar.consistency_msg")}</div>
    </div>

    <!-- Daily Quests -->
    <div class="desktop-widget quest-widget">
        <div class="widget-header">
            <span
                class="widget-title"
                style="display: flex; align-items: center; gap: 6px;"
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/4006/4006326.png"
                    alt="Quests"
                    style="width:16px; height:16px; object-fit:contain;"
                />
                {i18n.t("sidebar.quests")}
            </span>
            <span class="widget-action"
                >{appState.user.dailyQuests?.quests.filter((q) => q.claimed)
                    .length || 0} / {appState.user.dailyQuests?.quests.length ||
                    3}
                {i18n.t("sidebar.quests_done")}</span
            >
        </div>
        <div class="quest-list">
            {#if appState.user.dailyQuests}
                {#each appState.user.dailyQuests.quests as quest}
                    <div
                        class="quest-item {quest.claimed ? 'completed' : ''}"
                        style="display:flex; flex-direction:column; align-items:flex-start; gap:4px; margin-bottom:8px;"
                    >
                        <div
                            style="display:flex; width:100%; align-items:center; gap:8px;"
                        >
                            <span class="check-icon"
                                >{quest.claimed ? "✓" : "○"}</span
                            >
                            <div
                                style="flex:1; display:flex; flex-direction:column; justify-content:center;"
                            >
                                <span
                                    class="quest-text"
                                    style="line-height:1.2;">{quest.text}</span
                                >
                                {#if !quest.claimed}
                                    <span
                                        class="quest-reward"
                                        style="font-size:10px; margin-left:0; color:#ff9600; font-weight:800; margin-top:2px;"
                                        >Hadiah: +{quest.xp} XP</span
                                    >
                                {/if}
                            </div>
                            {#if quest.claimed}
                                <span
                                    class="quest-reward"
                                    style="margin-left:0;">+{quest.xp} XP</span
                                >
                            {:else if quest.current >= quest.max}
                                <button
                                    class="claim-quest-btn"
                                    onclick={() =>
                                        appState.claimQuestReward(quest.id)}
                                    >Klaim</button
                                >
                            {:else}
                                <span
                                    class="quest-reward"
                                    style="margin-left:0; color:#afafaf;"
                                    >{quest.current}/{quest.max}</span
                                >
                            {/if}
                        </div>
                        {#if !quest.claimed && quest.current > 0 && quest.current < quest.max}
                            <div
                                style="width: 100%; height: 4px; background: #f1f5f9; border-radius: 2px; margin-left: 24px; max-width: calc(100% - 24px);"
                            >
                                <div
                                    style="width: {Math.round(
                                        (quest.current / quest.max) * 100,
                                    )}%; height: 100%; background: #ff9600; border-radius: 2px;"
                                ></div>
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #f1f5f9; text-align: left;"
            >
                <span
                    style="color: #1cb0f6; font-size: 13px; font-weight: 800; cursor: pointer; text-transform: uppercase;"
                    onclick={() => appState.go("quests")}
                    >Lihat Semua <i
                        class="ti ti-chevron-right"
                        style="font-size: 12px;"
                    ></i></span
                >
            </div>
        </div>
    </div>

    <!-- Fastabiqul Khairat League Snapshot -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="desktop-widget league-widget"
        onclick={() => appState.go("league")}
        style="cursor: pointer;"
    >
        <div class="widget-header">
            <span class="widget-title">{i18n.t("sidebar.league_title")}</span>
            <span
                class="widget-action"
                style="color: #00978A; display: flex; align-items: center; gap: 4px;"
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png"
                    alt=""
                    style="width: 16px; height: 16px; object-fit: contain;"
                />
                {i18n.t("league.sapphire")}
            </span>
        </div>
        <div class="league-rank-preview">
            {#each leagueRankings.slice(0, 3) as r}
                <div
                    class="rank-item"
                    class:you={r.isMe}
                    class:first={r.rank === 1}
                >
                    <span class="rank-num">{r.rank}</span>
                    <img
                        src={r.avatar}
                        alt={r.name}
                        style="width: 28px; height: 28px; object-fit: contain; border-radius: 50%;"
                    />
                    <span class="name">{r.name}</span>
                    <span class="xp">{r.xp} XP</span>
                </div>
            {/each}
        </div>
        <div class="league-footer">{i18n.t("sidebar.league_footer")}</div>
    </div>
</div>

<style>
    .sidebar-column {
        display: none;
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

    .daily-goal-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 16px;
        padding: 14px;
    }
    .desktop-sidebar-card {
        display: none;
    }
    :global(.desktop-browser) .desktop-sidebar-card,
    :global(.tablet) .desktop-sidebar-card {
        display: block;
        border-bottom-width: 4px;
        box-shadow: 0 4px 0 #e5e5e5;
        border-radius: 20px;
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

    .desktop-widget {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 20px;
        padding: 18px;
        box-shadow: 0 4px 0 #e5e5e5;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
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
        0% {
            box-shadow: 0 0 0 0 rgba(255, 150, 0, 0.4);
        }
        70% {
            box-shadow: 0 0 0 8px rgba(255, 150, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 150, 0, 0);
        }
    }
    .streak-msg {
        font-size: 11px;
        font-weight: 700;
        color: #777;
        line-height: 1.4;
    }

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

    .claim-quest-btn {
        margin-left: auto;
        background: #1cb0f6;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 2px 0 #1899d6;
    }
    .claim-quest-btn:active {
        transform: translateY(2px);
        box-shadow: none;
    }
</style>
