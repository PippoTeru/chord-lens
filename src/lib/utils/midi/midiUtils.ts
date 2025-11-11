/**
 * MIDI Utilities
 *
 * MIDI番号と音名の変換などのユーティリティ関数
 */

import type { AccidentalNotation } from '$lib/stores';
import { SEMITONES_PER_OCTAVE } from '$lib/constants';

/**
 * MIDI番号から音名を取得（Sharp表記）
 *
 * @param midiNumber - MIDI番号（0-127）
 * @returns 音名（例: "C4", "C#4"）
 */
export function midiToNoteNameSharp(midiNumber: number): string {
	const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	const octave = Math.floor(midiNumber / SEMITONES_PER_OCTAVE) - 1;
	const noteName = noteNames[midiNumber % SEMITONES_PER_OCTAVE];
	return `${noteName}${octave}`;
}

/**
 * MIDI番号から音名を取得（Flat表記）
 *
 * @param midiNumber - MIDI番号（0-127）
 * @returns 音名（例: "C4", "Db4"）
 */
export function midiToNoteNameFlat(midiNumber: number): string {
	const noteNames = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
	const octave = Math.floor(midiNumber / SEMITONES_PER_OCTAVE) - 1;
	const noteName = noteNames[midiNumber % SEMITONES_PER_OCTAVE];
	return `${noteName}${octave}`;
}

/**
 * MIDI番号から音名を取得（設定に応じた表記）
 *
 * @param midiNumber - MIDI番号（0-127）
 * @param notation - 臨時記号表記（'sharp' または 'flat'）
 * @returns 音名（例: "C4", "C#4", "Db4"）
 */
export function midiToNoteName(midiNumber: number, notation: AccidentalNotation): string {
	return notation === 'sharp' ? midiToNoteNameSharp(midiNumber) : midiToNoteNameFlat(midiNumber);
}
