<script>
    import { appState } from '$lib/app.svelte.js';
    
    let { 
        activeVerse, 
        currentWordIndex, 
        isPlaying, 
        audio, 
        loopTimes = $bindable(), 
        playWordAudio, 
        togglePlay, 
        togglePlaySlow, 
        setupAudio, 
        getTajweedHTML,
        isChecked = false
    } = $props();
</script>

<div class="verse-display-box" style="position: relative;">

    <div class="audio-circle-row">
        <button class="audio-circle-play" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} disabled={isChecked} title="Putar Audio Qari (Normal)">
            <i class="ti {isPlaying && audio?.playbackRate === 1.0 ? 'ti-player-pause' : 'ti-player-play'}"></i>
        </button>
        <button class="audio-circle-play slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} disabled={isChecked} title="Putar Audio Qari (Lambat)">
            <img src="/snail.png" alt="Snail" class="snail-icon" />
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
                title={isChecked ? "" : "Klik untuk putar audio kata ini"}
            >
                {@html getTajweedHTML(word)}
            </span>{' '}
        {/each}
    </div>
    {#if appState.user.showLatin}
        <div class="translit-focus-text">"{activeVerse.transliteration}"</div>
    {/if}
    <div class="trans-focus-text">{activeVerse.translation}</div>

    <!-- Looping Selector Pill Row -->
    <div class="loop-selector-row">
        <span class="loop-label">
            <i class="ti ti-repeat"></i> Loop:
        </span>
        {#each [1, 2, 3, 5, 10] as times}
            <button 
                class="loop-pill" 
                class:active={loopTimes === times} 
                onclick={() => { if (!isChecked) { loopTimes = times; setupAudio(); } }}
                disabled={isChecked}
                title="Ulangi {times} kali"
            >
                {times}x
            </button>
        {/each}
        <button 
            class="loop-pill" 
            class:active={loopTimes === Infinity} 
            onclick={() => { if (!isChecked) { loopTimes = Infinity; setupAudio(); } }}
            disabled={isChecked}
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
        <button class="btn-info-tajwid" onclick={() => appState.go('tajwid')} disabled={isChecked}>
            <i class="ti ti-info-circle"></i> Info Lengkap Tajwid
        </button>
    </div>
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
    .audio-circle-row {
        display: flex; 
        gap: 16px; 
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
    .translit-focus-text {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 8px;
        font-style: italic;
    }
    .trans-focus-text {
        font-size: 12px;
        font-weight: 700;
        color: #94a3b8;
        max-width: 320px;
        line-height: 1.4;
        margin-bottom: 16px;
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
    .loop-pill:hover:not(:disabled) {
        background: #e2e8f0;
        color: #475569;
        transform: translateY(-1px);
    }
    .loop-pill.active {
        background: #00978A;
        color: #fff;
        box-shadow: 0 2px 6px rgba(0, 151, 138, 0.3);
    }
    .loop-pill:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        transform: none !important;
    }
    .tajweed-legend-container {
        margin-top: 16px; 
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
    .btn-info-tajwid:hover:not(:disabled) {
        background: rgba(0, 151, 138, 0.2);
    }
    .btn-info-tajwid:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
    }
    .Amiri {
        font-family: 'Amiri', serif;
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
