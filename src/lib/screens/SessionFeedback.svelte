<script>
    import { appState, XP } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    // Sesi setoran yang baru selesai. Di mockup datanya statis; yang penting
    // sessionId-nya stabil supaya XP tidak terbayar dua kali saat layar dibuka ulang.
    const session = { id: 'setoran-almulk-12-16', surah: 'Al-Mulk', range: '12-16', grade: 'mumtaz' };

    // Sudah dibayar? Berarti layar ini pernah diselesaikan sebelumnya.
    const alreadyClaimed = $derived(appState.user.setoranIds.includes(session.id));
    const gradeBonus = $derived(session.grade === 'mumtaz' ? XP.mumtaz : 0);

    function submit() {
        if (rating === 0) return;
        appState.recordSetoran(session);
        appState.go('learn');
    }

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

<div class="screen no-scrollbar" style="background: #007A70;">
    <div class="scroll-content no-scrollbar" style="padding: 0 0 20px;">
        <div class="feedback-header">
            <div class="success-icon">✨</div>
            <h1 style="font-size: 26px; font-weight: 900; color: #fff; margin: 16px 0 4px;">{i18n.t('feedback.title')}</h1>
            <p style="font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.8);">{session.surah}: {session.range}</p>
        </div>

        <div style="padding: 0 20px;">
            <!-- Musyrif Info -->
            <div class="musyrif-card">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Malik" alt="Ustadz" class="avatar" />
                <div style="font-size: 18px; font-weight: 900; color: #3c3c3c;">Ustadz Malik</div>
                <div style="font-size: 11px; font-weight: 800; color: #ff9600; text-transform: uppercase;">{i18n.t('musyrif.partner_tier')}</div>
            </div>

            <!-- Nilai musyrif + XP yang didapat. Besarannya dari XP.md, bukan angka
                 yang ditulis ulang di sini. -->
            <div class="grade-card" class:mumtaz={session.grade === 'mumtaz'}>
                <div class="grade-top">
                    <span class="grade-emoji">{session.grade === 'mumtaz' ? '⭐' : '✅'}</span>
                    <div style="flex:1; min-width:0;">
                        <div class="grade-label">{i18n.t('feedback.grade')}</div>
                        <div class="grade-value">{i18n.t(`feedback.grade_${session.grade}`)}</div>
                    </div>
                </div>
                <div class="xp-lines">
                    <div class="xp-line">
                        <span>{i18n.t('lb.src_setoran')}</span>
                        <strong>+{XP.setoran} XP</strong>
                    </div>
                    {#if gradeBonus > 0}
                        <div class="xp-line bonus">
                            <span>{i18n.t('lb.src_mumtaz')}</span>
                            <strong>+{gradeBonus} XP</strong>
                        </div>
                    {/if}
                    <div class="xp-line halaqah">
                        <span>{i18n.t('lb.src_halaqah')}</span>
                        <strong>+{XP.halaqahPerSetoran} XP</strong>
                    </div>
                </div>
                {#if alreadyClaimed}
                    <div class="grade-claimed">{i18n.t('feedback.xp_already_claimed')}</div>
                {/if}
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
    </div>

    <!-- Bottom Action -->
    <div class="bottom-action">
        <button 
            class="btn-duo btn-green" 
            class:btn-disabled={rating === 0}
            disabled={rating === 0}
            onclick={submit}
        >
            {i18n.t('feedback.submit')}
        </button>
    </div>
</div>

<style>
    .feedback-header {
        text-align: center;
        padding: 50px 20px 90px;
        background: linear-gradient(135deg, var(--duo-green), var(--duo-green-dark));
        position: relative;
    }
    .success-icon {
        font-size: 64px;
        line-height: 1;
        animation: bounce 1.5s infinite ease-in-out alternate;
        text-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    @keyframes bounce {
        from { transform: translateY(0) scale(1); }
        to { transform: translateY(-10px) scale(1.05); }
    }

    .musyrif-card {
        background: #fff;
        border-radius: 24px;
        padding: 0 20px 24px;
        text-align: center;
        margin-top: -30px;
        box-shadow: 0 16px 32px rgba(0,0,0,0.08);
        margin-bottom: 32px;
        position: relative;
        z-index: 10;
        border: 1px solid rgba(255,255,255,0.5);
    }
    .avatar {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        background: #f0f0f0;
        border: 4px solid #fff;
        margin-top: -43px;
        margin-bottom: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        object-fit: cover;
    }

    .grade-card {
        background: #fff; border: 2px solid #e5e5e5; border-bottom-width: 4px;
        border-radius: 20px; padding: 16px; margin-bottom: 28px;
    }
    .grade-card.mumtaz { background: #fffbeb; border-color: #fde68a; }
    .grade-top { display: flex; align-items: center; gap: 12px; }
    .grade-emoji { font-size: 28px; }
    .grade-label {
        font-size: 10px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .grade-value { font-size: 18px; font-weight: 900; color: #b45309; }
    .xp-lines { margin-top: 12px; border-top: 1.5px solid rgba(0,0,0,0.06); padding-top: 8px; }
    .xp-line {
        display: flex; justify-content: space-between; align-items: center;
        padding: 5px 0; font-size: 12px; font-weight: 700; color: #64748b;
    }
    .xp-line strong { color: #00978A; font-weight: 900; }
    .xp-line.bonus strong { color: #f59e0b; }
    .xp-line.halaqah strong { color: #7c3aed; }
    .grade-claimed {
        margin-top: 8px; font-size: 11px; font-weight: 800; color: #94a3b8; text-align: center;
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
        gap: 12px;
    }
    .star-btn {
        background: none;
        border: none;
        font-size: 44px;
        color: #e5e5e5;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        -webkit-tap-highlight-color: transparent;
    }
    .star-btn.active {
        color: #ffc800;
        transform: scale(1.15);
        text-shadow: 0 4px 12px rgba(255, 200, 0, 0.4);
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
        background: #DBF0EE;
        border-color: var(--duo-green);
        color: var(--duo-green);
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
