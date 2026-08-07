<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const user = $derived(appState.user);

    // ── Scheduled Booking: hitung jam tersisa ──
    const booking = $derived(user.scheduledBooking);
    const hoursLeft = $derived(() => {
        if (!booking?.time) return null;
        const diff = new Date(booking.time) - new Date();
        if (diff <= 0) return 0;
        return Math.floor(diff / 3600000);
    });

    // ── Levelling: data statis untuk mockup ──
    const levelInfo = $derived({
        juz: 30,
        surah: 'Ad-Dhuha',
        surahAr: 'الضحى',
        ayat: 11,
        ayatSelesai: 3,
        progress: (3 / 11) * 100
    });

    // ── Streak: visualisasi 7 hari ──
    // Label mengikuti tanggal asli tiap kolom, bukan posisi tetap Senin-Minggu.
    // Indeks 0 = Ahad, sesuai Date#getUTCDay().
    const DOW = ['profile.day_sun', 'profile.day_mon', 'profile.day_tue', 'profile.day_wed',
                 'profile.day_thu', 'profile.day_fri', 'profile.day_sat'];
    const week = $derived(appState.weekDays);

    // ── Badges ──
    const earnedBadges = $derived(user.badges?.filter(b => b.earned) ?? []);
    const lockedBadges = $derived(user.badges?.filter(b => !b.earned) ?? []);

    // ── Sertifikat ──
    const certs = $derived(user.certificates ?? []);
    
    // PROFILE.md: Streak, Badge, dan Certification berada di satu grup tab.
    let activeTab = $state('streak');

    // Hasil Placement Test (ONBOARDING.md) — kategori ditentukan musyrif.
    const placement = $derived(appState.user.placement);
    const placementStyle = {
        rbq: { icon: '🌱', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
        rtq: { icon: '📖', color: '#0369a1', bg: '#eff6ff', border: '#bfdbfe' },
        tahfidz: { icon: '🏅', color: '#0f766e', bg: '#f0fdfa', border: '#99f6e4' }
    };
</script>

<div class="screen">
    <!-- Topbar -->
    <div class="topbar">
        <span style="font-size: 16px; font-weight: 900; color: #3c3c3c; flex: 1; text-align: center;">
            {i18n.t('profile.title')}
        </span>
        <button
            style="background:none; border:none; color:#afafaf; cursor:pointer;"
            onclick={() => appState.go('reminders')}
            aria-label={i18n.t('reminder.title')}
        >
            <i class="ti ti-bell" style="font-size:20px;"></i>
        </button>
    </div>

    <div class="scroll-content no-scrollbar">

        <!-- ══════════════════════════════════
             HERO — Avatar & Nama
        ══════════════════════════════════ -->
        <div class="profile-hero">
            <div class="avatar-container">
                <div class="avatar-ring">
                    <div class="avatar-large">👤</div>
                </div>
                <button class="edit-avatar-btn"><i class="ti ti-camera"></i></button>
            </div>
            <div style="text-align: center; margin-top: 16px;">
                <div style="font-size: 22px; font-weight: 900; color: #1e293b;">{user.name}</div>
                <div class="user-joined">{i18n.t('profile.joined_year', {year: 2024})}</div>
            </div>
            <!-- Mini stats row -->
            <div class="hero-stats">
                <div class="hero-stat">
                    <span class="hs-val">🔥 {user.streak}</span>
                    <span class="hs-label">{i18n.t('profile.streak')}</span>
                </div>
                <div class="hs-divider"></div>
                <div class="hero-stat">
                    <span class="hs-val">⚡ {user.xp.toLocaleString()}</span>
                    <span class="hs-label">{i18n.t('profile.total_xp')}</span>
                </div>
                <div class="hs-divider"></div>
                <div class="hero-stat">
                    <span class="hs-val">🏅 {earnedBadges.length}</span>
                    <span class="hs-label">{i18n.t('profile.badges')}</span>
                </div>
                <div class="hs-divider"></div>
                <div class="hero-stat">
                    <span class="hs-val">📜 {certs.length}</span>
                    <span class="hs-label">{i18n.t('profile.certificates')}</span>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════
             1. SCHEDULED BOOKING
        ══════════════════════════════════ -->
        <div class="section-label">📅 {i18n.t('profile.booking')}</div>
        <div class="section-pad">
            {#if booking}
                <button class="booking-card" onclick={() => appState.go('musyrif')}>
                    <div class="booking-left">
                        <div class="booking-avatar">👳</div>
                    </div>
                    <div class="booking-info">
                        <div class="booking-musyrif">{booking.musyrifName}</div>
                        <div class="booking-detail">
                            <i class="ti ti-book"></i>
                            Juz {booking.juz} — Surah {booking.surah}
                        </div>
                        <div class="booking-time-row">
                            <i class="ti ti-clock"></i>
                            <span>
                                {new Date(booking.time).toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'short' })}
                            </span>
                            <span class="booking-badge">
                                {hoursLeft() !== null ? (hoursLeft() > 0 ? i18n.t('profile.hours_left', {hours: hoursLeft()}) : i18n.t('profile.now')) : ''}
                            </span>
                        </div>
                    </div>
                    <i class="ti ti-chevron-right booking-arrow"></i>
                </button>
            {:else}
                <div class="empty-booking">
                    <span style="font-size:32px;">📋</span>
                    <span>{i18n.t('profile.no_booking')}</span>
                    <button class="btn-create-booking">{i18n.t('profile.create_booking')}</button>
                </div>
            {/if}
        </div>

        <!-- ══════════════════════════════════
             2. HASIL PLACEMENT TEST
        ══════════════════════════════════ -->
        <div class="section-label">🎯 {i18n.t('placement.result_title')}</div>
        <div class="section-pad">
            {#if placement?.status === 'done' && placement.category}
                {@const ps = placementStyle[placement.category]}
                <div class="placement-card" style="background:{ps.bg}; border-color:{ps.border};">
                    <div class="placement-top">
                        <span class="placement-emoji">{ps.icon}</span>
                        <div style="flex:1; min-width:0;">
                            <div class="placement-cat" style="color:{ps.color}">{i18n.t(`placement.cat_${placement.category}`)}</div>
                            <div class="placement-mod">{i18n.t(`placement.module_${placement.category}`)}</div>
                        </div>
                    </div>
                    {#if placement.recommendation}
                        <div class="placement-rec">
                            <span class="placement-rec-label">{i18n.t('placement.rec_from_musyrif')}</span>
                            <span class="placement-rec-target">📖 {placement.recommendation.surah} · Juz {placement.recommendation.juz}</span>
                        </div>
                    {/if}
                    <div class="placement-by">
                        {i18n.t('placement.verified_by')}: <strong>{placement.musyrifName ?? i18n.t('placement.musyrif_team')}</strong>
                    </div>
                </div>
            {:else if placement?.status === 'pending'}
                <button class="placement-pending" onclick={() => appState.go('onboarding')}>
                    <span class="placement-emoji">⏳</span>
                    <div style="flex:1; text-align:left;">
                        <div class="placement-cat" style="color:#b45309;">{i18n.t('placement.pending_title')}</div>
                        <div class="placement-mod">{i18n.t('placement.sla_left', { hours: appState.placementSlaHoursLeft() ?? 24 })}</div>
                    </div>
                    <i class="ti ti-chevron-right" style="color:#d97706;"></i>
                </button>
            {:else}
                <button class="placement-empty" onclick={() => appState.go('onboarding')}>
                    <span style="font-size:32px;">🎤</span>
                    <span>{i18n.t('placement.not_taken')}</span>
                    <span class="placement-cta">{i18n.t('placement.start')}</span>
                </button>
            {/if}
        </div>

        <!-- ══════════════════════════════════
             3. LEVELLING
        ══════════════════════════════════ -->
        <div class="section-label">📖 {i18n.t('profile.memorization_level')}</div>
        <div class="section-pad">
            <div class="level-card">
                <div class="level-top">
                    <div class="level-badge-pill">Juz {levelInfo.juz}</div>
                    <div class="level-surah-name">
                        <span>{levelInfo.surah}</span>
                        <span class="level-surah-ar">{levelInfo.surahAr}</span>
                    </div>
                    <div class="level-xp-pill">⚡ {user.xp.toLocaleString()} XP</div>
                </div>

                <div class="level-stats-row">
                    <div class="level-stat-box" style="background:#eff6ff; border-color:#bfdbfe;">
                        <div class="lsb-icon">📖</div>
                        <div class="lsb-val">Juz {levelInfo.juz}</div>
                        <div class="lsb-label">{i18n.t('profile.juz')}</div>
                    </div>
                    <div class="level-stat-box" style="background:#f0fdf4; border-color:#bbf7d0;">
                        <div class="lsb-icon">🌿</div>
                        <div class="lsb-val">{levelInfo.surah}</div>
                        <div class="lsb-label">{i18n.t('profile.surah')}</div>
                    </div>
                    <div class="level-stat-box" style="background:#fff7ed; border-color:#fed7aa;">
                        <div class="lsb-icon">🎯</div>
                        <div class="lsb-val">{levelInfo.ayatSelesai}/{levelInfo.ayat}</div>
                        <div class="lsb-label">{i18n.t('profile.verse')}</div>
                    </div>
                </div>

                <div style="margin-top: 14px;">
                    <div class="progress-header">
                        <span class="progress-title">{i18n.t('profile.surah_progress', {surah: levelInfo.surah})}</span>
                        <span class="progress-pct">{Math.round(levelInfo.progress)}%</span>
                    </div>
                    <div class="prog-bar-bg">
                        <div class="prog-bar-fill" style="width: {levelInfo.progress}%;"></div>
                    </div>
                    <div class="progress-footer">{i18n.t('profile.verses_complete', {done: levelInfo.ayatSelesai, total: levelInfo.ayat})}</div>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════
             4. PENCAPAIAN — STREAK, BADGE & SERTIFIKAT DALAM SATU TAB
        ══════════════════════════════════ -->
        <div class="profile-tabs" style="margin: 20px 16px 0; display: flex; background: #f1f5f9; border-radius: 12px; padding: 4px;">
            <button class="p-tab {activeTab === 'streak' ? 'active' : ''}" onclick={() => activeTab = 'streak'}>
                🔥 {i18n.t('profile.daily_streak')}
            </button>
            <button class="p-tab {activeTab === 'badge' ? 'active' : ''}" onclick={() => activeTab = 'badge'}>
                🎖️ {i18n.t('profile.badges')} ({earnedBadges.length})
            </button>
            <button class="p-tab {activeTab === 'cert' ? 'active' : ''}" onclick={() => activeTab = 'cert'}>
                📜 {i18n.t('profile.certificates')} ({certs.length})
            </button>
        </div>

        <div class="section-pad" style="margin-top: 16px;">
            {#if activeTab === 'streak'}
                <div class="streak-card">
                <!-- Angka streak utama -->
                <div class="streak-main-row">
                    <div class="streak-num-block">
                        <div class="streak-num">{user.streak}</div>
                        <div class="streak-num-label">{i18n.t('streak.days_count')}</div>
                    </div>
                    <div class="streak-divider"></div>
                    <div class="streak-num-block">
                        <div class="streak-num terbanyak">{user.maxStreak}</div>
                        <div class="streak-num-label">{i18n.t('profile.best')}</div>
                    </div>
                    <div class="streak-divider"></div>
                    <div class="streak-num-block">
                        <div class="streak-num rukhsah">{user.streakFreezes}</div>
                        <div class="streak-num-label">{i18n.t('profile.rukhsah')}</div>
                    </div>
                </div>

                <!-- Visualisasi 7 hari -->
                <div class="week-label">{i18n.t('streak.this_week')}</div>
                <div class="week-row">
                    {#each week as d}
                        <div class="week-day">
                            <div class="week-dot"
                                class:done={d.done}
                                class:today={d.isToday && !d.done}
                                class:missed={!d.done && !d.isToday}>
                                {#if d.done}
                                    <span class="week-fire">🔥</span>
                                {:else if d.isToday}
                                    <span>⏳</span>
                                {:else}
                                    <span class="week-x">✕</span>
                                {/if}
                            </div>
                            <span class="week-day-lbl">{i18n.t(DOW[d.dow])}</span>
                        </div>
                    {/each}
                </div>

                <!-- Milestone paling dekat -->
                {#if user.streak < 365}
                    {@const nextMs = [3,7,30,100,365].find(m => m > user.streak) ?? 365}
                    <div class="streak-next-ms">
                        <div class="snm-left">
                            <span>🎯 {i18n.t('profile.next_target')}: <strong>{nextMs} {i18n.t('profile.days')}</strong></span>
                        </div>
                        <div class="snm-right">{i18n.t('profile.days_left', {days: nextMs - user.streak})}</div>
                    </div>
                {/if}

                <!-- Tebus Hari: jendelanya cuma 24 jam, jadi status ini muncul
                     hanya selama penebusan masih bisa dilakukan (STREAK.md). -->
                {#if appState.repairOffer}
                    {@const done = Math.min(2, appState.repairOffer.targetsDone)}
                    <div class="repair-box">
                        <div class="repair-title">🩹 {i18n.t('streak.repair_title')}</div>
                        <div class="repair-desc">{i18n.t('streak.repair_progress', { done, lost: appState.repairOffer.lostStreak })}</div>
                        <div class="repair-dots">
                            <span class="repair-dot" class:on={done >= 1}></span>
                            <span class="repair-dot" class:on={done >= 2}></span>
                        </div>
                    </div>
                {/if}

                <div class="grace-note">
                    <i class="ti ti-moon"></i>
                    <span>{i18n.t('streak.grace_msg')}</span>
                </div>
                </div>
            {:else if activeTab === 'badge'}
                <!-- Earned badges -->
                {#if earnedBadges.length > 0}
                    <div class="badge-grid">
                        {#each earnedBadges as badge}
                            <div class="badge-card earned">
                                <div class="badge-icon-wrap earned">{badge.icon}</div>
                                <div class="badge-name">{i18n.t(`badge.${badge.id}.name`)}</div>
                                <div class="badge-desc">{i18n.t(`badge.${badge.id}.desc`)}</div>
                            </div>
                        {/each}
                    </div>
                {/if}

                <!-- Locked badges -->
                {#if lockedBadges.length > 0}
                    <div class="locked-label">{i18n.t('profile.locked')}</div>
                    <div class="badge-grid">
                        {#each lockedBadges as badge}
                            <div class="badge-card locked">
                                <div class="badge-icon-wrap locked">{badge.icon}</div>
                                <div class="badge-name locked-text">{i18n.t(`badge.${badge.id}.name`)}</div>
                                <div class="badge-desc">{i18n.t(`badge.${badge.id}.desc`)}</div>
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else}
                {#if certs.length > 0}
                    <div class="certs-list">
                        {#each certs as cert}
                            <div class="cert-card">
                                <div class="cert-icon">{cert.icon}</div>
                                <div class="cert-info">
                                    <div class="cert-title">{i18n.t(cert.title)}</div>
                                    <div class="cert-meta">
                                        <span class="cert-type-pill">{i18n.t(cert.type)}</span>
                                        <span class="cert-date">{new Date(cert.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</span>
                                    </div>
                                </div>
                                <button class="cert-download-btn" title={i18n.t('profile.download_certificate')}>
                                    <i class="ti ti-download"></i>
                                </button>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="empty-cert">
                        <span style="font-size:36px">🎓</span>
                        <span>{i18n.t('profile.no_certificates')}</span>
                        <span style="font-size:11px; color:#94a3b8;">{i18n.t('profile.no_certificates_desc')}</span>
                    </div>
                {/if}
            {/if}
        </div>

        <div style="height: 100px;"></div>
    </div>

    <BottomNav active="profile" />
</div>

<style>
    /* ── Layout ── */
    .section-pad { padding: 0 16px 20px; }
    .section-label {
        font-size: 11px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 1px;
        padding: 20px 16px 10px;
    }

    /* ── HERO ── */
    .profile-hero {
        display: flex; flex-direction: column; align-items: center;
        padding: 32px 20px 20px;
        background: linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%);
        border-bottom: 1px solid #e2e8f0;
    }
    .avatar-container { position: relative; }
    .avatar-ring {
        width: 100px; height: 100px; border-radius: 30px;
        background: #fff; border: 3px solid #00978A;
        box-shadow: 0 4px 20px rgba(0,151,138,0.2);
        display: flex; align-items: center; justify-content: center;
    }
    .avatar-large { font-size: 52px; }
    .edit-avatar-btn {
        position: absolute; bottom: -6px; right: -6px;
        width: 30px; height: 30px; background: #00978A; color: #fff;
        border: 2px solid #fff; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; cursor: pointer;
    }
    .user-joined { font-size: 12px; font-weight: 700; color: #94a3b8; margin-top: 4px; }

    .hero-stats {
        display: flex; align-items: center; gap: 0;
        background: #fff; border-radius: 16px; border: 2px solid #e2e8f0;
        margin-top: 16px; overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .hero-stat {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        padding: 10px 4px; gap: 2px;
    }
    .hs-val { font-size: 13px; font-weight: 900; color: #1e293b; }
    .hs-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .hs-divider { width: 1px; height: 36px; background: #e2e8f0; }

    /* ── BOOKING ── */
    .booking-card {
        width: 100%; display: flex; align-items: center; gap: 14px;
        background: linear-gradient(135deg, #fff7ed, #fffbf2);
        border: 2px solid #fed7aa; border-bottom-width: 4px;
        border-radius: 18px; padding: 16px;
        cursor: pointer; text-align: left; transition: transform 0.15s;
    }
    .booking-card:active { transform: scale(0.98); }
    .booking-left { flex-shrink: 0; }
    .booking-avatar {
        width: 52px; height: 52px; background: #ffedd5; border-radius: 16px;
        display: flex; align-items: center; justify-content: center; font-size: 28px;
        border: 2px solid #fed7aa;
    }
    .booking-info { flex: 1; min-width: 0; }
    .booking-musyrif { font-size: 15px; font-weight: 900; color: #92400e; }
    .booking-detail {
        font-size: 12px; font-weight: 700; color: #b45309;
        display: flex; align-items: center; gap: 4px; margin-top: 4px;
    }
    .booking-time-row {
        display: flex; align-items: center; gap: 6px; margin-top: 6px;
        font-size: 11px; font-weight: 700; color: #78716c;
        flex-wrap: wrap;
    }
    .booking-badge {
        background: #ff6200; color: #fff; font-size: 10px; font-weight: 900;
        padding: 2px 8px; border-radius: 6px;
    }
    .booking-arrow { color: #d97706; font-size: 18px; flex-shrink: 0; }
    .empty-booking {
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        padding: 24px; background: #f8fafc; border-radius: 16px;
        border: 2px dashed #e2e8f0; color: #94a3b8; font-size: 13px; font-weight: 700;
    }
    .btn-create-booking {
        background: #00978A; color: #fff; border: none; border-bottom: 3px solid #007a6e;
        border-radius: 10px; padding: 8px 20px; font-size: 12px; font-weight: 900;
        font-family: 'Nunito', sans-serif; cursor: pointer; margin-top: 4px;
    }

    /* ── LEVEL ── */
    .level-card {
        background: #fff; border: 2px solid #e2e8f0; border-bottom-width: 4px;
        border-radius: 18px; padding: 18px;
    }
    .level-top {
        display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
    }
    .level-badge-pill {
        background: #1d4ed8; color: #fff; font-size: 11px; font-weight: 900;
        padding: 4px 12px; border-radius: 99px;
    }
    .level-surah-name {
        flex: 1; display: flex; align-items: baseline; gap: 8px;
        font-size: 16px; font-weight: 900; color: #1e293b;
    }
    .level-surah-ar { font-size: 18px; color: #00978A; font-weight: 700; }
    .level-xp-pill {
        font-size: 11px; font-weight: 900; color: #ff9600;
        background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 99px;
        padding: 3px 10px;
    }
    .level-stats-row { display: flex; gap: 8px; }
    .level-stat-box {
        flex: 1; border: 2px solid; border-radius: 14px; padding: 10px 6px;
        display: flex; flex-direction: column; align-items: center; gap: 3px;
    }
    .lsb-icon { font-size: 18px; }
    .lsb-val { font-size: 11px; font-weight: 900; color: #1e293b; text-align: center; }
    .lsb-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .progress-title { font-size: 12px; font-weight: 800; color: #475569; }
    .progress-pct { font-size: 12px; font-weight: 900; color: #00978A; }
    .prog-bar-bg { height: 10px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
    .prog-bar-fill {
        height: 100%; border-radius: 99px;
        background: linear-gradient(90deg, #00c6b8, #00978A);
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .progress-footer { font-size: 10px; font-weight: 700; color: #94a3b8; margin-top: 4px; }

    /* ── STREAK ── */
    .streak-card {
        background: #fff; border: 2px solid #e2e8f0; border-bottom-width: 4px;
        border-radius: 18px; padding: 18px;
    }
    .streak-main-row {
        display: flex; align-items: center; justify-content: space-around;
        margin-bottom: 20px;
    }
    .streak-divider { width: 1px; height: 44px; background: #e2e8f0; }
    .streak-num-block { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .streak-num {
        font-size: 32px; font-weight: 900; color: #ff6200;
        font-family: 'Nunito', sans-serif; line-height: 1;
    }
    .streak-num.terbanyak { color: #7c3aed; }
    .streak-num.rukhsah { color: #059669; }
    .streak-num-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .week-label { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px; }
    .week-row { display: flex; justify-content: space-between; margin-bottom: 14px; }
    .week-day { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .week-dot {
        width: 38px; height: 38px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; border: 2px solid #f1f5f9; background: #f8fafc;
        transition: all 0.2s;
    }
    .week-dot.done { background: #fff7ed; border-color: #fed7aa; }
    .week-dot.today { background: #ecfdf5; border-color: #6ee7b7; }
    .week-dot.missed { background: #fef2f2; border-color: #fecaca; }
    .week-fire { font-size: 20px; }
    .week-x { font-size: 13px; color: #fca5a5; font-weight: 900; }
    .week-day-lbl { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .streak-next-ms {
        display: flex; align-items: center; justify-content: space-between;
        background: #f0fdf4; border: 1.5px solid #bbf7d0;
        border-radius: 12px; padding: 10px 12px;
        font-size: 12px; font-weight: 700; color: #065f46;
    }
    .snm-right {
        font-size: 11px; font-weight: 900; color: #10b981;
        background: #d1fae5; padding: 2px 8px; border-radius: 6px; white-space: nowrap;
    }
    .repair-box {
        margin-top: 10px; background: #fef2f2; border: 1.5px solid #fecaca;
        border-radius: 12px; padding: 12px;
    }
    .repair-title { font-size: 12px; font-weight: 900; color: #b91c1c; }
    .repair-desc { font-size: 11px; font-weight: 700; color: #991b1b; margin-top: 4px; line-height: 1.4; }
    .repair-dots { display: flex; gap: 6px; margin-top: 8px; }
    .repair-dot {
        width: 26px; height: 8px; border-radius: 99px; background: #fecaca;
    }
    .repair-dot.on { background: #ef4444; }
    .grace-note {
        display: flex; align-items: flex-start; gap: 6px; margin-top: 10px;
        font-size: 10px; font-weight: 700; color: #94a3b8; line-height: 1.5;
    }
    .grace-note i { font-size: 13px; flex-shrink: 0; }

    /* ── PLACEMENT ── */
    .placement-card { border: 2px solid; border-bottom-width: 4px; border-radius: 18px; padding: 16px; }
    .placement-top { display: flex; align-items: center; gap: 12px; }
    .placement-emoji { font-size: 30px; }
    .placement-cat { font-size: 16px; font-weight: 900; }
    .placement-mod { font-size: 12px; font-weight: 700; color: #64748b; margin-top: 2px; }
    .placement-rec {
        display: flex; flex-direction: column; gap: 4px; margin-top: 12px;
        background: rgba(255,255,255,0.7); border-radius: 12px; padding: 10px 12px;
    }
    .placement-rec-label {
        font-size: 9px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .placement-rec-target { font-size: 14px; font-weight: 900; color: #1e293b; }
    .placement-by { font-size: 11px; font-weight: 700; color: #64748b; margin-top: 10px; }
    .placement-pending {
        width: 100%; display: flex; align-items: center; gap: 12px;
        background: #fffbeb; border: 2px solid #fde68a; border-bottom-width: 4px;
        border-radius: 18px; padding: 16px; cursor: pointer;
    }
    .placement-empty {
        width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px;
        padding: 24px; background: #f8fafc; border-radius: 16px; border: 2px dashed #e2e8f0;
        color: #94a3b8; font-size: 13px; font-weight: 700; cursor: pointer;
        font-family: 'Nunito', sans-serif;
    }
    .placement-cta {
        background: #00978A; color: #fff; border-radius: 10px;
        padding: 8px 20px; font-size: 12px; font-weight: 900; margin-top: 4px;
    }

    /* ── BADGE ── */
    .badge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
    .badge-card {
        border-radius: 16px; padding: 14px 12px;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        text-align: center; border: 2px solid;
        transition: transform 0.15s;
    }
    .badge-card.earned {
        background: linear-gradient(135deg, #fffbeb, #fff7ed);
        border-color: #fde68a;
    }
    .badge-card.locked {
        background: #f8fafc; border-color: #e2e8f0; opacity: 0.55;
    }
    .badge-card.earned:hover { transform: scale(1.03); }
    .badge-icon-wrap {
        width: 52px; height: 52px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center; font-size: 26px;
    }
    .badge-icon-wrap.earned { background: #fef3c7; border: 2px solid #fde68a; }
    .badge-icon-wrap.locked { background: #f1f5f9; border: 2px solid #e2e8f0; filter: grayscale(1); }
    .badge-name { font-size: 12px; font-weight: 900; color: #92400e; }
    .badge-name.locked-text { color: #94a3b8; }
    .badge-desc { font-size: 10px; font-weight: 600; color: #a16207; line-height: 1.4; }
    .locked-label {
        font-size: 10px; font-weight: 900; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.5px;
        margin-bottom: 8px; padding-left: 4px;
    }

    /* ── SERTIFIKAT ── */
    .certs-list { display: flex; flex-direction: column; gap: 10px; }
    .cert-card {
        display: flex; align-items: center; gap: 14px;
        background: #fff; border: 2px solid #e2e8f0; border-bottom-width: 4px;
        border-radius: 16px; padding: 14px;
    }
    .cert-icon {
        font-size: 32px; width: 52px; height: 52px;
        background: #f0fdf4; border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; border: 2px solid #bbf7d0;
    }
    .cert-info { flex: 1; min-width: 0; }
    .cert-title { font-size: 13px; font-weight: 900; color: #1e293b; }
    .cert-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
    .cert-type-pill {
        font-size: 10px; font-weight: 900; color: #065f46;
        background: #d1fae5; border-radius: 6px; padding: 2px 8px;
    }
    .cert-date { font-size: 10px; font-weight: 700; color: #94a3b8; }
    .cert-download-btn {
        background: #f1f5f9; border: 2px solid #e2e8f0; color: #475569;
        width: 36px; height: 36px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 16px; flex-shrink: 0;
        transition: all 0.15s;
    }
    .cert-download-btn:hover { background: #00978A; color: #fff; border-color: #00978A; }
    .empty-cert {
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        padding: 28px 16px; background: #f8fafc; border-radius: 16px;
        border: 2px dashed #e2e8f0; text-align: center; color: #64748b;
        font-size: 13px; font-weight: 700;
    }
    
    .p-tab {
        flex: 1; padding: 12px 2px; border: none; background: none;
        font-size: 11px; font-weight: 800; color: #94a3b8; cursor: pointer;
        border-radius: 8px; transition: all 0.2s; white-space: nowrap;
        font-family: 'Nunito', sans-serif;
    }
    .p-tab.active {
        background: #fff; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
</style>
