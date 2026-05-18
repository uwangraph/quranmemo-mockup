<script>
    const activeUserData = [60, 78, 65, 82, 74, 85, 91];
</script>

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

<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">⏰ Aktivitas 7 Hari Terakhir</div>
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

<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">📉 Perlu Ditindak</div>
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

<div class="section-label" style="font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 16px; margin-bottom: 8px;">🏆 Santri Terbaik Bulan Ini</div>
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

<style>
    .stat-banner { border-radius: 14px; padding: 12px; border: 2px solid #ede8ff; }
    .stat-banner-row { display: flex; justify-content: space-between; }
    .stat-cell { text-align: center; flex: 1; }
    .stat-cell-val { font-size: 16px; font-weight: 900; }
    .stat-cell-label { font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; }

    .chart-card { background: #fafafa; border: 2px solid #e5e5e5; border-radius: 14px; padding: 12px; margin-bottom: 8px; }

    .user-row-card { background: #fff; border: 2px solid #e5e5e5; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .user-row-name { font-size: 12px; font-weight: 800; color: #1e293b; }
    .user-row-info { font-size: 9px; font-weight: 700; color: #64748b; margin-top: 1px; }
    
    .tag { font-size: 7px; font-weight: 900; letter-spacing: 0.5px; padding: 2px 6px; border-radius: 6px; text-transform: uppercase; white-space: nowrap; }
    .mini-btn { font-family: 'Nunito', sans-serif; font-size: 9px; font-weight: 900; border: none; border-radius: 8px; padding: 5px 10px; cursor: pointer; white-space: nowrap; }
    .progress-pill { background: #ede8ff; color: var(--admin-purple); font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 8px; }
</style>
