<script>
    import { appState } from '$lib/app.svelte.js';
</script>

<div class="screen">
    <div class="topbar">
        <div style="font-size: 15px; font-weight: 900;">Admin: Monitor Musyrif</div>
    </div>
    
    <div class="scroll-content" style="padding: 16px;">
        <div class="revenue-card">
            <div style="font-size: 11px; font-weight: 800; opacity: 0.7; text-transform: uppercase;">Revenue Share System</div>
            <div style="font-size: 24px; font-weight: 900; margin: 4px 0;">Rp 12.450.000</div>
            <div style="font-size: 10px; font-weight: 700; color: #23a100;">+12% dari bulan lalu</div>
        </div>

        <div class="section-label">Musyrif Online (Ready)</div>
        <div class="musyrif-list">
            <div class="musyrif-card">
                <div class="avatar-wrap">
                    <div class="avatar">👳</div>
                    <div class="status-indicator online"></div>
                </div>
                <div style="flex: 1;">
                    <div class="musyrif-name">Ust. Malik</div>
                    <div class="musyrif-activity">Melayani: Ahmad H. (Al-Mulk:12)</div>
                </div>
                <div class="rating">4.9 ★</div>
            </div>
            
            <div class="musyrif-card">
                <div class="avatar-wrap">
                    <div class="avatar">👳</div>
                    <div class="status-indicator online"></div>
                </div>
                <div style="flex: 1;">
                    <div class="musyrif-name">Ust. Hanafi</div>
                    <div class="musyrif-activity" style="color: #64748b;">Idle — Menunggu setoran</div>
                </div>
                <div class="rating">4.8 ★</div>
            </div>
        </div>
    </div>
</div>

<style>
    .revenue-card {
        background: #1e293b;
        color: #fff;
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
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
        background: #f1f5f9;
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
    .musyrif-activity {
        font-size: 10px;
        color: #23a100;
        font-weight: 700;
    }
    .rating {
        font-size: 11px;
        font-weight: 800;
        color: #1e293b;
    }
</style>
