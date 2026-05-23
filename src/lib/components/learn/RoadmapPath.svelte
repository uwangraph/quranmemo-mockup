<script>
    import { appState } from '$lib/app.svelte.js';
    import { i18n } from '$lib/i18n.svelte.js';

    const pathConfig = $derived.by(() => {
        const lp = appState.user.learningPath;
        if (lp === 'pro') {
            return {
                unitTitle: i18n.t('learn.unit_title_pro'),
                unitDesc: i18n.t('learn.unit_desc_pro'),
                badge: "PRO LEVEL"
            };
        } else if (lp === 'mid') {
            return {
                unitTitle: i18n.t('learn.unit_title_mid'),
                unitDesc: i18n.t('learn.unit_desc_mid'),
                badge: "MID LEVEL"
            };
        } else {
            return {
                unitTitle: i18n.t('learn.unit_title_beginner'),
                unitDesc: i18n.t('learn.unit_desc_beginner'),
                badge: "BEGINNER LEVEL"
            };
        }
    });

    const nodes = $derived.by(() => {
        const progress = appState.user.progress.surah_094;
        const getStatus = (idx) => progress > idx ? "completed" : (progress === idx ? "current" : "locked");
        
        const lp = appState.user.learningPath;

        if (lp === 'pro') {
            return [
                { id: 1, type: "lesson", verseIndex: 0, status: getStatus(0), title: `${i18n.t('learn.page')} 1` },
                { id: 2, type: "lesson", verseIndex: 1, status: getStatus(1), title: `${i18n.t('learn.page')} 2` },
                { id: 3, type: "tadabbur", status: progress >= 2 ? "completed" : "locked", title: `${i18n.t('learn.tadabbur_pages')} 1-2` },
                { id: 4, type: "lesson", verseIndex: 2, status: getStatus(2), title: `${i18n.t('learn.page')} 3` },
                { id: 5, type: "lesson", verseIndex: 3, status: getStatus(3), title: `${i18n.t('learn.page')} 4` },
                { id: 6, type: "lesson", verseIndex: 4, status: getStatus(4), title: `${i18n.t('learn.page')} 5` },
                { id: 7, type: "checkpoint", verseIndex: 4, status: progress >= 5 ? "current" : "locked", title: `${i18n.t('learn.submit_part')} 1` }
            ];
        } else if (lp === 'mid') {
            return [
                { id: 1, type: "lesson", verseIndex: 0, status: getStatus(0), title: "Al-Mulk (1-15)" },
                { id: 2, type: "lesson", verseIndex: 1, status: getStatus(1), title: "Al-Mulk (16-30)" },
                { id: 3, type: "checkpoint", verseIndex: 1, status: progress >= 2 ? "completed" : "locked", title: `${i18n.t('learn.submit_part')} Al-Mulk` },
                { id: 4, type: "lesson", verseIndex: 2, status: getStatus(2), title: "Al-Qalam" },
                { id: 5, type: "lesson", verseIndex: 3, status: getStatus(3), title: "Al-Haqqah" },
                { id: 6, type: "tadabbur", status: progress >= 4 ? "current" : "locked", title: `Tadabbur T1` },
                { id: 7, type: "checkpoint", verseIndex: 3, status: progress >= 5 ? "locked" : "locked", title: `${i18n.t('learn.submit_ladder')} 1` }
            ];
        } else {
            return [
                { id: 1, type: "lesson", verseIndex: 0, status: getStatus(0), title: `${i18n.t('learn.verse')} 1` },
                { id: 2, type: "lesson", verseIndex: 1, status: getStatus(1), title: `${i18n.t('learn.verse')} 2` },
                { id: 3, type: "lesson", verseIndex: 2, status: getStatus(2), title: `${i18n.t('learn.verse')} 3` },
                { id: 4, type: "tadabbur", status: progress >= 3 ? "completed" : "locked", title: `Tadabbur 1-3` },
                { id: 5, type: "lesson", verseIndex: 3, status: getStatus(3), title: `${i18n.t('learn.verse')} 4` },
                { id: 6, type: "lesson", verseIndex: 4, status: getStatus(4), title: `${i18n.t('learn.verse')} 5` },
                { id: 7, type: "lesson", verseIndex: 5, status: getStatus(5), title: `${i18n.t('learn.verse')} 6` },
                { id: 8, type: "lesson", verseIndex: 6, status: getStatus(6), title: `${i18n.t('learn.verse')} 7` },
                { id: 9, type: "lesson", verseIndex: 7, status: getStatus(7), title: `${i18n.t('learn.verse')} 8` },
                { id: 10, type: "checkpoint", verseIndex: 7, status: progress >= 8 ? "current" : "locked", title: `${i18n.t('learn.submit_full_surah')}` }
            ];
        }
    });



    function handleNodeClick(node) {
        if (node.status === 'locked') return;

        if (node.type === 'lesson' || node.type === 'checkpoint') {
            appState.selectedVerseIndex = node.verseIndex;
            appState.selectedNodeType = node.type;
            appState.updateQuestProgress('q3', 1);
            appState.saveUser();
            appState.go('lesson');
        } else {
            appState.go(node.type);
        }
    }


</script>

<div class="path-column">
    <div class="unit-banner">
        <!-- Islamic Pattern Background Elements -->
        <div class="islamic-motif motif-1"></div>
        <div class="islamic-motif motif-2"></div>
        
        <div class="unit-badge" style="position: relative; z-index: 2;">{pathConfig.badge}</div>
        <div style="font-size: 22px; font-weight: 900; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.1); position: relative; z-index: 2;">{pathConfig.unitTitle}</div>
        <div style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 4px; position: relative; z-index: 2;">{pathConfig.unitDesc}</div>
        <button class="unit-guide-btn" style="position: relative; z-index: 2; border: none; font-family: inherit;" onclick={() => appState.go('guide')}>
            <i class="ti ti-notebook"></i> {i18n.t('learn.guide') || 'GUIDE'}
        </button>
    </div>

    <div class="path-container">
        {#each nodes as node, i}
            <div class="node-wrapper" style="margin-left: {i % 2 === 0 ? '20px' : '-20px'}">
                <button 
                    class="node-btn {node.type} {node.status}" 
                    onclick={() => handleNodeClick(node)}
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
                        <div class="node-popover">{i18n.t('learn.start')}</div>
                    {/if}
                </button>
                <div class="node-title">{node.title}</div>
            </div>

            {#if i < nodes.length - 1}
                <div class="connector {nodes[i+1].status}"></div>
            {/if}
        {/each}
    </div>

    <!-- Daily goal card: visible only in mobile phone mockup -->
    <div class="daily-goal-card mobile-only-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 900; color: #3c3c3c;">{i18n.t('learn.free_points_target')}</span>
            <span style="font-size: 12px; font-weight: 800; color: #afafaf;">24 / 60</span>
        </div>
        <div class="goal-bar-bg">
            <div class="goal-bar-fill" style="width: 40%"></div>
        </div>
        <div style="font-size: 10px; font-weight: 700; color: #afafaf; margin-top: 6px; display: flex; align-items: center; gap: 4px;">
            <i class="ti ti-info-circle"></i> {i18n.t('learn.reset_info')}
        </div>
    </div>
</div>

<style>
    .path-column { width: 100%; }
    :global(.desktop-browser) .path-column { flex: 1; max-width: 700px; }
    :global(.tablet) .path-column { width: 100%; max-width: 100%; }

    .unit-banner {
        background: linear-gradient(135deg, var(--duo-green), var(--duo-green-dark));
        padding: 24px 20px;
        margin: 10px 16px 20px;
        border-radius: 20px;
        box-shadow: 0 6px 0 #00665d;
        position: relative;
        overflow: hidden;
    }
    :global(.desktop-browser) .unit-banner, :global(.tablet) .unit-banner { margin: 0; }
    
    .islamic-motif {
        position: absolute;
        width: 180px;
        height: 180px;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z' fill='rgba(255,255,255,0.08)'/%3E%3Cpath d='M15 15 L50 35 L85 15 L65 50 L85 85 L50 65 L15 85 L35 50 Z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
    }
    .motif-1 { right: -40px; top: -40px; transform: rotate(22.5deg); }
    .motif-2 { left: -50px; bottom: -50px; transform: rotate(45deg) scale(0.7); }

    .unit-badge { font-size: 11px; font-weight: 900; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .unit-guide-btn {
        display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.15); color: #fff;
        padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 800; margin-top: 12px; cursor: pointer;
    }
    .path-container { display: flex; flex-direction: column; align-items: center; padding-top: 30px; }
    .node-wrapper { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; }
    .node-btn {
        width: 60px; height: 56px; border-radius: 50%; border: none; border-bottom: 6px solid #e5e5e5;
        background: #e5e5e5; color: #afafaf; font-size: 24px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; position: relative; transition: all 0.1s;
    }
    .node-btn:active { transform: translateY(2px); border-bottom-width: 2px; }

    .node-btn.completed { background: var(--duo-green); border-bottom-color: var(--duo-green-dark); color: #fff; }
    .node-btn.current { background: var(--duo-green); border-bottom-color: var(--duo-green-dark); color: #fff; animation: pulse 2s infinite; }
    .node-btn.locked { background: #e5e5e5; border-bottom-color: #afafaf; color: #afafaf; cursor: not-allowed; }

    .node-btn.tadabbur.completed { background: #ce82ff; border-bottom-color: #a52adb; }
    .node-btn.checkpoint.completed { background: #ffc800; border-bottom-color: #e5a000; }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 151, 138, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(0, 151, 138, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 151, 138, 0); }
    }

    .node-popover {
        position: absolute; top: -40px; background: #fff; border: 2px solid #e5e5e5; padding: 4px 12px;
        border-radius: 8px; font-size: 11px; font-weight: 900; color: var(--duo-green); box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .node-popover::after {
        content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
        border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #e5e5e5;
    }
    .node-title { font-size: 13px; font-weight: 800; color: #3c3c3c; margin-top: 8px; }
    .connector { width: 8px; height: 40px; background: #e5e5e5; margin: 4px 0; z-index: 1; }
    .connector.completed, .connector.current { background: #d7ffb2; }

    .daily-goal-card { background: #fff; border: 2px solid #e5e5e5; border-radius: 16px; padding: 14px; margin-top: 20px; }
    .mobile-only-card { margin: 0 16px 20px; display: block; }
    :global(.desktop-browser) .mobile-only-card { display: none; }
    :global(.tablet) .mobile-only-card { display: block; margin: 0 0 20px; }
    .goal-bar-bg { height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden; }
    .goal-bar-fill { height: 100%; background: #ff9600; border-radius: 4px; }

</style>
