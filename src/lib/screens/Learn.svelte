<script>
    import LearnTopbar from '$lib/components/learn/LearnTopbar.svelte';
    import RoadmapPath from '$lib/components/learn/RoadmapPath.svelte';
    import LearnSidebar from '$lib/components/learn/LearnSidebar.svelte';
    import BottomNav from '../components/BottomNav.svelte';
    import StreakModal from '$lib/components/learn/StreakModal.svelte';
    import MurajaahAlert from '$lib/components/learn/MurajaahAlert.svelte';

    let showStreakModal = $state(false);
</script>

<div class="screen">
    <LearnTopbar onOpenStreakModal={() => showStreakModal = true} />

    <div class="scroll-content no-scrollbar" style="background: #fff;">
        <!-- Prioritas revisi tampil di atas roadmap: hafalan lama yang mulai
             menguap lebih mendesak daripada target berikutnya (STREAK.md). -->
        <div class="learn-layout-container">

            <!-- Left Column: Memorization Path -->
            <div class="path-col">
                <MurajaahAlert />
                <RoadmapPath />
            </div>

            <!-- Right Column: Interactive Sidebar Widgets (Visible only in desktop mockup) -->
            <LearnSidebar />

        </div>
        <div style="height: 100px;"></div>
    </div>

    <BottomNav active="learn" />

    <!-- Streak Modal -->
    {#if showStreakModal}
        <StreakModal onClose={() => showStreakModal = false} />
    {/if}
</div>

<style>
    .learn-layout-container {
        display: block;
        width: 100%;
    }
    .path-col { width: 100%; }
    :global(.desktop-browser) .path-col { flex: 1; max-width: 700px; }

    /* Target desktop/tablet mockup mode wrapper */
    :global(.desktop-browser) .learn-layout-container {
        display: flex;
        gap: 36px;
        padding: 30px 24px;
        max-width: 1200px;
        margin: 0 auto;
        align-items: flex-start;
    }

    :global(.tablet) .learn-layout-container {
        display: block;
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
    }
</style>
