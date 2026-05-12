<script>
	import '../app.css';
	import { appState } from '$lib/app.svelte.js';
	import { i18n } from '$lib/i18n.svelte.js';
	let { children } = $props();
	let isMenuOpen = $state(false);
	let isSidebarExpanded = $state(true);

	const categories = [
		{
			name: 'User',
			color: '#58cc02',
			accent: '#e6f9d4',
			icon: '👤',
			screens: [
				{ id: 'onboarding', icon: '✨' },
				{ id: 'learn', icon: '🏠' },
				{ id: 'murojaah', icon: '🔄' },
				{ id: 'feedback', icon: '⭐' },
				{ id: 'tadabbur', icon: '📖' },
				{ id: 'league', icon: '🏆' },
				{ id: 'lesson', icon: '📚' },
				{ id: 'profile', icon: '👤' },
				{ id: 'language', icon: '🌐' }
			]
		},
		{
			name: 'Musyrif',
			color: '#ff9600',
			accent: '#fff4e0',
			icon: '👳',
			screens: [
				{ id: 'musyrif', icon: '👴' },
				{ id: 'livemarking', icon: '🔴' },
				{ id: 'musyrif-earnings', icon: '💰' }
			]
		},
		{
			name: 'Admin',
			color: '#7c5cfc',
			accent: '#ede8ff',
			icon: '🛡️',
			screens: [
				{ id: 'admin-users', icon: '👥' },
				{ id: 'admin-musyrif', icon: '👳' }
			]
		}
	];

	const currentCategory = $derived(
		categories.find(c => c.screens.some(s => s.id === appState.currentScreen)) || categories[0]
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
	<div class="snav" class:open={isMenuOpen} class:collapsed={!isSidebarExpanded}>
		<div class="snav-logo">
			<span style="font-size: 20px; flex-shrink: 0;">📖</span>
			{#if isSidebarExpanded}
				<span class="logo-text">QuranMemo</span>
			{/if}
			<button class="close-menu-btn" onclick={toggleMenu}>
				<i class="ti ti-x"></i>
			</button>
		</div>

		<div class="snav-scroll no-scrollbar">
			{#each categories as cat}
				<div class="cat-header" style="color: {cat.color};">
					<div class="cat-dot" style="background: {cat.color};"></div>
					{#if isSidebarExpanded}
						<span class="cat-label" style="margin-left: 4px">{cat.name}</span>
					{/if}
				</div>
				{#each cat.screens as screen}
					<button 
						class="snb" 
						class:active={appState.currentScreen === screen.id}
						onclick={() => handleNavigate(screen.id)}
						style={appState.currentScreen === screen.id ? `background: ${cat.color}; border-color: ${cat.color}; color: #fff;` : ''}
						title={appState.screenLabels[screen.id]}
					>
						<span class="snb-icon">{screen.icon}</span>
						{#if isSidebarExpanded}
							<span class="snb-text">{appState.screenLabels[screen.id]}</span>
						{/if}
					</button>
				{/each}
			{/each}
		</div>

		<!-- Sidebar Toggle Button (Desktop/Tablet) -->
		<button class="sidebar-toggle-btn" class:collapsed={!isSidebarExpanded} onclick={() => isSidebarExpanded = !isSidebarExpanded} title="Toggle Sidebar">
			<i class="ti ti-{isSidebarExpanded ? 'chevron-left' : 'chevron-right'}"></i>
		</button>
	</div>

	<!-- Main Content Area -->
	<div class="main-container" class:collapsed={!isSidebarExpanded}>

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
			<div class="role-indicator" style="background: {currentCategory.accent}; color: {currentCategory.color}; padding-bottom: 20px;">
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
		overflow-x: hidden;
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
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.snav.collapsed {
		width: 72px;
		padding: 16px 12px;
	}
	.logo-text, .cat-label, .snb-text {
		white-space: nowrap;
		overflow: hidden;
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
		padding-left: 4px;
	}
	.cat-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.snb {
		font-family: 'Nunito', sans-serif;
		font-size: 11px;
		font-weight: 800;
		padding: 10px 12px;
		border-radius: 14px;
		border: 2px solid #e5e5e5;
		background: #fff;
		cursor: pointer;
		color: #777;
		transition: all 0.15s;
		width: 100%;
		text-align: left;
		margin-bottom: 6px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.collapsed .snb {
		padding: 10px;
		justify-content: center;
	}
	.snb-icon {
		font-size: 14px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.main-container {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 40px 20px;
		margin-left: 240px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.main-container.collapsed {
		margin-left: 72px;
	}

	.sidebar-toggle-btn {
		position: absolute;
		right: -14px;
		top: 32px;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 50%;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #afafaf;
		cursor: pointer;
		z-index: 101;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}
	.sidebar-toggle-btn:hover {
		color: #3c3c3c;
		border-color: #ccc;
		background: #f7f7f7;
	}

	.phone {
		margin: 0 auto;
		transition: all 0.3s ease;
	}

	.role-indicator {
		font-size: 10px;
		font-weight: 900;
		text-align: center;
		padding: 8px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	@media (max-width: 1024px) {
		.snav {
			width: 220px;
		}
		.main-container {
			margin-left: 220px;
		}
	}

	/* Mobile full-screen only for small devices */
	@media (max-width: 500px) {
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
			padding-top: 60px;
			padding-bottom: 0;
			display: block;
			min-height: 100vh;
		}
		.phone {
			width: 100%;
			max-width: 100%;
			height: calc(100vh - 60px);
			border-radius: 0;
			border: none;
			box-shadow: none;
			transform: none;
			margin: 0;
		}
		.phone::after {
			display: none;
		}
	}

    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
