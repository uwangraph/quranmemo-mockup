<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n, locales } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const stats = $derived([
        { label: i18n.t('profile.total_xp'), val: appState.user.xp.toLocaleString(), icon: "⚡", color: "#ff9600" },
        { label: i18n.t('profile.hafalan'), val: `${appState.user.progress.surah_094} Ayat`, icon: "📖", color: "#00978A" },
        { label: i18n.t('profile.streak'), val: appState.user.streak.toString(), icon: "🔥", color: "#ff4b4b" },
        { label: i18n.t('profile.liga'), val: i18n.t('league.sapphire'), icon: "🏆", color: "#1cb0f6" },
    ]);
</script>

<div class="screen">
    <div class="topbar">
        <span style="font-size: 16px; font-weight: 900; color: #3c3c3c; flex: 1; text-align: center;">{i18n.t('profile.title')}</span>
        <button style="background:none; border:none; color:#afafaf;"><i class="ti ti-settings" style="font-size:20px;"></i></button>
    </div>

    <div class="scroll-content no-scrollbar">
        <div class="profile-hero">
            <div class="avatar-container">
                <div class="avatar-large">👤</div>
                <button class="edit-avatar-btn"><i class="ti ti-camera"></i></button>
            </div>
            <div style="text-align: center; margin-top: 16px;">
                <div style="font-size: 22px; font-weight: 900; color: #3c3c3c;">{appState.user.name}</div>
                <div style="font-size: 13px; font-weight: 700; color: #afafaf;">{i18n.t('profile.joined')} 2024</div>
            </div>
        </div>

        <div class="section-label">Level & Preferensi Belajar</div>
        <div style="padding: 0 16px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            <!-- System Level Selector -->
            <div class="pref-card">
                <div class="pref-header">
                    <span class="pref-icon">🏆</span>
                    <div style="flex: 1">
                        <div class="pref-title">Sistem Leveling</div>
                        <div class="pref-desc">Pemula otomatis memunculkan Latin. Menengah/Mahir menyembunyikannya untuk memperkuat memori visual hafalanmu.</div>
                    </div>
                </div>
                
                <div class="level-tabs">
                    <button class="level-tab-btn" class:active={appState.user.level === 'pemula'} onclick={() => appState.setUserLevel('pemula')}>
                        Pemula
                    </button>
                    <button class="level-tab-btn" class:active={appState.user.level === 'menengah'} onclick={() => appState.setUserLevel('menengah')}>
                        Menengah
                    </button>
                    <button class="level-tab-btn" class:active={appState.user.level === 'mahir'} onclick={() => appState.setUserLevel('mahir')}>
                        Mahir
                    </button>
                </div>
            </div>

            <!-- Manual Toggle -->
            <div class="pref-card">
                <div class="pref-row">
                    <div style="flex: 1; padding-right: 12px;">
                        <div class="pref-label">Tampilkan Bacaan Latin</div>
                        <div class="pref-subtext">Kontrol transliterasi secara instan di setiap ayat soal.</div>
                    </div>
                    <button class="toggle-switch-btn" class:active={appState.user.showLatin} onclick={() => appState.toggleLatin()}>
                        <span class="switch-handle"></span>
                    </button>
                </div>
            </div>
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
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">1 {i18n.t('profile.tickets')}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #afafaf;">{i18n.t('profile.valid_until')}</div>
                </div>
                <div style="font-size: 11px; font-weight: 800; color: #1cb0f6;">PREMIUM</div>
            </div>
            
            <div class="wallet-card points">
                <div style="font-size: 24px;">⚡</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">300 {i18n.t('profile.points')}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #afafaf;">{i18n.t('profile.points_desc')}</div>
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
    .profile-hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 20px 30px;
        background: #fff;
    }
    .avatar-container {
        position: relative;
    }
    .avatar-large {
        width: 100px;
        height: 100px;
        background: #f7f7f7;
        border: 4px solid var(--border-main);
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
    }
    .edit-avatar-btn {
        position: absolute;
        bottom: -4px;
        right: -4px;
        width: 32px;
        height: 32px;
        background: var(--duo-blue);
        color: #fff;
        border: 2px solid #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
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

    /* Preference Cards Styling */
    .pref-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .pref-header {
        display: flex;
        gap: 12px;
        align-items: flex-start;
    }
    .pref-icon {
        font-size: 24px;
    }
    .pref-title {
        font-size: 14px;
        font-weight: 900;
        color: #3c3c3c;
    }
    .pref-desc {
        font-size: 11px;
        font-weight: 700;
        color: #888;
        line-height: 1.4;
        margin-top: 2px;
    }
    .level-tabs {
        display: flex;
        background: #f1f5f9;
        border-radius: 12px;
        padding: 4px;
        gap: 4px;
    }
    .level-tab-btn {
        flex: 1;
        background: none;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s;
    }
    .level-tab-btn.active {
        background: #fff;
        color: #00978a;
        box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .pref-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .pref-label {
        font-size: 13px;
        font-weight: 900;
        color: #3c3c3c;
    }
    .pref-subtext {
        font-size: 10px;
        font-weight: 700;
        color: #888;
        margin-top: 2px;
    }
    .toggle-switch-btn {
        width: 50px;
        height: 28px;
        background: #e2e8f0;
        border: none;
        border-radius: 99px;
        position: relative;
        cursor: pointer;
        transition: background 0.3s;
        padding: 0;
        flex-shrink: 0;
    }
    .toggle-switch-btn.active {
        background: #00978a;
    }
    .switch-handle {
        width: 22px;
        height: 22px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        top: 3px;
        left: 3px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .toggle-switch-btn.active .switch-handle {
        transform: translateX(22px);
    }
</style>
