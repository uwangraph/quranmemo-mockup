<script>
    import { appState } from '$lib/app.svelte.js';

    let { 
        type, 
        activeVerse, 
        selectedOptionIdx = $bindable(), 
        isChecked, 
        isCorrect = false,
        getTajweedHTML,
        playWordAudio,
        togglePlay
    } = $props();

    let choices = $derived(type === 'fill_front' ? activeVerse.frontChoices : (type === 'fill_back' ? activeVerse.endChoices : activeVerse.middleChoices));
    let correctIdx = $derived(type === 'fill_front' ? 0 : (type === 'fill_back' ? 1 : 1));

    // Get the text to show in the blank
    let blankText = $derived.by(() => {
        if (selectedOptionIdx === null) return null;
        if (isChecked && !isCorrect) {
            // Show correct answer when checked and wrong
            return choices[correctIdx];
        }
        return choices[selectedOptionIdx];
    });

    let blankWords = $derived(
        type === 'fill_front' ? activeVerse.frontBlank.split(' ') :
        (type === 'fill_back' ? activeVerse.endBlank.split(' ') : activeVerse.middleBlank.split(' '))
    );
    let firstBlankIdx = $derived(blankWords.indexOf('___'));
</script>

<div class="choice-challenge-container">
    <div class="challenge-arabic-blank Amiri">
        
        {#each blankWords as part, idx}
            {#if part === '___'}
                {#if blankText !== null}
                    {#if idx === firstBlankIdx}
                        <span class="filled-text" class:revealed-correct={isChecked && !isCorrect} class:correct-filled={isChecked && isCorrect}>{@html getTajweedHTML ? getTajweedHTML(blankText) : blankText}</span>
                    {/if}
                {:else}
                    <span style="color: #cbd5e1; border-bottom: 2px dashed #cbd5e1; padding: 0 4px; margin: 0 4px;">___</span>
                {/if}
            {:else}
                <span 
                    class="clickable-word-question" 
                    class:disabled={isChecked}
                    onclick={(e) => { e.stopPropagation(); if (!isChecked) playWordAudio(part); }}
                    onkeydown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); if (!isChecked) playWordAudio(part); } }}
                    role="button"
                    tabindex={isChecked ? "-1" : "0"}
                    title={isChecked ? "" : "Klik untuk mendengar pelafalan kata ini"}
                >
                    {@html getTajweedHTML ? getTajweedHTML(part) : part}
                </span>
            {/if}
            {' '}
        {/each}
    </div>
    
    <div class="choice-options-column">
        
        {#each choices as choice, idx}
            <button 
                class="choice-card-button" 
                class:selected={selectedOptionIdx === idx}
                class:correct={isChecked && idx === correctIdx}
                class:wrong={isChecked && selectedOptionIdx === idx && idx !== correctIdx}
                onclick={() => {
                    if (!isChecked) {
                        selectedOptionIdx = idx;
                        playWordAudio(choice);
                    }
                }}
                disabled={isChecked}
            >
                <span class="choice-index-circle">{idx + 1}</span>
                <span class="choice-text Amiri">{@html getTajweedHTML ? getTajweedHTML(choice) : choice}</span>
            </button>
        {/each}
    </div>
</div>

<style>
    .choice-challenge-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        box-sizing: border-box;
    }
    .challenge-arabic-blank {
        font-size: 26px;
        line-height: 2.2;
        text-align: center;
        color: #1e293b;
        background: #fafafa;
        border: 2px dashed #cbd5e1;
        border-radius: 20px;
        padding: 40px 24px;
        direction: rtl;
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
    .choice-options-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .choice-card-button {
        width: 100%;
        display: flex;
        align-items: center;
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 14px 16px;
        cursor: pointer;
        text-align: left;
        transition: all 0.1s;
        box-sizing: border-box;
    }
    .choice-card-button:hover:not(:disabled) {
        border-color: #cbd5e1;
    }
    .choice-card-button:active:not(:disabled) {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .choice-card-button.selected {
        border-color: #00978A;
        background: #e0f5f3;
    }
    .choice-card-button.selected .choice-index-circle {
        background: #00978A;
        border-color: #00978A;
        color: #fff;
    }
    .choice-card-button.correct {
        border-color: #22c55e;
        background: #f0fdf4;
    }
    .choice-card-button.correct .choice-index-circle {
        background: #22c55e;
        border-color: #22c55e;
        color: #fff;
    }
    .choice-card-button.wrong {
        border-color: #ff4b4b;
        background: #ffebeb;
    }
    .choice-card-button.wrong .choice-index-circle {
        background: #ff4b4b;
        border-color: #ff4b4b;
        color: #fff;
    }
    .choice-index-circle {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        border: 2px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
        color: #94a3b8;
        margin-right: 14px;
        flex-shrink: 0;
    }
    .choice-text {
        font-size: 20px;
        color: #3c3c3c;
        flex: 1;
        text-align: right;
        direction: rtl;
    }

    .Amiri {
        font-family: 'Amiri', serif;
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
    }</style>
