<script>
    let { 
        type, 
        activeVerse, 
        isChecked, 
        isCorrect, 
        isPlaying, 
        audio, 
        loopTimes = $bindable(), 
        setupAudio,
        scrambledWords, 
        selectedWords = $bindable(), 
        togglePlay, 
        togglePlaySlow, 
        toggleWordSelection,
        playWordAudio,
        getTajweedHTML
    } = $props();
</script>

<div class="scramble-challenge-container">
    {#if type === 'audio_scramble'}
        <div class="audio-control-row">
            <button class="audio-circle-play small" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} title="Dengar Qari (Normal)">
                <i class="ti ti-volume"></i>
            </button>
            <button class="audio-circle-play small slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} title="Dengar Qari (Lambat)">
                <img src="/snail.png" alt="Snail" class="snail-icon-small" />
            </button>
        </div>

        <!-- Looping Selector Pill Row in Puzzle Mode -->
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
    {:else if type === 'puzzle_two'}
        <div 
            class="challenge-arabic-blank Amiri" 
            onclick={togglePlay} 
            onkeydown={(e) => e.key === 'Enter' && togglePlay()} 
            role="button" 
            tabindex="0" 
            title="Klik untuk mendengarkan bacaan Qari"
        >
            {#each activeVerse.twoBlank.split(' ') as part}
                {#if part === '___'}
                    <span style="color: #cbd5e1; border-bottom: 2px dashed #cbd5e1; padding: 0 4px; margin: 0 4px;">___</span>
                {:else}
                    <span 
                        class="clickable-word-question" 
                        onclick={(e) => { e.stopPropagation(); playWordAudio(part); }}
                        onkeydown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); playWordAudio(part); } }}
                        role="button"
                        tabindex="0"
                        title="Klik untuk mendengar pelafalan kata ini"
                    >
                        {@html getTajweedHTML ? getTajweedHTML(part) : part}
                    </span>
                {/if}
                {' '}
            {/each}
        </div>
    {/if}
    
    <div class="scramble-drop-shelf" class:correct={isChecked && isCorrect} class:wrong={isChecked && !isCorrect} class:two-blank={type === 'puzzle_two'}>
        {#if selectedWords.length === 0}
            <span class="drop-shelf-placeholder">
                {#if type === 'puzzle_two'}
                    Lengkapi 2 kata di atas secara berurutan...
                {:else if type === 'puzzle_total'}
                    Susun seluruh ayat Al-Insyirah dari hafalanmu...
                {:else}
                    Ketuk kata-kata di bawah untuk menyusun ayat...
                {/if}
            </span>
        {/if}
        {#each (isChecked && !isCorrect ? (type === 'puzzle_two' ? activeVerse.twoCorrect.map((w, idx) => ({ id: idx, text: w })) : activeVerse.words.map((w, idx) => ({ id: idx, text: w }))) : selectedWords) as word}
            <button class="scramble-word-pill" onclick={() => toggleWordSelection(word)} disabled={isChecked} class:correct-revealed={isChecked && !isCorrect}>
                {@html getTajweedHTML ? getTajweedHTML(word.text) : word.text}
            </button>
        {/each}
    </div>
    
    <div class="scramble-source-bank">
        {#if type === 'puzzle_two'}
            {#each activeVerse.twoChoices as choice, i}
                {@const wordObj = { id: i, text: choice, selected: selectedWords.some(w => w.text === choice) }}
                <button 
                    class="scramble-word-pill outline" 
                    class:placed={wordObj.selected}
                    onclick={() => toggleWordSelection(wordObj)}
                    disabled={isChecked || wordObj.selected}
                >
                    {@html getTajweedHTML ? getTajweedHTML(choice) : choice}
                </button>
            {/each}
        {:else}
            {#each scrambledWords as word}
                <button 
                    class="scramble-word-pill outline" 
                    class:placed={word.selected}
                    onclick={() => toggleWordSelection(word)}
                    disabled={isChecked || word.selected}
                >
                    {@html getTajweedHTML ? getTajweedHTML(word.text) : word.text}
                    {#if type === 'audio_scramble'}
                        <span 
                            class="audio-mini-icon" 
                            role="button"
                            tabindex="0"
                            onclick={(e) => { e.stopPropagation(); playWordAudio(word.text); }}
                            onkeydown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); playWordAudio(word.text); } }}
                            title="Dengar kata"
                        >
                            <i class="ti ti-volume"></i>
                        </span>
                    {/if}
                </button>
            {/each}
        {/if}
    </div>
</div>

<style>
    .scramble-challenge-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        box-sizing: border-box;
    }
    .audio-control-row {
        display: flex; 
        gap: 12px; 
        justify-content: center; 
        align-items: center; 
        margin-bottom: 12px;
    }
    .challenge-arabic-blank {
        font-size: 26px;
        line-height: 1.8;
        text-align: center;
        color: #1e293b;
        background: #fafafa;
        border: 2px dashed #cbd5e1;
        border-radius: 20px;
        padding: 24px 16px;
        direction: rtl;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
    }
    .challenge-arabic-blank:hover {
        background: #f1f5f9;
        border-color: #00978a;
        transform: scale(1.01);
    }
    .challenge-arabic-blank:active {
        transform: scale(0.99);
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
    .audio-circle-play.small {
        width: 48px;
        height: 48px;
        font-size: 18px;
        margin-bottom: 12px;
    }
    .audio-circle-play.slow-btn {
        background: #10B981; /* Beautiful Fresh Mint Green */
        border-bottom-color: #059669; /* Darker Forest Green 3D shadow */
    }
    .audio-control-row .audio-circle-play {
        margin-bottom: 0 !important;
    }
    .snail-icon-small {
        width: 20px; 
        height: 20px; 
        object-fit: contain;
    }
    .scramble-drop-shelf {
        min-height: 100px;
        border-bottom: 2px solid #e2e8f0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 0;
        justify-content: center;
        align-items: center;
        direction: rtl;
    }
    .scramble-drop-shelf.two-blank {
        min-height: 80px;
    }
    .scramble-drop-shelf.correct { border-color: #22c55e; }
    .scramble-drop-shelf.wrong { border-color: #ff4b4b; }
    
    .drop-shelf-placeholder {
        font-size: 12px;
        font-weight: 700;
        color: #94a3b8;
        font-style: italic;
    }
    .scramble-source-bank {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        padding: 10px 0;
        direction: rtl;
    }
    .scramble-word-pill {
        padding: 10px 16px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 12px;
        background: #fff;
        color: #3c3c3c;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.1s;
        direction: rtl;
        font-family: "Amiri", serif;
        box-sizing: border-box;
    }
    .scramble-word-pill:active:not(:disabled) {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .scramble-word-pill.outline {
        border-color: #e2e8f0;
        background: #fff;
    }
    .scramble-word-pill.placed {
        opacity: 0.15;
        pointer-events: none;
        box-shadow: none;
    }
    .scramble-word-pill.correct-revealed {
        border-color: #22c55e !important;
        background: #dcfce7 !important;
        color: #166534 !important;
        border-bottom-color: #15803d !important;
        pointer-events: none;
    }
    .audio-mini-icon {
        margin-left: 4px;
        color: #94a3b8;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
    }
    .audio-mini-icon:hover {
        color: #00978a;
    }
    .Amiri {
        font-family: 'Amiri', serif;
    }

    /* Looping Selector styling */
    .loop-selector-row {
        display: flex; 
        gap: 8px; 
        justify-content: center; 
        align-items: center; 
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
        display: inline-flex; 
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
    .clickable-word-question {
        display: inline-block;
        cursor: pointer;
        padding: 0 4px;
        border-radius: 6px;
        transition: all 0.15s ease;
    }
    .clickable-word-question:hover {
        background: rgba(0, 151, 138, 0.15);
        color: #00978a;
        transform: translateY(-1px);
    }
    .clickable-word-question:active {
        transform: translateY(0);
    }
</style>
