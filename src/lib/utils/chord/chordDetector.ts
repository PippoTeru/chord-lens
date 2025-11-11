// コード検出メイン処理
// chord-detection-spec-v3.md に基づく実装

import { getStandardChordMap, chord2num, num2chord, getNum2Chord, type ChordMap } from './chordMaps';
import { generateChordList, generateChordListWithOmit } from './chordGenerator';
import { selectBestChordName, groupCandidatesByScore } from './chordScoring';
import { mergeParentheses } from '../notation/mNotoConverter';
import type { AccidentalNotation } from '$lib/stores';

// 生成されたコードマップ（モジュール読み込み時に即座に生成）
// Eager initialization: 初回コード検出の遅延を排除
const generatedChordMap: ChordMap = generateChordList();
const generatedChordMapWithOmit: ChordMap = generateChordListWithOmit();

/**
 * コード検出オプション
 */
export interface ChordDetectionOptions {
	/**
	 * 臨時記号表記（'sharp' または 'flat'）
	 * デフォルト: 'sharp'
	 */
	accidentalNotation?: AccidentalNotation;

	/**
	 * 複数候補を返すかどうか
	 * true: 同じスコアの候補を全て返す
	 * false: 第1候補のみ返す
	 * デフォルト: false
	 */
	returnAll?: boolean;

	/**
	 * 括弧統合を行うかどうか
	 * true: (9)(13) → (9, 13) のように統合する
	 * false: 括弧統合を行わない
	 * デフォルト: true
	 */
	mergeParenthesesEnabled?: boolean;
}

/**
 * MIDI番号のセットからコード名を検出（統合版）
 *
 * @param midiNumbers - MIDI番号のSet
 * @param options - 検出オプション
 * @returns 検出されたコード名（returnAll=trueの場合は配列、falseの場合は文字列）
 */
export function detectChord(
	midiNumbers: Set<number>,
	options: ChordDetectionOptions & { returnAll: true }
): string[];
export function detectChord(
	midiNumbers: Set<number>,
	options?: ChordDetectionOptions & { returnAll?: false }
): string;
export function detectChord(
	midiNumbers: Set<number>,
	options: ChordDetectionOptions = {}
): string | string[] {
	const {
		accidentalNotation = 'sharp',
		returnAll = false,
		mergeParenthesesEnabled = true
	} = options;

	// 空の場合
	if (midiNumbers.size === 0) {
		return returnAll ? [] : '';
	}

	// 設定に応じた音名変換マップを取得
	const useFlat = accidentalNotation === 'flat';
	const num2chordMap = getNum2Chord(useFlat);

	// 1. MIDI番号をソートして、最低音を取得
	const sortedMidi = Array.from(midiNumbers).sort((a, b) => a - b);
	const lowestMidi = sortedMidi[0];
	const lowestNoteName = num2chordMap[lowestMidi % 12];

	// 2. ピッチクラスに正規化（ソート）
	const pitchClasses = normalizeToPitchClasses(midiNumbers, num2chordMap);

	// 1音の場合は何も表示しない
	if (pitchClasses.length === 1) {
		return returnAll ? [] : '';
	}

	// 2音の場合はパワーコード（5th）のみ表示
	if (pitchClasses.length === 2) {
		const intervals = toIntervals(pitchClasses);
		// パワーコード (0,7) のみ表示、それ以外は空文字
		if (intervals.join(',') === '0,7') {
			const chord = pitchClasses[0] + '5';
			return returnAll ? [chord] : chord;
		}
		return returnAll ? [] : '';
	}

	// 3. コード検出
	const candidates = findChordCandidates(pitchClasses, lowestNoteName);

	if (candidates.length === 0) {
		return returnAll ? [] : '';
	}

	// 4. スコアリング（スコアごとにグループ化）
	const groups = groupCandidatesByScore(candidates);

	// 5. 第1位のグループのみ処理（括弧統合オプション）
	const result: string[] = [];
	if (groups.length > 0) {
		const topGroup = groups[0];
		for (const chordName of topGroup) {
			const processedChord = mergeParenthesesEnabled
				? mergeParentheses(chordName)
				: chordName;
			result.push(processedChord);
		}
	}

	// 6. returnAllオプションに応じて返す
	return returnAll ? result : (result.length > 0 ? result[0] : '');
}

/**
 * MIDI番号をピッチクラス（音名）に正規化
 * 最低音を基準にした順序で並べる
 */
function normalizeToPitchClasses(midiNumbers: Set<number>, num2chordMap: Record<number, string>): string[] {
  // MIDI番号をソート
  const sortedMidi = Array.from(midiNumbers).sort((a, b) => a - b);

  // 最低音のピッチクラスを取得
  const lowestPc = sortedMidi[0] % 12;

  // ピッチクラスに変換（重複除去）
  const uniquePitchClasses: number[] = [];
  const seen = new Set<number>();

  for (const midi of sortedMidi) {
    const pc = midi % 12;
    if (!seen.has(pc)) {
      uniquePitchClasses.push(pc);
      seen.add(pc);
    }
  }

  // 最低音を基準に並べ替え（クロマチックな順序）
  const sorted = uniquePitchClasses.sort((a, b) => {
    const aDistance = (a - lowestPc + 12) % 12;
    const bDistance = (b - lowestPc + 12) % 12;
    return aDistance - bDistance;
  });

  // 音名に変換
  return sorted.map(pc => num2chordMap[pc]);
}

/**
 * コード候補を検索
 * 元のchord_finder.jsのtoChords関数を完全コピー
 */
function findChordCandidates(pitchClasses: string[], lowestNoteName: string): string[] {
  const candidates: string[] = [];

  // 3種類のマップで検索（元の実装に合わせてstandard → generated1 → generated2の順）
  const maps: [ChordMap, string][] = [
    [getStandardChordMap(), 'standard'],
    [getGeneratedChordMap(), 'generated1'],
    [getGeneratedChordMapWithOmit(), 'generated2'],
  ];

  for (const [chordMap, mapType] of maps) {
    // 1. 直接マッチ検索
    searchDirectMatch(pitchClasses, chordMap, candidates);

    // 2. ベース音除去検索
    searchWithBassRemoved(pitchClasses, lowestNoteName, chordMap, candidates);

    // 3. 転回形検索
    searchInversions(pitchClasses, lowestNoteName, chordMap, candidates);
  }

  // 重複除去
  return Array.from(new Set(candidates));
}

/**
 * 直接マッチ検索
 * ピッチクラスをそのまま検索
 */
function searchDirectMatch(pitchClasses: string[], chordMap: ChordMap, candidates: string[]): void {
  const result = find(pitchClasses, chordMap);
  if (result !== null) {
    const chords = Array.isArray(result) ? result : [result];
    candidates.push(...chords);
  }
}

/**
 * ベース音除去検索
 * ベース音を除いた音でコードを検索し、スラッシュコードとして追加
 */
function searchWithBassRemoved(
  pitchClasses: string[],
  lowestNoteName: string,
  chordMap: ChordMap,
  candidates: string[]
): void {
  const withoutBass = pitchClasses.slice(1); // ベース音を除去

  // ベース音を除いて直接検索
  const directResult = find(withoutBass, chordMap);
  if (directResult !== null) {
    const chords = Array.isArray(directResult) ? directResult : [directResult];
    for (const chord of chords) {
      candidates.push(createSlashChord(chord, lowestNoteName));
    }
  }

  // ベース音を除いて転回形検索
  const rotateResults = findWithRotate(withoutBass, lowestNoteName, chordMap);
  candidates.push(...rotateResults);
}

/**
 * 転回形検索
 * ピッチクラスを回転させながら検索
 */
function searchInversions(
  pitchClasses: string[],
  lowestNoteName: string,
  chordMap: ChordMap,
  candidates: string[]
): void {
  const rotateResults = findWithRotate(pitchClasses, lowestNoteName, chordMap);
  candidates.push(...rotateResults);
}

/**
 * 音名配列からコード名を検索
 */
function find(noteNames: string[], chordMap: ChordMap): string | string[] | null {
  // 相対値化（ルートからの半音数）
  const intervals = toIntervals(noteNames);

  // マップから検索
  const key = intervals.join(',');
  const chordSuffix = chordMap[key];

  if (chordSuffix !== undefined) {
    // 配列の場合は、各要素にルート音を追加
    if (Array.isArray(chordSuffix)) {
      return chordSuffix.map(suffix => noteNames[0] + suffix);
    }
    return noteNames[0] + chordSuffix;
  }

  return null;
}

/**
 * スラッシュコードを作成
 * 例: "Dm9(omit5)" + "/C" → "Dm9(omit5)/C"
 */
function createSlashChord(chord: string, bass: string): string {
  const bassUpper = bass.toUpperCase();
  // そのまま結合（修飾子はスラッシュの前に残る）
  return chord + '/' + bassUpper;
}

/**
 * 転回形を検出
 */
function findWithRotate(noteNames: string[], root: string, chordMap: ChordMap): string[] {
  const results: string[] = [];

  // 配列を回転させながら検索
  for (let i = 1; i < noteNames.length; i++) {
    const rotated = [...noteNames.slice(i), ...noteNames.slice(0, i)];
    const res = find(rotated, chordMap);

    if (res) {
      // 配列の場合は各要素を処理
      const chords = Array.isArray(res) ? res : [res];
      for (const chord of chords) {
        results.push(createSlashChord(chord, root));
      }
    }
  }

  return results;
}

/**
 * 音名配列をインターバル配列に変換
 */
function toIntervals(noteNames: string[]): number[] {
  if (noteNames.length === 0) return [];

  const rootPitch = chord2num[noteNames[0].toLowerCase()];
  if (rootPitch === undefined) {
    console.error('Unknown root note:', noteNames[0]);
    return [];
  }

  return noteNames.map(name => {
    if (!name) {
      console.error('Undefined note name in:', noteNames);
      return 0;
    }
    const pitch = chord2num[name.toLowerCase()];
    if (pitch === undefined) {
      console.error('Unknown note:', name, 'in', noteNames);
      return 0;
    }
    return (pitch - rootPitch + 12) % 12;
  });
}

/**
 * 生成されたコードマップを取得（omitなし）
 */
function getGeneratedChordMap(): ChordMap {
  return generatedChordMap;
}

/**
 * 生成されたコードマップを取得（omitあり）
 */
function getGeneratedChordMapWithOmit(): ChordMap {
  return generatedChordMapWithOmit;
}
