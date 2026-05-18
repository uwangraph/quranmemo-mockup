export const tajweedCategories = [
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
                    contohArab: "مَ<span style='color: #555555; font-weight: 800;'>نْ</span> آمَنَ",
                    contohLatin: "Man aamana",
                    contohArti: "(siapa yang beriman) — nun sukun bertemu ء"
                },
                {
                    name: "Idzhar Syafawi",
                    description: "Mim sukun bertemu huruf selain mim (م) dan ba (ب). Cara membacanya terang tanpa dengung pada bibir.",
                    huruf: "Semua huruf kecuali م dan ب",
                    contohArab: "هُ<span style='color: #555555; font-weight: 800;'>مْ</span> فِيهَا",
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
                    contohArab: "مِ<span style='color: #ef4444; font-weight: 800;'>ن رَّ</span>بِّهِمْ",
                    contohLatin: "Mir rabbihim",
                    contohArti: "(dari Tuhan mereka) — nun sukun bertemu ر"
                },
                {
                    name: "Idgam Bigunnah",
                    description: "Nun sukun atau tanwin bertemu huruf ي ن م و. Dibaca lebur/masuk dengan dengung 2 harakat.",
                    huruf: "ي ن م و",
                    contohArab: "مَ<span style='color: #ef4444; font-weight: 800;'>ن يَ</span>قُولُ",
                    contohLatin: "May yaquulu",
                    contohArti: "(siapa yang berkata) — nun sukun bertemu ي"
                },
                {
                    name: "Idgam Mutaqaribain",
                    description: "Dua huruf yang berdekatan makhrajnya bertemu dan salah satunya sukun, dilebur menjadi satu dengan tasydid.",
                    huruf: "Contoh: ق → ك",
                    contohArab: "أَلَمْ نَخْلُ<span style='color: #ef4444; font-weight: 800;'>قكُّ</span>م",
                    contohLatin: "Alam nakhlukkum",
                    contohArti: "(bukankah Kami telah menciptakanmu) — ق sukun bertemu ك"
                },
                {
                    name: "Idgam Mutajanisain",
                    description: "Dua huruf yang sama makhrajnya namun berbeda sifatnya bertemu, huruf pertama sukun dilebur ke huruf kedua.",
                    huruf: "Contoh: ت → ط ,د → ت",
                    contohArab: "قَالَ<span style='color: #ef4444; font-weight: 800;'>ت طَّ</span>ائِفَةٌ",
                    contohLatin: "Qaalat thaaa'ifah",
                    contohArti: "(berkata segolongan) — ت sukun bertemu ط"
                },
                {
                    name: "Idgam Mutamasilain",
                    description: "Dua huruf yang sama dan berdekatan bertemu, huruf pertama sukun. Dilebur sempurna menjadi satu huruf tasydid.",
                    huruf: "Dua huruf identik berurutan",
                    contohArab: "اضْرِ<span style='color: #ef4444; font-weight: 800;'>ب بِّ</span>عَصَاكَ",
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
                    contohArab: "أَ<span style='color: #10b981; font-weight: 800;'>نكَا</span>لًا",
                    contohLatin: "Angkaalan",
                    contohArti: "(belenggu-belenggu) — nun sukun bertemu ك"
                },
                {
                    name: "Ikhfa Syafawi",
                    description: "Mim sukun bertemu huruf ba (ب). Dibaca samar-samar pada bibir disertai dengung 2 harakat.",
                    huruf: "ب",
                    contohArab: "تَرْمِيهِ<span style='color: #10b981; font-weight: 800;'>م بِ</span>حِجَارَةٍ",
                    contohLatin: "Tarmiihim bihijaarah",
                    contohArti: "(melempari mereka dengan batu) — mim sukun bertemu ب"
                },
                {
                    name: "Madd Jaiz Munfasil",
                    description: "Huruf mad (ا و ي) berada di akhir kata dan huruf hamzah berada di awal kata berikutnya. Dibaca panjang 2, 4, atau 5 harakat.",
                    huruf: "ا و ي → ء (beda kata)",
                    contohArab: "يَ<span style='color: #10b981; font-weight: 800;'>ا أ</span>َيُّهَا",
                    contohLatin: "Yaa ayyuhaa",
                    contohArti: "(wahai) — alif mad bertemu hamzah di kata berikutnya"
                },
                {
                    name: "Madd Silah Tawilah",
                    description: "Ha dhamir (ه) yang didahului dan diikuti huruf hidup (bukan sukun/tasydid), bertemu hamzah. Dibaca panjang 4-5 harakat.",
                    huruf: "ه (ha dhamir) + ء",
                    contohArab: "مَالَهُ<span style='color: #10b981; font-weight: 800;'>و أ</span>َخْلَدَهُ",
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
                    contohArab: "مِ<span style='color: #0ea5e9; font-weight: 800;'>ن بَ</span>عْدِ",
                    contohLatin: "Mim ba'di",
                    contohArti: "(dari setelah) — nun sukun bertemu ب, dibaca seperti mim"
                },
                {
                    name: "Madd Wajib Muttasil",
                    description: "Huruf mad (ا و ي) bertemu hamzah dalam SATU kata. Hukumnya wajib dibaca panjang 4 atau 5 harakat.",
                    huruf: "ا و ي → ء (satu kata)",
                    contohArab: "جَ<span style='color: #0ea5e9; font-weight: 800;'>اءَ</span>",
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
                    contohArab: "يَ<span style='color: #1e1b4b; font-weight: 800;'>قْ</span>طَعُونَ",
                    contohLatin: "Yaqtha'uun",
                    contohArti: "(mereka memutuskan) — ق sukun di tengah kata"
                },
                {
                    name: "Qalqalah Kubra",
                    description: "Huruf qalqalah (ق ط ب ج د) dalam keadaan sukun di AKHIR kata (karena waqaf). Dibaca dengan pantulan lebih kuat dan jelas.",
                    huruf: "ق ط ب ج د",
                    contohArab: "فَلَ<span style='color: #1e1b4b; font-weight: 800;'>قٍ</span>",
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
                    contohArab: "إِ<span style='color: #d946ef; font-weight: 800;'>نَّ</span>",
                    contohLatin: "Inna",
                    contohArti: "(sesungguhnya) — nun tasydid wajib dengung"
                },
                {
                    name: "Idgam Bigunnah",
                    description: "Nun sukun/tanwin bertemu ي ن م و. Dilebur dengan dengung 2 harakat.",
                    huruf: "ي ن م و",
                    contohArab: "مَ<span style='color: #d946ef; font-weight: 800;'>ن يَعْ</span>مَلْ",
                    contohLatin: "May ya'mal",
                    contohArti: "(siapa yang beramal) — nun sukun bertemu ي"
                },
                {
                    name: "Idgam Mimi",
                    description: "Mim sukun bertemu mim (م). Mim pertama dilebur ke mim kedua dengan dengung 2 harakat.",
                    huruf: "م → م",
                    contohArab: "لَهُ<span style='color: #d946ef; font-weight: 800;'>م مَّ</span>ا",
                    contohLatin: "Lahum maa",
                    contohArti: "(bagi mereka apa) — mim sukun bertemu mim"
                },
                {
                    name: "Madd Farq",
                    description: "Mad yang terjadi karena pertemuan dua hamzah — satu di akhir kata sebelumnya dan satu di awal kata sesudahnya. Dibaca 6 harakat.",
                    huruf: "همزة + همزة",
                    contohArab: "ءَ<span style='color: #d946ef; font-weight: 800;'>آل</span>لَّهُ",
                    contohLatin: "Aaallaah",
                    contohArti: "(apakah Allah...) — khas untuk membedakan kalimat tanya"
                },
                {
                    name: "Madd Lazim Mukhafaf Kilmi",
                    description: "Huruf mad bertemu sukun asli (bukan waqaf) dalam satu kata, dan huruf setelah sukun tidak ditasydid. Dibaca 6 harakat.",
                    huruf: "Mad + sukun asli (ringan)",
                    contohArab: "<span style='color: #d946ef; font-weight: 800;'>آلْ</span>آنَ",
                    contohLatin: "Aal-aana",
                    contohArti: "(sekarang?) — hanya ada 2 tempat di Al-Qur'an"
                },
                {
                    name: "Madd Lazim Musaqal Kilmi",
                    description: "Huruf mad bertemu huruf yang ditasydid dalam satu kata. Dibaca 6 harakat.",
                    huruf: "Mad + tasydid (satu kata)",
                    contohArab: "وَلَا ال<span style='color: #d946ef; font-weight: 800;'>ضَّالِّ</span>ينَ",
                    contohLatin: "Wa lad-daalliin",
                    contohArti: "(dan bukan orang yang sesat) — lam mad bertemu ل tasydid"
                },
                {
                    name: "Madd Lazim Harfi Musyabba",
                    description: "Terdapat pada huruf fawatih (pembuka surat) yang cara bacanya mengandung mad dan bertemu sukun. Dibaca 6 harakat.",
                    huruf: "ن ق ص ع س ل ك م",
                    contohArab: "ال<span style='color: #d946ef; font-weight: 800;'>م</span>",
                    contohLatin: "Alif Laam Miim",
                    contohArti: "(huruf pembuka Surah Al-Baqarah)"
                },
                {
                    name: "Madd Lazim Harfi Mukhafaf",
                    description: "Terdapat pada huruf fawatih yang cara bacanya mengandung mad tetapi tidak bertemu sukun. Dibaca 2 harakat.",
                    huruf: "ح ي ط ه ر",
                    contohArab: "<span style='color: #d946ef; font-weight: 800;'>ح</span>م",
                    contohLatin: "Haa Miim",
                    contohArti: "(huruf pembuka beberapa surat)"
                }
            ]
        }
    ];
