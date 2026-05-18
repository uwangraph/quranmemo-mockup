<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const musyrifs = $derived([
        { name: "Ust. Ahmad Fauzi", rating: 4.9, status: "online", price: 15, surah: "Short", tier: "bersanad", icon: "👳" },
        { name: "Ust. Ridwan Hakim", rating: 4.8, status: "online", price: 40, surah: "Medium", tier: "reguler", icon: "👨‍🏫" },
        { name: "Ustadzah Siti Aminah", rating: 5.0, status: "offline", price: 250, surah: "Long", tier: "bersanad", icon: "🧕" },
    ]);
</script>

<div class="screen">
    <div class="topbar wallet-header">
        <div class="wallet-pills">
            <div class="pill ticket-pill">
                <i class="ti ti-ticket"></i> <span>1</span>
            </div>
            <div class="pill point-pill">
                <i class="ti ti-bolt-filled"></i> <span>300</span>
            </div>
        </div>
        <button class="topup-btn">
            <i class="ti ti-plus"></i>
        </button>
    </div>

    <div class="scroll-content" style="padding: 0 16px;">
        <div class="hero-card">
            <div style="flex:1">
                <div style="font-size:18px; font-weight:900; color:#fff;">{i18n.t('market.instant')}</div>
                <div style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.8); margin-top:4px;">{i18n.t('market.instant_d')}</div>
            </div>
            <button class="btn-duo" style="background:#fff; color:#1cb0f6; font-size:14px; padding:12px 20px;">{i18n.t('market.find')}</button>
        </div>

        <div class="section-header">
            <span class="section-label" style="padding:0">{i18n.t('market.available')}</span>
            <button style="background:none; border:none; color:#1cb0f6; font-size:12px; font-weight:800;">{i18n.t('market.filter')}</button>
        </div>

        <div class="musyrif-list-container">
            {#each musyrifs as m}
                <div class="musyrif-card" class:offline={m.status === 'offline'}>
                    <div class="m-avatar">{m.icon}</div>
                    <div style="flex:1">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="font-size:14px; font-weight:800; color:#3c3c3c;">{m.name}</span>
                            <span class="tier-badge {m.tier}">{i18n.t(`tier.${m.tier}`)}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px; margin-top:4px;">
                            <div style="font-size:12px; font-weight:800; color:#ff9600; display:flex; align-items:center; gap:2px;">
                                <i class="ti ti-star-filled"></i> {m.rating}
                            </div>
                             <div style="font-size:12px; font-weight:700; color:#afafaf;">{i18n.t(`status.${m.status}`)}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:14px; font-weight:900; color:#3c3c3c;">{m.price} {i18n.t('market.points')}</div>
                        <div style="font-size:10px; font-weight:700; color:#00978A; margin-top:2px;">
                             <i class="ti ti-receipt-refund"></i> 10% Cashback
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <BottomNav active="murojaah" />
</div>

<style>
    .wallet-header {
        background: #fff;
        border-bottom: 2px solid var(--border-main);
        justify-content: space-between;
        padding: 12px 20px;
    }
    .wallet-pills {
        display: flex;
        gap: 8px;
    }
    .pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 100px;
        font-weight: 900;
        font-size: 14px;
        border: 2px solid var(--border-main);
    }
    .ticket-pill { color: var(--duo-blue); border-color: #e1f5fe; background: #f1faff; }
    .point-pill { color: #ff9600; border-color: #fff7e6; background: #fffbf2; }
    
    .topup-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid var(--border-main);
        background: #fff;
        color: var(--duo-blue);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
    }

    .hero-card {
        background: linear-gradient(135deg, #1cb0f6, #0898dc);
        padding: 24px;
        border-radius: 24px;
        margin-top: 16px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        box-shadow: 0 10px 20px rgba(28, 176, 246, 0.2);
        color: #fff;
    }
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    .musyrif-card {
        background: #fff;
        border: 2px solid var(--border-main);
        border-bottom-width: 4px;
        border-radius: 20px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: transform 0.1s;
    }
    .musyrif-card:active { transform: translateY(2px); border-bottom-width: 2px; }
    .musyrif-card.offline { opacity: 0.6; grayscale: 0.5; }
    .m-avatar {
        width: 56px;
        height: 56px;
        background: #f7f7f7;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        border: 2px solid var(--border-main);
    }
    .tier-badge {
        font-size: 9px;
        font-weight: 900;
        padding: 2px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .tier-badge.bersanad { background: #fff7e6; color: #cc7000; border: 1px solid #ffe4b3; }
    .tier-badge.reguler { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

    /* Desktop/Tablet Responsive Styles */
    .musyrif-list-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }

    :global(.desktop-browser) .musyrif-list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 20px;
    }
    :global(.tablet) .musyrif-list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
    }

    :global(.desktop-browser) .hero-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
        padding: 40px;
    }
    :global(.tablet) .hero-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 32px;
    }

    :global(.desktop-browser) .hero-card button,
    :global(.tablet) .hero-card button {
        width: auto;
        flex-shrink: 0;
    }
</style>
