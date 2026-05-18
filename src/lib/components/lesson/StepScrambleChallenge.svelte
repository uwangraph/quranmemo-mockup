<script>
    let { 
        type, 
        activeVerse, 
        isChecked, 
        isCorrect, 
        isPlaying, 
        audio, 
        scrambledWords, 
        selectedWords = $bindable(), 
        togglePlay, 
        togglePlaySlow, 
        toggleWordSelection,
        playWordAudio 
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
    {:else if type === 'puzzle_two'}
        <div class="challenge-arabic-blank Amiri">{activeVerse.twoBlank}</div>
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
        {#each selectedWords as word}
            <button class="scramble-word-pill" onclick={() => toggleWordSelection(word)} disabled={isChecked}>
                {word.text}
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
                    {choice}
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
                    {word.text}
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
</style>
