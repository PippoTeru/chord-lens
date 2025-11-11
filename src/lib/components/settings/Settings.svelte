<script lang="ts">
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { onMount } from 'svelte';
	import { SETTINGS_FOCUS_DELAY } from '$lib/constants/ui';
	import SettingsMIDI from './SettingsMIDI.svelte';
	import SettingsDisplay from './SettingsDisplay.svelte';
	import SettingsChordNotation from './SettingsChordNotation.svelte';

	/**
	 * オーバーレイクリックで閉じる
	 */
	function handleOverlayClick() {
		settingsStore.closeSettings();
	}

	/**
	 * パネル内クリックは伝播を止める
	 */
	function handlePanelClick(event: MouseEvent) {
		event.stopPropagation();
	}

	/**
	 * DOM要素への参照
	 */
	let settingsPanel: HTMLDivElement;
	let closeButton: HTMLButtonElement;

	/**
	 * グローバルキーボードイベント（Esc、's'キー）
	 */
	function handleGlobalKeyDown(event: KeyboardEvent) {
		// Escキーで設定パネルを閉じる（パネルが開いている場合のみ処理し、イベントを停止）
		if (event.key === 'Escape' && settingsStore.isSettingsOpen) {
			event.preventDefault();
			event.stopPropagation();
			settingsStore.closeSettings();
			return;
		}

		// 's'キーで設定パネルをトグル（input/select要素でのタイプ中は無視）
		if (event.key === 's' || event.key === 'S') {
			const target = event.target as HTMLElement;
			const isTyping = target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA';
			if (!isTyping) {
				event.preventDefault();
				settingsStore.toggleSettings();
			}
		}
	}

	/**
	 * パネル内のキーボードイベント（フォーカストラップ）
	 */
	function handlePanelKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			const focusableElements = settingsPanel.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const focusableArray = Array.from(focusableElements);
			const firstElement = focusableArray[0];
			const lastElement = focusableArray[focusableArray.length - 1];

			// Shift+Tab: 最初の要素から戻ろうとしたら最後の要素へ
			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement?.focus();
			}
			// Tab: 最後の要素から進もうとしたら最初の要素へ
			else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement?.focus();
			}
		}
	}

	/**
	 * 設定パネルが開いたときに最初のフォーカス可能な要素にフォーカスを当てる
	 */
	$effect(() => {
		if (settingsStore.isSettingsOpen && settingsPanel) {
			// パネルが開いたら、closeButtonにフォーカス
			setTimeout(() => {
				closeButton?.focus();
			}, SETTINGS_FOCUS_DELAY); // トランジションの後にフォーカス
		}
		// パネルが閉じた時は自動フォーカスしない（Tabキーでのみフォーカス）
	});

	/**
	 * グローバルキーボードリスナーを登録
	 */
	onMount(() => {
		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => {
			window.removeEventListener('keydown', handleGlobalKeyDown);
		};
	});
</script>

<!-- 設定ボタン（常に表示） -->
<button
	class="settings-button"
	class:open={settingsStore.isSettingsOpen}
	class:dark={settingsStore.isDarkMode}
	onclick={() => settingsStore.toggleSettings()}
	aria-label="Toggle settings"
>
	<span class="button-icon">⚙️</span>
</button>

{#if settingsStore.isSettingsOpen}
	<!-- オーバーレイ -->
	<div class="overlay" onclick={handleOverlayClick} role="presentation"></div>
{/if}

<!-- 設定パネル -->
<div
	bind:this={settingsPanel}
	class="settings-panel"
	class:open={settingsStore.isSettingsOpen}
	class:dark={settingsStore.isDarkMode}
	onclick={handlePanelClick}
	onkeydown={handlePanelKeyDown}
	role="dialog"
	aria-label="Settings"
	aria-modal="true"
	inert={!settingsStore.isSettingsOpen}
>
	<!-- ヘッダー -->
	<div class="header">
		<h2>Settings</h2>
		<button
			bind:this={closeButton}
			class="close-button"
			onclick={() => settingsStore.closeSettings()}
			aria-label="Close settings"
			tabindex={settingsStore.isSettingsOpen ? 0 : -1}
		>
			<span class="button-icon">✕</span>
		</button>
	</div>

	<!-- コンテンツ -->
	<div class="content">
		<!-- MIDI設定 -->
		<SettingsMIDI isOpen={settingsStore.isSettingsOpen} isDark={settingsStore.isDarkMode} />

		<!-- 表示設定 -->
		<SettingsDisplay isOpen={settingsStore.isSettingsOpen} isDark={settingsStore.isDarkMode} />

		<!-- コード表記設定 -->
		<SettingsChordNotation isOpen={settingsStore.isSettingsOpen} isDark={settingsStore.isDarkMode} />

		<!-- リセットボタン -->
		<section>
			<button class="reset-button" onclick={() => settingsStore.resetSettings()} tabindex={settingsStore.isSettingsOpen ? 0 : -1}>
				Reset to Defaults
			</button>
		</section>
	</div>
</div>

<style>
	.settings-button {
		position: absolute;
		top: 20px;
		right: 0;
		background: white;
		border: 2px solid #ddd;
		border-right: none;
		border-radius: 8px 0 0 8px;
		padding: 12px 16px;
		cursor: pointer;
		box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
		z-index: 1002;
		display: flex;
		align-items: center;
		justify-content: center;
		will-change: transform;
	}

	.settings-button .button-icon {
		font-size: 1.5rem;
		line-height: 1;
		display: block;
	}

	.settings-button.dark {
		background: #2d2d2d;
		border-color: #555;
		color: #e0e0e0;
	}

	.settings-button:hover {
		background-color: #f5f5f5;
		border-color: #4caf50;
		box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.2);
	}

	.settings-button.dark:hover {
		background-color: #3a3a3a;
	}

	.settings-button:focus {
		outline: none;
	}

	.settings-button:focus-visible {
		outline: 2px solid #4caf50;
		outline-offset: 2px;
	}

	.settings-button.open {
		transform: translateX(-320px);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.settings-panel {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 320px;
		background-color: white;
		box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
		z-index: 1001;
		display: flex;
		flex-direction: column;
		transform: translateX(100%);
		transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
		pointer-events: none;
		will-change: transform;
	}

	.settings-panel.dark {
		background-color: #2d2d2d;
		color: #e0e0e0;
	}

	.settings-panel.open {
		transform: translateX(0);
		pointer-events: auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e0;
	}

	.settings-panel.dark .header {
		border-bottom-color: #444;
	}

	.header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #333;
	}

	.settings-panel.dark .header h2 {
		color: #e0e0e0;
	}

	.close-button {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s;
	}

	.close-button .button-icon {
		font-size: 1.5rem;
		line-height: 1;
		display: block;
	}

	.settings-panel.dark .close-button {
		color: #999;
	}

	.close-button:hover {
		color: #333;
	}

	.settings-panel.dark .close-button:hover {
		color: #e0e0e0;
	}

	.close-button:focus {
		outline: none;
	}

	.close-button:focus-visible {
		outline: 2px solid #4caf50;
		outline-offset: 0;
		border-radius: 4px;
	}

	.content {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
	}

	/* スクロールバーのスタイル（ライトモード） */
	.content::-webkit-scrollbar {
		width: 8px;
	}

	.content::-webkit-scrollbar-track {
		background: #f5f5f5;
	}

	.content::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 4px;
	}

	.content::-webkit-scrollbar-thumb:hover {
		background: #aaa;
	}

	/* スクロールバーのスタイル（ダークモード） */
	.settings-panel.dark .content::-webkit-scrollbar-track {
		background: #1a1a1a;
	}

	.settings-panel.dark .content::-webkit-scrollbar-thumb {
		background: #555;
	}

	.settings-panel.dark .content::-webkit-scrollbar-thumb:hover {
		background: #666;
	}

	section {
		margin-bottom: 2rem;
	}

	section:last-child {
		margin-bottom: 0;
	}

	.reset-button {
		width: 100%;
		padding: 0.75rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: #666;
		background-color: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.settings-panel.dark .reset-button {
		background-color: #1a1a1a;
		border-color: #555;
		color: #999;
	}

	.reset-button:hover {
		background-color: #e0e0e0;
		color: #333;
	}

	.settings-panel.dark .reset-button:hover {
		background-color: #333;
		color: #e0e0e0;
	}

	.reset-button:focus {
		outline: none;
	}

	.reset-button:focus-visible {
		outline: 2px solid #4caf50;
		outline-offset: 2px;
	}
</style>
