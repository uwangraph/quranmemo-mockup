<script>
    import { slide } from 'svelte/transition';
    import { i18n } from '$lib/i18n.svelte.js';
    let { cat, isOpen, onToggle, openItem, onToggleItem } = $props();
</script>

<div class="tajwid-card">
    <button
        class="card-header"
        style="background-color: {cat.bgColor};"
        onclick={onToggle}
        aria-expanded={isOpen}
    >
        <div class="header-text">
            <span class="color-name">{cat.colorName}</span>
            <span class="cat-title">{cat.title}</span>
        </div>
        <div class="header-right">
            <span class="arabic-title">{cat.arabic}</span>
            <i class="ti {isOpen ? 'ti-chevron-up' : 'ti-chevron-down'} chevron-icon"></i>
        </div>
    </button>

    {#if isOpen}
        <div class="card-body" transition:slide={{duration: 200}}>
            {#each cat.items as item, itemIdx}
                {@const itemKey = itemIdx}
                <div class="list-item-wrapper">
                    <button
                        class="list-item"
                        onclick={() => onToggleItem(itemKey)}
                        aria-expanded={openItem === itemKey}
                    >
                        <div class="item-left">
                            <span class="circle-dot" style="border-color: {cat.bgColor};"></span>
                            <span class="item-name">{item.name}</span>
                        </div>
                        <i class="ti {openItem === itemKey ? 'ti-chevron-up' : 'ti-chevron-right'} item-arrow"></i>
                    </button>

                    {#if openItem === itemKey}
                        <div class="item-detail" style="border-left: 3px solid {cat.bgColor};" transition:slide={{duration: 200}}>
                            <p class="detail-description">{item.description}</p>
                            <div class="detail-meta">
                                <div class="meta-row">
                                    <span class="meta-label">{i18n.t('tajwid.letters')}</span>
                                    <span class="meta-value mixed-text">{item.huruf}</span>
                                </div>
                                <div class="meta-row" style="margin-top: 4px;">
                                    <span class="meta-label">{i18n.t('tajwid.example')}</span>
                                    <div class="contoh-box" style="border-color: {cat.bgColor}20; background: {cat.bgColor}08;">
                                        <span class="contoh-arab">{@html item.contohArab}</span>
                                        <span class="contoh-latin">"{item.contohLatin}"</span>
                                        <span class="contoh-arti">{item.contohArti}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}

                    {#if itemIdx < cat.items.length - 1}
                        <div class="divider"></div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .tajwid-card { background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; }
    .card-header { width: 100%; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; color: #ffffff; cursor: pointer; border: none; text-align: left; transition: filter 0.15s; }
    .card-header:hover { filter: brightness(1.08); }
    .header-text { display: flex; flex-direction: column; gap: 2px; }
    .color-name { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; opacity: 0.85; text-transform: uppercase; }
    .cat-title { font-size: 17px; font-weight: 800; }
    .header-right { display: flex; align-items: center; gap: 10px; }
    .arabic-title { font-family: 'Amiri', 'Scheherazade New', serif; font-size: 24px; font-weight: 700; text-shadow: 0 1px 4px rgba(0,0,0,0.18); }
    .chevron-icon { font-size: 16px; opacity: 0.9; }
    .card-body { padding: 0 16px; }
    .list-item { width: 100%; background: none; border: none; display: flex; justify-content: space-between; align-items: center; padding: 13px 0; cursor: pointer; text-align: left; transition: opacity 0.15s; }
    .list-item:hover { opacity: 0.65; }
    .item-left { display: flex; align-items: center; gap: 12px; }
    .circle-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #cbd5e1; background: transparent; flex-shrink: 0; }
    .item-name { font-size: 13.5px; font-weight: 600; color: #374151; }
    .item-arrow { font-size: 15px; color: #cbd5e1; flex-shrink: 0; }
    .item-detail { margin: 0 0 10px 22px; padding: 12px 14px; border-radius: 10px; background: #f8fafc; }
    .detail-description { font-size: 12.5px; line-height: 1.65; color: #475569; margin: 0 0 12px 0; }
    .detail-meta { display: flex; flex-direction: column; gap: 10px; }
    .meta-row { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; }
    .meta-value { font-size: 13px; font-weight: 600; color: #374151; }
    .mixed-text { font-size: 14.5px; line-height: 1.5; color: #1e293b; font-family: 'Amiri', 'Inter', sans-serif; }
    .contoh-box { border: 1.5px solid; border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
    .contoh-arab { font-family: 'Amiri', 'Scheherazade New', serif; font-size: 24px; font-weight: 700; color: #1e293b; text-align: right; direction: rtl; line-height: 1.6; }
    .contoh-latin { font-size: 12px; font-weight: 600; color: #64748b; font-style: italic; }
    .contoh-arti { font-size: 11.5px; font-weight: 500; color: #94a3b8; line-height: 1.5; }
    .divider { height: 1px; background-color: #f1f5f9; }
</style>
