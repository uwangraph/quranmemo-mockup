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
            <div class="self-banner-icon"><i class="ti ti-book-2"></i></div>
            {@const bannerDone = appState.surahProgress(surah.id)}
            {@const bannerProgress = Math.round((bannerDone / surah.verses.length) * 100)}
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
            <span class="ladder-progress">{doneCount}/{targets.length}</span>
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
                    <i class="ti {state === 'completed' ? 'ti-circle-check-filled' : state === 'current' ? 'ti-player-play-filled' : 'ti-lock'}"></i>
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

    <div class="current-target-label">
        {i18n.t('learn.current_mini_target')}: <strong>{targetName ?? '—'}</strong>
    </div>

    {#if !surah && st.availableAllDone}
        <!-- Semua yang bisa dikerjakan sudah tuntas. Lebih baik menyatakannya dan
             mengarahkan ke murajaah daripada meninggalkan layar buntu. -->
        <div class="all-done">
            <span style="font-size:38px;">🎉</span>
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
            <span style="font-size:34px;">📝</span>
            <div class="nc-title">{i18n.t('learn.content_pending')}</div>
            <div class="nc-sub">{i18n.t('learn.content_pending_desc', { target: targetName ?? '—' })}</div>
        </div>
    {/if}

    <div class="path-container">
        {#each innerNodes as node, i}
            <div class="node-wrapper" style="margin-left: {i % 2 === 0 ? '20px' : '-20px'}">
                <button class="node-btn {node.type} {node.status}" onclick={() => handleNodeClick(node)}>
                    {#if node.type === 'review'}
                        <i class="ti ti-refresh"></i>
                    {:else if node.type === 'tadabbur'}
                        <i class="ti ti-books"></i>
                    {:else if node.type === 'checkpoint'}
                        <i class="ti ti-trophy"></i>
                    {:else}
                        <i class="ti ti-book"></i>
                    {/if}

                    {#if node.status === 'current'}
                        <div class="node-popover">{i18n.t('learn.start')}</div>
                    {/if}
                </button>
                <div class="node-title">{node.title}</div>
            </div>

            {#if i < innerNodes.length - 1}
                <div class="connector {innerNodes[i+1].status}"></div>
            {/if}
        {/each}

        <!-- Gerbang penutup tangga -->
        <div class="connector {gateStatus}"></div>
        <div class="node-wrapper">
            <div class="node-btn gate {gateStatus}">
                <i class="ti {gateStatus === 'completed' ? 'ti-circle-check-filled' : ladder.gate === 'badge' ? 'ti-award' : 'ti-flag-check'}"></i>
            </div>
            <div class="node-title">{i18n.t(`learn.gate_${ladder.gate}`)} — {ladder.name}</div>
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
    .path-column { width: 100%; }
    :global(.desktop-browser) .path-column { flex: 1; max-width: 700px; }
    :global(.tablet) .path-column { width: 100%; max-width: 100%; }

    .unit-banner {
        background: linear-gradient(135deg, var(--duo-green), var(--duo-green-dark));
        padding: 24px 20px;
        margin: 10px 16px 20px;
        border-radius: 20px;
        box-shadow: 0 6px 0 #00665d;
        position: relative;
        overflow: hidden;
    }
    .unit-banner { background: linear-gradient(145deg, #11a398, #08b4a7); padding: 20px; border-radius: 20px; box-shadow: 0 6px 0 #07988e; }
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

    .current-target-label {
        padding: 10px 16px 0; font-size: 12px; font-weight: 700; color: #64748b;
    }
    .current-target-label strong { color: #1e293b; font-weight: 900; }
    :global(.desktop-browser) .current-target-label, :global(.tablet) .current-target-label { padding: 10px 0 0; }

    .path-container { display: flex; flex-direction: column; align-items: center; padding-top: 30px; }
    .node-wrapper { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; }
    .node-btn {
        width: 60px; height: 56px; border-radius: 50%; border: none; border-bottom: 6px solid #e5e5e5;
        background: #e5e5e5; color: #afafaf; font-size: 24px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; position: relative; transition: all 0.1s;
    }
    .node-btn:not(.locked):hover { transform: translateY(1px); border-bottom-width: 3px; }
    .node-btn:not(.locked):active { transform: translateY(3px); border-bottom-width: 0; }

    .node-btn.completed { background: var(--duo-green); border-bottom-color: var(--duo-green-dark); color: #fff; }
    .node-btn.current { background: var(--duo-green); border-bottom-color: var(--duo-green-dark); color: #fff; animation: pulse 2s infinite; }
    .node-btn.locked { background: #e5e5e5; border-bottom-color: #afafaf; color: #afafaf; cursor: not-allowed; }

    /* Terbuka tapi belum dikerjakan: berongga, untuk membedakannya dari node
       terisi penuh yang berarti sudah selesai. */
    .node-btn.available {
        background: #fff;
        border: 3px solid var(--duo-green);
        border-bottom: 6px solid var(--duo-green-dark);
        color: var(--duo-green-dark);
    }

    .node-btn.tadabbur.completed { background: #ce82ff; border-bottom-color: #a52adb; }
    .node-btn.tadabbur.available { border-color: #ce82ff; border-bottom-color: #a52adb; color: #a52adb; }
    .node-btn.checkpoint.completed { background: #ffc800; border-bottom-color: #e5a000; }
    .node-btn.gate { background: #f1f5f9; border-bottom-color: #cbd5e1; color: #94a3b8; cursor: default; }
    .node-btn.gate.available { background: #fef3c7; border-bottom-color: #fbbf24; color: #b45309; }
    .node-btn.gate.completed { background: #ffc800; border-bottom-color: #e5a000; color: #fff; }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 151, 138, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(0, 151, 138, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 151, 138, 0); }
    }

    .node-popover {
        position: absolute; top: -40px; background: #fff; border: 2px solid #e5e5e5; padding: 4px 12px;
        border-radius: 8px; font-size: 11px; font-weight: 900; color: var(--duo-green); box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .node-popover::after {
        content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
        border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #e5e5e5;
    }
    .node-title { font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 8px; text-align: center; }
    .connector { width: 8px; height: 40px; background: #e5e5e5; margin: 4px 0; z-index: 1; }
    .connector.completed, .connector.current, .connector.available { background: #d7ffb2; }

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
    .goal-bar-fill { height: 100%; background: #ff9600; border-radius: 4px; }
</style>
