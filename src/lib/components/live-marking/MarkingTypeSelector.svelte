<script>
    import { i18n } from '$lib/i18n.svelte.js';
    
    let { selectedWord, onClose, onMark } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={onClose}>
    <div class="modal-content" onclick={e => e.stopPropagation()}>
        <div style="font-size: 18px; font-weight: 900; color: #3c3c3c; margin-bottom: 20px; text-align: center;">
            {selectedWord}
        </div>
        <div class="type-grid">
            <button class="type-btn forget" onclick={() => onMark('forget')}>
                <div class="type-icon">❓</div>
                <div style="flex: 1">{i18n.t('marking.type_forget')}</div>
            </button>
            <button class="type-btn tajwid" onclick={() => onMark('tajwid')}>
                <div class="type-icon">📏</div>
                <div style="flex: 1">{i18n.t('marking.type_tajwid')}</div>
            </button>
            <button class="type-btn makhraj" onclick={() => onMark('makhraj')}>
                <div class="type-icon">🗣️</div>
                <div style="flex: 1">{i18n.t('marking.type_makhraj')}</div>
            </button>
        </div>
    </div>
</div>

<style>
    .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: flex; align-items: flex-end; justify-content: center; z-index: 100; }
    .modal-content { background: #fff; width: 100%; border-radius: 32px 32px 0 0; padding: 32px 24px; box-shadow: 0 -10px 40px rgba(0,0,0,0.2); animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .type-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .type-btn { display: flex; align-items: center; gap: 20px; padding: 18px 24px; border: 2px solid #e5e5e5; border-bottom-width: 5px; border-radius: 20px; background: #fff; font-family: inherit; font-size: 16px; font-weight: 900; color: #3c3c3c; cursor: pointer; transition: all 0.1s; }
    .type-btn:active { transform: translateY(2px); border-bottom-width: 2px; }
    .type-icon { font-size: 24px; }
    .type-btn.forget { border-color: #ff4b4b; color: #ff4b4b; }
    .type-btn.tajwid { border-color: #ff9600; color: #ff9600; }
    .type-btn.makhraj { border-color: #1cb0f6; color: #1cb0f6; }
</style>
