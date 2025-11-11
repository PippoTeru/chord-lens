/**
 * MIDI Provider Interfaces
 *
 * Web MIDI APIの抽象化層
 * テスタビリティと依存性注入のためのインターフェース定義
 */

/**
 * MIDIアクセスのインターフェース
 * Web MIDI APIのMIDIAccessを抽象化
 */
export interface IMIDIAccess {
	readonly inputs: MIDIInputMap;
	onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null;
}

/**
 * MIDIプロバイダーのインターフェース
 * MIDI APIへのアクセスを提供する
 */
export interface IMIDIProvider {
	/**
	 * MIDIアクセスを要求
	 * @param options - MIDIオプション
	 * @returns MIDIアクセスのPromise
	 */
	requestMIDIAccess(options?: MIDIOptions): Promise<IMIDIAccess>;
}

/**
 * ブラウザのWeb MIDI APIプロバイダー
 */
export class BrowserMIDIProvider implements IMIDIProvider {
	async requestMIDIAccess(options?: MIDIOptions): Promise<IMIDIAccess> {
		// Web MIDI API対応チェック
		if (!navigator.requestMIDIAccess) {
			throw new Error('Web MIDI API is not supported in this browser');
		}

		return navigator.requestMIDIAccess(options);
	}
}

/**
 * モックMIDIプロバイダー（テスト用）
 */
export class MockMIDIProvider implements IMIDIProvider {
	private mockInputs: Map<string, MIDIInput> = new Map();
	private stateChangeHandler: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null = null;

	constructor(mockDevices: Array<{ id: string; name: string; manufacturer: string }> = []) {
		// モックデバイスを作成
		for (const device of mockDevices) {
			const mockInput = this.createMockInput(device);
			this.mockInputs.set(device.id, mockInput);
		}
	}

	async requestMIDIAccess(_options?: MIDIOptions): Promise<IMIDIAccess> {
		return {
			inputs: this.mockInputs as MIDIInputMap,
			onstatechange: this.stateChangeHandler,
		};
	}

	/**
	 * モックMIDI入力を作成
	 */
	private createMockInput(device: { id: string; name: string; manufacturer: string }): MIDIInput {
		return {
			id: device.id,
			name: device.name,
			manufacturer: device.manufacturer,
			type: 'input' as MIDIPortType,
			version: '1.0',
			state: 'connected' as MIDIPortDeviceState,
			connection: 'closed' as MIDIPortConnectionState,
			onmidimessage: null,
			onstatechange: null,
			open: async () => ({} as MIDIInput),
			close: async () => ({} as MIDIInput),
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => true,
		} as MIDIInput;
	}

	/**
	 * モックMIDIメッセージを送信（テスト用）
	 */
	sendMockMessage(deviceId: string, data: Uint8Array): void {
		const input = this.mockInputs.get(deviceId);
		if (input && input.onmidimessage) {
			const event = {
				data,
				timeStamp: performance.now(),
				target: input,
			} as unknown as MIDIMessageEvent;

			input.onmidimessage(event);
		}
	}

	/**
	 * モックデバイスを追加（テスト用）
	 */
	addMockDevice(device: { id: string; name: string; manufacturer: string }): void {
		const mockInput = this.createMockInput(device);
		this.mockInputs.set(device.id, mockInput);

		// statechangeイベントを発火
		if (this.stateChangeHandler) {
			const event = new Event('statechange') as MIDIConnectionEvent;
			this.stateChangeHandler.call({} as MIDIAccess, event);
		}
	}

	/**
	 * モックデバイスを削除（テスト用）
	 */
	removeMockDevice(deviceId: string): void {
		this.mockInputs.delete(deviceId);

		// statechangeイベントを発火
		if (this.stateChangeHandler) {
			const event = new Event('statechange') as MIDIConnectionEvent;
			this.stateChangeHandler.call({} as MIDIAccess, event);
		}
	}
}
