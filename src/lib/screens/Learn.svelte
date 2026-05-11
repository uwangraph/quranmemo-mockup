<script>
    import { appState } from '$lib/app.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';
    
    let showToast = $state(false);

    const units = [
        { id: 1, title: "Surah Al-Mulk", description: "Mulai perjalanan hafalanmu", color: "#58cc02" }
    ];

    const nodes = [
        { id: 1, type: "review", status: "completed", title: "Murojaah 1-5" },
        { id: 2, type: "review", status: "completed", title: "Murojaah 6-10" },
        { id: 3, type: "lesson", status: "current", title: "Ziyadah 11-15" },
        { id: 4, type: "tadabbur", status: "locked", title: "Tadabbur 11-15" },
        { id: 5, type: "checkpoint", status: "locked", title: "Ujian Halaman 1" },
        { id: 6, type: "lesson", status: "locked", title: "Ziyadah 16-20" },
    ];

    $effect(() => {
        const timer = setTimeout(() => {
            showToast = true;
            setTimeout(() => showToast = false, 4000);
        }, 800);
        return () => clearTimeout(timer);
    });
</script>

<div class="screen">
    <div class="topbar">
        <div class="streak-pill">
            <i class="ti ti-flame"></i> 7
        </div>
        <div style="flex: 1; display: flex; justify-content: center">
            <span style="font-size: 18px; font-weight: 900; color: #58cc02; letter-spacing: -1px;">QuranMemo</span>
        </div>
        <div class="gems-pill" onclick={() => appState.go('shop')}>
            <i class="ti ti-diamond"></i> 120
        </div>
    </div>

    {#if showToast}
        <div class="achievement-toast">
            <div style="font-size: 28px">🥇</div>
            <div style="flex: 1">
                <div style="font-size: 12px; font-weight: 900; color: #cc7000">Streak 7 Hari!</div>
                <div style="font-size: 11px; font-weight: 700; color: #afafaf">Pertahankan cahaya hafalanmu.</div>
            </div>
            <button onclick={() => showToast = false} class="close-toast">✕</button>
        </div>
    {/if}

    <div class="scroll-content no-scrollbar" style="background: #fff;">
        <div class="unit-banner">
            <div style="font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase;">Unit 1</div>
            <div style="font-size: 20px; font-weight: 900; color: #fff;">Surah Al-Mulk</div>
            <div style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 4px;">Kekuasaan Allah yang Maha Luas</div>
        </div>

        <div class="path-container">
            {#each nodes as node, i}
                <div class="node-wrapper" style="margin-left: {i % 2 === 0 ? '20px' : '-20px'}">
                    <button 
                        class="node-btn {node.type} {node.status}" 
                        onclick={() => node.status !== 'locked' && appState.go(node.type === 'tadabbur' ? 'tadabbur' : 'lesson')}
                    >
                        {#if node.type === 'review'}
                            <i class="ti ti-refresh"></i>
                        {:else if node.type === 'tadabbur'}
                            <i class="ti ti-books"></i>
                        {:else if node.type === 'checkpoint'}
                            <i class="ti ti-trophy"></i>
                        {:else}
                            <i class="ti ti-book"></i>
                        {/if}

                        {#if node.status === 'current'}
                            <div class="node-popover">MULAI</div>
                        {/if}
                    </button>
                    <div class="node-title">{node.title}</div>
                </div>

                {#if i < nodes.length - 1}
                    <div class="connector {nodes[i+1].status}"></div>
                {/if}
            {/each}
        </div>

        <div style="height: 100px;"></div>
    </div>

    <BottomNav active="learn" />
</div>

<style>
    .unit-banner {
        background: #58cc02;
        padding: 24px 20px;
        margin: 10px 16px;
        border-radius: 16px;
        box-shadow: 0 4px 0 #46a302;
    }
    .path-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
    }
    .node-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 2;
    }
    .node-btn {
        width: 60px;
        height: 56px;
        border-radius: 50%;
        border: none;
        border-bottom: 6px solid #e5e5e5;
        background: #e5e5e5;
        color: #afafaf;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transition: all 0.1s;
    }
    .node-btn:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
    }

    /* Node Status Colors */
    .node-btn.completed { background: #58cc02; border-bottom-color: #46a302; color: #fff; }
    .node-btn.current { 
        background: #58cc02; border-bottom-color: #46a302; color: #fff; 
        animation: pulse 2s infinite;
    }
    .node-btn.locked { background: #e5e5e5; border-bottom-color: #afafaf; color: #afafaf; cursor: not-allowed; }

    /* Node Types Styling */
    .node-btn.tadabbur.completed { background: #ce82ff; border-bottom-color: #a52adb; }
    .node-btn.checkpoint.completed { background: #ffc800; border-bottom-color: #e5a000; }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(88, 204, 2, 0); }
        100% { box-shadow: 0 0 0 0 rgba(88, 204, 2, 0); }
    }

    .node-popover {
        position: absolute;
        top: -40px;
        background: #fff;
        border: 2px solid #e5e5e5;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 900;
        color: #58cc02;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .node-popover::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #e5e5e5;
    }

    .node-title {
        font-size: 13px;
        font-weight: 800;
        color: #3c3c3c;
        margin-top: 8px;
    }

    .connector {
        width: 8px;
        height: 40px;
        background: #e5e5e5;
        margin: 4px 0;
        z-index: 1;
    }
    .connector.completed, .connector.current { background: #d7ffb2; }

    .achievement-toast {
        position: absolute;
        top: 70px;
        left: 12px;
        right: 12px;
        background: #fff;
        border-radius: 16px;
        border: 2px solid #ffc800;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 100;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: slideDown 0.4s ease-out;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .close-toast { background: none; border: none; cursor: pointer; color: #afafaf; font-size: 18px; }
    .streak-pill { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800; color: #ff9600; }
    .gems-pill { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 800; color: #ce82ff; cursor: pointer; }
</style>
