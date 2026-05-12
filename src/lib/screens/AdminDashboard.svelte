<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    let activeTab = $state('overview');

    // Sparkline data (last 7 days)
    const submissionData = [42, 67, 55, 80, 73, 91, 88];
    const revenueData = [1.2, 1.8, 1.5, 2.1, 1.9, 2.6, 2.4];
    const activeUserData = [60, 78, 65, 82, 74, 85, 91];

    function sparklinePath(data, w = 80, h = 32) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const pts = data.map((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / range) * h;
            return `${x},${y}`;
        });
        return `M ${pts.join(' L ')}`;
    }

    function sparklineFill(data, w = 80, h = 32) {
        const path = sparklinePath(data, w, h);
        return `${path} L ${w},${h} L 0,${h} Z`;
    }

    // Donut chart helper
    function donutPath(pct, r = 20, cx = 24, cy = 24) {
        const circ = 2 * Math.PI * r;
        const dash = (pct / 100) * circ;
        return { dasharray: `${dash} ${circ}`, offset: circ * 0.25 };
    }

    const completionDonut = donutPath(72);
    const retentionDonut = donutPath(88);

    // Bar chart data (monthly submissions, last 6 months)
    const monthlyBars = [
        { label: 'Nov', val: 62 },
        { label: 'Des', val: 74 },
        { label: 'Jan', val: 58 },
        { label: 'Feb', val: 81 },
        { label: 'Mar', val: 93 },
        { label: 'Apr', val: 88 },
    ];
    const barMax = Math.max(...monthlyBars.map(b => b.val));

    const topMusyrif = [
        { name: 'Ust. Malik', sessions: 142, rating: 4.9, trend: '+8%' },
        { name: 'Ust. Hanafi', sessions: 118, rating: 4.8, trend: '+5%' },
        { name: 'Ust. Yusuf', sessions: 97, rating: 4.7, trend: '+12%' },
    ];

    const alerts = [
        { icon: '⚠️', text: '14 santri tidak ada submisi >7 hari', color: '#ef4444', bg: '#fef2f2' },
        { icon: '📉', text: '3 musyrif tingkat penerimaan rendah', color: '#f59e0b', bg: '#fffbeb' },
        { icon: '🎉', text: 'Rekor harian baru kemarin: 342 sesi', color: '#22c55e', bg: '#f0fdf4' },
    ];
</script>

<div class="screen">
    <!-- Header -->
    <div class="topbar" style="background: var(--admin-purple); color: #fff; border-bottom: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">🛡️</span>
            <div>
                <div style="font-size: 13px; font-weight: 900; letter-spacing: -0.3px;">Admin Dashboard</div>
                <div style="font-size: 9px; font-weight: 700; opacity: 0.7; text-transform: uppercase;">QuranMemo Analytics</div>
            </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <div class="live-badge">
                <span class="live-dot"></span>LIVE
            </div>
            <button class="icon-btn-white">
                <i class="ti ti-bell"></i>
                <span class="notif-dot"></span>
            </button>
        </div>
    </div>

    <!-- Tab Nav -->
    <div class="tab-nav">
        {#each [['overview','📊','Ikhtisar'], ['users','👥','Pengguna'], ['musyrif','👳','Musyrif']] as [id, icon, label]}
            <button
                class="tab-btn"
                class:active={activeTab === id}
                onclick={() => activeTab = id}
            >
                {icon} {label}
            </button>
        {/each}
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 14px; padding-bottom: 24px; gap: 12px; display: flex; flex-direction: column;">

        {#if activeTab === 'overview'}
            <!-- KPI Row -->
            <div class="kpi-row">
                {#each [
                    { label: 'Total Santri', val: '1.240', change: '+34', up: true, data: activeUserData, color: '#7c5cfc' },
                    { label: 'Sesi Hari Ini', val: '342', change: '+18%', up: true, data: submissionData, color: '#58cc02' },
                    { label: 'Revenue/Bln', val: '12.4jt', change: '+12%', up: true, data: revenueData, color: '#ff9600' },
                ] as kpi}
                    <div class="kpi-card">
                        <div class="kpi-label">{kpi.label}</div>
                        <div class="kpi-val" style="color: {kpi.color}">{kpi.val}</div>
                        <svg width="80" height="32" viewBox="0 0 80 32" style="display: block; margin: 4px 0;">
                            <defs>
                                <linearGradient id="grad-{kpi.color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="{kpi.color}" stop-opacity="0.25"/>
                                    <stop offset="100%" stop-color="{kpi.color}" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d={sparklineFill(kpi.data)} fill="url(#grad-{kpi.color.replace('#','')})" />
                            <path d={sparklinePath(kpi.data)} fill="none" stroke="{kpi.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div class="kpi-change" style="color: {kpi.up ? '#22c55e' : '#ef4444'}">
                            <i class="ti ti-trending-{kpi.up ? 'up' : 'down'}" style="font-size: 9px;"></i>
                            {kpi.change} vs kemarin
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Alerts -->
            <div class="section-label">🔔 Notifikasi Penting</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                {#each alerts as a}
                    <div class="alert-row" style="background: {a.bg}; border-color: {a.color}20;">
                        <span style="font-size: 16px;">{a.icon}</span>
                        <span class="alert-text" style="color: {a.color}">{a.text}</span>
                        <i class="ti ti-chevron-right" style="color: {a.color}; font-size: 12px; flex-shrink: 0;"></i>
                    </div>
                {/each}
            </div>

            <!-- Monthly Bar Chart -->
            <div class="section-label">📈 Submisi per Bulan</div>
            <div class="chart-card">
                <div class="bar-chart">
                    {#each monthlyBars as bar}
                        <div class="bar-col">
                            <div class="bar-value">{bar.val}</div>
                            <div class="bar-track">
                                <div
                                    class="bar-fill"
                                    style="height: {(bar.val / barMax) * 100}%; background: var(--admin-purple);"
                                ></div>
                            </div>
                            <div class="bar-label">{bar.label}</div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Donut Section -->
            <div class="section-label">🎯 Tingkat Keberhasilan</div>
            <div class="donut-row">
                {#each [
                    { label: 'Penyelesaian Program', pct: 72, color: '#7c5cfc', donut: completionDonut },
                    { label: 'Retensi 30 Hari', pct: 88, color: '#58cc02', donut: retentionDonut },
                ] as d}
                    <div class="donut-card">
                        <svg width="56" height="56" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#f0f0f0" stroke-width="6"/>
                            <circle
                                cx="24" cy="24" r="20"
                                fill="none"
                                stroke="{d.color}"
                                stroke-width="6"
                                stroke-linecap="round"
                                stroke-dasharray="{d.donut.dasharray}"
                                stroke-dashoffset="-{d.donut.offset}"
                            />
                            <text x="24" y="28" text-anchor="middle" font-size="9" font-weight="900" fill="{d.color}">{d.pct}%</text>
                        </svg>
                        <div class="donut-label">{d.label}</div>
                    </div>
                {/each}
            </div>

        {:else if activeTab === 'users'}
            <!-- User Analytics Tab -->
            <div class="stat-banner" style="background: #ede8ff;">
                <div class="stat-banner-row">
                    {#each [
                        { icon: '👥', label: 'Total', val: '1.240', color: '#7c5cfc' },
                        { icon: '🟢', label: 'Aktif Skrg', val: '85', color: '#22c55e' },
                        { icon: '🆕', label: 'Baru Bulan Ini', val: '56', color: '#3b82f6' },
                        { icon: '⚠️', label: 'Butuh Perhatian', val: '14', color: '#ef4444' },
                    ] as s}
                        <div class="stat-cell">
                            <div style="font-size: 16px;">{s.icon}</div>
                            <div class="stat-cell-val" style="color: {s.color}">{s.val}</div>
                            <div class="stat-cell-label">{s.label}</div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="section-label">⏰ Aktivitas 7 Hari Terakhir</div>
            <div class="chart-card">
                <div style="display: flex; align-items: flex-end; gap: 2px; height: 60px; padding: 0 4px;">
                    {#each activeUserData as v, i}
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;">
                            <div style="width: 100%; border-radius: 4px 4px 0 0; background: {i === 6 ? '#7c5cfc' : '#ede8ff'}; height: {(v / Math.max(...activeUserData)) * 56}px;"></div>
                        </div>
                    {/each}
                </div>
                <div style="display: flex; justify-content: space-between; padding: 4px 4px 0; font-size: 8px; font-weight: 700; color: #afafaf; text-transform: uppercase;">
                    {#each ['Sen','Sel','Rab','Kam','Jum','Sab','Min'] as d}
                        <span>{d}</span>
                    {/each}
                </div>
            </div>

            <div class="section-label">📉 Perlu Ditindak</div>
            {#each [
                { name: 'Budi Santoso', info: 'Streak putus · Terakhir aktif 8 hari lalu', icon: '📉', tag: 'RISIKO TINGGI', tagColor: '#ef4444', tagBg: '#fef2f2' },
                { name: 'Siti Aminah', info: 'Tidak ada submisi minggu ini', icon: '⏳', tag: 'PERLU REMIND', tagColor: '#f59e0b', tagBg: '#fffbeb' },
                { name: 'Andi Saputra', info: 'Akun tidak aktif 14 hari', icon: '🔕', tag: 'TIDAK AKTIF', tagColor: '#64748b', tagBg: '#f1f5f9' },
            ] as u}
                <div class="user-row-card">
                    <div class="user-avatar" style="background: #ede8ff;">{u.icon}</div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="user-row-name">{u.name}</div>
                        <div class="user-row-info">{u.info}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;">
                        <span class="tag" style="color: {u.tagColor}; background: {u.tagBg};">{u.tag}</span>
                        <button class="mini-btn" style="background: var(--admin-purple); color: #fff;">Hubungi</button>
                    </div>
                </div>
            {/each}

            <div class="section-label">🏆 Santri Terbaik Bulan Ini</div>
            {#each [
                { rank: 1, name: 'Ahmad Habibi', sesi: 48, ayat: 180, medal: '🥇' },
                { rank: 2, name: 'Fatimah Zahra', sesi: 41, ayat: 156, medal: '🥈' },
                { rank: 3, name: 'Muhammad Rizki', sesi: 37, ayat: 142, medal: '🥉' },
            ] as s}
                <div class="user-row-card">
                    <div style="font-size: 22px; width: 32px; text-align: center;">{s.medal}</div>
                    <div style="flex: 1;">
                        <div class="user-row-name">{s.name}</div>
                        <div class="user-row-info">{s.sesi} sesi · {s.ayat} ayat dihafal</div>
                    </div>
                    <div class="progress-pill">{s.sesi} sesi</div>
                </div>
            {/each}

        {:else if activeTab === 'musyrif'}
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
            <div class="section-label">🔴 Status Live</div>
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

            <div class="section-label">🏅 Performa Musyrif</div>
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

            <div class="section-label">⚠️ Perlu Evaluasi</div>
            <div class="warn-card">
                <div class="warn-icon">📉</div>
                <div style="flex: 1;">
                    <div class="user-row-name">Ust. Ridwan</div>
                    <div class="user-row-info">Rating turun ke 3.9 · 4 komplain bulan ini</div>
                </div>
                <button class="mini-btn" style="background: #ef4444; color: #fff;">Review</button>
            </div>
        {/if}

    </div>
</div>

<style>
    /* ======= TOPBAR ======= */
    .topbar {
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .live-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255,255,255,0.2);
        color: #fff;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1px;
        padding: 4px 8px;
        border-radius: 20px;
    }
    .live-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ef4444;
        animation: pulse-dot 1.2s infinite;
        flex-shrink: 0;
    }
    @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    .icon-btn-white {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        position: relative;
    }
    .notif-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 7px;
        height: 7px;
        background: #ef4444;
        border-radius: 50%;
        border: 1.5px solid #7c5cfc;
    }

    /* ======= TABS ======= */
    .tab-nav {
        display: flex;
        border-bottom: 2px solid #f0f0f0;
        background: #fff;
    }
    .tab-btn {
        flex: 1;
        background: none;
        border: none;
        font-family: 'Nunito', sans-serif;
        font-size: 10px;
        font-weight: 800;
        color: #afafaf;
        padding: 10px 4px;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }
    .tab-btn.active {
        color: var(--admin-purple);
        border-bottom-color: var(--admin-purple);
    }

    /* ======= KPI ======= */
    .kpi-row {
        display: flex;
        gap: 8px;
    }
    .kpi-card {
        flex: 1;
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 14px;
        padding: 10px 10px 8px;
    }
    .kpi-label {
        font-size: 8px;
        font-weight: 800;
        color: #afafaf;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .kpi-val {
        font-size: 17px;
        font-weight: 900;
        line-height: 1.1;
        margin-top: 2px;
    }
    .kpi-change {
        font-size: 8px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 2px;
    }

    /* ======= ALERTS ======= */
    .alert-row {
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 10px;
        border: 1.5px solid;
        padding: 10px 12px;
    }
    .alert-text {
        flex: 1;
        font-size: 10px;
        font-weight: 800;
    }

    /* ======= BAR CHART ======= */
    .chart-card {
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 14px;
        padding: 12px;
    }
    .bar-chart {
        display: flex;
        align-items: flex-end;
        gap: 6px;
        height: 80px;
    }
    .bar-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        gap: 2px;
    }
    .bar-track {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: flex-end;
    }
    .bar-fill {
        width: 100%;
        border-radius: 4px 4px 0 0;
        min-height: 4px;
        transition: height 0.3s;
    }
    .bar-value {
        font-size: 7px;
        font-weight: 800;
        color: #afafaf;
    }
    .bar-label {
        font-size: 8px;
        font-weight: 800;
        color: #afafaf;
    }

    /* ======= DONUT ======= */
    .donut-row {
        display: flex;
        gap: 10px;
    }
    .donut-card {
        flex: 1;
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 14px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .donut-label {
        font-size: 10px;
        font-weight: 800;
        color: #1e293b;
        flex: 1;
        line-height: 1.3;
    }

    /* ======= USER TAB ======= */
    .stat-banner {
        border-radius: 14px;
        padding: 12px;
        border: 2px solid #ede8ff;
    }
    .stat-banner-row {
        display: flex;
        justify-content: space-between;
    }
    .stat-cell {
        text-align: center;
        flex: 1;
    }
    .stat-cell-val {
        font-size: 16px;
        font-weight: 900;
    }
    .stat-cell-label {
        font-size: 8px;
        font-weight: 800;
        color: #64748b;
        text-transform: uppercase;
    }
    .user-row-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
    }
    .user-row-name {
        font-size: 12px;
        font-weight: 800;
        color: #1e293b;
    }
    .user-row-info {
        font-size: 9px;
        font-weight: 700;
        color: #64748b;
        margin-top: 1px;
    }
    .tag {
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 0.5px;
        padding: 2px 6px;
        border-radius: 6px;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .mini-btn {
        font-family: 'Nunito', sans-serif;
        font-size: 9px;
        font-weight: 900;
        border: none;
        border-radius: 8px;
        padding: 5px 10px;
        cursor: pointer;
        white-space: nowrap;
    }
    .progress-pill {
        background: #ede8ff;
        color: var(--admin-purple);
        font-size: 9px;
        font-weight: 900;
        padding: 4px 8px;
        border-radius: 8px;
    }

    /* ======= MUSYRIF TAB ======= */
    .revenue-hero {
        background: var(--admin-purple);
        border-radius: 16px;
        padding: 16px;
        color: #fff;
        box-shadow: 0 8px 24px rgba(124, 92, 252, 0.25);
    }
    .revenue-label {
        font-size: 9px;
        font-weight: 900;
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .revenue-val {
        font-size: 26px;
        font-weight: 900;
        margin: 4px 0 2px;
        letter-spacing: -1px;
    }
    .revenue-change {
        font-size: 10px;
        font-weight: 800;
        color: #86efac;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 12px;
    }
    .revenue-sub-row {
        display: flex;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.2);
    }
    .revenue-sub {
        flex: 1;
        text-align: center;
    }
    .live-grid {
        display: flex;
        gap: 8px;
    }
    .live-stat-card {
        flex: 1;
        border: 2px solid;
        border-radius: 12px;
        padding: 10px;
        text-align: center;
    }
    .musyrif-perf-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .rank-badge {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 900;
        flex-shrink: 0;
    }
    .musyrif-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #ede8ff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
    }
    .perf-bar-track {
        height: 4px;
        background: #f0f0f0;
        border-radius: 4px;
        margin-top: 5px;
        overflow: hidden;
    }
    .perf-bar-fill {
        height: 100%;
        border-radius: 4px;
    }
    .trend-badge {
        font-size: 9px;
        font-weight: 900;
        padding: 4px 8px;
        border-radius: 8px;
        flex-shrink: 0;
    }
    .warn-card {
        background: #fff;
        border: 2px solid #fecaca;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .warn-icon {
        font-size: 22px;
        flex-shrink: 0;
    }
</style>