<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const tadabburSteps = $derived([
        { t: "At-Tilawah", d: i18n.t('tadabbur.s1d'), i: "📖" },
        { t: "Al-Fahmu", d: i18n.t('tadabbur.s2d'), i: "📚" },
        { t: "Al-Aqlu", d: i18n.t('tadabbur.s3d'), i: "👳" },
        { t: "Al-Fikru", d: i18n.t('tadabbur.s4d'), i: "🌐" },
        { t: "Adz-Dzikru", d: i18n.t('tadabbur.s5d'), i: "👤", hasTextarea: true },
        { t: "Al-Qoulu", d: i18n.t('tadabbur.s6d'), i: "✨" },
        { t: "Al-Amalu", d: i18n.t('tadabbur.s7d'), i: "✅", hasOptions: true },
    ]);

    const step = $derived(tadabburSteps[currentStep]);

    const themes = $derived([
        { t: i18n.t('tadabbur.t1'), c: "blue" },
        { t: i18n.t('tadabbur.t2'), c: "green" },
        { t: i18n.t('tadabbur.t3'), c: "orange" },
        { t: i18n.t('tadabbur.t4'), c: "red" },
        { t: i18n.t('tadabbur.t5'), c: "purple" },
        { t: i18n.t('tadabbur.t6'), c: "cyan" },
    ]);

    let currentStep = $state(-1); // -1 means list view

    function nextStep() {
        if (currentStep < tadabburSteps.length - 1) {
            currentStep++;
        } else {
            alert(i18n.t('tadabbur.complete'));
            currentStep = -1;
            appState.go('learn');
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
        } else {
            currentStep = -1;
        }
    }
</script>

<div class="screen">
    <div class="topbar">
        <button onclick={() => currentStep = -1} style="background: none; border: none; cursor: pointer">
            <i class="ti ti-arrow-left" style="font-size: 20px; color: #afafaf"></i>
        </button>
        <span style="font-size: 15px; font-weight: 800; color: #3c3c3c; flex: 1; text-align: center;">{i18n.t('tadabbur.title')}</span>
        <div style="width: 28px"></div>
    </div>

    {#if currentStep === -1}
        <div class="scroll-content" style="padding: 0 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 12px; margin-top: 10px;">
                <button class="btn-duo btn-green small-btn" onclick={() => currentStep = 0}>{i18n.t('tadabbur.guided')}</button>
                <button class="btn-duo btn-outline small-btn disabled" title="Unlock setelah 10 sesi">{i18n.t('tadabbur.free')}</button>
            </div>

            <div class="verse-card">
                <div class="verse-label">{i18n.t('tadabbur.verse_today')}</div>
                <div class="arabic-text">تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ</div>
                <div class="translation">"{i18n.t('tadabbur.verse_trans')}"</div>
                <div class="reference">Al-Mulk: 1</div>
            </div>

            <div class="section-label" style="padding: 0; margin: 10px 0 10px">{i18n.t('tadabbur.themes')}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px;">
                {#each themes as theme}
                    <button class="theme-card {theme.c}">
                        {theme.t}
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <div class="scroll-content" style="padding: 10px 16px;">
            <div style="font-size:11px;font-weight:800;color:#afafaf;margin-bottom:6px;text-transform:uppercase;">
                {i18n.t('lesson.step')} {currentStep + 1} {i18n.t('tadabbur.step_of')}: {step.t}
            </div>
            
            <div class="step-card">
                <div style="font-size:48px;margin-bottom:16px;">{step.i}</div>
                <div style="font-size:20px;font-weight:900;color:#3c3c3c;margin-bottom:12px;">{step.t}</div>
                <div style="font-size:14px;font-weight:700;color:#afafaf;line-height:1.6;">{step.d}</div>
                
                {#if step.hasTextarea}
                    <textarea placeholder={i18n.t('tadabbur.reflect')} class="step-textarea"></textarea>
                {/if}

                {#if step.hasOptions}
                    <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">
                        <button class="option-card" onclick={(e) => e.currentTarget.classList.toggle('selected')}>{i18n.t('tadabbur.a1')}</button>
                        <button class="option-card" onclick={(e) => e.currentTarget.classList.toggle('selected')}>{i18n.t('tadabbur.a2')}</button>
                        <button class="option-card" onclick={(e) => e.currentTarget.classList.toggle('selected')}>{i18n.t('tadabbur.a3')}</button>
                    </div>
                {/if}
            </div>

            <div style="display:flex;gap:10px; margin-top: 20px;">
                <button class="btn-duo btn-outline" style="flex:1;" onclick={prevStep}>{i18n.t('tadabbur.back')}</button>
                <button class="btn-duo btn-green" style="flex:2;" onclick={nextStep}>
                    {currentStep < 6 ? i18n.t('tadabbur.next') : i18n.t('tadabbur.save')}
                </button>
            </div>
        </div>
    {/if}

    {#if currentStep === -1}
        <BottomNav active="tadabbur" />
    {/if}
</div>

<style>
    .small-btn {
        flex: 1;
        padding: 10px;
        font-size: 11px;
        border-radius: 12px;
    }
    .disabled {
        color: #afafaf;
        border-color: #eee;
        cursor: not-allowed;
    }
    .verse-card {
        background: linear-gradient(135deg, #1a6b3c, #2ea65c);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 14px;
        box-shadow: 0 4px 12px rgba(46, 166, 92, 0.2);
    }
    .verse-label {
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 10px;
    }
    .arabic-text {
        font-size: 22px;
        font-family: serif;
        direction: rtl;
        line-height: 1.8;
        color: #fff;
        margin-bottom: 12px;
    }
    .translation {
        font-size: 13px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        font-style: italic;
    }
    .reference {
        font-size: 11px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 6px;
    }
    .theme-card {
        padding: 16px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 800;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
    }
    .theme-card.blue { background: #ddf4ff; color: #0898dc; border-bottom: 4px solid #0898dc; }
    .theme-card.green { background: #d7ffb2; color: #46a302; border-bottom: 4px solid #46a302; }
    .theme-card.orange { background: #fff7e6; color: #cc7000; border-bottom: 4px solid #cc7000; }
    .theme-card.red { background: #ffdfe0; color: #cc0000; border-bottom: 4px solid #cc0000; }
    .theme-card.purple { background: #f3e5f5; color: #7b1fa2; border-bottom: 4px solid #7b1fa2; }
    .theme-card.cyan { background: #e0f7fa; color: #00838f; border-bottom: 4px solid #00838f; }

    .theme-card:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }

    .step-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 4px 0 #e5e5e5;
    }
    .step-textarea {
        width: 100%;
        height: 100px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        padding: 12px;
        margin-top: 16px;
        font-family: inherit;
        outline: none;
        resize: none;
        font-size: 14px;
    }
    .option-card {
        width: 100%;
        padding: 14px;
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
    }
    .option-card.selected {
        border-color: #1cb0f6;
        border-bottom-color: #0898dc;
        background: #ddf4ff;
        color: #0898dc;
    }
</style>
