<script>
    import { appState } from '$lib/app.svelte.js';
    import { fade, slide } from 'svelte/transition';

    // State untuk accordion - mana yang sedang terbuka
    let openCategory = $state(null);
    let openItem = $state(null);

    function toggleCategory(index) {
        openCategory = openCategory === index ? null : index;
        openItem = null; // reset item saat ganti kategori
    }

    function toggleItem(key) {
        openItem = openItem === key ? null : key;
    }

    const tajweedCategories = [
        {
            colorName: "HITAM",
            title: "Idzhar",
            arabic: "الْإِظْهَارُ",
            bgColor: "#6b7280",
            textColor: "#ffffff",
            items: [
                {
                    name: "Idzhar Halqi",
                    description: "Nun sukun atau tanwin bertemu dengan salah satu huruf halq (tenggorokan): ء ه ع غ ح خ. Cara membacanya jelas/terang tanpa dengung.",
                    huruf: "ء ه ع غ ح خ",
                    contohArab: "مَنْ آمَنَ",
                    contohLatin: "Man aamana",
                    contohArti: "(siapa yang beriman) — nun sukun bertemu ء"
                },
                {
                    name: "Idzhar Syafawi",
                    description: "Mim sukun bertemu huruf selain mim (م) dan ba (ب). Cara membacanya terang tanpa dengung pada bibir.",
                    huruf: "Semua huruf kecuali م dan ب",
                    contohArab: "هُمْ فِيهَا",
                    contohLatin: "Hum fiihaa",
                    contohArti: "(mereka di dalamnya) — mim sukun bertemu ف"
                }
            ]
        },
        {
            colorName: "MERAH",
            title: "Idgam",
            arabic: "الْإِدْغَامُ",
            bgColor: "#ef4444",
            textColor: "#ffffff",
            items: [
                {
                    name: "Idgam Bilagunnah",
                    description: "Nun sukun atau tanwin bertemu huruf ل atau ر. Dibaca lebur/masuk tanpa dengung.",
                    huruf: "ل ر",
                    contohArab: "مِّن رَّبِّهِمْ",
                    contohLatin: "Mir rabbihim",
                    contohArti: "(dari Tuhan mereka) — nun sukun bertemu ر"
                },
                {
                    name: "Idgam Bigunnah",
                    description: "Nun sukun atau tanwin bertemu huruf ي ن م و. Dibaca lebur/masuk dengan dengung 2 harakat.",
                    huruf: "ي ن م و",
                    contohArab: "مَن يَقُولُ",
                    contohLatin: "May yaquulu",
                    contohArti: "(siapa yang berkata) — nun sukun bertemu ي"
                },
                {
                    name: "Idgam Mutaqaribain",
                    description: "Dua huruf yang berdekatan makhrajnya bertemu dan salah satunya sukun, dilebur menjadi satu dengan tasydid.",
                    huruf: "Contoh: ق → ك",
                    contohArab: "أَلَمْ نَخْلُقكُّم",
                    contohLatin: "Alam nakhlukkum",
                    contohArti: "(bukankah Kami telah menciptakanmu) — ق sukun bertemu ك"
                },
                {
                    name: "Idgam Mutajanisain",
                    description: "Dua huruf yang sama makhrajnya namun berbeda sifatnya bertemu, huruf pertama sukun dilebur ke huruf kedua.",
                    huruf: "Contoh: ت → ط ,د → ت",
                    contohArab: "قَالَت طَّائِفَةٌ",
                    contohLatin: "Qaalat thaaa'ifah",
                    contohArti: "(berkata segolongan) — ت sukun bertemu ط"
                },
                {
                    name: "Idgam Mutamasilain",
                    description: "Dua huruf yang sama dan berdekatan bertemu, huruf pertama sukun. Dilebur sempurna menjadi satu huruf tasydid.",
                    huruf: "Dua huruf identik berurutan",
                    contohArab: "اضْرِب بِّعَصَاكَ",
                    contohLatin: "Idrib bi'ashaaka",
                    contohArti: "(pukulkan tongkatmu) — ب sukun bertemu ب"
                }
            ]
        },
        {
            colorName: "HIJAU",
            title: "Ikhfa",
            arabic: "الْإِخْفَاءُ",
            bgColor: "#10b981",
            textColor: "#ffffff",
            items: [
                {
                    name: "Ikhfa Haqiqi",
                    description: "Nun sukun atau tanwin bertemu salah satu dari 15 huruf ikhfa. Dibaca samar-samar antara idzhar dan idgam, disertai dengung 2 harakat.",
                    huruf: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
                    contohArab: "أَنكَالًا",
                    contohLatin: "Angkaalan",
                    contohArti: "(belenggu-belenggu) — nun sukun bertemu ك"
                },
                {
                    name: "Ikhfa Syafawi",
                    description: "Mim sukun bertemu huruf ba (ب). Dibaca samar-samar pada bibir disertai dengung 2 harakat.",
                    huruf: "ب",
                    contohArab: "تَرْمِيهِم بِحِجَارَةٍ",
                    contohLatin: "Tarmiihim bihijaarah",
                    contohArti: "(melempari mereka dengan batu) — mim sukun bertemu ب"
                },
                {
                    name: "Madd Jaiz Munfasil",
                    description: "Huruf mad (ا و ي) berada di akhir kata dan huruf hamzah berada di awal kata berikutnya. Dibaca panjang 2, 4, atau 5 harakat.",
                    huruf: "ا و ي → ء (beda kata)",
                    contohArab: "يَا أَيُّهَا",
                    contohLatin: "Yaa ayyuhaa",
                    contohArti: "(wahai) — alif mad bertemu hamzah di kata berikutnya"
                },
                {
                    name: "Madd Silah Tawilah",
                    description: "Ha dhamir (ه) yang didahului dan diikuti huruf hidup (bukan sukun/tasydid), bertemu hamzah. Dibaca panjang 4-5 harakat.",
                    huruf: "ه (ha dhamir) + ء",
                    contohArab: "مَالَهُ أَخْلَدَهُ",
                    contohLatin: "Maalahu akhlada",
                    contohArti: "(hartanya mengekalkannya) — ha dhamir bertemu hamzah"
                }
            ]
        },
        {
            colorName: "BIRU/CYAN",
            title: "Iqlab",
            arabic: "الْإِقْلَابُ",
            bgColor: "#0ea5e9",
            textColor: "#ffffff",
            items: [
                {
                    name: "Iqlab",
                    description: "Nun sukun atau tanwin bertemu huruf ba (ب). Cara bacanya: nun/tanwin diubah menjadi mim, lalu dibaca samar (ikhfa) dengan dengung 2 harakat.",
                    huruf: "ب",
                    contohArab: "مِن بَعْدِ",
                    contohLatin: "Mim ba'di",
                    contohArti: "(dari setelah) — nun sukun bertemu ب, dibaca seperti mim"
                },
                {
                    name: "Madd Wajib Muttasil",
                    description: "Huruf mad (ا و ي) bertemu hamzah dalam SATU kata. Hukumnya wajib dibaca panjang 4 atau 5 harakat.",
                    huruf: "ا و ي → ء (satu kata)",
                    contohArab: "جَاءَ",
                    contohLatin: "Jaaa'a",
                    contohArti: "(datang) — alif mad bertemu hamzah dalam satu kata"
                }
            ]
        },
        {
            colorName: "BIRU PEKAT",
            title: "Qalqalah",
            arabic: "الْقَلْقَلَةُ",
            bgColor: "#312e81",
            textColor: "#ffffff",
            items: [
                {
                    name: "Qalqalah Sughra",
                    description: "Huruf qalqalah (ق ط ب ج د) dalam keadaan sukun di TENGAH kata. Dibaca dengan pantulan/memantul ringan.",
                    huruf: "ق ط ب ج د",
                    contohArab: "يَقْطَعُونَ",
                    contohLatin: "Yaqtha'uun",
                    contohArti: "(mereka memutuskan) — ق sukun di tengah kata"
                },
                {
                    name: "Qalqalah Kubra",
                    description: "Huruf qalqalah (ق ط ب ج د) dalam keadaan sukun di AKHIR kata (karena waqaf). Dibaca dengan pantulan lebih kuat dan jelas.",
                    huruf: "ق ط ب ج د",
                    contohArab: "فَلَقٍ",
                    contohLatin: "Falaq",
                    contohArti: "(fajar) — ق sukun di akhir karena waqaf"
                }
            ]
        },
        {
            colorName: "UNGU",
            title: "Gunnah",
            arabic: "الْغُنَّةُ",
            bgColor: "#c026d3",
            textColor: "#ffffff",
            items: [
                {
                    name: "Gunnah (Asli)",
                    description: "Setiap huruf nun (ن) atau mim (م) yang bertasydid wajib dibaca dengan dengung penuh selama 2 harakat.",
                    huruf: "نّ  مّ",
                    contohArab: "إِنَّ",
                    contohLatin: "Inna",
                    contohArti: "(sesungguhnya) — nun tasydid wajib dengung"
                },
                {
                    name: "Idgam Bigunnah",
                    description: "Nun sukun/tanwin bertemu ي ن م و. Dilebur dengan dengung 2 harakat.",
                    huruf: "ي ن م و",
                    contohArab: "مَن يَعْمَلْ",
                    contohLatin: "May ya'mal",
                    contohArti: "(siapa yang beramal) — nun sukun bertemu ي"
                },
                {
                    name: "Idgam Mimi",
                    description: "Mim sukun bertemu mim (م). Mim pertama dilebur ke mim kedua dengan dengung 2 harakat.",
                    huruf: "م → م",
                    contohArab: "لَهُم مَّا",
                    contohLatin: "Lahum maa",
                    contohArti: "(bagi mereka apa) — mim sukun bertemu mim"
                },
                {
                    name: "Madd Farq",
                    description: "Mad yang terjadi karena pertemuan dua hamzah — satu di akhir kata sebelumnya dan satu di awal kata sesudahnya. Dibaca 6 harakat.",
                    huruf: "همزة + همزة",
                    contohArab: "ءَآللَّهُ",
                    contohLatin: "Aaallaah",
                    contohArti: "(apakah Allah...) — khas untuk membedakan kalimat tanya"
                },
                {
                    name: "Madd Lazim Mukhafaf Kilmi",
                    description: "Huruf mad bertemu sukun asli (bukan waqaf) dalam satu kata, dan huruf setelah sukun tidak ditasydid. Dibaca 6 harakat.",
                    huruf: "Mad + sukun asli (ringan)",
                    contohArab: "آلْآنَ",
                    contohLatin: "Aal-aana",
                    contohArti: "(sekarang?) — hanya ada 2 tempat di Al-Qur'an"
                },
                {
                    name: "Madd Lazim Musaqal Kilmi",
                    description: "Huruf mad bertemu huruf yang ditasydid dalam satu kata. Dibaca 6 harakat.",
                    huruf: "Mad + tasydid (satu kata)",
                    contohArab: "وَلَا الضَّالِّينَ",
                    contohLatin: "Wa lad-daalliin",
                    contohArti: "(dan bukan orang yang sesat) — lam mad bertemu ل tasydid"
                },
                {
                    name: "Madd Lazim Harfi Musyabba",
                    description: "Terdapat pada huruf fawatih (pembuka surat) yang cara bacanya mengandung mad dan bertemu sukun. Dibaca 6 harakat.",
                    huruf: "ن ق ص ع س ل ك م",
                    contohArab: "الم",
                    contohLatin: "Alif Laam Miim",
                    contohArti: "(huruf pembuka Surah Al-Baqarah)"
                },
                {
                    name: "Madd Lazim Harfi Mukhafaf",
                    description: "Terdapat pada huruf fawatih yang cara bacanya mengandung mad tetapi tidak bertemu sukun. Dibaca 2 harakat.",
                    huruf: "ح ي ط ه ر",
                    contohArab: "حم",
                    contohLatin: "Haa Miim",
                    contohArti: "(huruf pembuka beberapa surat)"
                }
            ]
        }
    ];
</script>

<div class="screen" in:fade={{duration: 200}}>
    <!-- Header -->
    <header class="app-header">
        <button class="icon-btn" onclick={() => appState.go('lesson')}>
            <i class="ti ti-arrow-left"></i>
        </button>
        <h1 class="page-title">Info Tajwid</h1>
        <div style="width: 40px;"></div>
    </header>

    <!-- Scrollable Content -->
    <main class="tajwid-content">
        <p class="subtitle">Tap setiap hukum untuk melihat penjelasan & contoh</p>

        {#each tajweedCategories as cat, catIdx}
            <div class="tajwid-card" in:fade={{delay: catIdx * 60, duration: 300}}>
                <!-- Category Header (clickable) -->
                <button
                    class="card-header"
                    style="background-color: {cat.bgColor};"
                    onclick={() => toggleCategory(catIdx)}
                    aria-expanded={openCategory === catIdx}
                >
                    <div class="header-text">
                        <span class="color-name">{cat.colorName}</span>
                        <span class="cat-title">{cat.title}</span>
                    </div>
                    <div class="header-right">
                        <span class="arabic-title">{cat.arabic}</span>
                        <i class="ti {openCategory === catIdx ? 'ti-chevron-up' : 'ti-chevron-down'} chevron-icon"></i>
                    </div>
                </button>

                <!-- Category Items (shown when expanded) -->
                {#if openCategory === catIdx}
                    <div class="card-body" transition:slide={{duration: 250}}>
                        {#each cat.items as item, itemIdx}
                            {@const itemKey = `${catIdx}-${itemIdx}`}
                            <div class="list-item-wrapper">
                                <!-- Item Row -->
                                <button
                                    class="list-item"
                                    onclick={() => toggleItem(itemKey)}
                                    aria-expanded={openItem === itemKey}
                                >
                                    <div class="item-left">
                                        <span class="circle-dot" style="border-color: {cat.bgColor};"></span>
                                        <span class="item-name">{item.name}</span>
                                    </div>
                                    <i class="ti {openItem === itemKey ? 'ti-chevron-up' : 'ti-chevron-right'} item-arrow"></i>
                                </button>

                                <!-- Item Detail (shown when expanded) -->
                                {#if openItem === itemKey}
                                    <div class="item-detail" transition:slide={{duration: 220}} style="border-left: 3px solid {cat.bgColor};">
                                        <p class="detail-description">{item.description}</p>

                                        <div class="detail-meta">
                                            <div class="meta-row">
                                                <span class="meta-label">Huruf</span>
                                                <span class="meta-value arabic-inline">{item.huruf}</span>
                                            </div>
                                            <div class="meta-row">
                                                <span class="meta-label">Contoh</span>
                                                <div class="contoh-box" style="border-color: {cat.bgColor}20; background: {cat.bgColor}08;">
                                                    <span class="contoh-arab">{item.contohArab}</span>
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
        {/each}

        <div style="height: 48px;"></div>
    </main>
</div>

<style>
    .screen {
        width: 100%;
        height: 100%;
        background-color: #f1f5f9;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    }

    .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        height: 58px;
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        flex-shrink: 0;
        z-index: 10;
    }

    .icon-btn {
        background: none;
        border: none;
        font-size: 22px;
        color: #334155;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background 0.18s;
    }
    .icon-btn:hover { background: #f1f5f9; }

    .page-title {
        font-size: 17px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
    }

    .tajwid-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 14px;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .subtitle {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
        margin: 0 0 4px 0;
        letter-spacing: 0.2px;
    }

    /* ── CARD ── */
    .tajwid-card {
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    /* ── CATEGORY HEADER ── */
    .card-header {
        width: 100%;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
        cursor: pointer;
        border: none;
        text-align: left;
        transition: filter 0.15s;
    }
    .card-header:hover { filter: brightness(1.08); }

    .header-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .color-name {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        opacity: 0.85;
        text-transform: uppercase;
    }
    .cat-title {
        font-size: 17px;
        font-weight: 800;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .arabic-title {
        font-family: 'Amiri', 'Scheherazade New', serif;
        font-size: 24px;
        font-weight: 700;
        text-shadow: 0 1px 4px rgba(0,0,0,0.18);
    }
    .chevron-icon {
        font-size: 16px;
        opacity: 0.9;
    }

    /* ── ITEM LIST ── */
    .card-body {
        padding: 0 16px;
    }

    .list-item-wrapper { }

    .list-item {
        width: 100%;
        background: none;
        border: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 0;
        cursor: pointer;
        text-align: left;
        transition: opacity 0.15s;
    }
    .list-item:hover { opacity: 0.65; }

    .item-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .circle-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid #cbd5e1;
        background: transparent;
        flex-shrink: 0;
    }

    .item-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #374151;
    }

    .item-arrow {
        font-size: 15px;
        color: #cbd5e1;
        flex-shrink: 0;
    }

    /* ── ITEM DETAIL ── */
    .item-detail {
        margin: 0 0 10px 22px;
        padding: 12px 14px;
        border-radius: 10px;
        background: #f8fafc;
    }

    .detail-description {
        font-size: 12.5px;
        line-height: 1.65;
        color: #475569;
        margin: 0 0 12px 0;
    }

    .detail-meta {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .meta-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .meta-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: #94a3b8;
    }

    .meta-value {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
    }

    .arabic-inline {
        font-family: 'Amiri', 'Scheherazade New', serif;
        font-size: 18px !important;
        line-height: 1.4;
        direction: rtl;
    }

    .contoh-box {
        border: 1.5px solid;
        border-radius: 10px;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .contoh-arab {
        font-family: 'Amiri', 'Scheherazade New', serif;
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        text-align: right;
        direction: rtl;
        line-height: 1.6;
    }

    .contoh-latin {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        font-style: italic;
    }

    .contoh-arti {
        font-size: 11.5px;
        font-weight: 500;
        color: #94a3b8;
        line-height: 1.5;
    }

    .divider {
        height: 1px;
        background-color: #f1f5f9;
    }
</style>
