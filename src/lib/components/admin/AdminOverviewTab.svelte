<script>
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

    function donutPath(pct, r = 20, cx = 24, cy = 24) {
        const circ = 2 * Math.PI * r;
        const dash = (pct / 100) * circ;
        return { dasharray: `${dash} ${circ}`, offset: circ * 0.25 };
    }

    const completionDonut = donutPath(72);
    const retentionDonut = donutPath(88);

    const monthlyBars = [
        { label: 'Nov', val: 62 },
        { label: 'Des', val: 74 },
        { label: 'Jan', val: 58 },
        { label: 'Feb', val: 81 },
        { label: 'Mar', val: 93 },
        { label: 'Apr', val: 88 },
    ];
    const barMax = Math.max(...monthlyBars.map(b => b.val));

    const alerts = [
        { icon: '⚠️', text: '14 santri tidak ada submisi >7 hari', color: '#ef4444', bg: '#fef2f2' },
        { icon: '📉', text: '3 musyrif tingkat penerimaan rendah', color: '#f59e0b', bg: '#fffbeb' },
        { icon: '🎉', text: 'Rekor harian baru kemarin: 342 sesi', color: '#22c55e', bg: '#f0fdf4' },
    ];
</script>

<!-- KPI Row -->
<div class="kpi-row">
    {#each [
        { label: 'Total Santri', val: '1.240', change: '+34', up: true, data: activeUserData, color: '#7c5cfc' },
        { label: 'Sesi Hari Ini', val: '342', change: '+18%', up: true, data: submissionData, color: '#00978A' },
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
<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 8px; margin-bottom: 8px;">🔔 Notifikasi Penting</div>
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
<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">📈 Submisi per Bulan</div>
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
<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">🎯 Tingkat Keberhasilan</div>
<div class="donut-row">
    {#each [
        { label: 'Penyelesaian Program', pct: 72, color: '#7c5cfc', donut: completionDonut },
        { label: 'Retensi 30 Hari', pct: 88, color: '#00978A', donut: retentionDonut },
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

<style>
    .kpi-row { display: flex; gap: 8px; }
    .kpi-card { flex: 1; background: #fff; border: 2px solid #e5e5e5; border-radius: 14px; padding: 10px 10px 8px; }
    .kpi-label { font-size: 8px; font-weight: 800; color: #afafaf; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-val { font-size: 17px; font-weight: 900; line-height: 1.1; margin-top: 2px; }
    .kpi-change { font-size: 8px; font-weight: 800; display: flex; align-items: center; gap: 2px; }

    .alert-row { display: flex; align-items: center; gap: 8px; border-radius: 10px; border: 1.5px solid; padding: 10px 12px; }
    .alert-text { flex: 1; font-size: 10px; font-weight: 800; }

    .chart-card { background: #fafafa; border: 2px solid #e5e5e5; border-radius: 14px; padding: 12px; }
    .bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 2px; }
    .bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; }
    .bar-fill { width: 100%; border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.3s; }
    .bar-value { font-size: 7px; font-weight: 800; color: #afafaf; }
    .bar-label { font-size: 8px; font-weight: 800; color: #afafaf; }

    .donut-row { display: flex; gap: 10px; }
    .donut-card { flex: 1; background: #fff; border: 2px solid #e5e5e5; border-radius: 14px; padding: 12px; display: flex; align-items: center; gap: 10px; }
    .donut-label { font-size: 10px; font-weight: 800; color: #1e293b; flex: 1; line-height: 1.3; }
</style>
