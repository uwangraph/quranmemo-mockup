<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';
    
    // Import modular components
    import BreakModal from '$lib/components/lesson/BreakModal.svelte';
    import LessonCompletion from '$lib/components/lesson/LessonCompletion.svelte';
    import StepRecallPrev from '$lib/components/lesson/StepRecallPrev.svelte';
    import StepReadListen from '$lib/components/lesson/StepReadListen.svelte';
    import StepListenRepeat from '$lib/components/lesson/StepListenRepeat.svelte';
    import StepRecordCompare from '$lib/components/lesson/StepRecordCompare.svelte';
    import StepChoiceChallenge from '$lib/components/lesson/StepChoiceChallenge.svelte';
    import StepScrambleChallenge from '$lib/components/lesson/StepScrambleChallenge.svelte';
    import StepSetorFull from '$lib/components/lesson/StepSetorFull.svelte';
    import MotivationalFooter from '$lib/components/lesson/MotivationalFooter.svelte';

    
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

    // === MOTIVATIONAL MESSAGES ===
    const motivationalMessages = [
        "Subhanallah! Lanjutkan! 🌟",
        "Bagus sekali! +1 ayat hafal 📖",
        "Semangat! Terus istiqomah 💪",
        "Masha Allah, hebat! ✨",
        "Satu langkah lebih dekat ke hati Al-Quran 💚",
        "Allah mencintai orang yang istiqomah 🤲",
        "Keren! Ayat berikutnya siap? 🚀",
        "Luar biasa! Terus dijaga ya hafalannya 🏆",
        "Yakin bisa! Kamu hebat 🔥",
        "Jangan lupa muroja'ah nanti ya! 📿",
        "Alhamdulillah! Semakin lancar 🎯",
        "Tabaarakallah, menginspirasi! 🌙"
    ];
    let currentMotivation = $state('');

    function triggerCorrect() {
        playCorrectSound();
        spawnConfetti();
        spawnSparkles();
        feedbackAnimClass = 'anim-correct';
        currentMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        setTimeout(() => feedbackAnimClass = '', 800);

        // Auto-play full ayat as reward on quiz/puzzle stages
        const quizTypes = ['fill_front', 'fill_back', 'puzzle_one', 'puzzle_two', 'audio_scramble', 'puzzle_total'];
        if (quizTypes.includes(currentStepConfig?.type) && audio) {
            setTimeout(() => {
                audio.currentTime = 0;
                audio.playbackRate = 1.0;
                audio.play();
            }, 600);
        }
    }

    function triggerWrong() {
        playWrongSound();
        feedbackAnimClass = 'anim-wrong';
        screenShaking = true;
        setTimeout(() => {
            screenShaking = false;
            feedbackAnimClass = '';
        }, 600);

        // Play full ayat as learning support when answer is wrong, as requested in docs/FEEDBACK.md
        const quizTypes = ['fill_front', 'fill_back', 'puzzle_one', 'puzzle_two', 'audio_scramble', 'puzzle_total'];
        if (quizTypes.includes(currentStepConfig?.type) && audio) {
            setTimeout(() => {
                audio.currentTime = 0;
                audio.playbackRate = 1.0;
                audio.play();
            }, 600);
        }
    }

    // === LOOPER & PER-WORD AUDIO STATE ===
    let loopTimes = $state(1); // 1x, 2x, 3x, 5x, 10x, ∞
    let currentLoopIndex = $state(0);

    // Audio per kata - menggunakan Web Speech API Saudi Arabian Arabic
    function playWordAudio(wordText) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // batalkan audio kata yang sedang jalan
            
            // Haptic vibration feedback ringan jika didukung browser
            if (navigator.vibrate) {
                navigator.vibrate(25);
            }

            // Peta pengucapan kata (non-waqaf untuk tengah ayat, waqaf untuk akhir ayat)
            const phoneticMap = {
                // Kata Tengah Ayat (Di-washal / Dibaca sambung)
                "أَلَمْ": "أَلَمْ",
                "نَشْرَحْ": "نَشْرَحْ",
                "لَكَ": "لَكَا",
                "وَوَضَعْنَا": "وَوَضَعْنَا",
                "عَنكَ": "عَنْكَا",
                "ٱلَّذِىٓ": "ٱلَّذِي",
                "أَنقَضَ": "أَنْقَضَا",
                "وَرَفَعْنَا": "وَرَفَعْنَا",
                "فَإِنَّ": "فَإِنَّ",
                "إِنَّ": "إِنَّ",
                "مَعَ": "مَعَا",
                "ٱلْعُسْرِ": "ٱلْعُسْرِي",
                "فَإِذَا": "فَإِذَا",
                "فَرَغْتَ": "فَرَغْتَا",
                "وَإِلَىٰ": "وَإِلَى",
                "رَبِّكَ": "رَبِّكَا",

                // Kata Akhir Ayat (Di-waqaf / Dihentikan sesuai tajwid asli)
                "صَدْرَكَ": "صَدْرَكْ",
                "وِزْرَكَ": "وِزْرَكْ",
                "ظَهْرَكَ": "ظَهْرَكْ",
                "ذِكْرَكَ": "ذِكْرَكْ",
                "يُسْرًا": "يُسْرَا", // Mad 'Iwadh pada waqaf: dibaca yusraa, bukan yusran
                "فَٱنصَبْ": "فَانْصَبْ",
                "فَٱرْغَبْ": "فَارْغَبْ"
            };

            const ttsText = phoneticMap[wordText] || wordText;

            const utterance = new SpeechSynthesisUtterance(ttsText);
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
            "أَلَمْ": `أَلَ<span class="tajweed-hitam">مْ</span>`, // Idzhar Syafawi
            "نَشْرَحْ": `نَشْرَحْ`,
            "لَكَ": `لَكَ`,
            "صَدْرَكَ": `صَ<span class="tajweed-biru-pekat">دْ</span>رَكَ`, // Qalqalah Sughra
            
            // Ayat 2
            "وَوَضَعْنَا": `وَوَضَعْنَا`,
            "عَنكَ": `عَ<span class="tajweed-hijau">نكَ</span>`, // Ikhfa
            "وِزْرَكَ": `وِزْرَكَ`,
            
            // Ayat 3
            "ٱلَّذِىٓ": `ٱلَّذِ<span class="tajweed-hijau">ىٓ</span>`, // Madd Jaiz Munfasil
            "أَنقَضَ": `أَ<span class="tajweed-hijau">نقَ</span>ضَ`, // Ikhfa
            "ظَهْرَكَ": `ظَهْرَكَ`,
            
            // Ayat 4
            "وَرَفَعْنَا": `وَرَفَعْنَا`,
            "لَكَ": `لَكَ`,
            "ذِكْرَكَ": `ذِكْرَكَ`,
            
            // Ayat 5 & 6
            "فَإِنَّ": `فَإِ<span class="tajweed-ungu">نَّ</span>`, // Gunnah
            "إِنَّ": `إِ<span class="tajweed-ungu">نَّ</span>`, // Gunnah
            "مَعَ": `مَعَ`,
            "ٱلْعُسْرِ": `ٱلْعُسْرِ`,
            "يُسْرًا": `يُسْرًا`, 
            
            // Ayat 7
            "فَإِذَا": `فَإِذَا`,
            "فَرَغْتَ": `فَرَغْتَ`,
            "فَٱنصَبْ": `فَ<span class="tajweed-hijau">ٱنصَ</span><span class="tajweed-biru-pekat">بْ</span>`, // Ikhfa & Qalqalah Kubra
            
            // Ayat 8
            "وَإِلَىٰ": `وَإِلَىٰ`,
            "رَبِّكَ": `رَبِّكَ`,
            "فَٱرْغَبْ": `فَٱرْغَ<span class="tajweed-biru-pekat">بْ</span>` // Qalqalah Kubra
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
            if (isPlaying && (loopTimes === Infinity || currentLoopIndex < loopTimes - 1)) {
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
                        // Generate a subtle impulse response — short decay so articulation stays clear
                        const rate = ctx.sampleRate;
                        const length = rate * 0.6; // 0.6s decay (was 2.5s — too roomy)
                        const impulse = ctx.createBuffer(2, length, rate);
                        for (let i = 0; i < length; i++) {
                            const decay = Math.exp(-i / (rate * 0.15)); // fast decay tail
                            impulse.getChannelData(0)[i] = (Math.random() * 2 - 1) * decay;
                            impulse.getChannelData(1)[i] = (Math.random() * 2 - 1) * decay;
                        }
                        convolver.buffer = impulse;
                        
                        const dryGain = ctx.createGain();
                        const wetGain = ctx.createGain();
                        dryGain.gain.value = 1.0;  // 100% original — keep voice crisp and upfront
                        wetGain.gain.value = 0.08; // 8% reverb — subtle warmth only (was 50%)
                        
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

    let showBreakModal = $state(false);
    function toggleBreak() {
        showBreakModal = !showBreakModal;
        if (showBreakModal && audio) audio.pause();
        if (showBreakModal) isPlaying = false;
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
        <button onclick={toggleBreak} style="background: none; border: none; cursor: pointer; display: flex; align-items: center; margin-right: 8px;" title="Istirahat">
            <i class="ti ti-coffee" style="font-size: 18px; color: #f59e0b;"></i>
        </button>
        <div class="xp-pill">
            <i class="ti ti-bolt-filled"></i> {Math.round(((currentStep + 1) / stepsPipeline.length) * 100)} XP
        </div>
    </div>

    <div class="scroll-content no-scrollbar" style="background: #fff; display: flex; flex-direction: column;">
        <!-- 2. GAME STEPS INTERACTIVE SCREEN -->
        <div class="lesson-step-wrapper" style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                

                <h3 class="step-title-display">{currentStepConfig.title}</h3>
                <p class="step-description">{currentStepConfig.desc}</p>
                
                <div class="exercise-card-container">
                    {#if currentStepConfig.type === 'recall_prev'}
                        {@const previousVerse = alInsyirahVerses[selectedVerseIndex - 1]}
                        <StepRecallPrev 
                            {previousVerse}
                            bind:recallMethod
                            {recordState}
                            {simulatedWaves}
                            {isPlayingRecorded}
                            bind:recallSelectedOptionIdx
                            {isChecked}
                            {selectedVerseIndex}
                            {startSimulatedRecording}
                            {playWordAudio}
                            {getTajweedHTML}
                        />

                    <!-- ==================== STEP 1: LIHAT & DENGAR ==================== -->
                    {:else if currentStepConfig.type === 'read_listen'}
                        <StepReadListen 
                            {activeVerse}
                            {currentWordIndex}
                            {isPlaying}
                            {audio}
                            bind:loopTimes
                            {playWordAudio}
                            {togglePlay}
                            {togglePlaySlow}
                            {setupAudio}
                            {getTajweedHTML}
                        />
                        
                    <!-- ==================== STEP 2: TIRU & IKUTI ==================== -->
                    {:else if currentStepConfig.type === 'listen_repeat'}
                        <StepListenRepeat 
                            {activeVerse}
                            {currentWordIndex}
                            {isPlaying}
                            {audio}
                            bind:loopTimes
                            {recordState}
                            {isPlayingRecorded}
                            {simulatedWaves}
                            {playWordAudio}
                            {togglePlay}
                            {togglePlaySlow}
                            {setupAudio}
                            {getTajweedHTML}
                            {startSimulatedRecording}
                            {togglePlayRecorded}
                        />

                    <!-- ==================== STEP 3: REKAM & BANDINGKAN ==================== -->
                    {:else if currentStepConfig.type === 'record_compare'}
                        <StepRecordCompare 
                            {isPlaying}
                            {recordState}
                            {isComparing}
                            {isPlayingRecorded}
                            {simulatedWaves}
                            {togglePlay}
                            {startSimulatedRecording}
                            {startComparePlay}
                        />

                    <!-- ==================== STEP 4: ISI BAGIAN AWAL ==================== -->
                    {:else if currentStepConfig.type === 'fill_front'}
                        <StepChoiceChallenge 
                            type="fill_front"
                            {activeVerse}
                            bind:selectedOptionIdx
                            {isChecked}
                            {isCorrect}
                            {getTajweedHTML}
                            {playWordAudio}
                            {togglePlay}
                        />

                    <!-- ==================== STEP 5: ISI BAGIAN AKHIR ==================== -->
                    {:else if currentStepConfig.type === 'fill_back'}
                        <StepChoiceChallenge 
                            type="fill_back"
                            {activeVerse}
                            bind:selectedOptionIdx
                            {isChecked}
                            {isCorrect}
                            {getTajweedHTML}
                            {playWordAudio}
                            {togglePlay}
                        />

                    <!-- ==================== STEP 6: AUDIO SCRAMBLE ==================== -->
                    {:else if currentStepConfig.type === 'audio_scramble'}
                        <StepScrambleChallenge 
                            type="audio_scramble"
                            {activeVerse}
                            {isChecked}
                            {isCorrect}
                            {isPlaying}
                            {audio}
                            bind:loopTimes
                            {setupAudio}
                            {scrambledWords}
                            bind:selectedWords
                            {togglePlay}
                            {togglePlaySlow}
                            {toggleWordSelection}
                            {playWordAudio}
                            {getTajweedHTML}
                        />

                    <!-- ==================== STEP 7: PUZZLE 1 KATA HILANG ==================== -->
                    {:else if currentStepConfig.type === 'puzzle_one'}
                        <StepChoiceChallenge 
                            type="puzzle_one"
                            {activeVerse}
                            bind:selectedOptionIdx
                            {isChecked}
                            {isCorrect}
                            {getTajweedHTML}
                            {playWordAudio}
                            {togglePlay}
                        />

                    <!-- ==================== STEP 8: PUZZLE 2 KATA HILANG ==================== -->
                    {:else if currentStepConfig.type === 'puzzle_two'}
                        <StepScrambleChallenge 
                            type="puzzle_two"
                            {activeVerse}
                            {isChecked}
                            {isCorrect}
                            {isPlaying}
                            {audio}
                            {scrambledWords}
                            bind:selectedWords
                            {togglePlay}
                            {togglePlaySlow}
                            {toggleWordSelection}
                            {playWordAudio}
                            {getTajweedHTML}
                        />

                    <!-- ==================== STEP 9: PUZZLE TOTAL (SEMUA ACAK) ==================== -->
                    {:else if currentStepConfig.type === 'puzzle_total'}
                        <StepScrambleChallenge 
                            type="puzzle_total"
                            {activeVerse}
                            {isChecked}
                            {isCorrect}
                            {isPlaying}
                            {audio}
                            {scrambledWords}
                            bind:selectedWords
                            {togglePlay}
                            {togglePlaySlow}
                            {toggleWordSelection}
                            {playWordAudio}
                            {getTajweedHTML}
                        />

                    <!-- ==================== STEP 10: SETOR FULL AYAT ==================== -->
                    {:else if currentStepConfig.type === 'setor_full'}
                        <StepSetorFull 
                            type="setor_full"
                            {activeVerse}
                            {alInsyirahVerses}
                            {selectedVerseIndex}
                            {recordState}
                            {simulatedWaves}
                            {isPlayingRecorded}
                            {isPlaying}
                            {startSimulatedRecording}
                            {togglePlayRecorded}
                            {togglePlay}
                        />

                    <!-- ==================== STEP 11: RECALL LEVEL 1 ==================== -->
                    {:else if currentStepConfig.type === 'recall_level1'}
                        <StepSetorFull 
                            type="recall_level1"
                            {activeVerse}
                            {alInsyirahVerses}
                            {selectedVerseIndex}
                            {recordState}
                            {simulatedWaves}
                            {isPlayingRecorded}
                            {isPlaying}
                            {startSimulatedRecording}
                            {togglePlayRecorded}
                            {togglePlay}
                        />

                    <!-- ==================== STEP 12: RECALL LEVEL 2 ==================== -->
                    {:else if currentStepConfig.type === 'recall_level2'}
                        <StepSetorFull 
                            type="recall_level2"
                            {activeVerse}
                            {alInsyirahVerses}
                            {selectedVerseIndex}
                            {recordState}
                            {simulatedWaves}
                            {isPlayingRecorded}
                            {isPlaying}
                            {startSimulatedRecording}
                            {togglePlayRecorded}
                            {togglePlay}
                        />
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
                <MotivationalFooter {isChecked} {isCorrect} {feedbackAnimClass} {currentMotivation} />
                
                <!-- Action Footer Buttons -->
                <div class="lesson-footer-actions" style="margin-top: auto; padding: 12px 0 0;">
                    {#if currentStepConfig.type === 'read_listen'}
                        <button class="btn-duo btn-green" onclick={checkAnswer}>
                            SAYA SUDAH HAFAL & PAHAM
                        </button>
                    {:else if (currentStepConfig.type === 'setor_full' || currentStepConfig.type === 'recall_level1' || currentStepConfig.type === 'recall_level2') && recordState === 'recorded'}
                        {#if !isChecked}
                            <div style="display: flex; gap: 12px; width: 100%;">
                                <button class="btn-duo" style="background: #fee2e2; border-color: #fca5a5; color: #b91c1c; border-bottom-width: 4px;" onclick={() => { recordState = 'idle'; isPlayingRecorded = false; if (audio) audio.pause(); isPlaying = false; }}>
                                    🎤 ULANG REKAM
                                </button>
                                <button class="btn-duo btn-green" style="flex: 1;" onclick={() => { isCorrect = true; checkAnswer(); }}>
                                    👍 CUKUP & LANJUT
                                </button>
                            </div>
                        {:else}
                            <button class="btn-duo btn-green" onclick={checkAnswer}>
                                LANJUTKAN
                            </button>
                        {/if}
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

    <!-- Break/Istirahat Modal -->
    <BreakModal bind:showBreakModal={showBreakModal} onContinue={toggleBreak} onExit={exitLesson} />

    <!-- 3. COMPLETED ALL STAGES SCREEN OVERLAY -->
    <LessonCompletion bind:showCompletion={showCompletion} {selectedVerseIndex} {activeVerse} {lessonEarnedXP} {lessonEarnedCoins} onFinish={exitLesson} />
</div>

<style>
    /* Reset & Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    
    .Amiri { font-family: 'Amiri', serif; }

    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #fff;
        font-family: 'Inter', sans-serif;
        overflow: hidden;
    }

    /* Header & Progress */
    .lesson-header {
        padding: 16px 20px;
        background: #fff;
        border-bottom: 2px solid #f1f5f9;
        flex-shrink: 0;
        z-index: 10;
    }
    .header-top {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
    }
    .back-btn {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        transition: all 0.2s;
    }
    .back-btn:hover { background: #f1f5f9; color: #64748b; }
    
    .progress-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .progress-track {
        flex: 1;
        height: 14px;
        background: #f1f5f9;
        border-radius: 99px;
        overflow: hidden;
    }
    .progress-fill {
        height: 100%;
        background: #00978A;
        border-radius: 99px;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    }
    .progress-fill::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 8px;
        right: 8px;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 4px;
    }
    .progress-text {
        font-size: 13px;
        font-weight: 800;
        color: #00978A;
        min-width: 40px;
        text-align: right;
    }
    .hearts-container {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #fff0f0;
        padding: 6px 12px;
        border-radius: 99px;
    }
    .heart-icon { font-size: 16px; color: #ff4b4b; animation: heartBeat 2s infinite; }
    .heart-count { font-size: 14px; font-weight: 800; color: #ff4b4b; }

    @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.15); }
        30% { transform: scale(1); }
        45% { transform: scale(1.15); }
        60% { transform: scale(1); }
    }

    /* Lesson Content Area */
    .lesson-content-wrapper {
        flex: 1;
        overflow-y: auto;
        padding: 24px 20px 0;
        display: flex;
        flex-direction: column;
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

    /* Confetti & Sparkles Overlay */
    .confetti-overlay, .sparkles-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
        z-index: 100;
        overflow: hidden;
    }
    .confetti-particle {
        position: absolute;
        border-radius: 4px;
        opacity: 0;
    }
    .confetti-particle.shape-circle { border-radius: 50%; }
    .sparkle-element {
        position: absolute;
        top: 50%; left: 50%;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
    }
    @keyframes sparkleBurst {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        20% { opacity: 1; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1) rotate(calc(var(--rot) / 2)); }
        80% { opacity: 1; transform: translate(calc(-50% + var(--tx) * 1.5), calc(-50% + var(--ty) * 1.5)) scale(0.8) rotate(var(--rot)); }
        100% { opacity: 0; transform: translate(calc(-50% + var(--tx) * 2), calc(-50% + var(--ty) * 2)) scale(0) rotate(calc(var(--rot) * 1.5)); }
    }
    @keyframes confettiFall {
        0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
        20% { opacity: 1; }
        80% { opacity: 0.7; }
        100% {
            opacity: 0;
            transform: translateY(calc(var(--speed-y) * 120px)) translateX(calc(var(--speed-x) * 80px)) rotate(calc(var(--rot-speed) * 15));
        }
    }

    /* Lesson Footer */
    .lesson-footer-actions {
        border-top: 2px solid #f1f5f9;
        display: flex;
        width: 100%;
        background: #fff;
    }
    .btn-duo {
        width: 100%;
        padding: 16px;
        border-radius: 16px;
        font-size: 15px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: none;
        border-bottom: 4px solid;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .btn-duo:active:not(:disabled) {
        transform: translateY(4px);
        border-bottom-width: 0;
        margin-top: 4px;
    }
    .btn-duo.outline {
        background: #fff;
        color: #00978A;
        border-color: #e5e5e5;
    }
    .btn-duo.btn-green {
        background: #00978A;
        color: #fff;
        border-color: #007A70;
    }
    .btn-duo.btn-red {
        background: #ff4b4b;
        color: #fff;
        border-color: #d63d3d;
    }
    .btn-duo:disabled, .btn-disabled {
        background: #e5e5e5;
        color: #afafaf;
        border-color: #d4d4d4;
        cursor: not-allowed;
    }

    /* Screen Shake Animation for wrong answers */
    .screenShake {
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
