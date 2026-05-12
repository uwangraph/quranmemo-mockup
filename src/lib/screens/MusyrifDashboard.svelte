<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    let isAvailable = $state(true);
</script>

<div class="screen">
    <div class="musyrif-profile-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
            <div style="display: flex; align-items: center; gap: 16px">
                <div class="m-avatar-large">👳</div>
                <div>
                    <div style="font-size: 18px; font-weight: 900">Ustadz Malik</div>
                    <div class="tier-badge-gold">{i18n.t('musyrif.partner_tier')}</div>
                </div>
            </div>
            <div class="earnings-pill-mini" onclick={() => appState.go('musyrif-earnings')}>
                <div style="font-size: 14px; font-weight: 900">Rp 840.000</div>
                <div style="font-size: 9px; font-weight: 800; opacity: 0.7; text-transform: uppercase;">{i18n.t('musyrif.balance')}</div>
            </div>
        </div>
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 16px;">
        <div class="availability-card">
            <div>
                <div style="font-size: 14px; font-weight: 800; color: #3c3c3c">{i18n.t('musyrif.availability')}</div>
                <div style="font-size: 11px; font-weight: 700; color: #afafaf">{i18n.t('musyrif.availability_d')}</div>
            </div>
            <button 
                class="toggle-switch" 
                class:active={isAvailable}
                onclick={() => isAvailable = !isAvailable}
            >
                <div class="toggle-circle"></div>
            </button>
        </div>

        <div class="section-label">{i18n.t('musyrif.requests')}</div>
        
        {#if isAvailable}
            <div class="request-card">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #d7ffb2; display: flex; align-items: center; justify-content: center; font-size: 24px;">🧑‍🎓</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c">Ahmad Hafidz</div>
                    <div style="font-size: 11px; font-weight: 700; color: #58cc02">{i18n.t('admin.serving')}: Al-Mulk 12-16 ({i18n.t('market.tickets')})</div>
                </div>
                <button class="btn-duo btn-green" style="width: auto; padding: 10px 16px; font-size: 12px" onclick={() => appState.go('livemarking')}>
                    {i18n.t('musyrif.accept')}
                </button>
            </div>
        {:else}
            <div style="text-align: center; padding: 40px 20px; color: #afafaf;">
                <div style="font-size: 32px; margin-bottom: 12px;">😴</div>
                <div style="font-size: 13px; font-weight: 800;">{i18n.t('status.offline')}</div>
                <div style="font-size: 11px; font-weight: 700;">{i18n.t('musyrif.offline_msg')}</div>
            </div>
        {/if}

        <div class="section-label" style="margin-top: 16px">{i18n.t('musyrif.stats')}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <div class="stat-card">
                <div style="font-size: 20px; font-weight: 900; color: #3c3c3c">24</div>
                <div style="font-size: 10px; font-weight: 800; color: #afafaf">{i18n.t('musyrif.sessions_week')}</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 20px; font-weight: 900; color: #ffc800">4.9 ★</div>
                <div style="font-size: 10px; font-weight: 800; color: #afafaf">{i18n.t('musyrif.avg_rating')}</div>
            </div>
        </div>
    </div>
</div>

<style>
    .musyrif-profile-header {
        background: #1a1a1a;
        padding: 30px 20px 20px;
        color: #fff;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    }
    .m-avatar-large {
        width: 60px;
        height: 60px;
        border-radius: 20px;
        background: var(--duo-green);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        box-shadow: 0 4px 12px rgba(88, 204, 2, 0.3);
    }
    .tier-badge-gold {
        font-size: 10px;
        font-weight: 900;
        color: var(--duo-gold);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .earnings-pill-mini {
        background: rgba(255,255,255,0.1);
        padding: 10px 14px;
        border-radius: 16px;
        text-align: right;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .availability-card {
        background: #f1f5f9;
        border-radius: 20px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        border: 1px solid #e2e8f0;
    }
    .toggle-switch {
        width: 52px;
        height: 28px;
        background: #cbd5e1;
        border-radius: 100px;
        position: relative;
        cursor: pointer;
        border: none;
        transition: all 0.3s;
    }
    .toggle-switch.active { background: var(--duo-green); box-shadow: 0 0 15px rgba(88, 204, 2, 0.4); }
    .toggle-circle {
        width: 22px;
        height: 22px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        left: 3px;
        top: 3px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .toggle-switch.active .toggle-circle { transform: translateX(24px); }

    .request-card {
        background: #fff;
        border: 2px solid var(--duo-green);
        border-bottom-width: 5px;
        border-radius: 20px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        animation: pulse-green 2s infinite;
    }
    @keyframes pulse-green {
        0% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.4); }
        70% { box-shadow: 0 0 0 12px rgba(88, 204, 2, 0); }
        100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0); }
    }
    .stat-card {
        background: #fff;
        border: 2px solid var(--border-main);
        border-bottom-width: 4px;
        border-radius: 18px;
        padding: 16px;
        text-align: center;
    }
</style>
