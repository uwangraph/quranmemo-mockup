<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    let { mistakeStats } = $props();
</script>

<div class="analytics-view">
    <div class="analytics-header">
        <div class="success-icon">🏆</div>
        <h1 style="font-size: 24px; font-weight: 900; color: #3c3c3c; margin: 16px 0 4px;">{i18n.t('marking.session_report')}</h1>
        <p style="font-size: 14px; font-weight: 700; color: #afafaf;">Ahmad Hafidz • Al-Mulk: 12</p>
    </div>

    <div class="stats-grid-analytics">
        <div class="stat-card-big">
            <div class="stat-label-top">{i18n.t('marking.total_mistakes')}</div>
            <div class="stat-value">{mistakeStats.total}</div>
        </div>
        <div class="stat-card-big">
            <div class="stat-label-top">{i18n.t('marking.duration')}</div>
            <div class="stat-value">4:20</div>
            <div class="stat-unit">{i18n.t('marking.minutes')}</div>
        </div>
    </div>

    <div class="breakdown-section">
        <div class="section-label" style="padding: 0; margin-bottom: 12px; font-size: 13px; font-weight: 800; color: #3c3c3c; text-transform: uppercase;">{i18n.t('marking.summary')}</div>
        <div class="breakdown-list">
            <div class="breakdown-item">
                <div class="dot forget"></div>
                <div style="flex: 1; font-weight: 800;">{i18n.t('marking.type_forget')}</div>
                <div class="count">{mistakeStats.forget}</div>
            </div>
            <div class="breakdown-item">
                <div class="dot tajwid"></div>
                <div style="flex: 1; font-weight: 800;">{i18n.t('marking.type_tajwid')}</div>
                <div class="count">{mistakeStats.tajwid}</div>
            </div>
            <div class="breakdown-item">
                <div class="dot makhraj"></div>
                <div style="flex: 1; font-weight: 800;">{i18n.t('marking.type_makhraj')}</div>
                <div class="count">{mistakeStats.makhraj}</div>
            </div>
        </div>
    </div>

    <div style="margin-top: auto; padding-top: 24px;">
        <button class="btn-duo btn-green" style="width: 100%" onclick={() => appState.go('musyrif')}>
            {i18n.t('marking.back_to_dashboard')}
        </button>
    </div>
</div>

<style>
    .analytics-view { padding: 40px 24px; display: flex; flex-direction: column; height: 100%; text-align: center; }
    .analytics-header { margin-bottom: 32px; }
    .success-icon { font-size: 80px; margin-bottom: 8px; }
    .stats-grid-analytics { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .stat-card-big { background: #f7f7f7; border: 2px solid #e5e5e5; border-radius: 20px; padding: 20px; }
    .stat-label-top { font-size: 10px; font-weight: 800; color: #afafaf; text-transform: uppercase; margin-bottom: 4px;}
    .stat-value { font-size: 28px; font-weight: 900; color: #3c3c3c; }
    .stat-unit { font-size: 10px; font-weight: 800; color: #afafaf; }
    .breakdown-list { background: #fff; border: 2px solid #e5e5e5; border-radius: 20px; padding: 8px; text-align: left; }
    .breakdown-item { display: flex; align-items: center; gap: 12px; padding: 12px; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    .breakdown-item:last-child { border-bottom: none; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.forget { background: #ff4b4b; }
    .dot.tajwid { background: #ff9600; }
    .dot.makhraj { background: #1cb0f6; }
    .count { font-weight: 900; color: #3c3c3c; }
</style>
