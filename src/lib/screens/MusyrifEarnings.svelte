<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    // Mock data for analytics
    const weeklyData = [65, 45, 80, 55, 90, 70, 85];
    const maxVal = Math.max(...weeklyData);
    
    let transactions = $state([
        { id: 1, type: 'Recitation', student: 'Ahmad Hafidz', date: 'Today, 09:30', amount: '+15 💎', status: 'Completed' },
        { id: 2, type: 'Recitation', student: 'Sarah Amira', date: 'Yesterday, 20:15', amount: '+15 💎', status: 'Completed' },
        { id: 3, type: 'Withdrawal', student: 'To Bank BCA', date: '10 May, 14:00', amount: '-1000 💎', status: 'Processing' },
        { id: 4, type: 'Recitation', student: 'Zaid Fawwaz', date: '10 May, 08:45', amount: '+15 💎', status: 'Completed' },
    ]);
    
    let showWithdrawModal = $state(false);
    let alertStatus = $state(null); // 'success' | 'error' | null
    let alertTitle = $state('');
    let alertMessage = $state('');

    function playSuccessSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const startTime = now + idx * 0.1;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
                osc.start(startTime);
                osc.stop(startTime + 0.35);
            });
        } catch (e) {
            console.error(e);
        }
    }

    function playErrorSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const notes = [220, 147];
            notes.forEach((freq, idx) => {
                const startTime = now + idx * 0.15;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, startTime);
                osc.frequency.exponentialRampToValueAtTime(freq - 30, startTime + 0.15);
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
                osc.start(startTime);
                osc.stop(startTime + 0.2);
            });
        } catch (e) {
            console.error(e);
        }
    }

    function confirmWithdrawal() {
        const amountToWithdraw = appState.musyrifBalance;
        showWithdrawModal = false;
        
        if (amountToWithdraw > 0) {
            transactions = [
                { 
                    id: Date.now(), 
                    type: 'Withdrawal', 
                    student: 'To Bank BCA', 
                    date: 'Today, ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                    amount: `-${amountToWithdraw} 💎`, 
                    status: 'Processing' 
                },
                ...transactions
            ];
            appState.setMusyrifBalance(0);
            
            alertTitle = 'Pencairan Berhasil!';
            alertMessage = `Dana sebesar Rp ${(amountToWithdraw * 672).toLocaleString('id-ID')} sedang diproses dan akan ditransfer ke rekening Bank BCA Anda dalam waktu maksimal 1x24 jam.`;
            alertStatus = 'success';
            playSuccessSound();
        } else {
            alertTitle = 'Pencairan Gagal';
            alertMessage = 'Saldo Anda kosong atau tidak mencukupi untuk melakukan pencairan pendapatan.';
            alertStatus = 'error';
            playErrorSound();
        }
    }
</script>

<div class="screen no-scrollbar" style="background: #fafafa;">
    <!-- Header -->
    <div class="earnings-header">
        <button onclick={() => appState.go('musyrif')} class="back-btn">
            <i class="ti ti-arrow-left"></i>
        </button>
        <div style="font-size: 16px; font-weight: 900; color: #3c3c3c">{i18n.t('earnings.title')}</div>
        <div style="width: 20px"></div>
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 20px;">
        <!-- Balance Card -->
        <div class="balance-card" style="background: linear-gradient(135deg, #1cb0f6, #0898dc); box-shadow: 0 10px 20px rgba(28, 176, 246, 0.2);">
            <div class="balance-info">
                <div style="font-size: 11px; font-weight: 800; color: #ffffff; opacity: 0.8; text-transform: uppercase;">Total Gems</div>
                <div style="font-size: 32px; font-weight: 900; color: #ffffff; margin: 4px 0;">{appState.musyrifBalance} <i class="ti ti-diamond-filled"></i></div>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: #ffffff;">
                    <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 6px;">≈ Rp {(appState.musyrifBalance * 672).toLocaleString('id-ID')}</span>
                    <span style="opacity: 0.8;">Estimasi Rupiah</span>
                </div>
            </div>
            <button class="withdraw-btn" onclick={() => showWithdrawModal = true} disabled={appState.musyrifBalance <= 0} style={appState.musyrifBalance <= 0 ? "opacity: 0.6; cursor: not-allowed;" : ""}>
                <i class="ti ti-wallet" style="font-size: 18px;"></i>
                <span>Cairkan ke Rupiah</span>
            </button>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-icon" style="background: #DBF0EE; color: #00978A;"><i class="ti ti-microphone"></i></div>
                <div>
                    <div class="stat-label">{i18n.t('earnings.sessions')}</div>
                    <div class="stat-value">142</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon" style="background: #fff4e0; color: #ff9600;"><i class="ti ti-star"></i></div>
                <div>
                    <div class="stat-label">{i18n.t('earnings.rating')}</div>
                    <div class="stat-value">4.9/5</div>
                </div>
            </div>
        </div>

        <!-- Chart Section -->
        <div class="card chart-card">
            <div class="card-header">
                <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">{i18n.t('earnings.performance')}</div>
                <div style="font-size: 11px; font-weight: 700; color: #ff9600;">+24 {i18n.t('marking.minutes')}</div>
            </div>
            <div class="chart-container">
                <svg viewBox="0 0 100 40" class="chart">
                    <!-- Grid Lines -->
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#f0f0f0" stroke-width="0.5" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#f0f0f0" stroke-width="0.5" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#f0f0f0" stroke-width="0.5" />
                    
                    <!-- Area -->
                    <path 
                        d="M 0 40 L 0 {40 - (weeklyData[0]/maxVal)*30} L 16.6 {40 - (weeklyData[1]/maxVal)*30} L 33.2 {40 - (weeklyData[2]/maxVal)*30} L 49.8 {40 - (weeklyData[3]/maxVal)*30} L 66.4 {40 - (weeklyData[4]/maxVal)*30} L 83 {40 - (weeklyData[5]/maxVal)*30} L 100 {40 - (weeklyData[6]/maxVal)*30} L 100 40 Z" 
                        fill="url(#gradient)" 
                        opacity="0.3"
                    />
                    
                    <!-- Line -->
                    <polyline
                        points="0,{40 - (weeklyData[0]/maxVal)*30} 16.6,{40 - (weeklyData[1]/maxVal)*30} 33.2,{40 - (weeklyData[2]/maxVal)*30} 49.8,{40 - (weeklyData[3]/maxVal)*30} 66.4,{40 - (weeklyData[4]/maxVal)*30} 83,{40 - (weeklyData[5]/maxVal)*30} 100,{40 - (weeklyData[6]/maxVal)*30}"
                        fill="none"
                        stroke="#ff9600"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#ff9600;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#ff9600;stop-opacity:0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="chart-labels">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
        </div>

        <!-- History List -->
        <div class="history-section">
            <div class="card-header" style="padding: 10px 0;">
                <div style="font-size: 13px; font-weight: 900; color: #3c3c3c;">{i18n.t('earnings.history')}</div>
                <button style="background: none; border: none; font-size: 11px; font-weight: 800; color: #ff9600;">SEE ALL</button>
            </div>
            
            <div class="transaction-list">
                {#each transactions as tx}
                    <div class="transaction-item">
                        <div class="tx-icon" style="background: {tx.type === 'Recitation' ? '#f0f0f0' : '#ffeded'};">
                            <i class="ti ti-{tx.type === 'Recitation' ? 'book' : 'arrow-up-right'}" style="color: {tx.type === 'Recitation' ? '#3c3c3c' : '#ff4b4b'};"></i>
                        </div>
                        <div style="flex: 1">
                            <div style="font-size: 13px; font-weight: 800; color: #3c3c3c;">{tx.student}</div>
                            <div style="font-size: 10px; font-weight: 700; color: #afafaf;">{tx.date}</div>
                        </div>
                        <div style="text-align: right">
                            <div style="font-size: 13px; font-weight: 900; color: {tx.amount.startsWith('+') ? '#00978A' : '#ff4b4b'};">{tx.amount}</div>
                            <div style="font-size: 9px; font-weight: 800; color: #afafaf; text-transform: uppercase;">{tx.status}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

{#if showWithdrawModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="custom-alert-overlay" onclick={() => showWithdrawModal = false}>
        <div class="custom-alert-box" onclick={e => e.stopPropagation()}>
            <div class="alert-icon" style="color: #1cb0f6; background: #e1f5fe;">
                <i class="ti ti-wallet"></i>
            </div>
            <div style="font-size: 16px; font-weight: 900; margin-bottom: 8px;">Cairkan Pendapatan</div>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
                Saldo <b>{appState.musyrifBalance} Gems</b> Anda akan dikonversi menjadi <b>Rp {(appState.musyrifBalance * 672).toLocaleString('id-ID')}</b> dan ditransfer ke rekening yang terdaftar.
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 12px; font-size: 12px; text-align: left; margin-bottom: 20px;">
                <div style="color: #64748b; font-weight: 800; margin-bottom: 4px;">REKENING TUJUAN</div>
                <div style="font-weight: 900; color: #334155; margin-bottom: 2px;">Bank BCA - 837192****</div>
                <div style="font-weight: 700; color: #94a3b8;">a.n. Ustadz Malik</div>
            </div>
            <div class="alert-actions">
                <button class="alert-btn secondary" onclick={() => showWithdrawModal = false}>Batal</button>
                <button class="alert-btn primary" style="background: #1cb0f6; border-color: #1cb0f6;" onclick={confirmWithdrawal}>Konfirmasi</button>
            </div>
        </div>
    </div>
{/if}

{#if alertStatus}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="custom-alert-overlay" onclick={() => alertStatus = null}>
        <div class="custom-alert-box" onclick={e => e.stopPropagation()}>
            {#if alertStatus === 'success'}
                <div class="alert-icon" style="color: #10b981; background: #e6f4ea;">
                    <i class="ti ti-circle-check" style="font-size: 28px;"></i>
                </div>
            {:else}
                <div class="alert-icon" style="color: #ef4444; background: #fce8e6;">
                    <i class="ti ti-circle-x" style="font-size: 28px;"></i>
                </div>
            {/if}
            <div style="font-size: 16px; font-weight: 900; margin-bottom: 8px;">{alertTitle}</div>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 20px; line-height: 1.4;">
                {alertMessage}
            </div>
            <button class="alert-btn primary" style="background: {alertStatus === 'success' ? '#10b981' : '#ef4444'}; border-color: {alertStatus === 'success' ? '#10b981' : '#ef4444'}; width: 100%; color: white;" onclick={() => alertStatus = null}>
                Tutup
            </button>
        </div>
    </div>
{/if}

<style>
    .earnings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #fff;
        border-bottom: 1px solid #f0f0f0;
    }
    .back-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #3c3c3c;
        cursor: pointer;
    }

    .balance-card {
        background: linear-gradient(135deg, #1cb0f6, #0898dc);
        border-radius: 24px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: 0 10px 20px rgba(28, 176, 246, 0.2);
        margin-bottom: 24px;
    }
    .withdraw-btn {
        background: #fff;
        border: none;
        padding: 12px;
        border-radius: 16px;
        color: #1cb0f6;
        font-weight: 900;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .withdraw-btn:active { transform: scale(0.98); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

    /* Modal Styles */
    .custom-alert-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); z-index: 1000;
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
    }
    .custom-alert-box {
        background: #fff; border-radius: 24px; padding: 24px;
        width: 100%; max-width: 320px; text-align: center;
        animation: slideUpScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .alert-icon {
        width: 56px; height: 56px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 28px; margin: 0 auto 16px;
    }
    .alert-actions { display: flex; gap: 12px; }
    .alert-btn {
        flex: 1; padding: 12px; border-radius: 12px;
        font-size: 13px; font-weight: 800; cursor: pointer;
    }
    .alert-btn.primary { color: #fff; }
    .alert-btn.secondary { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
    @keyframes slideUpScale {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
    }
    .stat-item {
        background: #fff;
        padding: 12px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #f0f0f0;
    }
    .stat-icon {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
    .stat-label { font-size: 9px; font-weight: 800; color: #afafaf; text-transform: uppercase; }
    .stat-value { font-size: 15px; font-weight: 900; color: #3c3c3c; }

    .card {
        background: #fff;
        border-radius: 24px;
        padding: 16px;
        border: 1px solid #f0f0f0;
        margin-bottom: 24px;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .chart-container {
        height: 100px;
        width: 100%;
        margin: 10px 0;
    }
    .chart {
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .chart-labels {
        display: flex;
        justify-content: space-between;
        padding: 0 4px;
        font-size: 10px;
        font-weight: 800;
        color: #afafaf;
    }

    .transaction-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .transaction-item {
        background: #fff;
        padding: 12px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #f0f0f0;
    }
    .tx-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
</style>
