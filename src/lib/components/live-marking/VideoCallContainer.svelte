<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
</script>

<div class="video-call-container">
    <div class="video-bg-layer" style="background-image: url('/student.png');"></div>
    <div class="video-tint-overlay"></div>
    
    <div class="glass-hud-top">
        <div class="status-pill-modern">
            <span class="indicator"></span>
            <span style="color: #fff; font-size: 11px; font-weight: 900; letter-spacing: 0.5px;">{i18n.t('marking.live_tasmi')}</span>
        </div>
    </div>

    <div class="participant-dock">
        <div class="dock-item">
            <img src="/musyrif.png" alt="you" />
            <div class="label">{i18n.t('marking.you')}</div>
        </div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="call-action-bar">
        <div class="action-circle"><i class="ti ti-microphone"></i></div>
        <div class="action-circle"><i class="ti ti-video"></i></div>
        <div class="action-circle danger" onclick={() => appState.go('musyrif')}><i class="ti ti-phone-off"></i></div>
    </div>

    <div class="main-video-stream">
        <img src="/student.png" alt="student" />
    </div>
</div>

<style>
    .video-call-container { width: 100%; height: 380px; background: #000; position: relative; overflow: hidden; }
    .video-bg-layer { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; filter: blur(40px) brightness(0.6); transform: scale(1.3); }
    .video-tint-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at center, transparent 0%, rgba(255, 150, 0, 0.1) 100%); z-index: 2; }
    .main-video-stream { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; z-index: 3; }
    .main-video-stream img { height: 100%; width: auto; object-fit: contain; filter: drop-shadow(0 20px 60px rgba(0,0,0,0.8)); }
    
    .participant-dock { position: absolute; top: 20px; right: 16px; display: flex; flex-direction: column; gap: 12px; z-index: 20; }
    .dock-item { width: 64px; height: 84px; border-radius: 18px; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4); position: relative; }
    .dock-item img { width: 100%; height: 100%; object-fit: cover; }
    .dock-item .label { position: absolute; bottom: 4px; left: 0; right: 0; text-align: center; font-size: 8px; font-weight: 900; color: #fff; text-transform: uppercase; }

    .glass-hud-top { position: absolute; top: 20px; left: 16px; z-index: 20; }
    .status-pill-modern { background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); padding: 6px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 8px; }
    .status-pill-modern .indicator { width: 8px; height: 8px; background: #ff4b4b; border-radius: 50%; box-shadow: 0 0 10px #ff4b4b; animation: pulse-red 1.5s infinite; }
    @keyframes pulse-red { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

    .call-action-bar { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); backdrop-filter: blur(30px); padding: 10px 20px; border-radius: 24px; display: flex; gap: 20px; z-index: 20; border: 1px solid rgba(255,255,255,0.1); }
    .action-circle { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s; cursor: pointer; }
    .action-circle:active { transform: scale(0.9); }
    .action-circle.danger { background: var(--duo-red); }
</style>
