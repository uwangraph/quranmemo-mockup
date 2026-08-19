<script>
    // Header tunggal untuk layar-layar musyrif.
    //
    // Sebelumnya tiap layar menulis bilahnya sendiri dan tak satu pun sama:
    // Penghasilan memakai garis bawah 1px dengan pengganjal lebar 20px agar judulnya
    // kelihatan tengah, Live Marking memakai garis 2px dengan padding 20px, dan
    // Verifikasi Placement memakai kelas .topbar global ditambah pengganjal 40px.
    // Warna tombol kembalinya pun berbeda (#3c3c3c, #afafaf). Semua kini seragam,
    // dan judul betul-betul di tengah lewat grid, bukan lewat pengganjal.
    import { i18n } from '$lib/i18n.svelte.js';

    let { title, subtitle = null, onBack, trailing = null } = $props();
</script>

<div class="musyrif-topbar">
    <button class="mh-back" onclick={onBack} aria-label={i18n.t('common.back')}>
        <i class="ti ti-arrow-left"></i>
    </button>

    <div class="mh-heading">
        <div class="mh-title">{title}</div>
        {#if subtitle}<div class="mh-subtitle">{@render subtitle()}</div>{/if}
    </div>

    <div class="mh-trailing">
        {#if trailing}{@render trailing()}{/if}
    </div>
</div>

<style>
    /* Kolom tepi dikunci selebar 44px agar judul tetap di tengah apa pun isi sisi
       kanannya — pengganjal berlebar tebakan membuat judul meleset beberapa piksel
       dan bergeser saat sisi kanan berubah (misalnya penghitung waktu). */
    .musyrif-topbar {
        display: grid;
        grid-template-columns: 44px 1fr 44px;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        flex-shrink: 0;
        background: #fff;
        border-bottom: 2px solid #f0f0f0;
        z-index: 10;
    }

    .mh-back {
        /* 44px = target sentuh minimal yang nyaman, sekaligus lebar kolom tepi. */
        width: 44px; height: 44px; margin-left: -10px;
        display: flex; align-items: center;
        background: none; border: none; cursor: pointer;
        color: #3c3c3c; font-size: 20px;
    }
    .mh-back:focus-visible { outline: 3px solid var(--duo-orange); outline-offset: -3px; border-radius: 10px; }

    .mh-heading { min-width: 0; text-align: center; }
    .mh-title {
        font-size: 15px; font-weight: 900; color: #3c3c3c; line-height: 1.2;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .mh-subtitle {
        font-size: 10px; font-weight: 700; color: #64748b; margin-top: 1px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .mh-trailing { display: flex; justify-content: flex-end; align-items: center; }
</style>
