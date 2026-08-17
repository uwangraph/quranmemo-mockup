<script>
    // Roadmap mengikuti struktur mini target di docs/LEVELLING.md.
    //
    // Tiap level adalah deretan "tangga". Satu tangga berisi beberapa mini target dan
    // ditutup sebuah gerbang — checkpoint (setoran) atau badge per juz. Mini target
    // yang sedang dikerjakan dibuka menjadi node ayat/halaman: di situlah lesson yang
    // sebenarnya berjalan. Mini target lain cukup ditampilkan sebagai status, karena
    // membuka semuanya sekaligus akan menghapus rasa berjenjang yang jadi inti dokumen.
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import { laddersFor, ladderTargetCount } from '$lib/data/levelling.js';
    import { surahByName } from '$lib/data/surahs.js';

    const learningPath = $derived(appState.user.learningPath);
    const ladders = $derived(laddersFor(learningPath));

    // Keadaan tangga dibaca dari satu sumber di app state, supaya roadmap dan layar
    // lesson tidak pernah berbeda pendapat soal target yang aktif.
    const st = $derived(appState.ladderState);
    const ladderIndex = $derived(st.ladderIndex);
    const ladder = $derived(st.ladder);
    const doneCount = $derived(st.targets.filter(t => t.done).length);
    const ladderTargetTotal = $derived(st.targets.length);

    const pathConfig = $derived.by(() => {
        if (appState.user.pathMode === 'self') {
            return { unitTitle: 'Belajar sesuai ritmemu', unitDesc: 'Kamu memilih surah sendiri untuk mulai di sini.', badge: 'JALUR PEMULA' };
        }
        if (learningPath === 'pro') {
            return { unitTitle: i18n.t('learn.unit_title_pro'), unitDesc: i18n.t('learn.unit_desc_pro'), badge: 'PRO LEVEL' };
        }
        if (learningPath === 'mid') {
            return { unitTitle: i18n.t('learn.unit_title_mid'), unitDesc: i18n.t('learn.unit_desc_mid'), badge: 'MID LEVEL' };
        }
        return { unitTitle: i18n.t('learn.unit_title_beginner'), unitDesc: i18n.t('learn.unit_desc_beginner'), badge: 'BEGINNER LEVEL' };
    });

    const passed = $derived(appState.user.progress.completedLadders ?? []);

    // Gerbang hanya terbuka setelah SELURUH mini target tangga ini selesai. Membuka
    // lebih awal berarti memberi lencana juz untuk surah yang tidak pernah dihafal.
    const gateStatus = $derived(
        passed.includes(ladder.id) ? 'completed'
        : (st.targets.every(t => t.done) ? 'available' : 'locked')
    );

    // Blok halaman pada level Pro belum dipetakan ke satu surah, jadi labelnya
    // dibentuk dari rentang halamannya.
    function labelOf(t) {
        if (t.name) return t.name;
        const b = ladder.blocks?.[t.index];
        return b ? `${i18n.t('learn.page')} ${b.from}-${b.to}` : '—';
    }

    // Empat keadaan: selesai, sedang dikerjakan, terkunci, dan belum ada kontennya.
    // Keadaan terakhir itu yang dulu keliru ditampilkan sebagai sudah selesai.
    const targets = $derived(st.targets.map(t => ({
        label: labelOf(t),
        status: t.done ? 'completed'
              : t === st.playable ? 'current'
              : t.available ? 'locked'
              : 'pending'
    })));

    // Node ayat untuk mini target yang sedang dibuka, dibangun dari konten surah
    // yang sebenarnya. Kalau surahnya belum punya konten, roadmap mengatakannya
    // terus terang alih-alih menyajikan ayat surah lain di bawah nama ini.
    const targetName = $derived(st.playable?.name ?? null);
    const selfPaced = $derived(appState.user.pathMode === 'self');
    const selectedSelfSurah = $derived(selfPaced ? surahByName(appState.user.selfPacedTarget) : null);
    const surah = $derived(selectedSelfSurah ?? surahByName(targetName));
    const surahDone = $derived(surah ? appState.surahProgress(surah.id) : 0);

    function lessonResumeProgress(verseIndex) {
        if (!surah) return 0;
        const saved = appState.getLessonResume(surah.id, verseIndex);
        if (!Number.isInteger(saved?.step)) return 0;
        return Math.min(100, Math.max(0, ((saved.step + 1) / Math.max(1, saved.totalSteps ?? 1)) * 100));
    }

    const innerNodes = $derived.by(() => {
        if (!surah) return [];
        const getStatus = (i) => (surahDone > i ? 'completed' : surahDone === i ? 'current' : 'locked');

        // Node sampingan seperti Tadabbur punya tiga keadaan: terkunci, terbuka tapi
        // belum dikerjakan, dan selesai. Menandainya selesai sebelum dikerjakan membuat
        // pengguna mengira sudah melakukannya lalu melewatinya begitu saja.
        const done = appState.user.progress.tadabbur ?? [];
        const tadabburKey = `${surah.id}_1`;
        const gate = (key, unlocked) => (done.includes(key) ? 'completed' : unlocked ? 'available' : 'locked');

        const nodes = [];
        surah.verses.forEach((v, i) => {
            nodes.push({
                id: `v${i}`, type: 'lesson', verseIndex: i, status: getStatus(i),
                title: `${i18n.t('learn.verse')} ${v.verseNumber}`
            });
            // Satu perhentian Tadabbur di sepertiga awal surah.
            if (i === Math.min(2, surah.verses.length - 2)) {
                nodes.push({
                    id: 't', type: 'tadabbur', key: tadabburKey,
                    status: gate(tadabburKey, surahDone >= i + 1),
                    title: `Tadabbur 1-${v.verseNumber}`
                });
            }
        });
        nodes.push({
            id: 'cp', type: 'checkpoint', verseIndex: surah.verses.length - 1,
            status: surahDone >= surah.verses.length ? 'current' : 'locked',
            title: i18n.t('learn.submit_full_surah')
        });
        return nodes;
    });

    function handleNodeClick(node) {
        if (node.status === 'locked') return;

        if (node.type === 'lesson' || node.type === 'checkpoint') {
            appState.selectedVerseIndex = node.verseIndex;
            appState.selectedNodeType = node.type;
            appState.saveUser();
            appState.go('lesson');
        } else {
            // Node Tadabbur terjadwal: penyelesaiannya dicatat ke node ini.
            appState.selectedTadabburKey = node.key ?? null;
            appState.go(node.type);
        }
    }

    // Tadabbur dari tombol banner: bisa dibuka kapan saja untuk merenung,
    // tanpa menandai node terjadwal di roadmap sebagai selesai.
    function openFreeTadabbur() {
        appState.selectedTadabburKey = null;
        appState.go('tadabbur');
    }

    let showLadderMap = $state(false);

    // Ukuran kotak node pada path/road.
    // RING_BOX = kotak node aktif dengan progress-ring (104×104), sinkron dengan
    // svg viewBox dan class .ring-button-wrapper. RING_RADIUS 48 → keliling 2π×48.
    // SHELL_BOX = ukuran node terkunci/selesai (100×100).
    // Tombol aktif 76px menyisakan celah 6px dari sisi dalam ring secara merata.
    const RING_BOX = 104;
    const RING_RADIUS = 48;
    const SHELL_BOX = 100;
</script>

<div class="path-column">
    <div class="unit-banner" class:self-paced-banner={selfPaced && selectedSelfSurah}>
        <!-- Islamic Pattern Background Elements -->
        <div class="islamic-motif motif-1"></div>
        <div class="islamic-motif motif-2"></div>

        <div class="unit-badge" style="position: relative; z-index: 2;">{selfPaced ? 'JALUR PEMULA' : pathConfig.badge}</div>
        <div class="banner-title">{surah?.name ?? pathConfig.unitTitle}</div>
        <div class="banner-desc">{surah ? `Surah ${surah.number} · ${surah.verses.length} ayat tersedia` : pathConfig.unitDesc}</div>
        {#if surah}
            <div class="self-banner-icon"><i class="ti ti-book"></i></div>
            {@const bannerDone = surahDone}
            {@const bannerProgress = surah.verses.length ? Math.round((bannerDone / surah.verses.length) * 100) : 0}
            <div class="self-stats">
                <div><strong>{bannerDone}</strong><small>Target selesai</small></div>
                <div><strong>{Math.max(0, surah.verses.length - bannerDone)}</strong><small>Sisa target</small></div>
                <div><strong>{bannerProgress}%</strong><small>Progress</small></div>
            </div>
            <div class="self-progress-track"><span style="width:{bannerProgress}%"></span></div>
        {/if}

        <!-- Tangga yang sedang ditempuh + gerbang penutupnya (LEVELLING.md) -->
        <div class="ladder-strip">
            <div class="ladder-strip-main">
                <span class="ladder-eyebrow">
                    {i18n.t('learn.ladder_n', { n: ladderIndex + 1 })} · {i18n.t(`learn.gate_${ladder.gate}`)}
                </span>
                <span class="ladder-name">{ladder.name}</span>
            </div>
            <span class="ladder-progress">{doneCount}/{ladderTargetTotal}</span>
        </div>

        <div class="unit-actions">
            <button class="unit-guide-btn" onclick={() => appState.go('guide')}>
                <i class="ti ti-notebook"></i> {i18n.t('learn.guide')}
            </button>
            <!-- Pintu masuk Tadabbur yang selalu tersedia. Node di roadmap baru terbuka
                 setelah beberapa ayat selesai, sehingga di ponsel tidak ada jalan lain. -->
            <button class="unit-guide-btn" onclick={openFreeTadabbur}>
                <i class="ti ti-books"></i> {i18n.t('nav.tadabbur')}
            </button>
            <button class="unit-guide-btn" onclick={() => (showLadderMap = !showLadderMap)}>
                <i class="ti ti-map"></i> {i18n.t('learn.ladder_map')}
            </button>
        </div>

    </div>

    <!-- Peta seluruh tangga di level ini -->
    {#if showLadderMap}
        <div class="ladder-map">
            <div class="ladder-map-title">{i18n.t('learn.ladder_map')} — {pathConfig.badge}</div>
            {#each ladders as l, i}
                {@const state = i < ladderIndex ? 'completed' : i === ladderIndex ? 'current' : 'locked'}
                <div class="ladder-row {state}">
                    <span class="ladder-row-num">{i + 1}</span>
                    <div style="flex:1; min-width:0;">
                        <div class="ladder-row-name">
                            {l.name}
                            {#if l.optional}<span class="opt-pill">{i18n.t('learn.optional')}</span>{/if}
                        </div>
                        <div class="ladder-row-meta">
                            {i18n.t('learn.mini_targets', { count: ladderTargetCount(l) })} · {i18n.t(`learn.gate_${l.gate}`)}
                        </div>
                    </div>
                    <i class="ti {state === 'completed' ? 'ti-circle-check' : state === 'current' ? 'ti-player-play' : 'ti-lock'}"></i>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Mini target dalam tangga berjalan -->
    <div class="targets-strip">
        {#each targets as t}
            <div class="target-chip {t.status}" title={t.label}>
                <span class="target-dot"></span>
                <span class="target-label">{t.label}</span>
            </div>
        {/each}
    </div>

    {#if !surah && st.availableAllDone}
        <!-- Semua yang bisa dikerjakan sudah tuntas. Lebih baik menyatakannya dan
             mengarahkan ke murajaah daripada meninggalkan layar buntu. -->
        <div class="all-done">
            <span style="font-size:38px;"><i class="ti ti-confetti"></i></span>
            <div class="ad-title">{i18n.t('learn.all_available_done')}</div>
            <div class="ad-sub">{i18n.t('learn.all_available_done_desc', { count: st.pending.length })}</div>
            <button class="btn-duo btn-green btn-auto" onclick={() => appState.go('murojaah')}>
                {i18n.t('murajaah.review_now')}
            </button>
        </div>
    {:else if !surah}
        <!-- Jujur soal batas mockup: lebih baik menyatakan konten belum ada daripada
             menyajikan ayat surah lain di bawah nama mini target ini. -->
        <div class="no-content">
            <span style="font-size:34px;"><i class="ti ti-notes"></i></span>
            <div class="nc-title">{i18n.t('learn.content_pending')}</div>
            <div class="nc-sub">{i18n.t('learn.content_pending_desc', { target: targetName ?? '—' })}</div>
        </div>
    {/if}

    <div class="road">
        {#each innerNodes as node, i}
            {@const ringProgress = node.status === 'completed' ? 100 : node.type === 'lesson' ? lessonResumeProgress(node.verseIndex) : 0}
            {@const circumference = 2 * Math.PI * RING_RADIUS}
            {@const just = i % 2 === 0 ? 'center' : (i % 4 === 1 ? 'flex-end' : 'flex-start')}
            <div class="slot" style="justify-content: {just}">
                <div class="node-outer {node.status !== 'current' ? 'no-ptr' : ''}">
                    {#if node.status === 'current'}
                        <div class="relative-wrapper">
                            <div class="tooltip-container animate-bounce">
                                <div class="tooltip-box"><span class="tooltip-text">{i18n.t('learn.start')}</span></div>
                                <div class="tooltip-triangle"></div>
                            </div>
                            <div class="ring-button-wrapper" style="width: {RING_BOX}px; height: {RING_BOX}px;">
                                <svg class="progress-ring" fill="none" viewBox="0 0 {RING_BOX} {RING_BOX}" style="width: {RING_BOX}px; height: {RING_BOX}px;" aria-hidden="true">
                                    <circle cx={RING_BOX / 2} cy={RING_BOX / 2} r={RING_RADIUS} stroke-width="8" stroke="#e2e8f0"></circle>
                                    <circle class="ring-value" cx={RING_BOX / 2} cy={RING_BOX / 2} r={RING_RADIUS} stroke-width="8"
                                        stroke-linecap="round" stroke="#00978a"
                                        stroke-dasharray={circumference} transform="rotate(-90 {RING_BOX / 2} {RING_BOX / 2})"
                                        stroke-dashoffset={circumference - (circumference * ringProgress / 100)}></circle>
                                </svg>
                                <button type="button" class="three-d-button {node.type}" onclick={() => handleNodeClick(node)} aria-label={node.title}>
                                    <span class="three-d-face">
                                        {#if node.type === 'tadabbur'}
                                            <svg class="node-action-icon" aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M4 11a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11h1zM12 2a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1zm9 9a1 1 0 0 1 .117 1.993L21 13h-1a1 1 0 0 1-.117-1.993L20 11h1zM4.893 4.893a1 1 0 0 1 1.32-.083l.094.083.7.7a1 1 0 0 1-1.32 1.497l-.094-.083-.7-.7a1 1 0 0 1 0-1.414zm12.8 0a1 1 0 0 1 1.497 1.32l-.083.094-.7.7a1 1 0 0 1-1.497-1.32l.083-.094.7-.7zM14 18a1 1 0 0 1 1 1a3 3 0 0 1-6 0a1 1 0 0 1 .883-.993L10 18h4zm-2-12a6 6 0 0 1 3.6 10.8a1 1 0 0 1-.471.192L15 17H9a1 1 0 0 1-.6-.2A6 6 0 0 1 12 6z" />
                                            </svg>
                                        {:else if node.type === 'checkpoint'}
                                            <svg class="node-action-icon" aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M17 3a1 1 0 0 1 .993.883L18 4v2.17a3 3 0 1 1 0 5.659V12a6.002 6.002 0 0 1-5 5.917V20h3a1 1 0 0 1 .117 1.993L16 22H8a1 1 0 0 1-.117-1.993L8 20h3v-2.083A6.002 6.002 0 0 1 6.004 12v-.171a3 3 0 1 1-.001-5.659V4a1 1 0 0 1 1-1h10zM5 8a1 1 0 1 0 0 2a1 1 0 0 0 0-2m14 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                                            </svg>
                                        {:else}
                                            <svg class="node-book-icon" aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M12 2l.117.007a1 1 0 0 1 .876.876L13 3v4l.005.15a2 2 0 0 0 1.838 1.844L15 9h4l.117.007a1 1 0 0 1 .876.876L20 10v9a3 3 0 0 1-2.824 2.995L17 22H7a3 3 0 0 1-2.995-2.824L4 19V5a3 3 0 0 1 2.824-2.995L7 2h5zm3 14H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m0-4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m-5-4H9a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2" />
                                                <path d="M19 7h-4L15 2.999z" />
                                            </svg>
                                        {/if}
                                    </span>
                                </button>
                            </div>
                        </div>
                    {:else}
                        <div class="shell" style="width: {SHELL_BOX}px; height: {SHELL_BOX}px;">
                            <button class="circle {node.status}" onclick={() => handleNodeClick(node)}
                                disabled={node.status === 'locked' && node.type !== 'checkpoint'}
                                aria-label={node.title}>
                                {#if node.type === 'tadabbur'}
                                    <svg class="node-action-icon" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M4 11a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11h1zM12 2a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1zm9 9a1 1 0 0 1 .117 1.993L21 13h-1a1 1 0 0 1-.117-1.993L20 11h1zM4.893 4.893a1 1 0 0 1 1.32-.083l.094.083.7.7a1 1 0 0 1-1.32 1.497l-.094-.083-.7-.7a1 1 0 0 1 0-1.414zm12.8 0a1 1 0 0 1 1.497 1.32l-.083.094-.7.7a1 1 0 0 1-1.497-1.32l.083-.094.7-.7zM14 18a1 1 0 0 1 1 1a3 3 0 0 1-6 0a1 1 0 0 1 .883-.993L10 18h4zm-2-12a6 6 0 0 1 3.6 10.8a1 1 0 0 1-.471.192L15 17H9a1 1 0 0 1-.6-.2A6 6 0 0 1 12 6z" />
                                    </svg>
                                {:else if node.type === 'checkpoint'}
                                    <svg class="node-action-icon" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M17 3a1 1 0 0 1 .993.883L18 4v2.17a3 3 0 1 1 0 5.659V12a6.002 6.002 0 0 1-5 5.917V20h3a1 1 0 0 1 .117 1.993L16 22H8a1 1 0 0 1-.117-1.993L8 20h3v-2.083A6.002 6.002 0 0 1 6.004 12v-.171a3 3 0 1 1-.001-5.659V4a1 1 0 0 1 1-1h10zM5 8a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                                    </svg>
                                {:else}
                                    <svg class="node-book-icon" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M12 2l.117.007a1 1 0 0 1 .876.876L13 3v4l.005.15a2 2 0 0 0 1.838 1.844L15 9h4l.117.007a1 1 0 0 1 .876.876L20 10v9a3 3 0 0 1-2.824 2.995L17 22H7a3 3 0 0 1-2.995-2.824L4 19V5a3 3 0 0 1 2.824-2.995L7 2h5zm3 14H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m0-4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m-5-4H9a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2" />
                                        <path d="M19 7h-4L15 2.999z" />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                    {/if}
                    <div class="lbl {node.status === 'current' ? '' : 'lbl-muted'}">
                        <div class="lbl-main">{node.title}</div>
                        {#if node.type === 'checkpoint'}
                            <div class="lbl-sub">{i18n.t('learn.submit_full_surah')}</div>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}

        <!-- Gerbang penutup tangga -->
        <div class="slot" style="justify-content: center;">
            <div class="node-outer no-ptr">
                <div class="shell game-shell" style="width: {SHELL_BOX}px; height: {SHELL_BOX}px;">
                    <button class="circle gate {gateStatus}" disabled aria-label={i18n.t(`learn.gate_${ladder.gate}`)}>
                        <i class="ti {gateStatus === 'completed' ? 'ti-circle-check' : ladder.gate === 'badge' ? 'ti-award' : 'ti-flag-check'}"></i>
                    </button>
                </div>
                <div class="lbl lbl-muted">
                    <div class="lbl-main">{i18n.t(`learn.gate_${ladder.gate}`)}</div>
                    <div class="lbl-sub">{ladder.name}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Daily goal card: visible only in mobile phone mockup -->
    <div class="daily-goal-card mobile-only-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 900; color: #3c3c3c;">{i18n.t('learn.free_points_target')}</span>
            <span style="font-size: 12px; font-weight: 800; color: #afafaf;">24 / 60</span>
        </div>
        <div class="goal-bar-bg">
            <div class="goal-bar-fill" style="width: 40%"></div>
        </div>
        <div style="font-size: 10px; font-weight: 700; color: #afafaf; margin-top: 6px; display: flex; align-items: center; gap: 4px;">
            <i class="ti ti-info-circle"></i> {i18n.t('learn.reset_info')}
        </div>
    </div>
</div>

<style>
    .path-column {
        --roadmap-green-start: #11a398;
        --roadmap-green: #08b4a7;
        --roadmap-green-edge: #07988e;
        --roadmap-green-highlight: #47cfc5;
        width: 100%;
    }
    :global(.desktop-browser) .path-column { flex: 1; max-width: 700px; }
    :global(.tablet) .path-column { width: 100%; max-width: 100%; }

    .unit-banner {
        background: linear-gradient(145deg, var(--roadmap-green-start), var(--roadmap-green));
        padding: 20px;
        margin: 10px 16px 20px;
        border-radius: 20px;
        box-shadow: 0 6px 0 var(--roadmap-green-edge);
        position: relative;
        overflow: hidden;
    }
    .unit-banner .ladder-strip { display: none; }
    .unit-banner .unit-actions { margin-top: 16px; }
    .unit-banner .unit-actions button:nth-child(n + 2) { display: none; }
    .unit-banner .unit-guide-btn { background: #fff; color: #087f77; padding: 10px 16px; border-radius: 12px; box-shadow: 0 3px 0 #c7e4e1; transition: transform .1s ease, box-shadow .1s ease; }
    .unit-banner .unit-guide-btn:hover { background: #fff; color: #087f77; transform: translateY(1px); box-shadow: 0 2px 0 #c7e4e1; }
    .unit-banner .unit-guide-btn:active { background: #fff; color: #087f77; transform: translateY(3px); box-shadow: none; }
    .self-banner-icon { position: absolute; z-index: 2; right: 20px; top: 50px; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 13px; background: rgba(255,255,255,0.2); color: #fff; font-size: 23px; }
    :global(.desktop-browser) .unit-banner, :global(.tablet) .unit-banner { margin: 0; }

    .islamic-motif {
        position: absolute;
        width: 180px;
        height: 180px;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z' fill='rgba(255,255,255,0.08)'/%3E%3Cpath d='M15 15 L50 35 L85 15 L65 50 L85 85 L50 65 L15 85 L35 50 Z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
    }
    .motif-1 { right: -40px; top: -40px; transform: rotate(22.5deg); }
    .motif-2 { left: -50px; bottom: -50px; transform: rotate(45deg) scale(0.7); }

    .unit-badge { font-size: 11px; font-weight: 900; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .banner-title { position: relative; z-index: 2; font-size: 27px; font-weight: 900; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .banner-desc { position: relative; z-index: 2; margin-top: 5px; color: rgba(255,255,255,0.95); font-size: 12px; font-weight: 700; }
    .self-stats { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
    .self-stats > div { padding: 10px 11px; border-radius: 12px; background: rgba(255,255,255,0.22); }
    .self-stats strong { display: block; color: #fff; font-size: 20px; line-height: 1; }
    .self-stats small { display: block; color: rgba(255,255,255,0.85); font-size: 9px; font-weight: 800; margin-top: 5px; }
    .self-progress-track { position: relative; z-index: 2; height: 7px; margin-top: 12px; border-radius: 99px; background: rgba(255,255,255,0.25); overflow: hidden; }
    .self-progress-track span { display: block; height: 100%; border-radius: inherit; background: #fff; }

    /* Tangga berjalan */
    .ladder-strip {
        position: relative; z-index: 2;
        display: flex; align-items: center; gap: 10px; margin-top: 14px;
        background: rgba(0,0,0,0.18); border-radius: 12px; padding: 10px 12px;
    }
    .ladder-strip-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .ladder-eyebrow {
        font-size: 9px; font-weight: 900; color: rgba(255,255,255,0.75);
        text-transform: uppercase; letter-spacing: 0.6px;
    }
    .ladder-name {
        font-size: 14px; font-weight: 900; color: #fff;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ladder-progress {
        background: #fff; color: var(--duo-green-dark); font-size: 12px; font-weight: 900;
        padding: 4px 10px; border-radius: 99px; flex-shrink: 0;
    }

    .unit-actions {
        position: relative; z-index: 2;
        display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;
    }
    .unit-guide-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        background: rgba(0,0,0,0.15); color: #fff; border: none; font-family: inherit;
        padding: 8px 14px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer;
        /* Target sentuh nyaman untuk anak maupun lansia. */
        min-height: 40px;
        box-shadow: 0 3px 0 rgba(0,0,0,0.2);
        transition: transform .1s ease, box-shadow .1s ease;
    }
    .unit-guide-btn:hover { transform: translateY(1px); box-shadow: 0 2px 0 rgba(0,0,0,0.2); }
    .unit-guide-btn:active { transform: translateY(3px); box-shadow: none; }
    .unit-guide-btn:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }

    /* Peta tangga */
    .ladder-map {
        margin: 0 16px 16px; background: #fff; border: 2px solid #e5e5e5;
        border-radius: 16px; padding: 12px;
    }
    :global(.desktop-browser) .ladder-map, :global(.tablet) .ladder-map { margin: 16px 0; }
    .ladder-map-title {
        font-size: 10px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
    }
    .ladder-row {
        display: flex; align-items: center; gap: 10px;
        padding: 10px; border-radius: 12px; margin-bottom: 6px;
        background: #f8fafc; border: 1.5px solid #e2e8f0;
    }
    .ladder-row.current { background: #f0fdfa; border-color: #99f6e4; }
    .ladder-row.completed { background: #f0fdf4; border-color: #bbf7d0; }
    .ladder-row.locked { opacity: 0.6; }
    .ladder-row i { font-size: 18px; color: #94a3b8; flex-shrink: 0; }
    .ladder-row.current i { color: var(--duo-green-dark); }
    .ladder-row.completed i { color: #16a34a; }
    .ladder-row-num {
        width: 24px; height: 24px; border-radius: 50%; background: #e2e8f0;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 900; color: #475569; flex-shrink: 0;
    }
    .ladder-row-name { font-size: 13px; font-weight: 900; color: #1e293b; }
    .ladder-row-meta { font-size: 10px; font-weight: 700; color: #94a3b8; margin-top: 2px; }
    .opt-pill {
        margin-left: 6px; font-size: 9px; font-weight: 900; color: #7c3aed;
        background: #ede9fe; border-radius: 5px; padding: 2px 6px; text-transform: uppercase;
    }

    /* Mini target dalam tangga berjalan */
    .targets-strip {
        display: flex; gap: 6px; overflow-x: auto; padding: 0 16px 4px;
        scrollbar-width: none;
    }
    .targets-strip::-webkit-scrollbar { display: none; }
    :global(.desktop-browser) .targets-strip, :global(.tablet) .targets-strip { padding: 0 0 4px; }
    .target-chip {
        display: flex; align-items: center; gap: 5px; flex-shrink: 0;
        border: 1.5px solid #e5e5e5; background: #fff; border-radius: 99px;
        padding: 5px 10px; font-size: 11px; font-weight: 800; color: #94a3b8;
        max-width: 160px;
    }
    .target-chip.completed { border-color: #bbf7d0; background: #f0fdf4; color: #16a34a; }
    .target-chip.pending {
        border-style: dashed; border-color: #cbd5e1; background: #f8fafc; color: #94a3b8;
    }
    .target-chip.current { border-color: var(--duo-green); background: #e6faf8; color: var(--duo-green-dark); }
    .target-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .target-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

    /* ===== Jalan (road) node sesuai desain ring-button ===== */
    .road {
        display: flex; flex-direction: column; gap: 6px;
        padding: 20px 28px 0;
    }
    .slot { display: flex; min-width: 0; padding: 0 12px; }
    :global(.desktop-browser) .road, :global(.tablet) .road { padding-left: 28px; padding-right: 28px; }
    .node-outer { display: flex; flex-direction: column; align-items: center; position: relative; }
    .no-ptr { pointer-events: none; }

    /* Node aktif: ring progress presisi membungkus tombol 3D */
    .relative-wrapper { position: relative; }
    .tooltip-container { display: flex; flex-direction: column; align-items: center; margin-bottom: 8px; }
    .tooltip-box {
        border: 2px solid #e2e8f0; background: #fff; border-radius: 8px;
        padding: 4px 12px;
    }
    .tooltip-text { font-size: 10px; font-weight: 900; color: #0d9488; letter-spacing: 0.5px; }
    .tooltip-triangle {
        width: 0; height: 0; margin-top: -2px;
        border-left: 6px solid transparent; border-right: 6px solid transparent;
        border-top: 6px solid #e2e8f0;
    }
    .animate-bounce { animation: tooltipBounce 1.6s infinite; }
    @keyframes tooltipBounce {
        0%, 100% { transform: translateY(0); }
        40% { transform: translateY(-4px); }
    }

    .ring-button-wrapper {
        position: relative;
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        border-radius: 50%;
    }
    .ring-button-wrapper .progress-ring {
        grid-area: 1 / 1;
        display: block;
        overflow: visible;
        pointer-events: none;
        z-index: 0;
    }
    .progress-ring circle { transition: stroke-dashoffset .25s ease; }
    .ring-value { stroke: var(--roadmap-green); stroke-linecap: round; }
    .three-d-button {
        /* Tombol dan kedalamannya satu lingkaran utuh. Shadow dibuat inset,
           bukan ditambahkan di luar diameter tombol. */
        --node-face: var(--roadmap-green);
        --node-edge: var(--roadmap-green-edge);
        --node-highlight: var(--roadmap-green-highlight);
        grid-area: 1 / 1;
        position: relative;
        z-index: 1;
        width: 76px; height: 70px;
        box-sizing: border-box;
        margin: 0; padding: 0;
        overflow: hidden;
        border-radius: 50%; border: 0; cursor: pointer;
        appearance: none; -webkit-appearance: none;
        background: var(--node-face); color: #fff; font-size: 34px;
        border: 0;
        background: var(--node-face);
        box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 rgba(255,255,255,.1);
        transform: translateY(-3px);
        transition: transform .12s ease, box-shadow .12s ease;
        isolation: isolate;
    }
    .three-d-face {
        position: relative;
        z-index: 1;
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        transition: transform .12s ease;
        transform: translateY(0);
    }
    .node-book-icon {
        position: relative;
        z-index: 1;
        width: 34px;
        height: 34px;
        display: block;
        fill: currentColor;
    }
    .node-action-icon {
        position: relative;
        z-index: 1;
        width: 34px;
        height: 34px;
        display: block;
        fill: currentColor;
    }
    .three-d-button::before,
    .circle::before {
        content: '';
        position: absolute;
        width: 80%;
        height: auto;
        aspect-ratio: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: var(--node-highlight, #42e3c5);
        opacity: .76;
        pointer-events: none;
        z-index: 0;
    }
    .three-d-button::after,
    .circle::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            transparent 0 37%,
            var(--node-face, #00978a) 37% 47%,
            transparent 47% 60%,
            var(--node-face, #00978a) 60% 88%,
            transparent 88% 100%
        );
        pointer-events: none;
        z-index: 0;
    }
    .three-d-button:hover { transform: translateY(-2px); box-shadow: 0 4px 0 var(--node-edge), inset 0 2px 0 rgba(255,255,255,.1); }
    .three-d-button:hover .three-d-face { transform: none; }
    .three-d-button:active { transform: translateY(0); box-shadow: none; }
    .three-d-button:active .three-d-face { transform: none; }
    .three-d-button.tadabbur { --node-face: #ce82ff; --node-edge: #a52adb; --node-highlight: #e3b6ff; }
    .three-d-button.checkpoint { --node-face: #ffc800; --node-edge: #e5a000; --node-highlight: #ffdf4d; }

    /* Node lain: cangkang bulat */
    .shell { display: flex; align-items: center; justify-content: center; }
    .circle {
        --node-face: #e5e5e5;
        --node-edge: #cbd5e1;
        --node-inset: rgba(255,255,255,.35);
        position: relative;
        overflow: hidden;
        width: 82px; height: 76px; border-radius: 50%; border: none; cursor: pointer;
        background: #e5e5e5; color: #afafaf; font-size: 34px;
        display: flex; align-items: center; justify-content: center;
        border: 0;
        background: #e5e5e5;
        box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset);
        transform: translateY(-3px);
        isolation: isolate;
        transition: transform .12s ease, box-shadow .12s ease;
    }
    .circle > i,
    .circle > .node-book-icon,
    .circle > .node-action-icon { position: relative; z-index: 1; }
    .circle:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 4px 0 var(--node-edge), inset 0 2px 0 var(--node-inset); }
    .circle:not(:disabled):active { transform: translateY(0); box-shadow: none; }
    .circle:disabled { cursor: default; }
    .circle.completed { --node-face: var(--roadmap-green); --node-edge: var(--roadmap-green-edge); --node-highlight: var(--roadmap-green-highlight); --node-inset: rgba(255,255,255,.1); background: var(--roadmap-green); box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset); color: #fff; }
    .circle.locked { --node-edge: #cbd5e1; background: #e5e5e5; box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset); color: #afafaf; }
    .circle.locked::before,
    .circle.locked::after { display: none; }
    .circle.available {
        --node-face: #fff;
        --node-edge: var(--roadmap-green-edge);
        --node-inset: rgba(255,255,255,.5);
        background: #fff; box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset);
        border: 3px solid var(--roadmap-green); color: var(--roadmap-green-edge);
    }
    .circle.gate { --node-face: #f1f5f9; --node-edge: #cbd5e1; --node-inset: rgba(255,255,255,.45); background: #f1f5f9; box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset); color: #94a3b8; }
    .circle.gate.available { --node-face: #e8f8f6; --node-edge: #5ccfc2; background: #e8f8f6; box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset); color: #008f83; }
    .circle.gate.completed { --node-face: #ffc800; --node-edge: #e5a000; --node-highlight: #ffdf4d; --node-inset: rgba(255,255,255,.2); background: #ffc800; box-shadow: 0 6px 0 var(--node-edge), inset 0 3px 0 var(--node-inset); color: #fff; }

    /* Label node */
    .lbl { margin-top: 10px; text-align: center; }
    .lbl-main { font-size: 13px; font-weight: 800; color: #3c3c3c; }
    .lbl-sub { font-size: 11px; font-weight: 700; color: #94a3b8; margin-top: 2px; }
    .lbl-muted .lbl-main { color: #9ca3af; }

    .all-done {
        margin: 20px 16px 0; padding: 26px 18px; text-align: center;
        background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
        border: 2px solid #bbf7d0; border-radius: 18px;
    }
    :global(.desktop-browser) .all-done, :global(.tablet) .all-done { margin: 20px 0 0; }
    .all-done :global(.btn-duo) { margin-top: 14px; }
    .ad-title { font-size: 16px; font-weight: 900; color: #065f46; margin-top: 8px; }
    .ad-sub { font-size: 12px; font-weight: 700; color: #10b981; margin-top: 6px; line-height: 1.5; }

    .no-content {
        margin: 20px 16px 0; padding: 24px 16px; text-align: center;
        background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px;
    }
    :global(.desktop-browser) .no-content, :global(.tablet) .no-content { margin: 20px 0 0; }
    .nc-title { font-size: 14px; font-weight: 900; color: #475569; margin-top: 8px; }
    .nc-sub { font-size: 12px; font-weight: 700; color: #94a3b8; margin-top: 4px; line-height: 1.5; }

    .daily-goal-card { background: #fff; border: 2px solid #e5e5e5; border-radius: 16px; padding: 14px; margin-top: 20px; }
    .mobile-only-card { margin: 0 16px 20px; display: block; }
    :global(.desktop-browser) .mobile-only-card { display: none; }
    :global(.tablet) .mobile-only-card { display: block; margin: 0 0 20px; }
    .goal-bar-bg { height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden; }
    .goal-bar-fill { height: 100%; background: #00978A; border-radius: 4px; }
</style>
