<script lang="ts">
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { midiStore } from '$lib/stores/midiStore.svelte';
	import CustomDropdown from '../common/CustomDropdown.svelte';

	interface Props {
		isOpen: boolean;
		isDark: boolean;
	}

	let { isOpen, isDark }: Props = $props();

	/**
	 * MIDIデバイス一覧を取得
	 */
	let midiDevices: Array<{ id: string; name: string }> = $state([]);

	// MIDI有効化とSettings開閉を監視してデバイス一覧を更新
	$effect(() => {
		if (midiStore.midiEnabled && isOpen) {
			const midiManager = midiStore.getMIDIManager();
			if (midiManager) {
				const midiState = midiManager.getState();
				midiDevices = midiState.activeDevices.map((d) => ({
					id: d.id,
					name: d.name,
				}));
			}
		}
	});

	/**
	 * ドロップダウン用のオプション配列を生成
	 */
	const deviceOptions = $derived([
		{ value: '', label: 'All Devices' },
		...midiDevices.map(d => ({ value: d.id, label: d.name }))
	] as const);
</script>

<section class:dark={isDark}>
	<h3>MIDI</h3>

	<!-- MIDIデバイス選択 -->
	<div class="setting-item">
		<label for="midi-device">MIDI Device</label>
		<CustomDropdown
			bind:value={settingsStore.selectedMidiDeviceId}
			options={deviceOptions}
			onchange={(value) => settingsStore.selectMidiDevice(value || null)}
			placeholder="All Devices"
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
		margin-bottom: 1rem;
	}

	.setting-item label {
		font-size: 0.9rem;
		font-weight: 500;
		color: #333;
	}

	section.dark .setting-item label {
		color: #e0e0e0;
	}
</style>
