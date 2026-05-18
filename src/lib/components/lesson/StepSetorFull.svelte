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
        togglePlay 
    } = $props();
</script>

<div class="verse-display-box">
    {#if type === 'setor_full'}
        <div class="setor-quran-graphic">📖</div>
        
        <div class="mic-container">
            <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="Mulai Setoran Full">
                <i class="ti ti-microphone"></i>
            </button>
        </div>
        
        {#if recordState === 'recording' || isPlayingRecorded}
            <div class="simulated-wave-container">
                {#each simulatedWaves as wave}
                    <span class="wave-bar" style="height: {wave}px"></span>
                {/each}
            </div>
            <span class="action-helper-txt pulsing text-primary">
                {recordState === 'recording' ? 'Tasmi AI sedang menyimak bacaan Anda...' : 'Memutar rekaman bacaan Anda...'}
            </span>
        {:else if recordState === 'recorded'}
            <div class="transcription-box">
                <div class="trans-pill-tag">TRANSKRIPSI AI</div>
                <div class="arabic-transcription Amiri">{activeVerse.arabic}</div>
                <span class="action-helper-txt text-success">✓ 100% Sesuai dengan Mushaf!</span>
            </div>

            <!-- Dual Audio Comparison -->
            <div class="compare-buttons-row">
                <button class="compare-btn recorded" onclick={togglePlayRecorded}>
                    <i class="ti {isPlayingRecorded ? 'ti-player-pause-filled' : 'ti-microphone'}"></i>
                    {isPlayingRecorded ? 'Mendengar...' : '🎤 Putar Rekamanku'}
                </button>
                <button class="compare-btn qari" onclick={togglePlay}>
                    <i class="ti {isPlaying ? 'ti-player-pause-filled' : 'ti-quran'}"></i>
                    {isPlaying ? 'Mendengar...' : '📖 Putar Bacaan Qari'}
                </button>
            </div>
            <p class="comparison-guide-txt">
                Bandingkan rekamanmu dengan bacaan qari, lalu tentukan sendiri.
            </p>
        {:else}
            <span class="action-helper-txt">Tekan tombol mic, lalu hafalkan ayat {activeVerse.verseNumber} secara lengkap tanpa bantuan teks.</span>
        {/if}
        
    {:else if type === 'recall_level1'}
        <div class="setor-quran-graphic">🏆</div>
        
        <div class="level-title green">
            Level 1: Setor Ayat Baru
        </div>
        
        <div class="mic-container">
            <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="Mulai Setoran Level 1">
                <i class="ti ti-microphone"></i>
            </button>
        </div>
        
        {#if recordState === 'recording' || isPlayingRecorded}
            <div class="simulated-wave-container">
                {#each simulatedWaves as wave}
                    <span class="wave-bar" style="height: {wave}px"></span>
                {/each}
            </div>
            <span class="action-helper-txt pulsing text-primary">
                {recordState === 'recording' ? 'Tasmi AI sedang menyimak hafalan barumu...' : 'Memutar rekaman hafalan barumu...'}
            </span>
        {:else if recordState === 'recorded'}
            <div class="transcription-box">
                <div class="trans-pill-tag blue">TRANSKRIPSI HAFALAN</div>
                <div class="arabic-transcription Amiri">{activeVerse.arabic}</div>
                <span class="action-helper-txt text-success">✓ Ayat baru berhasil disetorkan dengan fasih!</span>
            </div>
        {:else}
            <span class="action-helper-txt">
                Tekan mic dan bacakan ayat {activeVerse.verseNumber} yang baru saja kamu hafal secara penuh dari ingatanmu.
            </span>
        {/if}
        
    {:else if type === 'recall_level2'}
        {@const prevVerse = alInsyirahVerses[selectedVerseIndex - 1]}
        <div class="setor-quran-graphic linking">🔗</div>
        
        <div class="level-title orange">
            Level 2: Sambungkan Hafalan
        </div>
        
        <div class="mic-container">
            <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="Mulai Setoran Level 2">
                <i class="ti ti-microphone"></i>
            </button>
        </div>
        
        {#if recordState === 'recording' || isPlayingRecorded}
            <div class="simulated-wave-container">
                {#each simulatedWaves as wave}
                    <span class="wave-bar" style="height: {wave}px"></span>
                {/each}
            </div>
            <span class="action-helper-txt pulsing text-primary">
                {recordState === 'recording' ? 'Tasmi AI menyimak sambungan ayat...' : 'Memutar rekaman sambungan ayat...'}
            </span>
        {:else if recordState === 'recorded'}
            <div class="transcription-box">
                <div class="trans-pill-tag orange">HAFALAN BERSAMBUNG</div>
                <div class="arabic-transcription Amiri double-verse">
                    {prevVerse.arabic} ﴿{prevVerse.verseNumber}﴾ {activeVerse.arabic} ﴿{activeVerse.verseNumber}﴾
                </div>
                <span class="action-helper-txt text-success">✓ Sempurna! Sambungan ayat {prevVerse.verseNumber} & {activeVerse.verseNumber} terjalin kokoh!</span>
            </div>
        {:else}
            <span class="action-helper-txt">
                Tekan mic dan bacakan **ayat {prevVerse.verseNumber}** dilanjutkan **ayat {activeVerse.verseNumber}** secara berurutan tanpa putus.
            </span>
        {/if}
    {/if}
</div>

<style>
    /* Display Card Box */
    .verse-display-box {
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 24px;
        padding: 40px 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 280px;
        width: 100%;
        box-sizing: border-box;
    }
    .setor-quran-graphic {
        font-size: 64px;
        margin-bottom: 12px;
        animation: floatAnimation 2s infinite ease-in-out;
    }
    .setor-quran-graphic.linking {
        animation: floatAnimation 2s infinite ease-in-out;
    }
    .mic-container {
        margin: 24px 0;
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
        color: #059669;
        margin-top: 8px;
    }
    .action-helper-txt.text-primary {
        color: #0ea5e9;
    }
    .pulsing {
        animation: pulseAnimation 1.5s infinite;
    }
    .level-title {
        font-size: 16px; 
        font-weight: 800; 
        margin-bottom: 12px;
    }
    .level-title.green { color: #059669; }
    .level-title.orange { color: #ea580c; }
    
    .transcription-box {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 16px;
        width: 100%;
        max-width: 320px;
        margin-top: 16px;
        box-sizing: border-box;
    }
    .trans-pill-tag {
        font-size: 9px;
        font-weight: 900;
        background: #0284c7;
        color: #fff;
        padding: 2px 8px;
        border-radius: 100px;
        display: inline-block;
        margin-bottom: 8px;
    }
    .trans-pill-tag.blue {
        background: #e0f2fe; 
        color: #0369a1;
    }
    .trans-pill-tag.orange {
        background: #fff7ed; 
        color: #c2410c;
    }
    .arabic-transcription {
        font-size: 22px;
        color: #1e293b;
        text-align: center;
        line-height: 1.6;
        direction: rtl;
    }
    .arabic-transcription.double-verse {
        font-size: 20px; 
        line-height: 2.0; 
        direction: rtl; 
        text-align: right; 
        width: 100%;
    }
    .compare-buttons-row {
        display: flex; 
        gap: 10px; 
        justify-content: center; 
        margin-top: 20px; 
        flex-wrap: wrap;
    }
    .compare-btn {
        color: #fff; 
        border: none; 
        border-radius: 12px; 
        padding: 12px 18px; 
        font-size: 12px; 
        font-weight: 800; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        gap: 6px; 
        transition: all 0.2s;
    }
    .compare-btn.recorded {
        background: linear-gradient(135deg, #667eea, #764ba2); 
        box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }
    .compare-btn.qari {
        background: linear-gradient(135deg, #00978a, #059669); 
        box-shadow: 0 4px 12px rgba(0,151,138,0.3);
    }
    .compare-btn:active {
        transform: scale(0.97);
    }
    .comparison-guide-txt {
        text-align: center; 
        font-size: 11px; 
        color: #94a3b8; 
        margin-top: 10px; 
        font-weight: 600;
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
