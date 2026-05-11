<script>
    import { appState } from '$lib/app.svelte.js';
    
    let currentStep = $state(0);
    let isPlaying = $state(false);
    let selectedIdx = $state(null);
    let isChecked = $state(false);
    let isCorrect = $state(false);

    const lessonSteps = [
        { id: "visual", t: "Pemetaan Visual", d: "Melihat satu halaman penuh mushaf tanpa terjemah secara berulang.", i: "🖼️" },
        { id: "konteks", t: "Pemahaman Konteks", d: "Membaca halaman penuh beserta terjemahannya secara mendalam.", i: "📖" },
        { id: "audio-visual", t: "Fokus Audio-Visual", d: "Membaca target ayat sambil mendengarkan lantunan Qari.", i: "🎙️" },
        { id: "penyatuan", t: "Penyatuan Makna", d: "Membaca target ayat, makna, dan audio secara bersamaan.", i: "✨" },
        { id: "fading", t: "Latihan Parsial (Fading)", d: "Membaca teks yang disensor sebagian untuk melatih memori.", i: "🧩" },
        { id: "uji", t: "Uji Mandiri", d: "Tes rekam suara dan bandingkan dengan bacaan asli.", i: "🏆" },
    ];
    
    const fadingOptions = [
        { id: 'A', text: "رَبَّهُم بِٱلۡغَيۡبِ لَهُم مَّغۡفِرَةٞ", correct: false },
        { id: 'B', text: "رَبَّهُم بِٱلۡغَيۡبِ لَهُم مَّغۡفِرَةٞ وَأَجۡرٞ كَبِيرٞ", correct: true },
        { id: 'C', text: "رَبَّهُم سِرٗا وَعَلَانِيَةٗ", correct: false },
        { id: 'D', text: "رَبَّهُم لَهُم أَجۡرٞ غَيۡرُ مَمۡنُونٍ", correct: false }
    ];

    function nextStep() {
        if (currentStep < lessonSteps.length - 1) {
            currentStep++;
            isPlaying = false;
            isChecked = false;
            selectedIdx = null;
        } else {
            appState.go('learn');
        }
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            setTimeout(() => isPlaying = false, 3000);
        }
    }

    function selectOption(idx) {
        if (isChecked) return;
        selectedIdx = idx;
    }

    function checkAnswer() {
        if (selectedIdx === null) return;
        if (isChecked) {
            nextStep();
            return;
        }
        isChecked = true;
        isCorrect = fadingOptions[selectedIdx].correct;
    }
</script>

<div class="screen">
    <div class="topbar">
        <button onclick={() => appState.go('learn')} style="background: none; border: none; cursor: pointer">
            <i class="ti ti-x" style="font-size: 20px; color: #afafaf"></i>
        </button>
        <div class="prog-bar-bg" style="flex: 1">
            <div class="prog-bar-fill" style="width: {(currentStep + 1) * 16.6}%"></div>
        </div>
        <div class="xp-pill">
            <i class="ti ti-bolt" style="font-size: 16px"></i> {(currentStep + 1) * 10}
        </div>
    </div>

    <div class="scroll-content" style="padding: 12px 16px 0">
        {@const step = lessonSteps[currentStep]}
        <div class="instruction-label">Langkah {currentStep + 1}: {step.t}</div>
        
        <div class="exercise-box" class:full-page={currentStep < 2}>
            {#if currentStep < 2}
                <div class="mushaf-page">
                    <div class="arabic-page-text">
                        تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ (1) 
                        ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ (2)
                        ...
                    </div>
                    {#if currentStep === 1}
                        <div class="page-translation">
                            "Mahasuci Allah yang menguasai (segala) kerajaan, dan Dia Mahakuasa atas segala sesuatu. Yang menciptakan mati dan hidup, untuk menguji kamu..."
                        </div>
                    {/if}
                </div>
            {:else if currentStep < 4}
                <div class="sub-instruction">{step.d}</div>
                <div style="display: flex; justify-content: center; margin: 20px 0;">
                    <button class="audio-play-btn" class:playing={isPlaying} onclick={togglePlay}>
                        <i class="ti {isPlaying ? 'ti-player-pause' : 'ti-player-play'}"></i>
                    </button>
                </div>
                <div class="quran-prompt">إِنَّ الَّذِينَ يَخۡشَوۡنَ رَبَّهُم بِٱلۡغَيۡبِ لَهُم مَّغۡفِرَةٞ وَأَجۡرٞ كَبِيرٞ</div>
                {#if currentStep === 3}
                    <div class="translation-hint">"Sesungguhnya orang-orang yang takut kepada Tuhannya yang tidak terlihat oleh mereka, mereka memperoleh ampunan dan pahala yang besar."</div>
                {/if}
            {:else if currentStep === 4}
                <div class="sub-instruction">Lengkapi potongan ayat yang hilang:</div>
                <div class="quran-prompt fading">إِنَّ الَّذِينَ يَخۡشَوۡنَ ...</div>
                <div class="options-list" style="margin-top: 20px;">
                    {#each fadingOptions as opt, i}
                        <button 
                            class="option-card" 
                            class:selected={selectedIdx === i}
                            class:correct={isChecked && opt.correct}
                            class:wrong={isChecked && selectedIdx === i && !opt.correct}
                            onclick={() => selectOption(i)}
                        >
                            <div class="opt-num">{opt.id}</div>
                            <span class="opt-text">{opt.text}</span>
                        </button>
                    {/each}
                </div>
            {:else}
                <div class="sub-instruction">Rekam hafalanmu untuk ayat ini:</div>
                <div class="quran-prompt">إِنَّ الَّذِينَ يَخۡشَوۡنَ رَبَّهُم بِٱلۡغَيۡبِ لَهُم مَّغۡفِرَةٞ وَأَجۡرٞ كَبِيرٞ</div>
                <div style="display: flex; justify-content: center; margin-top: 40px;">
                    <button class="mic-btn" onclick={nextStep}>
                        <i class="ti ti-microphone"></i>
                    </button>
                </div>
                <div style="text-align: center; font-size: 12px; font-weight: 800; color: #1cb0f6; margin-top: 10px;">
                    TEKAN UNTUK MULAI TASMI' AI
                </div>
            {/if}
        </div>

        {#if isChecked && currentStep === 4}
            <div class="feedback-bar" class:feedback-correct={isCorrect} class:feedback-wrong={!isCorrect}>
                {#if isCorrect}
                    <div style="font-size:14px;font-weight:800;color:#46a302;">✓ Benar! Memori Anda tajam! 🎉</div>
                {:else}
                    <div style="font-size:14px;font-weight:800;color:#cc0000;">✗ Kurang tepat. Coba perhatikan lagi.</div>
                {/if}
            </div>
        {/if}
    </div>

    <div style="padding: 12px 16px 16px">
        {#if currentStep === 4}
            <button
                class="btn-duo"
                class:btn-green={selectedIdx !== null && (!isChecked || isCorrect)}
                class:btn-red={isChecked && !isCorrect}
                class:btn-disabled={selectedIdx === null}
                onclick={checkAnswer}
            >
                {isChecked ? (isCorrect ? 'LANJUT' : 'COBA LAGI') : 'PERIKSA'}
            </button>
        {:else if currentStep !== 5}
            <button class="btn-duo btn-green" onclick={nextStep}>
                MENGERTI & LANJUT
            </button>
        {/if}
    </div>
</div>

<style>
    .instruction-label {
        font-size: 11px;
        font-weight: 800;
        color: #afafaf;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 10px;
    }
    .exercise-box {
        background: #f7f7f7;
        border-radius: 16px;
        padding: 16px;
        text-align: center;
        margin-bottom: 16px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .full-page {
        background: #fff;
        border: 2px solid #e5e5e5;
    }
    .mushaf-page {
        font-family: serif;
    }
    .arabic-page-text {
        font-size: 20px;
        line-height: 2.2;
        direction: rtl;
        color: #3c3c3c;
    }
    .page-translation {
        margin-top: 16px;
        font-family: "Nunito", sans-serif;
        font-size: 12px;
        color: #777;
        font-style: italic;
        line-height: 1.5;
    }
    .sub-instruction {
        font-size: 14px;
        color: #3c3c3c;
        font-weight: 700;
        margin-bottom: 15px;
    }
    .audio-play-btn {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: #1cb0f6;
        border: none;
        border-bottom: 4px solid #0898dc;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #fff;
        font-size: 30px;
        transition: all 0.1s;
    }
    .audio-play-btn:active {
        border-bottom-width: 2px;
        transform: translateY(2px);
    }
    .mic-btn {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid #1cb0f6;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #1cb0f6;
        font-size: 36px;
        box-shadow: 0 4px 15px rgba(28, 176, 246, 0.2);
    }
    .quran-prompt {
        font-size: 20px;
        font-family: serif;
        color: #3c3c3c;
        line-height: 1.8;
        direction: rtl;
    }
    .fading { color: #1cb0f6; font-weight: bold; }
    .translation-hint {
        font-size: 12px;
        color: #afafaf;
        margin-top: 10px;
        font-style: italic;
    }
    .options-list { display: flex; flex-direction: column; gap: 8px; }
    .option-card {
        width: 100%;
        padding: 12px 14px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        border-bottom: 4px solid #e5e5e5;
        background: #fff;
        font-family: inherit;
        font-size: 14px;
        font-weight: 700;
        color: #3c3c3c;
        cursor: pointer;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .option-card.selected { border-color: #1cb0f6; border-bottom-color: #0898dc; background: #ddf4ff; color: #0898dc; }
    .option-card.correct { border-color: #58cc02; border-bottom-color: #46a302; background: #d7ffb2; color: #46a302; }
    .option-card.wrong { border-color: #ff4b4b; border-bottom-color: #cc0000; background: #ffdfe0; color: #cc0000; }
    .opt-num {
        width: 28px; height: 28px; border-radius: 8px; border: 2px solid #e5e5e5;
        display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #afafaf; flex-shrink: 0;
    }
    .opt-text { direction: rtl; text-align: right; flex: 1; }
    .feedback-bar { padding: 16px; border-radius: 16px; margin-top: 16px; }
    .feedback-correct { background: #d7ffb2; }
    .feedback-wrong { background: #ffdfe0; }
</style>
