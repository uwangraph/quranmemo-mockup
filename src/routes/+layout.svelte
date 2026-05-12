<script>
	import '../app.css';
	import { appState } from '$lib/app.svelte.js';
	import { i18n } from '$lib/i18n.svelte.js';
	let { children } = $props();
	let isMenuOpen = $state(false);

	const categories = [
		{
			name: 'User',
			color: '#58cc02',
			accent: '#e6f9d4',
			icon: '👤',
			screens: ['onboarding', 'learn', 'murojaah', 'feedback', 'tadabbur', 'league', 'lesson', 'profile', 'language']
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

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleNavigate(id) {
		appState.go(id);
		isMenuOpen = false;
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
	/>
</svelte:head>

<div class="qm-app">
	<!-- Mobile Top Bar -->
	<div class="mobile-topbar">
		<button class="menu-toggle" onclick={toggleMenu}>
			<i class="ti ti-menu-2"></i>
		</button>
		<div class="app-logo">
			<span>📖</span>
			<span>QuranMemo</span>
		</div>
		<div style="width: 40px"></div>
	</div>

	<!-- Overlay for mobile menu -->
	{#if isMenuOpen}
		<div class="menu-overlay" onclick={toggleMenu}></div>
	{/if}

	<!-- Sidebar / Drawer -->
	<div class="snav" class:open={isMenuOpen}>
		<div class="snav-logo">
			<span style="font-size: 20px;">📖</span>
			<span style="font-size: 14px; font-weight: 900; color: #3c3c3c;">QuranMemo</span>
			<button class="close-menu-btn" onclick={toggleMenu}>
				<i class="ti ti-x"></i>
			</button>
		</div>

		<div class="snav-scroll no-scrollbar">
			{#each categories as cat}
				<div class="cat-header" style="color: {cat.color};">
					<div class="cat-dot" style="background: {cat.color};"></div>
					{cat.name}
				</div>
				{#each cat.screens as screenId}
					<button 
						class="snb" 
						class:active={appState.currentScreen === screenId}
						onclick={() => handleNavigate(screenId)}
						style={appState.currentScreen === screenId ? `background: ${cat.color}; border-color: ${cat.color}; color: #fff;` : ''}
					>
						{appState.screenLabels[screenId]}
					</button>
				{/each}
			{/each}
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="main-container">
		<!-- Phone Frame -->
		<div 
			class="phone theme-{appState.theme}" 
			id="phone-frame" 
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
</div>

<style>
	.qm-app {
		display: flex;
		min-height: 100vh;
		background: #f0f0f0;
	}

	.mobile-topbar {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 60px;
		background: #fff;
		border-bottom: 1px solid #e5e5e5;
		z-index: 900;
		padding: 0 16px;
		align-items: center;
		justify-content: space-between;
	}
	.menu-toggle {
		background: none;
		border: none;
		font-size: 24px;
		color: #3c3c3c;
		cursor: pointer;
	}
	.app-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 900;
		color: #3c3c3c;
	}

	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 999;
		backdrop-filter: blur(2px);
	}

	.snav {
		z-index: 1000;
		display: flex;
		flex-direction: column;
		padding: 16px;
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		background: #fafafa;
		border-right: 1px solid #e5e5e5;
		width: 240px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.snav-scroll {
		flex: 1;
		overflow-y: auto;
		padding-right: 4px;
	}
	.snav-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 8px 20px;
		border-bottom: 1px solid #e5e5e5;
		margin-bottom: 8px;
		justify-content: space-between;
	}
	.close-menu-btn {
		display: none;
		background: none;
		border: none;
		font-size: 20px;
		color: #afafaf;
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
		padding: 10px 14px;
		border-radius: 14px;
		border: 2px solid #e5e5e5;
		background: #fff;
		cursor: pointer;
		color: #777;
		transition: all 0.15s;
		width: 100%;
		text-align: left;
		margin-bottom: 6px;
	}
	.snb:hover {
		border-color: #ccc;
		color: #3c3c3c;
		transform: translateX(2px);
	}

	.main-container {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 40px 20px;
		margin-left: 240px;
	}

	.phone {
		margin: 0 auto;
	}

	.role-indicator {
		font-size: 10px;
		font-weight: 900;
		text-align: center;
		padding: 8px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Responsive Media Queries */
	@media (max-width: 1024px) {
		.snav {
			width: 220px;
		}
		.main-container {
			margin-left: 220px;
		}
	}

	@media (max-width: 768px) {
		.mobile-topbar {
			display: flex;
		}
		.snav {
			transform: translateX(-100%);
			z-index: 1001;
			box-shadow: 10px 0 30px rgba(0,0,0,0.1);
		}
		.snav.open {
			transform: translateX(0);
		}
		.close-menu-btn {
			display: block;
		}
		.main-container {
			margin-left: 0;
			padding-top: 80px; /* Space for mobile topbar */
			padding-bottom: 20px;
		}
		.phone {
			width: 100%;
			max-width: 380px;
			min-height: auto;
			height: 800px;
		}
	}

	@media (max-width: 480px) {
		.main-container {
			padding: 70px 10px 10px;
		}
		.phone {
			border-radius: 20px;
			border: none;
			box-shadow: none;
		}
	}

    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
