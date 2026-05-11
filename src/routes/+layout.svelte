<script>
	import '../app.css';
	import { appState } from '$lib/app.svelte.js';
	let { children } = $props();

	const categories = [
		{
			name: 'User',
			screens: ['onboarding', 'learn', 'murojaah', 'tadabbur', 'league', 'lesson', 'profile']
		},
		{
			name: 'Musyrif',
			screens: ['musyrif', 'livemarking']
		},
		{
			name: 'Admin Dashboard',
			screens: ['admin-users', 'admin-musyrif']
		}
	];
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
	/>
</svelte:head>

<div class="qm-app">
	<!-- Side Navigation (for mockup switching) -->
	<div class="snav" style="display: flex; flex-direction: column; gap: 4px; padding: 20px; position: fixed; left: 0; top: 0; height: 100vh; overflow-y: auto; background: #fff; border-right: 1px solid #e5e5e5; width: 200px;">
		{#each categories as cat}
			<div style="font-size: 10px; font-weight: 900; color: #afafaf; margin: 15px 0 5px; text-transform: uppercase; letter-spacing: 1px;">
				Category: {cat.name}
			</div>
			{#each cat.screens as screenId}
				<button 
					class="snb" 
					class:active={appState.currentScreen === screenId}
					onclick={() => appState.go(screenId)}
					style="margin-bottom: 4px; width: 100%; text-align: left;"
				>
					{appState.screenLabels[screenId]}
				</button>
			{/each}
		{/each}
	</div>

	<!-- Phone Frame -->
	<div class="phone theme-{appState.theme}" id="phone-frame" style="margin-left: 220px;">
		<div class="statusbar">
			<span>9:41</span>
			<span style="display: flex; gap: 4px; align-items: center">
				<i class="ti ti-wifi" style="font-size: 13px"></i>
				<i class="ti ti-battery" style="font-size: 13px"></i>
			</span>
		</div>

		{@render children()}
	</div>
</div>

<style>
	.snav {
		z-index: 1000;
	}
	.snb {
		font-family: 'Nunito', sans-serif;
		font-size: 11px;
		font-weight: 800;
		padding: 8px 12px;
		border-radius: 12px;
		border: 2px solid #e5e5e5;
		background: #fff;
		cursor: pointer;
		color: #afafaf;
		transition: all 0.15s;
	}
	.snb.active {
		background: #58cc02;
		color: #fff;
		border-color: #58cc02;
	}
    /* Simple CSS reset/base for SvelteKit layout */
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
