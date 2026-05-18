<script>
    import { appState } from '$lib/app.svelte.js';
    
    let { 
        activeVerse, 
        currentWordIndex, 
        isPlaying, 
        audio, 
        loopTimes = $bindable(), 
        recordState, 
        isPlayingRecorded, 
        simulatedWaves, 
        playWordAudio, 
        togglePlay, 
        togglePlaySlow, 
        setupAudio, 
        getTajweedHTML, 
        startSimulatedRecording, 
        togglePlayRecorded 
    } = $props();
</script>

<div class="verse-display-box">
    <div class="actions-row">
        <button class="audio-circle-play" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} title="1. Dengar Qari (Normal)">
            <i class="ti ti-volume"></i>
        </button>
        <button class="audio-circle-play slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} title="1. Dengar Qari (Lambat)">
            <img src="/snail.png" alt="Snail" class="snail-icon" />
        </button>
        <button class="mic-circle-btn" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="2. Tiru Bacaan">
            <i class="ti ti-microphone"></i>
        </button>
    </div>

    <div class="arabic-focus-text Amiri">
        {#each activeVerse.words as word, wIdx}
            <span 
                class="highlight-word" 
                class:active={wIdx === currentWordIndex}
                onclick={() => playWordAudio(word)}
                onkeydown={(e) => { if (e.key === 'Enter') playWordAudio(word); }}
                role="button"
                tabindex="0"
                title="Klik untuk putar audio kata ini"
            >
                {@html getTajweedHTML(word)}
            </span>{' '}
        {/each}
    </div>

    <!-- Looping Selector Pill Row -->
    <div class="loop-selector-row">
        <span class="loop-label">
            <i class="ti ti-repeat"></i> Loop:
        </span>
        {#each [1, 2, 3, 5, 10] as times}
            <button 
                class="loop-pill" 
                class:active={loopTimes === times} 
                onclick={() => { loopTimes = times; setupAudio(); }}
                title="Ulangi {times} kali"
            >
                {times}x
            </button>
        {/each}
        <button 
            class="loop-pill" 
            class:active={loopTimes === Infinity} 
            onclick={() => { loopTimes = Infinity; setupAudio(); }}
            title="Loop tanpa batas"
        >
            ∞
        </button>
    </div>

    <!-- Tajweed Legend -->
    <div class="tajweed-legend-container">
        <div class="tajweed-legend">
            <span class="legend-item"><span class="color-dot idzhar"></span> Idzhar</span>
            <span class="legend-item"><span class="color-dot idgam"></span> Idgam</span>
            <span class="legend-item"><span class="color-dot ikhfa"></span> Ikhfa</span>
            <span class="legend-item"><span class="color-dot iqlab"></span> Iqlab</span>
            <span class="legend-item"><span class="color-dot qalqalah"></span> Qalqalah</span>
            <span class="legend-item"><span class="color-dot ghunnah"></span> Ghunnah</span>
        </div>
        <button class="btn-info-tajwid" onclick={() => appState.go('tajwid')}>
            <i class="ti ti-info-circle"></i> Info Lengkap Tajwid
        </button>
    </div>
    
    {#if recordState === 'recording'}
        <div class="simulated-wave-container">
            {#each simulatedWaves as wave}
                <span class="wave-bar" style="height: {wave}px"></span>
            {/each}
        </div>
        <span class="action-helper-txt pulsing">Merekam suara Anda... Silakan membaca ayat di atas!</span>
    {:else if recordState === 'recorded'}
        {#if isPlayingRecorded}
            <div class="simulated-wave-container with-margin">
                {#each simulatedWaves as wave}
                    <span class="wave-bar" style="height: {wave}px"></span>
                {/each}
            </div>
        {/if}
        <div class="success-recording-box">
            <span class="action-helper-txt text-success">✓ Suara berhasil direkam!</span>
            <div style="display: flex; gap: 8px; width: 100%; justify-content: center; margin-top: 4px;">
                <button class="btn-duo" style="flex: 1; color: #00978A; border-color: #ccfbf1;" onclick={togglePlayRecorded}>
                    <i class="ti {isPlayingRecorded ? 'ti-player-pause' : 'ti-player-play'}"></i> 
                    {isPlayingRecorded ? 'Pause' : 'Putar Suara'}
                </button>
                <button class="btn-duo" style="flex: 1; color: #ff4b4b; border-color: #fee2e2;" onclick={startSimulatedRecording}>
                    <i class="ti ti-microphone"></i> 
                    Rekam Ulang
                </button>
            </div>
        </div>
    {:else}
        <span class="action-helper-txt">Ketuk speaker untuk mendengar, lalu ketuk mikrofon untuk meniru!</span>
    {/if}
</div>

<style>
    /* Display Card Box */
    .verse-display-box {
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 24px;
        padding: 30px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 280px;
        width: 100%;
        box-sizing: border-box;
    }
    .actions-row {
        display: flex; 
        gap: 12px; 
        justify-content: center; 
        align-items: center; 
        margin-bottom: 20px;
    }
    .audio-circle-play {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #00978A;
        border: none;
        border-bottom: 4px solid #007A70;
        color: #fff;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.1s;
    }
    .audio-circle-play:active {
        border-bottom-width: 0;
        transform: translateY(4px);
    }
    .audio-circle-play.slow-btn {
        background: #10B981; /* Beautiful Fresh Mint Green */
        border-bottom-color: #059669; /* Darker Forest Green 3D shadow */
    }
    .snail-icon {
        width: 28px; 
        height: 28px; 
        object-fit: contain;
    }
    .mic-circle-btn {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid #ff4b4b;
        color: #ff4b4b;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 75, 75, 0.15);
        transition: all 0.2s;
    }
    .mic-circle-btn.active {
        background: #ff4b4b;
        color: #fff;
        transform: scale(1.08);
        box-shadow: 0 0 20px rgba(255, 75, 75, 0.4);
    }
    .arabic-focus-text {
        font-size: 28px;
        line-height: 1.6;
        color: #1e293b;
        margin-bottom: 12px;
        direction: rtl;
        text-align: center;
    }
    .highlight-word {
        color: #1e293b;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-block;
        padding: 2px 6px;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    }
    .highlight-word:hover {
        background: rgba(0, 151, 138, 0.08);
        color: #00978a;
        transform: translateY(-1px) scale(1.05);
    }
    .highlight-word.active {
        background: rgba(0, 151, 138, 0.15);
        box-shadow: 0 4px 12px rgba(0, 151, 138, 0.15);
        transform: scale(1.18) translateY(-3px);
        font-weight: 800;
    }
    .loop-selector-row {
        display: flex; 
        gap: 8px; 
        justify-content: center; 
        align-items: center; 
        margin-top: 16px; 
        border-top: 1px solid #f1f5f9; 
        padding-top: 12px; 
        width: 100%;
    }
    .loop-label {
        font-size: 11px; 
        font-weight: 800; 
        color: #64748b; 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
        display: flex; 
        align-items: center; 
        gap: 4px;
    }
    .loop-pill {
        background: #f1f5f9;
        border: none;
        padding: 4px 10px;
        border-radius: 99px;
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .loop-pill:hover {
        background: #e2e8f0;
        color: #475569;
        transform: translateY(-1px);
    }
    .loop-pill.active {
        background: #00978A;
        color: #fff;
        box-shadow: 0 2px 6px rgba(0, 151, 138, 0.3);
    }
    .tajweed-legend-container {
        margin-top: 16px; 
        margin-bottom: 16px;
        padding-top: 12px; 
        border-top: 1px solid #f1f5f9; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        gap: 12px;
        width: 100%;
    }
    .tajweed-legend {
        display: flex; 
        gap: 8px; 
        justify-content: center; 
        align-items: center; 
        flex-wrap: wrap; 
        font-size: 10px; 
        font-weight: 800; 
        letter-spacing: 0.2px;
    }
    .legend-item {
        display: inline-flex; 
        align-items: center; 
        gap: 4px;
        color: #64748b;
    }
    .color-dot {
        width: 7px; 
        height: 7px; 
        border-radius: 50%;
    }
    .color-dot.idzhar { background: #555555; }
    .color-dot.idgam { background: #ef4444; }
    .color-dot.ikhfa { background: #10b981; }
    .color-dot.iqlab { background: #0ea5e9; }
    .color-dot.qalqalah { background: #1e1b4b; }
    .color-dot.ghunnah { background: #d946ef; }
    
    .btn-info-tajwid {
        background: rgba(0, 151, 138, 0.1); 
        border: none; 
        border-radius: 99px; 
        color: #00978a; 
        font-size: 11px; 
        font-weight: 800; 
        cursor: pointer; 
        display: inline-flex; 
        align-items: center; 
        gap: 6px; 
        padding: 6px 14px; 
        transition: all 0.2s;
    }
    .btn-info-tajwid:hover {
        background: rgba(0, 151, 138, 0.2);
    }
    .simulated-wave-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        height: 50px;
        margin: 16px 0;
    }
    .simulated-wave-container.with-margin {
        margin-bottom: 12px;
    }
    .wave-bar {
        width: 4px;
        background: #ff4b4b;
        border-radius: 10px;
        transition: height 0.1s ease;
    }
    .action-helper-txt {
        font-size: 11px;
        font-weight: 800;
        color: #94a3b8;
        text-align: center;
    }
    .action-helper-txt.text-success {
        color: #0ea5e9;
    }
    .pulsing {
        animation: pulseAnimation 1.5s infinite;
    }
    .success-recording-box {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        gap: 12px; 
        margin-top: 8px;
        width: 100%;
    }
    .btn-duo {
        padding: 8px 16px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 12px;
        background: #fff;
        font-size: 12px;
        font-weight: 850;
        color: #afafaf;
        cursor: pointer;
        transition: all 0.1s ease;
        text-align: center;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .btn-duo:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .btn-duo.outline {
        border-color: #00978A; 
        color: #00978A;
    }
    .Amiri {
        font-family: 'Amiri', serif;
    }
    @keyframes pulseAnimation {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }

    /* === 6-Color Tajweed System (Kemenag Standard) === */
    :global(.tajweed-hitam) {
        color: #555555 !important;
        font-weight: bold;
    }
    :global(.tajweed-merah) {
        color: #ef4444 !important;
        font-weight: bold;
    }
    :global(.tajweed-hijau) {
        color: #10b981 !important;
        font-weight: bold;
    }
    :global(.tajweed-cyan) {
        color: #0ea5e9 !important;
        font-weight: bold;
    }
    :global(.tajweed-biru-pekat) {
        color: #1e1b4b !important;
        font-weight: bold;
    }
    :global(.tajweed-ungu) {
        color: #d946ef !important;
        font-weight: bold;
    }
</style>
