<script>
    import { appState } from '$lib/app.svelte.js';
    import { fade, slide } from 'svelte/transition';

    const tajweedCategories = [
        {
            colorName: "HITAM",
            title: "Idzhar",
            arabic: "الْإِظْهَارِ",
            bgColor: "#757575", // Gray/Black
            items: ["Idzhar", "Idzhar Syafawi"]
        },
        {
            colorName: "MERAH",
            title: "Idgam",
            arabic: "الْإِدْغَامِ",
            bgColor: "#ef4444", // Red
            items: ["Idgam Bilagunnah", "Idgam Mutaqaribain", "Idgam Mutajanisain", "Idgam Mutamasilain"]
        },
        {
            colorName: "HIJAU",
            title: "Ikhfa",
            arabic: "الْإِخْفَاءِ",
            bgColor: "#10b981", // Green
            items: ["Madd Jaiz Munfasil", "Madd Silah Tawilah", "Ikhfa", "Ikhfa Syafawi"]
        },
        {
            colorName: "BIRU/CYAN",
            title: "Iqlab",
            arabic: "الْإِقْلَابِ",
            bgColor: "#0ea5e9", // Light Blue
            items: ["Madd Wajib Muttasil", "Iqlab"]
        },
        {
            colorName: "BIRU PEKAT",
            title: "Qalqalah",
            arabic: "الْقَلْقَلَةِ",
            bgColor: "#1e1b4b", // Dark Blue
            items: ["Qalqalah Sughra", "Qalqalah Kubra"]
        },
        {
            colorName: "UNGU",
            title: "Gunnah",
            arabic: "الْغُنَّةِ",
            bgColor: "#d946ef", // Magenta / Purple
            items: [
                "Gunnah", "Idgam Bigunnah", "Idgam Mimi", 
                "Idgam Mutamasilain (Gunnah)", "Idgam Mutajanisain (Gunnah)", 
                "Madd Farq", "Madd Lazim Mukhafaf Kilmi", 
                "Madd Lazim Musaqal Kilmi", "Madd Lazim Harfi Musyabba"
            ]
        }
    ];
</script>

<div class="screen theme-user" in:fade={{duration: 200}}>
    <!-- Header -->
    <header class="app-header" style="box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10;">
        <button class="icon-btn" onclick={() => appState.go('lesson')}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <h1 class="page-title">Info Tajwid</h1>
        <div style="width: 40px;"></div> <!-- Spacer -->
    </header>

    <!-- Main Content -->
    <main class="tajwid-content">
        {#each tajweedCategories as cat, index}
            <div class="tajwid-card" in:slide={{delay: index * 100, duration: 300}}>
                <!-- Card Header with Dynamic Background -->
                <div class="card-header" style="background-color: {cat.bgColor};">
                    <div class="header-text">
                        <span class="color-name">{cat.colorName}</span>
                        <span class="title">{cat.title}</span>
                    </div>
                    <div class="arabic-text Amiri">{cat.arabic}</div>
                </div>

                <!-- Card List Items -->
                <div class="card-body">
                    {#each cat.items as item, itemIndex}
                        <div class="list-item">
                            <div class="item-left">
                                <span class="circle-icon"></span>
                                <span class="item-name">{item}</span>
                            </div>
                            <i class="ti ti-chevron-right item-arrow"></i>
                        </div>
                        {#if itemIndex < cat.items.length - 1}
                            <div class="divider"></div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
        
        <!-- Bottom Padding -->
        <div style="height: 40px;"></div>
    </main>
</div>

<style>
    .screen {
        width: 100%;
        height: 100%;
        background-color: #f8fafc; /* Very light cool gray background */
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        height: 60px;
        background: #ffffff;
        flex-shrink: 0;
    }

    .icon-btn {
        background: none;
        border: none;
        font-size: 24px;
        color: #334155;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background 0.2s;
    }

    .icon-btn:hover {
        background: #f1f5f9;
    }

    .page-title {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
    }

    .tajwid-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .tajwid-card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        overflow: hidden;
        transition: transform 0.2s;
    }

    .tajwid-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.06);
    }

    .card-header {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
    }

    .header-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .color-name {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        opacity: 0.9;
    }

    .title {
        font-size: 16px;
        font-weight: 700;
    }

    .arabic-text {
        font-size: 28px;
        font-weight: 400;
        text-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    .card-body {
        padding: 8px 20px;
    }

    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .list-item:hover {
        opacity: 0.7;
    }

    .item-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .circle-icon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #cbd5e1;
        background: transparent;
    }

    .item-name {
        font-size: 14px;
        font-weight: 600;
        color: #475569;
    }

    .item-arrow {
        color: #cbd5e1;
        font-size: 18px;
    }

    .divider {
        height: 1px;
        background-color: #f1f5f9;
        width: 100%;
    }
</style>
