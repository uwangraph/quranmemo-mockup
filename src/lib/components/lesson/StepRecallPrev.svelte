<script>
    import { appState } from '$lib/app.svelte.js';

    const wordTransliterations = {
        // Ayat 1
        "أَلَمْ": "alam",
        "نَشْرَحْ": "nashrah",
        "لَكَ": "laka",
        "صَدْرَكَ": "shadrak",
        
        // Ayat 2
        "وَوَضَعْنَا": "wa wadha'na",
        "عَنكَ": "anka",
        "وِزْرَكَ": "wizrak",
        
        // Ayat 3
        "ٱلَّذِىٓ": "alladzi",
        "أَنقَضَ": "anqadha",
        "ظَهْرَكَ": "zhahrak",
        
        // Ayat 4
        "وَرَفَعْنَا": "wa rafa'na",
        "ذِكْرَكَ": "dzikrak",
        
        // Ayat 5
        "فَإِنَّ": "fa inna",
        "مَعَ": "ma'a",
        "ٱلْعُسْرِ": "al-'usri",
        "يُسْرًا": "yusran",
        
        // Ayat 6
        "إِنَّ": "inna",
        
        // Ayat 7
        "فَإِذَا": "fa idza",
        "فَرَغْتَ": "faraghta",
        "فَٱنصَبْ": "fanshab",
        
        // Ayat 8
        "وَإِلَىٰ": "wa ila",
        "رَبِّكَ": "rabbika",
        "فَٱرْغَب": "farghab",

        // Frasa (untuk opsi gabungan)
        "أَلَمْ نَشْرَحْ": "alam nashrah",
        "وَوَضَعْنَا عَنكَ": "wa wadha'na 'anka",
        "ٱلَّذِىٓ أَنقَضَ": "alladzi anqadha",
        "فَإِنَّ مَعَ": "fa inna ma'a",
        "إِنَّ مَعَ": "inna ma'a",
        "فَإِذَا فَرَغْتَ": "fa idza faraghta",
        "وَإِلَىٰ رَبِّكَ": "wa ila rabbika"
    };
    let { 
        previousVerse, 
        recallMethod = $bindable(), 
        recordState, 
        simulatedWaves, 
        isPlayingRecorded, 
        recallSelectedOptionIdx = $bindable(), 
        isChecked, 
        selectedVerseIndex,
        startSimulatedRecording,
        playWordAudio,
        getTajweedHTML
    } = $props();
</script>

<div class="verse-display-box" style="position: relative; padding-top: 50px;">
    <button class="latin-toggle-badge" onclick={() => appState.toggleLatin()} title="Toggle Latin Transliterasi secara instan" style="top: 14px; right: 14px;">
        🔠 Latin: {appState.user.showLatin ? 'ON' : 'OFF'}
    </button>
    <!-- Dual Selector Tab -->
    <div class="recall-method-tabs">
        <button 
            class="recall-tab-btn" 
            class:active={recallMethod === 'voice'} 
            onclick={() => { recallMethod = 'voice'; }}
            disabled={isChecked}
        >
            🎙️ Setoran Hafalan
        </button>
        <button 
            class="recall-tab-btn" 
            class:active={recallMethod === 'mushaf'} 
            onclick={() => { recallMethod = 'mushaf'; }}
            disabled={isChecked}
        >
            📖 Segmentasi Mushaf
        </button>
    </div>

    {#if recallMethod === 'voice'}
        <div class="setor-quran-graphic">🎙️</div>
        <div class="arabic-focus-text Amiri blurred">
            {previousVerse.arabic}
        </div>
        <p class="voice-instruction-text">
            "Bacakan ayat {selectedVerseIndex} sepenuhnya dari hafalan tanpa teks."
        </p>
        
        <div class="mic-container">
            <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} disabled={isChecked} title="Mulai Setoran Suara">
                <i class="ti ti-microphone"></i>
            </button>
        </div>

        {#if recordState === 'recording' || isPlayingRecorded}
            <div class="simulated-wave-container">
                {#each simulatedWaves as wave}
                    <div class="wave-bar" style="height: {wave}px;"></div>
                {/each}
            </div>
            <span class="pulse-text">
                {recordState === 'recording' ? 'Merekam hafalanmu...' : 'Memutar rekaman hafalanmu...'}
            </span>
        {:else if recordState === 'recorded'}
            <div class="voice-matched-toast">
                <i class="ti ti-circle-check-filled"></i>
                Suara terekam! Klik Periksa di bawah.
            </div>
        {:else}
            <span class="action-helper-txt">Ketuk mikrofon di atas untuk mulai menyetor suara</span>
        {/if}
    {:else}
        <!-- Mushaf Segmentasi mode -->
        <div class="arabic-focus-text Amiri segment-blank">
            {#if recallSelectedOptionIdx !== null}
                {@const filledText = isChecked ? previousVerse.frontChoices[0] : previousVerse.frontChoices[recallSelectedOptionIdx]}
                <span class="filled-text" class:revealed-correct={isChecked && recallSelectedOptionIdx !== 0} class:correct-filled={isChecked && recallSelectedOptionIdx === 0}>
                    {@html getTajweedHTML ? getTajweedHTML(filledText) : filledText}
                </span>
                {previousVerse.frontBlank.split('___').pop()}
            {:else}
                {previousVerse.frontBlank}
            {/if}
        </div>

        {#if appState.user.showLatin}
            <div class="translit-focus-text" style="font-size: 13px; font-weight: 700; color: #00978a; text-align: center; margin-top: -10px; margin-bottom: 16px; font-style: italic;">
                "{previousVerse.transliteration}"
            </div>
        {/if}

        <p class="mushaf-instruction-text">
            Lengkapi potongan ayat di atas dengan memilih jawaban yang benar:
        </p>
        <div class="options-stack">
            {#each previousVerse.frontChoices as choice, i}
                <button 
                    class="option-pill"
                    class:selected={recallSelectedOptionIdx === i}
                    class:correct={isChecked && i === 0}
                    class:wrong={isChecked && recallSelectedOptionIdx === i && i !== 0}
                    onclick={() => { 
                        if (!isChecked) {
                            recallSelectedOptionIdx = i; 
                            playWordAudio(choice);
                        }
                    }}
                    disabled={isChecked}
                    style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px;"
                >
                    <span class="option-index-badge" style="font-size: 12px; font-weight: 900; background: #e2e8f0; color: #475569; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 12px;">{i + 1}</span>
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1;">
                        <span class="option-text Amiri" style="text-align: center; margin: 0; line-height: 1.2;">{@html getTajweedHTML ? getTajweedHTML(choice) : choice}</span>
                        {#if appState.user.showLatin && wordTransliterations[choice]}
                            <span class="latin-text-mini" style="font-size: 11px; font-weight: 700; color: #00978a; margin-top: 4px; font-style: italic; font-family: 'Outfit', 'Inter', sans-serif;">{wordTransliterations[choice]}</span>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* Display Card Box */
    .verse-display-box {
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 24px;
        padding: 24px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 280px;
        width: 100%;
        box-sizing: border-box;
    }
    .recall-method-tabs {
        display: flex; 
        gap: 8px; 
        margin-bottom: 24px; 
        background: #f3f4f6; 
        padding: 6px; 
        border-radius: 12px; 
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
        width: 100%;
    }
    .recall-tab-btn {
        flex: 1; 
        border: none; 
        padding: 10px; 
        font-weight: 800; 
        font-size: 13px; 
        border-radius: 8px; 
        cursor: pointer; 
        transition: all 0.2s;
        background: transparent;
        color: #64748b;
    }
    .recall-tab-btn.active {
        background: #fff;
        color: #00978A;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .setor-quran-graphic {
        font-size: 48px; 
        margin-bottom: 12px;
    }
    .arabic-focus-text {
        font-size: 28px;
        line-height: 1.6;
        color: #1e293b;
        margin-bottom: 12px;
        direction: rtl;
        text-align: center;
    }
    .arabic-focus-text.blurred {
        filter: blur(6px); 
        opacity: 0.15; 
        user-select: none;
    }
    .arabic-focus-text.segment-blank {
        font-size: 26px; 
        line-height: 1.8; 
        margin-bottom: 20px; 
        direction: rtl;
    }
    .voice-instruction-text, .mushaf-instruction-text {
        font-size: 13px; 
        font-weight: 700; 
        color: #7c7c7c; 
        margin: 12px 0 20px 0;
    }
    .mushaf-instruction-text {
        margin-bottom: 24px;
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
    .pulse-text {
        color: #ef4444; 
        font-weight: 800; 
        font-size: 12px;
        animation: pulseAnimation 1.5s infinite;
    }
    .voice-matched-toast {
        background: #ecfdf5; 
        border: 1px solid #10b981; 
        color: #065f46; 
        font-size: 14px; 
        font-weight: 800; 
        padding: 10px 16px; 
        border-radius: 8px; 
        display: inline-flex; 
        align-items: center; 
        gap: 8px; 
        margin-top: 12px;
    }
    .action-helper-txt {
        font-size: 12px; 
        color: #a0a0a0; 
        font-weight: 700;
    }
    .options-stack {
        display: flex; 
        flex-direction: column; 
        gap: 12px; 
        width: 100%;
    }
    .option-pill {
        direction: rtl; 
        font-family: 'Amiri', serif; 
        font-size: 20px; 
        font-weight: bold; 
        width: 100%; 
        border: 2px solid #e5e5e5; 
        border-radius: 12px; 
        padding: 14px; 
        background: #fff; 
        text-align: center; 
        cursor: pointer; 
        transition: 0.2s;
        color: #3c3c3c;
    }
    .option-pill:hover:not(:disabled) {
        border-color: #cbd5e1;
    }
    .option-pill.selected {
        border-color: #00978A;
        background: #e0f5f3;
    }
    .option-pill.correct {
        border-color: #22c55e;
        background: #f0fdf4;
        color: #166534;
    }
    .option-pill.wrong {
        border-color: #ff4b4b;
        background: #ffebeb;
        color: #991b1b;
    }
    .Amiri {
        font-family: 'Amiri', serif;
    }
    .filled-text {
        color: #00978a; 
        border-bottom: 2px dashed #00978a;
        transition: all 0.3s ease;
    }
    .filled-text.revealed-correct {
        color: #22c55e;
        border-bottom: 2px solid #22c55e;
        background: rgba(34, 197, 94, 0.1);
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 800;
    }
    .filled-text.correct-filled {
        color: #22c55e;
        border-bottom: 2px solid #22c55e;
    }

    @keyframes pulseAnimation {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
    .latin-toggle-badge {
        position: absolute;
        top: 14px;
        right: 14px;
        background: #f1f5f9;
        color: #475569;
        border: 2px solid #e2e8f0;
        border-radius: 99px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        z-index: 10;
    }
    .latin-toggle-badge:hover {
        background: #e2e8f0;
        transform: translateY(-1px);
    }
    .latin-toggle-badge:active {
        transform: translateY(1px);
    }
</style>
