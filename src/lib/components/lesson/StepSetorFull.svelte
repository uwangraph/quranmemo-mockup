<script>
    let { 
        type, 
        activeVerse, 
        alInsyirahVerses,
        selectedVerseIndex,
        recordState, 
        simulatedWaves, 
        isPlayingRecorded, 
        isPlaying, 
        startSimulatedRecording, 
        togglePlayRecorded, 
        togglePlay,
        isChecked = false,
        getTajweedHTML
    } = $props();
</script>

<div class="verse-display-box">
    {#if recordState === 'idle'}
        <!-- Idle State -->
        <div class="graphic-icon">
            {#if type === 'setor_full'}📖{:else if type === 'recall_level1'}🏆{:else}🔗{/if}
        </div>
        <div class="mic-container">
            <button class="mic-circle-btn giant" onclick={startSimulatedRecording} disabled={isChecked} title="Mulai Setoran">
                <i class="ti ti-microphone"></i>
            </button>
        </div>
        <p class="instruction-txt">
            {#if type === 'setor_full'}
                Tekan tombol mic, lalu hafalkan ayat {activeVerse.verseNumber} secara lengkap tanpa bantuan teks.
            {:else if type === 'recall_level1'}
                Tekan mic dan bacakan ayat {activeVerse.verseNumber} yang baru saja kamu hafal secara penuh dari ingatanmu.
            {:else}
                {@const prevVerse = alInsyirahVerses[selectedVerseIndex - 1]}
                Tekan mic dan bacakan <strong>ayat {prevVerse.verseNumber}</strong> dilanjutkan <strong>ayat {activeVerse.verseNumber}</strong> secara berurutan tanpa putus.
            {/if}
        </p>
    {:else if recordState === 'recording'}
        <!-- Recording State -->
        <div class="mic-container pulsing-container">
            <button class="mic-circle-btn giant active" onclick={startSimulatedRecording} disabled={isChecked}>
                <i class="ti ti-microphone"></i>
            </button>
        </div>
        
        <div class="simulated-wave-container">
            {#each simulatedWaves as wave}
                <span class="wave-bar" style="height: {wave}px"></span>
            {/each}
        </div>
        
        <p class="instruction-txt pulsing text-primary" style="margin-top: 10px;">
            {#if type === 'setor_full'}
                Tasmi AI sedang menyimak bacaan Anda...
            {:else if type === 'recall_level1'}
                Tasmi AI sedang menyimak hafalan barumu...
            {:else}
                Tasmi AI menyimak sambungan ayat...
            {/if}
        </p>
    {:else if recordState === 'recorded'}
        <!-- Recorded / Comparison State (Simplified and Beautiful!) -->
        <div class="compare-view">
            <!-- Transcription Card -->
            <div class="transcription-card">
                {#if type === 'setor_full'}
                    <span class="badge-pill mushaf">BACAAN MUSHAF</span>
                    <div class="arabic-display Amiri">
                        {@html getTajweedHTML ? getTajweedHTML(activeVerse.arabic) : activeVerse.arabic}
                    </div>
                    <span class="card-status-txt">Bandingkan rekaman Anda dengan bacaan Qari</span>
                {:else if type === 'recall_level1'}
                    <span class="badge-pill transcription">TRANSKRIPSI HAFALAN</span>
                    <div class="arabic-display Amiri">
                        {@html getTajweedHTML ? getTajweedHTML(activeVerse.arabic) : activeVerse.arabic}
                    </div>
                    <span class="card-status-txt success">✓ Ayat baru berhasil disetorkan dengan fasih!</span>
                {:else}
                    {@const prevVerse = alInsyirahVerses[selectedVerseIndex - 1]}
                    <span class="badge-pill linking">HAFALAN BERSAMBUNG</span>
                    <div class="arabic-display Amiri double">
                        {@html getTajweedHTML ? getTajweedHTML(prevVerse.arabic) : prevVerse.arabic} 
                        <span class="verse-num">﴿{prevVerse.verseNumber}﴾</span>
                        {@html getTajweedHTML ? getTajweedHTML(activeVerse.arabic) : activeVerse.arabic}
                        <span class="verse-num">﴿{activeVerse.verseNumber}﴾</span>
                    </div>
                    <span class="card-status-txt success">✓ Sambungan ayat {prevVerse.verseNumber} & {activeVerse.verseNumber} terjalin kokoh!</span>
                {/if}
            </div>

            <!-- Sleek Minimalist Comparison Controls -->
            <div class="minimal-controls-row">
                <button 
                    class="minimal-btn play-recorded" 
                    class:active={isPlayingRecorded}
                    onclick={togglePlayRecorded} 
                    disabled={isChecked}
                >
                    <i class="ti {isPlayingRecorded ? 'ti-player-pause-filled' : 'ti-microphone-filled'}"></i>
                    {isPlayingRecorded ? 'Memutar Rekaman...' : 'Putar Rekamanku'}
                </button>

                {#if type === 'setor_full'}
                    <button 
                        class="minimal-btn play-qari" 
                        class:active={isPlaying}
                        onclick={togglePlay} 
                        disabled={isChecked}
                    >
                        <i class="ti {isPlaying ? 'ti-player-pause-filled' : 'ti-headphones-filled'}"></i>
                        {isPlaying ? 'Memutar Qari...' : 'Putar Bacaan Qari'}
                    </button>
                {/if}
            </div>
            
            {#if isPlayingRecorded}
                <div class="simulated-wave-container mini">
                    {#each simulatedWaves as wave}
                        <span class="wave-bar" style="height: {wave * 0.6}px"></span>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* Display Card Box */
    .verse-display-box {
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 24px;
        padding: 36px 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        width: 100%;
        box-sizing: border-box;
    }
    .graphic-icon {
        font-size: 56px;
        margin-bottom: 8px;
        animation: floatAnimation 2s infinite ease-in-out;
    }
    .mic-container {
        margin: 20px 0;
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
    .mic-circle-btn.giant {
        width: 90px;
        height: 90px;
        font-size: 36px;
        border-width: 6px;
    }
    .mic-circle-btn:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
    }
    .mic-circle-btn.active {
        background: #ff4b4b;
        color: #fff;
        transform: scale(1.08);
        box-shadow: 0 0 20px rgba(255, 75, 75, 0.4);
    }
    .simulated-wave-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        height: 50px;
        margin: 16px 0;
    }
    .simulated-wave-container.mini {
        height: 30px;
        margin: 12px 0 0 0;
    }
    .wave-bar {
        width: 4px;
        background: #ff4b4b;
        border-radius: 10px;
        transition: height 0.1s ease;
    }
    .instruction-txt {
        font-size: 13px;
        font-weight: 700;
        color: #718096;
        text-align: center;
        max-width: 320px;
        line-height: 1.5;
        margin: 8px 0 0 0;
    }
    .instruction-txt.pulsing {
        animation: pulseAnimation 1.5s infinite;
    }
    .instruction-txt.text-primary {
        color: #0ea5e9;
    }
    
    /* Comparison / Transcription View Styling (Simple & Elegant!) */
    .compare-view {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
    .transcription-card {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 24px 20px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }
    .badge-pill {
        font-size: 10px;
        font-weight: 900;
        padding: 4px 10px;
        border-radius: 100px;
        letter-spacing: 0.5px;
        color: #fff;
    }
    .badge-pill.mushaf {
        background: #00978a;
    }
    .badge-pill.transcription {
        background: #0284c7;
    }
    .badge-pill.linking {
        background: #ea580c;
    }
    .arabic-display {
        font-size: 28px;
        font-weight: 700;
        color: #1e293b;
        text-align: center;
        line-height: 2.0;
        direction: rtl;
        width: 100%;
        padding: 8px 0;
    }
    .arabic-display.double {
        font-size: 24px;
        line-height: 2.2;
    }
    .verse-num {
        font-family: 'Outfit', 'Inter', sans-serif;
        font-size: 18px;
        color: #64748b;
        margin: 0 4px;
    }
    .card-status-txt {
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        text-align: center;
    }
    .card-status-txt.success {
        color: #059669;
    }
    
    /* Sleek Minimalist Controls */
    .minimal-controls-row {
        display: flex;
        gap: 12px;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
    }
    .minimal-btn {
        flex: 1;
        min-width: 140px;
        max-width: 180px;
        padding: 12px 16px;
        border-radius: 14px;
        border: 2px solid #e2e8f0;
        border-bottom-width: 4px;
        background: #fff;
        color: #475569;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.15s ease;
        box-sizing: border-box;
    }
    .minimal-btn i {
        font-size: 14px;
        transition: transform 0.2s;
    }
    .minimal-btn:hover:not(:disabled) {
        border-color: #cbd5e1;
        background: #f8fafc;
        transform: translateY(-1px);
    }
    .minimal-btn:active:not(:disabled) {
        transform: translateY(1px);
        border-bottom-width: 2px;
    }
    .minimal-btn.active {
        color: #fff;
        transform: translateY(1px);
        border-bottom-width: 2px;
    }
    .minimal-btn.play-recorded.active {
        background: #4f46e5;
        border-color: #4338ca;
    }
    .minimal-btn.play-qari.active {
        background: #059669;
        border-color: #047857;
    }
    .minimal-btn:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
    }

    .Amiri {
        font-family: 'Amiri', serif;
    }

    @keyframes floatAnimation {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    @keyframes pulseAnimation {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
</style>
