<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

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

    let isLoopDropdownOpen = $state(false);
    let showLatin = $state(false); // local state, tidak mempengaruhi soal lain

    // Drag and Drop & Touch Reordering states
    let draggedIndex = $state(null);
    let hoverIndex = $state(null);

    function handleDragStart(e, index) {
        if (isChecked) return;
        draggedIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        // Make the dragged element look semi-transparent
        setTimeout(() => {
            const el = e.target;
            if (el) el.style.opacity = '0.4';
        }, 0);
    }

    function handleDragOver(e, index) {
        if (isChecked) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        hoverIndex = index;
    }

    function handleDragEnd(e) {
        if (isChecked) return;
        draggedIndex = null;
        hoverIndex = null;
        const el = e.target;
        if (el) el.style.opacity = '1';
    }

    function handleDrop(e, targetIdx) {
        if (isChecked) return;
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === targetIdx) return;
        
        const updated = [...selectedWords];
        const [draggedItem] = updated.splice(draggedIndex, 1);
        updated.splice(targetIdx, 0, draggedItem);
        selectedWords = updated;
        
        draggedIndex = null;
        hoverIndex = null;
    }

    // Touch event handlers for mobile
    function handleTouchStart(e, idx) {
        if (isChecked) return;
        draggedIndex = idx;
    }

    function handleTouchMove(e) {
        if (isChecked || draggedIndex === null) return;
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element) {
            const targetIdxAttr = element.getAttribute('data-index');
            if (targetIdxAttr !== null) {
                const targetIdx = parseInt(targetIdxAttr, 10);
                if (targetIdx !== draggedIndex) {
                    hoverIndex = targetIdx;
                }
            }
        }
    }

    function handleTouchEnd(e) {
        if (isChecked || draggedIndex === null) return;
        if (hoverIndex !== null && hoverIndex !== draggedIndex) {
            const updated = [...selectedWords];
            const [draggedItem] = updated.splice(draggedIndex, 1);
            updated.splice(hoverIndex, 0, draggedItem);
            selectedWords = updated;
        }
        draggedIndex = null;
        hoverIndex = null;
    }
</script>

<div class="scramble-challenge-container" style="position: relative; padding-top: 30px;">
    {#if type === 'audio_scramble'}
        <div class="audio-control-row">
            <button class="audio-circle-play small" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} disabled={isChecked} title={i18n.t('scramble.play_normal')}>
                <i class="ti {isPlaying && audio?.playbackRate === 1.0 ? 'ti-player-pause' : 'ti-volume'}"></i>
            </button>
            <button class="audio-circle-play small slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} disabled={isChecked} title={i18n.t('scramble.play_slow')}>
                {#if isPlaying && audio?.playbackRate < 1.0}
                    <i class="ti ti-player-pause"></i>
                {:else}
                    <img src="/snail.png" alt="Snail" class="snail-icon-small" />
                {/if}
            </button>
        </div>

        <!-- Looping Selector Dropdown (Custom) in Puzzle Mode -->
        <div class="loop-selector-row">
            <label class="loop-label" for="loop-select-scramble">
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
                
                {#if isLoopDropdownOpen}
                    <div class="dropdown-backdrop" aria-hidden="true" onclick={() => isLoopDropdownOpen = false}></div>
                {/if}
            </div>
        </div>
    {:else if type === 'puzzle_two'}
        <button class="latin-toggle-badge" onclick={() => showLatin = !showLatin} title={i18n.t('lesson.toggle_latin')} style="align-self: flex-end; margin-bottom: 4px;">
            {i18n.t('scramble.latin_toggle')}: {showLatin ? i18n.t('scramble.latin_on') : i18n.t('scramble.latin_off')}
        </button>
        <div class="challenge-arabic-blank Amiri inline-puzzle-container">
            {#each (activeVerse?.twoBlank ?? '').split(' ') as part, i}
                {@const isBlank = part === '___'}
                {@const blankIndex = (activeVerse?.twoBlank ?? '').split(' ').slice(0, i).filter(p => p === '___').length}
                {@const selectedWord = isBlank ? (isChecked && !isCorrect ? { text: activeVerse.twoCorrect[blankIndex] } : selectedWords[blankIndex]) : null}

                {#if isBlank}
                    {#if selectedWord}
                        <button class="inline-placed" 
                                class:correct-revealed={isChecked && !isCorrect}
                                onclick={() => { if (!isChecked && !isCorrect) toggleWordSelection(selectedWord); }} 
                                disabled={isChecked}
                                title={isChecked ? '' : i18n.t('scramble.tap_cancel')}>
                            {@html getTajweedHTML ? getTajweedHTML(selectedWord.text) : selectedWord.text}
                        </button>
                    {:else}
                        <span class="inline-blank-placeholder">_____</span>
                    {/if}
                {:else}
                    <span 
                        class="clickable-word-question" 
                        class:disabled={isChecked}
                        onclick={(e) => { e.stopPropagation(); if (!isChecked) playWordAudio(part); }}
                        onkeydown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); if (!isChecked) playWordAudio(part); } }}
                        role="button"
                        tabindex={isChecked ? "-1" : "0"}
                        title={isChecked ? '' : i18n.t('scramble.tap_word_audio')}
                    >
                        {@html getTajweedHTML ? getTajweedHTML(part) : part}
                    </span>
                {/if}
                {' '}
            {/each}
        </div>
        {#if showLatin && activeVerse?.transliteration}
            <div class="question-latin">{activeVerse.transliteration}</div>
        {/if}
    {/if}

    {#if showLatin && activeVerse?.transliteration && type === 'audio_scramble'}
        <div class="question-latin">{activeVerse.transliteration}</div>
    {/if}
    
    {#if type !== 'puzzle_two'}
        <div class="scramble-drop-shelf" class:correct={isChecked && isCorrect} class:wrong={isChecked && !isCorrect} class:two-blank={type === 'puzzle_two'}>
            {#if selectedWords.length === 0}
                <span class="drop-shelf-placeholder">
                    {#if type === 'puzzle_total'}
                        {i18n.t('scramble.placeholder_total')}
                    {:else}
                        {i18n.t('scramble.placeholder_default')}
                    {/if}
                </span>
            {/if}
            {#each (isChecked && !isCorrect ? (type === 'puzzle_two' ? activeVerse.twoCorrect.map((w, idx) => ({ id: idx, text: w })) : activeVerse.words.map((w, idx) => ({ id: idx, text: w }))) : selectedWords) as word, idx}
                <button 
                    class="scramble-word-pill" 
                    class:dragging={draggedIndex === idx}
                    class:drag-over={hoverIndex === idx}
                    draggable={!isChecked}
                    data-index={idx}
                    onclick={() => toggleWordSelection(word)} 
                    disabled={isChecked} 
                    class:correct-revealed={isChecked && !isCorrect}
                    
                    ondragstart={(e) => handleDragStart(e, idx)}
                    ondragover={(e) => handleDragOver(e, idx)}
                    ondragend={handleDragEnd}
                    ondrop={(e) => handleDrop(e, idx)}
                    
                    ontouchstart={(e) => handleTouchStart(e, idx)}
                    ontouchmove={handleTouchMove}
                    ontouchend={handleTouchEnd}
                >
                    <span class="arabic-text">{@html getTajweedHTML ? getTajweedHTML(word.text) : word.text}</span>
                    {#if showLatin && wordTransliterations[word.text]}
                        <span class="latin-text-mini">{wordTransliterations[word.text]}</span>
                    {/if}
                </button>
            {/each}
        </div>
    {/if}
    
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
                    <span class="arabic-text">{@html getTajweedHTML ? getTajweedHTML(choice) : choice}</span>
                    {#if showLatin && wordTransliterations[choice]}
                        <span class="latin-text-mini">{wordTransliterations[choice]}</span>
                    {/if}
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
                    <span class="arabic-text">{@html getTajweedHTML ? getTajweedHTML(word.text) : word.text}</span>
                    {#if showLatin && wordTransliterations[word.text]}
                        <span class="latin-text-mini">{wordTransliterations[word.text]}</span>
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
    .challenge-arabic-blank.inline-puzzle-container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .inline-blank-placeholder {
        color: #cbd5e1;
        border-bottom: 2px dashed #cbd5e1;
        padding: 0 4px;
        margin: 0 4px;
        font-family: 'Inter', sans-serif;
        letter-spacing: 2px;
    }
    .inline-placed {
        background: transparent;
        border: none;
        border-bottom: 2px solid #00978a;
        color: #1e293b;
        font-size: inherit;
        font-family: inherit;
        padding: 0 4px;
        margin: 0 4px;
        cursor: pointer;
        display: inline-block;
        border-radius: 0;
        transition: all 0.15s ease;
    }
    .inline-placed:hover:not(:disabled) {
        background: rgba(0, 151, 138, 0.1);
        transform: translateY(-1px);
    }
    .inline-placed.correct-revealed {
        border-bottom-color: #22c55e !important;
        color: #166534 !important;
        pointer-events: none;
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
        padding: 24px 0 12px 0;
        direction: rtl;
    }
    .scramble-word-pill {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 14px 16px 8px 16px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 12px;
        background: #fff;
        color: #3c3c3c;
        cursor: pointer;
        transition: all 0.1s;
        box-sizing: border-box;
        min-width: 60px;
    }
    .scramble-word-pill .arabic-text {
        font-size: 18px;
        font-weight: 700;
        font-family: "Amiri", serif;
        direction: rtl;
        line-height: 1.1;
    }
    .latin-text-mini {
        font-size: 11px;
        font-weight: 700;
        color: #00978a;
        margin-top: 3px;
        font-style: italic;
        font-family: "Outfit", "Inter", sans-serif;
        line-height: 1.1;
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
    .scramble-word-pill.dragging {
        opacity: 0.4;
        border: 2px dashed #00978a !important;
        background: #f0fdfa !important;
    }
    .scramble-word-pill.drag-over {
        border-color: #00978a !important;
        transform: scale(1.08) translateY(-2px) !important;
        box-shadow: 0 10px 15px -3px rgba(0, 151, 138, 0.2), 0 4px 6px -4px rgba(0, 151, 138, 0.2) !important;
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
    .audio-circle-play:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        border-bottom-width: 2px !important;
        transform: none !important;
    }
    .loop-pill:disabled {
        opacity: 0.5;
        cursor: default !important;
        pointer-events: none !important;
        transform: none !important;
    }
    .clickable-word-question {
        display: inline-block;
        cursor: pointer;
        padding: 0 4px;
        border-radius: 6px;
        transition: all 0.15s ease;
    }
    .clickable-word-question:hover:not(.disabled) {
        background: rgba(0, 151, 138, 0.15);
        color: #00978a;
        transform: translateY(-1px);
    }
    .clickable-word-question:active:not(.disabled) {
        transform: translateY(0);
    }
    .clickable-word-question.disabled {
        cursor: default !important;
        pointer-events: none !important;
        background: none !important;
        color: inherit !important;
        transform: none !important;
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
    .question-latin {
        font-size: 12px;
        font-weight: 600;
        color: #00978a;
        font-style: italic;
        text-align: center;
        direction: ltr;
        width: 100%;
        margin-top: 8px;
    }
</style>
