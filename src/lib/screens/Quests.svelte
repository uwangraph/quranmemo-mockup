<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '$lib/components/BottomNav.svelte';

    let activeTab = $state('misi');
</script>

<div class="screen quests-screen">
    <!-- Mobile & Desktop Header -->
    <div class="top-header">
        <div class="wallet-pills">
            <div class="pill">
                <i class="ti ti-bolt-filled" style="color:#ff9600"></i> <span style="color: #3c3c3c;">{appState.user.energy}</span>
            </div>
            <div class="pill">
                <i class="ti ti-star-filled" style="color:#ff9600"></i> <span style="color: #3c3c3c;">{appState.user.xp}</span>
            </div>
            <div class="pill">
                <i class="ti ti-diamond-filled" style="color:#00978A"></i> <span style="color: #3c3c3c;">{appState.user.gems}</span>
            </div>
        </div>
    </div>

    <div class="scroll-content">
        <div class="quests-layout">
            <div class="main-column">
                <!-- Mobile only Tabs -->
                <div class="mobile-tabs">
                    <button class="m-tab {activeTab === 'misi' ? 'active' : ''}" onclick={() => activeTab = 'misi'}>MISI</button>
                    <button class="m-tab {activeTab === 'pencapaian' ? 'active' : ''}" onclick={() => activeTab = 'pencapaian'}>TANTANGAN</button>
                </div>

{#if activeTab === 'misi'}
                    <!-- Banner -->
                    <div class="quests-banner">
                        <div class="banner-body">
                            <div class="banner-text">
                                <h2>Ahlan wa Sahlan!</h2>
                                <p>Selesaikan misi harian untuk meraih target hafalanmu. Misi akan direset setiap hari.</p>
                            </div>
                            <div class="banner-icon">
                                <img src="https://cdn-icons-png.flaticon.com/512/3238/3238125.png" alt="Quran" />
                            </div>
                        </div>
                    </div>

                    <!-- Quests Section -->
                    <div class="quests-section">
                        <div class="section-header">
                            <h3>Misi Harian</h3>
                            <span class="timer"><i class="ti ti-clock"></i> 23 JAM</span>
                        </div>

                        <div class="quest-cards">
                            {#if appState.user.dailyQuests}
                                {#each appState.user.dailyQuests.quests as quest}
                                    <!-- Active Quest -->
                                    <div class="quest-card {quest.claimed ? 'claimed-card' : 'active-card'}">
                                        <div class="card-icon">
                                            <span class="check-icon">{quest.claimed ? '✓' : '○'}</span>
                                        </div>
                                        <div class="card-content">
                                            <div class="quest-title {quest.claimed ? 'completed-text' : ''}">{quest.text}</div>
                                            
                                            {#if quest.claimed}
                                                <div class="reward-pill">+{quest.xp} XP</div>
                                            {:else if quest.current >= quest.max}
                                                <button class="claim-quest-btn" onclick={() => appState.claimQuestReward(quest.id)}>Klaim</button>
                                            {:else}
                                                <div class="quest-progress-container">
                                                    <div class="progress-bar-bg">
                                                        <div class="progress-bar-fill" style="width: {Math.round(quest.current/quest.max * 100)}%;">
                                                            <span class="progress-text">{quest.current} / {quest.max}</span>
                                                        </div>
                                                    </div>
                                                    <div class="reward-tag">+{quest.xp} XP</div>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            {/if}

                            <!-- Locked Quest Placeholder -->
                            <div class="quest-card locked-card">
                                <div class="card-icon">
                                    <i class="ti ti-lock"></i>
                                </div>
                                <div class="card-content">
                                    <span class="locked-text">Misi hafalan esok hari</span>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else if activeTab === 'pencapaian'}
                    <!-- Mobile Pencapaian (Badges/Monthly Challenge) Tab Content -->
                    <div class="mobile-pencapaian-tab">
                        <div class="badge-cluster-large">
                            <div class="badge-circle-large green-badge"></div>
                            <div class="badge-circle-large yellow-badge">
                                <img src="https://cdn-icons-png.flaticon.com/512/3238/3238125.png" alt="Quran" style="width:50px; height:50px; object-fit:contain; filter:brightness(0) invert(1);" />
                            </div>
                            <div class="badge-circle-large blue-badge"></div>
                        </div>
                        <h2 class="pencapaian-title">Tantangan bulanan akan segera terbuka!</h2>
                        <p class="pencapaian-desc">Selesaikan tantangan setiap bulan untuk mendapatkan lencana eksklusif</p>
                    </div>
                {/if}
            </div>

            <!-- Right Column (Desktop Only) -->
            <div class="side-column">
                <div class="monthly-challenge-card">
                    <div class="challenge-header">
                        <div class="challenge-text">
                            <h3>Tantangan Tilawah Bulan Ini!</h3>
                            <p>Selesaikan setoran 1 juz penuh bulan ini untuk mendapatkan lencana Khotmil Quran.</p>
                        </div>
                        <div class="challenge-icon">
                            <div class="badge-cluster">
                                <div class="badge-circle green-badge"></div>
                                <div class="badge-circle yellow-badge">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3238/3238125.png" alt="Quran" style="width:36px; height:36px; object-fit:contain; filter:brightness(0) invert(1);" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="start-lesson-btn" onclick={() => appState.go('learn')}>MULAI HAFALAN</button>
                </div>
                
                <div class="footer-links">
                    <a href="#">TENTANG KAMI</a>
                    <a href="#">FITUR</a>
                    <a href="#">METODOLOGI</a>
                    <a href="#">PREMIUM</a>
                    <br>
                    <a href="#">KETENTUAN LAYANAN</a>
                    <a href="#">KEBIJAKAN PRIVASI</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation -->
    <BottomNav active="quests" />
</div>

<style>
    /* Light Theme Base - QuranMemo Style */
    .quests-screen {
        background: #f1f5f9;
        font-family: 'Nunito', sans-serif;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }

    /* Mobile & Desktop Header */
    .top-header {
        display: flex;
        padding: 16px 20px 0;
        justify-content: center;
        background: #f1f5f9;
        z-index: 10;
        position: sticky;
        top: 0;
    }
    :global(.desktop-browser) .top-header {
        padding: 24px 32px 0;
        justify-content: flex-end;
        position: static;
    }
    
    .wallet-pills {
        display: flex;
        gap: 12px;
    }
    :global(.desktop-browser) .wallet-pills {
        gap: 20px;
    }
    .pill {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 800;
        background: #fff;
        padding: 6px 14px;
        border: 2px solid #e5e5e5;
        border-radius: 100px;
    }

    .scroll-content {
        flex: 1;
        overflow-y: auto;
        padding: 0 16px 100px; /* Space for bottom nav */
    }
    :global(.desktop-browser) .scroll-content {
        padding: 32px;
    }

    /* Layout */
    .quests-layout {
        display: flex;
        gap: 40px;
        max-width: 1000px;
        margin: 0 auto;
    }
    .main-column {
        flex: 1;
        min-width: 0;
    }
    .side-column {
        display: none;
        width: 320px;
        flex-shrink: 0;
    }
    :global(.desktop-browser) .side-column {
        display: block;
    }

    /* Mobile Tabs */
    .mobile-tabs {
        display: flex;
        border-bottom: 2px solid #e5e5e5;
        margin-bottom: 24px;
        margin-top: 16px;
    }
    :global(.desktop-browser) .mobile-tabs {
        display: none;
    }
    .m-tab {
        flex: 1;
        background: none;
        border: none;
        color: #afafaf;
        font-weight: 900;
        font-size: 13px;
        padding: 16px 0;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
    }
    .m-tab.active {
        color: #00978A;
    }
    .m-tab.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: #00978A;
    }

    /* Banner - QuranMemo Branding */
    .quests-banner {
        background: #00978A; /* QuranMemo Primary Color */
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
        box-shadow: 0 4px 0 #007a6f;
    }
    .banner-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }
    .banner-text h2 {
        font-size: 24px;
        font-weight: 900;
        color: #fff;
        margin-bottom: 8px;
    }
    .banner-text p {
        font-size: 14px;
        font-weight: 700;
        color: #e0f2f1;
        line-height: 1.4;
    }
    .banner-icon img {
        width: 90px;
        height: 90px;
        object-fit: contain;
    }

    /* Quests Section */
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 16px;
        padding-bottom: 8px;
    }
    .section-header h3 {
        font-size: 22px;
        font-weight: 900;
        color: #3c3c3c;
    }
    .timer {
        font-size: 14px;
        font-weight: 800;
        color: #ff9600; /* QuranMemo Orange */
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
    }

    .quest-cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* Base Card Styling */
    .quest-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 16px;
        padding: 20px;
        display: flex;
        gap: 20px;
        align-items: center;
        box-shadow: 0 4px 0 #e5e5e5;
    }
    
    .card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .check-icon {
        width: 36px; height: 36px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: #f1f5f9; color: #afafaf; font-weight: 900;
        font-size: 18px;
    }
    
    .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .quest-title {
        font-size: 16px;
        font-weight: 900;
        color: #3c3c3c;
    }
    .quest-title.completed-text {
        text-decoration: line-through;
        color: #afafaf;
    }
    
    /* Progress Bar */
    .quest-progress-container {
        display: flex;
        align-items: center;
        gap: 16px;
        /* Tambahkan aksen hijau pada progress bar */
    }
    .progress-bar-bg {
        background: #e6f2e9;
    }
    .progress-bar-fill {
        background: #00978A;
    }
    .progress-bar-bg {
        flex: 1;
        height: 16px;
        background: #f1f5f9;
        border-radius: 8px;
        position: relative;
    }
    .progress-bar-fill {
        height: 100%;
        background: #ff9600; /* QuranMemo Orange */
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 15%; /* Ensure text fits */
    }
    .progress-text {
        font-size: 10px;
        font-weight: 900;
        color: #fff;
        position: absolute;
        width: 100%;
        text-align: center;
    }
    .reward-tag {
        font-size: 14px;
        font-weight: 900;
        color: #ff9600;
    }

    .reward-pill {
        align-self: flex-start;
        font-size: 13px; font-weight: 800; color: #10b981; 
        background: #ecfdf5; padding: 6px 12px; border-radius: 8px;
        border: 1px solid #a7f3d0;
    }

    .claim-quest-btn {
        align-self: flex-start;
        background: #1cb0f6; color: #fff; border: none; border-radius: 10px;
        padding: 8px 20px; font-size: 14px; font-weight: 900; cursor: pointer;
        box-shadow: 0 4px 0 #1899d6; text-transform: uppercase;
    }
    .claim-quest-btn:active {
        transform: translateY(4px); box-shadow: none;
    }

    /* Claimed Card */
    .claimed-card .check-icon {
        background: #ecfdf5; color: #10b981; border: 2px solid #6ee7b7;
    }

    /* Locked Card */
    .locked-card {
        background: #fafafa;
        border: 2px dashed #d1d5db;
        box-shadow: none;
    }
    .locked-card .card-icon {
        font-size: 28px;
        color: #afafaf;
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
    }
    .locked-text {
        font-size: 15px;
        font-weight: 800;
        color: #afafaf;
    }

    /* Monthly Challenge Card (Desktop) */
    .monthly-challenge-card {
        background: #fff;
        border: 2px solid #e5e5e5;
        border-radius: 16px;
        padding: 24px;
        margin-top: 100px;
        box-shadow: 0 4px 0 #e5e5e5;
    }
    .challenge-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
    }
    .challenge-text h3 {
        font-size: 16px;
        font-weight: 900;
        color: #3c3c3c;
        margin-bottom: 12px;
        line-height: 1.3;
    }
    .challenge-text p {
        font-size: 13px;
        font-weight: 700;
        color: #777;
        line-height: 1.4;
    }
    .badge-cluster {
        position: relative;
        width: 70px;
        height: 70px;
    }
    .badge-circle {
        position: absolute;
        border-radius: 50%;
    }
    .green-badge {
        width: 50px;
        height: 50px;
        background: #10b981;
        right: -10px;
        top: 0;
    }
    .yellow-badge {
        width: 64px;
        height: 64px;
        background: #ff9600; /* QuranMemo Orange */
        left: 0;
        bottom: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 0 #cc7800;
    }
    
    .start-lesson-btn {
        width: 100%;
        padding: 14px;
        background: transparent;
        border: 2px solid #e5e5e5;
        color: #00978A;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .start-lesson-btn:hover {
        background: #f0fdfa;
        border-color: #00978A;
    }

    .footer-links {
        margin-top: 32px;
        text-align: center;
        line-height: 2.5;
    }
    .footer-links a {
        color: #afafaf;
        font-size: 11px;
        font-weight: 800;
        text-decoration: none;
        margin: 0 10px;
    }
    .footer-links a:hover {
        color: #00978A;
    }

    /* Guide Section Styling */
    .guide-section {
        padding: 24px 16px;
        background: #fff;
        border: 2px solid #cdd9c6;
        border-radius: 16px;
        margin-top: 20px;
    }
    .guide-title {
        font-size: 20px;
        font-weight: 900;
        color: #006633;
        margin-bottom: 12px;
        text-align: center;
    }
    .guide-steps {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .guide-steps li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #3c3c3c;
    }
    .guide-steps i {
        color: #ff9600;
    }
    .guide-note {
        margin-top: 12px;
        font-size: 13px;
        color: #777;
        text-align: center;
    }

    /* Mobile Pencapaian Tab Content */
    .mobile-pencapaian-tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 60px 20px;
    }
    
    .badge-cluster-large {
        position: relative;
        width: 140px;
        height: 120px;
        margin-bottom: 32px;
    }
    
    .badge-circle-large {
        position: absolute;
        border-radius: 50%;
    }
    
    .badge-cluster-large .green-badge {
        width: 70px;
        height: 70px;
        background: #10b981;
        right: 0;
        top: 20px;
        z-index: 1;
    }
    
    .badge-cluster-large .blue-badge {
        width: 60px;
        height: 60px;
        background: #38bdf8;
        left: 0;
        top: 30px;
        z-index: 1;
    }
    
    .badge-cluster-large .yellow-badge {
        width: 100px;
        height: 100px;
        background: #ff9600;
        left: 20px;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 0 #cc7800;
    }
    
    .pencapaian-title {
        font-size: 20px;
        font-weight: 900;
        color: #3c3c3c;
        margin-bottom: 16px;
        line-height: 1.3;
    }
    
    .pencapaian-desc {
        font-size: 15px;
        font-weight: 700;
        color: #777;
        line-height: 1.5;
        max-width: 280px;
    }

    /* Hide desktop Side Column when Pencapaian tab is active on desktop (if ever visible) */
    :global(.desktop-browser) .mobile-tabs {
        display: none !important;
    }
</style>
