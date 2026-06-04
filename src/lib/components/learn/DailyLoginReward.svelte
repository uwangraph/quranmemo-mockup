<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import { onMount } from 'svelte';

    let { onClaim } = $props();

    // Reward schedule berdasarkan target streak (STREAK.md):                                                                                                                    
    // 1-7 hari: 3 gems, 8-14 hari: 4 gems, 15-21 hari: 5 gems, 22-30 hari: 3 gems
    function getGemsForStreak(streakDay) {
        if (streakDay >= 22) return 3;
        if (streakDay >= 15) return 5;
        if (streakDay >= 8) return 4;
        return 3;
    }

    let rewardInfo = $state(null); // { gemsReward, streakDay }
    let showModal = $state(false);
    let claiming = $state(false);

    const pendingRewardInfo = $derived(appState.pendingRewardInfo);

    function refreshRewardInfo() {
        const info = appState.pendingRewardInfo || appState.checkLoginReward();
        if (info) {
            rewardInfo = info;
            showModal = true;
        }
    }

    onMount(() => {
        refreshRewardInfo();
    });

    $effect(() => {
        if (pendingRewardInfo && !showModal) {
            rewardInfo = pendingRewardInfo;
            showModal = true;
        }
    });

    function handleClaim() {
        if (!rewardInfo || claiming) return;
        claiming = true;
        appState.claimLoginReward(rewardInfo.gemsReward, rewardInfo.streakDay);
        setTimeout(() => {
            showModal = false;
            rewardInfo = null;
            if (onClaim) onClaim();
        }, 600);
    }

    function getDayLabel(dayIdx) {
        const labels = i18n.t('admin.dash.day_mon') + ',' + i18n.t('admin.dash.day_tue') + ',' + i18n.t('admin.dash.day_wed') + ',' + i18n.t('admin.dash.day_thu') + ',' + i18n.t('admin.dash.day_fri') + ',' + i18n.t('admin.dash.day_sat') + ',' + i18n.t('admin.dash.day_sun');
        return labels.split(',')[dayIdx % 7];
    }

    // Fase streak: tentukan label fase berdasarkan hari
    const streakPhaseLabel = $derived(() => {
        if (!rewardInfo) return '';
        const d = rewardInfo.streakDay;
        if (d >= 22) return i18n.t('reward.week', { week: 4, range: '22–30' });
        if (d >= 15) return i18n.t('reward.week', { week: 3, range: '15–21' });
        if (d >= 8)  return i18n.t('reward.week', { week: 2, range: '8–14' });
        return i18n.t('reward.week', { week: 1, range: '1–7' });
    });

    // Apakah ini hari milestone (7, 14, 21, 30)?
    const isMilestone = $derived(
        rewardInfo && [7, 14, 21, 30].includes(rewardInfo.streakDay)
    );
</script>

{#if showModal && rewardInfo}
    <div class="login-overlay" onclick={(e) => e.stopPropagation()}>
        <div class="login-card">
            <!-- Close button (optional, but good for UX) -->
            <!-- <button class="close-x" onclick={() => showModal = false}>×</button> -->

            <!-- Header -->
            <div class="login-header">
                <div class="reward-icon-container">
                    <div class="icon-glow"></div>
                    <span class="main-reward-icon">🎁</span>
                </div>
                <h2 class="login-title">{i18n.t('reward.title')}</h2>
                <p class="login-sub">{i18n.t('reward.sub', { days: rewardInfo.streakDay })}</p>
            </div>

            <!-- 7-day calendar path -->
            <div class="day-path">
                {#each Array(7) as _, i}
                    {@const dayNum = i + 1}
                    {@const isCurrent = dayNum === Math.min(rewardInfo.streakDay, 7)}
                    {@const isPast = dayNum < Math.min(rewardInfo.streakDay, 7)}
                    {@const isDay7 = dayNum === 7}
                    {@const gems = getGemsForStreak(rewardInfo.streakDay - (Math.min(rewardInfo.streakDay, 7) - dayNum))}
                    
                    <div class="day-node {isCurrent ? 'current' : ''} {isPast ? 'past' : ''} {!isCurrent && !isPast ? 'future' : ''} {isDay7 ? 'milestone-node' : ''}">
                        <div class="node-circle">
                            {#if isPast}
                                <i class="ti ti-check"></i>
                            {:else if isDay7}
                                <span class="chest-icon">🎁</span>
                            {:else if isCurrent}
                                <span class="gems-icon">💎</span>
                            {:else}
                                <i class="ti ti-lock"></i>
                            {/if}
                        </div>
                        <div class="node-label">{getDayLabel(i)}</div>
                        {#if !isPast}
                            <div class="node-gems">+{gems}</div>
                        {/if}
                    </div>
                    {#if dayNum < 7}
                        <div class="path-line {isPast ? 'filled' : ''}"></div>
                    {/if}
                {/each}
            </div>

            <!-- Featured Reward Card -->
            <div class="featured-reward {isMilestone ? 'milestone' : ''}">
                <div class="featured-info">
                    <div class="featured-icon">
                        {#if isMilestone}
                            <div class="sparkles">✨</div>
                            🏆
                        {:else}
                            💎
                        {/if}
                    </div>
                    <div class="featured-content">
                        <div class="featured-title">
                            +{rewardInfo.gemsReward} {i18n.t('profile.gems')}
                        </div>
                        <div class="featured-desc">
                            {isMilestone ? i18n.t('reward.bonus') : i18n.t('reward.keep_going')}
                        </div>
                    </div>
                </div>
                <div class="phase-tag">
                    {streakPhaseLabel()}
                </div>
            </div>

            <!-- Footer Action -->
            <button
                class="btn-duo btn-green {claiming ? 'btn-disabled' : ''}"
                onclick={handleClaim}
                disabled={claiming}
            >
                {#if claiming}
                    <span class="spinner"></span> {i18n.t('reward.claimed')}
                {:else}
                    {i18n.t('reward.claim')}
                {/if}
            </button>
        </div>
    </div>
{/if}

<style>
    .login-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    }

    .login-card {
        background: #fff;
        border-radius: 32px;
        padding: 32px 24px;
        width: 100%;
        max-width: 420px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .login-header {
        text-align: center;
        margin-bottom: 32px;
    }

    .reward-icon-container {
        position: relative;
        display: inline-block;
        margin-bottom: 16px;
    }

    .icon-glow {
        position: absolute;
        inset: -20px;
        background: radial-gradient(circle, rgba(255, 200, 0, 0.4) 0%, transparent 70%);
        animation: rotateGlow 4s linear infinite;
    }

    .main-reward-icon {
        font-size: 64px;
        display: block;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
        animation: float 3s ease-in-out infinite;
    }

    .login-title {
        font-size: 24px;
        font-weight: 900;
        color: #1e293b;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
    }

    .login-sub {
        font-size: 14px;
        font-weight: 700;
        color: #64748b;
        margin: 0;
        line-height: 1.4;
    }

    /* Day Path Grid */
    .day-path {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 32px;
        padding: 0 10px;
    }

    .day-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        position: relative;
        z-index: 1;
    }

    .node-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f1f5f9;
        border: 2px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s;
    }

    .day-node.past .node-circle {
        background: #00978A;
        border-color: #00978A;
        color: #fff;
    }

    .day-node.current .node-circle {
        background: #fff;
        border-color: #ff9600;
        box-shadow: 0 0 0 4px rgba(255, 150, 0, 0.2);
        transform: scale(1.2);
    }

    .day-node.current .gems-icon {
        animation: pulse 1s infinite;
    }

    .day-node.milestone-node .node-circle {
        border-style: dashed;
        border-color: #ffc800;
        background: #fffbeb;
    }

    .day-node.milestone-node.past .node-circle {
        border-style: solid;
        background: #ffc800;
    }

    .node-label {
        font-size: 10px;
        font-weight: 900;
        color: #94a3b8;
        text-transform: uppercase;
    }

    .day-node.current .node-label {
        color: #ff9600;
    }

    .node-gems {
        font-size: 10px;
        font-weight: 800;
        color: #00978A;
        position: absolute;
        bottom: -18px;
    }

    .path-line {
        flex: 1;
        height: 4px;
        background: #f1f5f9;
        margin: 0 -5px;
        margin-top: -18px; /* Align with circles */
    }

    .path-line.filled {
        background: #00978A;
    }

    /* Featured Card */
    .featured-reward {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
    }

    .featured-reward.milestone {
        background: linear-gradient(135deg, #fffbeb, #fff7ed);
        border-color: #fde68a;
    }

    .featured-info {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .featured-icon {
        font-size: 32px;
        position: relative;
    }

    .sparkles {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 16px;
        animation: spin 3s linear infinite;
    }

    .featured-title {
        font-size: 20px;
        font-weight: 900;
        color: #0f172a;
    }

    .featured-desc {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
    }

    .phase-tag {
        background: #e2e8f0;
        color: #475569;
        padding: 4px 12px;
        border-radius: 100px;
        font-size: 11px;
        font-weight: 800;
    }

    .milestone .phase-tag {
        background: #fef3c7;
        color: #92400e;
    }

    /* Button Override */
    .btn-duo {
        width: 100%;
        padding: 20px;
        font-size: 17px;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes cardPop {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes rotateGlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>

