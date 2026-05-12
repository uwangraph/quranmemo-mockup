<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    let rating = $state(0);
    let selectedTags = $state([]);
    let tipAmount = $state(0);
    
    const tags = [
        { id: 'clear', label: 'feedback.tag_clear', icon: '🗣️' },
        { id: 'patient', label: 'feedback.tag_patient', icon: '🧘' },
        { id: 'detail', label: 'feedback.tag_detail', icon: '🔍' }
    ];
    
    const tipOptions = [10, 20, 50];
    
    function toggleTag(tagId) {
        if (selectedTags.includes(tagId)) {
            selectedTags = selectedTags.filter(t => t !== tagId);
        } else {
            selectedTags = [...selectedTags, tagId];
        }
    }
</script>

<div class="screen no-scrollbar" style="background: #fafafa;">
    <div class="feedback-header">
        <div class="success-icon">✨</div>
        <h1 style="font-size: 24px; font-weight: 900; color: #3c3c3c; margin: 16px 0 4px;">{i18n.t('feedback.title')}</h1>
        <p style="font-size: 14px; font-weight: 700; color: #afafaf;">Al-Mulk: 12-16</p>
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 20px;">
        <!-- Musyrif Info -->
        <div class="musyrif-card">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Malik" alt="Ustadz" class="avatar" />
            <div style="font-size: 16px; font-weight: 900; color: #3c3c3c;">Ustadz Malik</div>
            <div style="font-size: 11px; font-weight: 800; color: #ff9600; text-transform: uppercase;">Certified Musyrif</div>
        </div>

        <!-- Rating Section -->
        <div class="section">
            <div class="section-title">{i18n.t('feedback.rate')}</div>
            <div class="stars-container">
                {#each [1, 2, 3, 4, 5] as star}
                    <button 
                        class="star-btn" 
                        class:active={rating >= star}
                        onclick={() => rating = star}
                    >
                        <i class="ti ti-star-filled"></i>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Feedback Tags -->
        {#if rating > 0}
            <div class="section fade-in">
                <div class="section-title">{i18n.t('feedback.tags')}</div>
                <div class="tags-container">
                    {#each tags as tag}
                        <button 
                            class="tag-btn" 
                            class:selected={selectedTags.includes(tag.id)}
                            onclick={() => toggleTag(tag.id)}
                        >
                            <span>{tag.icon}</span> {i18n.t(tag.label)}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Tipping Section (Tip Halal) -->
            <div class="section fade-in tipping-section">
                <div class="section-title" style="color: #fff">{i18n.t('feedback.tip')}</div>
                <p style="font-size: 11px; color: rgba(255,255,255,0.8); text-align: center; margin-bottom: 16px;">
                    {i18n.t('feedback.tip_desc')}
                </p>
                <div class="tip-options">
                    {#each tipOptions as amount}
                        <button 
                            class="tip-btn" 
                            class:selected={tipAmount === amount}
                            onclick={() => tipAmount = amount}
                        >
                            <i class="ti ti-diamond"></i> {amount}
                        </button>
                    {/each}
                    <button class="tip-btn" class:selected={tipAmount === 'custom'} onclick={() => tipAmount = 'custom'}>
                        Custom
                    </button>
                </div>
                {#if tipAmount === 'custom'}
                    <input type="number" placeholder="0" class="custom-tip-input" />
                {/if}
            </div>
        {/if}
    </div>

    <!-- Bottom Action -->
    <div class="bottom-action">
        <button 
            class="btn-duo btn-green" 
            class:btn-disabled={rating === 0}
            disabled={rating === 0}
            onclick={() => appState.go('learn')}
        >
            {i18n.t('feedback.submit')}
        </button>
    </div>
</div>

<style>
    .feedback-header {
        text-align: center;
        padding: 40px 20px 20px;
        background: #fff;
        border-bottom: 2px solid #f0f0f0;
    }
    .success-icon {
        font-size: 64px;
        line-height: 1;
        animation: bounce 1s infinite alternate;
    }
    @keyframes bounce {
        from { transform: translateY(0); }
        to { transform: translateY(-10px); }
    }

    .musyrif-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 24px;
        padding: 20px;
        text-align: center;
        margin-top: -40px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        margin-bottom: 24px;
    }
    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #f0f0f0;
        border: 4px solid #fff;
        margin-top: -40px;
        margin-bottom: 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .section {
        margin-bottom: 24px;
    }
    .section-title {
        font-size: 14px;
        font-weight: 900;
        color: #3c3c3c;
        text-align: center;
        margin-bottom: 16px;
    }

    .stars-container {
        display: flex;
        justify-content: center;
        gap: 8px;
    }
    .star-btn {
        background: none;
        border: none;
        font-size: 40px;
        color: #e5e5e5;
        cursor: pointer;
        transition: all 0.2s;
    }
    .star-btn.active {
        color: #ffc800;
        transform: scale(1.1);
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
    .tag-btn {
        padding: 10px 16px;
        border-radius: 100px;
        border: 2px solid #e5e5e5;
        background: #fff;
        font-family: inherit;
        font-size: 13px;
        font-weight: 800;
        color: #afafaf;
        cursor: pointer;
        transition: all 0.2s;
        border-bottom-width: 4px;
    }
    .tag-btn.selected {
        background: #e6f9d4;
        border-color: #58cc02;
        color: #58cc02;
    }
    .tag-btn:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }

    .tipping-section {
        background: linear-gradient(135deg, #ce82ff, #a52adb);
        padding: 24px;
        border-radius: 24px;
        box-shadow: 0 8px 16px rgba(206, 130, 255, 0.3);
    }
    .tip-options {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 12px;
    }
    .tip-btn {
        flex: 1;
        padding: 12px;
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.4);
        border-radius: 16px;
        color: #fff;
        font-weight: 900;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.2s;
    }
    .tip-btn.selected {
        background: #fff;
        color: #a52adb;
        border-color: #fff;
        transform: scale(1.05);
    }
    .custom-tip-input {
        width: 100%;
        padding: 14px;
        border-radius: 16px;
        border: none;
        text-align: center;
        font-family: inherit;
        font-size: 16px;
        font-weight: 900;
        color: #3c3c3c;
    }

    .fade-in {
        animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .bottom-action {
        padding: 20px;
        background: #fff;
        border-top: 2px solid #f0f0f0;
    }
</style>
