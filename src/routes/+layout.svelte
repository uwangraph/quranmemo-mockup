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
			color: '#00978A',
			accent: '#DBF0EE',
			icon: '👤',
			screens: [
				{ id: 'onboarding', icon: '✨' },
				{ id: 'learn', icon: '🏠' },
				{ id: 'murojaah', icon: '🤝' },
				{ id: 'feedback', icon: '⭐' },
				{ id: 'tadabbur', icon: '📚' },
				{ id: 'league', icon: '🏆' },
				{ id: 'lesson', icon: '📖' },
				{ id: 'profile', icon: '👤' },
				{ id: 'language', icon: '🌍' }
			]
		},
		{
			name: 'Musyrif',
			color: '#ff9600',
			accent: '#fff4e0',
			icon: '👳',
			screens: [
				{ id: 'musyrif', icon: '👳' },
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
				{ id: 'admin-dashboard', icon: '📊' },
				{ id: 'admin-users', icon: '👥' },
				{ id: 'admin-musyrif', icon: '👨‍🏫' }
			]
		}
	];

	const currentCategory = $derived(
		categories.find(c => c.screens.some(s => s.id === appState.currentScreen)) || categories[0]
	);

	const simulatedNavItems = $derived(
		currentCategory.name === 'User'
			? [
					{ id: 'learn', icon: 'ti-home', label: 'nav.learn' },
					{ id: 'murojaah', icon: 'ti-refresh', label: 'nav.murojaah' },
					{ id: 'tadabbur', icon: 'ti-book', label: 'nav.tadabbur' },
					{ id: 'league', icon: 'ti-trophy', label: 'nav.league' },
					{ id: 'profile', icon: 'ti-user', label: 'nav.profile' }
				]
			: currentCategory.name === 'Musyrif'
			? [
					{ id: 'musyrif', icon: 'ti-category-2', label: 'screen.musyrif' },
					{ id: 'livemarking', icon: 'ti-video', label: 'screen.livemarking' },
					{ id: 'musyrif-earnings', icon: 'ti-wallet', label: 'screen.musyrif-earnings' }
				]
			: [
					{ id: 'admin-dashboard', icon: 'ti-chart-bar', label: 'screen.admin-dashboard' },
					{ id: 'admin-users', icon: 'ti-users', label: 'screen.admin-users' },
					{ id: 'admin-musyrif', icon: 'ti-school', label: 'screen.admin-musyrif' }
				]
	);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleNavigate(id) {
		appState.go(id);
		isMenuOpen = false;
	}

	function getFlaticon(id) {
		const mapping = {
			'onboarding': 'https://cdn-icons-png.flaticon.com/512/9716/9716852.png', // Rocket
			'learn': 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png', // Quran on Rehal
			'murojaah': 'https://cdn-icons-png.flaticon.com/512/3468/3468081.png', // Handshake
			'feedback': 'https://cdn-icons-png.flaticon.com/512/2107/2107957.png', // Star
			'tadabbur': 'https://cdn-icons-png.flaticon.com/512/2947/2947998.png', // Study Book
			'league': 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png', // Gold Trophy
			'lesson': 'https://cdn-icons-png.flaticon.com/512/3596/3596093.png', // Lesson pad
			'profile': 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // User Avatar
			'language': 'https://cdn-icons-png.flaticon.com/512/3233/3233004.png', // Globe
			'musyrif': 'https://cdn-icons-png.flaticon.com/512/3996/3996562.png', // Cleric/Ustadz
			'livemarking': 'https://cdn-icons-png.flaticon.com/512/3221/3221803.png', // Recording
			'musyrif-earnings': 'https://cdn-icons-png.flaticon.com/512/2953/2953423.png', // Earnings Bag
			'admin-dashboard': 'https://cdn-icons-png.flaticon.com/512/2206/2206248.png', // Admin Shield
			'admin-users': 'https://cdn-icons-png.flaticon.com/512/681/681494.png', // Users Shield
			'admin-musyrif': 'https://cdn-icons-png.flaticon.com/512/4692/4692348.png' // Musyrif Shield
		};
		return mapping[id] || 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png';
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
						title={i18n.t('screen.' + screen.id)}
					>
						<img src={getFlaticon(screen.id)} alt="" style="width: 18px; height: 18px; object-fit: contain; margin-right: {isSidebarExpanded ? '10px' : '0'}; filter: {appState.currentScreen === screen.id ? 'brightness(0) invert(1)' : 'none'};" />
						{#if isSidebarExpanded}
							<span class="snb-text">{i18n.t('screen.' + screen.id)}</span>
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
		<!-- View Switcher -->
		<div class="view-switcher-container">
			<div class="view-switcher">
				<button class="switcher-btn" class:active={appState.mockupMode === 'mobile'} onclick={() => appState.setMockupMode('mobile')}>
					<i class="ti ti-device-mobile"></i> Mobile
				</button>
				<button class="switcher-btn" class:active={appState.mockupMode === 'tablet'} onclick={() => appState.setMockupMode('tablet')}>
					<i class="ti ti-device-tablet"></i> Tablet
				</button>
				<button class="switcher-btn" class:active={appState.mockupMode === 'desktop'} onclick={() => appState.setMockupMode('desktop')}>
					<i class="ti ti-device-laptop"></i> Desktop
				</button>
			</div>
		</div>

		{#if appState.mockupMode === 'mobile'}
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
					{currentCategory.icon} {i18n.t('nav.' + currentCategory.name.toLowerCase()) || currentCategory.name} Mode
				</div>
			</div>
		{:else if appState.mockupMode === 'tablet'}
			<!-- Tablet Mockup Frame -->
			<div 
				class="tablet theme-{appState.theme}" 
				id="tablet-frame" 
				dir={i18n.getDir()}
			>
				<!-- iPad statusbar -->
				<div class="tablet-statusbar" dir="ltr">
					<div class="statusbar-left" style="display: flex; gap: 6px; align-items: center">
						<span>9:41 AM</span>
						<span style="font-weight: 700; color: #1cb0f6;">iPad Pro</span>
					</div>
					<div class="statusbar-center" style="display: flex; gap: 4px; align-items: center">
						<i class="ti ti-lock" style="font-size: 11px; color: #10b981;"></i>
						<span>quranmemo.app/{appState.currentScreen}</span>
					</div>
					<div class="statusbar-right" style="display: flex; gap: 6px; align-items: center">
						<span>100%</span>
						<i class="ti ti-battery-4" style="font-size: 14px"></i>
						<i class="ti ti-wifi" style="font-size: 14px"></i>
					</div>
				</div>

				<div class="tablet-body">
					<div class="mockup-tablet-layout" style="display: flex; flex-direction: row; flex: 1; min-height: 0; overflow: hidden; width: 100%;">
						<!-- Simulated Left Nav Rail for Tablet -->
						<div class="mockup-left-rail" style="width: 76px; border-right: 2px solid #e5e5e5; background: #fff; display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 24px; flex-shrink: 0;">
							<div class="rail-logo" style="font-size: 24px; margin-bottom: 12px;">📖</div>
							
							{#each simulatedNavItems as item}
								<button 
									class="rail-item" 
									class:active={appState.currentScreen === item.id}
									onclick={() => appState.go(item.id)}
									style="background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; color: {appState.currentScreen === item.id ? '#00978A' : '#afafaf'}; transition: all 0.2s; width: 100%; padding: 4px 0; -webkit-tap-highlight-color: transparent;"
								>
									<img src={getFlaticon(item.id)} alt="" style="width: 24px; height: 24px; object-fit: contain; filter: {appState.currentScreen === item.id ? 'none' : 'grayscale(100%) opacity(60%)'}; transition: all 0.2s;" />
									<span style="font-size: 9px; font-weight: 800; font-family: 'Nunito', sans-serif;">{i18n.t(item.label)}</span>
								</button>
							{/each}
							
							<!-- Setting icon at the bottom of tablet rail -->
							<button 
								onclick={() => appState.go('language')}
								style="margin-top: auto; background: none; border: none; cursor: pointer; color: #afafaf; font-size: 20px;"
							>
								<i class="ti ti-settings"></i>
							</button>
						</div>
						
						<!-- Active Screen Inside Mockup -->
						<div class="mockup-screen-container" style="flex: 1; display: flex; flex-direction: column; min-height: 0; overflow-y: auto; background: #fff;">
							{@render children()}
						</div>
					</div>
				</div>

				<!-- Role indicator at bottom of tablet -->
				<div class="tablet-role" style="background: {currentCategory.accent}; color: {currentCategory.color};">
					{currentCategory.icon} {i18n.t('nav.' + currentCategory.name.toLowerCase()) || currentCategory.name} Tablet View
				</div>
			</div>
		{:else}
			<!-- Desktop Browser Mockup Frame -->
			<div 
				class="desktop-browser theme-{appState.theme}" 
				id="desktop-frame" 
				dir={i18n.getDir()}
			>
				<!-- Browser Chrome -->
				<div class="browser-chrome" dir="ltr">
					<div class="chrome-dots">
						<span class="chrome-dot red"></span>
						<span class="chrome-dot yellow"></span>
						<span class="chrome-dot green"></span>
					</div>
					<div class="chrome-nav">
						<button class="chrome-nav-btn" onclick={() => appState.go('learn')} title="Back to Home"><i class="ti ti-chevron-left"></i></button>
						<button class="chrome-nav-btn" disabled><i class="ti ti-chevron-right"></i></button>
						<button class="chrome-nav-btn" onclick={() => window.location.reload()} title="Reload"><i class="ti ti-refresh"></i></button>
					</div>
					<div class="chrome-address">
						<i class="ti ti-lock"></i>
						<span>quranmemo.app/{appState.currentScreen}</span>
					</div>
					<div class="chrome-actions">
						<span class="role-badge" style="background: {currentCategory.accent}; color: {currentCategory.color};">
							{currentCategory.icon} {i18n.t('nav.' + currentCategory.name.toLowerCase()) || currentCategory.name} Mode
						</span>
					</div>
				</div>

				<!-- Browser Body -->
				<div class="browser-body">
					<div class="mockup-desktop-layout" style="display: flex; flex-direction: row; flex: 1; min-height: 0; overflow: hidden; width: 100%; background: #fff;">
						<!-- Simulated Left Sidebar for Desktop Widescreen -->
						<div class="mockup-left-sidebar" style="width: 240px; border-right: 2px solid #e5e5e5; background: #fff; display: flex; flex-direction: column; padding: 24px 16px; gap: 24px; flex-shrink: 0;">
							<div class="sidebar-logo" style="display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 8px;">
								<span style="font-size: 28px;">📖</span>
								<span style="font-size: 18px; font-weight: 900; color: #3c3c3c; letter-spacing: -0.5px;">QuranMemo</span>
							</div>
							
							<div class="sidebar-menu" style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
								{#each simulatedNavItems as item}
									<button 
										class="sidebar-item" 
										class:active={appState.currentScreen === item.id}
										onclick={() => appState.go(item.id)}
										style="display: flex; align-items: center; gap: 14px; padding: 12px 16px; border: 2px solid transparent; border-radius: 12px; background: {appState.currentScreen === item.id ? '#DBF0EE' : 'none'}; color: {appState.currentScreen === item.id ? '#00978A' : '#4b5563'}; cursor: pointer; text-align: left; transition: all 0.2s;"
									>
										<img src={getFlaticon(item.id)} alt="" style="width: 22px; height: 22px; object-fit: contain; filter: {appState.currentScreen === item.id ? 'none' : 'grayscale(100%) opacity(60%)'}; transition: all 0.2s;" />
										<span style="font-size: 13px; font-weight: 800; font-family: 'Nunito', sans-serif;">{i18n.t(item.label)}</span>
									</button>
								{/each}
							</div>
							
							<!-- User Profile Info at the bottom of desktop layout -->
							<div class="sidebar-user" style="display: flex; align-items: center; gap: 12px; padding: 12px 8px; border-top: 1px solid #f0f0f0; margin-top: auto;">
								<div style="width: 36px; height: 36px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 18px;">👤</div>
								<div style="flex: 1; min-width: 0;">
									<div style="font-size: 13px; font-weight: 800; color: #3c3c3c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Abdullah Irfan</div>
									<div style="font-size: 10px; font-weight: 700; color: #afafaf; text-transform: uppercase;">PRO USER</div>
								</div>
								<button 
									onclick={() => appState.go('language')}
									style="background: none; border: none; cursor: pointer; color: #afafaf; font-size: 18px;"
								>
									<i class="ti ti-settings"></i>
								</button>
							</div>
						</div>
						
						<!-- Active Screen Inside Mockup -->
						<div class="mockup-screen-container" style="flex: 1; display: flex; flex-direction: column; min-height: 0; overflow-y: auto; background: #fff;">
							{@render children()}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.qm-app {
		display: flex;
		flex-direction: row !important;
		align-items: stretch !important;
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
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 60px 20px 40px;
		margin-left: 240px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		min-height: 100vh;
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

	/* View Switcher Styles */
	.view-switcher-container {
		margin-bottom: 24px;
		display: flex;
		justify-content: center;
		width: 100%;
		flex-shrink: 0;
	}
	.view-switcher {
		display: flex;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(229, 229, 229, 0.8);
		border-radius: 100px;
		padding: 4px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	}
	.switcher-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 12px;
		font-weight: 800;
		color: #777;
		background: none;
		border: none;
		padding: 8px 16px;
		border-radius: 100px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.switcher-btn:hover {
		color: #3c3c3c;
	}
	.switcher-btn.active {
		background: #00978A;
		color: #fff;
		box-shadow: 0 2px 8px rgba(0, 151, 138, 0.3);
	}

	/* Phone Mockup Frame */
	.phone {
		width: 390px;
		height: 844px;
		border-radius: 48px;
		border: 12px solid #1a1a1a;
		margin: 0 auto;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: #fff;
		position: relative;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.phone::after {
		content: '';
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 5px;
		background: #000;
		border-radius: 10px;
		opacity: 0.2;
		z-index: 1000;
	}

	.role-indicator {
		font-size: 10px;
		font-weight: 900;
		text-align: center;
		padding: 8px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Tablet Mockup Frame */
	.tablet {
		width: 680px;
		height: 820px;
		border-radius: 36px;
		border: 14px solid #1a1a1a;
		margin: 0 auto;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: #fff;
		position: relative;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
	}
	.tablet::after {
		content: '';
		position: absolute;
		top: 6px;
		left: 50%;
		transform: translateX(-50%);
		width: 8px;
		height: 8px;
		background: #333;
		border-radius: 50%;
		z-index: 1000;
	}
	.tablet-statusbar {
		height: 30px;
		background: #f8fafc;
		border-bottom: 1px solid #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		font-size: 11px;
		font-weight: 800;
		color: #64748b;
		flex-shrink: 0;
	}
	.tablet-body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: #fff;
		overflow: hidden;
	}
	.tablet-role {
		font-size: 10px;
		font-weight: 900;
		text-align: center;
		padding: 8px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Theme Specific Tablet Overrides */
	.tablet.theme-musyrif .tablet-statusbar {
		background: #1a1a1a;
		border-bottom-color: #333;
		color: #aaa;
	}
	.tablet.theme-admin .tablet-statusbar {
		background: #1e293b;
		border-bottom-color: #334155;
		color: #94a3b8;
	}

	/* Desktop Browser Mockup Frame */
	.desktop-browser {
		width: 100%;
		max-width: 1440px;
		height: 880px;
		border-radius: 32px;
		border: 14px solid #1a1a1a;
		background: #fff;
		margin: 0 auto;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.browser-chrome {
		height: 48px;
		background: #f8fafc;
		border-bottom: 1px solid #e2e8f0;
		display: flex;
		align-items: center;
		padding: 0 16px;
		gap: 16px;
		flex-shrink: 0;
	}
	.chrome-dots {
		display: flex;
		gap: 6px;
	}
	.chrome-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
	}
	.chrome-dot.red { background: #ff5f56; }
	.chrome-dot.yellow { background: #ffbd2e; }
	.chrome-dot.green { background: #27c93f; }
	
	.chrome-nav {
		display: flex;
		gap: 4px;
	}
	.chrome-nav-btn {
		background: none;
		border: none;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		color: #64748b;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s;
	}
	.chrome-nav-btn:hover:not(:disabled) {
		background: #f1f5f9;
		color: #1e293b;
	}
	.chrome-nav-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.chrome-address {
		flex: 1;
		height: 30px;
		background: #f1f5f9;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 600;
		color: #64748b;
		gap: 6px;
		max-width: 400px;
		margin: 0 auto;
	}
	.chrome-address i {
		font-size: 11px;
		color: #10b981;
	}
	.chrome-actions {
		display: flex;
		align-items: center;
	}
	.role-badge {
		font-size: 10px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 4px 10px;
		border-radius: 100px;
		box-shadow: 0 1px 2px rgba(0,0,0,0.02);
	}
	.browser-body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: #fff;
		overflow: hidden;
	}

	/* Theme Specific Chrome Overrides */
	.desktop-browser.theme-musyrif .browser-chrome {
		background: #1a1a1a;
		border-bottom-color: #333;
	}
	.desktop-browser.theme-musyrif .chrome-address {
		background: #2a2a2a;
		border-color: #3e3e3e;
		color: #aaa;
	}
	.desktop-browser.theme-admin .browser-chrome {
		background: #1e293b;
		border-bottom-color: #334155;
	}
	.desktop-browser.theme-admin .chrome-address {
		background: #0f172a;
		border-color: #1e293b;
		color: #94a3b8;
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
			display: flex !important;
		}
		.snav {
			transform: translateX(-100%) !important;
			z-index: 1001 !important;
		}
		.snav.open {
			transform: translateX(0) !important;
		}
		.main-container {
			margin-left: 0 !important;
			padding: 80px 20px 40px !important; /* Space for mobile topbar */
			display: flex !important;
			justify-content: center !important;
			align-items: flex-start !important;
			min-height: 100vh !important;
		}
		.sidebar-toggle-btn {
			display: none !important;
		}
	}

	/* Hapus bottom-nav di mockup tablet dan desktop karena memakai Left Nav Rail / Sidebar */
	.tablet-body :global(.bottom-nav),
	.browser-body :global(.bottom-nav) {
		display: none !important;
	}

    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
