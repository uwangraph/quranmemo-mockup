<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    let halaqahName = $state('');
    let halaqahDesc = $state('');
    let halaqahCap = $state(20);
    
    function publishHalaqah() {
        if (!halaqahName.trim()) {
            alert(i18n.t('halaqah.name_required'));
            return;
        }
        const cap = Math.max(5, Math.min(20, parseInt(halaqahCap) || 20));
        
        // Here we would save to backend/appState
        alert(i18n.t('halaqah.created', {name: halaqahName, capacity: cap}));
        appState.go('league'); // Navigate back to a relevant page
    }
    
    function cancel() {
        appState.go('league');
    }
</script>

<div class="screen">
    <!-- Top Bar -->
    <div class="topbar" style="background: #fff; padding: 14px 16px 10px; border-bottom: 2px solid #f0f0f0;">
        <button class="back-btn" onclick={cancel}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <span style="font-size: 16px; font-weight: 900; color: #3c3c3c; flex: 1; text-align: center;">
            {i18n.t('halaqah.create_title')}
        </span>
        <div style="width: 32px;"></div> <!-- Spacer -->
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 20px;">
        
        <div class="info-alert">
            <i class="ti ti-book"></i> {i18n.t('halaqah.info')}
        </div>

        <div class="step-content" style="margin-top: 24px;">
            <div class="form-group">
                <label>{i18n.t('halaqah.name')}</label>
                <input type="text" class="input-field" placeholder={i18n.t('halaqah.name_placeholder')} bind:value={halaqahName} />
            </div>
            
            <div class="form-group">
                <label>{i18n.t('halaqah.description')}</label>
                <textarea class="input-field" rows="3" placeholder={i18n.t('halaqah.description_placeholder')} bind:value={halaqahDesc}></textarea>
            </div>
            
            <div class="form-group">
                <label>{i18n.t('halaqah.capacity')}</label>
                <div class="cap-wrapper">
                    <input type="range" min="5" max="20" bind:value={halaqahCap} class="range-slider" />
                    <div class="cap-value">{halaqahCap} {i18n.t('halaqah.people')}</div>
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
                    {i18n.t('halaqah.capacity_hint')}
                </div>
            </div>
        </div>
        
    </div>

    <!-- Bottom Action Bar -->
    <div class="bottom-action-bar">
        <button class="btn-primary" onclick={publishHalaqah}>{i18n.t('halaqah.create')} <i class="ti ti-check"></i></button>
    </div>
</div>

<style>
    .screen {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #f8fafc;
        font-family: 'Nunito', sans-serif;
    }
    
    .back-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #afafaf;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
    }
    
    .scroll-content {
        flex: 1;
        overflow-y: auto;
    }
    
    .info-alert {
        padding: 14px 16px;
        background: #fef2f2;
        border: 2px solid #fecaca;
        color: #b91c1c;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        gap: 8px;
        align-items: flex-start;
        line-height: 1.4;
    }
    .info-alert i { font-size: 18px; color: #ef4444; }
    
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        display: block;
        font-size: 13px;
        font-weight: 800;
        color: #3c3c3c;
        margin-bottom: 8px;
    }
    
    .input-field {
        width: 100%;
        padding: 14px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-family: 'Nunito', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #333;
        background: #fff;
        box-sizing: border-box;
        transition: border-color 0.2s;
    }
    .input-field:focus {
        outline: none;
        border-color: #00978A;
    }

    .cap-wrapper {
        display: flex;
        align-items: center;
        gap: 16px;
        background: #fff;
        padding: 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
    }
    
    .range-slider {
        flex: 1;
        accent-color: #00978A;
    }
    
    .cap-value {
        font-size: 14px;
        font-weight: 900;
        color: #00978A;
        background: #e6faf8;
        padding: 6px 12px;
        border-radius: 8px;
        white-space: nowrap;
    }
    
    .bottom-action-bar {
        padding: 16px 20px;
        background: #fff;
        border-top: 2px solid #f0f0f0;
    }
    
    .btn-primary {
        width: 100%;
        padding: 16px;
        background: #00978A;
        color: #fff;
        border: none;
        border-bottom: 4px solid #007a6f;
        border-radius: 16px;
        font-family: inherit;
        font-size: 15px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.1s;
    }
    .btn-primary:active {
        transform: translateY(3px);
        border-bottom-width: 1px;
    }
</style>
