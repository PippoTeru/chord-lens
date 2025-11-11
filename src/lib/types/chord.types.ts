/**
 * コード検出関連の型定義
 */

/**
 * コードマップ（インターバルパターン → コード名）
 * 値は文字列または文字列配列（複数の呼び方がある場合）
 */
export type ChordMap = Record<string, string | string[]>;

/**
 * 音名変換マップ（MIDI番号 % 12 → 音名）
 */
export type Num2ChordMap = Record<number, string>;

/**
 * コード名変換マップ（音名 → MIDI番号 % 12）
 */
export type Chord2NumMap = Record<string, number>;

/**
 * コード候補
 */
export interface ChordCandidate {
	name: string; // コード名（例: "C", "Dm7", "G7/B"）
	score: number; // スコア（高いほど優先）
}

/**
 * スコア別にグループ化されたコード候補
 */
export type ChordCandidateGroup = string[];

/**
 * 検出結果（複数候補）
 */
export interface ChordDetectionResult {
	primary: string; // 第1候補
	secondary?: string; // 第2候補
	tertiary?: string; // 第3候補
}

/**
 * インターバル（半音単位の音程）
 */
export type Interval = number;

/**
 * ピッチクラス（0-11の数値、Cを0とする）
 */
export type PitchClass = number;

/**
 * コード品質（メジャー、マイナー等）
 */
export type ChordQuality =
	| 'major'
	| 'minor'
	| 'diminished'
	| 'augmented'
	| 'suspended'
	| 'power'
	| 'seventh'
	| 'extended';

/**
 * コード構成音
 */
export interface ChordStructure {
	root: string; // ルート音名
	quality: ChordQuality; // コード品質
	intervals: Interval[]; // インターバルの配列
	bass?: string; // ベース音名（スラッシュコードの場合）
}
