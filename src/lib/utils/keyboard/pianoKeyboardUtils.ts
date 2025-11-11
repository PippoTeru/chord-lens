/**
 * Piano Keyboard Utilities
 *
 * 88鍵盤ピアノの鍵盤生成と座標計算ロジック
 */

import type { WhiteNoteName, BlackNoteName, WhitePianoKey, BlackPianoKey } from '$lib/types';
import {
	WHITE_KEY_WIDTH,
	WHITE_KEY_HEIGHT,
	BLACK_KEY_WIDTH,
	BLACK_KEY_HEIGHT,
	KEY_CORNER_RADIUS_RATIO,
	MIN_MIDI_NUMBER,
	MAX_MIDI_NUMBER,
	WHITE_KEY_COUNT
} from '$lib/constants';

/**
 * 鍵盤の寸法定義
 */
export const DIMENSIONS = {
	whiteKeyWidth: WHITE_KEY_WIDTH,
	blackKeyWidth: BLACK_KEY_WIDTH,
	whiteKeyHeight: WHITE_KEY_HEIGHT,
	blackKeyHeight: BLACK_KEY_HEIGHT,
	cornerRadiusRatio: KEY_CORNER_RADIUS_RATIO,
	totalWhiteKeys: WHITE_KEY_COUNT,
} as const;

/**
 * 音域定義（88鍵盤：A0-C8）
 */
export const KEYBOARD_RANGE = {
	startMidi: MIN_MIDI_NUMBER, // A0
	endMidi: MAX_MIDI_NUMBER, // C8
	startOctave: 0,
	lastOctave: 8, // 最後のオクターブ（C8まで）
} as const;

/**
 * 音名の順序定義（Cから始まる）
 */
const NOTE_ORDER: Record<WhiteNoteName, number> = {
	C: 0,
	D: 1,
	E: 2,
	F: 3,
	G: 4,
	A: 5,
	B: 6,
} as const;

/**
 * 黒鍵のオフセット計算（N等分アルゴリズム）
 * 実際のピアノの黒鍵配置を再現するため、白鍵をグループごとにN等分し、
 * その分割点の中心に黒鍵を配置する
 */
export const BLACK_KEY_OFFSETS: Record<BlackNoteName, number> = (() => {
	const { whiteKeyWidth: W, blackKeyWidth: B } = DIMENSIONS;

	// C～Eグループ（3白鍵を5等分）
	const segmentCE = (3 * W) / 5;

	// F～Bグループ（4白鍵を7等分）
	const segmentFB = (4 * W) / 7;

	return {
		"C#": segmentCE * 1.5 - B / 2, // セグメント1と2の境界
		"D#": segmentCE * 3.5 - B / 2 - W, // セグメント3と4の境界（Dからのオフセット）
		"F#": segmentFB * 1.5 - B / 2, // セグメント1と2の境界
		"G#": segmentFB * 3.5 - B / 2 - W, // セグメント3と4の境界（Gからのオフセット）
		"A#": segmentFB * 5.5 - B / 2 - 2 * W, // セグメント5と6の境界（Aからのオフセット）
	};
})();

/**
 * 白鍵のインデックス（0-51）を取得
 * @param note - 音名（C, D, E, F, G, A, B）
 * @param octave - オクターブ番号（0-8）
 * @returns 白鍵のインデックス（0-51）
 */
export function getWhiteKeyIndex(note: WhiteNoteName, octave: number): number {
	// オクターブ0は特殊（A0とB0のみ）
	if (octave === 0) {
		return note === "A" ? 0 : 1;
	}

	// オクターブ1以降はCから始まる
	// オクターブ0のA0, B0の後（インデックス2から）が基準
	return 2 + (octave - 1) * 7 + NOTE_ORDER[note];
}

/**
 * 黒鍵のX座標を計算
 * @param note - 音名（C#, D#, F#, G#, A#）
 * @param octave - オクターブ番号（0-7）
 * @returns 黒鍵のX座標
 */
export function getBlackKeyX(note: BlackNoteName, octave: number): number {
	const baseNote = note.replace("#", "") as WhiteNoteName;
	const whiteKeyIndex = getWhiteKeyIndex(baseNote, octave);
	const whiteKeyX = whiteKeyIndex * DIMENSIONS.whiteKeyWidth;
	const offset = BLACK_KEY_OFFSETS[note];

	return whiteKeyX + offset;
}

/**
 * 白鍵データを生成（A0からC8まで）
 * @returns 白鍵データの配列
 */
export function generateWhiteKeys(): WhitePianoKey[] {
	const keys: WhitePianoKey[] = [];
	let midiNumber = KEYBOARD_RANGE.startMidi;

	// オクターブ0: A0, B0のみ
	keys.push({
		note: "A",
		octave: 0,
		midiNumber: midiNumber++,
		isBlack: false,
		isActive: false,
	});
	midiNumber++; // A#0をスキップ
	keys.push({
		note: "B",
		octave: 0,
		midiNumber: midiNumber++,
		isBlack: false,
		isActive: false,
	});

	// オクターブ1-8: C1からC8まで
	for (let octave = 1; octave <= KEYBOARD_RANGE.lastOctave; octave++) {
		// オクターブ8はCのみ
		const notes: WhiteNoteName[] =
			octave === 8 ? ["C"] : ["C", "D", "E", "F", "G", "A", "B"];

		for (const note of notes) {
			keys.push({
				note,
				octave,
				midiNumber,
				isBlack: false,
				isActive: false,
			});
			midiNumber++;

			// 黒鍵が存在する位置ではMIDI番号をスキップ（E-F、B-C間以外）
			if (note !== "E" && note !== "B" && octave < 8) {
				midiNumber++;
			}
		}
	}

	return keys;
}

/**
 * 黒鍵データを生成（A#0からG#7まで）
 * @returns 黒鍵データの配列
 */
export function generateBlackKeys(): BlackPianoKey[] {
	const keys: BlackPianoKey[] = [];

	// オクターブ0: A#0のみ（A0=21 + 1 = 22）
	keys.push({
		note: "A#",
		octave: 0,
		midiNumber: KEYBOARD_RANGE.startMidi + 1,
		isBlack: true,
		isActive: false,
	});

	// オクターブ1-7: 各オクターブに5つの黒鍵
	for (let octave = 1; octave <= 7; octave++) {
		const blackNotes: readonly BlackNoteName[] = [
			"C#",
			"D#",
			"F#",
			"G#",
			"A#",
		];
		const baseMidi = 12 * octave + 12; // オクターブのCのMIDI番号
		const midiOffsets = [1, 3, 6, 8, 10]; // Cからの各黒鍵のオフセット

		blackNotes.forEach((note, index) => {
			keys.push({
				note,
				octave,
				midiNumber: baseMidi + midiOffsets[index],
				isBlack: true,
				isActive: false,
			});
		});
	}

	return keys;
}

/**
 * 下部のみ角丸のSVGパスを生成
 * 上部は直角、下部のみ角丸にした矩形パスを作成
 * @param x - 左上のX座標
 * @param y - 左上のY座標
 * @param width - 幅
 * @param height - 高さ
 * @param radius - 角丸の半径
 * @returns SVGパス文字列
 */
export function createRoundedBottomPath(
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
): string {
	return `
		M ${x} ${y}
		L ${x + width} ${y}
		L ${x + width} ${height - radius}
		Q ${x + width} ${height} ${x + width - radius} ${height}
		L ${x + radius} ${height}
		Q ${x} ${height} ${x} ${height - radius}
		Z
	`
		.trim()
		.replace(/\s+/g, " ");
}
