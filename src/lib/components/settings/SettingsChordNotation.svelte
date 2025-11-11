<script lang="ts">
	import { settingsStore, type KeyMode, type AccidentalNotation } from '$lib/stores';
	import { TONIC_NOTES } from '$lib/types';
	import CustomDropdown from '../common/CustomDropdown.svelte';

	interface Props {
		isOpen: boolean;
		isDark: boolean;
	}

	let { isOpen, isDark }: Props = $props();

	// Accidental notation options
	const accidentalOptions = [
		{ value: 'sharp', label: '♯ (Sharp)' },
		{ value: 'flat', label: '♭ (Flat)' }
	] as const;

	// Key mode options
	const keyModeOptions = [
		{ value: 'major', label: 'Major' },
		{ value: 'minor', label: 'Minor' }
	] as const;
</script>

<section class:dark={isDark}>
	<h3>Chord Notation</h3>

	<!-- 臨時記号表記 -->
	<div class="setting-item">
		<label for="accidental-notation">Accidental Notation</label>
		<CustomDropdown
			bind:value={settingsStore.accidentalNotation}
			options={accidentalOptions}
			onchange={(value) => settingsStore.setAccidentalNotation(value as AccidentalNotation)}
		/>
	</div>

	<!-- ディグリー表記ON/OFF -->
	<div class="setting-item checkbox-item">
		<label for="degree-notation">
			<input
				id="degree-notation"
				type="checkbox"
				checked={settingsStore.showDegreeNotation}
				onchange={() => settingsStore.toggleDegreeNotation()}
				tabindex={isOpen ? 0 : -1}
			/>
			Show Degree Notation
		</label>
	</div>

	<!-- 主音選択 -->
	<div class="setting-item">
		<label for="tonic-note">Tonic Note</label>
		<CustomDropdown
			bind:value={settingsStore.selectedTonic}
			options={TONIC_NOTES}
			onchange={(value) => settingsStore.setSelectedTonic(value)}
			placeholder="None"
			disabled={!settingsStore.showDegreeNotation}
		/>
	</div>

	<!-- キーモード選択 -->
	<div class="setting-item">
		<label for="key-mode">Key Mode</label>
		<CustomDropdown
			bind:value={settingsStore.selectedKeyMode}
			options={keyModeOptions}
			onchange={(value) => settingsStore.setKeyMode(value as KeyMode)}
			disabled={!settingsStore.showDegreeNotation}
		/>
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
		margin-bottom: 1.5rem;
	}

	.setting-item:last-child {
		margin-bottom: 0;
	}

	.setting-item label {
		font-size: 0.9rem;
		font-weight: 500;
		color: #333;
		display: block;
		margin-bottom: 0.5rem;
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
