<script>
    import { appState } from '$lib/app.svelte.js';

    const questions = [
        {
            q: "Apa motivasi utamamu menghafal Al-Quran?",
            opts: [
                { t: "Sholat lebih khusyuk", i: "🕌" },
                { t: "Target khatam / sanad", i: "🎓" },
                { t: "Teladan keluarga", i: "👨‍👩‍👧‍👦" },
                { t: "Ketenangan hati", i: "🍃" },
            ],
        },
        {
            q: "Sejauh mana pengalamanmu menghafal?",
            opts: [
                { t: "Baru mulai dari nol", i: "🌱", action: "skip_placement" },
                { t: "Hafal surah pendek", i: "📖" },
                { t: "Hafal 1 - 3 Juz", i: "📚" },
                { t: "Hafal > 3 Juz", i: "🏆" },
            ],
        },
        {
            q: "Bagaimana kemampuan membaca (Tahsin) kamu?",
            opts: [
                { t: "Masih mengeja huruf", i: "🅰️" },
                { t: "Lancar tanpa tajwid", i: "🗣️" },
                { t: "Lancar & paham tajwid", i: "✨" },
                { t: "Sangat fasih / Qari", i: "💎" },
            ],
        },
        {
            q: "Berapa target waktu belajarmu per hari?",
            opts: [
                { t: "Santai (5 menit)", i: "☕" },
                { t: "Reguler (10 menit)", i: "⏰" },
                { t: "Fokus (15 menit)", i: "🎯" },
                { t: "Intensif (30+ menit)", i: "🔥" },
            ],
        },
        {
            q: "Kapan waktu favoritmu berinteraksi?",
            opts: [
                { t: "Ba'da Subuh / Pagi", i: "🌅" },
                { t: "Istirahat Siang", i: "☀️" },
                { t: "Sore Hari", i: "🌇" },
                { t: "Malam Sebelum Tidur", i: "🌙" },
            ],
        },
    ];

    let currentQ = $state(0);
    let selectedOpt = $state(null);
    let specialAction = $state(null);

    const q = $derived(questions[currentQ]);
    const progress = $derived((currentQ + 1) * 20);

    function selectOption(idx, action) {
        selectedOpt = idx;
        specialAction = action;
    }

    function nextQuestion() {
        if (selectedOpt === null) return;

        // Special logic for Q2: unless "Baru mulai" is chosen, show placement test
        // (For this mockup, we'll just go to 'learn' if finished, 
        // but we can add a 'placement' screen later if needed)
        if (currentQ === 1 && specialAction !== "skip_placement") {
            // go('placement');
            // For now, let's just proceed or trigger alert
            console.log("Should show placement test");
        }

        if (currentQ < questions.length - 1) {
            currentQ++;
            selectedOpt = null;
            specialAction = null;
        } else {
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
            Langkah {currentQ + 1} dari 5
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
            LANJUT
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
