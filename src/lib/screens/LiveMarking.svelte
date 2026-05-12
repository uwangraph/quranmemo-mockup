<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
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
            <button onclick={() => appState.go('musyrif')} class="close-btn">
                <i class="ti ti-arrow-left"></i>
            </button>
            <div style="flex: 1">
                <div style="font-size: 14px; font-weight: 900">Ahmad Hafidz</div>
                <div style="font-size: 10px; font-weight: 700; color: #58cc02">🔴 {i18n.t('marking.live')}</div>
            </div>
            <div class="timer-bubble">04:20</div>
        </div>

        <div class="scroll-content no-scrollbar" style="padding-top: 0;">
            <!-- Video Call Preview Area (Top) -->
            <div class="video-call-container">
                <div class="video-bg-layer" style="background-image: url('/student.png');"></div>
                <div class="video-tint-overlay"></div>
                
                <div class="glass-hud-top">
                    <div class="status-pill-modern">
                        <span class="indicator"></span>
                        <span style="color: #fff; font-size: 11px; font-weight: 900; letter-spacing: 0.5px;">{i18n.t('marking.live_tasmi')}</span>
                    </div>
                </div>

                <div class="participant-dock">
                    <div class="dock-item">
                        <img src="/musyrif.png" alt="you" />
                        <div class="label">{i18n.t('marking.you')}</div>
                    </div>
                </div>

                <div class="call-action-bar">
                    <div class="action-circle"><i class="ti ti-microphone"></i></div>
                    <div class="action-circle"><i class="ti ti-video"></i></div>
                    <div class="action-circle danger" onclick={() => appState.go('musyrif')}><i class="ti ti-phone-off"></i></div>
                </div>

                <div class="main-video-stream">
                    <img src="/student.png" alt="student" />
                </div>
            </div>

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
                    <div class="section-label" style="padding: 0; margin-bottom: 12px;">{i18n.t('marking.log')}</div>
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
                                    <button onclick={() => removeCorrection(i)} class="remove-btn">
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
            <div class="modal-overlay" onclick={() => showTypeSelector = false}>
                <div class="modal-content" onclick={e => e.stopPropagation()}>
                    <div style="font-size: 18px; font-weight: 900; color: #3c3c3c; margin-bottom: 20px; text-align: center;">
                        {selectedWord}
                    </div>
                    <div class="type-grid">
                        <button class="type-btn forget" onclick={() => mark('forget')}>
                            <div class="type-icon">❓</div>
                            <div style="flex: 1">{i18n.t('marking.type_forget')}</div>
                        </button>
                        <button class="type-btn tajwid" onclick={() => mark('tajwid')}>
                            <div class="type-icon">📏</div>
                            <div style="flex: 1">{i18n.t('marking.type_tajwid')}</div>
                        </button>
                        <button class="type-btn makhraj" onclick={() => mark('makhraj')}>
                            <div class="type-icon">🗣️</div>
                            <div style="flex: 1">{i18n.t('marking.type_makhraj')}</div>
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    {:else}
        <div class="analytics-view">
            <div class="analytics-header">
                <div class="success-icon">🏆</div>
                <h1 style="font-size: 24px; font-weight: 900; color: #3c3c3c; margin: 16px 0 4px;">{i18n.t('marking.session_report')}</h1>
                <p style="font-size: 14px; font-weight: 700; color: #afafaf;">Ahmad Hafidz • Al-Mulk: 12</p>
            </div>

            <div class="stats-grid-analytics">
                <div class="stat-card-big">
                    <div class="stat-label-top">{i18n.t('marking.total_mistakes')}</div>
                    <div class="stat-value">{mistakeStats.total}</div>
                </div>
                <div class="stat-card-big">
                    <div class="stat-label-top">{i18n.t('marking.duration')}</div>
                    <div class="stat-value">4:20</div>
                    <div class="stat-unit">{i18n.t('marking.minutes')}</div>
                </div>
            </div>

            <div class="breakdown-section">
                <div class="section-label" style="padding: 0; margin-bottom: 12px;">{i18n.t('marking.summary')}</div>
                <div class="breakdown-list">
                    <div class="breakdown-item">
                        <div class="dot forget"></div>
                        <div style="flex: 1; font-weight: 800;">{i18n.t('marking.type_forget')}</div>
                        <div class="count">{mistakeStats.forget}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="dot tajwid"></div>
                        <div style="flex: 1; font-weight: 800;">{i18n.t('marking.type_tajwid')}</div>
                        <div class="count">{mistakeStats.tajwid}</div>
                    </div>
                    <div class="breakdown-item">
                        <div class="dot makhraj"></div>
                        <div style="flex: 1; font-weight: 800;">{i18n.t('marking.type_makhraj')}</div>
                        <div class="count">{mistakeStats.makhraj}</div>
                    </div>
                </div>
            </div>

            <div style="margin-top: auto; padding-top: 24px;">
                <button class="btn-duo btn-green" style="width: 100%" onclick={() => appState.go('musyrif')}>
                    {i18n.t('marking.back_to_dashboard')}
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .screen {
        position: relative;
        overflow: hidden;
    }
    .marking-header {
        background: #fff;
        padding: 12px 20px;
        color: #3c3c3c;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10;
        border-bottom: 2px solid #f0f0f0;
    }
    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #afafaf;
        font-size: 20px;
    }
    .timer-bubble {
        background: #ffeded;
        color: #ff4b4b;
        padding: 4px 12px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 900;
        border: 1px solid #ff4b4b;
    }

    .video-call-container {
        width: 100%;
        height: 380px;
        background: #000;
        position: relative;
        overflow: hidden;
    }
    .video-bg-layer {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-size: cover;
        background-position: center;
        filter: blur(40px) brightness(0.6);
        transform: scale(1.3);
    }
    .video-tint-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(circle at center, transparent 0%, rgba(255, 150, 0, 0.1) 100%);
        z-index: 2;
    }
    .main-video-stream {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
    }
    .main-video-stream img { 
        height: 100%; 
        width: auto; 
        object-fit: contain;
        filter: drop-shadow(0 20px 60px rgba(0,0,0,0.8));
    }
    
    .participant-dock {
        position: absolute;
        top: 20px;
        right: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 20;
    }
    .dock-item {
        width: 64px;
        height: 84px;
        border-radius: 18px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.2);
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        position: relative;
    }
    .dock-item img { width: 100%; height: 100%; object-fit: cover; }
    .dock-item .label {
        position: absolute;
        bottom: 4px;
        left: 0; right: 0;
        text-align: center;
        font-size: 8px;
        font-weight: 900;
        color: #fff;
        text-transform: uppercase;
    }

    .glass-hud-top {
        position: absolute;
        top: 20px;
        left: 16px;
        z-index: 20;
    }
    .status-pill-modern {
        background: rgba(0,0,0,0.4);
        backdrop-filter: blur(20px);
        padding: 6px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .status-pill-modern .indicator {
        width: 8px;
        height: 8px;
        background: #ff4b4b;
        border-radius: 50%;
        box-shadow: 0 0 10px #ff4b4b;
        animation: pulse-red 1.5s infinite;
    }
    @keyframes pulse-red { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

    .call-action-bar {
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(30px);
        padding: 10px 20px;
        border-radius: 24px;
        display: flex;
        gap: 20px;
        z-index: 20;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .action-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s;
        cursor: pointer;
    }
    .action-circle:active { transform: scale(0.9); }
    .action-circle.danger { background: var(--duo-red); }

    .workspace {
        padding: 30px 24px;
        background: rgba(255,255,255,0.9);
        border-radius: 40px 40px 0 0;
        margin-top: -40px;
        position: relative;
        z-index: 30;
        min-height: 500px;
        box-shadow: 0 -20px 60px rgba(0,0,0,0.15);
        backdrop-filter: blur(30px);
        border-top: 1px solid rgba(255,255,255,0.8);
    }

    .instruction {
        font-size: 11px;
        font-weight: 800;
        color: #afafaf;
        margin-bottom: 20px;
        text-transform: uppercase;
        text-align: center;
    }
    .quran-text-container {
        background: #fff;
        padding: 24px;
        border-radius: 24px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 5px;
        width: 100%;
    }
    .quran-text {
        font-size: 32px;
        font-family: "Traditional Arabic", serif;
        direction: rtl;
        line-height: 2.5;
        color: #3c3c3c;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px 16px;
    }
    .marking-word {
        background: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: pointer;
        border-radius: 12px;
        padding: 6px 12px;
        transition: all 0.2s;
        border-bottom: 3px solid transparent;
    }
    .marking-word:hover { background: #f7f7f7; }
    .marking-word.has-mistake {
        font-weight: bold;
    }
    
    .log-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .log-entry {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        padding: 14px 18px;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .empty-log {
        text-align: center;
        padding: 30px 20px;
        color: #afafaf;
        font-size: 13px;
        font-weight: 800;
    }
    .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #afafaf;
        font-size: 18px;
        padding: 8px;
    }

    .marking-footer {
        padding: 20px;
        border-top: 2px solid #e5e5e5;
        display: flex;
        gap: 12px;
        background: #fff;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: flex-end; /* Mobile style slide-up */
        justify-content: center;
        z-index: 100;
    }
    .modal-content {
        background: #fff;
        width: 100%;
        border-radius: 32px 32px 0 0;
        padding: 32px 24px;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease-out;
    }
    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }
    .type-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
    }
    .type-btn {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 18px 24px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 5px;
        border-radius: 20px;
        background: #fff;
        font-family: inherit;
        font-size: 16px;
        font-weight: 900;
        color: #3c3c3c;
        cursor: pointer;
        transition: all 0.1s;
    }
    .type-btn:active { transform: translateY(2px); border-bottom-width: 2px; }
    .type-icon { font-size: 24px; }
    .type-btn.forget { border-color: #ff4b4b; color: #ff4b4b; }
    .type-btn.tajwid { border-color: #ff9600; color: #ff9600; }
    .type-btn.makhraj { border-color: #1cb0f6; color: #1cb0f6; }

    /* Analytics styles */
    .analytics-view { padding: 40px 24px; display: flex; flex-direction: column; height: 100%; text-align: center; }
    .analytics-header { margin-bottom: 32px; }
    .success-icon { font-size: 80px; margin-bottom: 8px; }
    .stats-grid-analytics { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .stat-card-big { background: #f7f7f7; border: 2px solid #e5e5e5; border-radius: 20px; padding: 20px; }
    .stat-label-top { font-size: 10px; font-weight: 800; color: #afafaf; text-transform: uppercase; margin-bottom: 4px;}
    .stat-value { font-size: 28px; font-weight: 900; color: #3c3c3c; }
    .stat-unit { font-size: 10px; font-weight: 800; color: #afafaf; }
    .breakdown-list { background: #fff; border: 2px solid #e5e5e5; border-radius: 20px; padding: 8px; }
    .breakdown-item { display: flex; align-items: center; gap: 12px; padding: 12px; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    .breakdown-item:last-child { border-bottom: none; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.forget { background: #ff4b4b; }
    .dot.tajwid { background: #ff9600; }
    .dot.makhraj { background: #1cb0f6; }
    .count { font-weight: 900; color: #3c3c3c; }
</style>
