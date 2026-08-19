<script>
    // Modul Tadabbur (docs/TADABBUR.md).
    //
    // Susunan layar mengikuti Core Flow §3.1 apa adanya:
    //   pilih jalur → pilih ayat → tadabbur 7 langkah → jurnal → hikmah → amal → track
    //
    // Tujuh langkahnya memakai framework Ust. Pur (§1.1). Isian pengguna tersimpan
    // lewat appState — bukan dibuang seperti versi sebelumnya, yang kolom refleksinya
    // tanpa binding dan pilihan amalnya cuma menyalakan kelas CSS di DOM.
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';
    import UserTopbar from '$lib/components/UserTopbar.svelte';
    import { SURAHS, surahByName } from '$lib/data/surahs.js';
    import TAFSIR from '$lib/data/tafsir.generated.js';
    import {
        TADABBUR_THEMES, TADABBUR_SEGMENTS, TADABBUR_STEPS,
        JOURNAL_PROMPTS, themeIsReady
    } from '$lib/data/tadabburThemes.js';

    // Node Tadabbur di roadmap memakai kunci `<id-surah>_1`; kalau dibuka dari tombol
    // bebas, dipakai surah yang sedang dihafal.
    const surah = $derived.by(() => {
        const key = appState.selectedTadabburKey;
        const fromNode = key ? SURAHS[key.replace(/_\d+$/, '')] : null;
        return fromNode ?? appState.activeSurah ?? surahByName('Al-Insyirah');
    });

    let verseIndex = $state(0);
    const verse = $derived(surah?.verses?.[verseIndex] ?? null);

    const segment = $derived(appState.user.tadabburSegment);
    const history = $derived(appState.tadabburHistory);
    const sessionCount = $derived(history.length);

    // Progressive Unlocking (§3.2): Free Mode terbuka setelah 10 sesi Guided.
    const FREE_MODE_AT = 10;
    const freeModeUnlocked = $derived(sessionCount >= FREE_MODE_AT);

    // §3.4: progres ditampilkan sebagai perjalanan sendiri, bukan perbandingan
    // dengan orang lain — tadabbur ibadah, bukan kompetisi. Tidak ada leaderboard.
    const versesReflected = $derived(new Set(history.map((h) => `${h.surahId}:${h.verseNumber}`)).size);
    const deedsCount = $derived(history.filter((h) => h.amal?.trim()).length);

    const tafsir = $derived(verse ? TAFSIR[`${surah.number}:${verse.verseNumber}`] ?? null : null);
    const saved = $derived(verse ? appState.getTadabburJournal(surah.id, verse.verseNumber) : null);
    const doneThisVerse = $derived(Boolean(saved?.completedAt));
    const startedThisVerse = $derived(Boolean(saved) && !saved.completedAt);

    let view = $state('home');       // 'home' | 'guided' | 'history'
    let currentStep = $state(0);
    let editingSegment = $state(false);

    // Isian jurnal, dimuat dari simpanan tiap kali ayat berganti — bukan tiap render —
    // supaya pindah ayat tidak mewarisi tulisan ayat sebelumnya.
    let faktual = $state('');
    let diri = $state('');
    let hikmah = $state('');
    let amal = $state('');
    let lastLoadedKey = null;

    $effect(() => {
        if (!verse) return;
        const key = `${surah.id}:${verse.verseNumber}`;
        if (key === lastLoadedKey) return;
        lastLoadedKey = key;
        const j = appState.getTadabburJournal(surah.id, verse.verseNumber);
        faktual = j?.faktual ?? '';
        diri = j?.diri ?? '';
        hikmah = j?.hikmah ?? '';
        amal = j?.amal ?? '';
    });

    const step = $derived(TADABBUR_STEPS[currentStep]);
    const promptFor = (id) => JOURNAL_PROMPTS[id]?.[segment ?? 'dewasa'] ?? '';

    // Hikmah dan amal wajib terisi: keduanya inti §3.1 poin 5-6, dan §1.1 menutup
    // framework dengan "tadabbur tanpa amal adalah tadabbur yang belum selesai".
    const canAdvance = $derived.by(() => {
        if (step?.input === 'hikmah') return hikmah.trim().length > 0;
        if (step?.input === 'amal') return amal.trim().length > 0;
        return true;
    });

    function persist() {
        if (!verse) return;
        appState.saveTadabburJournal(surah.id, verse.verseNumber, { faktual, diri, hikmah, amal });
    }

    function nextStep() {
        if (!canAdvance) return;
        persist();
        if (currentStep < TADABBUR_STEPS.length - 1) {
            currentStep++;
            return;
        }
        appState.completeTadabburSession(surah.id, verse.verseNumber);
        appState.completeTadabbur(appState.selectedTadabburKey);
        view = 'home';
        currentStep = 0;
    }

    function prevStep() {
        persist();
        if (currentStep > 0) currentStep--;
        else view = 'home';
    }

    // Sesi yang ditinggal di tengah dilanjutkan dari langkah pertama yang belum
    // terisi, bukan diulang dari nol.
    function startGuided() {
        const filled = [faktual, diri, hikmah, amal];
        const inputSteps = TADABBUR_STEPS.map((s, i) => ({ s, i })).filter((x) => x.s.input);
        const firstEmpty = inputSteps.find((_, n) => !filled[n]?.trim());
        currentStep = doneThisVerse ? 0 : (firstEmpty?.i ?? 0);
        view = 'guided';
    }

    function surahOf(id) { return SURAHS[id] ?? null; }
    const segmentName = $derived(TADABBUR_SEGMENTS.find((s) => s.id === segment)?.name ?? '');
</script>

<div class="screen tadabbur-screen">
    <UserTopbar
        title={i18n.t('tadabbur.title')}
        onBack={() => (view === 'home' ? appState.go('learn') : (view = 'home'))}
    />

    {#if view === 'guided' && verse}
        <!-- ══ TADABBUR — 7 langkah (§1.1) ══════════════════════════════ -->
        <div class="scroll-content" style="padding: 14px 16px 24px;">
            <div class="step-progress">
                {#each TADABBUR_STEPS as _, i}
                    <span class="step-dot" class:done={i < currentStep} class:active={i === currentStep}></span>
                {/each}
            </div>

            <div class="step-head">
                <span class="step-num">{currentStep + 1}</span>
                <div style="flex:1; min-width:0;">
                    <h2 class="step-title">{i18n.t(`tadabbur.step_${step.id}`)}</h2>
                    <p class="step-desc">{i18n.t(`tadabbur.step_${step.id}_desc`)}</p>
                </div>
            </div>

            <!-- Ayatnya ditampilkan di setiap langkah: seluruh perenungan berangkat
                 dari teks, bukan dari ingatan. -->
            <div class="verse-card" class:compact={step.id !== 'baca'}>
                <div class="arabic-text">{verse.arabic}</div>
                {#if step.id === 'baca'}
                    <div class="translation">"{i18n.t(verse.translationKey)}"</div>
                {/if}
                <div class="reference">{surah.name} : {verse.verseNumber}</div>
            </div>

            {#if step.needsCorpus === 'tafsir'}
                {#if tafsir?.id}
                    <div class="corpus-card">
                        <div class="corpus-source"><i class="ti ti-book"></i> {tafsir.id.source}</div>
                        <p class="corpus-text">{tafsir.id.text}</p>
                    </div>
                {:else}
                    <div class="corpus-missing">
                        <i class="ti ti-info-circle"></i>
                        <span>{i18n.t('tadabbur.corpus_missing_tafsir')}</span>
                    </div>
                {/if}
            {/if}

            <!-- §4.1⑤: lebih baik tidak menjawab daripada menjawab tidak sahih.
                 Pendapat ulama dan fakta aktual wajib lewat review ulama (§4.5);
                 korpusnya belum ada, jadi dinyatakan terus terang. -->
            {#if step.needsCorpus === 'ulama' || step.needsCorpus === 'faktual'}
                <div class="corpus-missing">
                    <i class="ti ti-info-circle"></i>
                    <span>{i18n.t(`tadabbur.corpus_missing_${step.needsCorpus}`)}</span>
                </div>
            {/if}

            {#if step.id === 'faktual'}
                <label class="field-label" for="j-faktual">{promptFor('faktual')}</label>
                <textarea id="j-faktual" class="journal-input" rows="4"
                    placeholder={i18n.t('tadabbur.reflect')} bind:value={faktual}></textarea>
            {:else if step.id === 'diri'}
                <label class="field-label" for="j-diri">{promptFor('diri')}</label>
                <textarea id="j-diri" class="journal-input" rows="4"
                    placeholder={i18n.t('tadabbur.reflect')} bind:value={diri}></textarea>
            {:else if step.input === 'hikmah'}
                <label class="field-label" for="j-hikmah">{i18n.t('tadabbur.hikmah_prompt')}</label>
                <textarea id="j-hikmah" class="journal-input" rows="2"
                    placeholder={i18n.t('tadabbur.hikmah_placeholder')} bind:value={hikmah}></textarea>
            {:else if step.input === 'amal'}
                <label class="field-label" for="j-amal">{i18n.t('tadabbur.amal_prompt')}</label>
                <textarea id="j-amal" class="journal-input" rows="2"
                    placeholder={i18n.t('tadabbur.amal_placeholder')} bind:value={amal}></textarea>
                {#if hikmah.trim()}
                    <div class="hikmah-recall">
                        <span class="hikmah-recall-label">{i18n.t('tadabbur.your_hikmah')}</span>
                        <span>{hikmah}</span>
                    </div>
                {/if}
            {/if}

            <div class="step-actions">
                <button class="btn-duo btn-outline" onclick={prevStep}>{i18n.t('tadabbur.back')}</button>
                <button class="btn-duo" class:btn-green={canAdvance} class:btn-disabled={!canAdvance}
                    disabled={!canAdvance} onclick={nextStep}>
                    {currentStep < TADABBUR_STEPS.length - 1 ? i18n.t('tadabbur.next') : i18n.t('tadabbur.save')}
                </button>
            </div>
        </div>

    {:else if view === 'history'}
        <!-- ══ TRACK — riwayat jurnal (§3.1 poin 7) ═════════════════════ -->
        <div class="scroll-content" style="padding: 14px 16px 90px;">
            {#if history.length === 0}
                <div class="empty">
                    <i class="ti ti-notebook"></i>
                    <p>{i18n.t('tadabbur.history_empty')}</p>
                </div>
            {:else}
                {#each history as h}
                    {@const s = surahOf(h.surahId)}
                    <div class="history-card">
                        <div class="history-ref">{s?.name ?? h.surahId} : {h.verseNumber}</div>
                        {#if h.hikmah}<p class="history-hikmah">"{h.hikmah}"</p>{/if}
                        {#if h.amal}<div class="history-amal"><i class="ti ti-check"></i> {h.amal}</div>{/if}
                        <div class="history-date">
                            {new Date(h.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <BottomNav active="learn" />

    {:else}
        <!-- ══ BERANDA — mengikuti Core Flow §3.1 ═══════════════════════ -->
        <div class="scroll-content" style="padding: 14px 16px 90px;">

            <!-- TRACK: perjalanan sendiri, tanpa perbandingan dengan orang lain (§3.4) -->
            <div class="stats-row">
                <div class="stat"><b>{sessionCount}</b><span>{i18n.t('tadabbur.stat_sessions')}</span></div>
                <div class="stat"><b>{versesReflected}</b><span>{i18n.t('tadabbur.stat_verses')}</span></div>
                <div class="stat"><b>{deedsCount}</b><span>{i18n.t('tadabbur.stat_deeds')}</span></div>
            </div>

            <!-- Segmen usia menentukan prompt jurnal (§2.3). Bisa diubah kapan saja,
                 bukan pertanyaan sekali seumur hidup. -->
            {#if !segment || editingSegment}
                <div class="segment-card">
                    <div class="segment-title">{i18n.t('tadabbur.segment_q')}</div>
                    <div class="segment-list">
                        {#each TADABBUR_SEGMENTS as s}
                            <button class="segment-btn" class:selected={segment === s.id}
                                onclick={() => { appState.setTadabburSegment(s.id); editingSegment = false; }}>
                                <i class="ti {s.icon}"></i>
                                <strong>{s.name}</strong>
                                <small>{s.age}</small>
                            </button>
                        {/each}
                    </div>
                </div>
            {:else}
                <button class="segment-pill" onclick={() => (editingSegment = true)}>
                    <span>{i18n.t('tadabbur.segment_label')}: <b>{segmentName}</b></span>
                    <span class="segment-change">{i18n.t('tadabbur.change')}</span>
                </button>
            {/if}

            <!-- 1. PILIH JALUR (§2.1) -->
            <div class="section-label">{i18n.t('tadabbur.choose_path')}</div>
            <div class="path-card active">
                <div class="path-head">
                    <span class="path-icon"><i class="ti ti-book-2"></i></span>
                    <div style="flex:1; min-width:0;">
                        <div class="path-name">{i18n.t('tadabbur.path_hafalan')}</div>
                        <div class="path-desc">{i18n.t('tadabbur.path_hafalan_desc')}</div>
                    </div>
                </div>

                {#if verse}
                    <!-- 2. PILIH AYAT -->
                    <div class="verse-card inside">
                        <div class="verse-label">
                            {surah.name} : {verse.verseNumber}
                            {#if doneThisVerse}
                                <span class="done-pill"><i class="ti ti-check"></i> {i18n.t('tadabbur.done_badge')}</span>
                            {/if}
                        </div>
                        <div class="arabic-text">{verse.arabic}</div>
                        <div class="translation">"{i18n.t(verse.translationKey)}"</div>
                    </div>

                    <div class="verse-picker">
                        {#each surah.verses as v, i}
                            {@const done = Boolean(appState.getTadabburJournal(surah.id, v.verseNumber)?.completedAt)}
                            <button class="verse-chip" class:selected={i === verseIndex} class:done
                                onclick={() => (verseIndex = i)}>{v.verseNumber}</button>
                        {/each}
                    </div>

                    <!-- 3. TADABBUR -->
                    <div class="mode-row">
                        <button class="btn-duo btn-green" onclick={startGuided}>
                            {startedThisVerse ? i18n.t('tadabbur.continue_session') : i18n.t('tadabbur.start_session')}
                        </button>
                        <button class="btn-duo btn-outline btn-sm free-mode"
                            class:btn-disabled={!freeModeUnlocked} disabled={!freeModeUnlocked}>
                            {i18n.t('tadabbur.free')}
                        </button>
                    </div>
                    {#if !freeModeUnlocked}
                        <div class="unlock-note">{i18n.t('tadabbur.unlock_hint', { count: FREE_MODE_AT - sessionCount })}</div>
                    {/if}
                {/if}
            </div>

            <!-- Jalur kedua: tematis. Belum bisa dijalankan sampai Indeks Quran ada. -->
            <div class="path-card pending">
                <div class="path-head">
                    <span class="path-icon"><i class="ti ti-category"></i></span>
                    <div style="flex:1; min-width:0;">
                        <div class="path-name">{i18n.t('tadabbur.path_tema')}</div>
                        <div class="path-desc">{i18n.t('tadabbur.path_tema_desc')}</div>
                    </div>
                </div>
                <div class="themes-grid">
                    {#each TADABBUR_THEMES as theme}
                        <span class="theme-chip" class:ready={themeIsReady(theme)} title={theme.index}>{theme.name}</span>
                    {/each}
                </div>
                <p class="themes-note"><i class="ti ti-info-circle"></i> {i18n.t('tadabbur.themes_note')}</p>
            </div>

            <button class="history-link" onclick={() => (view = 'history')}>
                <i class="ti ti-notebook"></i>
                {i18n.t('tadabbur.history_link', { count: sessionCount })}
                <i class="ti ti-chevron-right" style="margin-left:auto;"></i>
            </button>
        </div>
        <BottomNav active="learn" />
    {/if}
</div>

<style>
    .tadabbur-screen { background: #f8fafc; }
    .scroll-content { overflow-y: auto; }

    .section-label {
        font-size: 11px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.8px; margin: 18px 0 10px;
    }

    /* ── TRACK ── */
    .stats-row {
        display: flex; background: #fff; border: 2px solid #e5e5e5;
        border-radius: 16px; overflow: hidden;
    }
    .stat {
        flex: 1; min-width: 0; padding: 12px 6px; text-align: center;
        display: flex; flex-direction: column; gap: 2px;
    }
    .stat + .stat { border-left: 1px solid #eef2f7; }
    .stat b { font-size: 20px; font-weight: 900; color: var(--duo-green); line-height: 1; }
    .stat span { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }

    /* ── Segmen usia ── */
    .segment-card {
        background: #f0fdfa; border: 2px solid #99f6e4; border-radius: 16px;
        padding: 14px; margin-top: 12px;
    }
    .segment-title { font-size: 13px; font-weight: 900; color: #0f766e; margin-bottom: 10px; }
    .segment-list { display: flex; gap: 8px; }
    .segment-btn {
        flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px;
        background: #fff; border: 2px solid #99f6e4; border-radius: 12px;
        padding: 10px 6px; cursor: pointer; font-family: 'Nunito', sans-serif;
        color: #0f766e; min-height: 40px;
    }
    .segment-btn.selected { background: var(--duo-green); border-color: var(--duo-green); color: #fff; }
    .segment-btn.selected small { color: rgba(255,255,255,0.85); }
    .segment-btn i { font-size: 18px; }
    .segment-btn strong { font-size: 12px; font-weight: 900; }
    .segment-btn small { font-size: 9px; font-weight: 700; color: #64748b; }

    .segment-pill {
        width: 100%; margin-top: 12px; padding: 10px 14px; min-height: 42px;
        display: flex; align-items: center; justify-content: space-between; gap: 10px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 12px;
        font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
        color: #64748b; cursor: pointer;
    }
    .segment-pill b { color: #334155; font-weight: 900; }
    .segment-change { font-size: 11px; font-weight: 900; color: var(--duo-green); flex-shrink: 0; }

    /* ── Jalur ── */
    .path-card {
        background: #fff; border: 2px solid #e5e5e5; border-radius: 18px;
        padding: 14px; margin-bottom: 12px;
    }
    .path-card.pending { background: #f8fafc; border-style: dashed; }
    .path-head { display: flex; align-items: flex-start; gap: 12px; }
    .path-icon {
        width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
        background: #e6faf8; color: var(--duo-green);
        display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .path-card.pending .path-icon { background: #eef2f7; color: #94a3b8; }
    .path-name { font-size: 14px; font-weight: 900; color: #1e293b; }
    .path-desc { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px; line-height: 1.5; }

    /* ── Ayat ── */
    .verse-card {
        background: #fff; border: 2px solid #e5e5e5; border-radius: 16px;
        padding: 16px; margin-bottom: 14px; text-align: center;
    }
    .verse-card.inside { margin-top: 14px; background: #f8fafc; }
    .verse-card.compact { padding: 12px; margin-bottom: 14px; }
    .verse-label {
        font-size: 10px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
        display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;
    }
    .done-pill {
        display: inline-flex; align-items: center; gap: 4px;
        background: #e6faf8; color: #0f766e; border-radius: 99px;
        padding: 2px 8px; font-size: 9px; font-weight: 900;
    }
    .arabic-text {
        font-family: 'Amiri', serif; font-size: 24px; line-height: 2;
        color: #1e293b; direction: rtl;
    }
    .translation { font-size: 12px; font-weight: 600; color: #475569; line-height: 1.6; margin-top: 8px; }
    .reference { font-size: 11px; font-weight: 800; color: var(--duo-green); margin-top: 8px; }

    /* ── Pemilih ayat ── */
    .verse-picker { display: flex; flex-wrap: wrap; gap: 6px; }
    .verse-chip {
        min-width: 36px; min-height: 36px; padding: 0 8px; border-radius: 10px;
        border: 2px solid #e5e5e5; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
        color: #475569; cursor: pointer;
    }
    .verse-chip.done { border-color: #99f6e4; background: #f0fdfa; color: #0f766e; }
    .verse-chip.selected { border-color: var(--duo-green); background: var(--duo-green); color: #fff; }

    .mode-row { display: flex; gap: 8px; margin-top: 14px; }
    .mode-row .btn-duo:first-child { flex: 2; }
    .free-mode { flex: 1; }
    .unlock-note {
        font-size: 10px; font-weight: 700; color: #94a3b8;
        text-align: center; margin-top: 8px;
    }

    /* ── Tema ── */
    .themes-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .theme-chip {
        padding: 6px 10px; border-radius: 99px; border: 1.5px dashed #cbd5e1;
        background: #fff; font-size: 11px; font-weight: 700; color: #94a3b8;
    }
    .theme-chip.ready { border-style: solid; border-color: var(--duo-green); color: var(--duo-green); }
    .themes-note {
        display: flex; align-items: flex-start; gap: 6px; margin: 12px 0 0;
        font-size: 10px; font-weight: 600; color: #94a3b8; line-height: 1.5;
    }
    .themes-note i { font-size: 13px; flex-shrink: 0; }

    /* ── Langkah tadabbur ── */
    .step-progress { display: flex; gap: 4px; margin-bottom: 16px; }
    .step-dot { flex: 1; height: 5px; border-radius: 99px; background: #e5e5e5; }
    .step-dot.done { background: #99e2db; }
    .step-dot.active { background: var(--duo-green); }

    .step-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
    .step-num {
        width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
        background: var(--duo-green); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 14px; font-weight: 900;
    }
    .step-title { font-size: 18px; font-weight: 900; color: #1e293b; margin: 3px 0 4px; }
    .step-desc { font-size: 12px; font-weight: 600; color: #64748b; line-height: 1.6; margin: 0; }

    /* ── Korpus ── */
    .corpus-card {
        background: #fff; border: 2px solid #e2e8f0; border-radius: 16px;
        padding: 14px; margin-bottom: 16px;
    }
    .corpus-source {
        font-size: 10px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
        display: flex; align-items: center; gap: 6px;
    }
    .corpus-text { margin: 0; font-size: 13px; font-weight: 500; color: #334155; line-height: 1.75; }
    .corpus-missing {
        display: flex; align-items: flex-start; gap: 8px;
        background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 14px;
        padding: 12px; margin-bottom: 16px;
        font-size: 12px; font-weight: 700; color: #92400e; line-height: 1.55;
    }
    .corpus-missing i { font-size: 16px; flex-shrink: 0; }

    /* ── Jurnal ── */
    .field-label {
        display: block; font-size: 13px; font-weight: 800; color: #334155;
        margin-bottom: 8px; line-height: 1.5;
    }
    .journal-input {
        width: 100%; padding: 12px 14px; border: 2px solid #e5e5e5; border-radius: 14px;
        background: #fff; font-family: 'Nunito', sans-serif; font-size: 13px;
        font-weight: 600; color: #3c3c3c; resize: vertical; box-sizing: border-box; line-height: 1.6;
    }
    .journal-input:focus { outline: none; border-color: #1cb0f6; }

    .hikmah-recall {
        margin-top: 12px; background: #f0fdfa; border: 1.5px solid #99f6e4;
        border-radius: 12px; padding: 10px 12px;
        display: flex; flex-direction: column; gap: 4px;
        font-size: 13px; font-weight: 700; color: #0f766e; line-height: 1.5;
    }
    .hikmah-recall-label {
        font-size: 9px; font-weight: 900; text-transform: uppercase;
        letter-spacing: 0.5px; color: #14b8a6;
    }

    .step-actions { display: flex; gap: 10px; margin-top: 22px; }
    .step-actions .btn-duo { flex: 1; }
    .step-actions .btn-duo:last-child { flex: 2; }

    /* ── Riwayat ── */
    .history-link {
        width: 100%; margin-top: 6px; padding: 13px 14px; min-height: 46px;
        display: flex; align-items: center; gap: 8px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 14px;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
        color: #475569; cursor: pointer;
    }
    .history-card {
        background: #fff; border: 2px solid #e5e5e5; border-radius: 16px;
        padding: 14px; margin-bottom: 10px;
    }
    .history-ref { font-size: 13px; font-weight: 900; color: var(--duo-green); }
    .history-hikmah {
        margin: 8px 0 0; font-size: 13px; font-weight: 700;
        color: #334155; line-height: 1.5; font-style: italic;
    }
    .history-amal {
        margin-top: 8px; font-size: 12px; font-weight: 700; color: #0f766e;
        display: flex; align-items: center; gap: 6px;
    }
    .history-date { margin-top: 8px; font-size: 10px; font-weight: 700; color: #94a3b8; }

    .empty {
        display: flex; flex-direction: column; align-items: center; gap: 10px;
        padding: 40px 20px; text-align: center; color: #94a3b8;
        font-size: 13px; font-weight: 700;
    }
    .empty i { font-size: 34px; }
</style>
