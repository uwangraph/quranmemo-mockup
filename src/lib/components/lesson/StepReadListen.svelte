<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
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
        isChecked = false,
        onOpenTajwid
    } = $props();

    let isLoopDropdownOpen = $state(false);
</script>

<div class="verse-display-box" style="position: relative;">
    {#if !activeVerse}
        <div style="text-align:center; padding: 40px; color: #afafaf;">{i18n.t('lesson.loading_verse')}</div>
    {:else}

    <div class="audio-circle-row">
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
        <div class="translit-focus-text">"{activeVerse.transliteration}"</div>
    {/if}
    <div class="trans-focus-text">{i18n.t(activeVerse.translationKey)}</div>

    <!-- Looping Selector Dropdown (Custom) -->
    <div class="loop-selector-row">
        <label class="loop-label" for="loop-select">
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
        color: #00978a;
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
