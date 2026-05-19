<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    const questions = $derived([
        {
            q: i18n.t('onboarding.q1'),
            opts: [
                { t: i18n.t('onboarding.q1o1'), i: "🕌" },
                { t: i18n.t('onboarding.q1o2'), i: "🎓" },
                { t: i18n.t('onboarding.q1o3'), i: "👨‍👩‍👧‍👦" },
                { t: i18n.t('onboarding.q1o4'), i: "🍃" },
            ],
        },
        {
            q: i18n.t('onboarding.q2'),
            opts: [
                { t: i18n.t('onboarding.q2o1'), i: "🌱", action: "skip_placement" },
                { t: i18n.t('onboarding.q2o2'), i: "📖" },
                { t: i18n.t('onboarding.q2o3'), i: "📚" },
                { t: i18n.t('onboarding.q2o4'), i: "🏆" },
            ],
        },
        {
            q: i18n.t('onboarding.q3'),
            opts: [
                { t: i18n.t('onboarding.q3o1'), i: "🅰️" },
                { t: i18n.t('onboarding.q3o2'), i: "🗣️" },
                { t: i18n.t('onboarding.q3o3'), i: "✨" },
                { t: i18n.t('onboarding.q3o4'), i: "💎" },
            ],
        },
        {
            q: i18n.t('onboarding.q4'),
            opts: [
                { t: i18n.t('onboarding.q4o1'), i: "☕" },
                { t: i18n.t('onboarding.q4o2'), i: "⏰" },
                { t: i18n.t('onboarding.q4o3'), i: "🎯" },
                { t: i18n.t('onboarding.q4o4'), i: "🔥" },
            ],
        },
        {
            q: i18n.t('onboarding.q5'),
            opts: [
                { t: i18n.t('onboarding.q5o1'), i: "🌅" },
                { t: i18n.t('onboarding.q5o2'), i: "☀️" },
                { t: i18n.t('onboarding.q5o3'), i: "🌇" },
                { t: i18n.t('onboarding.q5o4'), i: "🌙" },
            ],
        },
    ]);

    let answers = $state({}); // key = question index, value = option index
    let currentQ = $state(0);
    let selectedOpt = $state(null);
    let specialAction = $state(null);

    const q = $derived(questions[currentQ]);
    const progress = $derived((currentQ + 1) * 20);

    function selectOption(idx, action) {
        selectedOpt = idx;
        specialAction = action;
        answers[currentQ] = idx;
    }

    // Determine learning path from Q2 (experience) and Q3 (tajwid)
    // Q2: 0=from zero, 1=short surahs, 2=1-3 juz, 3=>3 juz
    // Q3: 0=spelling, 1=fluent no tajwid, 2=fluent+tajwid, 3=very fluent
    function computeLearningPath() {
        const q2 = answers[1] ?? 0; // experience
        const q3 = answers[2] ?? 0; // tajwid quality
        if (q2 === 3) return 'pro';          // >3 juz memorized → Pro
        if (q2 === 2 && q3 >= 2) return 'mid'; // 1-3 juz + good tajwid → Mid
        if (q2 === 1 && q3 >= 2) return 'mid'; // short surahs + good tajwid → Mid
        return 'beginner';                   // all other cases → Beginner
    }

    function nextQuestion() {
        if (selectedOpt === null) return;

        if (currentQ < questions.length - 1) {
            currentQ++;
            selectedOpt = null;
            specialAction = null;
        } else {
            // Final step — set learning path then navigate
            const path = computeLearningPath();
            appState.setLearningPath(path);
            appState.go('learn');
        }
    }
</script>

<div class="screen">
    <div class="topbar">
        <div class="prog-bar-bg">
            <div class="prog-bar-fill" style="width: {progress}%"></div>
        </div>
    </div>

    <div class="content scroll-content" style="padding: 20px 20px 0;">
        <div style="font-size:13px;font-weight:800;color:#afafaf;margin-bottom:10px;text-transform:uppercase;">
            {i18n.t('onboarding.step')} {currentQ + 1} {i18n.t('onboarding.step_of')}
        </div>
        <div style="font-size:22px;font-weight:900;color:#3c3c3c;margin-bottom:24px;">
            {q.q}
        </div>

        <div style="display:grid;grid-template-columns:1fr;gap:12px;">
            {#each q.opts as opt, i}
                <button 
                    class="option-card" 
                    class:selected={selectedOpt === i}
                    onclick={() => selectOption(i, opt.action)}
                >
                    <div style="font-size:24px;width:40px;text-align:center;">{opt.i}</div>
                    <div style="font-size:15px;font-weight:800;">{opt.t}</div>
                </button>
            {/each}
        </div>
    </div>

    <div style="padding: 16px 20px 20px">
        <button
            class="btn-duo"
            class:btn-green={selectedOpt !== null}
            class:btn-disabled={selectedOpt === null}
            onclick={nextQuestion}
        >
            {i18n.t('onboarding.next')}
        </button>
    </div>
</div>

<style>
    .option-card {
        width: 100%;
        padding: 12px 14px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        border-bottom: 4px solid #e5e5e5;
        background: #fff;
        font-family: "Nunito", sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #3c3c3c;
        cursor: pointer;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.1s;
    }
    .option-card:active {
        border-bottom: 2px solid #e5e5e5;
        transform: translateY(2px);
    }
    .option-card.selected {
        border-color: #1cb0f6;
        border-bottom-color: #0898dc;
        background: #ddf4ff;
        color: #0898dc;
    }
</style>
