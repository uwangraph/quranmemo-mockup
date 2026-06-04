<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
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
        togglePlayRecorded,
        isChecked = false,
        onOpenTajwid
    } = $props();

    let isLoopDropdownOpen = $state(false);
</script>

<div class="verse-display-box" style="position: relative;">
    <div class="actions-row">
        <button class="audio-circle-play" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} disabled={isChecked} title={i18n.t('scramble.play_normal')}>
            <i class="ti {isPlaying && audio?.playbackRate === 1.0 ? 'ti-player-pause' : 'ti-volume'}"></i>
        </button>
        <button class="audio-circle-play slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} disabled={isChecked} title={i18n.t('scramble.play_slow')}>
            {#if isPlaying && audio?.playbackRate < 1.0}
                <i class="ti ti-player-pause"></i>
            {:else}
                <img src="/snail.png" alt="Snail" class="snail-icon" />
            {/if}
        </button>
        <button 
            class="mic-circle-btn" 
            class:active={recordState === 'recording'}
            class:recorded={recordState === 'recorded'}
            onclick={startSimulatedRecording} 
            disabled={isChecked} 
            title={recordState === 'recording' ? i18n.t('lesson.mic_stop') : recordState === 'recorded' ? i18n.t('lesson.mic_re_record') : i18n.t('lesson.mic_start')}
        >
            {#if recordState === 'recording'}
                <i class="ti ti-player-stop-filled"></i>
            {:else if recordState === 'recorded'}
                <i class="ti ti-rotate-clockwise"></i>
            {:else}
                <i class="ti ti-microphone"></i>
            {/if}
        </button>
    </div>

    <div class="arabic-focus-text Amiri">
        {#each activeVerse.words as word, wIdx}
            <span 
                class="highlight-word" 
                class:active={wIdx === currentWordIndex}
                class:disabled={isChecked}
                onclick={() => { if (!isChecked) playWordAudio(word); }}
                onkeydown={(e) => { if (e.key === 'Enter' && !isChecked) playWordAudio(word); }}
                role="button"
                tabindex={isChecked ? "-1" : "0"}
                title={isChecked ? '' : i18n.t('lesson.tap_word_audio')}
            >
                {@html getTajweedHTML(word)}
            </span>{' '}
        {/each}
    </div>

    {#if appState.user.showLatin}
        <div class="translit-focus-text" style="font-size: 14px; font-weight: 700; color: #00978A; margin-top: -8px; margin-bottom: 12px; text-align: center;">
            "{activeVerse.transliteration}"
        </div>
    {/if}

    <!-- Looping Selector Dropdown (Custom) -->
    <div class="loop-selector-row">
        <label class="loop-label" for="loop-select-repeat">
            <i class="ti ti-repeat"></i> {i18n.t('scramble.loop_label')}
        </label>
        
        <div class="custom-dropdown-container">
            <button 
                class="loop-dropdown-trigger" 
                onclick={() => { if (!isChecked) isLoopDropdownOpen = !isLoopDropdownOpen; }}
                disabled={isChecked}
            >
                {loopTimes === Infinity ? '∞' : loopTimes + 'x'}
                <i class="ti ti-chevron-down" style="font-size: 14px;"></i>
            </button>
            
            {#if isLoopDropdownOpen}
                <div class="custom-dropdown-menu">
                    {#each [1, 2, 3, 5, 10] as times}
                        <button 
                            class="dropdown-item" 
                            class:active={loopTimes === times}
                            onclick={() => { loopTimes = times; isLoopDropdownOpen = false; setupAudio(); }}
                        >
                            {times}x
                        </button>
                    {/each}
                    <button 
                        class="dropdown-item" 
                        class:active={loopTimes === Infinity}
                        onclick={() => { loopTimes = Infinity; isLoopDropdownOpen = false; setupAudio(); }}
                    >
                        ∞
                    </button>
                </div>
            {/if}
            
            <!-- Backdrop to close dropdown when clicking outside -->
            {#if isLoopDropdownOpen}
                <div class="dropdown-backdrop" aria-hidden="true" onclick={() => isLoopDropdownOpen = false}></div>
            {/if}
        </div>
    </div>
    
    {#if recordState === 'recording'}
        <div class="simulated-wave-container">
            {#each simulatedWaves as wave}
                <span class="wave-bar" style="height: {wave}px"></span>
            {/each}
        </div>
        <span class="action-helper-txt pulsing">{i18n.t('lesson.recording_status')}</span>
    {:else if recordState === 'recorded'}
        {#if isPlayingRecorded}
            <div class="simulated-wave-container with-margin">
                {#each simulatedWaves as wave}
                    <span class="wave-bar" style="height: {wave}px"></span>
                {/each}
            </div>
        {/if}
        <div class="success-recording-box">
            <span class="action-helper-txt text-success">{i18n.t('lesson.voice_recorded')}</span>
            <div style="display: flex; gap: 8px; width: 100%; justify-content: center; margin-top: 4px;">
                <button class="btn-duo" style="flex: 1; color: #00978A; border-color: #ccfbf1;" onclick={togglePlayRecorded} disabled={isChecked}>
                    <i class="ti {isPlayingRecorded ? 'ti-player-pause' : 'ti-player-play'}"></i> 
                    {isPlayingRecorded ? i18n.t('lesson.pause') : i18n.t('lesson.play_my_record')}
                </button>
                <button class="btn-duo" style="flex: 1; color: #ff4b4b; border-color: #fee2e2;" onclick={startSimulatedRecording} disabled={isChecked}>
                    <i class="ti ti-microphone"></i> 
                    {i18n.t('lesson.mic_re_record')}
                </button>
            </div>
        </div>
    {:else}
        <span class="action-helper-txt">{i18n.t('lesson.instruct_listen_repeat')}</span>
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
    .audio-circle-play:active:not(:disabled) {
        border-bottom-width: 0;
        transform: translateY(4px);
    }
    .audio-circle-play:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        border-bottom-width: 2px !important;
        transform: none !important;
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
    .mic-circle-btn:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        transform: none !important;
        box-shadow: none !important;
    }
    .mic-circle-btn.active {
        background: #ff4b4b;
        color: #fff;
        transform: scale(1.08);
        box-shadow: 0 0 20px rgba(255, 75, 75, 0.4);
    }
    .mic-circle-btn.recorded {
        background: #fff;
        border-color: #00978a;
        color: #00978a;
        box-shadow: 0 4px 12px rgba(0, 151, 138, 0.15);
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
    .highlight-word:hover:not(.disabled) {
        background: rgba(0, 151, 138, 0.08);
        color: #00978a;
        transform: translateY(-1px) scale(1.05);
    }
    .highlight-word.active:not(.disabled) {
        background: rgba(0, 151, 138, 0.15);
        box-shadow: 0 4px 12px rgba(0, 151, 138, 0.15);
        transform: scale(1.18) translateY(-3px);
        font-weight: 800;
    }
    .highlight-word.disabled {
        cursor: default !important;
        pointer-events: none !important;
        background: none !important;
        transform: none !important;
        box-shadow: none !important;
    }
    .loop-selector-row {
        display: flex; 
        gap: 6px; 
        justify-content: center; 
        align-items: center; 
        margin-top: 12px; 
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
    .custom-dropdown-container {
        position: relative;
        display: inline-block;
    }
    .loop-dropdown-trigger {
        background: #f1f5f9;
        border: 2px solid #e2e8f0;
        padding: 4px 8px 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 800;
        color: #475569;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        font-family: 'Nunito', sans-serif;
    }
    .loop-dropdown-trigger:hover:not(:disabled) {
        border-color: #cbd5e1;
    }
    .loop-dropdown-trigger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .custom-dropdown-menu {
        position: absolute;
        top: 110%; /* Open downwards */
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 4px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 60px;
    }
    .dropdown-item {
        background: transparent;
        border: none;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 700;
        color: #475569;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.1s;
    }
    .dropdown-item:hover {
        background: #f1f5f9;
    }
    .dropdown-item.active {
        background: #00978A;
        color: #fff;
    }
    .dropdown-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
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
