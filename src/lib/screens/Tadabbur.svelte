<script>
    // Modul Tadabbur (docs/TADABBUR.md).
    //
    // Tujuh langkah mengikuti framework Ust. Pur (§1.1). Sebelumnya layar ini memakai
    // kerangka bernama lain (At-Tilawah, Al-Fahmu, …) yang tidak ada di dokumen, dan
    // seluruh isian pengguna dibuang: kolom refleksi tanpa binding, pilihan amal yang
    // cuma menyalakan kelas CSS di DOM. Jurnal — inti modul ini — kini benar-benar
    // tersimpan lewat appState.
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

    // Ayat yang direnungkan. Bisa dipindah lewat pemilih ayat — §2.1 menyebut jalur
    // "Berbasis Hafalan": pilih ayat/surah yang sedang dihafal.
    let verseIndex = $state(0);
    const verse = $derived(surah?.verses?.[verseIndex] ?? null);

    const segment = $derived(appState.user.tadabburSegment);
    const sessionCount = $derived(appState.tadabburSessionCount);
    // Progressive Unlocking (§3.2): Free Mode terbuka setelah 10 sesi Guided.
    const FREE_MODE_AT = 10;
    const freeModeUnlocked = $derived(sessionCount >= FREE_MODE_AT);

    // Tafsir dikunci "nomorSurah:nomorAyat" di korpus hasil bangkitan.
    const tafsir = $derived(verse ? TAFSIR[`${surah.number}:${verse.verseNumber}`] ?? null : null);

    const saved = $derived(verse ? appState.getTadabburJournal(surah.id, verse.verseNumber) : null);

    let view = $state('home');   // 'home' | 'guided' | 'history'
    let currentStep = $state(0);

    // Isian jurnal. Dimuat dari simpanan tiap kali ayat berganti — bukan tiap render —
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

    // Langkah terakhir menuntut hikmah dan amal terisi — dua-duanya inti §3.1 poin 5-6.
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

    function startGuided() {
        currentStep = 0;
        view = 'guided';
    }

    const history = $derived(appState.tadabburHistory);
    const doneThisVerse = $derived(Boolean(saved?.completedAt));

    function surahOf(id) { return SURAHS[id] ?? null; }
</script>

<div class="screen">
    <UserTopbar
        title={i18n.t('tadabbur.title')}
        onBack={() => (view === 'home' ? appState.go('learn') : (view = 'home'))}
    />

    {#if view === 'guided' && verse}
        <!-- ── Guided Mode: 7 langkah (§1.1) ────────────────────────────── -->
        <div class="scroll-content" style="padding: 12px 16px;">
            <div class="step-progress">
                {#each TADABBUR_STEPS as _, i}
                    <span class="step-dot" class:done={i < currentStep} class:active={i === currentStep}></span>
                {/each}
            </div>

            <div class="step-eyebrow">
                {i18n.t('lesson.step')} {currentStep + 1} {i18n.t('tadabbur.step_of')}
            </div>
            <h2 class="step-title">{i18n.t(`tadabbur.step_${step.id}`)}</h2>
            <p class="step-desc">{i18n.t(`tadabbur.step_${step.id}_desc`)}</p>

            <!-- Langkah 1 selalu menampilkan ayatnya: seluruh perenungan berangkat
                 dari teks, bukan dari ingatan. -->
            {#if step.id === 'baca'}
                <div class="verse-card">
                    <div class="arabic-text">{verse.arabic}</div>
                    <div class="translation">"{i18n.t(verse.translationKey)}"</div>
                    <div class="reference">{surah.name} : {verse.verseNumber}</div>
                </div>
            {/if}

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
                 Pendapat ulama dan fakta aktual wajib lewat review (§4.5); korpusnya
                 belum ada, jadi dinyatakan terus terang alih-alih diisi karangan. -->
            {#if step.needsCorpus === 'ulama'}
                <div class="corpus-missing">
                    <i class="ti ti-info-circle"></i>
                    <span>{i18n.t('tadabbur.corpus_missing_ulama')}</span>
                </div>
            {/if}
            {#if step.needsCorpus === 'faktual'}
                <div class="corpus-missing">
                    <i class="ti ti-info-circle"></i>
                    <span>{i18n.t('tadabbur.corpus_missing_faktual')}</span>
                </div>
            {/if}

            <!-- Dua kolom terpisah, bukan satu kolom dengan target binding yang
                 dipilih lewat ternary: bind:value hanya menerima variabel, dan
                 satu kolom bersama juga akan menimpa jawaban langkah sebelumnya. -->
            {#if step.id === 'faktual'}
                <label class="field-label" for="journal-faktual">{promptFor('faktual')}</label>
                <textarea
                    id="journal-faktual"
                    class="journal-input"
                    rows="4"
                    placeholder={i18n.t('tadabbur.reflect')}
                    bind:value={faktual}
                ></textarea>
            {:else if step.id === 'diri'}
                <label class="field-label" for="journal-diri">{promptFor('diri')}</label>
                <textarea
                    id="journal-diri"
                    class="journal-input"
                    rows="4"
                    placeholder={i18n.t('tadabbur.reflect')}
                    bind:value={diri}
                ></textarea>
            {/if}

            {#if step.input === 'hikmah'}
                <label class="field-label" for="hikmah-input">{i18n.t('tadabbur.hikmah_prompt')}</label>
                <textarea
                    id="hikmah-input"
                    class="journal-input"
                    rows="2"
                    placeholder={i18n.t('tadabbur.hikmah_placeholder')}
                    bind:value={hikmah}
                ></textarea>
            {/if}

            {#if step.input === 'amal'}
                <label class="field-label" for="amal-input">{i18n.t('tadabbur.amal_prompt')}</label>
                <textarea
                    id="amal-input"
                    class="journal-input"
                    rows="2"
                    placeholder={i18n.t('tadabbur.amal_placeholder')}
                    bind:value={amal}
                ></textarea>
                {#if hikmah.trim()}
                    <div class="hikmah-recall">
                        <span class="hikmah-recall-label">{i18n.t('tadabbur.your_hikmah')}</span>
                        <span>{hikmah}</span>
                    </div>
                {/if}
            {/if}

            <div class="step-actions">
                <button class="btn-duo btn-outline" onclick={prevStep}>{i18n.t('tadabbur.back')}</button>
                <button
                    class="btn-duo"
                    class:btn-green={canAdvance}
                    class:btn-disabled={!canAdvance}
                    disabled={!canAdvance}
                    onclick={nextStep}
                >
                    {currentStep < TADABBUR_STEPS.length - 1 ? i18n.t('tadabbur.next') : i18n.t('tadabbur.save')}
                </button>
            </div>
        </div>

    {:else if view === 'history'}
        <!-- ── Riwayat jurnal (§3.1 poin 7) ─────────────────────────────── -->
        <div class="scroll-content" style="padding: 12px 16px;">
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
                        {#if h.amal}
                            <div class="history-amal"><i class="ti ti-check"></i> {h.amal}</div>
                        {/if}
                        <div class="history-date">
                            {new Date(h.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
        <BottomNav active="learn" />

    {:else}
        <!-- ── Beranda ──────────────────────────────────────────────────── -->
        <div class="scroll-content" style="padding: 12px 16px;">
            <!-- Segmen usia menentukan prompt jurnal (§2.3); ditanya sekali di awal. -->
            {#if !segment}
                <div class="segment-card">
                    <div class="segment-title">{i18n.t('tadabbur.segment_q')}</div>
                    <div class="segment-list">
                        {#each TADABBUR_SEGMENTS as s}
                            <button class="segment-btn" onclick={() => appState.setTadabburSegment(s.id)}>
                                <i class="ti {s.icon}"></i>
                                <strong>{s.name}</strong>
                                <small>{s.age}</small>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <div class="mode-row">
                <button class="btn-duo btn-green btn-sm" onclick={startGuided}>{i18n.t('tadabbur.guided')}</button>
                <button
                    class="btn-duo btn-outline btn-sm"
                    class:btn-disabled={!freeModeUnlocked}
                    disabled={!freeModeUnlocked}
                    title={freeModeUnlocked ? '' : i18n.t('tadabbur.unlock_hint', { count: FREE_MODE_AT - sessionCount })}
                >
                    {i18n.t('tadabbur.free')}
                </button>
            </div>
            {#if !freeModeUnlocked}
                <div class="unlock-note">
                    {i18n.t('tadabbur.unlock_hint', { count: FREE_MODE_AT - sessionCount })}
                </div>
            {/if}

            {#if verse}
                <div class="verse-card">
                    <div class="verse-label">
                        {i18n.t('tadabbur.verse_today')}
                        {#if doneThisVerse}<span class="done-pill"><i class="ti ti-check"></i></span>{/if}
                    </div>
                    <div class="arabic-text">{verse.arabic}</div>
                    <div class="translation">"{i18n.t(verse.translationKey)}"</div>
                    <div class="reference">{surah.name} : {verse.verseNumber}</div>
                </div>

                <!-- Jalur "Berbasis Hafalan" (§2.1): pilih ayat dari surah yang dihafal. -->
                <div class="section-label">{i18n.t('tadabbur.pick_verse')}</div>
                <div class="verse-picker">
                    {#each surah.verses as v, i}
                        {@const done = Boolean(appState.getTadabburJournal(surah.id, v.verseNumber)?.completedAt)}
                        <button
                            class="verse-chip"
                            class:selected={i === verseIndex}
                            class:done
                            onclick={() => (verseIndex = i)}
                        >
                            {v.verseNumber}
                        </button>
                    {/each}
                </div>
            {/if}

            <div class="section-label">{i18n.t('tadabbur.themes')}</div>
            <div class="themes-grid">
                {#each TADABBUR_THEMES as theme}
                    {@const ready = themeIsReady(theme)}
                    <button class="theme-card" class:pending={!ready} disabled={!ready} title={theme.index}>
                        <span>{theme.name}</span>
                        {#if !ready}<small>{i18n.t('tadabbur.theme_pending')}</small>{/if}
                    </button>
                {/each}
            </div>
            <p class="themes-note">{i18n.t('tadabbur.themes_note')}</p>

            <button class="history-link" onclick={() => (view = 'history')}>
                <i class="ti ti-notebook"></i>
                {i18n.t('tadabbur.history_link', { count: sessionCount })}
            </button>

            <div style="height: 90px;"></div>
        </div>
        <BottomNav active="learn" />
    {/if}
</div>

<style>
    .scroll-content { overflow-y: auto; }

    /* Progres langkah */
    .step-progress { display: flex; gap: 5px; margin: 4px 0 14px; }
    .step-dot { flex: 1; height: 5px; border-radius: 99px; background: #e5e5e5; }
    .step-dot.done { background: #99e2db; }
    .step-dot.active { background: var(--duo-green); }

    .step-eyebrow {
        font-size: 11px; font-weight: 800; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .step-title { font-size: 20px; font-weight: 900; color: #3c3c3c; margin: 4px 0 6px; }
    .step-desc { font-size: 13px; font-weight: 600; color: #64748b; line-height: 1.6; margin: 0 0 16px; }

    /* Ayat */
    .verse-card {
        background: #fff; border: 2px solid #e5e5e5; border-radius: 18px;
        padding: 18px 16px; margin-bottom: 16px; text-align: center;
    }
    .verse-label {
        font-size: 10px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
        display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .done-pill {
        background: var(--duo-green); color: #fff; width: 16px; height: 16px;
        border-radius: 50%; display: inline-flex; align-items: center;
        justify-content: center; font-size: 10px;
    }
    .arabic-text {
        font-family: 'Amiri', serif; font-size: 26px; line-height: 2;
        color: #1e293b; direction: rtl; margin-bottom: 10px;
    }
    .translation { font-size: 13px; font-weight: 600; color: #475569; line-height: 1.6; }
    .reference { font-size: 11px; font-weight: 800; color: var(--duo-green); margin-top: 8px; }

    /* Korpus tafsir */
    .corpus-card {
        background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px;
        padding: 14px; margin-bottom: 16px;
    }
    .corpus-source {
        font-size: 10px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
        display: flex; align-items: center; gap: 6px;
    }
    .corpus-text { margin: 0; font-size: 13px; font-weight: 500; color: #334155; line-height: 1.7; }
    .corpus-missing {
        display: flex; align-items: flex-start; gap: 8px;
        background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 14px;
        padding: 12px; margin-bottom: 16px;
        font-size: 12px; font-weight: 700; color: #92400e; line-height: 1.55;
    }
    .corpus-missing i { font-size: 16px; flex-shrink: 0; }

    /* Jurnal */
    .field-label {
        display: block; font-size: 13px; font-weight: 800; color: #334155;
        margin-bottom: 8px; line-height: 1.5;
    }
    .journal-input {
        width: 100%; padding: 12px 14px; border: 2px solid #e5e5e5; border-radius: 14px;
        background: #fff; font-family: 'Nunito', sans-serif; font-size: 13px;
        font-weight: 600; color: #3c3c3c; resize: vertical; box-sizing: border-box;
        line-height: 1.6;
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

    .step-actions { display: flex; gap: 10px; margin: 20px 0 24px; }
    .step-actions .btn-duo { flex: 1; }
    .step-actions .btn-duo:last-child { flex: 2; }

    /* Segmen usia */
    .segment-card {
        background: #f0fdfa; border: 2px solid #99f6e4; border-radius: 18px;
        padding: 14px; margin-bottom: 14px;
    }
    .segment-title { font-size: 13px; font-weight: 900; color: #0f766e; margin-bottom: 10px; }
    .segment-list { display: flex; gap: 8px; }
    .segment-btn {
        flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px;
        background: #fff; border: 2px solid #99f6e4; border-radius: 12px;
        padding: 10px 6px; cursor: pointer; font-family: 'Nunito', sans-serif;
        color: #0f766e; min-height: 40px;
    }
    .segment-btn i { font-size: 18px; }
    .segment-btn strong { font-size: 12px; font-weight: 900; }
    .segment-btn small { font-size: 9px; font-weight: 700; color: #64748b; }

    .mode-row { display: flex; gap: 8px; margin-bottom: 8px; }
    .mode-row .btn-duo { flex: 1; }
    .unlock-note {
        font-size: 11px; font-weight: 700; color: #94a3b8;
        text-align: center; margin-bottom: 14px;
    }

    .section-label {
        font-size: 11px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.8px; margin: 18px 0 10px;
    }

    /* Pemilih ayat */
    .verse-picker { display: flex; flex-wrap: wrap; gap: 6px; }
    .verse-chip {
        min-width: 38px; min-height: 38px; padding: 0 8px; border-radius: 10px;
        border: 2px solid #e5e5e5; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
        color: #475569; cursor: pointer;
    }
    .verse-chip.done { border-color: #99f6e4; background: #f0fdfa; color: #0f766e; }
    .verse-chip.selected { border-color: var(--duo-green); background: var(--duo-green); color: #fff; }

    /* Tema */
    .themes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .theme-card {
        display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 14px;
        padding: 12px; min-height: 56px; text-align: left; cursor: pointer;
        font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800; color: #334155;
    }
    .theme-card.pending {
        border-style: dashed; background: #f8fafc; color: #94a3b8; cursor: not-allowed;
    }
    .theme-card small { font-size: 9px; font-weight: 700; color: #94a3b8; }
    .themes-note {
        font-size: 11px; font-weight: 600; color: #94a3b8;
        line-height: 1.5; margin: 10px 0 0;
    }

    .history-link {
        width: 100%; margin-top: 18px; padding: 12px; min-height: 44px;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 14px;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
        color: #475569; cursor: pointer;
    }

    /* Riwayat */
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
