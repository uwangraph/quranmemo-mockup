<script>
    import { appState } from '$lib/app.svelte.js';
    import BottomNav from '../components/BottomNav.svelte';

    const rankings = [
        { name: "Anda", xp: 1250, rank: 3, isMe: true, avatar: "👤" },
        { name: "Siti Nurhaliza", xp: 1420, rank: 1, avatar: "🧕" },
        { name: "Ahmad Dani", xp: 1380, rank: 2, avatar: "🧔" },
        { name: "Budi Utomo", xp: 1100, rank: 4, avatar: "👨" },
        { name: "Sarah Wijayanto", xp: 950, rank: 5, avatar: "👩" },
        { name: "Rizky Billar", xp: 800, rank: 6, avatar: "👦" },
    ].sort((a, b) => b.xp - a.xp).map((item, i) => ({ ...item, rank: i + 1 }));
</script>

<div class="screen">
    <div class="topbar">
        <span style="font-size: 16px; font-weight: 900; color: #3c3c3c; flex: 1; text-align: center;">Liga Fastabiqul Khairat</span>
    </div>

    <div class="scroll-content no-scrollbar">
        <div class="league-header">
            <div class="league-icon">🏆</div>
            <div style="text-align: center; margin-top: 10px;">
                <div style="font-size: 18px; font-weight: 900; color: #3c3c3c;">Liga Safir</div>
                <div style="font-size: 12px; font-weight: 700; color: #afafaf;">Berakhir dalam 2 hari 4 jam</div>
            </div>
            
            <div class="promotion-zone">
                <div style="font-size: 10px; font-weight: 900; color: #58cc02; text-transform: uppercase;">Zona Promosi</div>
                <div style="font-size: 11px; font-weight: 700; color: #afafaf;">Top 5 naik ke Liga Berlian</div>
            </div>
        </div>

        <div class="ranking-list">
            {#each rankings as r}
                <div class="rank-item" class:is-me={r.isMe}>
                    <div class="rank-num">{r.rank}</div>
                    <div class="rank-avatar">{r.avatar}</div>
                    <div style="flex: 1">
                        <div style="font-size: 14px; font-weight: 800; color: #3c3c3c;">{r.name}</div>
                        {#if r.isMe}
                            <div style="font-size: 10px; font-weight: 800; color: #58cc02;">ZONA PROMOSI</div>
                        {/if}
                    </div>
                    <div style="text-align: right">
                        <div style="font-size: 14px; font-weight: 900; color: #3c3c3c;">{r.xp}</div>
                        <div style="font-size: 10px; font-weight: 700; color: #afafaf;">XP</div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <BottomNav active="league" />
</div>

<style>
    .league-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 20px;
        background: #fff;
        border-bottom: 2px solid #e5e5e5;
    }
    .league-icon {
        font-size: 64px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }
    .promotion-zone {
        margin-top: 16px;
        padding: 8px 16px;
        background: #f7f7f7;
        border-radius: 12px;
        text-align: center;
        border: 2px solid #e5e5e5;
    }
    .ranking-list {
        padding: 0 16px;
        margin-top: 16px;
    }
    .rank-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 16px;
        margin-bottom: 8px;
        background: #fff;
        border: 2px solid transparent;
    }
    .rank-item.is-me {
        background: #ddf4ff;
        border-color: #1cb0f6;
    }
    .rank-num {
        font-size: 14px;
        font-weight: 900;
        color: #afafaf;
        width: 20px;
    }
    .is-me .rank-num { color: #1cb0f6; }
    .rank-avatar {
        width: 40px;
        height: 40px;
        background: #f7f7f7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
</style>
