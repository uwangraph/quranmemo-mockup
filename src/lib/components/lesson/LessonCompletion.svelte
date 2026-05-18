<script>
    import { fade, fly } from 'svelte/transition';
    let { showCompletion, activeVerse, selectedVerseIndex, lessonEarnedXP, lessonEarnedCoins, onFinish } = $props();
</script>

{#if showCompletion}
<div class="completion-overlay" transition:fade={{duration: 200}}>
    <div class="completion-card" transition:fly={{y: 20, duration: 300}}>
        <div class="completed-trophy-img">🏆</div>
        <div class="congrats-headline">✅ ONE PATH FINISHED!</div>
        <div class="congrats-sub">
            {#if selectedVerseIndex > 0}
                Satu ayat benar-benar hafal bersambung dengan ayat sebelumnya.
            {:else}
                Selamat! Ayat {activeVerse.verseNumber} dari Surah Al-Insyirah sudah benar-benar hafal di luar kepala!
            {/if}
        </div>
        
        <div class="reward-box">
            <div class="reward-item">
                <span class="reward-icon gold">⚡</span>
                <span class="reward-value">+{lessonEarnedXP} XP</span>
                <span class="reward-label">STREAK BONUS</span>
            </div>
            <div class="reward-item memo-cashback">
                <span class="reward-icon teal">🔄</span>
                <span class="reward-value-teal">+{lessonEarnedCoins} Poin</span>
                <span class="reward-label-teal">MEMO CASHBACK</span>
            </div>
        </div>
        
        <div class="button-column">
            <button class="btn-duo btn-green" onclick={onFinish}>
                HAFAL AYAT LAINNYA
            </button>
            <button class="btn-duo btn-outline" onclick={onFinish}>
                KEMBALI KE ROADMAP
            </button>
        </div>
    </div>
</div>
{/if}

<style>
    .completion-overlay {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 150;
    }
    .completion-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 6px;
        border-radius: 28px;
        padding: 36px 24px;
        width: 90%;
        max-width: 440px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .completed-trophy-img {
        font-size: 64px;
        margin-bottom: 12px;
        animation: zoomBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .congrats-headline {
        font-size: 20px;
        font-weight: 950;
        color: #00978A;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }
    .congrats-sub {
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
        margin: 0 0 20px;
        line-height: 1.4;
        padding: 0 16px;
    }
    .reward-box {
        display: flex;
        width: 100%;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 16px 0;
        margin: 20px 0;
    }
    .reward-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }
    .reward-item.memo-cashback {
        border-left: 2px solid #e5e5e5;
    }
    .reward-icon {
        font-size: 24px;
    }
    .reward-value {
        font-size: 15px;
        font-weight: 900;
        color: #3c3c3c;
    }
    .reward-value-teal {
        font-size: 15px;
        font-weight: 900;
        color: #00978A;
    }
    .reward-label {
        font-size: 9px;
        font-weight: 700;
        color: #afafaf;
    }
    .reward-label-teal {
        font-size: 9px;
        font-weight: 700;
        color: #00978A;
    }
    .button-column {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }
    .btn-duo {
        width: 100%;
        padding: 14px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        background: #fff;
        font-size: 13px;
        font-weight: 900;
        color: #afafaf;
        cursor: pointer;
        transition: all 0.1s ease;
        text-align: center;
        box-sizing: border-box;
    }
    .btn-duo:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .btn-duo.btn-green {
        background: #00978A;
        border-color: #00978A;
        border-bottom-color: #007A70;
        color: #fff;
    }
    .btn-duo.btn-green:active {
        border-bottom-color: #00978A;
    }
    .btn-duo.btn-outline {
        border: 2px solid #e2e8f0;
        color: #64748b;
        background: #fff;
    }

    @keyframes zoomBounce {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.1); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
</style>
