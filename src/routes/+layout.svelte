<script>
	import '../app.css';
	import { appState } from '$lib/app.svelte.js';
	import { i18n } from '$lib/i18n.svelte.js';
	let { children } = $props();

	const categories = [
		{
			name: 'User',
			color: '#58cc02',
			accent: '#e6f9d4',
			icon: '👤',
			screens: ['onboarding', 'learn', 'murojaah', 'tadabbur', 'league', 'lesson', 'profile', 'language']
		},
		{
			name: 'Musyrif',
			color: '#ff9600',
			accent: '#fff4e0',
			icon: '👳',
			screens: ['musyrif', 'livemarking', 'musyrif-earnings']
		},
		{
			name: 'Admin',
			color: '#7c5cfc',
			accent: '#ede8ff',
			icon: '🛡️',
			screens: ['admin-users', 'admin-musyrif']
		}
	];

	const currentCategory = $derived(
		categories.find(c => c.screens.includes(appState.currentScreen)) || categories[0]
	);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
	/>
</svelte:head>

<div class="qm-app">
	<!-- Side Navigation -->
	<div class="snav">
		<div class="snav-logo">
			<span style="font-size: 20px;">📖</span>
			<span style="font-size: 14px; font-weight: 900; color: #3c3c3c;">QuranMemo</span>
		</div>

		{#each categories as cat}
			<div class="cat-header" style="color: {cat.color};">
				<div class="cat-dot" style="background: {cat.color};"></div>
				{cat.name}
			</div>
			{#each cat.screens as screenId}
				<button 
					class="snb" 
					class:active={appState.currentScreen === screenId}
					onclick={() => appState.go(screenId)}
					style={appState.currentScreen === screenId ? `background: ${cat.color}; border-color: ${cat.color}; color: #fff;` : ''}
				>
					{appState.screenLabels[screenId]}
				</button>
			{/each}
		{/each}
	</div>

	<!-- Phone Frame -->
	<div 
		class="phone theme-{appState.theme}" 
		id="phone-frame" 
		style="margin-left: 220px;" 
		dir={i18n.getDir()}
	>
		<div class="statusbar" dir="ltr" style="background: {currentCategory.color};">
			<span>9:41</span>
			<span style="display: flex; gap: 4px; align-items: center">
				<i class="ti ti-wifi" style="font-size: 13px"></i>
				<i class="ti ti-battery" style="font-size: 13px"></i>
			</span>
		</div>

		{@render children()}

		<!-- Role indicator at bottom of phone -->
		<div class="role-indicator" style="background: {currentCategory.accent}; color: {currentCategory.color};">
			{currentCategory.icon} {currentCategory.name} Mode
		</div>
	</div>
</div>

<style>
	.snav {
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px;
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		overflow-y: auto;
		background: #fafafa;
		border-right: 1px solid #e5e5e5;
		width: 200px;
	}
	.snav-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 8px 20px;
		border-bottom: 1px solid #e5e5e5;
		margin-bottom: 8px;
	}
	.cat-header {
		font-size: 10px;
		font-weight: 900;
		margin: 16px 0 6px;
		text-transform: uppercase;
		letter-spacing: 1px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.cat-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
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
		color: #777;
		transition: all 0.15s;
		width: 100%;
		text-align: left;
		margin-bottom: 4px;
	}
	.snb:hover {
		border-color: #ccc;
		color: #3c3c3c;
	}

	.role-indicator {
		font-size: 10px;
		font-weight: 900;
		text-align: center;
		padding: 6px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
