<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    let isAvailable = $state(true);

    // Antrean verifikasi Placement Test (ONBOARDING.md §1.3).
    // Musyrif mendengar rekaman QS Maryam 1-10 lalu menentukan kategorinya; sistem
    // tidak pernah memutuskan sendiri. Selain santri di perangkat ini, ditampilkan
    // beberapa contoh antrean agar bentuk layarnya terlihat.
    const placement = $derived(appState.user.placement);
    const slaLeft = $derived(appState.placementSlaHoursLeft());

    const CATS = [
        { id: 'rbq', icon: '🌱', color: '#b45309' },
        { id: 'rtq', icon: '📖', color: '#0369a1' },
        { id: 'tahfidz', icon: '🏅', color: '#0f766e' }
    ];

    const queue = $derived([
        ...(placement?.status === 'pending'
            ? [{ name: appState.user.name, hours: slaLeft ?? 24, self: true }] : []),
        { name: 'Fatimah Az-Zahra', hours: 19, self: false },
        { name: 'Yusuf Ibrahim', hours: 6, self: false }
    ]);

    let decided = $state({});   // nama -> kategori, untuk contoh non-santri

    function decide(entry, cat) {
        if (entry.self) {
            const notes = { rbq: 'placement.rec_note_rbq', rtq: 'placement.rec_note_rtq', tahfidz: 'placement.rec_note_tahfidz' };
            const surah = { rbq: 'An-Nas', rtq: 'Ad-Duha', tahfidz: 'An-Naba' };
            appState.setPlacementResult(cat, { surah: surah[cat], juz: 30, note: i18n.t(notes[cat]) });
        }
        decided = { ...decided, [entry.name]: cat };
    }

    function acceptInstantRequest() {
        appState.setLiveSession({
            studentName: 'Ahmad Hafidz',
            musyrifName: 'Ust. Malik',
            surah: 'Al-Insyirah',
            ayah: '1-8',
            sessionId: 'instant-al-insyirah-1-8'
        });
        appState.go('livemarking');
    }
</script>

<div class="screen">
    <div class="musyrif-profile-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
            <div style="display: flex; align-items: center; gap: 16px">
                <div class="m-avatar-large">👳</div>
                <div>
                    <div style="font-size: 18px; font-weight: 900">Ustadz Malik</div>
                    <div class="tier-badge-gold">{i18n.t('musyrif.partner_tier')}</div>
                </div>
            </div>
            <div class="earnings-pill-mini" onclick={() => appState.go('musyrif-earnings')} style="display: flex; align-items: center; gap: 8px;">
                <div>
                    <div style="font-size: 14px; font-weight: 900; color: #1cb0f6;">{appState.musyrifBalance} <i class="ti ti-diamond-filled"></i></div>
                    <div style="font-size: 9px; font-weight: 800; opacity: 0.7; text-transform: uppercase;">{i18n.t('musyrif.balance')}</div>
                </div>
                <i class="ti ti-chevron-right" style="color: #afafaf;"></i>
            </div>
        </div>
    </div>

    <div class="scroll-content no-scrollbar" style="padding: 16px;">
        <div class="availability-card">
            <div>
                <div style="font-size: 14px; font-weight: 800; color: #3c3c3c">{i18n.t('musyrif.availability')}</div>
                <div style="font-size: 11px; font-weight: 700; color: #afafaf">{i18n.t('musyrif.availability_d')}</div>
            </div>
            <button 
                class="toggle-switch" 
                class:active={isAvailable}
                onclick={() => isAvailable = !isAvailable}
            >
                <div class="toggle-circle"></div>
            </button>
        </div>

        <!-- Antrean verifikasi placement, SLA 1x24 jam -->
        <div class="section-label">🎤 {i18n.t('musyrif.placement_queue')} ({queue.length})</div>
        {#each queue as entry}
            {@const chosen = decided[entry.name]}
            <div class="placement-row" class:urgent={entry.hours <= 6 && !chosen}>
                <div class="pl-avatar">{chosen ? CATS.find(c => c.id === chosen).icon : '🎧'}</div>
                <div style="flex:1; min-width:0;">
                    <div class="pl-name">
                        {entry.name}
                        {#if entry.self}<span class="pl-self">{i18n.t('lb.you_badge')}</span>{/if}
                    </div>
                    <div class="pl-meta">QS Maryam 1-10 · {i18n.t('placement.sla_left', { hours: entry.hours })}</div>
                </div>
            </div>
            {#if chosen}
                <div class="pl-done" style="color:{CATS.find(c => c.id === chosen).color}">
                    ✓ {i18n.t(`placement.cat_${chosen}`)}
                </div>
            {:else}
                <div class="pl-actions">
                    {#each CATS as c}
                        <button class="btn-duo btn-outline btn-sm pl-btn" onclick={() => decide(entry, c.id)}>
                            {c.icon} {i18n.t(`placement.cat_${c.id}`)}
                        </button>
                    {/each}
                </div>
            {/if}
        {/each}

        <div class="section-label">{i18n.t('musyrif.requests')} (Instan)</div>
        
        {#if isAvailable}
            <div class="request-card">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #fff4e0; display: flex; align-items: center; justify-content: center; font-size: 24px;">🧑‍🎓</div>
                <div style="flex: 1">
                    <div style="font-size: 14px; font-weight: 900; color: #3c3c3c">Ahmad Hafidz</div>
                    <div style="font-size: 11px; font-weight: 700; color: #ff9600">{i18n.t('admin.serving')}: Al-Insyirah (Instan) • +15 <i class="ti ti-diamond-filled" style="color: #1cb0f6;"></i></div>
                </div>
                <button class="btn-duo btn-orange btn-sm btn-auto" onclick={acceptInstantRequest}>
                    {i18n.t('musyrif.accept')}
                </button>
            </div>
        {:else}
            <div style="text-align: center; padding: 40px 20px; color: #afafaf;">
                <div style="font-size: 32px; margin-bottom: 12px;">😴</div>
                <div style="font-size: 13px; font-weight: 800;">{i18n.t('status.offline')}</div>
                <div style="font-size: 11px; font-weight: 700;">{i18n.t('musyrif.offline_msg')}</div>
            </div>
        {/if}

        <div class="section-label" style="margin-top: 24px">{i18n.t('musyrif.upcoming_schedule')}</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="booking-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <div style="font-size: 12px; font-weight: 800; color: #1cb0f6;">Besok, 10:00</div>
                    <div style="font-size: 11px; font-weight: 800; color: #1cb0f6; background: #e1f5fe; padding: 2px 8px; border-radius: 6px;">+15 <i class="ti ti-diamond-filled"></i></div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-size: 18px;">👧</div>
                    <div style="flex: 1">
                        <div style="font-size: 14px; font-weight: 900; color: #3c3c3c">Aisyah Putri</div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748b">Surah: Al-Mulk 1-10</div>
                    </div>
                </div>
            </div>
            
            <div class="booking-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <div style="font-size: 12px; font-weight: 800; color: #1cb0f6;">Lusa, 14:00</div>
                    <div style="font-size: 11px; font-weight: 800; color: #1cb0f6; background: #e1f5fe; padding: 2px 8px; border-radius: 6px;">+15 <i class="ti ti-diamond-filled"></i></div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: #fef08a; display: flex; align-items: center; justify-content: center; font-size: 18px;">👨</div>
                    <div style="flex: 1">
                        <div style="font-size: 14px; font-weight: 900; color: #3c3c3c">Budi Santoso</div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748b">Surah: An-Naba 1-20</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section-label" style="margin-top: 16px">{i18n.t('musyrif.stats')}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <div class="stat-card">
                <div style="font-size: 20px; font-weight: 900; color: #3c3c3c">24</div>
                <div style="font-size: 10px; font-weight: 800; color: #afafaf">{i18n.t('musyrif.sessions_week')}</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 20px; font-weight: 900; color: #ffc800">4.9 ★</div>
                <div style="font-size: 10px; font-weight: 800; color: #afafaf">{i18n.t('musyrif.avg_rating')}</div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Antrean placement */
    .placement-row {
        display: flex; align-items: center; gap: 12px;
        background: #fff; border: 2px solid #e5e5e5; border-radius: 14px 14px 0 0;
        border-bottom: none; padding: 12px;
    }
    .placement-row.urgent { border-color: #fecaca; background: #fef2f2; }
    .pl-avatar {
        width: 42px; height: 42px; border-radius: 50%; background: #f1f5f9;
        display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
    }
    .pl-name { font-size: 14px; font-weight: 900; color: #3c3c3c; display: flex; align-items: center; gap: 6px; }
    .pl-self {
        font-size: 8px; font-weight: 900; background: #00978A; color: #fff;
        padding: 1px 6px; border-radius: 99px; text-transform: uppercase;
    }
    .pl-meta { font-size: 11px; font-weight: 700; color: #94a3b8; margin-top: 2px; }
    .pl-actions {
        display: flex; gap: 6px; padding: 0 12px 12px;
        background: #fff; border: 2px solid #e5e5e5; border-top: none;
        border-radius: 0 0 14px 14px; margin-bottom: 10px;
    }
    .pl-btn {
        appearance: none; -webkit-appearance: none;
        flex: 1; min-height: 40px; padding: 8px 4px; border-radius: 10px;
        border: 2px solid #e2e8f0; background: #f8fafc;
        font-family: inherit; font-size: 10px; line-height: 1.15; font-weight: 800;
        color: #475569; cursor: pointer; text-align: center;
        box-shadow: 0 2px 0 #cbd5e1;
        transition: transform .12s ease, background .12s ease, box-shadow .12s ease;
    }
    .pl-btn:hover { background: #eef6f7; border-color: #99d5d0; color: #007d73; }
    .pl-btn:active { background: #e2e8f0; transform: translateY(2px); box-shadow: none; }
    .pl-done {
        background: #fff; border: 2px solid #e5e5e5; border-top: none;
        border-radius: 0 0 14px 14px; padding: 10px 12px; margin-bottom: 10px;
        font-size: 12px; font-weight: 900;
    }

    .musyrif-profile-header {
        background: #1a1a1a;
        padding: 30px 20px 20px;
        color: #fff;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    }
    .m-avatar-large {
        width: 60px;
        height: 60px;
        border-radius: 20px;
        background: var(--duo-orange);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        box-shadow: 0 4px 12px rgba(255, 150, 0, 0.3);
    }
    .tier-badge-gold {
        font-size: 10px;
        font-weight: 900;
        color: var(--duo-gold);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .earnings-pill-mini {
        background: rgba(255,255,255,0.1);
        padding: 10px 14px;
        border-radius: 16px;
        text-align: right;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .availability-card {
        background: #f1f5f9;
        border-radius: 20px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        border: 1px solid #e2e8f0;
    }
    .toggle-switch {
        width: 52px;
        height: 28px;
        background: #cbd5e1;
        border-radius: 100px;
        position: relative;
        cursor: pointer;
        border: none;
        transition: all 0.3s;
    }
    .toggle-switch.active {
        background: var(--duo-orange);
        border-color: var(--duo-orange);
        box-shadow: 0 0 15px rgba(255, 150, 0, 0.4);
    }
    .toggle-circle {
        width: 22px;
        height: 22px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        left: 3px;
        top: 3px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .toggle-switch.active .toggle-circle { transform: translateX(24px); }

    .request-card {
        background: #fff;
        border: 2px solid var(--duo-orange);
        border-bottom-width: 5px;
        border-radius: 20px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
    }
    @keyframes pulse-green {
        0% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.4); }
        70% { box-shadow: 0 0 0 12px rgba(88, 204, 2, 0); }
        100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0); }
    }
    .stat-card {
        background: #fff;
        border: 2px solid var(--border-main);
        border-bottom-width: 4px;
        border-radius: 18px;
        padding: 16px;
        text-align: center;
    }

    .booking-card {
        background: #fff;
        border: 2px solid var(--border-main);
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 16px;
    }
</style>
