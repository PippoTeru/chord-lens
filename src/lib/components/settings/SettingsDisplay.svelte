<script lang="ts">
	import { settingsStore, type ThemeMode, type KeyboardDisplayMode } from '$lib/stores';
	import CustomDropdown from '../common/CustomDropdown.svelte';

	interface Props {
		isOpen: boolean;
		isDark: boolean;
	}

	let { isOpen, isDark }: Props = $props();

	// Theme options
	const themeOptions = [
		{ value: 'system', label: 'System' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	] as const;

	// Keyboard display mode options
	const keyboardDisplayOptions = [
		{ value: 'physical', label: 'Physical (Ignore Sustain)' },
		{ value: 'sustained', label: 'Sustained (Follow Sustain Pedal)' }
	] as const;
</script>

<section class:dark={isDark}>
	<h3>Display</h3>

	<!-- テーマモード -->
	<div class="setting-item">
		<label for="theme-mode">Theme</label>
		<CustomDropdown
			bind:value={settingsStore.themeMode}
			options={themeOptions}
			onchange={(value) => settingsStore.setThemeMode(value as ThemeMode)}
		/>
	</div>

	<!-- 鍵盤表示モード -->
	<div class="setting-item">
		<label for="keyboard-display-mode">Keyboard Display Mode</label>
		<CustomDropdown
			bind:value={settingsStore.keyboardDisplayMode}
			options={keyboardDisplayOptions}
			onchange={(value) => settingsStore.setKeyboardDisplayMode(value as KeyboardDisplayMode)}
		/>
	</div>

	<!-- 視覚的フィードバック -->
	<div class="setting-item checkbox-item">
		<label for="visual-feedback">
			<input
				id="visual-feedback"
				type="checkbox"
				checked={settingsStore.visualFeedbackEnabled}
				onchange={() => settingsStore.toggleVisualFeedback()}
				tabindex={isOpen ? 0 : -1}
			/>
			Visual Feedback
		</label>
	</div>

	<!-- サステインインジケーター -->
	<div class="setting-item checkbox-item">
		<label for="sustain-indicator">
			<input
				id="sustain-indicator"
				type="checkbox"
				checked={settingsStore.sustainIndicatorEnabled}
				onchange={() => settingsStore.toggleSustainIndicator()}
				tabindex={isOpen ? 0 : -1}
			/>
			Sustain Pedal Indicator
		</label>
	</div>
</section>

<style>
	section {
		margin-bottom: 2rem;
	}

	h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	section.dark h3 {
		color: #999;
	}

	.setting-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.setting-item:last-child {
		margin-bottom: 0;
	}

	.setting-item label {
		font-size: 0.9rem;
		font-weight: 500;
		color: #333;
	}

	section.dark .setting-item label {
		color: #e0e0e0;
	}

	.checkbox-item {
		flex-direction: row;
		align-items: center;
	}

	.checkbox-item label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		margin-bottom: 0;
	}

	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		margin-right: 0;
		cursor: pointer;
		accent-color: #4caf50;
	}

	input[type='checkbox']:focus {
		outline: none;
	}

	input[type='checkbox']:focus-visible {
		outline: 2px solid #4caf50;
		outline-offset: 2px;
	}
</style>
