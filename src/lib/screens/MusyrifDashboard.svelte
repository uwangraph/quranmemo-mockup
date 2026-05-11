<script>
    import { appState } from '$lib/app.svelte.js';
    
    let isAvailable = $state(true);
</script>

<div class="screen">
    <div style="background: #3c3c3c; padding: 16px; color: #fff">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #58cc02; display: flex; align-items: center; justify-content: center; font-size: 20px;">👳</div>
                <div>
                    <div style="font-size: 14px; font-weight: 900">Ustadz Malik</div>
                    <div style="font-size: 10px; font-weight: 700; color: #58cc02">Mitra Bersanad (Tier 2)</div>
                </div>
            </div>
            <div style="text-align: right">
                <div style="font-size: 14px; font-weight: 900">Rp 840.000</div>
                <div style="font-size: 10px; font-weight: 700; opacity: 0.6">Saldo Pendapatan</div>
            </div>
        </div>
    </div>

    <div style="padding: 16px; flex: 1; overflow-y: auto">
        <div class="availability-card">
            <div>
                <div style="font-size: 14px; font-weight: 800; color: #3c3c3c">Status Ketersediaan</div>
                <div style="font-size: 11px; font-weight: 700; color: #afafaf">Aktifkan untuk menerima setoran</div>
            </div>
            <button 
                class="toggle-switch" 
                class:active={isAvailable}
                onclick={() => isAvailable = !isAvailable}
            >
                <div class="toggle-circle"></div>
            </button>
        </div>

        <div class="section-label">Permintaan Setoran (Real-time)</div>
        
        {#if isAvailable}
            <div class="request-card">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #d7ffb2; display: flex; align-items: center; justify-content: center; font-size: 24px;">🧑‍🎓</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c">Ahmad Hafidz</div>
                    <div style="font-size: 11px; font-weight: 700; color: #58cc02">Setoran: Al-Mulk 12-16 (Tiket)</div>
                </div>
                <button class="btn-duo btn-green" style="width: auto; padding: 10px 16px; font-size: 12px" onclick={() => appState.go('livemarking')}>
                    TERIMA
                </button>
            </div>
        {:else}
            <div style="text-align: center; padding: 40px 20px; color: #afafaf;">
                <div style="font-size: 32px; margin-bottom: 12px;">😴</div>
                <div style="font-size: 13px; font-weight: 800;">Status Offline</div>
                <div style="font-size: 11px; font-weight: 700;">Aktifkan status untuk mulai mengajar</div>
            </div>
        {/if}

        <div class="section-label" style="margin-top: 16px">Statistik Mengajar</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <div class="stat-card">
                <div style="font-size: 20px; font-weight: 900; color: #3c3c3c">24</div>
                <div style="font-size: 10px; font-weight: 800; color: #afafaf">Sesi Minggu Ini</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 20px; font-weight: 900; color: #ffc800">4.9 ★</div>
                <div style="font-size: 10px; font-weight: 800; color: #afafaf">Rating Rata-rata</div>
            </div>
        </div>
    </div>
</div>

<style>
    .availability-card {
        background: #f7f7f7;
        border-radius: 16px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }
    .toggle-switch {
        width: 48px;
        height: 26px;
        background: #e5e5e5;
        border-radius: 100px;
        position: relative;
        cursor: pointer;
        border: none;
        transition: background 0.3s;
    }
    .toggle-switch.active { background: #58cc02; }
    .toggle-circle {
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        left: 3px;
        top: 3px;
        transition: transform 0.3s;
    }
    .toggle-switch.active .toggle-circle { transform: translateX(22px); }

    .request-card {
        background: #fff;
        border: 2px solid #58cc02;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: pulse-green 2s infinite;
    }
    @keyframes pulse-green {
        0% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(88, 204, 2, 0); }
        100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0); }
    }
    .stat-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 14px;
        padding: 12px;
        text-align: center;
    }
</style>
