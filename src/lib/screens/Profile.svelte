<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n, locales } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const stats = [
        { label: "Total XP", val: "12,450", icon: "⚡", color: "#ff9600" },
        { label: "Hafalan", val: "2 Juz", icon: "📖", color: "#58cc02" },
        { label: "Streak", val: "7 Hari", icon: "🔥", color: "#ff4b4b" },
        { label: "Liga", val: "Safir", icon: "🏆", color: "#1cb0f6" },
    ];
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
                <div style="font-size: 13px; font-weight: 700; color: #afafaf;">Bergabung sejak Syawal 1446 H</div>
            </div>
        </div>

        <div class="section-label">{i18n.t('settings.language')}</div>
        <div style="display:flex; gap:10px; padding:0 16px; overflow-x:auto;" class="no-scrollbar">
            {#each locales as l}
                <button 
                    class="lang-btn" 
                    class:active={i18n.locale === l.code}
                    onclick={() => i18n.locale = l.code}
                >
                    <span style="font-size: 24px;">{l.flag}</span>
                    <span style="font-size: 10px; font-weight: 800;">{l.label}</span>
                </button>
            {/each}
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

        <div class="section-label">Dompet Hibrida</div>
        <div class="wallet-section">
            <div class="wallet-card tickets">
                <div style="font-size: 24px;">🎟️</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">4 Tiket Setoran</div>
                    <div style="font-size: 11px; font-weight: 700; color: #afafaf;">Berlaku hingga 30 Mei 2026</div>
                </div>
                <div style="font-size: 11px; font-weight: 800; color: #1cb0f6;">PREMIUM</div>
            </div>
            
            <div class="wallet-card coins">
                <div style="font-size: 24px;">💎</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">120 Koin Memo</div>
                    <div style="font-size: 11px; font-weight: 700; color: #afafaf;">Gunakan untuk setoran on-demand</div>
                </div>
                <button class="buy-btn">BELI</button>
            </div>
        </div>

        <div class="section-label">Pencapaian</div>
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
    .lang-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        background: #fff;
        color: #afafaf;
        cursor: pointer;
        min-width: 70px;
        transition: all 0.2s;
    }
    .lang-btn.active {
        border-color: #1cb0f6;
        background: #ddf4ff;
        color: #0898dc;
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
