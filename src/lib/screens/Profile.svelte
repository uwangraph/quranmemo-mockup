<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n, locales } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const stats = $derived([
        { label: i18n.t('profile.total_xp'), val: "12,450", icon: "⚡", color: "#ff9600" },
        { label: i18n.t('profile.hafalan'), val: "2 Juz", icon: "📖", color: "#58cc02" },
        { label: i18n.t('profile.streak'), val: "7", icon: "🔥", color: "#ff4b4b" },
        { label: i18n.t('profile.liga'), val: "Safir", icon: "🏆", color: "#1cb0f6" },
    ]);
</script>

<div class="screen">
    <div class="topbar">
        <span style="font-size: 16px; font-weight: 900; color: #3c3c3c; flex: 1; text-align: center;">{i18n.t('profile.title')}</span>
        <button style="background:none; border:none; color:#afafaf;"><i class="ti ti-settings" style="font-size:20px;"></i></button>
    </div>

    <div class="scroll-content no-scrollbar">
        <div class="profile-header">
            <div class="avatar-large">👤</div>
            <div style="text-align: center; margin-top: 12px;">
                <div style="font-size: 20px; font-weight: 900; color: #3c3c3c;">Abdullah Irfan</div>
                <div style="font-size: 13px; font-weight: 700; color: #afafaf;">{i18n.t('profile.joined')}</div>
            </div>
        </div>

        <div class="section-label">{i18n.t('profile.settings')}</div>
        <div style="padding: 0 16px;">
            <button 
                class="settings-btn"
                onclick={() => appState.go('language')}
            >
                <div class="s-icon"><i class="ti ti-world"></i></div>
                <div style="flex: 1; text-align: left; font-size: 14px; font-weight: 800; color: #3c3c3c;">
                    {i18n.t('settings.language')}
                </div>
                <div style="font-size: 14px; font-weight: 800; color: #afafaf;">
                    {locales.find(l => l.code === i18n.locale)?.label} <i class="ti ti-chevron-right"></i>
                </div>
            </button>
        </div>

        <div class="stats-grid">
            {#each stats as s}
                <div class="stat-card">
                    <div style="font-size: 20px;">{s.icon}</div>
                    <div style="margin-top: 4px;">
                        <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">{s.val}</div>
                        <div style="font-size: 10px; font-weight: 800; color: #afafaf; text-transform: uppercase;">{s.label}</div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="section-label">{i18n.t('profile.wallet')}</div>
        <div class="wallet-section">
            <div class="wallet-card tickets">
                <div style="font-size: 24px;">🎟️</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">4 {i18n.t('profile.tickets')}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #afafaf;">{i18n.t('profile.valid_until')}</div>
                </div>
                <div style="font-size: 11px; font-weight: 800; color: #1cb0f6;">PREMIUM</div>
            </div>
            
            <div class="wallet-card coins">
                <div style="font-size: 24px;">💎</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">120 {i18n.t('profile.coins')}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #afafaf;">{i18n.t('profile.coins_desc')}</div>
                </div>
                <button class="buy-btn">{i18n.t('profile.buy')}</button>
            </div>
        </div>

        <div class="section-label">{i18n.t('profile.achievements')}</div>
        <div style="display:flex; gap:12px; padding:0 16px 20px; overflow-x:auto;" class="no-scrollbar">
            <div class="badge-icon">🎖️</div>
            <div class="badge-icon">🌟</div>
            <div class="badge-icon">🔥</div>
            <div class="badge-icon gray">🎓</div>
            <div class="badge-icon gray">🛡️</div>
        </div>
    </div>

    <BottomNav active="profile" />
</div>

<style>
    .settings-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 16px;
        border: 2px solid #e5e5e5;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s;
    }
    .settings-btn:active {
        transform: translateY(2px);
    }
    .s-icon {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: #f7f7f7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #1cb0f6;
    }
    .profile-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 20px;
        background: #fff;
    }
    .avatar-large {
        width: 100px;
        height: 100px;
        background: #f7f7f7;
        border: 4px solid #e5e5e5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
    }
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 0 16px;
        margin-top: 10px;
    }
    .stat-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .wallet-section {
        padding: 0 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .wallet-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 14px;
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .buy-btn {
        background: #ce82ff;
        color: #fff;
        border: none;
        border-bottom: 3px solid #a52adb;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 900;
    }
    .badge-icon {
        width: 60px;
        height: 60px;
        background: #fff7e6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        flex-shrink: 0;
        border: 2px solid #ffe4b3;
    }
    .badge-icon.gray {
        background: #f7f7f7;
        border-color: #e5e5e5;
        filter: grayscale(1);
        opacity: 0.5;
    }
</style>
