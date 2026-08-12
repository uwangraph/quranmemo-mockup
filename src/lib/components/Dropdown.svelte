<script>
    // Dropdown bergaya sendiri, menggantikan <select> bawaan browser.
    //
    // <select> native mewarisi tema gelap/terang sistem operasi (macOS misalnya
    // merender panelnya gelap) dan tidak bisa diberi gaya sesuai desain aplikasi.
    // Komponen ini membangun ulang perilakunya — tombol pemicu, panel mengambang,
    // klik-di-luar-untuk-tutup — dengan tampilan yang konsisten di semua tema.
    let {
        value = $bindable(),
        options,               // [{ value, label }]
        placeholder,
        ariaLabel = placeholder,
        emptyValue = ''         // nilai yang berarti "belum dipilih"
    } = $props();

    let open = $state(false);

    const selectedLabel = $derived(options.find((o) => o.value === value)?.label ?? placeholder);

    function choose(v) {
        value = v;
        open = false;
    }

    function onTriggerKeydown(e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open = true;
        }
    }

    function onMenuKeydown(e) {
        if (e.key === 'Escape') open = false;
    }
</script>

<div class="qm-dd">
    <button
        type="button"
        class="qm-dd-trigger"
        class:placeholder={!value}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onclick={() => (open = !open)}
        onkeydown={onTriggerKeydown}
    >
        <span>{selectedLabel}</span>
        <i class="ti ti-caret-down"></i>
    </button>

    {#if open}
        <button type="button" class="qm-dd-overlay" aria-label={ariaLabel} onclick={() => (open = false)}></button>
        <ul class="qm-dd-menu" role="listbox" aria-label={ariaLabel} onkeydown={onMenuKeydown}>
            {#if placeholder}
                <li role="presentation">
                    <button
                        type="button"
                        class="qm-dd-item muted"
                        role="option"
                        aria-selected={value === emptyValue}
                        onclick={() => choose(emptyValue)}
                    >
                        {#if value === emptyValue}<i class="ti ti-check"></i>{/if}
                        {placeholder}
                    </button>
                </li>
            {/if}
            {#each options as opt}
                <li role="presentation">
                    <button
                        type="button"
                        class="qm-dd-item"
                        class:selected={value === opt.value}
                        role="option"
                        aria-selected={value === opt.value}
                        onclick={() => choose(opt.value)}
                    >
                        {#if value === opt.value}<i class="ti ti-check"></i>{/if}
                        {opt.label}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .qm-dd { position: relative; width: 100%; }

    /* Meniru .own-input (kolom formulir bertepi), bukan pil ringkas Marketplace —
       kedua tempat pemakaian komponen ini adalah formulir penuh selebar layar. */
    .qm-dd-trigger {
        width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
        padding: 13px 14px; border: 2px solid #e5e5e5; border-radius: 12px;
        background: #fff; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
        color: #3c3c3c; min-height: 48px; box-sizing: border-box; cursor: pointer; text-align: left;
    }
    .qm-dd-trigger span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .qm-dd-trigger.placeholder { color: #94a3b8; }
    .qm-dd-trigger i { color: #94a3b8; font-size: 16px; flex-shrink: 0; }
    .qm-dd-trigger:focus-visible { outline: none; border-color: #1cb0f6; }

    .qm-dd-overlay {
        position: fixed; inset: 0; z-index: 40;
        background: none; border: none; padding: 0; cursor: default;
    }

    .qm-dd-menu {
        position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
        margin: 0; padding: 6px; list-style: none;
        background: #fff; border: 1px solid #e5e5e5; border-radius: 14px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        max-height: 240px; overflow-y: auto;
    }
    .qm-dd-item {
        width: 100%; display: flex; align-items: center; gap: 8px;
        padding: 10px 12px; border: none; background: none; border-radius: 9px;
        font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
        color: #3c3c3c; text-align: left; cursor: pointer; min-height: 40px; box-sizing: border-box;
    }
    .qm-dd-item i { font-size: 14px; color: #00978A; flex-shrink: 0; }
    .qm-dd-item.muted { color: #94a3b8; }
    .qm-dd-item:hover { background: #f8fafc; }
    .qm-dd-item.selected { background: #e0f5f3; color: #00978A; font-weight: 800; }
</style>
