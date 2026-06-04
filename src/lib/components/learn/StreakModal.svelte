<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import { fade } from 'svelte/transition';

    let { onClose } = $props();

    const milestones = $derived([
        { days: 3,   name: i18n.t('streak.m1_name'),    reward: i18n.t('streak.m1_reward'),              icon: '🔥', badgeId: 'b1' },
        { days: 7,   name: i18n.t('streak.m2_name'), reward: i18n.t('streak.m2_reward'),  icon: '📅', badgeId: 'b2' },
        { days: 30,  name: i18n.t('streak.m3_name'),       reward: i18n.t('streak.m3_reward'),   icon: '💎', badgeId: 'b4' },
        { days: 100, name: i18n.t('streak.m4_name'),     reward: i18n.t('streak.m4_reward'),   icon: '🛡️', badgeId: 'b5' },
        { days: 365, name: i18n.t('streak.m5_name'),    reward: i18n.t('streak.m5_reward'), icon: '👑', badgeId: 'b6' },
    ]);

    const streak = $derived(appState.user.streak);
    const maxStreak = $derived(appState.user.maxStreak);
    const streakFreezes = $derived(appState.user.streakFreezes);
    const streakRepairsUsed = $derived(appState.user.streakRepairsUsed);

    // Milestone berikutnya
    const nextMilestone = $derived(milestones.find(m => m.days > streak) || milestones[milestones.length - 1]);
    const progressToNext = $derived(nextMilestone ? Math.min((streak / nextMilestone.days) * 100, 100) : 100);

    // Hari-hari dalam seminggu
    const dayLabels = $derived((i18n.t('admin.dash.day_mon') + ',' + i18n.t('admin.dash.day_tue') + ',' + i18n.t('admin.dash.day_wed') + ',' + i18n.t('admin.dash.day_thu') + ',' + i18n.t('admin.dash.day_fri') + ',' + i18n.t('admin.dash.day_sat') + ',' + i18n.t('admin.dash.day_sun')).split(','));

    let freezeResult = $state('');
    let repairResult = $state('');
    let freezeTimer = -1;
    let repairTimer = -1;

    $effect(() => {
        return () => {
            clearTimeout(freezeTimer);
            clearTimeout(repairTimer);
        };
    });

    function handleUseFreeze() {
        const ok = appState.useStreakFreeze();
        freezeResult = ok ? i18n.t('streak.success_freeze') : i18n.t('streak.fail_freeze');
        clearTimeout(freezeTimer);
        freezeTimer = setTimeout(() => (freezeResult = ''), 3000);
    }

    function handleRepair() {
        const ok = appState.repairStreak();
        repairResult = ok ? i18n.t('streak.success_repair') : i18n.t('streak.fail_repair');
        clearTimeout(repairTimer);
        repairTimer = setTimeout(() => (repairResult = ''), 3000);
    }
</script>

<!-- Backdrop -->
<div class="streak-backdrop" onclick={onClose} role="presentation"></div>

<!-- Modal Sheet -->
<div class="streak-modal" role="dialog" aria-label={i18n.t('streak.title')}>
    <!-- Handle bar -->
    <div class="modal-handle"></div>

    <!-- Header / Hero Section -->
    <div class="modal-header">
        <div class="streak-hero-container">
            <div class="hero-glow"></div>
            <div class="streak-flame-big">🔥</div>
            <div class="hero-text">
                <div class="streak-number-big">{streak}</div>
                <div class="streak-label-big">{i18n.t('streak.days_count')}</div>
            </div>
        </div>
        <div class="streak-max-badge">
            <i class="ti ti-trophy"></i>
            <span>{i18n.t('streak.max', { days: maxStreak }).replace('<strong>', '').replace('</strong>', '')}</span>
        </div>
    </div>

    <!-- This Week Progress -->
    <div class="section-container" style="--delay: 0.1s">
        <div class="section-header">
            <h3 class="section-title">{i18n.t('streak.this_week')}</h3>
        </div>
        <div class="week-grid">
            {#each dayLabels as day, i}
                {@const done = appState.user.streakHistory[i]}
                {@const isToday = i === 6}
                <div class="day-item" class:isToday>
                    <div class="day-circle" class:done class:isToday>
                        {#if done}
                            <span class="day-icon">🔥</span>
                        {:else if isToday}
                            <span class="day-icon">⏳</span>
                        {:else}
                            <span class="day-dot"></span>
                        {/if}
                    </div>
                    <span class="day-label">{day}</span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Next Target / Milestone -->
    {#if nextMilestone}
    <div class="section-container" style="--delay: 0.2s">
        <div class="section-header">
            <h3 class="section-title">{i18n.t('streak.next_target')}</h3>
        </div>
        <div class="milestone-card-premium">
            <div class="milestone-top">
                <div class="milestone-icon-wrapper">
                    <span class="milestone-icon-large">{nextMilestone.icon}</span>
                </div>
                <div class="milestone-info">
                    <div class="milestone-name">{nextMilestone.name}</div>
                    <div class="milestone-reward">{nextMilestone.reward}</div>
                </div>
                <div class="milestone-days-tag">
                    {nextMilestone.days - streak} {i18n.t('admin.dash.vs_yesterday').includes('kemarin') ? 'hari lagi' : 'days left'}
                </div>
            </div>
            <div class="premium-progress-container">
                <div class="progress-track">
                    <div class="progress-fill" style="width: {progressToNext}%"></div>
                </div>
                <div class="progress-values">
                    <span>{streak} d</span>
                    <span>{nextMilestone.days} d</span>
                </div>
            </div>
        </div>
    </div>
    {/if}

    <!-- Weekly Reward Tiers -->
    <div class="section-container" style="--delay: 0.3s">
        <div class="section-header">
            <h3 class="section-title">{i18n.t('streak.weekly_reward')}</h3>
        </div>
        <div class="reward-tiers-list">
            {#each [
                { range: '1–7 ' + (i18n.t('learn.verse').includes('Ayat') ? 'hari' : 'days'),   gems: 3, active: streak >= 1 && streak <= 7, tier: 1 },
                { range: '8–14 ' + (i18n.t('learn.verse').includes('Ayat') ? 'hari' : 'days'),  gems: 4, active: streak >= 8 && streak <= 14, tier: 2 },
                { range: '15–21 ' + (i18n.t('learn.verse').includes('Ayat') ? 'hari' : 'days'), gems: 5, active: streak >= 15 && streak <= 21, tier: 3 },
                { range: '22–30 ' + (i18n.t('learn.verse').includes('Ayat') ? 'hari' : 'days'), gems: 3, active: streak >= 22 && streak <= 30, tier: 4 },
            ] as phase}
                <div class="tier-row" class:active={phase.active}>
                    <div class="tier-marker" class:active={phase.active}></div>
                    <div class="tier-info">
                        <span class="tier-range">{phase.range}</span>
                        <span class="tier-gems">💎 +{phase.gems} {i18n.t('profile.gems')}</span>
                    </div>
                    {#if phase.active}
                        <div class="active-badge">{i18n.t('streak.phase_msg')}</div>
                    {/if}
                </div>
            {/each}
        </div>
        <div class="info-alert">
            <i class="ti ti-info-circle-filled"></i>
            <span>{i18n.t('streak.reset_msg')}</span>
        </div>
    </div>

    <!-- Recovery Tools -->
    <div class="section-container" style="--delay: 0.4s">
        <div class="section-header">
            <h3 class="section-title">{i18n.t('streak.recovery')}</h3>
        </div>
        <div class="recovery-grid">
            <!-- Freeze -->
            <div class="recovery-tool-card">
                <div class="tool-icon">🌿</div>
                <div class="tool-content">
                    <div class="tool-title">{i18n.t('streak.freeze_title')}</div>
                    <div class="tool-count">
                        {streakFreezes} {i18n.t('market.freeze_owned').split(':')[0].toLowerCase()}
                    </div>
                </div>
                <button class="tool-btn" onclick={handleUseFreeze} disabled={streakFreezes === 0}>
                    {i18n.t('streak.use')}
                </button>
            </div>

            <!-- Repair -->
            <div class="recovery-tool-card">
                <div class="tool-icon">🔁</div>
                <div class="tool-content">
                    <div class="tool-title">{i18n.t('streak.repair_title')}</div>
                    <div class="tool-count">
                        {2 - streakRepairsUsed}/2 {i18n.t('sidebar.quests_done').toLowerCase()}
                    </div>
                </div>
                <button class="tool-btn repair" onclick={handleRepair} disabled={streakRepairsUsed >= 2}>
                    {i18n.t('streak.repair_btn')}
                </button>
            </div>
        </div>
        {#if freezeResult || repairResult}
            <div class="status-msg" transition:fade>
                {freezeResult || repairResult}
            </div>
        {/if}
        <div class="info-alert secondary">
            <i class="ti ti-clock-filled"></i>
            <span>{i18n.t('streak.grace_msg')}</span>
        </div>
    </div>

    <div style="height: 40px;"></div>
</div>

<style>
    .streak-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.6);
        z-index: 500;
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
    }

    .streak-modal {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 32px 32px 0 0;
        z-index: 501;
        max-height: 92%;
        overflow-y: auto;
        padding: 12px 0 0;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
        animation: slideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.15);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(100%); }
        to   { transform: translateY(0); }
    }

    .modal-handle {
        width: 40px;
        height: 5px;
        background: #e2e8f0;
        border-radius: 99px;
        margin: 0 auto 24px;
    }

    /* Header Hero */
    .modal-header {
        padding: 0 24px 32px;
        text-align: center;
        border-bottom: 1px solid #f1f5f9;
    }

    .streak-hero-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 16px;
    }

    .hero-glow {
        position: absolute;
        inset: -20px;
        background: radial-gradient(circle, rgba(255, 98, 0, 0.15) 0%, transparent 70%);
        animation: pulseGlow 3s ease-in-out infinite;
    }

    @keyframes pulseGlow {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
    }

    .streak-flame-big {
        font-size: 64px;
        filter: drop-shadow(0 8px 20px rgba(255, 98, 0, 0.3));
        animation: flameWobble 4s ease-in-out infinite;
    }

    @keyframes flameWobble {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-10px) rotate(5deg); }
    }

    .streak-number-big {
        font-size: 64px;
        font-weight: 900;
        color: #ff6200;
        line-height: 0.9;
        letter-spacing: -2px;
    }

    .streak-label-big {
        font-size: 13px;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .streak-max-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        padding: 6px 14px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
    }

    .streak-max-badge i { color: #ffc800; }

    /* Sections */
    .section-container {
        padding: 24px;
        border-bottom: 1px solid #f1f5f9;
        animation: fadeInUp 0.5s ease both;
        animation-delay: var(--delay);
    }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .section-title {
        font-size: 13px;
        font-weight: 900;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 20px;
    }

    /* Week Grid */
    .week-grid {
        display: flex;
        justify-content: space-between;
        gap: 8px;
    }

    .day-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        flex: 1;
    }

    .day-circle {
        width: 44px;
        height: 44px;
        border-radius: 16px;
        background: #f1f5f9;
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    .day-circle.done {
        background: #fff7ed;
        border-color: #fed7aa;
    }

    .day-circle.isToday {
        border-color: #00978A;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(0, 151, 138, 0.15);
    }

    .day-dot {
        width: 6px;
        height: 6px;
        background: #cbd5e1;
        border-radius: 50%;
    }

    .day-label {
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
    }

    .day-item.isToday .day-label { color: #00978A; }

    /* Milestone Card */
    .milestone-card-premium {
        background: linear-gradient(135deg, #fffbeb, #fff7ed);
        border: 2px solid #fde68a;
        border-radius: 24px;
        padding: 20px;
        box-shadow: 0 10px 20px -5px rgba(253, 230, 138, 0.3);
    }

    .milestone-top {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
    }

    .milestone-icon-wrapper {
        width: 56px;
        height: 56px;
        background: #fff;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .milestone-icon-large { font-size: 32px; }

    .milestone-info { flex: 1; }
    .milestone-name { font-size: 16px; font-weight: 900; color: #92400e; }
    .milestone-reward { font-size: 13px; font-weight: 700; color: #b45309; margin-top: 2px; }

    .milestone-days-tag {
        background: #fff;
        border: 1.5px solid #fed7aa;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 900;
        color: #ff6200;
        white-space: nowrap;
    }

    .premium-progress-container { margin-top: 10px; }

    .progress-track {
        height: 10px;
        background: rgba(255,255,255,0.6);
        border-radius: 100px;
        overflow: hidden;
        border: 1px solid #fed7aa;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff9600, #ff6200);
        border-radius: 100px;
        transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .progress-values {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 11px;
        font-weight: 800;
        color: #b45309;
    }

    /* Reward Tiers */
    .reward-tiers-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .tier-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 16px;
        background: #f8fafc;
        border: 1.5px solid #f1f5f9;
        border-radius: 16px;
        opacity: 0.6;
        transition: all 0.3s;
    }

    .tier-row.active {
        opacity: 1;
        background: #fff;
        border-color: #ffedd5;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        transform: scale(1.02);
    }

    .tier-marker {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #cbd5e1;
        transition: all 0.3s;
    }

    .tier-marker.active { background: #ff9600; box-shadow: 0 0 0 4px rgba(255, 150, 0, 0.2); }

    .tier-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .tier-range { font-size: 13px; font-weight: 800; color: #475569; }
    .tier-gems { font-size: 12px; font-weight: 700; color: #00978A; }

    .active-badge {
        background: #fff7ed;
        color: #c2410c;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 900;
        border: 1px solid #ffedd5;
    }

    /* Recovery Grid */
    .recovery-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 20px;
    }

    .recovery-tool-card {
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-radius: 20px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .tool-icon { font-size: 28px; }
    .tool-title { font-size: 13px; font-weight: 900; color: #1e293b; }
    .tool-count { font-size: 11px; font-weight: 700; color: #64748b; }
    
    .tool-btn {
        width: 100%;
        padding: 10px;
        background: #00978A;
        color: #fff;
        border: none;
        border-bottom: 3px solid #007a6e;
        border-radius: 12px;
        font-family: 'Nunito', sans-serif;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.1s;
    }

    .tool-btn:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 1px; }
    .tool-btn:disabled { background: #e2e8f0; border-bottom-color: #cbd5e1; color: #94a3b8; cursor: not-allowed; }
    .tool-btn.repair { background: #ff9600; border-bottom-color: #d97706; }

    /* Info Alert */
    .info-alert {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        background: #ecfdf5;
        border: 1px solid #bbf7d0;
        padding: 12px 16px;
        border-radius: 16px;
        margin-top: 16px;
    }

    .info-alert i { font-size: 16px; color: #10b981; margin-top: 2px; }
    .info-alert span { font-size: 11px; font-weight: 700; color: #065f46; line-height: 1.4; }

    .info-alert.secondary { background: #f0f9ff; border-color: #bae6fd; }
    .info-alert.secondary i { color: #0ea5e9; }
    .info-alert.secondary span { color: #0369a1; }

    .status-msg {
        text-align: center;
        font-size: 12px;
        font-weight: 800;
        color: #00978A;
        margin-bottom: 12px;
    }
</style>