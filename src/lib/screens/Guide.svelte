<script>
    import { appState } from '$lib/app.svelte.js';
    import BottomNav from '$lib/components/BottomNav.svelte';

    const sections = [
        {
            icon: 'ti-book-2',
            color: '#00978A',
            title: 'Apa itu QuranMemo?',
            content: 'QuranMemo adalah aplikasi hafalan Al-Qur\'an berbasis teknologi spaced repetition yang membantu kamu menghafal dan menjaga hafalan dengan cara yang menyenangkan dan terstruktur.'
        },
        {
            icon: 'ti-route',
            color: '#ff9600',
            title: 'Mulai Hafalan',
            steps: [
                'Buka halaman Belajar (ikon 🏠)',
                'Pilih surat yang ingin dihafal pada peta jalan belajar',
                'Tekan tombol "Mulai" untuk memulai sesi hafalan',
                'Ikuti setiap langkah: Baca → Dengar → Hafalkan → Uji'
            ]
        },
        {
            icon: 'ti-refresh',
            color: '#7c5cfc',
            title: 'Murojaah (Mengulang Hafalan)',
            steps: [
                'Buka halaman Murojaah (ikon 🤝)',
                'Ayat-ayat yang perlu diulang akan muncul otomatis berdasarkan jadwal',
                'Selesaikan sesi murojaah harian agar hafalan tetap kuat',
                'Semakin sering diulang, semakin besar XP yang didapat'
            ]
        },
        {
            icon: 'ti-gift',
            color: '#e53935',
            title: 'Misi & Tantangan',
            steps: [
                'Buka halaman Misi (ikon 🎁)',
                'Selesaikan misi harian untuk mendapatkan XP tambahan',
                'Cek tab Tantangan untuk target hafalan bulanan',
                'Raih lencana eksklusif setiap bulan!'
            ]
        },
        {
            icon: 'ti-trophy',
            color: '#f59e0b',
            title: 'Liga & Peringkat',
            steps: [
                'Buka halaman Liga (ikon 🏆)',
                'Kumpulkan XP sebanyak-banyaknya setiap minggu',
                'Naiki peringkat dari Liga Perunggu hingga Berlian',
                'Bersaing sehat dengan penghafal Al-Qur\'an lain'
            ]
        },
        {
            icon: 'ti-star',
            color: '#10b981',
            title: 'Sistem Poin & XP',
            content: 'Setiap aktivitas akan memberikanmu XP (poin pengalaman). XP digunakan untuk naik peringkat di Liga. Kamu juga mendapatkan Gems (💎) yang bisa ditukar dengan item spesial di Marketplace.'
        },
        {
            icon: 'ti-heart',
            color: '#ef4444',
            title: 'Energi (❤️)',
            content: 'Energi berkurang saat kamu melakukan kesalahan saat latihan. Jika energi habis, kamu perlu menunggu isi ulang otomatis atau menggunakan item dari Marketplace. Jawab dengan benar untuk menjaga energi tetap penuh!'
        }
    ];
</script>

<div class="screen guide-screen">
    <!-- Header -->
    <div class="guide-header">
        <div class="guide-header-inner">
            <div class="header-ornament left"></div>
            <div class="header-content">
                <div class="header-icon">📖</div>
                <h1>Panduan QuranMemo</h1>
                <p>Pelajari cara terbaik menggunakan aplikasi untuk hafalan yang optimal</p>
            </div>
            <div class="header-ornament right"></div>
        </div>
        <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
    </div>

    <!-- Content -->
    <div class="guide-content scroll-content no-scrollbar">

        {#each sections as section, i}
            <div class="guide-card" style="--accent: {section.color};">
                <div class="card-header">
                    <div class="card-icon-wrap" style="background: {section.color}15; border-color: {section.color}30;">
                        <i class="ti {section.icon}" style="color: {section.color};"></i>
                    </div>
                    <h2 class="card-title" style="color: {section.color};">{section.title}</h2>
                </div>

                {#if section.content}
                    <p class="card-text">{section.content}</p>
                {/if}

                {#if section.steps}
                    <ol class="card-steps">
                        {#each section.steps as step, j}
                            <li>
                                <span class="step-num" style="background: {section.color}; color: #fff;">{j + 1}</span>
                                <span>{step}</span>
                            </li>
                        {/each}
                    </ol>
                {/if}

                <!-- Islamic corner ornament -->
                <div class="card-ornament"></div>
            </div>
        {/each}

        <div class="guide-footer">
            <div class="footer-arabic">جَزَاكَ اللَّهُ خَيْرًا</div>
            <p>Semoga Allah memudahkan hafalan kita semua. Aamiin.</p>
        </div>

        <div style="height: 80px;"></div>
    </div>

    <BottomNav />
</div>

<style>
    .guide-screen {
        background: #f5f9f6;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    /* ── Header ── */
    .guide-header {
        background: linear-gradient(135deg, #006633 0%, #00978A 100%);
        padding: 20px 16px 16px;
        position: relative;
        overflow: hidden;
    }
    .guide-header::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            repeating-linear-gradient(45deg, rgba(255,215,0,0.06) 0px, rgba(255,215,0,0.06) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(-45deg, rgba(255,215,0,0.06) 0px, rgba(255,215,0,0.06) 1px, transparent 1px, transparent 12px);
        pointer-events: none;
    }
    .guide-header-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }
    .header-ornament {
        width: 32px;
        height: 32px;
        border: 2px solid rgba(255,215,0,0.5);
        border-radius: 50%;
        flex-shrink: 0;
    }
    .header-ornament.left { border-right: none; border-bottom: none; }
    .header-ornament.right { border-left: none; border-top: none; }
    .header-content {
        text-align: center;
    }
    .header-icon {
        font-size: 32px;
        line-height: 1;
        margin-bottom: 4px;
    }
    .guide-header h1 {
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        margin: 0;
        letter-spacing: -0.5px;
    }
    .guide-header p {
        font-size: 12px;
        color: rgba(255,255,255,0.8);
        margin: 4px 0 0;
    }
    .bismillah {
        text-align: center;
        font-size: 18px;
        color: rgba(255,215,0,0.9);
        margin-top: 12px;
        font-family: 'Amiri', 'Arial', serif;
        letter-spacing: 1px;
    }

    /* ── Content ── */
    .guide-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 16px 0;
    }

    /* ── Cards ── */
    .guide-card {
        background: #fff;
        border: 2px solid #e8f0eb;
        border-left: 4px solid var(--accent);
        border-radius: 16px;
        padding: 18px 16px 16px;
        margin-bottom: 14px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        /* arabesque texture */
        background-image:
            linear-gradient(45deg, rgba(255,215,0,0.03) 25%, transparent 25%, transparent 75%, rgba(255,215,0,0.03) 75%),
            linear-gradient(45deg, transparent 25%, rgba(0,102,51,0.03) 25%, rgba(0,102,51,0.03) 75%, transparent 75%);
        background-size: 10px 10px;
    }
    .card-ornament {
        position: absolute;
        bottom: -12px;
        right: -12px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--accent);
        opacity: 0.08;
    }
    .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    }
    .card-icon-wrap {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 18px;
    }
    .card-title {
        font-size: 16px;
        font-weight: 800;
        margin: 0;
    }
    .card-text {
        font-size: 13px;
        color: #555;
        line-height: 1.6;
        margin: 0;
    }

    /* ── Steps ── */
    .card-steps {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .card-steps li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13px;
        color: #444;
        line-height: 1.5;
    }
    .step-num {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        font-size: 11px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;
    }

    /* ── Footer ── */
    .guide-footer {
        text-align: center;
        padding: 24px 16px;
        border-top: 2px dashed #d4e8d0;
        margin-top: 4px;
    }
    .footer-arabic {
        font-size: 22px;
        color: #00978A;
        font-family: 'Amiri', 'Arial', serif;
        margin-bottom: 8px;
    }
    .guide-footer p {
        font-size: 13px;
        color: #888;
        margin: 0;
    }
</style>
