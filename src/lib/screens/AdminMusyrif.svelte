<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
</script>

<div class="screen">
    <div class="topbar">
        <div style="font-size: 15px; font-weight: 900;">{i18n.t('admin.monitor_musyrif')}</div>
    </div>
    
    <div class="scroll-content" style="padding: 16px;">
        <div class="revenue-card">
            <div class="revenue-label">{i18n.t('admin.revenue')}</div>
            <div class="revenue-value">Rp 12.450.000</div>
            <div class="revenue-change">+12% {i18n.t('admin.from_last_month')}</div>
        </div>

        <div class="section-label">{i18n.t('admin.musyrif_ready')}</div>
        <div class="musyrif-list">
            <div class="musyrif-card">
                <div class="avatar-wrap">
                    <div class="avatar"><i class="ti ti-chalkboard-teacher"></i></div>
                    <div class="status-indicator online"></div>
                </div>
                <div class="musyrif-info">
                    <div class="musyrif-name">Ust. Malik</div>
                    <div class="musyrif-activity">{i18n.t('admin.serving')}: Ahmad H. (Al-Mulk:12)</div>
                </div>
                <div class="rating">4.9 <i class="ti ti-star"></i></div>
            </div>
            
            <div class="musyrif-card">
                <div class="avatar-wrap">
                    <div class="avatar"><i class="ti ti-chalkboard-teacher"></i></div>
                    <div class="status-indicator online"></div>
                </div>
                <div class="musyrif-info">
                    <div class="musyrif-name">Ust. Hanafi</div>
                    <div class="musyrif-activity" style="color: #64748b;">{i18n.t('admin.idle_waiting')}</div>
                </div>
                <div class="rating">4.8 <i class="ti ti-star"></i></div>
            </div>
        </div>
    </div>
</div>

<style>
    .revenue-card {
        background: var(--admin-purple);
        color: #fff;
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 10px 20px rgba(124, 92, 252, 0.2);
    }
    .revenue-label {
        font-size: 11px;
        font-weight: 900;
        color: rgba(255,255,255,0.9);
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }
    .revenue-value {
        font-size: 24px;
        line-height: 1.15;
        font-weight: 900;
        color: #fff;
        margin: 5px 0;
    }
    .revenue-change {
        font-size: 10px;
        font-weight: 800;
        color: #bbf7d0;
    }
    .musyrif-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .musyrif-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .avatar-wrap {
        position: relative;
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ede8ff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
    .status-indicator {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 12px;
        height: 12px;
        border: 2px solid #fff;
        border-radius: 50%;
    }
    .status-indicator.online {
        background: #23a100;
    }
    .musyrif-name {
        font-size: 13px;
        font-weight: 800;
        color: #1e293b;
    }
    .musyrif-info {
        flex: 1;
        min-width: 0;
    }
    .musyrif-activity {
        font-size: 10px;
        color: #23a100;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .rating {
        font-size: 11px;
        font-weight: 800;
        color: #1e293b;
    }
</style>
