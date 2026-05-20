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

    // Tracks whether we've already auto-triggered compare for current recording
    let autoCompareTriggered = $state(false);

    // Current phase in the single-button flow
    const phase = $derived.by(() => {
        if (recordState === 'recording') return 'recording';
        if (isComparing && isPlaying && !isPlayingRecorded) return 'qari_playing';
        if (isPlayingRecorded) return 'user_playing';
        if (recordState === 'recorded' && !isComparing && !isPlayingRecorded) return 'done';
        return 'idle';
    });

    // Auto-trigger compare right after recording finishes
    $effect(() => {
        if (recordState === 'recorded' && !autoCompareTriggered && !isComparing && !isPlayingRecorded && !isChecked) {
            autoCompareTriggered = true;
            setTimeout(() => startComparePlay(), 400);
        }
        // Reset flag when a new recording starts
        if (recordState === 'recording' || recordState === 'idle') {
            autoCompareTriggered = false;
        }
    });
</script>

<div class="record-flow-container">

    <!-- Flow Step Indicators -->
    <div class="flow-steps-row">
        <div class="flow-step" class:active={phase === 'recording'} class:done={phase === 'qari_playing' || phase === 'user_playing' || phase === 'done'}>
            <div class="flow-step-dot">
                {#if phase === 'qari_playing' || phase === 'user_playing' || phase === 'done'}
                    <i class="ti ti-check" style="font-size: 14px;"></i>
                {:else}
                    <i class="ti ti-microphone" style="font-size: 14px;"></i>
                {/if}
            </div>
            <span class="flow-step-label">Rekam</span>
        </div>

        <div class="flow-connector" class:lit={phase === 'qari_playing' || phase === 'user_playing' || phase === 'done'}></div>

        <div class="flow-step" class:active={phase === 'qari_playing'} class:done={phase === 'user_playing' || phase === 'done'}>
            <div class="flow-step-dot">
                {#if phase === 'user_playing' || phase === 'done'}
                    <i class="ti ti-check" style="font-size: 14px;"></i>
                {:else}
                    <i class="ti ti-user" style="font-size: 14px;"></i>
                {/if}
            </div>
            <span class="flow-step-label">Qari</span>
        </div>

        <div class="flow-connector" class:lit={phase === 'user_playing' || phase === 'done'}></div>

        <div class="flow-step" class:active={phase === 'user_playing'} class:done={phase === 'done'}>
            <div class="flow-step-dot">
                {#if phase === 'done'}
                    <i class="ti ti-check" style="font-size: 14px;"></i>
                {:else}
                    <i class="ti ti-headphones" style="font-size: 14px;"></i>
                {/if}
            </div>
            <span class="flow-step-label">Bandingkan</span>
        </div>
    </div>

    <!-- Status Label -->
    <div class="phase-status-label
        {phase === 'idle' ? 'status-idle' : ''}
        {phase === 'recording' ? 'status-recording' : ''}
        {phase === 'qari_playing' ? 'status-qari' : ''}
        {phase === 'user_playing' ? 'status-user' : ''}
        {phase === 'done' ? 'status-done' : ''}
    ">
        {#if phase === 'idle'}
            <i class="ti ti-microphone"></i> Tekan tombol di bawah untuk mulai merekam
        {:else if phase === 'recording'}
            <i class="ti ti-point-filled" style="color: #ff4b4b; animation: blink 1s infinite;"></i> Sedang merekam suara Anda...
        {:else if phase === 'qari_playing'}
            <i class="ti ti-volume"></i> Bacaan Qari sedang diputar...
        {:else if phase === 'user_playing'}
            <i class="ti ti-player-play"></i> Rekaman Anda sedang diputar...
        {:else if phase === 'done'}
            <i class="ti ti-circle-check"></i> Perbandingan selesai! Siap dilanjutkan.
        {/if}
    </div>

    <!-- Wave Visualizer -->
    <div class="wave-visualizer-row">
        {#if phase === 'recording'}
            <!-- Live mic waves -->
            <div class="wave-avatar user-avatar">🎙️</div>
            <div class="wave-bars-container">
                {#each simulatedWaves as h}
                    <span class="wave-bar" style="height: {h}px; background: #ff4b4b;"></span>
                {/each}
                {#if simulatedWaves.length === 0}
                    {#each Array(15).fill(4) as h}
                        <span class="wave-bar" style="height: {h}px; background: #ffb3b3;"></span>
                    {/each}
                {/if}
            </div>
        {:else if phase === 'qari_playing'}
            <!-- Animated qari wave -->
            <div class="wave-avatar">🕌</div>
            <div class="wave-bars-container">
                {#each Array(15).fill(0) as _, i}
                    <span class="wave-bar qari-anim" style="height: {18 + Math.sin(i * 0.7) * 12}px; animation-delay: {i * 0.06}s;"></span>
                {/each}
            </div>
        {:else if phase === 'user_playing'}
            <!-- Playback waves -->
            <div class="wave-avatar user-avatar">🎙️</div>
            <div class="wave-bars-container">
                {#each simulatedWaves as h}
                    <span class="wave-bar" style="height: {h}px; background: #10b981;"></span>
                {/each}
                {#if simulatedWaves.length === 0}
                    {#each Array(15).fill(4) as h}
                        <span class="wave-bar" style="height: {h}px; background: #a7f3d0;"></span>
                    {/each}
                {/if}
            </div>
        {:else}
            <!-- Flat idle wave -->
            <div class="wave-avatar" style="opacity: 0.3;">🎙️</div>
            <div class="wave-bars-container">
                {#each Array(15).fill(4) as h}
                    <span class="wave-bar" style="height: {h}px; background: #e2e8f0;"></span>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Single Action Button -->
    {#if phase === 'idle'}
        <button class="main-action-btn btn-record" onclick={startSimulatedRecording} disabled={isChecked}>
            <i class="ti ti-microphone" style="font-size: 22px;"></i>
            <span>Mulai Rekam</span>
        </button>
    {:else if phase === 'recording'}
        <button class="main-action-btn btn-stop" onclick={startSimulatedRecording} disabled={isChecked}>
            <i class="ti ti-player-stop-filled" style="font-size: 22px;"></i>
            <span>Stop & Bandingkan</span>
        </button>
    {:else if phase === 'qari_playing' || phase === 'user_playing'}
        <button class="main-action-btn btn-loading" disabled>
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
            <span>{phase === 'qari_playing' ? 'Mendengarkan Qari...' : 'Memutar Rekaman Anda...'}</span>
        </button>
    {:else if phase === 'done'}
        <div class="done-btn-row">
            <button class="main-action-btn btn-retry" onclick={startSimulatedRecording} disabled={isChecked}>
                <i class="ti ti-refresh" style="font-size: 18px;"></i>
                <span>Rekam Ulang</span>
            </button>
        </div>
    {/if}

</div>

<style>
    .record-flow-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
    }

    /* Flow step indicator */
    .flow-steps-row {
        display: flex;
        align-items: center;
        gap: 0;
        width: 100%;
        justify-content: center;
    }
    .flow-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }
    .flow-step-dot {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f1f5f9;
        border: 2px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #94a3b8;
        transition: all 0.3s ease;
    }
    .flow-step.active .flow-step-dot {
        background: #fff4e0;
        border-color: #ff9600;
        color: #ff9600;
        box-shadow: 0 0 0 4px rgba(255, 150, 0, 0.15);
    }
    .flow-step.done .flow-step-dot {
        background: #dcfce7;
        border-color: #22c55e;
        color: #16a34a;
    }
    .flow-step-label {
        font-size: 10px;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .flow-step.active .flow-step-label { color: #ff9600; }
    .flow-step.done .flow-step-label { color: #16a34a; }

    .flow-connector {
        flex: 1;
        height: 2px;
        background: #e2e8f0;
        margin: 0 8px;
        margin-bottom: 22px;
        transition: background 0.3s ease;
    }
    .flow-connector.lit { background: #22c55e; }

    /* Status label */
    .phase-status-label {
        font-size: 12px;
        font-weight: 800;
        padding: 10px 16px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }
    .status-idle { background: #f8fafc; color: #64748b; }
    .status-recording { background: #fff0f0; color: #dc2626; }
    .status-qari { background: #e0f2fe; color: #0369a1; }
    .status-user { background: #f0fdf4; color: #15803d; }
    .status-done { background: #f0fdf4; color: #15803d; }

    /* Wave Visualizer */
    .wave-visualizer-row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        height: 60px;
        padding: 0 8px;
        box-sizing: border-box;
    }
    .wave-avatar {
        font-size: 24px;
        flex-shrink: 0;
    }
    .wave-bars-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        height: 100%;
    }
    .wave-bar {
        width: 4px;
        border-radius: 4px;
        transition: height 0.1s ease;
    }
    .wave-bar.qari-anim {
        background: #1cb0f6;
        animation: qaripulse 1s ease-in-out infinite alternate;
    }
    @keyframes qaripulse {
        from { transform: scaleY(0.6); opacity: 0.6; }
        to { transform: scaleY(1.2); opacity: 1; }
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }

    /* Main action button */
    .main-action-btn {
        width: 100%;
        padding: 16px;
        border-radius: 16px;
        font-size: 15px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        cursor: pointer;
        border: none;
        border-bottom: 4px solid transparent;
        transition: all 0.15s ease;
    }
    .main-action-btn:active:not(:disabled) {
        transform: translateY(3px);
        border-bottom-width: 1px;
    }
    .main-action-btn:disabled {
        cursor: default;
        pointer-events: none;
    }
    .btn-record {
        background: #ff4b4b;
        border-bottom-color: #cc0000;
        color: #fff;
    }
    .btn-stop {
        background: #1e293b;
        border-bottom-color: #0f172a;
        color: #fff;
    }
    .btn-loading {
        background: #f1f5f9;
        border-bottom-color: #e2e8f0;
        color: #64748b;
        opacity: 0.9;
    }
    .btn-retry {
        background: #f1f5f9;
        border-bottom-color: #e2e8f0;
        color: #475569;
    }
    .done-btn-row {
        width: 100%;
        display: flex;
        gap: 12px;
    }
    .done-btn-row .main-action-btn {
        flex: 1;
    }

    /* Loading dots animation */
    .loading-dots {
        display: flex;
        gap: 4px;
    }
    .loading-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #94a3b8;
        animation: dotbounce 1.2s infinite ease-in-out both;
    }
    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes dotbounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
</style>
