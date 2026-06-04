<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    let selectedSurah = $state("Al-Insyirah");
    let selectedAyah = $state("");
    let selectedGender = $state("all");
    let showDropdown = $state(false);
    let hasSearched = $state(false);
    let activeTab = $state("toko");

    let showCustomAlert = $state(false);
    let alertMessage = $state("");
    let alertType = $state("alert");
    let onConfirm = $state(() => {});

    function customAlert(msg) {
        alertMessage = msg;
        alertType = "alert";
        showCustomAlert = true;
    }

    function customConfirm(msg, callback) {
        alertMessage = msg;
        alertType = "confirm";
        onConfirm = callback;
        showCustomAlert = true;
    }

    const juz30Surahs = [
        "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", 
        "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", 
        "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Lail", 
        "Ad-Duha", "Al-Insyirah", "At-Tin", "Al-'Alaq", "Al-Qadr", 
        "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", 
        "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraish", "Al-Ma'un", 
        "Al-Kauthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", 
        "Al-Falaq", "An-Nas"
    ];
    
    const juz29Surahs = [
        "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", 
        "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", 
        "Al-Insan", "Al-Mursalat"
    ];
    
    const proSurahs = [
        "Juz 1 (Al-Baqarah)", "Juz 2 (Al-Baqarah)", "Juz 3 (Ali 'Imran)", 
        "Juz 4 (Ali 'Imran - An-Nisa)", "Juz 5 (An-Nisa)"
    ];

    const availableSurahs = $derived.by(() => {
        if (appState.user.learningPath === 'mid') return juz29Surahs;
        if (appState.user.learningPath === 'pro') return proSurahs;
        return juz30Surahs;
    });

    // Ensure selectedSurah matches the available list when initialized or changed
    $effect(() => {
        if (!availableSurahs.includes(selectedSurah)) {
            selectedSurah = availableSurahs[0];
        }
    });

    const defaultSchedule = $derived([
        i18n.t('market.day_tomorrow') + ", 10:00", 
        i18n.t('market.day_after_tomorrow') + ", 14:00", 
        i18n.t('market.day_after_tomorrow') + ", 19:30"
    ]);
    
    const allMusyrifs = $derived([
        { name: "Ust. Ahmad Fauzi", gender: "ustadz", rating: 4.9, status: "online", tier: "bersanad", icon: "👳", schedule: [i18n.t('market.day_today') + ", 20:00", ...defaultSchedule] },
        { name: "Ust. Ridwan Hakim", gender: "ustadz", rating: 4.8, status: "online", tier: "reguler", icon: "👨‍🏫", schedule: defaultSchedule },
        { name: "Ustadzah Siti Aminah", gender: "ustadzah", rating: 5.0, status: "offline", tier: "bersanad", icon: "🧕", schedule: [i18n.t('market.day_tomorrow') + ", 09:00", i18n.t('market.day_tomorrow') + ", 16:00", i18n.t('market.day_after_tomorrow') + ", 10:00"] },
        { name: "Ust. Budi Santoso", gender: "ustadz", rating: 4.7, status: "online", tier: "reguler", icon: "🧔", schedule: defaultSchedule },
        { name: "Ustadzah Aisyah", gender: "ustadzah", rating: 4.9, status: "online", tier: "reguler", icon: "🧕", schedule: [i18n.t('market.day_today') + ", 19:00", ...defaultSchedule] },
        { name: "Ust. Hasanuddin", gender: "ustadz", rating: 5.0, status: "online", tier: "bersanad", icon: "👳", schedule: defaultSchedule },
        { name: "Ustadzah Fatimah", gender: "ustadzah", rating: 4.6, status: "offline", tier: "reguler", icon: "🧕", schedule: defaultSchedule },
        { name: "Ust. Zulkifli", gender: "ustadz", rating: 4.8, status: "online", tier: "bersanad", icon: "👨‍🏫", schedule: defaultSchedule },
        { name: "Ustadzah Khadijah", gender: "ustadzah", rating: 4.9, status: "online", tier: "bersanad", icon: "🧕", schedule: defaultSchedule }
    ]);

    const musyrifs = $derived(
        selectedGender === 'all' 
            ? allMusyrifs 
            : allMusyrifs.filter(m => m.gender === selectedGender)
    );

    const displayMusyrifs = $derived(
        activeTab === 'instant'
            ? musyrifs.filter(m => m.status === 'online')
            : musyrifs
    );

    function bookMusyrif(m, time) {
        if (!selectedAyah) {
            customAlert(i18n.t('market.alert_select_target'));
            return;
        }
        
        if (m.status === 'offline' && !time) {
            customAlert(i18n.t('status.offline'));
            return;
        }
        
        const cost = 15;
        if (appState.user.gems >= cost) {
            const timeText = time ? ` (${time})` : ` (${i18n.t('market.day_today')} - ${i18n.t('market.start_now')})`;
            customConfirm(i18n.t('market.confirm_booking', { surah: selectedSurah, ayah: selectedAyah, name: m.name, time: timeText, cost }), () => {
                appState.user.gems -= cost;
                appState.saveUser();
                appState.go('livemarking');
            });
        } else {
            customAlert(i18n.t('market.alert_not_enough_gems', { cost, have: appState.user.gems }));
        }
    }

    function quickFind() {
        if (!selectedAyah) {
            customAlert(i18n.t('market.alert_select_target'));
            return;
        }
        hasSearched = true;
    }
</script>

<div class="screen">
    <div class="topbar wallet-header">
        <div class="wallet-pills">

            <div class="pill xp-pill" style="color: #ff9600; border-color: #fff7e6; background: #fffbf2;">
                <i class="ti ti-star-filled"></i> <span>{appState.user.xp}</span>
            </div>
            <div class="pill gem-pill" style="color: #00978A; border-color: #e0f2f1; background: #e0f2f1;">
                <i class="ti ti-diamond-filled"></i> <span>{appState.user.gems}</span>
            </div>
        </div>
        <button class="topup-btn">
            <i class="ti ti-plus"></i>
        </button>
    </div>

    <div class="market-tabs">
        <button class="m-tab" class:active={activeTab === 'instant'} onclick={() => {activeTab = 'instant'; hasSearched = false;}}>{i18n.t('market.tab_instant')}</button>
        <button class="m-tab" class:active={activeTab === 'booking'} onclick={() => {activeTab = 'booking'; hasSearched = false;}}>{i18n.t('market.tab_booking')}</button>
        <button class="m-tab" class:active={activeTab === 'toko'} onclick={() => {activeTab = 'toko'; hasSearched = false;}}>{i18n.t('market.tab_shop')}</button>
    </div>

    <div class="scroll-content" style="padding: 0 16px;">
        {#if activeTab === 'instant' || activeTab === 'booking'}
        <div class="hero-card">
            <div style="flex:1">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size:18px; font-weight:900; color:#fff;">{activeTab === 'instant' ? i18n.t('market.instant') : i18n.t('market.book_schedule')}</div>
                        <div style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.8); margin-top:4px;">{activeTab === 'instant' ? i18n.t('market.instant_d') : i18n.t('market.book_schedule_d')}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800;">
                        {i18n.t('market.price_label')} 15 <i class="ti ti-diamond-filled" style="color:#fff;"></i>
                    </div>
                </div>
                
                <div class="target-selector">
                    <div class="target-field">
                        <label>Surah</label>
                        <div class="custom-select-wrapper" style="position: relative;">
                            <div class="custom-select-box" onclick={() => showDropdown = !showDropdown}>
                                <span>{selectedSurah}</span>
                                <i class="ti ti-chevron-down"></i>
                            </div>
                            {#if showDropdown}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div class="dropdown-menu-overlay" onclick={() => showDropdown = false}></div>
                                <div class="dropdown-menu">
                                    {#each availableSurahs as surah}
                                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                                        <div class="dropdown-item" class:selected={selectedSurah === surah} onclick={() => {selectedSurah = surah; showDropdown = false;}}>
                                            {surah}
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="target-field">
                        <label>{i18n.t('learn.verse')}</label>
                        <input type="text" placeholder="Cth: 1-8" bind:value={selectedAyah} />
                    </div>
                </div>
            </div>
            <button class="btn-duo find-btn" onclick={quickFind}>
                {i18n.t('market.find')}
            </button>
        </div>

        {#if hasSearched}
        <div class="section-header">
            <span class="section-label" style="padding:0">{i18n.t('market.available')}</span>
            <div class="gender-filter">
                <button class:active={selectedGender === 'all'} onclick={() => selectedGender = 'all'}>{i18n.t('lb.tab_global_user')}</button>
                <button class:active={selectedGender === 'ustadz'} onclick={() => selectedGender = 'ustadz'}>Ustadz</button>
                <button class:active={selectedGender === 'ustadzah'} onclick={() => selectedGender = 'ustadzah'}>Ustadzah</button>
            </div>
        </div>

        <div class="musyrif-list-container">
            {#each displayMusyrifs as m}
                <div class="musyrif-card" class:offline={m.status === 'offline'}>
                    <div style="display:flex; align-items: center; gap: 16px; width: 100%;">
                        <div class="m-avatar">{m.icon}</div>
                        <div style="flex:1">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-size:14px; font-weight:800; color:#3c3c3c;">{m.name}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:10px; margin-top:4px;">
                                <div style="font-size:12px; font-weight:800; color:#ff9600; display:flex; align-items:center; gap:2px;">
                                    <i class="ti ti-star-filled"></i> {m.rating}
                                </div>
                                <div style="font-size:12px; font-weight:700; color:#afafaf;">{i18n.t(`status.${m.status}`)}</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start; height: 46px;">
                            <span class="tier-badge {m.tier}">{i18n.t(`tier.${m.tier}`)}</span>
                        </div>
                    </div>
                    
                    <div class="schedule-box">
                        <div style="font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 8px;">{activeTab === 'instant' ? 'AKSI:' : 'JADWAL TERSEDIA:'}</div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            {#if activeTab === 'instant'}
                                <button class="schedule-chip instant" style="width: 100%; text-align: center; padding: 10px;" onclick={() => bookMusyrif(m, null)}>{i18n.t('market.start_now')}</button>
                            {:else}
                                {#each m.schedule as time}
                                    <button class="schedule-chip" onclick={() => bookMusyrif(m, time)}>{time}</button>
                                {/each}
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        {/if}
        {/if}
        
        {#if activeTab === 'toko'}
            <div class="hero-card" style="background: linear-gradient(135deg, #00978A, #007a6f); margin-top: 16px;">
                <div style="flex:1">
                    <div style="font-size:18px; font-weight:900; color:#fff;">{i18n.t('market.shop_title')}</div>
                    <div style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.8); margin-top:4px;">{i18n.t('market.shop_desc')}</div>
                </div>
                <i class="ti ti-shopping-cart" style="font-size: 40px; color: rgba(255,255,255,0.3)"></i>
            </div>
            
            <div class="section-header">
                <span class="section-label" style="padding:0">{i18n.t('learn.free_points_target')}</span>
            </div>
            
            <div class="musyrif-card" style="flex-direction: row; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div class="m-avatar" style="background: #e0f2f1; border-color: #b2dfdb; color: #00978A;"><i class="ti ti-video"></i></div>
                    <div>
                        <div style="font-size:16px; font-weight:900; color:#3c3c3c;">{i18n.t('market.ads_title')}</div>
                        <div style="font-size:13px; font-weight:700; color:#afafaf; margin-top:4px;">{i18n.t('market.ads_desc')}</div>
                    </div>
                </div>
                <button class="btn-duo" style="background: #fff; color: #1cb0f6; border-color: #e5e5e5;" onclick={() => {
                    customConfirm(i18n.t('market.ads_confirm'), () => {
                        appState.user.gems += 50;
                        appState.saveUser();
                        customAlert(i18n.t('market.ads_success'));
                    });
                }}>{i18n.t('market.ads_btn')}</button>
            </div>
            
            <div class="section-header" style="margin-top: 24px;">
                <span class="section-label" style="padding:0">Power-Ups</span>
            </div>
            
            <div class="musyrif-card" style="flex-direction: row; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div class="m-avatar" style="background: #fffbf2; border-color: #fff7e6; color: #ff9600;"><i class="ti ti-snowflake"></i></div>
                    <div>
                        <div style="font-size:16px; font-weight:900; color:#3c3c3c;">{i18n.t('market.freeze_title')}</div>
                        <div style="font-size:13px; font-weight:700; color:#afafaf; margin-top:4px;">{i18n.t('market.freeze_desc')}</div>
                        <div style="font-size:11px; font-weight:800; color:#1cb0f6; margin-top:4px;">{i18n.t('market.freeze_owned', { count: appState.user.streakFreezes || 0 })}</div>
                    </div>
                </div>
                <button class="btn-duo" style="background: #ff9600; color: #fff; border-color: #cc7800; font-size: 13px;" onclick={() => {
                    // Harga meningkat (fee 5, 10)
                    const cost = (appState.user.streakFreezes || 0) > 0 ? 10 : 5;
                    if (appState.user.gems >= cost) {
                        customConfirm(i18n.t('market.freeze_confirm', { cost }), () => {
                            appState.user.gems -= cost;
                            appState.user.streakFreezes = (appState.user.streakFreezes || 0) + 1;
                            appState.saveUser();
                            customAlert(i18n.t('market.freeze_success'));
                        });
                    } else {
                        customAlert(i18n.t('market.alert_not_enough_gems', { cost, have: appState.user.gems }));
                    }
                }}>{(appState.user.streakFreezes || 0) > 0 ? '10' : '5'} <i class="ti ti-diamond-filled"></i></button>
            </div>
        {/if}
    </div>

    <BottomNav active="murojaah" />
</div>

{#if showCustomAlert}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="custom-alert-overlay" onclick={() => showCustomAlert = false}>
        <div class="custom-alert-box" onclick={e => e.stopPropagation()}>
            <div class="alert-icon">
                {#if alertType === 'alert'}
                    <i class="ti ti-info-circle-filled"></i>
                {:else}
                    <i class="ti ti-help-hexagon-filled"></i>
                {/if}
            </div>
            <div class="alert-text">{alertMessage}</div>
            <div class="alert-actions">
                {#if alertType === 'confirm'}
                    <button class="alert-btn secondary" onclick={() => showCustomAlert = false}>{i18n.t('market.btn_cancel')}</button>
                    <button class="alert-btn primary" onclick={() => { onConfirm(); showCustomAlert = false; }}>{i18n.t('market.btn_confirm')}</button>
                {:else}
                    <button class="alert-btn primary" onclick={() => showCustomAlert = false}>{i18n.t('market.btn_understand')}</button>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .wallet-header {
        background: #fff;
        border-bottom: 2px solid var(--border-main);
        justify-content: space-between;
        padding: 12px 20px;
    }
    .wallet-pills {
        display: flex;
        gap: 8px;
    }
    .pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 100px;
        font-weight: 900;
        font-size: 14px;
        border: 2px solid var(--border-main);
    }
    .ticket-pill { color: var(--duo-blue); border-color: #e1f5fe; background: #f1faff; }
    .point-pill { color: #ff9600; border-color: #fff7e6; background: #fffbf2; }
    
    .topup-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid var(--border-main);
        background: #fff;
        color: var(--duo-blue);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
    }

    .market-tabs {
        display: flex;
        background: #fff;
        padding: 0 20px;
        border-bottom: 2px solid var(--border-main);
    }
    .m-tab {
        flex: 1;
        background: none;
        border: none;
        padding: 16px 0;
        font-size: 14px;
        font-weight: 800;
        color: #afafaf;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.2s;
    }
    .m-tab.active {
        color: #1cb0f6;
        border-bottom: 3px solid #1cb0f6;
    }

    .hero-card {
        background: linear-gradient(135deg, #1cb0f6, #0898dc);
        padding: 24px;
        border-radius: 24px;
        margin-top: 16px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: 0 10px 20px rgba(28, 176, 246, 0.2);
        color: #fff;
    }
    .target-selector {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        background: rgba(255, 255, 255, 0.15);
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .target-field {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .target-field label {
        font-size: 10px;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.9);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .custom-select-box,
    .target-field input {
        background: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        color: #3c3c3c;
        outline: none;
        font-family: inherit;
        box-sizing: border-box;
        width: 100%;
    }
    .custom-select-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }
    .dropdown-menu-overlay {
        position: fixed;
        inset: 0;
        z-index: 40;
    }
    .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        max-height: 200px;
        overflow-y: auto;
        z-index: 50;
        display: flex;
        flex-direction: column;
        padding: 8px 0;
    }
    .dropdown-item {
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 700;
        color: #3c3c3c;
        cursor: pointer;
    }
    .dropdown-item:active {
        background: #f1f5f9;
    }
    .dropdown-item.selected {
        background: #e0f5f3;
        color: #00978A;
    }
    
    .find-btn {
        background: #fff; 
        color: #1cb0f6; 
        font-size: 14px; 
        padding: 14px 20px;
        width: 100%;
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .gender-filter {
        display: flex;
        background: #f1f5f9;
        border-radius: 12px;
        padding: 4px;
        gap: 4px;
    }
    .gender-filter button {
        background: none;
        border: none;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .gender-filter button.active {
        background: #fff;
        color: #1cb0f6;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .musyrif-card {
        background: #fff;
        border: 2px solid var(--border-main);
        border-bottom-width: 4px;
        border-radius: 20px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: transform 0.1s;
    }
    .musyrif-card:active { transform: translateY(2px); border-bottom-width: 2px; }
    .musyrif-card.offline { opacity: 0.6; grayscale: 0.5; }
    .m-avatar {
        width: 56px;
        height: 56px;
        background: #f7f7f7;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        border: 2px solid var(--border-main);
    }
    .tier-badge {
        font-size: 9px;
        font-weight: 900;
        padding: 2px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .tier-badge.bersanad { background: #fff7e6; color: #cc7000; border: 1px solid #ffe4b3; }
    .tier-badge.reguler { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

    /* Desktop/Tablet Responsive Styles */
    .musyrif-list-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }

    :global(.desktop-browser) .musyrif-list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 20px;
    }
    :global(.tablet) .musyrif-list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
    }

    :global(.desktop-browser) .hero-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
        padding: 40px;
    }
    :global(.tablet) .hero-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 32px;
    }

    :global(.desktop-browser) .hero-card .find-btn,
    :global(.tablet) .hero-card .find-btn {
        width: auto;
        flex-shrink: 0;
        align-self: flex-end;
    }

    /* Custom Alert Styles */
    .custom-alert-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.2s ease;
    }
    .custom-alert-box {
        background: #fff;
        width: 100%;
        max-width: 320px;
        border-radius: 24px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        animation: slideUpScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .alert-icon {
        font-size: 48px;
        color: #1cb0f6;
        margin-bottom: 16px;
    }
    .alert-text {
        font-size: 15px;
        font-weight: 700;
        color: #3c3c3c;
        line-height: 1.5;
        margin-bottom: 24px;
    }
    .alert-actions {
        display: flex;
        gap: 12px;
    }
    .alert-btn {
        flex: 1;
        padding: 12px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        border: none;
        transition: transform 0.1s;
    }
    .alert-btn:active {
        transform: translateY(2px);
    }
    .alert-btn.primary {
        background: #1cb0f6;
        color: #fff;
        box-shadow: 0 4px 0 #1899d6;
    }
    .alert-btn.primary:active {
        box-shadow: 0 2px 0 #1899d6;
    }
    .alert-btn.secondary {
        background: #f1f5f9;
        color: #64748b;
        box-shadow: 0 4px 0 #e2e8f0;
    }
    .alert-btn.secondary:active {
        box-shadow: 0 2px 0 #e2e8f0;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUpScale {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Schedule Chips */
    .schedule-box {
        background: #f8fafc;
        border-radius: 12px;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
    }
    .schedule-chip {
        background: #fff;
        border: 2px solid #e2e8f0;
        border-bottom-width: 3px;
        border-radius: 100px;
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 800;
        color: #475569;
        cursor: pointer;
        transition: transform 0.1s;
    }
    .schedule-chip:active {
        transform: translateY(1px);
        border-bottom-width: 2px;
        margin-top: 1px;
    }
    .schedule-chip.instant {
        background: #1cb0f6;
        color: #fff;
        border-color: #1899d6;
    }
</style>
