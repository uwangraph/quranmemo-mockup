<script>
    import { i18n } from '$lib/i18n.svelte.js';
    const activeUserData = [60, 78, 65, 82, 74, 85, 91];
</script>

<!-- User Analytics Tab -->
<div class="stat-banner" style="background: #ede8ff;">
    <div class="stat-banner-row">
        {#each [
            { icon: 'ti-users-group', label: i18n.t('admin.total_user'), val: '1.240', color: '#7c5cfc' },
            { icon: 'ti-circle-dot', label: i18n.t('admin.active_now'), val: '85', color: '#22c55e' },
            { icon: 'ti-user-plus', label: i18n.t('admin.new_this_month'), val: '56', color: '#3b82f6' },
            { icon: 'ti-alert-triangle', label: i18n.t('admin.need_attention'), val: '14', color: '#ef4444' },
        ] as s}
            <div class="stat-cell">
                <div style="font-size: 16px;"><i class="ti {s.icon}"></i></div>
                <div class="stat-cell-val" style="color: {s.color}">{s.val}</div>
                <div class="stat-cell-label">{s.label}</div>
            </div>
        {/each}
    </div>
</div>

<div class="admin-section"><i class="ti ti-clock"></i> {i18n.t('admin.activity_7d')}</div>
<div class="chart-card">
    <div style="display: flex; align-items: flex-end; gap: 2px; height: 60px; padding: 0 4px;">
        {#each activeUserData as v, i}
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;">
                <div style="width: 100%; border-radius: 4px 4px 0 0; background: {i === 6 ? '#7c5cfc' : '#ede8ff'}; height: {(v / Math.max(...activeUserData)) * 56}px;"></div>
            </div>
        {/each}
    </div>
    <div style="display: flex; justify-content: space-between; padding: 4px 4px 0; font-size: 8px; font-weight: 700; color: #afafaf; text-transform: uppercase;">
        {#each ['mon','tue','wed','thu','fri','sat','sun'] as d}
            <span>{i18n.t(`profile.day_${d}`)}</span>
        {/each}
    </div>
</div>

<div class="admin-section"><i class="ti ti-trending-down"></i> {i18n.t('admin.need_action')}</div>
{#each [
    { name: 'Budi Santoso', info: i18n.t('admin.user_streak_broken', { days: 8 }), icon: 'ti-trending-down', tag: i18n.t('admin.tag_high_risk'), tagColor: '#ef4444', tagBg: '#fef2f2' },
    { name: 'Siti Aminah', info: i18n.t('admin.user_no_submission_week'), icon: 'ti-hourglass', tag: i18n.t('admin.tag_needs_reminder'), tagColor: '#f59e0b', tagBg: '#fffbeb' },
    { name: 'Andi Saputra', info: i18n.t('admin.user_inactive_days', { days: 14 }), icon: 'ti-bell-off', tag: i18n.t('admin.tag_inactive'), tagColor: '#64748b', tagBg: '#f1f5f9' },
] as u}
    <div class="user-row-card">
        <div class="user-avatar" style="background: #ede8ff;"><i class="ti {u.icon}"></i></div>
        <div style="flex: 1; min-width: 0;">
            <div class="user-row-name">{u.name}</div>
            <div class="user-row-info">{u.info}</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;">
            <span class="tag" style="color: {u.tagColor}; background: {u.tagBg};">{u.tag}</span>
            <button class="mini-btn" style="background: var(--admin-purple); color: #fff;">{i18n.t('admin.contact')}</button>
        </div>
    </div>
{/each}

<div class="admin-section"><i class="ti ti-trophy"></i> {i18n.t('admin.top_students')}</div>
{#each [
    { rank: 1, name: 'Ahmad Habibi', sesi: 48, ayat: 180, medal: 'medal' },
    { rank: 2, name: 'Fatimah Zahra', sesi: 41, ayat: 156, medal: 'medal' },
    { rank: 3, name: 'Muhammad Rizki', sesi: 37, ayat: 142, medal: 'medal' },
] as s}
    <div class="user-row-card">
        <div style="font-size: 22px; width: 32px; text-align: center;"><i class="ti ti-{s.medal}"></i></div>
        <div style="flex: 1;">
            <div class="user-row-name">{s.name}</div>
            <div class="user-row-info">{i18n.t('admin.sessions_verses', { sessions: s.sesi, verses: s.ayat })}</div>
        </div>
        <div class="progress-pill">{i18n.t('admin.sessions_count', { count: s.sesi })}</div>
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
