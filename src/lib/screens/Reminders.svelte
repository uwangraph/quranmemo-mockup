<script>
    // SmartReminder (STREAK.md).
    //
    // Tiga tingkat frekuensi, masing-masing dengan jadwal yang berbeda. Jadwalnya
    // dihitung dari waktu hafalan pilihan pengguna — bukan daftar jam yang ditulis
    // mati — supaya yang terlihat di layar memang jadwal yang akan dikirim.
    import { appState, MURAJAAH_DUE_DAYS } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const reminder = $derived(appState.user.reminder);

    // Waktu sholat dipakai sebagai jangkar jadwal, sesuai penulisan di STREAK.md.
    const PRAYER_TIMES = { subuh: '04:40', dzuhur: '12:00', ashar: '15:15', maghrib: '18:00', isya: '19:10' };

    const LEVELS = [
        { id: 'ringan', count: 3, icon: 'ti-leaf', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
        { id: 'sedang', count: 5, icon: 'ti-bell', color: '#f59e0b', bg: '#fffbeb', border: '#99e5dc' },
        { id: 'kritis', count: 10, icon: 'ti-alarm', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
    ];

    // Geser jam "HH:MM" sebanyak n jam, dibungkus dalam 24 jam.
    function shift(time, hours) {
        const [h, m] = time.split(':').map(Number);
        const hh = ((h + hours) % 24 + 24) % 24;
        return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    const target = $derived(reminder.preferredTime || '05:00');

    // Tiga jangkar yang selalu ada di semua tingkat: sebelum, tepat, dan sesudah
    // waktu hafalan pilihan.
    const aroundTarget = $derived([
        { time: shift(target, -1), label: i18n.t('reminder.slot_before') },
        { time: target, label: i18n.t('reminder.slot_exact') },
        { time: shift(target, 1), label: i18n.t('reminder.slot_after') }
    ]);

    const schedule = $derived.by(() => {
        const p = PRAYER_TIMES;
        if (reminder.level === 'ringan') return aroundTarget;

        if (reminder.level === 'sedang') {
            return [
                { time: p.subuh, label: i18n.t('reminder.slot_subuh') },
                ...aroundTarget,
                { time: p.maghrib, label: i18n.t('reminder.slot_maghrib') }
            ];
        }

        return [
            { time: '00:00', label: i18n.t('reminder.slot_grace') },
            { time: p.subuh, label: i18n.t('reminder.slot_subuh') },
            { time: p.dzuhur, label: i18n.t('reminder.slot_dzuhur') },
            { time: p.ashar, label: i18n.t('reminder.slot_ashar') },
            { time: p.maghrib, label: i18n.t('reminder.slot_maghrib') },
            { time: p.isya, label: i18n.t('reminder.slot_isya') },
            ...aroundTarget,
            { time: '22:00', label: i18n.t('reminder.slot_critical') }
        ];
    });

    const sortedSchedule = $derived([...schedule].sort((a, b) => a.time.localeCompare(b.time)));
    const activeLevel = $derived(LEVELS.find((l) => l.id === reminder.level) ?? LEVELS[0]);

    // Target harian menentukan tingkat pengingat (STREAK.md: makin tinggi target,
    // makin sering pengingatnya), tapi pengguna tetap boleh menimpanya manual.
    function setTarget(n) {
        appState.setReminderPrefs({
            dailyTarget: n,
            level: n >= 5 ? 'kritis' : n >= 3 ? 'sedang' : 'ringan'
        });
    }
</script>

<div class="screen">
    <div class="topbar">
        <button class="back-btn" onclick={() => appState.go('profile')} aria-label={i18n.t('common.back')}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <span style="font-size:16px; font-weight:900; color:#3c3c3c; flex:1; text-align:center;">
            {i18n.t('reminder.title')}
        </span>
        <div style="width:40px;"></div>
    </div>

    <div class="scroll-content no-scrollbar">
        <div class="intro">
            <span style="font-size:34px;"><i class="ti ti-bell"></i></span>
            <p>{i18n.t('reminder.intro')}</p>
        </div>

        <!-- Target harian -->
        <div class="section-label"><i class="ti ti-target"></i> {i18n.t('placement.daily_target')}</div>
        <div class="pad">
            <div class="chip-grid">
                {#each [1, 2, 3, 5, 10] as n}
                    <button class="chip" class:selected={reminder.dailyTarget === n} onclick={() => setTarget(n)}>
                        {i18n.t('placement.verses_per_day', { count: n })}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Waktu hafalan -->
        <div class="section-label">⏰ {i18n.t('placement.preferred_time')}</div>
        <div class="pad">
            <input
                class="time-input"
                type="time"
                value={target}
                oninput={(e) => appState.setReminderPrefs({ preferredTime: e.currentTarget.value })}
            />
        </div>

        <!-- Tingkat pengingat -->
        <div class="section-label"><i class="ti ti-broadcast"></i> {i18n.t('reminder.level_label')}</div>
        <div class="pad">
            <div class="level-list">
                {#each LEVELS as lv}
                    <button
                        class="level-card"
                        class:selected={reminder.level === lv.id}
                        style={reminder.level === lv.id ? `background:${lv.bg}; border-color:${lv.border};` : ''}
                        onclick={() => appState.setReminderPrefs({ level: lv.id })}
                    >
                        <span class="level-icon"><i class="ti {lv.icon}"></i></span>
                        <div style="flex:1; min-width:0; text-align:left;">
                            <div class="level-name" style={reminder.level === lv.id ? `color:${lv.color}` : ''}>
                                {i18n.t(`placement.reminder_${lv.id}`)}
                            </div>
                            <div class="level-desc">{i18n.t(`reminder.tone_${lv.id}`)}</div>
                        </div>
                        <span class="level-count" style={reminder.level === lv.id ? `background:${lv.color}` : ''}>
                            {lv.count}×
                        </span>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Jadwal yang benar-benar akan dikirim -->
        <div class="section-label"><i class="ti ti-calendar"></i> {i18n.t('reminder.schedule_label')}</div>
        <div class="pad">
            <div class="schedule-card" style="border-color:{activeLevel.border};">
                <div class="schedule-head" style="color:{activeLevel.color};">
                    {i18n.t('placement.reminder_level', {
                        level: i18n.t(`placement.reminder_${activeLevel.id}`), count: activeLevel.count
                    })}
                </div>
                {#each sortedSchedule as slot}
                    <div class="slot">
                        <span class="slot-time">{slot.time}</span>
                        <span class="slot-label">{slot.label}</span>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Murajaah alert: terpisah dari pengingat streak (STREAK.md) -->
        <div class="section-label"><i class="ti ti-refresh"></i> {i18n.t('murajaah.title')}</div>
        <div class="pad">
            <div class="murajaah-info">
                <i class="ti ti-info-circle"></i>
                <span>{i18n.t('reminder.murajaah_note', { days: MURAJAAH_DUE_DAYS })}</span>
            </div>
            {#if appState.murajaahDue.length > 0}
                <div class="due-now">
                    {i18n.t('reminder.murajaah_due_now', { count: appState.murajaahDue.length })}
                </div>
            {/if}
        </div>

        <div style="height: 100px;"></div>
    </div>

    <BottomNav active="profile" />
</div>

<style>
    .back-btn {
        background: none; border: none; color: #afafaf; cursor: pointer; font-size: 20px;
        min-width: 40px; min-height: 40px; display: flex; align-items: center; justify-content: center;
    }
    .intro {
        display: flex; align-items: center; gap: 14px; padding: 20px 16px;
        background: linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%);
        border-bottom: 1px solid #e2e8f0;
    }
    .intro p { margin: 0; font-size: 13px; font-weight: 700; color: #475569; line-height: 1.5; }

    .section-label {
        font-size: 11px; font-weight: 900; color: #64748b;
        text-transform: uppercase; letter-spacing: 1px; padding: 20px 16px 10px;
    }
    .pad { padding: 0 16px; }

    .chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
        padding: 10px 14px; border-radius: 99px; border: 2px solid #e5e5e5; background: #fff;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; color: #475569;
        cursor: pointer; min-height: 42px;
    }
    .chip.selected { background: #ddf4ff; border-color: #1cb0f6; color: #0898dc; }

    .time-input {
        width: 100%; padding: 13px 14px; border: 2px solid #e5e5e5; border-radius: 12px;
        background: #fff; font-family: 'Nunito', sans-serif; font-size: 16px;
        font-weight: 800; color: #3c3c3c; min-height: 50px;
    }
    .time-input:focus { outline: none; border-color: #1cb0f6; }

    .level-list { display: flex; flex-direction: column; gap: 10px; }
    .level-card {
        display: flex; align-items: center; gap: 12px; width: 100%;
        background: #fff; border: 2px solid #e5e5e5; --btn-edge: #cbd5e1; box-shadow: 0 4px 0 var(--btn-edge);
        border-radius: 16px; padding: 14px; cursor: pointer;
        font-family: 'Nunito', sans-serif; min-height: 64px; transition: all 0.15s;
    }
    .level-card:active { transform: translateY(4px); box-shadow: none; }
    .level-icon { font-size: 24px; }
    .level-name { font-size: 15px; font-weight: 900; color: #1e293b; }
    .level-desc { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px; line-height: 1.4; }
    .level-count {
        background: #cbd5e1; color: #fff; font-size: 12px; font-weight: 900;
        padding: 4px 10px; border-radius: 99px; flex-shrink: 0;
    }

    .schedule-card {
        background: #fff; border: 2px solid #e5e5e5; border-bottom-width: 4px;
        border-radius: 16px; padding: 14px;
    }
    .schedule-head {
        font-size: 12px; font-weight: 900; margin-bottom: 10px;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .slot {
        display: flex; align-items: center; gap: 12px;
        padding: 8px 0; border-bottom: 1px solid #f1f5f9;
    }
    .slot:last-child { border-bottom: none; }
    .slot-time {
        font-size: 13px; font-weight: 900; color: #1e293b;
        font-variant-numeric: tabular-nums; min-width: 48px;
    }
    .slot-label { font-size: 12px; font-weight: 700; color: #64748b; }

    .murajaah-info {
        display: flex; align-items: flex-start; gap: 8px;
        background: #e8f8f6; border: 1.5px solid #99e5dc; border-radius: 12px;
        padding: 12px; font-size: 12px; font-weight: 700; color: #008f83; line-height: 1.5;
    }
    .murajaah-info i { font-size: 16px; flex-shrink: 0; }
    .due-now {
        margin-top: 8px; background: #007A70; color: #fff; border-radius: 10px;
        padding: 10px 12px; font-size: 12px; font-weight: 900; text-align: center;
    }
</style>
