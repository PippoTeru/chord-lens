/**
 * ディグリー表記の型定義
 */

/**
 * 主音として選択可能な音名
 * C, C♯, D, E♭, E, F, F♯, G, A♭, A, B♭, B の12音
 * Unicode音楽記号（♯ U+266F、♭ U+266D）を使用
 */
export type TonicNote =
	| 'C'
	| 'C♯'
	| 'D'
	| 'E♭'
	| 'E'
	| 'F'
	| 'F♯'
	| 'G'
	| 'A♭'
	| 'A'
	| 'B♭'
	| 'B';

/**
 * 主音の選択肢リスト
 */
export const TONIC_NOTES: TonicNote[] = [
	'C',
	'C♯',
	'D',
	'E♭',
	'E',
	'F',
	'F♯',
	'G',
	'A♭',
	'A',
	'B♭',
	'B'
];

/**
 * キーモード（メジャー/マイナー）
 */
export type KeyMode = 'major' | 'minor';
