<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    // Mock data for analytics
    const weeklyData = [65, 45, 80, 55, 90, 70, 85];
    const maxVal = Math.max(...weeklyData);
    
    const transactions = [
        { id: 1, type: 'Recitation', student: 'Ahmad Hafidz', date: 'Today, 09:30', amount: '+Rp 25.000', status: 'Completed' },
        { id: 2, type: 'Recitation', student: 'Sarah Amira', date: 'Yesterday, 20:15', amount: '+Rp 25.000', status: 'Completed' },
        { id: 3, type: 'Withdrawal', student: 'To Bank BCA', date: '10 May, 14:00', amount: '-Rp 500.000', status: 'Processing' },
        { id: 4, type: 'Recitation', student: 'Zaid Fawwaz', date: '10 May, 08:45', amount: '+Rp 25.000', status: 'Completed' },
    ];
</script>

<div class="screen no-scrollbar" style="background: #fafafa;">
    <!-- Header -->
    <div class="marking-header" style="background: #fff4e0; border-bottom-color: #ffe0b2;">
            <button onclick={() => appState.go('musyrif')} class="close-btn">
                <i class="ti ti-arrow-left"></i>
            </button>
            <div style="flex: 1">
                <div style="font-size: 14px; font-weight: 900">Ahmad Hafidz</div>
                <div style="font-size: 10px; font-weight: 700; color: #ff9600">🔴 {i18n.t('marking.live')}</div>
            </div>
            <div class="timer-bubble" style="background: #ff9600; color: #fff;">04:20</div>
        </div>

    <div class="scroll-content no-scrollbar" style="padding: 20px;">
        <!-- Balance Card -->
        <div class="balance-card" style="background: var(--duo-orange); box-shadow: 0 10px 20px rgba(255, 150, 0, 0.2);">
            <div class="balance-info">
                <div style="font-size: 11px; font-weight: 800; color: #ffffff; opacity: 0.8; text-transform: uppercase;">{i18n.t('earnings.total_balance')}</div>
                <div style="font-size: 28px; font-weight: 900; color: #ffffff; margin: 4px 0;">Rp 840.000</div>
                <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; color: #ffffff;">
                    <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">+12.5%</span>
                    <span style="opacity: 0.8;">{i18n.t('earnings.growth')}</span>
                </div>
            </div>
            <button class="withdraw-btn" style="color: #ff9600;">
                <i class="ti ti-wallet" style="font-size: 18px;"></i>
                <span>{i18n.t('earnings.withdraw')}</span>
            </button>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-icon" style="background: #e6f9d4; color: #58cc02;"><i class="ti ti-microphone"></i></div>
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
                            <div style="font-size: 13px; font-weight: 900; color: {tx.amount.startsWith('+') ? '#58cc02' : '#ff4b4b'};">{tx.amount}</div>
                            <div style="font-size: 9px; font-weight: 800; color: #afafaf; text-transform: uppercase;">{tx.status}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

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
        background: linear-gradient(135deg, #ff9600, #ff5e00);
        border-radius: 24px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: 0 10px 20px rgba(255, 150, 0, 0.2);
        margin-bottom: 24px;
    }
    .withdraw-btn {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        padding: 12px;
        border-radius: 16px;
        color: #fff;
        font-weight: 900;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .withdraw-btn:active { transform: scale(0.98); background: rgba(255,255,255,0.3); }

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
