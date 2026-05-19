<script>
    let { 
        isPlaying, 
        recordState, 
        isComparing, 
        isPlayingRecorded, 
        simulatedWaves, 
        togglePlay, 
        startSimulatedRecording, 
        startComparePlay,
        isChecked = false
    } = $props();
</script>

<div class="compare-container">
    <div class="compare-cards-row">
        <div class="compare-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3996/3996562.png" alt="Qari icon" class="avatar-icon" />
            <h4>Suara Qari</h4>
            <button class="compare-action-btn" onclick={togglePlay} class:active={isPlaying && !isComparing} disabled={isChecked}>
                <i class="ti {isPlaying && !isComparing ? 'ti-player-pause' : 'ti-player-play'}"></i> Dengar Qari
            </button>
        </div>
        
        <div class="compare-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User icon" class="avatar-icon" />
            <h4>Rekaman Anda</h4>
            <button class="compare-action-btn record" onclick={startSimulatedRecording} class:active={recordState === 'recording'} disabled={isChecked}>
                <i class="ti ti-microphone"></i> {recordState === 'recorded' ? 'Ulang Rekam' : 'Rekam Suara'}
            </button>
        </div>
    </div>
    
    {#if recordState === 'recorded'}
        <div class="compare-match-btn-row">
            <button class="compare-match-btn" class:active={isComparing} onclick={startComparePlay} disabled={isChecked}>
                <i class="ti ti-arrows-minimize"></i> Bandingkan Berurutan
            </button>
        </div>
    {/if}
    
    {#if recordState === 'recording' || isPlayingRecorded}
        <div class="simulated-wave-container">
            {#each simulatedWaves as wave}
                <span class="wave-bar" style="height: {wave}px"></span>
            {/each}
        </div>
    {/if}
</div>

<style>
    .compare-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
        box-sizing: border-box;
    }
    .compare-cards-row {
        display: flex;
        gap: 16px;
    }
    .compare-card {
        flex: 1;
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 20px;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .avatar-icon {
        width: 48px; 
        height: 48px; 
        object-fit: contain; 
        margin-bottom: 8px;
    }
    .compare-card h4 {
        font-size: 13px;
        font-weight: 900;
        color: #3c3c3c;
        margin: 0 0 12px;
    }
    .compare-action-btn {
        width: 100%;
        padding: 8px 12px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 3px;
        background: #fff;
        font-size: 12px;
        font-weight: 800;
        color: #4b5563;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.1s;
    }
    .compare-action-btn:active:not(:disabled) {
        transform: translateY(2px);
        border-bottom-width: 1px;
    }
    .compare-action-btn:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        transform: none !important;
    }
    .compare-action-btn.active {
        border-color: #00978A;
        background: #DBF0EE;
        color: #00978A;
    }
    .compare-action-btn.record.active {
        border-color: #ff4b4b;
        background: #ffebeb;
        color: #ff4b4b;
    }
    .compare-match-btn-row {
        display: flex; 
        justify-content: center; 
        margin-top: 16px;
    }
    .compare-match-btn {
        padding: 10px 20px;
        border-radius: 12px;
        border: 2px solid #00978A;
        border-bottom-width: 4px;
        background: #e0f5f3;
        color: #00978A;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .compare-match-btn:active:not(:disabled) {
        transform: translateY(2px);
        border-bottom-width: 1px;
    }
    .compare-match-btn:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        transform: none !important;
    }
    .compare-match-btn.active {
        background: #00978A;
        color: #fff;
    }
    .simulated-wave-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        height: 50px;
        margin: 16px 0;
    }
    .wave-bar {
        width: 4px;
        background: #ff4b4b;
        border-radius: 10px;
        transition: height 0.1s ease;
    }
</style>
