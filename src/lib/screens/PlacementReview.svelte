<script>
    // Verifikasi Placement Test (ONBOARDING.md §1.3) dari sisi musyrif.
    //
    // Menggantikan tiga tombol kategori instan di dasbor: musyrif mendengar rekaman,
    // menulis catatan untuk santri, dan boleh merekomendasikan surah — baru setelah
    // itu menjatuhkan kategori. Sistem tidak pernah menentukan kategori sendiri.
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import { SURAHS } from '$lib/data/surahs.js';
    import { PLACEMENT_CATEGORIES } from '$lib/data/placementCategories.js';

    const entry = $derived(appState.placementReview);

    let selectedCategory = $state(null);
    let note = $state('');
    let selectedSurah = $state('');

    // Form dikosongkan setiap kali entri berganti — bukan tiap render — supaya
    // membuka santri lain tidak mewarisi catatan santri sebelumnya. Entri yang
    // sudah diputuskan tidak lagi bisa dibuka dari dasbor (kartunya menampilkan
    // verdict, bukan tombol "Cek"), jadi tidak ada keputusan lama untuk diisi ulang.
    let lastEntryId = null;
    $effect(() => {
        if (entry?.id === lastEntryId) return;
        lastEntryId = entry?.id ?? null;
        selectedCategory = null;
        note = '';
        selectedSurah = '';
    });

    // Rekaman disimulasikan: mockup ini tidak menyimpan berkas audio sungguhan untuk
    // tiap pengiriman santri, jadi pemutaran diperagakan lewat animasi progres
    // sepanjang durasi wajar bacaan QS Maryam 1-10.
    const DURATION_MS = 46000;
    let playing = $state(false);
    let progress = $state(0); // 0..1
    let timer = -1;

    $effect(() => () => clearInterval(timer));

    function togglePlay() {
        if (playing) {
            clearInterval(timer);
            playing = false;
            return;
        }
        if (progress >= 1) progress = 0;
        playing = true;
        const startedAt = Date.now() - progress * DURATION_MS;
        timer = setInterval(() => {
            progress = Math.min(1, (Date.now() - startedAt) / DURATION_MS);
            if (progress >= 1) {
                clearInterval(timer);
                playing = false;
            }
        }, 100);
    }

    function formatTime(ms) {
        const s = Math.max(0, Math.round(ms / 1000));
        return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }

    // Batang gelombang tetap sama untuk entri yang sama sepanjang sesi ini —
    // diturunkan dari id-nya, bukan acak murni, supaya tidak berubah tiap render.
    const waveform = $derived.by(() => {
        if (!entry) return [];
        let seed = [...entry.id].reduce((n, c) => n + c.charCodeAt(0), 1);
        return Array.from({ length: 32 }, () => {
            seed = (seed * 9301 + 49297) % 233280;
            return 6 + Math.round((seed / 233280) * 22);
        });
    });

    const surahOptions = $derived(Object.values(SURAHS).sort((a, b) => b.juz - a.juz || b.number - a.number));

    const canSubmit = $derived(selectedCategory !== null);

    function submit() {
        if (!canSubmit) return;
        clearInterval(timer);
        appState.submitPlacementReview({ category: selectedCategory, note, surahName: selectedSurah || null });
        appState.go('musyrif');
    }

    function back() {
        clearInterval(timer);
        appState.closePlacementReview();
        appState.go('musyrif');
    }
</script>

<div class="screen">
    <div class="topbar">
        <button class="back-btn" onclick={back} aria-label={i18n.t('common.back')}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <span style="font-size:16px; font-weight:900; color:#3c3c3c; flex:1; text-align:center;">
            {i18n.t('musyrif.review_title')}
        </span>
        <div style="width:40px;"></div>
    </div>

    {#if !entry}
        <div class="scroll-content no-scrollbar" style="display:flex; align-items:center; justify-content:center;">
            <div class="not-found">
                <span style="font-size:34px;">🎧</span>
                <p>{i18n.t('musyrif.review_not_found')}</p>
                <button class="btn-duo btn-green btn-auto" onclick={() => appState.go('musyrif')}>
                    {i18n.t('common.back')}
                </button>
            </div>
        </div>
    {:else}
        <div class="scroll-content no-scrollbar">
            <!-- Identitas santri -->
            <div class="student-card">
                <div class="student-avatar">🎧</div>
                <div style="flex:1; min-width:0;">
                    <div class="student-name">
                        {entry.name}
                        {#if entry.self}<span class="pl-self">{i18n.t('lb.you_badge')}</span>{/if}
                    </div>
                    <div class="student-meta">QS Maryam 1-10</div>
                </div>
                <span class="sla-pill">{i18n.t('placement.sla_left', { hours: entry.hours })}</span>
            </div>

            <!-- Pemutar rekaman -->
            <div class="section-label">🎙️ {i18n.t('musyrif.review_recording')}</div>
            <div class="pad">
                <div class="player-card">
                    <button
                        class="play-btn"
                        onclick={togglePlay}
                        aria-label={i18n.t(playing ? 'musyrif.review_pause' : 'musyrif.review_play')}
                    >
                        <i class="ti {playing ? 'ti-player-pause-filled' : 'ti-player-play-filled'}"></i>
                    </button>
                    <div style="flex:1; min-width:0;">
                        <div class="wave-row">
                            {#each waveform as h, i}
                                <span class="wave-bar" class:played={i / waveform.length <= progress} style="height:{h}px"></span>
                            {/each}
                        </div>
                        <div class="time-row">
                            <span>{formatTime(progress * DURATION_MS)}</span>
                            <span>{formatTime(DURATION_MS)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Catatan untuk santri -->
            <div class="section-label">📝 {i18n.t('musyrif.review_notes_label')}</div>
            <div class="pad">
                <textarea
                    class="note-input"
                    rows="3"
                    placeholder={i18n.t('musyrif.review_notes_placeholder')}
                    bind:value={note}
                ></textarea>
            </div>

            <!-- Rekomendasi surah -->
            <div class="section-label">📖 {i18n.t('musyrif.review_surah_label')}</div>
            <div class="pad">
                <select class="own-input" bind:value={selectedSurah} aria-label={i18n.t('musyrif.review_surah_label')}>
                    <option value="">{i18n.t('musyrif.review_surah_placeholder')}</option>
                    {#each surahOptions as s}
                        <option value={s.name}>{s.name} · Juz {s.juz}</option>
                    {/each}
                </select>
            </div>

            <!-- Kategori -->
            <div class="section-label">🎯 {i18n.t('musyrif.review_category_label')}</div>
            <div class="pad cat-list">
                {#each PLACEMENT_CATEGORIES as c}
                    <button
                        type="button"
                        class="cat-card"
                        class:selected={selectedCategory === c.id}
                        style={selectedCategory === c.id ? `background:${c.bg}; border-color:${c.edge};` : ''}
                        onclick={() => (selectedCategory = c.id)}
                    >
                        <span class="cat-icon">{c.icon}</span>
                        <div style="flex:1; min-width:0; text-align:left;">
                            <div class="cat-name" style={selectedCategory === c.id ? `color:${c.color}` : ''}>
                                {i18n.t(`placement.cat_${c.id}`)}
                            </div>
                            <div class="cat-desc">{i18n.t(`placement.cat_${c.id}_desc`)}</div>
                        </div>
                        {#if selectedCategory === c.id}
                            <i class="ti ti-circle-check-filled" style="color:{c.color}; font-size:20px; flex-shrink:0;"></i>
                        {/if}
                    </button>
                {/each}
            </div>

            <div style="height:16px;"></div>
        </div>

        <div style="padding:16px 20px 20px; background:#fff; border-top:2px solid #f0f0f0;">
            <button class="btn-duo" class:btn-green={canSubmit} class:btn-disabled={!canSubmit} disabled={!canSubmit} onclick={submit}>
                {i18n.t('musyrif.review_submit')}
            </button>
        </div>
    {/if}
</div>

<style>
    .back-btn {
        background: none; border: none; color: #afafaf; cursor: pointer; font-size: 20px;
        min-width: 40px; min-height: 40px; display: flex; align-items: center; justify-content: center;
    }
    .not-found {
        display: flex; flex-direction: column; align-items: center; gap: 10px;
        padding: 24px; text-align: center; color: #64748b; font-size: 13px; font-weight: 700;
    }

    .pad { padding: 0 16px; }

    .student-card {
        display: flex; align-items: center; gap: 12px;
        margin: 14px 16px 0; padding: 12px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 16px;
    }
    .student-avatar {
        width: 42px; height: 42px; border-radius: 50%; background: #f1f5f9;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; flex-shrink: 0;
    }
    .student-name {
        font-size: 14px; font-weight: 900; color: #3c3c3c;
        display: flex; align-items: center; gap: 6px;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .pl-self {
        font-size: 8px; font-weight: 900; background: #00978A; color: #fff;
        padding: 1px 6px; border-radius: 99px; text-transform: uppercase; flex-shrink: 0;
    }
    .student-meta { font-size: 11px; font-weight: 700; color: #94a3b8; margin-top: 2px; }
    .sla-pill {
        flex-shrink: 0; font-size: 10px; font-weight: 900; color: #64748b;
        background: #f1f5f9; padding: 4px 8px; border-radius: 99px; white-space: nowrap;
    }

    /* Pemutar rekaman */
    .player-card {
        display: flex; align-items: center; gap: 14px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 16px; padding: 14px;
    }
    .play-btn {
        width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
        background: #00978A; color: #fff; border: none;
        box-shadow: 0 3px 0 #007a6e;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; cursor: pointer;
        transition: transform .1s ease, box-shadow .1s ease;
    }
    .play-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #007a6e; }
    .wave-row {
        display: flex; align-items: center; gap: 2px; height: 30px;
    }
    .wave-bar {
        flex: 1; min-width: 2px; max-width: 4px; border-radius: 2px;
        background: #e2e8f0; transition: background .15s ease;
    }
    .wave-bar.played { background: #5eead4; }
    .time-row {
        display: flex; justify-content: space-between; margin-top: 6px;
        font-size: 10px; font-weight: 800; color: #94a3b8; font-variant-numeric: tabular-nums;
    }

    .note-input {
        width: 100%; padding: 12px 14px; border: 2px solid #e5e5e5; border-radius: 14px;
        background: #fff; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
        color: #3c3c3c; resize: vertical; box-sizing: border-box;
    }
    .note-input:focus { outline: none; border-color: #1cb0f6; }

    .own-input {
        width: 100%; padding: 13px 14px; border: 2px solid #e5e5e5; border-radius: 12px;
        background: #fff; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
        color: #3c3c3c; min-height: 48px; box-sizing: border-box;
    }
    .own-input:focus { outline: none; border-color: #1cb0f6; }

    .cat-list { display: flex; flex-direction: column; gap: 10px; }
    .cat-card {
        display: flex; align-items: center; gap: 12px; width: 100%;
        background: #fff; border: 2px solid #e5e5e5; border-bottom-width: 4px;
        border-radius: 16px; padding: 12px 14px; cursor: pointer;
        font-family: 'Nunito', sans-serif; min-height: 56px;
    }
    .cat-icon { font-size: 24px; flex-shrink: 0; }
    .cat-name { font-size: 14px; font-weight: 900; color: #1e293b; }
    .cat-desc { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px; line-height: 1.4; }
</style>
