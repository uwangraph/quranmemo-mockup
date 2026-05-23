<script>
    import { appState } from '$lib/app.svelte.js';
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
        const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        return labels[dayIdx % 7];
    }

    // Fase streak: tentukan label fase berdasarkan hari
    const streakPhaseLabel = $derived(() => {
        if (!rewardInfo) return '';
        const d = rewardInfo.streakDay;
        if (d >= 22) return 'Pekan 4: 22–30 Hari';
        if (d >= 15) return 'Pekan 3: 15–21 Hari';
        if (d >= 8)  return 'Pekan 2: 8–14 Hari';
        return 'Pekan 1: 1–7 Hari';
    });

    // Apakah ini hari milestone (7, 14, 21, 30)?
    const isMilestone = $derived(
        rewardInfo && [7, 14, 21, 30].includes(rewardInfo.streakDay)
    );
</script>

{#if showModal && rewardInfo}
    <div class="login-overlay" onclick={(e) => e.stopPropagation()}>
        <div class="login-card">
            <!-- Header -->
            <div class="login-header">
                <div class="fire-icon">🔥</div>
                <h2 class="login-title">Hadiah Streak Pekanan!</h2>
                <p class="login-sub">Selesaikan 1 target setiap hari selama {rewardInfo.streakDay} hari berturut-turut</p>
            </div>

            <!-- 7-day calendar strip -->
            <div class="day-strip">
                {#each Array(7) as _, i}
                    {@const dayNum = i + 1}
                    {@const isCurrent = dayNum === Math.min(rewardInfo.streakDay, 7)}
                    {@const isPast = dayNum < Math.min(rewardInfo.streakDay, 7)}
                    {@const gems = getGemsForStreak(rewardInfo.streakDay - (Math.min(rewardInfo.streakDay, 7) - dayNum))}
                    <div class="day-cell {isCurrent ? 'current' : ''} {isPast ? 'past' : ''} {!isCurrent && !isPast ? 'future' : ''}">
                        <div class="day-label">{getDayLabel(i)}</div>
                        <div class="day-reward-icon">
                            {#if isPast}
                                <i class="ti ti-check"></i>
                            {:else if isCurrent}
                                💎
                            {:else}
                                <i class="ti ti-lock"></i>
                            {/if}
                        </div>
                        <div class="day-gems">+{gems}</div>
                    </div>
                {/each}
            </div>

            <!-- Big reward display -->
            <div class="big-reward {isMilestone ? 'milestone' : ''}">
                {#if isMilestone}
                    <div class="milestone-badge">🏆 Hari Milestone!</div>
                {/if}
                <div class="big-gems-icon">💎</div>
                <div class="big-gems-text">+{rewardInfo.gemsReward} Gems</div>
                <p class="big-gems-sub">
                    {streakPhaseLabel()} — {isMilestone ? 'Bonus milestone istiqomah!' : 'Terus jaga keistiqomahanmu!'}
                </p>
            </div>

            <!-- CTA -->
            <button
                class="claim-btn {claiming ? 'claimed' : ''}"
                onclick={handleClaim}
                disabled={claiming}
            >
                {claiming ? '✓ DIKLAIM!' : 'KLAIM SEKARANG'}
            </button>
        </div>
    </div>
{/if}

<style>
    .login-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        z-index: 300;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }

    .login-card {
        background: #fff;
        border-radius: 32px 32px 0 0;
        padding: 32px 24px 40px;
        width: 100%;
        max-width: 480px;
        animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .login-header {
        text-align: center;
        margin-bottom: 24px;
    }

    .fire-icon {
        font-size: 52px;
        margin-bottom: 8px;
        display: block;
        animation: pulse 1.5s infinite;
    }

    .login-title {
        font-size: 22px;
        font-weight: 900;
        color: #1e293b;
        margin: 0 0 4px 0;
        letter-spacing: -0.5px;
    }

    .login-sub {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        margin: 0;
    }

    /* 7-day strip */
    .day-strip {
        display: flex;
        gap: 6px;
        margin-bottom: 24px;
        justify-content: center;
    }

    .day-cell {
        flex: 1;
        max-width: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 14px;
        padding: 8px 2px;
        transition: all 0.2s;
    }

    .day-cell.past {
        background: #f0fdf4;
        border-color: #86efac;
    }

    .day-cell.current {
        background: linear-gradient(135deg, #00978A, #007a6f);
        border-color: #007a6f;
        border-bottom-width: 4px;
        transform: scale(1.08);
        box-shadow: 0 8px 20px rgba(0, 151, 138, 0.35);
    }

    .day-cell.future {
        opacity: 0.45;
    }

    .day-label {
        font-size: 9px;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    .day-cell.current .day-label { color: rgba(255,255,255,0.85); }
    .day-cell.past .day-label { color: #4ade80; }

    .day-reward-icon {
        font-size: 16px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .day-cell.past .day-reward-icon { color: #22c55e; }
    .day-cell.current .day-reward-icon { color: #fff; font-size: 18px; }

    .day-gems {
        font-size: 10px;
        font-weight: 800;
        color: #94a3b8;
    }

    .day-cell.current .day-gems { color: #fff; }
    .day-cell.past .day-gems { color: #16a34a; }

    /* Big reward */
    .big-reward {
        background: linear-gradient(135deg, #e0f2f1, #f0fdf4);
        border: 2px solid #99f6e4;
        border-radius: 20px;
        padding: 20px;
        text-align: center;
        margin-bottom: 24px;
        position: relative;
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
    }

    .big-reward.milestone {
        background: linear-gradient(135deg, #fffbeb, #fff7ed);
        border-color: #fde68a;
    }

    .milestone-badge {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff9600, #ff6600);
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        padding: 3px 12px;
        border-radius: 100px;
        white-space: nowrap;
        letter-spacing: 0.3px;
        box-shadow: 0 4px 12px rgba(255, 150, 0, 0.4);
    }

    .big-gems-icon {
        font-size: 40px;
        margin-bottom: 4px;
    }

    .big-gems-text {
        font-size: 28px;
        font-weight: 900;
        color: #00978A;
        letter-spacing: -1px;
    }

    .big-gems-sub {
        font-size: 12px;
        font-weight: 700;
        color: #0d9488;
        margin: 4px 0 0 0;
    }

    /* CTA */
    .claim-btn {
        width: 100%;
        padding: 18px;
        background: linear-gradient(135deg, #00978A, #007a6f);
        border: none;
        border-radius: 16px;
        color: #fff;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        box-shadow: 0 6px 20px rgba(0, 151, 138, 0.4);
        font-family: 'Nunito', sans-serif;
    }

    .claim-btn:active {
        transform: translateY(2px);
        box-shadow: 0 2px 8px rgba(0, 151, 138, 0.3);
    }

    .claim-btn.claimed {
        background: #22c55e;
        box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    @keyframes popIn {
        0% { transform: scale(0.8); opacity: 0; }
        80% { transform: scale(1.03); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }
</style>
