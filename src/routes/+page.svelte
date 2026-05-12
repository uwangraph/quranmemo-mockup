<script>
    import { appState } from '$lib/app.svelte.js';
    import Onboarding from '$lib/screens/Onboarding.svelte';
    import Learn from '$lib/screens/Learn.svelte';
    import Marketplace from '$lib/screens/Marketplace.svelte';
    import League from '$lib/screens/League.svelte';
    import Profile from '$lib/screens/Profile.svelte';
    import Language from '$lib/screens/Language.svelte';
    import MusyrifDashboard from '$lib/screens/MusyrifDashboard.svelte';
    import LiveMarking from '$lib/screens/LiveMarking.svelte';
    import AdminUsers from '$lib/screens/AdminUsers.svelte';
    import AdminMusyrif from '$lib/screens/AdminMusyrif.svelte';
    import Lesson from '$lib/screens/Lesson.svelte';
    import Tadabbur from '$lib/screens/Tadabbur.svelte';
    import MusyrifEarnings from '$lib/screens/MusyrifEarnings.svelte';
    import SessionFeedback from '$lib/screens/SessionFeedback.svelte';
    import AdminDashboard from '$lib/screens/AdminDashboard.svelte';
</script>

{#if appState.currentScreen === 'onboarding'}
    <Onboarding />
{:else}
    {#if appState.currentScreen === 'learn'}
        <Learn />
    {:else if appState.currentScreen === 'murojaah'}
        <Marketplace />
    {:else if appState.currentScreen === 'feedback'}
        <SessionFeedback />
    {:else if appState.currentScreen === 'league'}
        <League />
    {:else if appState.currentScreen === 'profile'}
        <Profile />
    {:else if appState.currentScreen === 'language'}
        <Language />
    {:else if appState.currentScreen === 'lesson'}
        <Lesson />
    {:else if appState.currentScreen === 'tadabbur'}
        <Tadabbur />
    {:else if appState.currentScreen === 'musyrif'}
        <MusyrifDashboard />
    {:else if appState.currentScreen === 'livemarking'}
        <LiveMarking />
    {:else if appState.currentScreen === 'musyrif-earnings'}
        <MusyrifEarnings />
    {:else if appState.currentScreen === 'admin-dashboard'}
        <AdminDashboard />
    {:else if appState.currentScreen === 'admin-users'}
        <AdminUsers />
    {:else if appState.currentScreen === 'admin-musyrif'}
        <AdminMusyrif />
    {:else}
        <!-- Fallback for screens not yet ported -->
        <div class="screen" style="padding: 40px; text-align: center; color: #afafaf;">
            <div style="font-size: 48px; margin-bottom: 20px;">🏗️</div>
            <div style="font-size: 16px; font-weight: 900; color: #3c3c3c;">Layar {appState.currentScreen}</div>
            <p style="font-size: 13px; margin-top: 8px;">Sedang dalam proses migrasi ke Svelte 5...</p>
            <button class="btn-duo btn-green" style="margin-top: 20px;" onclick={() => appState.go('learn')}>
                KEMBALI KE BERANDA
            </button>
        </div>
    {/if}
{/if}
