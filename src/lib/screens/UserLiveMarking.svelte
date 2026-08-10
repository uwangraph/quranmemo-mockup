<script>
    import { appState } from '$lib/app.svelte.js';
    import { surahByName } from '$lib/data/surahs.js';

    const session = $derived(appState.liveSession);
    const verses = $derived.by(() => {
        const surah = surahByName(session.surah);
        const [from, to = from] = String(session.ayah).match(/\d+/g)?.map(Number) ?? [];
        return surah?.verses.filter((item) => item.verseNumber >= from && item.verseNumber <= to) ?? [];
    });
    let isMuted = $state(false);
    let isCameraOn = $state(true);
    let elapsed = $state('04:20');
</script>

<div class="screen user-live-screen">
    <header class="session-header">
        <button aria-label="Kembali" onclick={() => appState.go('murojaah')} class="back-btn">
            <i class="ti ti-arrow-left"></i>
        </button>
        <div class="session-person">
            <strong>{session.musyrifName}</strong>
            <span><i></i> LIVE — {session.surah}: {session.ayah}</span>
        </div>
        <div class="timer">{elapsed}</div>
    </header>

    <div class="call-stage">
        <div class="remote-video">
            <img src="/musyrif.png" alt={session.musyrifName} />
            <div class="remote-label">{session.musyrifName}</div>
        </div>
        <div class="self-preview">
            <img src="/student.png" alt="Anda" />
            <span>ANDA</span>
        </div>
        <div class="call-controls">
            <button class:active={isMuted} aria-label="Mikrofon" onclick={() => isMuted = !isMuted}><i class="ti" class:ti-microphone-off={isMuted} class:ti-microphone={!isMuted}></i></button>
            <button class:active={!isCameraOn} aria-label="Kamera" onclick={() => isCameraOn = !isCameraOn}><i class="ti" class:ti-video-off={!isCameraOn} class:ti-video={isCameraOn}></i></button>
            <button class="hangup" aria-label="Akhiri" onclick={() => appState.go('murojaah')}><i class="ti ti-phone-off"></i></button>
        </div>
    </div>

    <section class="recitation-panel">
        <div class="eyebrow">SETORAN ANDA</div>
        <h2>{session.surah} · Ayat {session.ayah}</h2>
        <p class="hint">Baca ayat yang dipilih. Musyrif akan memberi tanda koreksi secara langsung.</p>
        <div class="verse-card" dir="rtl">
            {#if verses.length}
                {#each verses as verse}
                    {#each verse.words as word}
                        <span>{word}</span>
                    {/each}
                    <span class="verse-number">﴿{verse.verseNumber}﴾</span>
                {/each}
            {:else}
                <span class="missing">Ayat belum tersedia di data latihan.</span>
            {/if}
        </div>
        <div class="status-row"><i class="ti ti-circle-check-filled"></i> Terhubung dengan {session.musyrifName}</div>
    </section>

    <footer class="session-footer">
        <button class="btn-duo btn-outline" onclick={() => appState.go('murojaah')}>BATAL</button>
        <button class="btn-duo btn-green" onclick={() => appState.go('feedback')}>SELESAI SETORAN</button>
    </footer>
</div>

<style>
    .user-live-screen { background: #f8fafc; color: #263238; overflow: hidden; display: flex; flex-direction: column; height: 100%; }
    .session-header { height: 64px; flex-shrink: 0; display: flex; align-items: center; gap: 10px; padding: 0 16px; background: #fff; border-bottom: 1px solid #e2e8f0; }
    .back-btn { border: 0; background: none; color: #94a3b8; font-size: 22px; padding: 6px; }
    .session-person { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .session-person strong { font-size: 14px; }
    .session-person span { font-size: 10px; font-weight: 800; color: #00978a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .session-person span i { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
    .timer { color: #ef4444; border: 1px solid #ef4444; border-radius: 99px; padding: 7px 12px; font-size: 12px; font-weight: 900; }
    .call-stage { height: 260px; flex-shrink: 0; position: relative; overflow: hidden; background: #18202b; }
    .remote-video { height: 100%; display: flex; justify-content: center; position: relative; }
    .remote-video img { height: 100%; width: 100%; object-fit: cover; opacity: .78; }
    .remote-label { position: absolute; left: 14px; bottom: 14px; color: #fff; font-size: 11px; font-weight: 900; background: #0008; padding: 6px 9px; border-radius: 8px; }
    .self-preview { position: absolute; top: 14px; right: 14px; width: 72px; height: 92px; border: 2px solid #fff; border-radius: 12px; overflow: hidden; background: #334155; box-shadow: 0 4px 15px #0006; }
    .self-preview img { width: 100%; height: 100%; object-fit: cover; }
    .self-preview span { position: absolute; bottom: 3px; left: 0; right: 0; color: #fff; text-align: center; font-size: 8px; font-weight: 900; }
    .call-controls { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; padding: 8px 12px; background: #0008; border-radius: 99px; }
    .call-controls button { width: 38px; height: 38px; border: 0; border-radius: 50%; color: #fff; background: #ffffff22; font-size: 17px; }
    .call-controls button.active { background: #f59e0b; }
    .call-controls button.hangup { background: #ef4444; }
    .recitation-panel { margin-top: -22px; position: relative; z-index: 2; background: #fff; border-radius: 28px 28px 0 0; padding: 24px 20px 28px; min-height: 320px; flex: 1; min-height: 0; overflow-y: auto; }
    .eyebrow { color: #94a3b8; font-size: 10px; font-weight: 900; letter-spacing: .6px; }
    h2 { margin: 7px 0 5px; font-size: 18px; }
    .hint { margin: 0 0 16px; color: #64748b; font-size: 11px; font-weight: 700; line-height: 1.45; }
    .verse-card { min-height: 130px; max-height: 280px; overflow-y: auto; display: flex; flex-wrap: wrap; align-content: center; justify-content: center; gap: 12px 18px; padding: 20px 16px; border: 2px solid #e2e8f0; border-bottom-width: 4px; border-radius: 20px; color: #263238; font-family: 'Traditional Arabic', serif; font-size: 28px; line-height: 1.6; }
    .verse-card span { white-space: nowrap; }
    .verse-card .verse-number { color: #00978a; font-family: inherit; font-size: 20px; font-weight: 900; }
    .verse-card .missing { font-family: inherit; font-size: 12px; color: #ef4444; }
    .status-row { margin-top: 16px; color: #00978a; font-size: 11px; font-weight: 800; text-align: center; }
    .session-footer { flex-shrink: 0; display: flex; gap: 10px; padding: 14px 16px; background: #fff; border-top: 1px solid #e2e8f0; position: relative; z-index: 5; }
    .session-footer button { flex: 1; font-size: 11px; }
</style>
