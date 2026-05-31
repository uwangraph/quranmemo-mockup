<script>
    import { appState } from '$lib/app.svelte.js';

    let { onClose } = $props();

    const milestones = [
        { days: 3,   name: 'Langkah Pertama',    reward: '+1 Rukhsah Harian',              icon: '🔥', badgeId: 'b1' },
        { days: 7,   name: 'Satu Pekan Istiqomah', reward: '+1 Rukhsah Harian + Lencana',  icon: '📅', badgeId: 'b2' },
        { days: 30,  name: 'Sebulan Teguh',       reward: '+2 Rukhsah Harian + Lencana',   icon: '💎', badgeId: 'b4' },
        { days: 100, name: 'Penghafal Setia',     reward: '+3 Rukhsah Harian + Lencana',   icon: '🛡️', badgeId: 'b5' },
        { days: 365, name: 'Istiqomah Sejati',    reward: 'Lencana Permanen + Hadiah Fisik', icon: '👑', badgeId: 'b6' },
    ];

    const streak = $derived(appState.user.streak);
    const maxStreak = $derived(appState.user.maxStreak);
    const streakFreezes = $derived(appState.user.streakFreezes);
    const streakRepairsUsed = $derived(appState.user.streakRepairsUsed);

    // Milestone berikutnya
    const nextMilestone = $derived(milestones.find(m => m.days > streak) || milestones[milestones.length - 1]);
    const progressToNext = $derived(nextMilestone ? Math.min((streak / nextMilestone.days) * 100, 100) : 100);

    // Hari-hari dalam seminggu
    const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

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
        freezeResult = ok ? '✅ Rukhsah berhasil digunakan!' : '❌ Tidak ada Rukhsah tersisa.';
        clearTimeout(freezeTimer);
        freezeTimer = setTimeout(() => (freezeResult = ''), 3000);
    }

    function handleRepair() {
        const ok = appState.repairStreak();
        repairResult = ok ? '✅ Streak berhasil ditebus!' : '❌ Tidak bisa menebus streak.';
        clearTimeout(repairTimer);
        repairTimer = setTimeout(() => (repairResult = ''), 3000);
    }
</script>

<!-- Backdrop -->
<div class="streak-backdrop" onclick={onClose} role="presentation"></div>

<!-- Modal Sheet -->
<div class="streak-modal" role="dialog" aria-label="Detail Streak">
    <!-- Handle bar -->
    <div class="modal-handle"></div>

    <!-- Header -->
    <div class="modal-header">
        <div class="streak-hero">
            <div class="streak-flame-big">🔥</div>
            <div>
                <div class="streak-number-big">{streak}</div>
                <div class="streak-label-big">Hari Berturut-turut</div>
            </div>
        </div>
        <div class="streak-max">
            <i class="ti ti-trophy"></i> Terbanyak: <strong>{maxStreak} hari</strong>
        </div>
    </div>

    <!-- Visualisasi 7 Hari -->
    <div class="section-block">
        <div class="section-title">Pekan Ini</div>
        <div class="week-grid">
            {#each dayLabels as day, i}
                {@const done = appState.user.streakHistory[i]}
                <div class="day-col">
                    <div class="day-dot" class:done class:today={i === 6}>
                        {#if done}🔥{:else if i === 6}⏳{:else}·{/if}
                    </div>
                    <span class="day-label">{day}</span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Progres ke Milestone -->
    {#if nextMilestone}
    <div class="section-block">
        <div class="section-title">Target Berikutnya</div>
        <div class="milestone-card">
            <div class="milestone-top">
                <span class="milestone-icon">{nextMilestone.icon}</span>
                <div style="flex: 1">
                    <div class="milestone-name">{nextMilestone.name}</div>
                    <div class="milestone-reward">{nextMilestone.reward}</div>
                </div>
                <div class="milestone-days">{nextMilestone.days - streak} hari lagi</div>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: {progressToNext}%"></div>
            </div>
            <div class="progress-labels">
                <span>{streak} hari</span>
                <span>{nextMilestone.days} hari</span>
            </div>
        </div>
    </div>
    {/if}

    <!-- Semua Milestone -->
    <div class="section-block">
        <div class="section-title">Semua Target Streak</div>
        <div class="milestones-list">
            {#each milestones as m}
                {@const done = streak >= m.days}
                <div class="milestone-row" class:done>
                    <div class="milestone-dot-row" class:done></div>
                    <span class="m-icon">{m.icon}</span>
                    <div style="flex: 1">
                        <div class="m-name">{m.days} hari — {m.name}</div>
                        <div class="m-reward">{m.reward}</div>
                    </div>
                    {#if done}
                        <span class="m-done-badge">✓ Selesai</span>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <!-- Target Streak Harian (Gems Energy) -->
    <div class="section-block">
        <div class="section-title">Hadiah Streak Pekanan</div>
        <div class="streak-phases">
            {#each [
                { range: '1–7 hari',   gems: 3, active: streak >= 1 && streak <= 7 },
                { range: '8–14 hari',  gems: 4, active: streak >= 8 && streak <= 14 },
                { range: '15–21 hari', gems: 5, active: streak >= 15 && streak <= 21 },
                { range: '22–30 hari', gems: 3, active: streak >= 22 && streak <= 30 },
            ] as phase}
                <div class="phase-row" class:phase-active={phase.active}>
                    <span class="phase-range">{phase.range}</span>
                    <span class="phase-gems">💎 +{phase.gems} Gems/pekan</span>
                    {#if phase.active}<span class="phase-badge">Fase kamu</span>{/if}
                </div>
            {/each}
        </div>
        <div class="grace-info" style="margin-top: 10px;">
            <i class="ti ti-info-circle"></i>
            <span>Gems energy dari reward direset setiap tanggal 2 bulan baru.</span>
        </div>
    </div>

    <!-- Pemulihan Streak -->
    <div class="section-block">
        <div class="section-title">Pemulihan Streak</div>

        <!-- Rukhsah Harian -->
        <div class="recovery-card">
            <div class="recovery-header">
                <span class="recovery-icon">🌿</span>
                <div style="flex: 1">
                    <div class="recovery-title">Rukhsah Harian</div>
                    <div class="recovery-desc">Lindungi streak jika melewatkan 1 hari. Tersisa: <strong>{streakFreezes}</strong></div>
                </div>
                <button class="recovery-btn" onclick={handleUseFreeze} disabled={streakFreezes === 0}>
                    Gunakan
                </button>
            </div>
            {#if freezeResult}<div class="recovery-result">{freezeResult}</div>{/if}
        </div>

        <!-- Tebus Hari -->
        <div class="recovery-card">
            <div class="recovery-header">
                <span class="recovery-icon">🔁</span>
                <div style="flex: 1">
                    <div class="recovery-title">Tebus Hari</div>
                    <div class="recovery-desc">Selesaikan 2 target hari ini untuk pulihkan streak. Dipakai: <strong>{streakRepairsUsed}/2</strong> kali bulan ini</div>
                </div>
                <button class="recovery-btn repair" onclick={handleRepair} disabled={streakRepairsUsed >= 2}>
                    Tebus
                </button>
            </div>
            {#if repairResult}<div class="recovery-result">{repairResult}</div>{/if}
        </div>

        <!-- Grace Period info -->
        <div class="grace-info">
            <i class="ti ti-clock"></i>
            <span>Grace Period aktif 00.00–04.00 dini hari. Streak tidak langsung hangus di tengah malam.</span>
        </div>
    </div>

    <div style="height: 24px;"></div>
</div>

<style>
    .streak-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 200;
        backdrop-filter: blur(3px);
    }

    .streak-modal {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 28px 28px 0 0;
        z-index: 201;
        max-height: 90%;
        overflow-y: auto;
        padding: 12px 0 0;
        box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
        animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);   opacity: 1; }
    }

    .modal-handle {
        width: 40px;
        height: 4px;
        background: #e2e8f0;
        border-radius: 99px;
        margin: 0 auto 20px;
    }

    /* Header */
    .modal-header {
        padding: 0 20px 20px;
        border-bottom: 1px solid #f1f5f9;
        text-align: center;
    }
    .streak-hero {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 8px;
    }
    .streak-flame-big { font-size: 52px; filter: drop-shadow(0 4px 12px rgba(255,100,0,0.35)); }
    .streak-number-big {
        font-size: 52px;
        font-weight: 900;
        color: #ff6200;
        line-height: 1;
        font-family: 'Nunito', sans-serif;
    }
    .streak-label-big { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .streak-max { font-size: 12px; font-weight: 700; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 4px; }

    /* Sections */
    .section-block { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
    .section-title { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }

    /* Week Grid */
    .week-grid { display: flex; justify-content: space-between; }
    .day-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .day-dot {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 2px solid transparent;
        transition: all 0.2s;
    }
    .day-dot.done { background: #fff7ed; border-color: #fed7aa; }
    .day-dot.today { border-color: #00978A; background: #ecfdf5; }
    .day-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }

    /* Milestone card (next target) */
    .milestone-card {
        background: linear-gradient(135deg, #fff7ed, #fffbf2);
        border: 2px solid #fed7aa;
        border-radius: 16px;
        padding: 14px;
    }
    .milestone-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .milestone-icon { font-size: 28px; }
    .milestone-name { font-size: 14px; font-weight: 900; color: #92400e; }
    .milestone-reward { font-size: 11px; font-weight: 700; color: #b45309; margin-top: 2px; }
    .milestone-days { font-size: 11px; font-weight: 900; color: #ff6200; background: #fff; border: 1.5px solid #fed7aa; border-radius: 8px; padding: 4px 8px; white-space: nowrap; }

    .progress-bar-bg { height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #ff9600, #ff6200); border-radius: 99px; transition: width 0.5s ease; }
    .progress-labels { display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; color: #94a3b8; margin-top: 4px; }

    /* All Milestones list */
    .milestones-list { display: flex; flex-direction: column; gap: 8px; }
    .milestone-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1.5px solid #f1f5f9;
        opacity: 0.6;
    }
    .milestone-row.done { background: #ecfdf5; border-color: #bbf7d0; opacity: 1; }
    .milestone-dot-row { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; flex-shrink: 0; }
    .milestone-dot-row.done { background: #10b981; }
    .m-icon { font-size: 20px; }
    .m-name { font-size: 12px; font-weight: 800; color: #334155; }
    .m-reward { font-size: 10px; font-weight: 700; color: #64748b; margin-top: 2px; }
    .m-done-badge { font-size: 10px; font-weight: 900; color: #10b981; background: #d1fae5; padding: 2px 8px; border-radius: 6px; white-space: nowrap; }

    /* Recovery cards */
    .recovery-card {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 14px;
        padding: 12px 14px;
        margin-bottom: 10px;
    }
    .recovery-header { display: flex; align-items: center; gap: 10px; }
    .recovery-icon { font-size: 24px; }
    .recovery-title { font-size: 13px; font-weight: 900; color: #1e293b; }
    .recovery-desc { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px; line-height: 1.4; }
    .recovery-btn {
        font-family: 'Nunito', sans-serif;
        font-size: 11px;
        font-weight: 900;
        padding: 7px 14px;
        background: #00978A;
        color: #fff;
        border: none;
        border-bottom: 3px solid #007a6e;
        border-radius: 10px;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.15s;
    }
    .recovery-btn.repair { background: #f59e0b; border-bottom-color: #d97706; }
    .recovery-btn:disabled { background: #e2e8f0; border-bottom-color: #cbd5e1; color: #94a3b8; cursor: not-allowed; }
    .recovery-result { font-size: 11px; font-weight: 700; margin-top: 8px; text-align: center; }

    .grace-info {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        background: #f0fdf4;
        border: 1.5px solid #bbf7d0;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 11px;
        font-weight: 600;
        color: #065f46;
        line-height: 1.5;
    }
    .grace-info i { flex-shrink: 0; margin-top: 1px; }

    /* Streak phases */
    .streak-phases { display: flex; flex-direction: column; gap: 6px; }
    .phase-row {
        display: flex; align-items: center; gap: 8px;
        padding: 8px 12px; border-radius: 10px;
        background: #f8fafc; border: 1.5px solid #f1f5f9;
        font-size: 12px; font-weight: 700; color: #64748b;
        opacity: 0.6;
    }
    .phase-row.phase-active {
        background: #fff7ed; border-color: #fed7aa; opacity: 1; color: #92400e;
    }
    .phase-range { flex: 1; }
    .phase-gems { font-weight: 900; color: #00978A; }
    .phase-row.phase-active .phase-gems { color: #d97706; }
    .phase-badge {
        font-size: 10px; font-weight: 900; color: #ff6200;
        background: #fff; border: 1.5px solid #fed7aa;
        padding: 2px 8px; border-radius: 6px; white-space: nowrap;
    }
</style>
