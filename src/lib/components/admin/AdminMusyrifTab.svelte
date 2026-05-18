<script>
    const topMusyrif = [
        { name: 'Ust. Malik', sessions: 142, rating: 4.9, trend: '+8%' },
        { name: 'Ust. Hanafi', sessions: 118, rating: 4.8, trend: '+5%' },
        { name: 'Ust. Yusuf', sessions: 97, rating: 4.7, trend: '+12%' },
    ];
</script>

<!-- Musyrif Analytics Tab -->
<div class="revenue-hero">
    <div class="revenue-label">PENDAPATAN BULAN INI</div>
    <div class="revenue-val">Rp 12.450.000</div>
    <div class="revenue-change">
        <i class="ti ti-trending-up"></i> +12% dari bulan lalu
    </div>
    <div class="revenue-sub-row">
        <div class="revenue-sub">
            <div style="font-size: 9px; opacity: 0.7; text-transform: uppercase;">Total Sesi</div>
            <div style="font-size: 15px; font-weight: 900;">1.847</div>
        </div>
        <div style="width: 1px; background: rgba(255,255,255,0.2);"></div>
        <div class="revenue-sub">
            <div style="font-size: 9px; opacity: 0.7; text-transform: uppercase;">Aktif Musyrif</div>
            <div style="font-size: 15px; font-weight: 900;">18</div>
        </div>
        <div style="width: 1px; background: rgba(255,255,255,0.2);"></div>
        <div class="revenue-sub">
            <div style="font-size: 9px; opacity: 0.7; text-transform: uppercase;">Rata-Rata Rating</div>
            <div style="font-size: 15px; font-weight: 900;">4.8 ★</div>
        </div>
    </div>
</div>

<!-- Live status -->
<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">🔴 Status Live</div>
<div class="live-grid">
    <div class="live-stat-card" style="border-color: #22c55e30; background: #f0fdf4;">
        <div style="font-size: 22px; font-weight: 900; color: #22c55e;">6</div>
        <div style="font-size: 9px; font-weight: 800; color: #166534; text-transform: uppercase;">Online Sekarang</div>
    </div>
    <div class="live-stat-card" style="border-color: #3b82f630; background: #eff6ff;">
        <div style="font-size: 22px; font-weight: 900; color: #3b82f6;">4</div>
        <div style="font-size: 9px; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">Sedang Menandai</div>
    </div>
    <div class="live-stat-card" style="border-color: #f59e0b30; background: #fffbeb;">
        <div style="font-size: 22px; font-weight: 900; color: #f59e0b;">2</div>
        <div style="font-size: 9px; font-weight: 800; color: #92400e; text-transform: uppercase;">Menunggu Santri</div>
    </div>
</div>

<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">🏅 Performa Musyrif</div>
{#each topMusyrif as m, i}
    <div class="musyrif-perf-card">
        <div class="rank-badge" style="background: {i === 0 ? '#fef08a' : i === 1 ? '#e2e8f0' : '#fed7aa'}; color: {i === 0 ? '#854d0e' : i === 1 ? '#475569' : '#7c2d12'};">
            #{i + 1}
        </div>
        <div class="musyrif-avatar">👳</div>
        <div style="flex: 1; min-width: 0;">
            <div class="user-row-name">{m.name}</div>
            <div class="user-row-info">{m.sessions} sesi · ★ {m.rating}</div>
            <div class="perf-bar-track">
                <div class="perf-bar-fill" style="width: {(m.sessions / 150) * 100}%; background: var(--admin-purple);"></div>
            </div>
        </div>
        <div class="trend-badge" style="color: #22c55e; background: #f0fdf4;">{m.trend}</div>
    </div>
{/each}

<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">⚠️ Perlu Evaluasi</div>
<div class="warn-card">
    <div class="warn-icon">📉</div>
    <div style="flex: 1;">
        <div class="user-row-name">Ust. Ridwan</div>
        <div class="user-row-info">Rating turun ke 3.9 · 4 komplain bulan ini</div>
    </div>
    <button class="mini-btn" style="background: #ef4444; color: #fff;">Review</button>
</div>

<style>
    .revenue-hero { background: var(--admin-purple); border-radius: 16px; padding: 16px; color: #fff; box-shadow: 0 8px 24px rgba(124, 92, 252, 0.25); }
    .revenue-label { font-size: 9px; font-weight: 900; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
    .revenue-val { font-size: 26px; font-weight: 900; margin: 4px 0 2px; letter-spacing: -1px; }
    .revenue-change { font-size: 10px; font-weight: 800; color: #86efac; display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
    .revenue-sub-row { display: flex; gap: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); }
    .revenue-sub { flex: 1; text-align: center; }

    .live-grid { display: flex; gap: 8px; }
    .live-stat-card { flex: 1; border: 2px solid; border-radius: 12px; padding: 10px; text-align: center; }
    
    .musyrif-perf-card { background: #fff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .rank-badge { width: 24px; height: 24px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; flex-shrink: 0; }
    .musyrif-avatar { width: 36px; height: 36px; border-radius: 50%; background: #ede8ff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .perf-bar-track { height: 4px; background: #f0f0f0; border-radius: 4px; margin-top: 5px; overflow: hidden; }
    .perf-bar-fill { height: 100%; border-radius: 4px; }
    .trend-badge { font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 8px; flex-shrink: 0; }
    
    .user-row-name { font-size: 12px; font-weight: 800; color: #1e293b; }
    .user-row-info { font-size: 9px; font-weight: 700; color: #64748b; margin-top: 1px; }

    .warn-card { background: #fff; border: 2px solid #fecaca; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; }
    .warn-icon { font-size: 22px; flex-shrink: 0; }
    .mini-btn { font-family: 'Nunito', sans-serif; font-size: 9px; font-weight: 900; border: none; border-radius: 8px; padding: 5px 10px; cursor: pointer; white-space: nowrap; }
</style>
