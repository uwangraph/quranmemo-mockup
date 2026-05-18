<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    import VideoCallContainer from '$lib/components/live-marking/VideoCallContainer.svelte';
    import MarkingTypeSelector from '$lib/components/live-marking/MarkingTypeSelector.svelte';
    import MarkingAnalytics from '$lib/components/live-marking/MarkingAnalytics.svelte';
    
    let corrections = $state([]);
    let isFinished = $state(false);
    let selectedWord = $state(null);
    let showTypeSelector = $state(false);
    
    // Breaking down Al-Mulk 12 into words
    const words = [
        "إِنَّ", "ٱلَّذِينَ", "يَخۡشَوۡنَ", "رَبَّهُم", "بِٱلۡغَيۡبِ", "لَهُم", "مَّغۡفِرَةٞ", "وَأَجۡرٞ", "كَبِيرٞ"
    ];

    function openSelector(word) {
        selectedWord = word;
        showTypeSelector = true;
    }

    function mark(typeKey) {
        if (!selectedWord) return;
        
        const type = i18n.t(`marking.type_${typeKey}`);
        const colorMap = {
            forget: "#ff4b4b",
            tajwid: "#ff9600",
            makhraj: "#1cb0f6"
        };
        
        corrections = [{ word: selectedWord, type, typeKey, color: colorMap[typeKey] }, ...corrections];
        showTypeSelector = false;
        selectedWord = null;
    }
    
    function removeCorrection(index) {
        corrections = corrections.filter((_, i) => i !== index);
    }

    const mistakeStats = $derived({
        forget: corrections.filter(c => c.typeKey === 'forget').length,
        tajwid: corrections.filter(c => c.typeKey === 'tajwid').length,
        makhraj: corrections.filter(c => c.typeKey === 'makhraj').length,
        total: corrections.length
    });
</script>

<div class="screen">
    {#if !isFinished}
        <div class="marking-header">
            <button aria-label="Close" onclick={() => appState.go('musyrif')} class="close-btn">
                <i class="ti ti-arrow-left"></i>
            </button>
            <div style="flex: 1">
                <div style="font-size: 14px; font-weight: 900">Ahmad Hafidz</div>
                <div style="font-size: 10px; font-weight: 700; color: #00978A">🔴 {i18n.t('marking.live')}</div>
            </div>
            <div class="timer-bubble">04:20</div>
        </div>

        <div class="scroll-content no-scrollbar" style="padding-top: 0;">
            <!-- Video Call Preview Area (Top) -->
            <VideoCallContainer />

            <!-- Interaction Area (Bottom) -->
            <div class="workspace">
                <div class="instruction">{i18n.t('marking.instruction')}</div>
                
                <div class="quran-text-container">
                    <div class="quran-text">
                        {#each words as word}
                            {@const correction = corrections.find(c => c.word === word)}
                            <button 
                                class="marking-word" 
                                class:has-mistake={!!correction}
                                style={correction ? `background: ${correction.color}22; color: ${correction.color}; border-bottom-color: ${correction.color};` : ''}
                                onclick={() => openSelector(word)}
                            >
                                {word}
                            </button>
                        {/each}
                    </div>
                </div>

                <div style="margin-top: 24px; width: 100%;">
                    <div class="section-label" style="padding: 0; margin-bottom: 12px; font-size: 13px; font-weight: 800; color: #3c3c3c; text-transform: uppercase;">{i18n.t('marking.log')}</div>
                    <div class="log-container">
                        {#if corrections.length === 0}
                            <div class="empty-log">
                                <i class="ti ti-notes" style="font-size: 24px; margin-bottom: 8px; opacity: 0.5;"></i>
                                <div>{i18n.t('marking.empty')}</div>
                            </div>
                        {:else}
                            {#each corrections as item, i}
                                <div class="log-entry" style="border-left: 4px solid {item.color}">
                                    <div style="flex: 1">
                                        <div style="font-size: 10px; font-weight: 800; color: {item.color}; text-transform: uppercase;">{item.type}</div>
                                        <div style="font-size: 14px; font-weight: 800; color: #3c3c3c;">"{item.word}"</div>
                                    </div>
                                    <button aria-label="Remove" onclick={() => removeCorrection(i)} class="remove-btn">
                                        <i class="ti ti-trash"></i>
                                    </button>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class="marking-footer">
            <button class="btn-duo btn-outline" style="flex: 1; font-size: 13px">{i18n.t('marking.feedback')}</button>
            <button class="btn-duo btn-green" style="flex: 1; font-size: 13px" onclick={() => isFinished = true}>{i18n.t('marking.finish')}</button>
        </div>

        {#if showTypeSelector}
            <MarkingTypeSelector 
                {selectedWord} 
                onClose={() => showTypeSelector = false} 
                onMark={mark} 
            />
        {/if}
    {:else}
        <MarkingAnalytics {mistakeStats} />
    {/if}
</div>

<style>
    .screen { position: relative; overflow: hidden; }
    .marking-header { background: #fff; padding: 12px 20px; color: #3c3c3c; display: flex; align-items: center; gap: 12px; z-index: 10; border-bottom: 2px solid #f0f0f0; }
    .close-btn { background: none; border: none; cursor: pointer; color: #afafaf; font-size: 20px; }
    .timer-bubble { background: #ffeded; color: #ff4b4b; padding: 4px 12px; border-radius: 100px; font-size: 13px; font-weight: 900; border: 1px solid #ff4b4b; }

    .workspace { padding: 30px 24px; background: rgba(255,255,255,0.9); border-radius: 40px 40px 0 0; margin-top: -40px; position: relative; z-index: 30; min-height: 500px; box-shadow: 0 -20px 60px rgba(0,0,0,0.15); backdrop-filter: blur(30px); border-top: 1px solid rgba(255,255,255,0.8); }
    .instruction { font-size: 11px; font-weight: 800; color: #afafaf; margin-bottom: 20px; text-transform: uppercase; text-align: center; }
    .quran-text-container { background: #fff; padding: 24px; border-radius: 24px; border: 2px solid #e5e5e5; border-bottom-width: 5px; width: 100%; }
    .quran-text { font-size: 32px; font-family: "Traditional Arabic", serif; direction: rtl; line-height: 2.5; color: #3c3c3c; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px; }
    
    .marking-word { background: none; border: none; font-family: inherit; font-size: inherit; color: inherit; cursor: pointer; border-radius: 12px; padding: 6px 12px; transition: all 0.2s; border-bottom: 3px solid transparent; }
    .marking-word:hover { background: #f7f7f7; }
    .marking-word.has-mistake { font-weight: bold; }
    
    .log-container { display: flex; flex-direction: column; gap: 12px; }
    .log-entry { background: #fff; border: 2px solid #e5e5e5; border-bottom-width: 4px; padding: 14px 18px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
    .empty-log { text-align: center; padding: 30px 20px; color: #afafaf; font-size: 13px; font-weight: 800; }
    .remove-btn { background: none; border: none; cursor: pointer; color: #afafaf; font-size: 18px; padding: 8px; }

    .marking-footer { padding: 20px; border-top: 2px solid #e5e5e5; display: flex; gap: 12px; background: #fff; }
</style>
