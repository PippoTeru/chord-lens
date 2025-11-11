/**
 * ピアノ鍵盤関連の型定義
 */

/**
 * 音名の型定義
 */
export type WhiteNoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type BlackNoteName = 'C#' | 'D#' | 'F#' | 'G#' | 'A#';
export type NoteName = WhiteNoteName | BlackNoteName;

/**
 * ピアノ鍵盤の型定義
 */
export interface WhitePianoKey {
	note: WhiteNoteName; // 白鍵の音名（C, D, E, F, G, A, B）
	octave: number; // オクターブ番号（0-8）
	midiNumber: number; // MIDI番号（21-108）
	isBlack: false; // 白鍵フラグ
	isActive: boolean; // アクティブ状態（押下中など）
}

export interface BlackPianoKey {
	note: BlackNoteName; // 黒鍵の音名（C#, D#, F#, G#, A#）
	octave: number; // オクターブ番号（0-7）
	midiNumber: number; // MIDI番号（22-106）
	isBlack: true; // 黒鍵フラグ
	isActive: boolean; // アクティブ状態（押下中など）
}

export type PianoKey = WhitePianoKey | BlackPianoKey;

/**
 * 音域定義（88鍵盤：A0-C8）
 */
export interface KeyboardRange {
	startMidi: number; // A0 = 21
	endMidi: number; // C8 = 108
	startOctave: number; // 0
	lastOctave: number; // 8
}

/**
 * 鍵盤の寸法定義
 */
export interface KeyboardDimensions {
	whiteKeyWidth: number;
	blackKeyWidth: number;
	whiteKeyHeight: number;
	blackKeyHeight: number;
	cornerRadiusRatio: number; // 鍵盤幅に対する角丸の比率（下部のみ）
	totalWhiteKeys: number; // 88鍵盤のうち白鍵の数
}
