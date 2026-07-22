<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    let currentStep = $state(1);
    
    // Community Data
    let commName = $state('');
    let commDesc = $state('');
    let commMode = $state('open'); // 'open' | 'private'
    
    // Halaqahs Data
    let halaqahs = $state([
        { id: 1, name: 'Halaqah Ikhwan', capacity: 15 },
        { id: 2, name: 'Halaqah Akhawat', capacity: 15 }
    ]);
    
    let newHalaqahName = $state('');
    let newHalaqahCap = $state(10);
    
    function addHalaqah() {
        if (!newHalaqahName.trim()) return;
        const cap = Math.max(5, Math.min(20, parseInt(newHalaqahCap) || 10));
        halaqahs = [...halaqahs, { id: Date.now(), name: newHalaqahName, capacity: cap }];
        newHalaqahName = '';
        newHalaqahCap = 10;
    }
    
    function removeHalaqah(id) {
        halaqahs = halaqahs.filter(h => h.id !== id);
    }
    
    function nextStep() {
        if (currentStep === 1 && !commName.trim()) {
            alert(i18n.t('community.name_required'));
            return;
        }
        if (currentStep === 2 && halaqahs.length < 2) {
            alert(i18n.t('community.min_halaqah'));
            return;
        }
        if (currentStep < 3) currentStep++;
    }
    
    function prevStep() {
        if (currentStep > 1) currentStep--;
    }
    
    function publishCommunity() {
        // Here we would save to backend/appState
        alert(i18n.t('community.created', {name: commName, count: halaqahs.length}));
        appState.go('league'); // Navigate back to a relevant page
    }
    
    function cancel() {
        appState.go('league');
    }
</script>

<div class="screen">
    <!-- Top Bar -->
    <div class="topbar" style="background: #fff; padding: 14px 16px 10px; border-bottom: 2px solid #f0f0f0;">
        <button class="back-btn" onclick={currentStep === 1 ? cancel : prevStep}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <span style="font-size: 16px; font-weight: 900; color: #3c3c3c; flex: 1; text-align: center;">
            {i18n.t('community.create_title')}
        </span>
        <div style="width: 32px;"></div> <!-- Spacer for center alignment -->
    </div>

    <!-- Stepper Indicator -->
    <div class="stepper-container">
        <div class="step {currentStep >= 1 ? 'active' : ''}">1. {i18n.t('community.info')}</div>
        <div class="step-line {currentStep >= 2 ? 'active' : ''}"></div>
        <div class="step {currentStep >= 2 ? 'active' : ''}">2. {i18n.t('community.halaqah')}</div>
        <div class="step-line {currentStep >= 3 ? 'active' : ''}"></div>
        <div class="step {currentStep >= 3 ? 'active' : ''}">3. {i18n.t('community.review')}</div>
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 20px;">
        
        {#if currentStep === 1}
            <!-- STEP 1: Info Komunitas -->
            <div class="step-content">
                <div class="form-group">
                    <label>{i18n.t('community.name')}</label>
                    <input type="text" class="input-field" placeholder={i18n.t('community.name_placeholder')} bind:value={commName} />
                </div>
                
                <div class="form-group">
                    <label>{i18n.t('community.description')}</label>
                    <textarea class="input-field" rows="3" placeholder={i18n.t('community.description_placeholder')} bind:value={commDesc}></textarea>
                </div>
                
                <div class="form-group">
                    <label>{i18n.t('community.mode')}</label>
                    <div class="radio-group">
                        <label class="radio-card {commMode === 'open' ? 'selected' : ''}">
                            <input type="radio" name="mode" value="open" bind:group={commMode} class="hidden" />
                            <div class="icon">🌍</div>
                            <div class="details">
                                <div class="title">{i18n.t('community.open')}</div>
                                <div class="desc">{i18n.t('community.open_desc')}</div>
                            </div>
                            <div class="check"><i class="ti ti-check"></i></div>
                        </label>
                        
                        <label class="radio-card {commMode === 'private' ? 'selected' : ''}">
                            <input type="radio" name="mode" value="private" bind:group={commMode} class="hidden" />
                            <div class="icon">🔒</div>
                            <div class="details">
                                <div class="title">{i18n.t('community.private')}</div>
                                <div class="desc">{i18n.t('community.private_desc')}</div>
                            </div>
                            <div class="check"><i class="ti ti-check"></i></div>
                        </label>
                    </div>
                </div>
            </div>
            
        {:else if currentStep === 2}
            <!-- STEP 2: Buat Halaqah -->
            <div class="step-content">
                <div class="info-alert">
                    <i class="ti ti-info-circle"></i> {i18n.t('community.structure_hint')}
                </div>
                
                <!-- Add new halaqah form -->
                <div class="add-halaqah-box">
                    <div class="form-row">
                        <div class="form-group" style="flex: 1; margin-bottom: 0;">
                            <label style="font-size: 11px;">{i18n.t('halaqah.name')}</label>
                            <input type="text" class="input-field small" placeholder={i18n.t('community.halaqah_placeholder')} bind:value={newHalaqahName} />
                        </div>
                        <div class="form-group" style="width: 80px; margin-bottom: 0;">
                            <label style="font-size: 11px;">{i18n.t('halaqah.capacity')}</label>
                            <input type="number" class="input-field small" min="5" max="20" bind:value={newHalaqahCap} />
                        </div>
                    </div>
                    <button class="btn-outline" onclick={addHalaqah} style="margin-top: 12px; width: 100%;">
                        <i class="ti ti-plus"></i> {i18n.t('community.add_halaqah')}
                    </button>
                    <div style="font-size: 10px; color: #afafaf; text-align: center; margin-top: 6px;">{i18n.t('community.capacity_range')}</div>
                </div>
                
                <!-- List of halaqahs -->
                <div class="halaqah-list">
                    <h4>{i18n.t('community.halaqah_list')} ({halaqahs.length})</h4>
                    {#each halaqahs as h}
                        <div class="halaqah-item">
                            <div class="h-icon">📖</div>
                            <div class="h-details">
                                <div class="h-name">{h.name}</div>
                                <div class="h-cap">{i18n.t('community.max_capacity')}: {h.capacity} {i18n.t('halaqah.people')}</div>
                            </div>
                            <button class="h-del-btn" onclick={() => removeHalaqah(h.id)}><i class="ti ti-trash"></i></button>
                        </div>
                    {/each}
                    {#if halaqahs.length === 0}
                        <div class="empty-state">{i18n.t('community.empty_halaqah')}</div>
                    {/if}
                </div>
            </div>
            
        {:else if currentStep === 3}
            <!-- STEP 3: Review -->
            <div class="step-content">
                <div class="review-card">
                    <div class="r-badge">{commMode === 'open' ? '🌍 ' + i18n.t('community.open_upper') : '🔒 ' + i18n.t('community.private_upper')}</div>
                    <div class="r-title">{commName}</div>
                    <div class="r-desc">{commDesc || i18n.t('community.no_description')}</div>
                    
                    <div class="r-divider"></div>
                    
                    <div class="r-section-title">{i18n.t('community.structure')} ({halaqahs.length})</div>
                    <div class="r-halaqahs">
                        {#each halaqahs as h}
                            <div class="r-h-item">
                                <span class="r-h-name">{h.name}</span>
                                <span class="r-h-cap">{h.capacity} {i18n.t('halaqah.people')}</span>
                            </div>
                        {/each}
                    </div>
                </div>
                
                <div class="success-alert">
                    <i class="ti ti-check"></i> {i18n.t('community.ready')}
                </div>
            </div>
        {/if}
        
    </div>

    <!-- Bottom Action Bar -->
    <div class="bottom-action-bar">
        {#if currentStep < 3}
            <button class="btn-primary" onclick={nextStep}>{i18n.t('common.next')} <i class="ti ti-arrow-right"></i></button>
        {:else}
            <button class="btn-primary" onclick={publishCommunity}>{i18n.t('community.finish')}</button>
        {/if}
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
    
    .stepper-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 20px;
        background: #fff;
        border-bottom: 2px solid #f0f0f0;
    }
    
    .step {
        font-size: 11px;
        font-weight: 800;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 6px 12px;
        border-radius: 100px;
        transition: all 0.3s;
    }
    .step.active {
        background: #00978A;
        color: #fff;
    }
    
    .step-line {
        height: 2px;
        width: 30px;
        background: #e2e8f0;
        margin: 0 4px;
        transition: all 0.3s;
    }
    .step-line.active {
        background: #00978A;
    }
    
    .scroll-content {
        flex: 1;
        overflow-y: auto;
    }
    
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
    .input-field.small {
        padding: 10px 12px;
    }
    
    .radio-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .radio-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #fff;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .radio-card.selected {
        border-color: #00978A;
        background: #f0fdfa;
    }
    .hidden {
        display: none;
    }
    .radio-card .icon {
        font-size: 24px;
        width: 40px;
        height: 40px;
        background: #f1f5f9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .radio-card.selected .icon {
        background: #ccfbf1;
    }
    .radio-card .details {
        flex: 1;
    }
    .radio-card .title {
        font-size: 14px;
        font-weight: 800;
        color: #3c3c3c;
    }
    .radio-card .desc {
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        margin-top: 2px;
    }
    .radio-card .check {
        color: transparent;
        font-size: 20px;
        font-weight: bold;
    }
    .radio-card.selected .check {
        color: #00978A;
    }
    
    .info-alert {
        padding: 12px 16px;
        background: #eff6ff;
        border: 2px solid #bfdbfe;
        color: #1d4ed8;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        gap: 8px;
        align-items: flex-start;
    }
    .info-alert i { font-size: 16px; margin-top: 1px; }
    
    .add-halaqah-box {
        background: #fff;
        border: 2px dashed #cbd5e1;
        padding: 16px;
        border-radius: 16px;
        margin-bottom: 24px;
    }
    .form-row {
        display: flex;
        gap: 12px;
    }
    
    .btn-outline {
        padding: 10px;
        background: #fff;
        border: 2px solid #00978A;
        color: #00978A;
        border-radius: 12px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    .btn-outline:active {
        background: #f0fdfa;
    }
    
    .halaqah-list h4 {
        font-size: 14px;
        font-weight: 800;
        color: #3c3c3c;
        margin: 0 0 12px 0;
    }
    .halaqah-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #fff;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        margin-bottom: 8px;
    }
    .h-icon {
        font-size: 20px;
        width: 36px;
        height: 36px;
        background: #f1f5f9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .h-details {
        flex: 1;
    }
    .h-name {
        font-size: 14px;
        font-weight: 800;
        color: #3c3c3c;
    }
    .h-cap {
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        margin-top: 2px;
    }
    .h-del-btn {
        background: #fee2e2;
        color: #ef4444;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .empty-state {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #94a3b8;
        font-style: italic;
    }
    
    .review-card {
        background: #fff;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
        position: relative;
    }
    .r-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: #f1f5f9;
        color: #475569;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 900;
    }
    .r-title {
        font-size: 18px;
        font-weight: 900;
        color: #3c3c3c;
        margin-bottom: 8px;
        padding-right: 70px;
    }
    .r-desc {
        font-size: 13px;
        color: #64748b;
        line-height: 1.5;
    }
    .r-divider {
        height: 2px;
        background: #f1f5f9;
        margin: 16px 0;
    }
    .r-section-title {
        font-size: 12px;
        font-weight: 900;
        color: #94a3b8;
        text-transform: uppercase;
        margin-bottom: 12px;
    }
    .r-halaqahs {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .r-h-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 14px;
        background: #f8fafc;
        border-radius: 10px;
        font-size: 13px;
    }
    .r-h-name {
        font-weight: 800;
        color: #333;
    }
    .r-h-cap {
        font-weight: 700;
        color: #00978A;
    }
    
    .success-alert {
        padding: 14px 16px;
        background: #dcfce7;
        border: 2px solid #86efac;
        color: #166534;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 800;
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .success-alert i { font-size: 20px; }
    
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
