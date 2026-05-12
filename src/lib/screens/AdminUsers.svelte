<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
</script>

<div class="screen">
    <div class="topbar">
        <div style="font-size: 15px; font-weight: 900;">{i18n.t('admin.monitor_user')}</div>
    </div>
    
    <div class="scroll-content" style="padding: 16px;">
        <div class="stats-overview">
            <div class="stat-item">
                <div class="stat-val">1.240</div>
                <div class="stat-label">{i18n.t('admin.total_user')}</div>
            </div>
            <div class="stat-item border-x">
                <div class="stat-val" style="color: #23a100;">85</div>
                <div class="stat-label">{i18n.t('admin.active_now')}</div>
            </div>
            <div class="stat-item">
                <div class="stat-val" style="color: var(--admin-purple);">342</div>
                <div class="stat-label">{i18n.t('admin.submission_today')}</div>
            </div>
        </div>

        <div class="section-label">{i18n.t('admin.user_attention')}</div>
        <div class="user-list">
            <div class="user-card warning">
                <div class="user-icon" style="background: #ede8ff;">📉</div>
                <div style="flex: 1;">
                    <div class="user-name">Budi Santoso</div>
                    <div class="user-status" style="color: #ef4444;">{i18n.t('admin.streak_broken')}</div>
                </div>
                <button class="btn-duo btn-purple small-btn">{i18n.t('admin.contact')}</button>
            </div>
            
            <div class="user-card warning">
                <div class="user-icon" style="background: #ede8ff;">⏳</div>
                <div style="flex: 1;">
                    <div class="user-name">Siti Aminah</div>
                    <div class="user-status" style="color: #a16207;">{i18n.t('admin.no_submission_week')}</div>
                </div>
                <button class="btn-duo btn-purple small-btn">{i18n.t('admin.remind')}</button>
            </div>
        </div>
    </div>
</div>

<style>
    .stats-overview {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
    }
    .stat-item {
        text-align: center;
        flex: 1;
    }
    .btn-purple {
        background: var(--admin-purple);
        color: #fff;
        border-bottom: 4px solid #5d42cc;
    }
    .btn-purple:active {
        border-bottom: 0;
        transform: translateY(4px);
    }
    .border-x {
        border-left: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
    }
    .stat-val {
        font-size: 18px;
        font-weight: 900;
        color: #1e293b;
    }
    .stat-label {
        font-size: 9px;
        font-weight: 800;
        color: #64748b;
        text-transform: uppercase;
    }
    .user-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .user-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .user-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
    .user-name {
        font-size: 13px;
        font-weight: 800;
    }
    .user-status {
        font-size: 10px;
        font-weight: 700;
    }
    .small-btn {
        width: auto;
        padding: 6px 12px;
        font-size: 10px;
    }
</style>
