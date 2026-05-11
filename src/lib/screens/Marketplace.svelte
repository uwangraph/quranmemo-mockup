<script>
    import { appState } from '$lib/app.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const musyrifs = [
        { name: "Ust. Ahmad Fauzi", rating: 4.9, status: "Online", price: 35, tier: "Bersanad", icon: "👳" },
        { name: "Ust. Ridwan Hakim", rating: 4.8, status: "Online", price: 25, tier: "Reguler", icon: "👨‍🏫" },
        { name: "Ustadzah Siti Aminah", rating: 5.0, status: "Offline", price: 35, tier: "Bersanad", icon: "🧕" },
    ];
</script>

<div class="screen">
    <div class="topbar">
        <div style="flex:1">
            <div style="font-size:10px; font-weight:800; color:#afafaf; text-transform:uppercase;">Saldo Dompet</div>
            <div style="display:flex; gap:12px; align-items:center; margin-top:2px;">
                <div style="display:flex; gap:4px; align-items:center; font-size:14px; font-weight:900; color:#1cb0f6;">
                    <i class="ti ti-ticket"></i> 4 Tiket
                </div>
                <div style="display:flex; gap:4px; align-items:center; font-size:14px; font-weight:900; color:#ce82ff;">
                    <i class="ti ti-coins"></i> 120 Koin
                </div>
            </div>
        </div>
        <button class="btn-duo btn-outline small-btn" style="padding:6px 12px; font-size:11px;">ISI SALDO</button>
    </div>

    <div class="scroll-content" style="padding: 0 16px;">
        <div class="hero-card">
            <div style="flex:1">
                <div style="font-size:18px; font-weight:900; color:#fff;">Setoran Instan</div>
                <div style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.8); margin-top:4px;">Terhubung dengan Musyrif dalam detik</div>
            </div>
            <button class="btn-duo" style="background:#fff; color:#1cb0f6; font-size:14px; padding:12px 20px;">CARI SEKARANG</button>
        </div>

        <div class="section-header">
            <span class="section-label" style="padding:0">Musyrif Tersedia</span>
            <button style="background:none; border:none; color:#1cb0f6; font-size:12px; font-weight:800;">Filter</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
            {#each musyrifs as m}
                <div class="musyrif-card" class:offline={m.status === 'Offline'}>
                    <div class="m-avatar">{m.icon}</div>
                    <div style="flex:1">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="font-size:14px; font-weight:800; color:#3c3c3c;">{m.name}</span>
                            <span class="tier-badge {m.tier.toLowerCase()}">{m.tier}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px; margin-top:4px;">
                            <div style="font-size:12px; font-weight:800; color:#ff9600; display:flex; align-items:center; gap:2px;">
                                <i class="ti ti-star-filled"></i> {m.rating}
                            </div>
                            <div style="font-size:12px; font-weight:700; color:#afafaf;">{m.status}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:14px; font-weight:900; color:#3c3c3c;">{m.price}k</div>
                        <div style="font-size:10px; font-weight:700; color:#afafaf;">per sesi</div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <BottomNav active="murojaah" />
</div>

<style>
    .hero-card {
        background: linear-gradient(135deg, #1cb0f6, #0898dc);
        padding: 20px;
        border-radius: 16px;
        margin-top: 16px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 15px rgba(28, 176, 246, 0.3);
    }
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    .musyrif-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 14px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .musyrif-card.offline { opacity: 0.6; }
    .m-avatar {
        width: 50px;
        height: 50px;
        background: #f7f7f7;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
    }
    .tier-badge {
        font-size: 9px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
    }
    .tier-badge.bersanad { background: #fff7e6; color: #cc7000; border: 1px solid #ffe4b3; }
    .tier-badge.reguler { background: #f0f0f0; color: #777; border: 1px solid #ddd; }
</style>
