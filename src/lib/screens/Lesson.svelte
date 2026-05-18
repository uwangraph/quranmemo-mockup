<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    // Al-Insyirah Verses Data (1 to 8)
    const alInsyirahVerses = [
        {
            verseNumber: 1,
            arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
            translation: "Bukankah Kami telah melapangkan dadamu (untukmu)?",
            transliteration: "Alam nashrah laka shadrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094001.mp3",
            words: ["أَلَمْ", "نَشْرَحْ", "لَكَ", "صَدْرَكَ"],
            frontBlank: "___ ___ لَكَ صَدْرَكَ",
            frontCorrect: "أَلَمْ نَشْرَحْ",
            frontChoices: ["أَلَمْ نَشْرَحْ", "وَوَضَعْنَا عَنكَ", "فَإِذَا فَرَغْتَ"],
            endBlank: "أَلَمْ نَشْرَحْ لَكَ ___",
            endCorrect: "صَدْرَكَ",
            endChoices: ["وِزْرَكَ", "صَدْرَكَ", "ظَهْرَكَ"],
            middleBlank: "أَلَمْ ___ لَكَ صَدْرَكَ",
            middleCorrect: "نَشْرَحْ",
            middleChoices: ["عَنكَ", "نَشْرَحْ", "وِزْرَكَ"],
            twoBlank: "أَلَمْ ___ ___ صَدْرَكَ",
            twoCorrect: ["نَشْرَحْ", "لَكَ"],
            twoChoices: ["عَنكَ", "لَكَ", "نَشْرَحْ", "وِزْرَكَ"]
        },
        {
            verseNumber: 2,
            arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ",
            translation: "dan Kami pun telah menurunkan bebanmu darimu,",
            transliteration: "Wa wadha'na 'anka wizrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094002.mp3",
            words: ["وَوَضَعْنَا", "عَنكَ", "وِزْرَكَ"],
            frontBlank: "___ ___ وِزْرَكَ",
            frontCorrect: "وَوَضَعْنَا عَنكَ",
            frontChoices: ["وَوَضَعْنَا عَنكَ", "أَلَمْ نَشْرَحْ", "ٱلَّذِىٓ أَنقَضَ"],
            endBlank: "وَوَضَعْنَا عَنكَ ___",
            endCorrect: "وِزْرَكَ",
            endChoices: ["صَدْرَكَ", "وِزْرَكَ", "ظَهْرَكَ"],
            middleBlank: "وَوَضَعْنَا ___ وِزْرَكَ",
            middleCorrect: "عَنكَ",
            middleChoices: ["لَكَ", "عَنكَ", "مَعَ"],
            twoBlank: "___ ___ وِزْرَكَ",
            twoCorrect: ["وَوَضَعْنَا", "عَنكَ"],
            twoChoices: ["وَوَضَعْنَا", "عَنكَ", "أَلَمْ", "نَشْرَحْ"]
        },
        {
            verseNumber: 3,
            arabic: "ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ",
            translation: "yang memberatkan punggungmu,",
            transliteration: "Alladzi anqadha zhahrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094003.mp3",
            words: ["ٱلَّذِىٓ", "أَنقَضَ", "ظَهْرَكَ"],
            frontBlank: "___ ___ ظَهْرَكَ",
            frontCorrect: "ٱلَّذِىٓ أَنقَضَ",
            frontChoices: ["ٱلَّذِىٓ أَنقَضَ", "وَوَضَعْنَا عَنكَ", "فَإِنَّ مَعَ"],
            endBlank: "ٱلَّذِىٓ أَنقَضَ ___",
            endCorrect: "ظَهْرَكَ",
            endChoices: ["وِزْرَكَ", "صَدْرَكَ", "ظَهْرَكَ"],
            middleBlank: "ٱلَّذِىٓ ___ ظَهْرَكَ",
            middleCorrect: "أَنقَضَ",
            middleChoices: ["أَنقَضَ", "فَرَغْتَ", "عَنكَ"],
            twoBlank: "___ ___ ظَهْرَكَ",
            twoCorrect: ["ٱلَّذِىٓ", "أَنقَضَ"],
            twoChoices: ["ٱلَّذِىٓ", "أَنقَضَ", "وَوَضَعْنَا", "صَدْرَكَ"]
        },
        {
            verseNumber: 4,
            arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ",
            translation: "dan Kami tinggikan sebutan (nama)mu bagimu.",
            transliteration: "Wa rafa'na laka dzikrak",
            audio: "https://everyayah.com/data/Husary_128kbps/094004.mp3",
            words: ["وَرَفَعْنَا", "لَكَ", "ذِكْرَكَ"],
            frontBlank: "___ ___ ذِكْرَكَ",
            frontCorrect: "وَرَفَعْنَا لَكَ",
            frontChoices: ["وَرَفَعْنَا لَكَ", "فَإِنَّ مَعَ", "وَوَضَعْنَا عَنكَ"],
            endBlank: "وَرَفَعْنَا لَكَ ___",
            endCorrect: "ذِكْرَكَ",
            endChoices: ["وِزْرَكَ", "ذِكْرَكَ", "يُسْرًا"],
            middleBlank: "وَرَفَعْنَا ___ ذِكْرَكَ",
            middleCorrect: "لَكَ",
            middleChoices: ["عَنكَ", "لَكَ", "مَعَ"],
            twoBlank: "___ ___ ذِكْرَكَ",
            twoCorrect: ["وَرَفَعْنَا", "لَكَ"],
            twoChoices: ["وَرَفَعْنَا", "لَكَ", "ٱلَّذِىٓ", "أَنقَضَ"]
        },
        {
            verseNumber: 5,
            arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            translation: "Maka sesungguhnya beserta kesulitan ada kemudahan,",
            transliteration: "Fa inna ma'al 'usri yusra",
            audio: "https://everyayah.com/data/Husary_128kbps/094005.mp3",
            words: ["فَإِنَّ", "مَعَ", "ٱلْعُسْرِ", "يُسْرًا"],
            frontBlank: "___ ___ ٱلْعُسْرِ يُسْرًا",
            frontCorrect: "فَإِنَّ مَعَ",
            frontChoices: ["فَإِنَّ مَعَ", "إِنَّ مَعَ", "أَلَمْ نَشْرَحْ"],
            endBlank: "فَإِنَّ مَعَ ٱلْعُسْرِ ___",
            endCorrect: "يُسْرًا",
            endChoices: ["يُسْرًا", "وِزْرَكَ", "فَٱنصَبْ"],
            middleBlank: "فَإِنَّ مَعَ ___ يُسْرًا",
            middleCorrect: "ٱلْعُسْرِ",
            middleChoices: ["رَبِّكَ", "ٱلْعُسْرِ", "صَدْرَكَ"],
            twoBlank: "فَإِنَّ ___ ___ يُسْرًا",
            twoCorrect: ["مَعَ", "ٱلْعُسْرِ"],
            twoChoices: ["مَعَ", "ٱلْعُسْرِ", "لَكَ", "عَنكَ"]
        },
        {
            verseNumber: 6,
            arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            translation: "sesungguhnya beserta kesulitan ada kemudahan.",
            transliteration: "Inna ma'al 'usri yusra",
            audio: "https://everyayah.com/data/Husary_128kbps/094006.mp3",
            words: ["إِنَّ", "مَعَ", "ٱلْعُسْرِ", "يُسْرًا"],
            frontBlank: "___ ___ ٱلْعُسْرِ يُسْرًا",
            frontCorrect: "إِنَّ مَعَ",
            frontChoices: ["إِنَّ مَعَ", "فَإِنَّ مَعَ", "وَإِلَىٰ رَبِّكَ"],
            endBlank: "إِنَّ مَعَ ٱلْعُسْرِ ___",
            endCorrect: "يُسْرًا",
            endChoices: ["يُسْرًا", "فَٱنصَبْ", "وِزْرَكَ"],
            middleBlank: "إِنَّ مَعَ ___ يُسْرًا",
            middleCorrect: "ٱلْعُسْرِ",
            middleChoices: ["ٱلْعُسْرِ", "رَبِّكَ", "لَكَ"],
            twoBlank: "إِنَّ ___ ___ يُسْرًا",
            twoCorrect: ["مَعَ", "ٱلْعُسْرِ"],
            twoChoices: ["مَعَ", "ٱلْعُسْرِ", "عَنكَ", "فَرَغْتَ"]
        },
        {
            verseNumber: 7,
            arabic: "فَإِذَا فَرَغْتَ فَٱنصَبْ",
            translation: "Maka apabila engkau telah selesai (dari sesuatu urusan), tetaplah bekerja keras (untuk urusan yang lain),",
            transliteration: "Fa idza faraghta fanshab",
            audio: "https://everyayah.com/data/Husary_128kbps/094007.mp3",
            words: ["فَإِذَا", "فَرَغْتَ", "فَٱنصَبْ"],
            frontBlank: "___ ___ فَٱنصَبْ",
            frontCorrect: "فَإِذَا فَرَغْتَ",
            frontChoices: ["فَإِذَا فَرَغْتَ", "وَإِلَىٰ رَبِّكَ", "وَوَضَعْنَا عَنكَ"],
            endBlank: "فَإِذَا فَرَغْتَ ___",
            endCorrect: "فَٱنصَبْ",
            endChoices: ["فَٱرْغَبْ", "فَٱنصَبْ", "صَدْرَكَ"],
            middleBlank: "فَإِذَا ___ فَٱنصَبْ",
            middleCorrect: "فَرَغْتَ",
            middleChoices: ["أَنقَضَ", "فَرَغْتَ", "مَعَ"],
            twoBlank: "___ ___ فَٱنصَبْ",
            twoCorrect: ["فَإِذَا", "فَرَغْتَ"],
            twoChoices: ["فَإِذَا", "فَرَغْتَ", "إِنَّ", "وَإِلَىٰ"]
        },
        {
            verseNumber: 8,
            arabic: "وَإِلَىٰ رَبِّكَ فَٱرْغَبْ",
            translation: "dan hanya kepada Tuhanmulah engkau berharap.",
            transliteration: "Wa ila rabbika farghab",
            audio: "https://everyayah.com/data/Husary_128kbps/094008.mp3",
            words: ["وَإِلَىٰ", "رَبِّكَ", "فَٱرْغَبْ"],
            frontBlank: "___ ___ فَٱرْغَبْ",
            frontCorrect: "وَإِلَىٰ رَبِّكَ",
            frontChoices: ["وَإِلَىٰ رَبِّكَ", "فَإِذَا فَرَغْتَ", "وَوَضَعْنَا عَنكَ"],
            endBlank: "وَإِلَىٰ رَبِّكَ ___",
            endCorrect: "فَٱرْغَبْ",
            endChoices: ["فَٱنصَبْ", "فَٱرْغَبْ", "يُسْرًا"],
            middleBlank: "وَإِلَىٰ ___ فَٱرْغَبْ",
            middleCorrect: "رَبِّكَ",
            middleChoices: ["عَنكَ", "رَبِّكَ", "لَكَ"],
            twoBlank: "___ ___ فَٱرْغَبْ",
            twoCorrect: ["وَإِلَىٰ", "رَبِّكَ"],
            twoChoices: ["وَإِلَىٰ", "رَبِّكَ", "فَإِذَا", "فَرَغْتَ"]
        }
    ];

    // State Variables bound to appState selectedVerseIndex
    const selectedVerseIndex = $derived(appState.selectedVerseIndex);
    let currentStep = $state(0); // 0 to 9 (corresponds to steps 1 to 10)
    let isPlaying = $state(false);
    let currentWordIndex = $state(-1);
    let selectedOptionIdx = $state(null);
    let isChecked = $state(false);
    let isCorrect = $state(false);

    // Audio & Voice Recording States
    let audio = null;
    let recordState = $state('idle'); // 'idle', 'recording', 'recorded'
    let isComparing = $state(false);
    let simulatedWaves = $state([]);
    let waveInterval = null;
    
    // Real Audio Recording States
    let mediaRecorder = null;
    let audioChunks = [];
    let recordedAudioUrl = $state(null);
    let recordedAudio = $state(null);
    let isPlayingRecorded = $state(false);

    // Scramble / Word Selection states
    let scrambledWords = $state([]);
    let selectedWords = $state([]);
    let showCompletion = $state(false);
    
    let lessonEarnedXP = $state(0);
    let lessonEarnedCoins = $state(0);

    // === ANIMASI & SOUND EFFECTS ===
    let showConfetti = $state(false);
    let confettiParticles = $state([]);
    let feedbackAnimClass = $state(''); // 'anim-correct' | 'anim-wrong'
    let screenShaking = $state(false);

    // Web Audio API - generate suara tanpa file MP3 eksternal
    function playCorrectSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            // 1. Fast sweep rise (pop laser impact)
            const oscPop = ctx.createOscillator();
            const gainPop = ctx.createGain();
            oscPop.connect(gainPop);
            gainPop.connect(ctx.destination);
            oscPop.type = 'sine';
            oscPop.frequency.setValueAtTime(300, now);
            oscPop.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
            gainPop.gain.setValueAtTime(0.3, now);
            gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            oscPop.start(now);
            oscPop.stop(now + 0.09);

            // 2. Sparkling Arpeggio notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const startTime = now + idx * 0.06;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
                
                osc.start(startTime);
                osc.stop(startTime + 0.4);
            });

            // 3. Final triumphant chords with Vibrato (LFO)
            const finalChord = [1046.50, 1318.51, 1567.98]; // C6, E6, G6
            finalChord.forEach((freq) => {
                const startTime = now + 0.24;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                // Vibrato LFO
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();
                lfo.frequency.value = 16; // 16Hz vibrato shimmer
                lfoGain.gain.value = 15;  // depth of pitch modulation
                
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.85);
                
                lfo.start(startTime);
                osc.start(startTime);
                lfo.stop(startTime + 0.9);
                osc.stop(startTime + 0.9);
            });

        } catch(e) {
            console.error(e);
        }
    }

    function playWrongSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;

            // 1. Springy Boing impact
            const oscSpring = ctx.createOscillator();
            const gainSpring = ctx.createGain();
            oscSpring.connect(gainSpring);
            gainSpring.connect(ctx.destination);
            oscSpring.type = 'triangle';
            
            // Fast spring frequency wobble: 320Hz -> 80Hz in 0.22s
            oscSpring.frequency.setValueAtTime(320, now);
            oscSpring.frequency.exponentialRampToValueAtTime(80, now + 0.22);
            
            // Tremolo / wobble gain using LFO
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 22; // 22Hz fast wobble
            lfoGain.gain.value = 0.15;
            lfo.connect(lfoGain);
            lfoGain.connect(gainSpring.gain);
            
            gainSpring.gain.setValueAtTime(0.35, now);
            gainSpring.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            
            lfo.start(now);
            oscSpring.start(now);
            lfo.stop(now + 0.23);
            oscSpring.stop(now + 0.23);

            // 2. Cartoon "Wah-Wah-Wah" descending wobbly slides
            const wahNotes = [220, 180, 140]; // descending pitches
            wahNotes.forEach((freq, idx) => {
                const startTime = now + 0.15 + idx * 0.1;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                // Tremolo LFO for cartoon vibe
                const lfoWah = ctx.createOscillator();
                const lfoGainWah = ctx.createGain();
                lfoWah.frequency.value = 14; // 14Hz tremolo
                lfoGainWah.gain.value = 8;   // pitch vibrato
                
                lfoWah.connect(lfoGainWah);
                lfoGainWah.connect(osc.frequency);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, startTime);
                osc.frequency.exponentialRampToValueAtTime(freq - 40, startTime + 0.15); // pitch slide
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
                
                lfoWah.start(startTime);
                osc.start(startTime);
                lfoWah.stop(startTime + 0.2);
                osc.stop(startTime + 0.2);
            });

        } catch(e) {
            console.error(e);
        }
    }

    function spawnConfetti() {
        const colors = ['#00978A', '#10B981', '#FFD700', '#FF6B6B', '#A78BFA', '#38BDF8', '#FB923C', '#F472B6'];
        const shapes = ['circle', 'square', 'triangle', 'star'];
        const particles = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            size: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            rotation: Math.random() * 360,
            speedX: (Math.random() - 0.5) * 3,
            speedY: 2 + Math.random() * 4,
            rotSpeed: (Math.random() - 0.5) * 8,
            opacity: 1
        }));
        confettiParticles = particles;
        showConfetti = true;
        // Auto-clear setelah 2.5 detik
        setTimeout(() => {
            showConfetti = false;
            confettiParticles = [];
        }, 2500);
    }

    let showSparkles = $state(false);
    let sparkleParticles = $state([]);

    function spawnSparkles() {
        const icons = ['✨', '⭐', '🌟', '💫', '🌸', '🎈'];
        const particles = Array.from({ length: 24 }, (_, i) => {
            const angle = (i * (360 / 24)) * (Math.PI / 180); // convert to radians
            const distance = 90 + Math.random() * 110;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            return {
                id: i,
                tx: tx.toFixed(1),
                ty: ty.toFixed(1),
                icon: icons[Math.floor(Math.random() * icons.length)],
                size: 16 + Math.random() * 18,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                delay: Math.random() * 0.1
            };
        });
        sparkleParticles = particles;
        showSparkles = true;
        setTimeout(() => {
            showSparkles = false;
            sparkleParticles = [];
        }, 1600);
    }

    function triggerCorrect() {
        playCorrectSound();
        spawnConfetti();
        spawnSparkles();
        feedbackAnimClass = 'anim-correct';
        setTimeout(() => feedbackAnimClass = '', 800);
    }

    function triggerWrong() {
        playWrongSound();
        feedbackAnimClass = 'anim-wrong';
        screenShaking = true;
        setTimeout(() => {
            screenShaking = false;
            feedbackAnimClass = '';
        }, 600);
    }

    // === LOOPER & PER-WORD AUDIO STATE ===
    let loopTimes = $state(1); // 1x, 2x, 3x, 5x
    let currentLoopIndex = $state(0);

    // Audio per kata - menggunakan Web Speech API Saudi Arabian Arabic
    function playWordAudio(wordText) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // batalkan audio kata yang sedang jalan
            
            // Haptic vibration feedback ringan jika didukung browser
            if (navigator.vibrate) {
                navigator.vibrate(25);
            }

            const utterance = new SpeechSynthesisUtterance(wordText);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.55; // Kecepatan pelan agar pelafalan huruf & makhraj sangat presisi
            utterance.pitch = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            const arVoice = voices.find(voice => voice.lang.startsWith('ar') || voice.lang.includes('SA'));
            if (arVoice) {
                utterance.voice = arVoice;
            }
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback nada synthesizer Web Audio API jika Speech Synthesis tidak aktif
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440 + Math.random() * 200, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            } catch(e) {}
        }
    }

    // Tajwid diberi warna (Mushaf Tajwid Standar Kemenag)
    function getTajweedHTML(word) {
        const tajweedMap = {
            // Ayat 1
            "أَلَمْ": `أَلَمْ`,
            "نَشْرَحْ": `نَشْرَحْ`,
            "لَكَ": `لَكَ`,
            "صَدْرَكَ": `صَ<span class="tajweed-qalqalah">دْ</span>رَكَ`,
            
            // Ayat 2
            "وَوَضَعْنَا": `وَوَضَعْ<span class="tajweed-mad">نَا</span>`,
            "عَنكَ": `عَ<span class="tajweed-ikhfa">نكَ</span>`,
            "وِزْرَكَ": `وِزْرَكَ`,
            
            // Ayat 3
            "ٱلَّذِىٓ": `ٱلَّذِ<span class="tajweed-mad">ىٓ</span>`,
            "أَنقَضَ": `أَ<span class="tajweed-ikhfa">نقَ</span>ضَ`,
            "ظَهْرَكَ": `ظَهْرَكَ`,
            
            // Ayat 4
            "وَرَفَعْنَا": `وَرَفَعْ<span class="tajweed-mad">نَا</span>`,
            "لَكَ": `لَكَ`,
            "ذِكْرَكَ": `ذِكْرَكَ`,
            
            // Ayat 5 & 6
            "فَإِنَّ": `فَإِ<span class="tajweed-ghunnah">نَّ</span>`,
            "إِنَّ": `إِ<span class="tajweed-ghunnah">نَّ</span>`,
            "مَعَ": `مَعَ`,
            "ٱلْعُسْرِ": `ٱلْعُسْرِ`,
            "يُسْرًا": `يُسْ<span class="tajweed-mad">رًا</span>`,
            
            // Ayat 7
            "فَإِذَا": `فَإِ<span class="tajweed-mad">ذَا</span>`,
            "فَرَغْتَ": `فَرَغْتَ`,
            "فَٱنصَبْ": `فَ<span class="tajweed-ikhfa">ٱنصَ</span><span class="tajweed-qalqalah">بْ</span>`,
            
            // Ayat 8
            "وَإِلَىٰ": `وَإِ<span class="tajweed-mad">لَىٰ</span>`,
            "رَبِّكَ": `رَبِّكَ`,
            "فَٱرْغَبْ": `فَٱرْغَ<span class="tajweed-qalqalah">بْ</span>`
        };
        return tajweedMap[word] || word;
    }

    // New Recall states
    let recallMethod = $state('voice'); // 'voice' or 'mushaf'
    let recallSelectedOptionIdx = $state(null);

    // Dynamic derivation of active verse
    const activeVerse = $derived(selectedVerseIndex !== null ? alInsyirahVerses[selectedVerseIndex] : null);

    // Dynamic Steps Pipeline based on the active verse index
    const stepsPipeline = $derived.by(() => {
        const baseSteps = [
            { id: 1, stage: 1, title: "1. Lihat & Dengar", type: "read_listen", desc: "Perhatikan lafal ayat, dengerin qari secara saksama, lalu ulangi berkali-kali sampai lancar!" },
            { id: 2, stage: 1, title: "2. Tiru & Ikuti", type: "listen_repeat", desc: "Dengarkan lantunan ayat qari, lalu ikuti pelafalannya dengan suara lantang." },
            { id: 3, stage: 1, title: "3. Rekam & Bandingkan", type: "record_compare", desc: "Dengarkan ayat, rekam suaramu sendiri, lalu bandingkan dengan pelafalan qari untuk mengoreksi tajwid." },
            { id: 4, stage: 2, title: "4. Mushaf segmentasi - Hilang di depan", type: "fill_front", desc: "Memori Mushaf! Tebak dan lengkapi bagian awal ayat yang sengaja dihilangkan." },
            { id: 5, stage: 2, title: "5. Mushaf segmentasi - Hilang di belakang", type: "fill_back", desc: "Memori Visual! Tebak dan lengkapi kata di bagian paling belakang ayat ini." },
            { id: 6, stage: 2, title: "6. Audio to text - Susun kata", type: "audio_scramble", desc: "Dengarkan lantunan potongan ayat, lalu susun kata-kata acak di bawah menjadi urutan yang benar." },
            { id: 7, stage: 3, title: "7. Puzzle 01 - 1 kata hilang", type: "puzzle_one", desc: "Uji ketelitian! Satu kata di bagian tengah hilang, pilih opsi yang tepat untuk melengkapinya." },
            { id: 8, stage: 3, title: "8. Puzzle 02 - 2 kata hilang", type: "puzzle_two", desc: "Tantangan menengah! Dua kata hilang di tengah ayat, pilih kedua kata secara berurutan." },
            { id: 9, stage: 3, title: "9. Puzzle 03 - Semua kata hilang", type: "puzzle_total", desc: "Tantangan akhir! Semua kata diacak secara total. Susun kembali menjadi ayat yang utuh tanpa bantuan." },
            { id: 10, stage: 3, title: "10. One Ayat!", type: "setor_full", desc: "Ujian Kelulusan! Setor hafalan ayat ini sepenuhnya lewat mic tanpa bantuan teks atau audio visual!" }
        ];

        let pipeline = [];

        // 🔹 0. RECALL (Sebelum mulai ayat baru) - hanya jika selectedVerseIndex > 0
        if (selectedVerseIndex > 0) {
            pipeline.push({
                id: 0,
                stage: 0,
                title: "0. RECALL (Sebelum Mulai)",
                type: "recall_prev",
                desc: "Sebelum mulai ayat baru, yuk ulang ayat sebelumnya dengan salah satu metode agar ingatanmu tetap segar!"
            });
        }

        // Add STAGE 1, 2, 3
        pipeline.push(...baseSteps);

        // 🔹 11. RECALL (Setelah satu ayat hafal)
        pipeline.push({
            id: 11,
            stage: 4,
            title: "11. RECALL - Level 1",
            type: "recall_level1",
            desc: "Mantap! Yuk setor (baca dari hafalan) ayat baru yang baru saja kamu selesaikan."
        });

        if (selectedVerseIndex > 0) {
            pipeline.push({
                id: 12,
                stage: 4,
                title: "11. RECALL - Level 2",
                type: "recall_level2",
                desc: "Ujian Sempurna! Sambungkan dan setor ayat sebelumnya + ayat baru secara berurutan."
            });
        }

        return pipeline;
    });

    const currentStepConfig = $derived(stepsPipeline[currentStep]);

    // Automatically trigger setup when selectedVerseIndex from roadmap changes
    $effect(() => {
        if (selectedVerseIndex !== null && selectedVerseIndex !== undefined) {
            currentStep = 0;
            isChecked = false;
            isCorrect = false;
            selectedOptionIdx = null;
            selectedWords = [];
            showCompletion = false;
            recordState = 'idle';
            isComparing = false;
            setupAudio();
            setupScramble();
        }
        return () => {
            if (audio) audio.pause();
            clearInterval(waveInterval);
        };
    });

    let animationFrameId = null;

    function updateHighlight() {
        if (!isPlaying || !audio || !audio.duration) {
            return;
        }
        const wordsCount = activeVerse.words ? activeVerse.words.length : activeVerse.arabic.split(' ').length;
        
        // Add 250ms latency compensation to highlight the word exactly when the Qari begins pronouncing it
        const latencyComp = 0.25; 
        const adjustedTime = audio.currentTime + latencyComp;
        const progress = adjustedTime / audio.duration;
        
        if (progress < 0.04) {
            currentWordIndex = -1;
        } else if (progress > 0.94) {
            currentWordIndex = wordsCount - 1;
        } else {
            const scaledProgress = (progress - 0.04) / 0.90;
            currentWordIndex = Math.min(wordsCount - 1, Math.floor(scaledProgress * wordsCount));
        }
        
        animationFrameId = requestAnimationFrame(updateHighlight);
    }

    $effect(() => {
        if (isPlaying) {
            updateHighlight();
        } else {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    });

    function setupAudio() {
        if (!activeVerse) return;
        if (audio) {
            audio.pause();
            audio.onended = null;
        }
        audio = new Audio(activeVerse.audio);
        currentWordIndex = -1; // Reset highlight index
        currentLoopIndex = 0;  // Reset current loop counter
        
        audio.onended = () => {
            if (isPlaying && currentLoopIndex < loopTimes - 1) {
                currentLoopIndex++;
                audio.currentTime = 0;
                currentWordIndex = -1; // Reset highlight for the next run
                audio.play();
            } else {
                isPlaying = false;
                currentWordIndex = -1; // Reset highlight index on end
                currentLoopIndex = 0;
                if (isComparing && recordedAudio) {
                    isPlayingRecorded = true;
                    recordedAudio.currentTime = 0;
                    recordedAudio.play();
                    recordState = 'recording';
                } else {
                    isComparing = false;
                }
            }
        };
    }

    function setupScramble() {
        if (!activeVerse) return;
        
        // For Step 6 (Audio scramble) and Step 9 (Puzzle total)
        scrambledWords = activeVerse.words.map((w, idx) => ({ id: idx, text: w, selected: false }))
                                         .sort(() => Math.random() - 0.5);
        selectedWords = [];
    }

    function playSimulatedUserVoice() {
        recordState = 'recording'; // animate wave
        isPlaying = true;
        // play simulated short beep and finish
        setTimeout(() => {
            isPlaying = false;
            isComparing = false;
            recordState = 'recorded';
        }, 1500);
    }

    function togglePlay() {
        if (!audio) return;
        if (isPlaying && audio.playbackRate === 1.0) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.pause();
            audio.playbackRate = 1.0;
            audio.currentTime = 0;
            currentLoopIndex = 0; // Reset loop counter on manual trigger
            audio.play();
            isPlaying = true;
        }
    }

    function togglePlaySlow() {
        if (!audio) return;
        if (isPlaying && audio.playbackRate < 1.0) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.pause();
            audio.playbackRate = 0.55;
            audio.currentTime = 0;
            currentLoopIndex = 0; // Reset loop counter on manual trigger
            audio.play();
            isPlaying = true;
        }
    }

    async function startSimulatedRecording() {
        if (recordState === 'recording') {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            recordState = 'recorded';
            simulatedWaves = [];
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                // Set up Real-time Audio Visualizer
                const visCtx = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = visCtx.createAnalyser();
                const micSource = visCtx.createMediaStreamSource(stream);
                micSource.connect(analyser);
                analyser.fftSize = 64;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                
                function drawWave() {
                    if (recordState !== 'recording') return;
                    requestAnimationFrame(drawWave);
                    analyser.getByteFrequencyData(dataArray);
                    
                    let newWaves = [];
                    for(let i = 0; i < 15; i++) {
                        const val = dataArray[i + 1] || 0; // Use early frequency bins
                        // Map frequency magnitude (0-255) to bar height (10px to 50px)
                        const height = 10 + (val / 255) * 40;
                        newWaves.push(height);
                    }
                    simulatedWaves = newWaves;
                }
                
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    recordedAudioUrl = URL.createObjectURL(audioBlob);
                    if (recordedAudio) recordedAudio.pause();
                    recordedAudio = new Audio(recordedAudioUrl);
                    
                    // Apply Mosque Reverb Effect + Playback Audio Visualizer
                    try {
                        const AudioContext = window.AudioContext || window.webkitAudioContext;
                        if (!window.sharedAudioCtx) window.sharedAudioCtx = new AudioContext();
                        const ctx = window.sharedAudioCtx;
                        
                        const source = ctx.createMediaElementSource(recordedAudio);
                        
                        // Set up Playback Audio Visualizer Analyser Node
                        const playbackAnalyser = ctx.createAnalyser();
                        playbackAnalyser.fftSize = 64;
                        const playbackDataArray = new Uint8Array(playbackAnalyser.frequencyBinCount);
                        
                        function drawPlaybackWave() {
                            if (!isPlayingRecorded) {
                                simulatedWaves = [];
                                return;
                            }
                            requestAnimationFrame(drawPlaybackWave);
                            playbackAnalyser.getByteFrequencyData(playbackDataArray);
                            
                            let newWaves = [];
                            for (let i = 0; i < 15; i++) {
                                const val = playbackDataArray[i + 1] || 0;
                                // Map frequency magnitudes (0-255) to dynamic bar heights (10-50px)
                                const height = 10 + (val / 255) * 40;
                                newWaves.push(height);
                            }
                            simulatedWaves = newWaves;
                        }
                        
                        const convolver = ctx.createConvolver();
                        // Generate a synthetic impulse response for reverb
                        const rate = ctx.sampleRate;
                        const length = rate * 2.5; // 2.5 seconds decay
                        const impulse = ctx.createBuffer(2, length, rate);
                        for (let i = 0; i < length; i++) {
                            const decay = Math.exp(-i / (rate * 0.5));
                            impulse.getChannelData(0)[i] = (Math.random() * 2 - 1) * decay;
                            impulse.getChannelData(1)[i] = (Math.random() * 2 - 1) * decay;
                        }
                        convolver.buffer = impulse;
                        
                        const dryGain = ctx.createGain();
                        const wetGain = ctx.createGain();
                        dryGain.gain.value = 0.8; // 80% original audio
                        wetGain.gain.value = 0.5; // 50% reverb echo
                        
                        source.connect(dryGain);
                        dryGain.connect(playbackAnalyser); // Connect source through dry gain to analyser
                        
                        source.connect(convolver);
                        convolver.connect(wetGain);
                        wetGain.connect(playbackAnalyser); // Connect reverb gain to analyser too
                        
                        playbackAnalyser.connect(ctx.destination); // Connect analyser to destination
                        
                        recordedAudio.onplay = () => {
                            if (ctx.state === 'suspended') ctx.resume();
                            isPlayingRecorded = true;
                            drawPlaybackWave();
                        };
                        recordedAudio.onpause = () => {
                            isPlayingRecorded = false;
                        };
                    } catch (e) {
                        console.warn('Reverb effect / Visualizer failed or not supported:', e);
                    }
                    
                    recordedAudio.onended = () => {
                        isPlayingRecorded = false;
                        isComparing = false;
                        recordState = 'recorded';
                    };
                    
                    // Stop all microphone tracks to turn off the recording light
                    stream.getTracks().forEach(track => track.stop()); 
                    if (visCtx.state !== 'closed') visCtx.close();
                };
                
                mediaRecorder.start();
                recordState = 'recording';
                
                // Start drawing loop for mic visualization
                drawWave();
                
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Gagal mengakses mikrofon. Pastikan Anda memberikan izin akses mikrofon di browser.");
            }
        }
    }

    function startComparePlay() {
        isComparing = true;
        isPlaying = true;
        isPlayingRecorded = false;
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    function togglePlayRecorded() {
        if (!recordedAudio) return;
        if (isPlayingRecorded) {
            recordedAudio.pause();
        } else {
            recordedAudio.play();
        }
    }

    function toggleWordSelection(word) {
        if (isChecked) return;
        
        if (word.selected) {
            word.selected = false;
            selectedWords = selectedWords.filter(w => w.id !== word.id);
        } else {
            word.selected = true;
            selectedWords = [...selectedWords, word];
        }
    }

    function checkAnswer() {
        if (isChecked) {
            // Move to next step or finish
            isChecked = false;
            isCorrect = false;
            selectedOptionIdx = null;
            selectedWords = [];
            recordState = 'idle';
            isComparing = false;
            recallSelectedOptionIdx = null;
            recallMethod = 'voice';
            
            if (currentStep < stepsPipeline.length - 1) {
                currentStep++;
                setupScramble();
                if (audio) audio.pause();
                isPlaying = false;
            } else {
                showCompletion = true;
                
                lessonEarnedXP = 15;
                lessonEarnedCoins = 5;
                
                appState.user.xp += lessonEarnedXP;
                appState.user.coins += lessonEarnedCoins;
                
                if (appState.user.progress.surah_094 === selectedVerseIndex) {
                    appState.user.progress.surah_094 += 1;
                }
                
                appState.saveUser();
            }
            return;
        }

        // Logic to validate answer based on step type
        const type = currentStepConfig.type;
        if (type === 'recall_prev') {
            if (recallMethod === 'mushaf') {
                isCorrect = recallSelectedOptionIdx === 0;
            } else {
                isCorrect = recordState === 'recorded';
            }
            isChecked = true;
        }
        else if (type === 'recall_level1' || type === 'recall_level2') {
            isCorrect = recordState === 'recorded';
            isChecked = true;
        }
        else if (type === 'read_listen' || type === 'listen_repeat') {
            isCorrect = true;
            isChecked = true;
        } 
        else if (type === 'record_compare') {
            isCorrect = recordState === 'recorded';
            isChecked = true;
        }
        else if (type === 'fill_front') {
            isCorrect = selectedOptionIdx === 0;
            isChecked = true;
        }
        else if (type === 'fill_back') {
            isCorrect = selectedOptionIdx === 1;
            isChecked = true;
        }
        else if (type === 'puzzle_one') {
            isCorrect = selectedOptionIdx === 1;
            isChecked = true;
        }
        else if (type === 'puzzle_two') {
            isCorrect = selectedWords.length === 2 && 
                        selectedWords[0].text === activeVerse.twoCorrect[0] &&
                        selectedWords[1].text === activeVerse.twoCorrect[1];
            isChecked = true;
        }
        else if (type === 'audio_scramble' || type === 'puzzle_total') {
            isCorrect = selectedWords.length === activeVerse.words.length &&
                        selectedWords.every((w, i) => w.text === activeVerse.words[i]);
            isChecked = true;
        }
        else if (type === 'setor_full') {
            isCorrect = recordState === 'recorded';
            isChecked = true;
        }

        // Trigger animasi & sound setelah isChecked & isCorrect ditentukan
        if (isChecked) {
            if (isCorrect) {
                triggerCorrect();
            } else {
                triggerWrong();
            }
        }
    }

    function exitLesson() {
        if (audio) audio.pause();
        clearInterval(waveInterval);
        appState.go('learn');
    }

</script>

<div class="screen theme-user" class:shake={screenShaking}>
    <!-- Topbar Header -->
    <div class="topbar">
        <button onclick={exitLesson} style="background: none; border: none; cursor: pointer; display: flex; align-items: center;" title="Kembali ke Dashboard">
            <i class="ti ti-x" style="font-size: 22px; color: #afafaf;"></i>
        </button>
        <div class="prog-bar-bg" style="flex: 1; margin: 0 16px;">
            <div class="prog-bar-fill" style="width: {showCompletion ? 100 : ((currentStep + 1) / stepsPipeline.length) * 100}%"></div>
        </div>
        <div class="xp-pill">
            <i class="ti ti-bolt-filled"></i> {Math.round(((currentStep + 1) / stepsPipeline.length) * 100)} XP
        </div>
    </div>

    <div class="scroll-content no-scrollbar" style="background: #fff; display: flex; flex-direction: column;">
        <!-- 2. GAME STEPS INTERACTIVE SCREEN -->
        <div class="lesson-step-wrapper" style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                
                <!-- Stage Header Navigation Track -->
                <div class="stage-indicator-bar">
                    <span class="stage-tag stage-{currentStepConfig.stage}">
                        {#if currentStepConfig.stage === 0}
                            🔄 RECALL PREV
                        {:else if currentStepConfig.stage === 1}
                            💡 STAGE 1: PENGENALAN
                        {:else if currentStepConfig.stage === 2}
                            👁️ STAGE 2: MUSHAF
                        {:else if currentStepConfig.stage === 3}
                            🧩 STAGE 3: PUZZLE
                        {:else if currentStepConfig.stage === 4}
                            🏆 AKHIR: RECALL
                        {/if}
                    </span>
                    <span class="step-counter">Langkah {currentStep + 1} dari {stepsPipeline.length}</span>
                </div>
                
                <h3 class="step-title-display">{currentStepConfig.title}</h3>
                <p class="step-description">{currentStepConfig.desc}</p>
                
                <div class="exercise-card-container">
                    
                    <!-- ==================== STEP 0: RECALL PREVIOUS VERSE ==================== -->
                    {#if currentStepConfig.type === 'recall_prev'}
                        {@const previousVerse = alInsyirahVerses[selectedVerseIndex - 1]}
                        <div class="verse-display-box" style="padding: 24px 16px;">
                            <!-- Dual Selector Tab -->
                            <div class="recall-method-tabs" style="display: flex; gap: 8px; margin-bottom: 24px; background: #f3f4f6; padding: 6px; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
                                <button 
                                    class="recall-tab-btn" 
                                    class:active={recallMethod === 'voice'} 
                                    onclick={() => { recallMethod = 'voice'; recordState = 'idle'; }}
                                    style="flex: 1; border: none; padding: 10px; font-weight: 800; font-size: 13px; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                >
                                    🎙️ Setoran Hafalan
                                </button>
                                <button 
                                    class="recall-tab-btn" 
                                    class:active={recallMethod === 'mushaf'} 
                                    onclick={() => { recallMethod = 'mushaf'; }}
                                    style="flex: 1; border: none; padding: 10px; font-weight: 800; font-size: 13px; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                >
                                    📖 Segmentasi Mushaf
                                </button>
                            </div>

                            {#if recallMethod === 'voice'}
                                <div class="setor-quran-graphic" style="font-size: 48px; margin-bottom: 12px;">🎙️</div>
                                <div class="arabic-focus-text Amiri" style="filter: blur(6px); opacity: 0.15; user-select: none;">
                                    {previousVerse.arabic}
                                </div>
                                <p style="font-size: 13px; font-weight: 700; color: #7c7c7c; margin: 12px 0 20px 0;">
                                    "Bacakan ayat {selectedVerseIndex} sepenuhnya dari hafalan tanpa teks."
                                </p>
                                
                                <div style="margin: 20px 0;">
                                    <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="Mulai Setoran Suara">
                                        <i class="ti ti-microphone"></i>
                                    </button>
                                </div>

                                {#if recordState === 'recording' || isPlayingRecorded}
                                    <div class="simulated-wave-container" style="margin-top: 12px; margin-bottom: 8px;">
                                        {#each simulatedWaves as wave}
                                            <div class="wave-bar" style="height: {wave}px;"></div>
                                        {/each}
                                    </div>
                                    <span class="pulse-text" style="color: #ef4444; font-weight: 800; font-size: 12px;">
                                        {recordState === 'recording' ? 'Merekam hafalanmu...' : 'Memutar rekaman hafalanmu...'}
                                    </span>
                                {:else if recordState === 'recorded'}
                                    <div class="voice-matched-toast" style="background: #ecfdf5; border: 1px solid #10b981; color: #065f46; font-size: 14px; font-weight: 800; padding: 10px 16px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; margin-top: 12px;">
                                        <i class="ti ti-circle-check-filled" style="color: #10b981; font-size: 18px;"></i>
                                        Suara terekam! Klik Periksa di bawah.
                                    </div>
                                {:else}
                                    <span style="font-size: 12px; color: #a0a0a0; font-weight: 700;">Ketuk mikrofon di atas untuk mulai menyetor suara</span>
                                {/if}
                            {:else}
                                <!-- Mushaf Segmentasi mode -->
                                <div class="arabic-focus-text Amiri" style="font-size: 26px; line-height: 1.8; margin-bottom: 20px; direction: rtl;">
                                    {previousVerse.frontBlank}
                                </div>
                                <p style="font-size: 13px; font-weight: 700; color: #7c7c7c; margin-bottom: 24px;">
                                    Lengkapi potongan ayat di atas dengan memilih jawaban yang benar:
                                </p>
                                <div class="options-stack" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                                    {#each previousVerse.frontChoices as choice, i}
                                        <button 
                                            class="option-pill"
                                            class:selected={recallSelectedOptionIdx === i}
                                            class:correct={isChecked && i === 0}
                                            class:wrong={isChecked && recallSelectedOptionIdx === i && i !== 0}
                                            onclick={() => { if (!isChecked) recallSelectedOptionIdx = i; }}
                                            disabled={isChecked}
                                            style="direction: rtl; font-family: 'Amiri', serif; font-size: 20px; font-weight: bold; width: 100%; border: 2px solid #e5e5e5; border-radius: 12px; padding: 14px; background: #fff; text-align: center; cursor: pointer; transition: 0.2s;"
                                        >
                                            {choice}
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                    <!-- ==================== STEP 1: LIHAT & DENGAR ==================== -->
                    {:else if currentStepConfig.type === 'read_listen'}
                        <div class="verse-display-box">
                            <div class="audio-circle-row" style="display: flex; gap: 16px; justify-content: center; align-items: center; margin-bottom: 20px;">
                                <button class="audio-circle-play" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} title="Putar Audio Qari (Normal)">
                                    <i class="ti {isPlaying && audio?.playbackRate === 1.0 ? 'ti-player-pause' : 'ti-player-play'}"></i>
                                </button>
                                <button class="audio-circle-play slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} title="Putar Audio Qari (Lambat)">
                                    <img src="/snail.png" alt="Snail" style="width: 28px; height: 28px; object-fit: contain;" />
                                </button>
                            </div>

                            <div class="arabic-focus-text Amiri" style="direction: rtl;">
                                {#each activeVerse.words as word, wIdx}
                                    <span 
                                        class="highlight-word" 
                                        class:active={wIdx === currentWordIndex}
                                        onclick={() => playWordAudio(word)}
                                        title="Klik untuk putar audio kata ini"
                                    >
                                        {@html getTajweedHTML(word)}
                                    </span>{' '}
                                {/each}
                            </div>
                            <div class="translit-focus-text">"{activeVerse.transliteration}"</div>
                            <div class="trans-focus-text" style="margin-bottom: 16px;">{activeVerse.translation}</div>

                            <!-- Looping Selector Pill Row -->
                            <div class="loop-selector-row" style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-top: 16px; border-top: 1px solid #f1f5f9; padding-top: 12px; width: 100%;">
                                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px;">
                                    <i class="ti ti-repeat" style="font-size: 14px; color: #00978A;"></i> Loop:
                                </span>
                                {#each [1, 2, 3, 5] as times}
                                    <button 
                                        class="loop-pill" 
                                        class:active={loopTimes === times} 
                                        onclick={() => { loopTimes = times; setupAudio(); }}
                                        title="Ulangi {times} kali"
                                    >
                                        {times}x
                                    </button>
                                {/each}
                            </div>

                            <!-- Tajweed Legend -->
                            <div class="tajweed-legend" style="display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 12px; font-size: 10px; font-weight: 800; letter-spacing: 0.2px;">
                                <span style="color: #64748b; font-size: 9px; text-transform: uppercase;">Warna Tajwid:</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #2563eb;"></span> Qalqalah</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #dc2626;"></span> Ghunnah</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #db2777;"></span> Ikhfa</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span> Mad</span>
                            </div>
                        </div>
                        
                    <!-- ==================== STEP 2: TIRU & IKUTI ==================== -->
                    {:else if currentStepConfig.type === 'listen_repeat'}
                        <div class="verse-display-box">
                            <div style="display: flex; gap: 12px; justify-content: center; align-items: center; margin-bottom: 20px;">
                                <button class="audio-circle-play" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} title="1. Dengar Qari (Normal)">
                                    <i class="ti ti-volume"></i>
                                </button>
                                <button class="audio-circle-play slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} title="1. Dengar Qari (Lambat)">
                                    <img src="/snail.png" alt="Snail" style="width: 28px; height: 28px; object-fit: contain;" />
                                </button>
                                <button class="mic-circle-btn" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="2. Tiru Bacaan">
                                    <i class="ti ti-microphone"></i>
                                </button>
                            </div>
                            <div class="arabic-focus-text Amiri" style="direction: rtl;">
                                {#each activeVerse.words as word, wIdx}
                                    <span 
                                        class="highlight-word" 
                                        class:active={wIdx === currentWordIndex}
                                        onclick={() => playWordAudio(word)}
                                        title="Klik untuk putar audio kata ini"
                                    >
                                        {@html getTajweedHTML(word)}
                                    </span>{' '}
                                {/each}
                            </div>

                            <!-- Looping Selector Pill Row -->
                            <div class="loop-selector-row" style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-top: 16px; border-top: 1px solid #f1f5f9; padding-top: 12px; width: 100%;">
                                <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px;">
                                    <i class="ti ti-repeat" style="font-size: 14px; color: #00978A;"></i> Loop:
                                </span>
                                {#each [1, 2, 3, 5] as times}
                                    <button 
                                        class="loop-pill" 
                                        class:active={loopTimes === times} 
                                        onclick={() => { loopTimes = times; setupAudio(); }}
                                        title="Ulangi {times} kali"
                                    >
                                        {times}x
                                    </button>
                                {/each}
                            </div>

                            <!-- Tajweed Legend -->
                            <div class="tajweed-legend" style="display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 12px; margin-bottom: 16px; font-size: 10px; font-weight: 800; letter-spacing: 0.2px;">
                                <span style="color: #64748b; font-size: 9px; text-transform: uppercase;">Warna Tajwid:</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #2563eb;"></span> Qalqalah</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #dc2626;"></span> Ghunnah</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #db2777;"></span> Ikhfa</span>
                                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span> Mad</span>
                            </div>
                            
                            {#if recordState === 'recording'}
                                <div class="simulated-wave-container">
                                    {#each simulatedWaves as wave}
                                        <span class="wave-bar" style="height: {wave}px"></span>
                                    {/each}
                                </div>
                                <span class="action-helper-txt pulsing">Merekam suara Anda... Silakan membaca ayat di atas!</span>
                            {:else if recordState === 'recorded'}
                                {#if isPlayingRecorded}
                                    <div class="simulated-wave-container" style="margin-bottom: 12px;">
                                        {#each simulatedWaves as wave}
                                            <span class="wave-bar" style="height: {wave}px"></span>
                                        {/each}
                                    </div>
                                {/if}
                                <div style="display:flex; flex-direction:column; align-items:center; gap:12px; margin-top:8px;">
                                    <span class="action-helper-txt text-success" style="margin-top:0;">✓ Berhasil direkam!</span>
                                    <button class="btn-duo outline" style="font-size:12px; padding:8px 16px; border-color:#00978A; color:#00978A;" onclick={togglePlayRecorded}>
                                        <i class="ti {isPlayingRecorded ? 'ti-player-pause' : 'ti-player-play'}"></i> {isPlayingRecorded ? 'Pause Suara Saya' : 'Dengar Ulang Suara Saya'}
                                    </button>
                                </div>
                            {:else}
                                <span class="action-helper-txt">Ketuk speaker untuk mendengar, lalu ketuk mikrofon untuk meniru!</span>
                            {/if}
                        </div>

                    <!-- ==================== STEP 3: REKAM & BANDINGKAN ==================== -->
                    {:else if currentStepConfig.type === 'record_compare'}
                        <div class="compare-container">
                            <div class="compare-cards-row">
                                <div class="compare-card">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3996/3996562.png" alt="Qari icon" style="width: 48px; height: 48px; object-fit: contain; margin-bottom: 8px;" />
                                    <h4>Suara Qari</h4>
                                    <button class="compare-action-btn" onclick={togglePlay} class:active={isPlaying}>
                                        <i class="ti {isPlaying && !isComparing ? 'ti-player-pause' : 'ti-player-play'}"></i> Dengar Qari
                                    </button>
                                </div>
                                
                                <div class="compare-card">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User icon" style="width: 48px; height: 48px; object-fit: contain; margin-bottom: 8px;" />
                                    <h4>Rekaman Anda</h4>
                                    <button class="compare-action-btn record" onclick={startSimulatedRecording} class:active={recordState === 'recording'}>
                                        <i class="ti ti-microphone"></i> {recordState === 'recorded' ? 'Ulang Rekam' : 'Rekam Suara'}
                                    </button>
                                </div>
                            </div>
                            
                            {#if recordState === 'recorded'}
                                <div style="display: flex; justify-content: center; margin-top: 16px;">
                                    <button class="compare-match-btn" class:active={isComparing} onclick={startComparePlay}>
                                        <i class="ti ti-arrows-minimize"></i> Bandingkan Berurutan
                                    </button>
                                </div>
                            {/if}
                            
                            {#if recordState === 'recording' || isPlayingRecorded}
                                <div class="simulated-wave-container" style="margin-top: 16px;">
                                    {#each simulatedWaves as wave}
                                        <span class="wave-bar" style="height: {wave}px"></span>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                    <!-- ==================== STEP 4: ISI BAGIAN AWAL ==================== -->
                    {:else if currentStepConfig.type === 'fill_front'}
                        <div class="choice-challenge-container">
                            <div class="challenge-arabic-blank Amiri">{activeVerse.frontBlank}</div>
                            
                            <div class="choice-options-column">
                                {#each activeVerse.frontChoices as choice, idx}
                                    <button 
                                        class="choice-card-button" 
                                        class:selected={selectedOptionIdx === idx}
                                        class:correct={isChecked && idx === 0}
                                        class:wrong={isChecked && selectedOptionIdx === idx && idx !== 0}
                                        onclick={() => !isChecked && (selectedOptionIdx = idx)}
                                        disabled={isChecked}
                                    >
                                        <span class="choice-index-circle">{idx + 1}</span>
                                        <span class="choice-text Amiri">{choice}</span>
                                    </button>
                                {/each}
                            </div>
                        </div>

                    <!-- ==================== STEP 5: ISI BAGIAN AKHIR ==================== -->
                    {:else if currentStepConfig.type === 'fill_back'}
                        <div class="choice-challenge-container">
                            <div class="challenge-arabic-blank Amiri">{activeVerse.endBlank}</div>
                            
                            <div class="choice-options-column">
                                {#each activeVerse.endChoices as choice, idx}
                                    <button 
                                        class="choice-card-button" 
                                        class:selected={selectedOptionIdx === idx}
                                        class:correct={isChecked && idx === 1}
                                        class:wrong={isChecked && selectedOptionIdx === idx && idx !== 1}
                                        onclick={() => !isChecked && (selectedOptionIdx = idx)}
                                        disabled={isChecked}
                                    >
                                        <span class="choice-index-circle">{idx + 1}</span>
                                        <span class="choice-text Amiri">{choice}</span>
                                    </button>
                                {/each}
                            </div>
                        </div>

                    <!-- ==================== STEP 6: AUDIO SCRAMBLE ==================== -->
                    {:else if currentStepConfig.type === 'audio_scramble'}
                        <div class="scramble-challenge-container">
                            <div style="display: flex; gap: 12px; justify-content: center; align-items: center; margin-bottom: 12px;">
                                <button class="audio-circle-play small" class:playing={isPlaying && audio?.playbackRate === 1.0} onclick={togglePlay} title="Dengar Qari (Normal)">
                                    <i class="ti ti-volume"></i>
                                </button>
                                <button class="audio-circle-play small slow-btn" class:playing={isPlaying && audio?.playbackRate < 1.0} onclick={togglePlaySlow} title="Dengar Qari (Lambat)">
                                    <img src="/snail.png" alt="Snail" style="width: 20px; height: 20px; object-fit: contain;" />
                                </button>
                            </div>
                            
                            <div class="scramble-drop-shelf {isChecked ? (isCorrect ? 'correct' : 'wrong') : ''}">
                                {#if selectedWords.length === 0}
                                    <span class="drop-shelf-placeholder">Ketuk kata-kata di bawah untuk menyusun ayat...</span>
                                {/if}
                                {#each selectedWords as word}
                                    <button class="scramble-word-pill" onclick={() => toggleWordSelection(word)} disabled={isChecked}>
                                        {word.text}
                                    </button>
                                {/each}
                            </div>
                            
                            <div class="scramble-source-bank">
                                {#each scrambledWords as word}
                                    <button 
                                        class="scramble-word-pill outline" 
                                        class:placed={word.selected}
                                        onclick={() => toggleWordSelection(word)}
                                        disabled={isChecked || word.selected}
                                    >
                                        {word.text}
                                    </button>
                                {/each}
                            </div>
                        </div>

                    <!-- ==================== STEP 7: PUZZLE 1 KATA HILANG ==================== -->
                    {:else if currentStepConfig.type === 'puzzle_one'}
                        <div class="choice-challenge-container">
                            <div class="challenge-arabic-blank Amiri">{activeVerse.middleBlank}</div>
                            
                            <div class="choice-options-column">
                                {#each activeVerse.middleChoices as choice, idx}
                                    <button 
                                        class="choice-card-button" 
                                        class:selected={selectedOptionIdx === idx}
                                        class:correct={isChecked && idx === 1}
                                        class:wrong={isChecked && selectedOptionIdx === idx && idx !== 1}
                                        onclick={() => !isChecked && (selectedOptionIdx = idx)}
                                        disabled={isChecked}
                                    >
                                        <span class="choice-index-circle">{idx + 1}</span>
                                        <span class="choice-text Amiri">{choice}</span>
                                    </button>
                                {/each}
                            </div>
                        </div>

                    <!-- ==================== STEP 8: PUZZLE 2 KATA HILANG ==================== -->
                    {:else if currentStepConfig.type === 'puzzle_two'}
                        <div class="scramble-challenge-container">
                            <div class="challenge-arabic-blank Amiri" style="margin-bottom: 24px;">{activeVerse.twoBlank}</div>
                            
                            <div class="scramble-drop-shelf {isChecked ? (isCorrect ? 'correct' : 'wrong') : ''}" style="min-height: 80px;">
                                {#if selectedWords.length === 0}
                                    <span class="drop-shelf-placeholder">Lengkapi 2 kata di atas secara berurutan...</span>
                                {/if}
                                {#each selectedWords as word}
                                    <button class="scramble-word-pill" onclick={() => toggleWordSelection(word)} disabled={isChecked}>
                                        {word.text}
                                    </button>
                                {/each}
                            </div>
                            
                            <div class="scramble-source-bank">
                                {#each activeVerse.twoChoices as choice, i}
                                    {@const wordObj = { id: i, text: choice, selected: selectedWords.some(w => w.text === choice) }}
                                    <button 
                                        class="scramble-word-pill outline" 
                                        class:placed={wordObj.selected}
                                        onclick={() => toggleWordSelection(wordObj)}
                                        disabled={isChecked || wordObj.selected}
                                    >
                                        {choice}
                                    </button>
                                {/each}
                            </div>
                        </div>

                    <!-- ==================== STEP 9: PUZZLE TOTAL (SEMUA ACAK) ==================== -->
                    {:else if currentStepConfig.type === 'puzzle_total'}
                        <div class="scramble-challenge-container">
                            <div class="scramble-drop-shelf {isChecked ? (isCorrect ? 'correct' : 'wrong') : ''}">
                                {#if selectedWords.length === 0}
                                    <span class="drop-shelf-placeholder">Susun seluruh ayat Al-Insyirah dari hafalanmu...</span>
                                {/if}
                                {#each selectedWords as word}
                                    <button class="scramble-word-pill" onclick={() => toggleWordSelection(word)} disabled={isChecked}>
                                        {word.text}
                                    </button>
                                {/each}
                            </div>
                            
                            <div class="scramble-source-bank">
                                {#each scrambledWords as word}
                                    <button 
                                        class="scramble-word-pill outline" 
                                        class:placed={word.selected}
                                        onclick={() => toggleWordSelection(word)}
                                        disabled={isChecked || word.selected}
                                    >
                                        {word.text}
                                    </button>
                                {/each}
                            </div>
                        </div>

                    <!-- ==================== STEP 10: SETOR FULL AYAT ==================== -->
                    {:else if currentStepConfig.type === 'setor_full'}
                        <div class="verse-display-box" style="padding: 40px 20px;">
                            <div class="setor-quran-graphic">📖</div>
                            
                            <div style="margin: 24px 0;">
                                <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording}>
                                    <i class="ti ti-microphone"></i>
                                </button>
                            </div>
                            
                            {#if recordState === 'recording' || isPlayingRecorded}
                                <div class="simulated-wave-container">
                                    {#each simulatedWaves as wave}
                                        <span class="wave-bar" style="height: {wave}px"></span>
                                    {/each}
                                </div>
                                <span class="action-helper-txt pulsing text-primary">
                                    {recordState === 'recording' ? 'Tasmi AI sedang menyimak bacaan Anda...' : 'Memutar rekaman bacaan Anda...'}
                                </span>
                            {:else if recordState === 'recorded'}
                                <div class="transcription-box">
                                    <div class="trans-pill-tag">TRANSKRIPSI AI</div>
                                    <div class="arabic-transcription Amiri">{activeVerse.arabic}</div>
                                    <span class="action-helper-txt text-success" style="margin-top: 8px;">✓ 100% Sesuai dengan Mushaf! Klik check jawaban.</span>
                                </div>
                            {:else}
                                <span class="action-helper-txt">Tekan tombol mic, lalu hafalkan ayat {activeVerse.verseNumber} secara lengkap tanpa bantuan teks.</span>
                            {/if}
                        </div>

                    <!-- ==================== STEP 11: RECALL LEVEL 1 ==================== -->
                    {:else if currentStepConfig.type === 'recall_level1'}
                        <div class="verse-display-box" style="padding: 40px 20px;">
                            <div class="setor-quran-graphic">🏆</div>
                            
                            <div style="font-size: 16px; font-weight: 800; color: #059669; margin-bottom: 12px;">
                                Level 1: Setor Ayat Baru
                            </div>
                            
                            <div style="margin: 24px 0;">
                                <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="Mulai Setoran Level 1">
                                    <i class="ti ti-microphone"></i>
                                </button>
                            </div>
                            
                            {#if recordState === 'recording' || isPlayingRecorded}
                                <div class="simulated-wave-container">
                                    {#each simulatedWaves as wave}
                                        <span class="wave-bar" style="height: {wave}px"></span>
                                    {/each}
                                </div>
                                <span class="action-helper-txt pulsing text-primary">
                                    {recordState === 'recording' ? 'Tasmi AI sedang menyimak hafalan barumu...' : 'Memutar rekaman hafalan barumu...'}
                                </span>
                            {:else if recordState === 'recorded'}
                                <div class="transcription-box">
                                    <div class="trans-pill-tag" style="background: #e0f2fe; color: #0369a1;">TRANSKRIPSI HAFALAN</div>
                                    <div class="arabic-transcription Amiri">{activeVerse.arabic}</div>
                                    <span class="action-helper-txt text-success" style="margin-top: 8px;">✓ Ayat baru berhasil disetorkan dengan fasih!</span>
                                </div>
                            {:else}
                                <span class="action-helper-txt">
                                    Tekan mic dan bacakan ayat {activeVerse.verseNumber} yang baru saja kamu hafal secara penuh dari ingatanmu.
                                </span>
                            {/if}
                        </div>

                    <!-- ==================== STEP 12: RECALL LEVEL 2 ==================== -->
                    {:else if currentStepConfig.type === 'recall_level2'}
                        {@const prevVerse = alInsyirahVerses[selectedVerseIndex - 1]}
                        <div class="verse-display-box" style="padding: 40px 20px;">
                            <div class="setor-quran-graphic" style="animation: bounce 2s infinite;">🔗</div>
                            
                            <div style="font-size: 16px; font-weight: 800; color: #ea580c; margin-bottom: 12px;">
                                Level 2: Sambungkan Hafalan
                            </div>
                            
                            <div style="margin: 24px 0;">
                                <button class="mic-circle-btn giant" class:active={recordState === 'recording'} onclick={startSimulatedRecording} title="Mulai Setoran Level 2">
                                    <i class="ti ti-microphone"></i>
                                </button>
                            </div>
                            
                            {#if recordState === 'recording' || isPlayingRecorded}
                                <div class="simulated-wave-container">
                                    {#each simulatedWaves as wave}
                                        <span class="wave-bar" style="height: {wave}px"></span>
                                    {/each}
                                </div>
                                <span class="action-helper-txt pulsing text-primary">
                                    {recordState === 'recording' ? 'Tasmi AI menyimak sambungan ayat...' : 'Memutar rekaman sambungan ayat...'}
                                </span>
                            {:else if recordState === 'recorded'}
                                <div class="transcription-box">
                                    <div class="trans-pill-tag" style="background: #fff7ed; color: #c2410c;">HAFALAN BERSAMBUNG</div>
                                    <div class="arabic-transcription Amiri" style="font-size: 20px; line-height: 2.0; direction: rtl; text-align: right; width: 100%;">
                                        {prevVerse.arabic} ﴿{prevVerse.verseNumber}﴾ {activeVerse.arabic} ﴿{activeVerse.verseNumber}﴾
                                    </div>
                                    <span class="action-helper-txt text-success" style="margin-top: 8px;">✓ Sempurna! Sambungan ayat {prevVerse.verseNumber} & {activeVerse.verseNumber} terjalin kokoh!</span>
                                </div>
                            {:else}
                                <span class="action-helper-txt">
                                    Tekan mic dan bacakan **ayat {prevVerse.verseNumber}** dilanjutkan **ayat {activeVerse.verseNumber}** secara berurutan tanpa putus.
                                </span>
                            {/if}
                        </div>
                    {/if}
                    
                </div>
                
                <!-- Confetti Overlay -->
                {#if showConfetti}
                    <div class="confetti-overlay" aria-hidden="true">
                        {#each confettiParticles as p (p.id)}
                            <div
                                class="confetti-particle shape-{p.shape}"
                                style="
                                    left: {p.x}%;
                                    top: {p.y}%;
                                    width: {p.size}px;
                                    height: {p.size}px;
                                    background: {p.color};
                                    --speed-x: {p.speedX};
                                    --speed-y: {p.speedY};
                                    --rot-speed: {p.rotSpeed}deg;
                                    animation: confettiFall 2.5s ease-in forwards;
                                    animation-delay: {Math.random() * 0.3}s;
                                "
                            ></div>
                        {/each}
                    </div>
                {/if}

                <!-- Sparkles Burst Overlay -->
                {#if showSparkles}
                    <div class="sparkles-overlay" aria-hidden="true">
                        {#each sparkleParticles as s (s.id)}
                            <div
                                class="sparkle-element"
                                style="
                                    --tx: {s.tx}px;
                                    --ty: {s.ty}px;
                                    --rot: {s.rotation}deg;
                                    --rot-speed: {s.rotSpeed}deg;
                                    font-size: {s.size}px;
                                    animation: sparkleBurst 1.3s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
                                    animation-delay: {s.delay}s;
                                "
                            >
                                {s.icon}
                            </div>
                        {/each}
                    </div>
                {/if}

                <!-- Bottom Slided DUOLINGO Feedback Panel Sheet -->
                {#if isChecked}
                    <div class="sliding-feedback-panel {feedbackAnimClass}" class:correct={isCorrect} class:wrong={!isCorrect}>
                        <div class="feedback-inner-content">
                            <div class="feedback-badge" class:correct={isCorrect} class:wrong={!isCorrect}>
                                <i class="ti {isCorrect ? 'ti-check' : 'ti-alert-circle'}"></i>
                                {isCorrect ? 'SANGAT BAGUS! 🌟' : 'KURANG TEPAT 💪'}
                            </div>
                            <p class="feedback-msg">
                                {isCorrect 
                                    ? 'Masya Allah! Jawabanmu 100% tepat. Hafalan tajwid dan visualmu makin kokoh!' 
                                    : 'Perhatikan susunan kata dan lafal aslinya. Jangan menyerah, ayo coba lagi!'}
                            </p>
                        </div>
                    </div>
                {/if}
                
                <!-- Action Footer Buttons -->
                <div class="lesson-footer-actions" style="margin-top: auto; padding: 12px 0 0;">
                    {#if currentStepConfig.type === 'read_listen'}
                        <button class="btn-duo btn-green" onclick={checkAnswer}>
                            SAYA SUDAH HAFAL & PAHAM
                        </button>
                    {:else}
                        <button 
                            class="btn-duo" 
                            class:btn-green={(!isChecked && (selectedOptionIdx !== null || recallSelectedOptionIdx !== null || selectedWords.length > 0 || recordState === 'recorded')) || (isChecked && isCorrect)}
                            class:btn-red={isChecked && !isCorrect}
                            class:btn-disabled={!isChecked && selectedOptionIdx === null && recallSelectedOptionIdx === null && selectedWords.length === 0 && recordState !== 'recorded'}
                            onclick={checkAnswer}
                            disabled={!isChecked && selectedOptionIdx === null && recallSelectedOptionIdx === null && selectedWords.length === 0 && recordState !== 'recorded'}
                        >
                            {isChecked ? (isCorrect ? 'LANJUTKAN' : 'COBA LAGI') : 'PERIKSA JAWABAN'}
                        </button>
                    {/if}
                </div>
                
            </div>
        
    </div>

    <!-- 3. COMPLETED ALL STAGES SCREEN OVERLAY -->
    {#if showCompletion}
        <div class="completion-overlay">
            <div class="completion-card">
                <div class="completed-trophy-img">🏆</div>
                <div class="congrats-headline">✅ ONE PATH FINISHED!</div>
                <div class="congrats-sub">
                    {#if selectedVerseIndex > 0}
                        Satu ayat benar-benar hafal bersambung dengan ayat sebelumnya.
                    {:else}
                        Selamat! Ayat {activeVerse.verseNumber} dari Surah Al-Insyirah sudah benar-benar hafal di luar kepala!
                    {/if}
                </div>
                
                <div class="reward-box" style="margin: 20px 0;">
                    <div class="reward-item">
                        <span style="font-size: 24px; color: #ff9600;">⚡</span>
                        <span style="font-size: 15px; font-weight: 900; color: #3c3c3c;">+{lessonEarnedXP} XP</span>
                        <span style="font-size: 9px; font-weight: 700; color: #afafaf;">STREAK BONUS</span>
                    </div>
                    <div class="reward-item" style="border-left: 2px solid #e5e5e5;">
                        <span style="font-size: 24px; color: #00978A;">🔄</span>
                        <span style="font-size: 15px; font-weight: 900; color: #00978A;">+{lessonEarnedCoins} Poin</span>
                        <span style="font-size: 9px; font-weight: 700; color: #00978A;">MEMO CASHBACK</span>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="btn-duo btn-green" onclick={exitLesson}>
                        HAFAL AYAT LAINNYA
                    </button>
                    <button class="btn-duo outline" onclick={exitLesson}>
                        KEMBALI KE ROADMAP
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Surah and Ayat Selector Styling */
    .topbar-surah-title {
        font-size: 16px;
        font-weight: 900;
        color: var(--duo-green);
        letter-spacing: -0.5px;
        font-family: "Nunito", sans-serif;
    }
    .selector-header {
        text-align: center;
        margin-bottom: 24px;
        padding: 10px 0;
    }
    .flaticon-header-icon {
        width: 64px;
        height: 64px;
        object-fit: contain;
        margin-bottom: 12px;
    }
    .selector-header h2 {
        font-size: 22px;
        font-weight: 900;
        color: #3c3c3c;
        margin: 0 0 6px;
    }
    .selector-header p {
        font-size: 13px;
        font-weight: 700;
        color: #afafaf;
        margin: 0;
        line-height: 1.4;
    }
    .verses-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .verse-selection-card {
        display: flex;
        align-items: center;
        width: 100%;
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 14px 16px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
    }
    .verse-selection-card:hover {
        border-color: var(--duo-green);
        background: #fdfdfd;
    }
    .verse-selection-card:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .verse-number-badge {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--duo-green-light);
        color: var(--duo-green);
        font-weight: 900;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-right: 14px;
    }
    .verse-texts-col {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .verse-arabic-txt {
        font-family: "Amiri", serif;
        font-size: 18px;
        font-weight: 700;
        color: #3c3c3c;
        direction: rtl;
        text-align: right;
    }
    .verse-trans-txt {
        font-size: 11px;
        font-weight: 700;
        color: #888;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .verse-action-arrow {
        color: #afafaf;
        font-size: 16px;
        margin-left: 12px;
    }

    /* Lesson Step Layout */
    .stage-indicator-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    .stage-tag {
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 4px 10px;
        border-radius: 100px;
    }
    .stage-tag.stage-1 { background: #ffebeb; color: #ff5c5c; }
    .stage-tag.stage-2 { background: #e0f2fe; color: #0284c7; }
    .stage-tag.stage-3 { background: #fef3c7; color: #d97706; }
    .stage-tag.stage-0 { background: #fff7ed; color: #ea580c; }
    .stage-tag.stage-4 { background: #ecfdf5; color: #059669; }
    
    .recall-tab-btn {
        background: transparent;
        color: #7c7c7c;
        border: none;
    }
    .recall-tab-btn.active {
        background: #fff !important;
        color: var(--duo-green) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    .step-counter {
        font-size: 11px;
        font-weight: 800;
        color: #94a3b8;
    }
    .step-title-display {
        font-size: 20px;
        font-weight: 900;
        color: #3c3c3c;
        margin: 0 0 4px;
        letter-spacing: -0.5px;
    }
    .step-description {
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        margin: 0 0 20px;
        line-height: 1.4;
    }

    .exercise-card-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 300px;
        margin-bottom: 20px;
    }

    /* Display Card Box */
    .verse-display-box {
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-radius: 24px;
        padding: 30px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 280px;
    }
    .audio-circle-play {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #00978A;
        border: none;
        border-bottom: 4px solid #007A70;
        color: #fff;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.1s;
        margin-bottom: 20px;
    }
    .audio-circle-play:active {
        border-bottom-width: 0;
        transform: translateY(4px);
    }
    .audio-circle-play.small {
        width: 48px;
        height: 48px;
        font-size: 18px;
        margin-bottom: 12px;
    }
    .audio-circle-play.slow-btn {
        background: #10B981; /* Beautiful Fresh Mint Green */
        border-bottom-color: #059669; /* Darker Forest Green 3D shadow */
        margin-bottom: 20px;
    }
    .audio-circle-play.slow-btn:active {
        border-bottom-width: 0;
        transform: translateY(4px);
    }
    .verse-display-box .audio-circle-play,
    .scramble-challenge-container .audio-circle-play {
        margin-bottom: 0 !important;
    }
    .mic-circle-btn {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid #ff4b4b;
        color: #ff4b4b;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 75, 75, 0.15);
        transition: all 0.2s;
    }
    .mic-circle-btn.giant {
        width: 90px;
        height: 90px;
        font-size: 36px;
        border-width: 6px;
    }
    .mic-circle-btn.active {
        background: #ff4b4b;
        color: #fff;
        transform: scale(1.08);
        box-shadow: 0 0 20px rgba(255, 75, 75, 0.4);
    }
    .arabic-focus-text {
        font-size: 28px;
        line-height: 1.6;
        color: #1e293b;
        margin-bottom: 12px;
        direction: rtl;
        text-align: center;
    }
    .highlight-word {
        color: #1e293b;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-block;
        padding: 2px 6px;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    }
    .highlight-word:hover {
        background: rgba(0, 151, 138, 0.08);
        color: #00978a;
        transform: translateY(-1px) scale(1.05);
    }
    .highlight-word.active {
        background: rgba(0, 151, 138, 0.15);
        box-shadow: 0 4px 12px rgba(0, 151, 138, 0.15);
        transform: scale(1.18) translateY(-3px);
        font-weight: 800;
    }
    .tajweed-qalqalah {
        color: #2563eb !important; /* Royal Blue */
        font-weight: bold;
    }
    .tajweed-ikhfa {
        color: #db2777 !important; /* Deep Pink */
        font-weight: bold;
    }
    .tajweed-ghunnah {
        color: #dc2626 !important; /* Red */
        font-weight: bold;
    }
    .tajweed-mad {
        color: #16a34a !important; /* Emerald Green */
        font-weight: bold;
    }
    
    /* Looping Segment Controls */
    .loop-pill {
        background: #f1f5f9;
        border: none;
        padding: 4px 10px;
        border-radius: 99px;
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .loop-pill:hover {
        background: #e2e8f0;
        color: #475569;
        transform: translateY(-1px);
    }
    .loop-pill.active {
        background: #00978A;
        color: #fff;
        box-shadow: 0 2px 6px rgba(0, 151, 138, 0.3);
    }
    .translit-focus-text {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 8px;
        font-style: italic;
    }
    .trans-focus-text {
        font-size: 12px;
        font-weight: 700;
        color: #94a3b8;
        max-width: 320px;
        line-height: 1.4;
    }

    .simulated-wave-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        height: 50px;
        margin: 16px 0;
    }
    .wave-bar {
        width: 4px;
        background: #ff4b4b;
        border-radius: 10px;
        transition: height 0.1s ease;
    }
    .action-helper-txt {
        font-size: 11px;
        font-weight: 800;
        color: #94a3b8;
        text-align: center;
    }
    .pulsing {
        animation: pulseAnimation 1.5s infinite;
    }
    @keyframes pulseAnimation {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }

    /* Record & Compare Styling */
    .compare-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }
    .compare-cards-row {
        display: flex;
        gap: 16px;
    }
    .compare-card {
        flex: 1;
        background: #fafafa;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 20px;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .compare-card h4 {
        font-size: 13px;
        font-weight: 900;
        color: #3c3c3c;
        margin: 0 0 12px;
    }
    .compare-action-btn {
        width: 100%;
        padding: 8px 12px;
        border-radius: 12px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 3px;
        background: #fff;
        font-size: 12px;
        font-weight: 800;
        color: #4b5563;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.1s;
    }
    .compare-action-btn:active {
        transform: translateY(2px);
        border-bottom-width: 1px;
    }
    .compare-action-btn.active {
        border-color: #00978A;
        background: #DBF0EE;
        color: #00978A;
    }
    .compare-action-btn.record.active {
        border-color: #ff4b4b;
        background: #ffebeb;
        color: #ff4b4b;
    }
    .compare-match-btn {
        padding: 10px 20px;
        border-radius: 12px;
        border: 2px solid #00978A;
        border-bottom-width: 4px;
        background: var(--duo-green-light);
        color: #00978A;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .compare-match-btn.active {
        background: #00978A;
        color: #fff;
    }

    /* Multiple Choice Challenge Box */
    .choice-challenge-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }
    .challenge-arabic-blank {
        font-size: 26px;
        line-height: 1.8;
        text-align: center;
        color: #1e293b;
        background: #fafafa;
        border: 2px dashed #cbd5e1;
        border-radius: 20px;
        padding: 24px 16px;
        direction: rtl;
    }
    .choice-options-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .choice-card-button {
        width: 100%;
        display: flex;
        align-items: center;
        background: #fff;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 16px;
        padding: 14px 16px;
        cursor: pointer;
        text-align: left;
        transition: all 0.1s;
    }
    .choice-card-button:hover:not(:disabled) {
        border-color: #cbd5e1;
    }
    .choice-card-button:active:not(:disabled) {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .choice-card-button.selected {
        border-color: #00978A;
        background: #e0f5f3;
    }
    .choice-card-button.selected .choice-index-circle {
        background: #00978A;
        border-color: #00978A;
        color: #fff;
    }
    .choice-card-button.correct {
        border-color: #22c55e;
        background: #f0fdf4;
    }
    .choice-card-button.correct .choice-index-circle {
        background: #22c55e;
        border-color: #22c55e;
        color: #fff;
    }
    .choice-card-button.wrong {
        border-color: #ff4b4b;
        background: #ffebeb;
    }
    .choice-card-button.wrong .choice-index-circle {
        background: #ff4b4b;
        border-color: #ff4b4b;
        color: #fff;
    }
    .choice-index-circle {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        border: 2px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
        color: #94a3b8;
        margin-right: 14px;
        flex-shrink: 0;
    }
    .choice-text {
        font-size: 20px;
        color: #3c3c3c;
        flex: 1;
        text-align: right;
        direction: rtl;
    }

    /* Word Scrambler Box */
    .scramble-challenge-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }
    .scramble-drop-shelf {
        min-height: 100px;
        border-bottom: 2px solid #e2e8f0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 0;
        justify-content: center;
        align-items: center;
        direction: rtl;
    }
    .scramble-drop-shelf.correct { border-color: #22c55e; }
    .scramble-drop-shelf.wrong { border-color: #ff4b4b; }
    
    .drop-shelf-placeholder {
        font-size: 12px;
        font-weight: 700;
        color: #94a3b8;
        font-style: italic;
    }
    .scramble-source-bank {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        padding: 10px 0;
        direction: rtl;
    }
    .scramble-word-pill {
        padding: 10px 16px;
        border: 2px solid #e5e5e5;
        border-bottom-width: 4px;
        border-radius: 12px;
        background: #fff;
        color: #3c3c3c;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.1s;
        direction: rtl;
        font-family: "Amiri", serif;
    }
    .scramble-word-pill:active:not(:disabled) {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }
    .scramble-word-pill.outline {
        border-color: #e2e8f0;
        background: #fff;
    }
    .scramble-word-pill.placed {
        opacity: 0.15;
        pointer-events: none;
        box-shadow: none;
    }

    /* Setor Full Ayat Visuals */
    .setor-quran-graphic {
        font-size: 64px;
        margin-bottom: 12px;
        animation: floatAnimation 2s infinite ease-in-out;
    }
    @keyframes floatAnimation {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    .transcription-box {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 16px;
        width: 100%;
        max-width: 320px;
        margin-top: 16px;
    }
    .trans-pill-tag {
        font-size: 9px;
        font-weight: 900;
        background: #0284c7;
        color: #fff;
        padding: 2px 8px;
        border-radius: 100px;
        display: inline-block;
        margin-bottom: 8px;
    }
    .arabic-transcription {
        font-size: 22px;
        color: #1e293b;
        text-align: center;
        line-height: 1.6;
        direction: rtl;
    }

    /* Duolingo Slide Up Panel */
    .sliding-feedback-panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 80px;
        background: #fff;
        border-top: 2px solid #e2e8f0;
        padding: 16px;
        z-index: 100;
        animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sliding-feedback-panel.correct { background: #dcfce7; border-top-color: #22c55e; }
    .sliding-feedback-panel.wrong { background: #fee2e2; border-top-color: #ff4b4b; }
    
    .feedback-inner-content {
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .feedback-badge {
        font-size: 13px;
        font-weight: 900;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .feedback-badge.correct { color: #166534; }
    .feedback-badge.wrong { color: #991b1b; }
    
    .feedback-msg {
        font-size: 11px;
        font-weight: 700;
        color: #4b5563;
        margin: 0;
        line-height: 1.4;
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }

    /* ============================================
       ANIMASI CORRECT - Confetti + Glow + Bounce
    ============================================ */
    .sliding-feedback-panel.anim-correct {
        animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                   correctFlash 0.6s ease-out;
    }
    .sliding-feedback-panel.anim-correct .feedback-badge {
        animation: badgeBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes correctFlash {
        0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        30%  { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0.35); }
        60%  { box-shadow: 0 0 0 24px rgba(34, 197, 94, 0.15); }
        100% { box-shadow: 0 0 0 32px rgba(34, 197, 94, 0); }
    }

    @keyframes badgeBounce {
        0%   { transform: scale(0.3) translateY(8px); opacity: 0; }
        50%  { transform: scale(1.3) translateY(-4px); opacity: 1; }
        75%  { transform: scale(0.9) translateY(2px); }
        100% { transform: scale(1) translateY(0); }
    }

    /* ============================================
       ANIMASI WRONG - Screen Shake + Red Pulse
    ============================================ */
    .sliding-feedback-panel.anim-wrong {
        animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                   wrongPulse 0.5s ease-out;
    }
    .sliding-feedback-panel.anim-wrong .feedback-badge {
        animation: badgeWobble 0.5s ease-out;
    }

    @keyframes wrongPulse {
        0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        30%  { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0.4); }
        70%  { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0.15); }
        100% { box-shadow: 0 0 0 28px rgba(239, 68, 68, 0); }
    }

    @keyframes badgeWobble {
        0%   { transform: translateX(0); }
        15%  { transform: translateX(-8px) rotate(-3deg); }
        30%  { transform: translateX(7px) rotate(3deg); }
        45%  { transform: translateX(-6px) rotate(-2deg); }
        60%  { transform: translateX(5px) rotate(2deg); }
        75%  { transform: translateX(-3px); }
        100% { transform: translateX(0); }
    }

    /* ============================================
       SPARKLES BURST OVERLAY
    ============================================ */
    .sparkles-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 199;
        overflow: hidden;
    }

    .sparkle-element {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translate(0, 0) scale(0) rotate(0deg);
        filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.7));
    }

    @keyframes sparkleBurst {
        0% {
            opacity: 0;
            transform: translate(0, 0) scale(0) rotate(0deg);
        }
        20% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.25), calc(var(--ty) * 0.25)) scale(1.4) rotate(calc(var(--rot) * 0.5));
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot));
        }
    }

    /* ============================================
       CONFETTI OVERLAY
    ============================================ */
    .confetti-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 200;
    }

    .confetti-particle {
        position: absolute;
        border-radius: 2px;
        opacity: 0;
    }

    .confetti-particle.shape-circle {
        border-radius: 50%;
    }

    .confetti-particle.shape-triangle {
        background: transparent !important;
        width: 0 !important;
        height: 0 !important;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid var(--particle-color, #00978A);
    }

    .confetti-particle.shape-star {
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }

    @keyframes confettiFall {
        0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg);
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 0.7;
        }
        100% {
            opacity: 0;
            transform:
                translateY(calc(var(--speed-y) * 120px))
                translateX(calc(var(--speed-x) * 80px))
                rotate(calc(var(--rot-speed) * 15));
        }
    }

    /* Lesson Footer */
    .lesson-footer-actions {
        border-top: 2px solid #f1f5f9;
        display: flex;
        width: 100%;
        background: #fff;
    }

    /* Congrats Trophy overlay */
    .completed-trophy-img {
        font-size: 64px;
        margin-bottom: 12px;
        animation: zoomBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .congrats-headline {
        font-size: 20px;
        font-weight: 950;
        color: #00978A;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
    }
    .congrats-sub {
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
        margin: 0 0 20px;
        line-height: 1.4;
        padding: 0 16px;
    }
    @keyframes zoomBounce {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.1); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }

    /* Amiri font styling helper */
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    .Amiri {
        font-family: 'Amiri', serif;
    }

    /* Responsive adjustments */
    :global(.desktop-browser) .selector-container {
        max-width: 800px;
        margin: 0 auto;
    }
    :global(.desktop-browser) .lesson-step-wrapper {
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
    }

    /* Screen shake animation */
    .screen.shake {
        animation: screenShake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes screenShake {
        10%, 90% { transform: translate3d(-2px, 0, 0); }
        20%, 80% { transform: translate3d(4px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
        40%, 60% { transform: translate3d(6px, 0, 0); }
    }
</style>
