<script>
    import { appState } from '$lib/app.svelte.js';
    import { onMount } from 'svelte';

    let { onClaim } = $props();

    // Daily reward schedule (streak day 1-7+)
    const rewardSchedule = [3, 3, 5, 5, 7, 7, 10];

    let rewardInfo = $state(null); // { energyReward, streakDay }
    let showModal = $state(false);
    let claiming = $state(false);

    onMount(() => {
        const info = appState.checkLoginReward();
        if (info) {
            rewardInfo = info;
            setTimeout(() => { showModal = true; }, 400); // short delay for page load
        }
    });

    function handleClaim() {
        if (!rewardInfo || claiming) return;
        claiming = true;
        appState.claimLoginReward(rewardInfo.energyReward, rewardInfo.streakDay);
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
</script>

{#if showModal && rewardInfo}
    <div class="login-overlay" onclick={(e) => e.stopPropagation()}>
        <div class="login-card">
            <!-- Header -->
            <div class="login-header">
                <div class="fire-icon">🔥</div>
                <h2 class="login-title">Hadiah Login Harian!</h2>
                <p class="login-sub">Login {rewardInfo.streakDay} hari berturut-turut</p>
            </div>

            <!-- 7-day calendar strip -->
            <div class="day-strip">
                {#each Array(7) as _, i}
                    {@const dayNum = i + 1}
                    {@const isCurrent = dayNum === rewardInfo.streakDay}
                    {@const isPast = dayNum < rewardInfo.streakDay}
                    {@const reward = rewardSchedule[i]}
                    <div class="day-cell {isCurrent ? 'current' : ''} {isPast ? 'past' : ''} {dayNum > rewardInfo.streakDay ? 'future' : ''}">
                        <div class="day-label">{getDayLabel(i)}</div>
                        <div class="day-reward-icon">
                            {#if isPast}
                                <i class="ti ti-check"></i>
                            {:else if isCurrent}
                                ⚡
                            {:else}
                                <i class="ti ti-lock"></i>
                            {/if}
                        </div>
                        <div class="day-energy">+{reward}</div>
                    </div>
                {/each}
            </div>

            <!-- Big reward display -->
            <div class="big-reward">
                <div class="big-energy-icon">⚡</div>
                <div class="big-energy-text">+{rewardInfo.energyReward} Energy</div>
                <p class="big-energy-sub">Ditambahkan ke kuota harian kamu</p>
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
        background: linear-gradient(135deg, #ff9600, #ff6600);
        border-color: #ff6600;
        border-bottom-width: 4px;
        transform: scale(1.08);
        box-shadow: 0 8px 20px rgba(255, 150, 0, 0.35);
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

    .day-energy {
        font-size: 10px;
        font-weight: 800;
        color: #94a3b8;
    }

    .day-cell.current .day-energy { color: #fff; }
    .day-cell.past .day-energy { color: #16a34a; }

    /* Big reward */
    .big-reward {
        background: linear-gradient(135deg, #fff7ed, #fffbf2);
        border: 2px solid #ffe4b3;
        border-radius: 20px;
        padding: 20px;
        text-align: center;
        margin-bottom: 24px;
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
    }

    .big-energy-icon {
        font-size: 40px;
        margin-bottom: 4px;
    }

    .big-energy-text {
        font-size: 28px;
        font-weight: 900;
        color: #ff9600;
        letter-spacing: -1px;
    }

    .big-energy-sub {
        font-size: 12px;
        font-weight: 700;
        color: #d97706;
        margin: 4px 0 0 0;
    }

    /* CTA */
    .claim-btn {
        width: 100%;
        padding: 18px;
        background: linear-gradient(135deg, #ff9600, #ff6600);
        border: none;
        border-radius: 16px;
        color: #fff;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        box-shadow: 0 6px 20px rgba(255, 150, 0, 0.4);
    }

    .claim-btn:active {
        transform: translateY(2px);
        box-shadow: 0 2px 8px rgba(255, 150, 0, 0.3);
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
