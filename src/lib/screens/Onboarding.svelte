<script>
    // Placement Test v2 (docs/ONBOARDING.md).
    //
    // Sistem tidak menilai bacaan sendiri: kategori RBQ / RTQ / Rekomendasi Hafalan
    // ditentukan musyrif setelah mendengar rekaman QS Maryam 1-10 (SLA maks 1x24 jam).
    // Layar ini hanya mengumpulkan data dan menampilkan hasil verifikasi.
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    // Urutan langkah mengikuti "Alur Keseluruhan" di ONBOARDING.md. Langkah 'record'
    // dan 'pending' dilewati kalau user menjawab belum bisa membaca — meminta rekaman
    // bacaan dari orang yang belum bisa membaca tidak masuk akal.
    const FLOW = ['intro', 'gate', 'record', 'pending', 'result', 'hafalan', 'surahs', 'recommendation', 'path', 'reminder'];

    let step = $state('intro');
    // Riwayat langkah yang benar-benar dilalui — lebih jujur daripada menghitung
    // mundur di FLOW, karena sebagian langkah dilewati tergantung jawaban gate.
    let history = $state([]);
    const placement = $derived(appState.user.placement);

    function goStep(next) {
        history = [...history, step];
        step = next;
    }

    function back() {
        if (history.length === 0) return;
        step = history[history.length - 1];
        history = history.slice(0, -1);
    }

    // Checklist hafalan: surat/juz yang lazim jadi titik mulai (ONBOARDING.md §2.1).
    const MEMORIZED_OPTIONS = [
        'An-Nas', 'Al-Falaq', 'Al-Ikhlas', 'Al-Lahab', 'An-Nasr', 'Al-Kafirun',
        'Al-Kautsar', 'Al-Maun', 'Quraisy', 'Al-Fil', 'Al-Asr', 'Az-Zalzalah',
        'Ad-Dhuha', 'Al-Insyirah', 'At-Takwir', 'Al-Layl',
        'Juz 30', 'Al-Mulk', 'Juz 29', 'Juz 28', 'Ar-Rahman', 'Al-Waqiah'
    ];

    const CATEGORIES = {
        rbq: { icon: '🌱', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
        rtq: { icon: '📖', color: '#0284c7', bg: '#eff6ff', border: '#bfdbfe' },
        tahfidz: { icon: '🏅', color: '#00978A', bg: '#f0fdfa', border: '#99f6e4' }
    };

    const stepIndex = $derived(FLOW.indexOf(step));
    const progress = $derived(Math.round(((stepIndex + 1) / FLOW.length) * 100));

    // ── Gate question ──────────────────────────────────────────────
    let canRead = $state(null);

    function answerGate() {
        if (canRead === null) return;
        appState.updatePlacement({ canRead });
        if (canRead) {
            goStep('record');
        } else {
            // Belum bisa baca → langsung RBQ, tanpa uji rekam (ONBOARDING.md §1.1).
            appState.setPlacementResult('rbq', {
                surah: 'An-Nas', juz: 30, note: i18n.t('placement.rec_note_rbq')
            });
            goStep('result');
        }
    }

    // ── Uji baca: rekaman QS Maryam 1-10 ───────────────────────────
    let recording = $state(false);
    let recordSeconds = $state(0);
    let recorded = $state(false);
    let recTimer = -1;

    $effect(() => () => clearInterval(recTimer));

    function toggleRecord() {
        if (recording) {
            recording = false;
            recorded = true;
            clearInterval(recTimer);
            return;
        }
        recording = true;
        recorded = false;
        recordSeconds = 0;
        recTimer = setInterval(() => (recordSeconds += 1), 1000);
    }

    function submitRecording() {
        if (!recorded) return;
        appState.submitPlacementRecording();
        goStep('pending');
    }

    const mmss = $derived(
        `${String(Math.floor(recordSeconds / 60)).padStart(2, '0')}:${String(recordSeconds % 60).padStart(2, '0')}`
    );

    // Di mockup, keputusan musyrif dipicu manual. Di produksi langkah ini datang dari
    // notifikasi hasil verifikasi, bukan dari tombol di layar user.
    function simulateMusyrif(category) {
        const recNotes = { rbq: 'placement.rec_note_rbq', rtq: 'placement.rec_note_rtq', tahfidz: 'placement.rec_note_tahfidz' };
        const recSurah = { rbq: 'An-Nas', rtq: 'Ad-Dhuha', tahfidz: 'An-Naba' };
        appState.setPlacementResult(category, {
            surah: recSurah[category], juz: 30, note: i18n.t(recNotes[category])
        });
        goStep('result');
    }

    function acknowledgeResult() {
        appState.updatePlacement({ resultSeen: true });
        goStep('hafalan');
    }

    // ── Onboarding hafalan ─────────────────────────────────────────
    let everMemorized = $state(null);
    let selectedSurahs = $state([]);

    function answerHafalan() {
        if (everMemorized === null) return;
        appState.updatePlacement({ everMemorized });
        goStep(everMemorized ? 'surahs' : 'recommendation');
    }

    function toggleSurah(name) {
        selectedSurahs = selectedSurahs.includes(name)
            ? selectedSurahs.filter((s) => s !== name)
            : [...selectedSurahs, name];
    }

    function saveSurahs() {
        appState.updatePlacement({ memorizedSurahs: selectedSurahs });
        goStep('recommendation');
    }

    // ── Free will: ikut rekomendasi musyrif atau pilih sendiri ─────
    let followRecommendation = $state(null);
    let ownTarget = $state('');

    function answerRecommendation() {
        if (followRecommendation === null) return;
        if (!followRecommendation && !ownTarget.trim()) return;
        appState.updatePlacement({ followRecommendation });
        if (!followRecommendation) appState.setPathMode(appState.user.pathMode, ownTarget.trim());
        goStep('path');
    }

    // ── Jalur: Self-paced vs Roadmap Levelling ─────────────────────
    let pathMode = $state('roadmap');

    function answerPath() {
        appState.setPathMode(pathMode, pathMode === 'self' ? (ownTarget.trim() || null) : null);
        goStep('reminder');
    }

    // ── Preferensi pengingat (STREAK.md — Onboarding Key Question) ─
    let dailyTarget = $state(1);
    let preferredTime = $state('05:00');

    // Semakin tinggi target harian, semakin sering pengingat dikirim (STREAK.md).
    const reminderLevel = $derived(dailyTarget >= 5 ? 'kritis' : dailyTarget >= 3 ? 'sedang' : 'ringan');
    const reminderCount = $derived({ ringan: 3, sedang: 5, kritis: 10 }[reminderLevel]);

    function finish() {
        appState.setReminderPrefs({ dailyTarget, preferredTime, level: reminderLevel });
        appState.go('learn');
    }

</script>

<div class="screen">
    <div class="topbar">
        {#if step !== 'intro' && step !== 'pending' && step !== 'result'}
            <button class="back-btn" onclick={back} aria-label={i18n.t('common.back')}>
                <i class="ti ti-arrow-left"></i>
            </button>
        {/if}
        <div class="prog-bar-bg">
            <div class="prog-bar-fill" style="width: {progress}%"></div>
        </div>
    </div>

    <div class="content scroll-content" style="padding: 20px 20px 0;">
        <div class="step-counter">
            {i18n.t('onboarding.step')} {stepIndex + 1} / {FLOW.length}
        </div>

        <!-- ── 1. Intro ──────────────────────────────────────────── -->
        {#if step === 'intro'}
            <div class="intro-hero">
                <div class="intro-emoji">🕌</div>
                <h1 class="q-title">{i18n.t('placement.intro_title')}</h1>
                <p class="q-sub">{i18n.t('placement.intro_desc')}</p>
            </div>
            <div class="cat-legend">
                {#each Object.entries(CATEGORIES) as [key, c]}
                    <div class="cat-row" style="background:{c.bg}; border-color:{c.border};">
                        <span class="cat-emoji">{c.icon}</span>
                        <div>
                            <div class="cat-name" style="color:{c.color}">{i18n.t(`placement.cat_${key}`)}</div>
                            <div class="cat-desc">{i18n.t(`placement.cat_${key}_desc`)}</div>
                        </div>
                    </div>
                {/each}
            </div>

        <!-- ── 2. Gate question ──────────────────────────────────── -->
        {:else if step === 'gate'}
            <h1 class="q-title">{i18n.t('placement.gate_q')}</h1>
            <p class="q-sub">{i18n.t('placement.gate_desc')}</p>
            <div class="opt-list">
                <button class="option-card" class:selected={canRead === true} onclick={() => (canRead = true)}>
                    <span class="opt-icon">✅</span>
                    <span>{i18n.t('placement.gate_yes')}</span>
                </button>
                <button class="option-card" class:selected={canRead === false} onclick={() => (canRead = false)}>
                    <span class="opt-icon">🌱</span>
                    <span>{i18n.t('placement.gate_no')}</span>
                </button>
            </div>

        <!-- ── 3. Uji baca: rekam Maryam 1-10 ────────────────────── -->
        {:else if step === 'record'}
            <h1 class="q-title">{i18n.t('placement.record_title')}</h1>
            <p class="q-sub">{i18n.t('placement.record_desc')}</p>

            <div class="recorder">
                <button class="rec-btn" class:recording onclick={toggleRecord}
                        aria-label={recording ? i18n.t('placement.rec_stop') : i18n.t('placement.rec_start')}>
                    <i class="ti {recording ? 'ti-player-stop-filled' : 'ti-microphone'}"></i>
                </button>
                <div class="rec-time">{mmss}</div>
                <div class="rec-hint">
                    {recording ? i18n.t('placement.rec_recording') : recorded ? i18n.t('placement.rec_done') : i18n.t('placement.rec_start')}
                </div>
            </div>

            <div class="note-card">
                <i class="ti ti-info-circle"></i>
                <span>{i18n.t('placement.sla_note')}</span>
            </div>

        <!-- ── 4. Menunggu verifikasi musyrif ────────────────────── -->
        {:else if step === 'pending'}
            <div class="intro-hero">
                <div class="intro-emoji pulse">⏳</div>
                <h1 class="q-title">{i18n.t('placement.pending_title')}</h1>
                <p class="q-sub">{i18n.t('placement.pending_desc', { musyrif: placement.musyrifName ?? '—' })}</p>
            </div>

            {#if appState.placementSlaHoursLeft() !== null}
                <div class="sla-pill">
                    <i class="ti ti-clock"></i>
                    {i18n.t('placement.sla_left', { hours: appState.placementSlaHoursLeft() })}
                </div>
            {/if}

            <div class="mock-panel">
                <div class="mock-label">{i18n.t('placement.mock_label')}</div>
                <div class="mock-btns">
                    {#each Object.keys(CATEGORIES) as key}
                        <button class="mock-btn" onclick={() => simulateMusyrif(key)}>
                            {CATEGORIES[key].icon} {i18n.t(`placement.cat_${key}`)}
                        </button>
                    {/each}
                </div>
            </div>

        <!-- ── 5. Notifikasi hasil ───────────────────────────────── -->
        {:else if step === 'result'}
            {@const cat = CATEGORIES[placement.category] ?? CATEGORIES.rbq}
            <div class="intro-hero">
                <div class="intro-emoji">{cat.icon}</div>
                <div class="result-eyebrow">{i18n.t('placement.result_title')}</div>
                <h1 class="q-title" style="color:{cat.color}">{i18n.t(`placement.cat_${placement.category}`)}</h1>
                <p class="q-sub">{i18n.t(`placement.cat_${placement.category}_desc`)}</p>
            </div>

            <div class="result-card" style="background:{cat.bg}; border-color:{cat.border};">
                <div class="result-row">
                    <span class="result-key">{i18n.t('placement.verified_by')}</span>
                    <span class="result-val">{placement.musyrifName ?? i18n.t('placement.musyrif_team')}</span>
                </div>
                <div class="result-row">
                    <span class="result-key">{i18n.t('placement.next_module')}</span>
                    <span class="result-val">{i18n.t(`placement.module_${placement.category}`)}</span>
                </div>
            </div>

            <!-- Free will: RBQ/RTQ tetap boleh lanjut ke jalur hafalan. -->
            {#if placement.category !== 'tahfidz'}
                <div class="note-card">
                    <i class="ti ti-lock-open"></i>
                    <span>{i18n.t('placement.free_will_note')}</span>
                </div>
            {/if}

        <!-- ── 6. Onboarding hafalan ─────────────────────────────── -->
        {:else if step === 'hafalan'}
            <h1 class="q-title">{i18n.t('placement.hafalan_q')}</h1>
            <p class="q-sub">{i18n.t('placement.hafalan_desc')}</p>
            <div class="opt-list">
                <button class="option-card" class:selected={everMemorized === true} onclick={() => (everMemorized = true)}>
                    <span class="opt-icon">📚</span>
                    <span>{i18n.t('placement.hafalan_yes')}</span>
                </button>
                <button class="option-card" class:selected={everMemorized === false} onclick={() => (everMemorized = false)}>
                    <span class="opt-icon">🌱</span>
                    <span>{i18n.t('placement.hafalan_no')}</span>
                </button>
            </div>

        <!-- ── 7. Checklist surat yang pernah dihafal ────────────── -->
        {:else if step === 'surahs'}
            <h1 class="q-title">{i18n.t('placement.surahs_q')}</h1>
            <p class="q-sub">{i18n.t('placement.surahs_desc')}</p>
            <div class="chip-grid">
                {#each MEMORIZED_OPTIONS as name}
                    <button class="chip" class:selected={selectedSurahs.includes(name)}
                            onclick={() => toggleSurah(name)}
                            aria-pressed={selectedSurahs.includes(name)}>
                        {name}
                    </button>
                {/each}
            </div>

        <!-- ── 8. Rekomendasi musyrif + free will ────────────────── -->
        {:else if step === 'recommendation'}
            <h1 class="q-title">{i18n.t('placement.rec_title')}</h1>
            <p class="q-sub">{i18n.t('placement.rec_desc')}</p>

            {#if placement.recommendation}
                <div class="rec-card">
                    <div class="rec-head">
                        <span class="rec-badge">{i18n.t('placement.rec_from_musyrif')}</span>
                    </div>
                    <div class="rec-target">
                        📖 {placement.recommendation.surah} · Juz {placement.recommendation.juz}
                    </div>
                    <div class="rec-note">{placement.recommendation.note}</div>
                </div>
            {/if}

            <div class="opt-list">
                <button class="option-card" class:selected={followRecommendation === true} onclick={() => (followRecommendation = true)}>
                    <span class="opt-icon">👍</span>
                    <span>{i18n.t('placement.rec_follow')}</span>
                </button>
                <button class="option-card" class:selected={followRecommendation === false} onclick={() => (followRecommendation = false)}>
                    <span class="opt-icon">🎯</span>
                    <span>{i18n.t('placement.rec_own')}</span>
                </button>
            </div>

            {#if followRecommendation === false}
                <input class="own-input" bind:value={ownTarget}
                       placeholder={i18n.t('placement.rec_own_placeholder')} />
            {/if}

        <!-- ── 9. Pilih jalur ────────────────────────────────────── -->
        {:else if step === 'path'}
            <h1 class="q-title">{i18n.t('placement.path_q')}</h1>
            <p class="q-sub">{i18n.t('placement.path_desc')}</p>
            <div class="opt-list">
                <button class="option-card tall" class:selected={pathMode === 'roadmap'} onclick={() => (pathMode = 'roadmap')}>
                    <span class="opt-icon">🗺️</span>
                    <span>
                        <strong>{i18n.t('placement.path_roadmap')}</strong>
                        <small>{i18n.t('placement.path_roadmap_desc')}</small>
                    </span>
                </button>
                <button class="option-card tall" class:selected={pathMode === 'self'} onclick={() => (pathMode = 'self')}>
                    <span class="opt-icon">🧭</span>
                    <span>
                        <strong>{i18n.t('placement.path_self')}</strong>
                        <small>{i18n.t('placement.path_self_desc')}</small>
                    </span>
                </button>
            </div>

        <!-- ── 10. Pengingat ─────────────────────────────────────── -->
        {:else if step === 'reminder'}
            <h1 class="q-title">{i18n.t('placement.reminder_q')}</h1>
            <p class="q-sub">{i18n.t('placement.reminder_desc')}</p>

            <div class="field">
                <span class="field-label">{i18n.t('placement.daily_target')}</span>
                <div class="chip-grid">
                    {#each [1, 2, 3, 5, 10] as n}
                        <button class="chip" class:selected={dailyTarget === n} onclick={() => (dailyTarget = n)}>
                            {i18n.t('placement.verses_per_day', { count: n })}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="field">
                <span class="field-label">{i18n.t('placement.preferred_time')}</span>
                <input class="own-input" type="time" bind:value={preferredTime} />
            </div>

            <div class="note-card">
                <i class="ti ti-bell"></i>
                <span>{i18n.t('placement.reminder_level', {
                    level: i18n.t(`placement.reminder_${reminderLevel}`), count: reminderCount
                })}</span>
            </div>
        {/if}

        <div style="height: 24px;"></div>
    </div>

    <div style="padding: 16px 20px 20px">
        {#if step === 'intro'}
            <button class="btn-duo btn-green" onclick={() => goStep('gate')}>{i18n.t('placement.start')}</button>
        {:else if step === 'gate'}
            <button class="btn-duo" class:btn-green={canRead !== null} class:btn-disabled={canRead === null} onclick={answerGate}>
                {i18n.t('onboarding.next')}
            </button>
        {:else if step === 'record'}
            <button class="btn-duo" class:btn-green={recorded} class:btn-disabled={!recorded} onclick={submitRecording}>
                {i18n.t('placement.send_recording')}
            </button>
        {:else if step === 'pending'}
            <button class="btn-duo btn-disabled">{i18n.t('placement.waiting')}</button>
        {:else if step === 'result'}
            <button class="btn-duo btn-green" onclick={acknowledgeResult}>{i18n.t('onboarding.next')}</button>
        {:else if step === 'hafalan'}
            <button class="btn-duo" class:btn-green={everMemorized !== null} class:btn-disabled={everMemorized === null} onclick={answerHafalan}>
                {i18n.t('onboarding.next')}
            </button>
        {:else if step === 'surahs'}
            <button class="btn-duo btn-green" onclick={saveSurahs}>{i18n.t('onboarding.next')}</button>
        {:else if step === 'recommendation'}
            {@const ready = followRecommendation === true || (followRecommendation === false && ownTarget.trim())}
            <button class="btn-duo" class:btn-green={ready} class:btn-disabled={!ready} onclick={answerRecommendation}>
                {i18n.t('onboarding.next')}
            </button>
        {:else if step === 'path'}
            <button class="btn-duo btn-green" onclick={answerPath}>{i18n.t('onboarding.next')}</button>
        {:else}
            <button class="btn-duo btn-green" onclick={finish}>{i18n.t('placement.finish')}</button>
        {/if}
    </div>
</div>

<style>
    .back-btn {
        background: none; border: none; color: #afafaf; cursor: pointer;
        font-size: 20px; display: flex; align-items: center;
        min-width: 40px; min-height: 40px; justify-content: center;
    }
    .step-counter {
        font-size: 13px; font-weight: 800; color: #afafaf;
        margin-bottom: 10px; text-transform: uppercase;
    }
    .q-title { font-size: 22px; font-weight: 900; color: #3c3c3c; margin: 0 0 8px; }
    .q-sub { font-size: 14px; font-weight: 600; color: #7c8b9a; margin: 0 0 20px; line-height: 1.5; }

    .intro-hero { text-align: center; padding: 12px 0 20px; }
    .intro-emoji { font-size: 60px; margin-bottom: 12px; }
    .intro-emoji.pulse { animation: pulse 1.8s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }

    .cat-legend { display: flex; flex-direction: column; gap: 10px; }
    .cat-row {
        display: flex; align-items: center; gap: 12px;
        border: 2px solid; border-radius: 14px; padding: 12px 14px; text-align: left;
    }
    .cat-emoji { font-size: 24px; }
    .cat-name { font-size: 14px; font-weight: 900; }
    .cat-desc { font-size: 12px; font-weight: 600; color: #64748b; margin-top: 2px; line-height: 1.4; }

    .opt-list { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .option-card {
        width: 100%; padding: 14px; border-radius: 12px;
        border: 2px solid #e5e5e5; border-bottom: 4px solid #e5e5e5; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; color: #3c3c3c;
        cursor: pointer; text-align: left; display: flex; align-items: center; gap: 12px;
        min-height: 56px; transition: all 0.1s;
    }
    .option-card:active { border-bottom-width: 2px; transform: translateY(2px); }
    .option-card.selected {
        border-color: #1cb0f6; border-bottom-color: #0898dc;
        background: #ddf4ff; color: #0898dc;
    }
    .option-card.tall span:last-child { display: flex; flex-direction: column; gap: 3px; }
    .option-card small { font-size: 12px; font-weight: 600; color: #7c8b9a; }
    .option-card.selected small { color: #0e7fb8; }
    .opt-icon { font-size: 24px; width: 34px; text-align: center; flex-shrink: 0; }

    /* Recorder */
    .recorder { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 0; }
    .rec-btn {
        width: 92px; height: 92px; border-radius: 50%; border: none;
        background: #00978A; color: #fff; font-size: 38px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 6px 0 #00665d; transition: all 0.1s;
    }
    .rec-btn:active { transform: translateY(3px); box-shadow: 0 3px 0 #00665d; }
    .rec-btn.recording { background: #ef4444; box-shadow: 0 6px 0 #b91c1c; animation: pulse 1.2s infinite; }
    .rec-time { font-size: 26px; font-weight: 900; color: #3c3c3c; font-variant-numeric: tabular-nums; }
    .rec-hint { font-size: 12px; font-weight: 700; color: #94a3b8; }

    .note-card {
        display: flex; align-items: flex-start; gap: 8px;
        background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 12px;
        padding: 12px; font-size: 12px; font-weight: 700; color: #075985;
        line-height: 1.5; margin-top: 16px;
    }
    .note-card i { font-size: 16px; flex-shrink: 0; }

    .sla-pill {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 99px;
        padding: 8px 14px; font-size: 12px; font-weight: 900; color: #b45309;
    }

    .mock-panel {
        margin-top: 24px; padding: 14px; border: 2px dashed #e2e8f0;
        border-radius: 14px; background: #f8fafc;
    }
    .mock-label {
        font-size: 10px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
    }
    .mock-btns { display: flex; flex-direction: column; gap: 8px; }
    .mock-btn {
        padding: 10px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; color: #475569;
        cursor: pointer; min-height: 40px;
    }
    .mock-btn:active { background: #f1f5f9; }

    .result-eyebrow {
        font-size: 11px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    }
    .result-card { border: 2px solid; border-radius: 16px; padding: 14px; }
    .result-row {
        display: flex; justify-content: space-between; align-items: center; gap: 10px;
        padding: 6px 0; font-size: 12px; font-weight: 700;
    }
    .result-key { color: #64748b; }
    .result-val { font-weight: 900; color: #1e293b; text-align: right; }

    .chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
        padding: 9px 14px; border-radius: 99px; border: 2px solid #e5e5e5; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; color: #475569;
        cursor: pointer; min-height: 40px;
    }
    .chip.selected { background: #ddf4ff; border-color: #1cb0f6; color: #0898dc; }

    .rec-card {
        background: #f0fdfa; border: 2px solid #99f6e4; border-radius: 16px;
        padding: 14px; margin-bottom: 18px;
    }
    .rec-badge {
        font-size: 10px; font-weight: 900; color: #0f766e; background: #ccfbf1;
        border-radius: 6px; padding: 3px 8px; text-transform: uppercase;
    }
    .rec-target { font-size: 16px; font-weight: 900; color: #134e4a; margin-top: 10px; }
    .rec-note { font-size: 12px; font-weight: 600; color: #0f766e; margin-top: 6px; line-height: 1.5; }

    .own-input {
        width: 100%; margin-top: 12px; padding: 13px 14px;
        border: 2px solid #e5e5e5; border-radius: 12px; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700; color: #3c3c3c;
        min-height: 48px;
    }
    .own-input:focus { outline: none; border-color: #1cb0f6; }

    .field { margin-bottom: 20px; }
    .field-label {
        display: block; font-size: 11px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
    }
</style>
