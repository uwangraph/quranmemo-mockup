<script>
    import { appState } from '$lib/app.svelte.js';
    
    let corrections = $state([]);
    
    function mark(word, type) {
        const colorMap = {
            Lupa: "#cc0000",
            Tajwid: "#cc7000",
            Makhraj: "#0898dc"
        };
        corrections = [{ word, type, color: colorMap[type] }, ...corrections];
    }
    
    function removeCorrection(index) {
        corrections = corrections.filter((_, i) => i !== index);
    }
</script>

<div class="screen">
    <div class="marking-header">
        <button onclick={() => appState.go('musyrif')} class="close-btn">
            <i class="ti ti-x"></i>
        </button>
        <div style="flex: 1">
            <div style="font-size: 13px; font-weight: 900">Ahmad Hafidz</div>
            <div style="font-size: 10px; font-weight: 700; color: #58cc02">🔴 LIVE — Al-Mulk: 12</div>
        </div>
        <div style="display: flex; gap: 6px">
            <i class="ti ti-microphone" style="color: #58cc02"></i>
            <i class="ti ti-video"></i>
        </div>
    </div>

    <div class="marking-content scroll-content">
        <div class="instruction">Ketuk kata untuk memberi tanda koreksi</div>
        
        <div class="quran-text">
            إِنَّ الَّذِينَ 
            <button class="marking-word" onclick={() => mark('يَخۡشَوۡنَ', 'Lupa')}>يَخۡشَوۡنَ</button>
            <button class="marking-word" onclick={() => mark('رَبَّهُم', 'Tajwid')}>رَبَّهُم</button>
            بِٱلۡغَيۡبِ لَهُم
            <button class="marking-word" onclick={() => mark('مَّغۡفِرَةٞ', 'Makhraj')}>مَّغۡفِرَةٞ</button>
            وَأَجۡرٞ كَبِيرٞ
        </div>

        <div style="margin-top: 24px; width: 100%">
            <div class="section-label" style="padding: 0; margin-bottom: 10px;">Laporan Koreksi</div>
            <div class="log-container">
                {#if corrections.length === 0}
                    <div style="font-size: 12px; font-weight: 700; color: #afafaf">Belum ada koreksi</div>
                {:else}
                    {#each corrections as item, i}
                        <div class="log-entry" style="color: {item.color}">
                            <span>{item.type}: "{item.word}"</span>
                            <button onclick={() => removeCorrection(i)} class="remove-btn">✕</button>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>

    <div class="marking-footer">
        <button class="btn-duo btn-outline" style="flex: 1; font-size: 13px">BERI FEEDBACK</button>
        <button class="btn-duo btn-green" style="flex: 1; font-size: 13px" onclick={() => appState.go('musyrif')}>SELESAI</button>
    </div>
</div>

<style>
    .marking-header {
        background: #3c3c3c;
        padding: 12px 16px;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #fff;
        font-size: 20px;
    }
    .marking-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .instruction {
        font-size: 11px;
        font-weight: 800;
        color: #afafaf;
        margin-bottom: 16px;
        text-transform: uppercase;
    }
    .quran-text {
        font-size: 24px;
        font-family: serif;
        direction: rtl;
        line-height: 2.5;
        color: #3c3c3c;
        background: #fdfdfd;
        padding: 20px;
        border-radius: 16px;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
        width: 100%;
    }
    .marking-word {
        background: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: pointer;
        border-radius: 4px;
        padding: 0 4px;
        transition: background 0.1s;
    }
    .marking-word:hover { background: rgba(88, 204, 2, 0.1); }
    
    .log-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .log-entry {
        background: #fff;
        border: 1px solid #e5e5e5;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 800;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        font-weight: bold;
    }
    .marking-footer {
        padding: 16px;
        border-top: 2px solid #e5e5e5;
        display: flex;
        gap: 10px;
    }
</style>
