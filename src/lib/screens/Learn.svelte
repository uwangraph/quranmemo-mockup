<script>
    import LearnTopbar from '$lib/components/learn/LearnTopbar.svelte';
    import RoadmapPath from '$lib/components/learn/RoadmapPath.svelte';
    import LearnSidebar from '$lib/components/learn/LearnSidebar.svelte';
    import BottomNav from '../components/BottomNav.svelte';
</script>

<div class="screen">
    <LearnTopbar />

    <div class="scroll-content no-scrollbar" style="background: #fff;">
        <div class="learn-layout-container">
            
            <!-- Left Column: Memorization Path -->
            <RoadmapPath />

            <!-- Right Column: Interactive Sidebar Widgets (Visible only in desktop mockup) -->
            <LearnSidebar />

        </div>
        <div style="height: 100px;"></div>
    </div>

    <BottomNav active="learn" />
</div>

<style>
    .learn-layout-container {
        display: block;
        width: 100%;
    }

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
