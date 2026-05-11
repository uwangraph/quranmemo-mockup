<script>
    import { appState } from '$lib/app.svelte.js';
</script>

<div class="screen">
    <div class="topbar">
        <div style="font-size: 15px; font-weight: 900;">Admin: Monitor User</div>
    </div>
    
    <div class="scroll-content" style="padding: 16px;">
        <div class="stats-overview">
            <div class="stat-item">
                <div class="stat-val">1.240</div>
                <div class="stat-label">Total User</div>
            </div>
            <div class="stat-item border-x">
                <div class="stat-val" style="color: #23a100;">85</div>
                <div class="stat-label">Aktif Sekarang</div>
            </div>
            <div class="stat-item">
                <div class="stat-val" style="color: #4f46e5;">342</div>
                <div class="stat-label">Setoran Hari Ini</div>
            </div>
        </div>

        <div class="section-label">User Perlu Perhatian (Low Activity)</div>
        <div class="user-list">
            <div class="user-card warning">
                <div class="user-icon" style="background: #fee2e2;">📉</div>
                <div style="flex: 1;">
                    <div class="user-name">Budi Santoso</div>
                    <div class="user-status" style="color: #ef4444;">Streak putus 3 hari lalu</div>
                </div>
                <button class="btn-duo btn-green small-btn">HUBUNGI</button>
            </div>
            
            <div class="user-card warning">
                <div class="user-icon" style="background: #fef9c3;">⏳</div>
                <div style="flex: 1;">
                    <div class="user-name">Siti Aminah</div>
                    <div class="user-status" style="color: #a16207;">Belum setor pekan ini</div>
                </div>
                <button class="btn-duo btn-green small-btn">REMIND</button>
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
