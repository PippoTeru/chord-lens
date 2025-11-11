/**
 * MIDI Constants
 *
 * MIDI仕様に基づく定数定義
 */

/**
 * 1オクターブあたりの半音数
 * 音楽理論の基本: 1オクターブは12半音で構成される
 */
export const SEMITONES_PER_OCTAVE = 12;

/**
 * MIDI番号の有効範囲
 * MIDI仕様: 0-127の128段階
 */
export const MIDI_NUMBER = {
	MIN: 0,
	MAX: 127,
} as const;

/**
 * 88鍵ピアノのMIDI範囲
 * A0 (MIDI 21) から C8 (MIDI 108) まで
 */
export const PIANO_88_KEY_RANGE = {
	MIN: 21, // A0
	MAX: 108, // C8
} as const;

/**
 * サステインペダル（ダンパーペダル）の定義
 * MIDI CC#64で制御される
 */
export const SUSTAIN_PEDAL = {
	/** Control Change番号 */
	CC_NUMBER: 64,
	/** ON/OFF判定閾値（0-63: OFF, 64-127: ON） */
	THRESHOLD: 64,
} as const;
