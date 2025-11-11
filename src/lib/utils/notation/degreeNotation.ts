/**
 * ディグリー表記変換ユーティリティ
 *
 * コード名を主音に対するディグリー表記（ローマ数字）に変換します。
 * 例: C major において D7 → Ⅱ7
 */

import { chord2num } from '../chord/chordMaps';
import type { TonicNote, KeyMode } from '$lib/types';

/**
 * ディグリー表記用のローマ数字
 */
const DEGREE_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/**
 * コード名をディグリー表記に変換
 *
 * @param chordName - コード名（通常形式）例: "Dm7", "C#M7/G#"
 * @param tonic - 主音（C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, B）
 * @param keyMode - キーモード（'major' または 'minor'）
 * @returns ディグリー表記（例: "Ⅱm7", "♯Ⅰ△7/♯Ⅴ"）、変換できない場合はnull
 */
export function chordToDegree(chordName: string, tonic: TonicNote | null, keyMode: KeyMode = 'major'): string | null {
	if (!tonic) return null;

	// 1. ルート音を抽出
	const root = extractRoot(chordName);
	if (!root) return null;

	// 2. 元のコード名の臨時記号表記を判定（♯/# または ♭）
	const preferSharp = root.includes('♯') || root.includes('#');

	// 3. 半音数に変換
	const rootSemitone = chord2num[root.toLowerCase()];
	const tonicSemitone = chord2num[tonic.toLowerCase()];

	if (rootSemitone === undefined || tonicSemitone === undefined) return null;

	// 4. ディグリー計算（主音からの半音数）
	const degree = (rootSemitone - tonicSemitone + 12) % 12;

	// 5. コードクオリティ（ルート音以降の部分）を抽出
	const quality = extractQuality(chordName, root);

	// 6. スラッシュコードの場合、ベース音もディグリー表記に変換
	const slashIndex = chordName.indexOf('/');
	if (slashIndex !== -1) {
		const bassNote = chordName.substring(slashIndex + 1);
		const bassPreferSharp = bassNote.includes('♯') || bassNote.includes('#');
		const bassDegree = noteToDegreeWithPreference(bassNote, tonic, keyMode, bassPreferSharp);
		if (!bassDegree) return null;

		const mainDegree = degreeToRomanNumeral(degree, keyMode, preferSharp);
		if (!mainDegree) return null;

		return mainDegree + quality + '/' + bassDegree;
	}

	// 7. 通常のコードの場合
	const romanNumeral = degreeToRomanNumeral(degree, keyMode, preferSharp);
	if (!romanNumeral) return null;

	return romanNumeral + quality;
}


/**
 * 半音数をローマ数字ディグリーに変換
 * 臨時記号（♯、♭）はUnicode文字を使用
 *
 * @param degree - 主音からの半音数（0-11）
 * @param keyMode - キーモード（'major' または 'minor'）
 * @param preferSharp - ♯表記を優先するかどうか（デフォルト: false = ♭優先）
 * @returns ローマ数字表記（例: "Ⅰ", "♭Ⅱ"）
 */
function degreeToRomanNumeral(degree: number, keyMode: KeyMode = 'major', preferSharp: boolean = false): string | null {
	// 基準となるディグリー
	// メジャー: I, II, III, IV, V, VI, VII (0, 2, 4, 5, 7, 9, 11)
	// マイナー: I, II, ♭III, IV, V, ♭VI, ♭VII (0, 2, 3, 5, 7, 8, 10)
	const normalDegrees = keyMode === 'major'
		? [0, 2, 4, 5, 7, 9, 11]
		: [0, 2, 3, 5, 7, 8, 10];

	// 通常のディグリーに一致する場合
	if (normalDegrees.includes(degree)) {
		const index = normalDegrees.indexOf(degree);
		return DEGREE_NUMERALS[index];
	}

	// 変化音の場合（♭または♯を付ける）
	const flatDegree = (degree + 1) % 12;
	const sharpDegree = (degree - 1 + 12) % 12;

	// preferSharpに応じて優先順位を変える
	if (preferSharp) {
		// ♯表記を優先
		if (normalDegrees.includes(sharpDegree)) {
			const index = normalDegrees.indexOf(sharpDegree);
			return '♯' + DEGREE_NUMERALS[index];
		}
		// ♯で表記できない場合は♭
		if (normalDegrees.includes(flatDegree)) {
			const index = normalDegrees.indexOf(flatDegree);
			return '♭' + DEGREE_NUMERALS[index];
		}
	} else {
		// ♭表記を優先
		if (normalDegrees.includes(flatDegree)) {
			const index = normalDegrees.indexOf(flatDegree);
			return '♭' + DEGREE_NUMERALS[index];
		}
		// ♭で表記できない場合は♯
		if (normalDegrees.includes(sharpDegree)) {
			const index = normalDegrees.indexOf(sharpDegree);
			return '♯' + DEGREE_NUMERALS[index];
		}
	}

	return null;
}

/**
 * 単一の音名をディグリー表記に変換（スラッシュコードのベース音用、臨時記号の優先順位指定あり）
 *
 * @param noteName - 音名（例: "C#", "Eb"）
 * @param tonic - 主音
 * @param keyMode - キーモード（'major' または 'minor'）
 * @param preferSharp - ♯表記を優先するかどうか
 * @returns ディグリー表記（例: "♯Ⅰ", "♭Ⅲ"）
 */
function noteToDegreeWithPreference(noteName: string, tonic: TonicNote, keyMode: KeyMode = 'major', preferSharp: boolean = false): string | null {
	const semitone = chord2num[noteName.toLowerCase()];
	const tonicSemitone = chord2num[tonic.toLowerCase()];

	if (semitone === undefined || tonicSemitone === undefined) return null;

	const degree = (semitone - tonicSemitone + 12) % 12;
	return degreeToRomanNumeral(degree, keyMode, preferSharp);
}

/**
 * コード名からルート音を抽出
 *
 * @param chordName - コード名（例: "Dm7", "C#M7/G#"）
 * @returns ルート音（例: "D", "C#"）、抽出できない場合はnull
 */
function extractRoot(chordName: string): string | null {
	// スラッシュコードの場合、スラッシュより前の部分のみ使用
	const slashIndex = chordName.indexOf('/');
	const rootPart = slashIndex !== -1 ? chordName.substring(0, slashIndex) : chordName;

	// ルート音部分を抽出（A-G + オプションの#/♯または♭）
	// Note: # (U+0023) と ♯ (U+266F) の両方に対応
	const match = rootPart.match(/^([A-G][#♯♭]?)/);
	return match ? match[1] : null;
}

/**
 * コード名からクオリティ部分を抽出
 *
 * @param chordName - コード名（例: "Dm7", "C#M7/G#"）
 * @param root - ルート音（例: "D", "C#"）
 * @returns クオリティ部分（例: "m7", "M7"）
 */
function extractQuality(chordName: string, root: string): string {
	// スラッシュコードの場合、スラッシュより前の部分のみ使用
	const slashIndex = chordName.indexOf('/');
	const mainPart = slashIndex !== -1 ? chordName.substring(0, slashIndex) : chordName;

	// ルート音の後の部分を取得
	return mainPart.substring(root.length);
}
