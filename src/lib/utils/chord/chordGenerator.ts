// 動的コード生成
// chord-detection-spec-v3.md に基づく実装

import type { ChordMap } from './chordMaps';

type ChordEntry = [number | number[] | null, string, ReplacementRule[]?];
type ReplacementRule = [RegExp, string];

/**
 * 動的にコードリストを生成（omitなし）
 */
export function generateChordList(): ChordMap {
  return generateChordListInternal(false);
}

/**
 * 動的にコードリストを生成（omitあり）
 */
export function generateChordListWithOmit(): ChordMap {
  return generateChordListInternal(true);
}

/**
 * 動的にコードリストを生成（内部関数）
 */
function generateChordListInternal(includeOmit: boolean): ChordMap {
  const root_ary: ChordEntry[] = [[0, ""]];

  const third_ary: ChordEntry[] = [
    [null, "(omit3)"],
    [2, "sus2"],
    [3, "m"],
    [4, ""],
    [5, "sus4"],
  ];

  const fifth_ary: ChordEntry[] = [
    [null, "(omit5)"],
    [6, "(♭5)"],
    [7, ""],
    [8, "(♯5)"],
  ];

  const seventh_ary: ChordEntry[] = [
    [null, ""],
    [9, "6"],
    [10, "7"],
    [11, "M7"],
  ];

  const tension_ary: ChordEntry[] = [
    [1, "(♭9)"],
    [2, "(9)", [[/7/, "9"]]],              // 7 → 9 置き換え
    [3, "(♯9)"],
    [5, "(11)", [[/9(?!\))/, "11"]]],      // 9 → 11 置き換え（括弧付きでない9）
    [6, "(♯11)"],
    [8, "(♭13)"],
    [9, "(13)", [[/11(?!\))/, "13"]]],     // 11 → 13 置き換え（括弧付きでない11）
    [10, "(♯13)"],
  ];

  // Step 1: 基本コードの生成
  let tmp_ary = productArray(root_ary, third_ary);
  tmp_ary = productArray(tmp_ary, seventh_ary);

  // Step 2: sus4を末尾に移動
  tmp_ary = moveToTail(tmp_ary, /(sus\d)/g);

  // Step 3: 5thを追加
  tmp_ary = productArray(tmp_ary, fifth_ary);

  // Step 4: テンションを1つずつ追加（置き換えルールを適用）
  for (const tension of tension_ary) {
    tmp_ary = productArray(tmp_ary, [[null, ""], tension]);
  }

  // Step 5: omitを末尾に移動
  tmp_ary = moveToTail(tmp_ary, /(\(omit\d\))/g);

  // ChordMapに変換（複数のコード名を配列として保存）
  const chordMap: Record<string, string | string[]> = {};

  for (const [intervals, name] of tmp_ary) {
    if (!intervals) {
      continue;
    }
    // 配列かどうかチェック
    if (!Array.isArray(intervals)) {
      continue;
    }
    if (intervals.length === 0) {
      continue;
    }

    // omitを含むかチェック
    const hasOmit = name.includes('omit');

    // includeOmitがfalseの場合、omitを含むものはスキップ
    if (!includeOmit && hasOmit) {
      continue;
    }

    const key = intervals.join(",");

    // 暗黙的なテンションを削除（13には9,11が暗黙的、11には9が暗黙的）
    let simplifiedName = name;
    if (name.match(/13(?!\))/)) {
      // 13thコードの場合、(9)と(11)と(13)を削除
      simplifiedName = name.replace(/\(9\)/g, '').replace(/\(11\)/g, '').replace(/\(13\)/g, '');
    } else if (name.match(/11(?!\))/)) {
      // 11thコードの場合、(9)と(11)を削除
      simplifiedName = name.replace(/\(9\)/g, '').replace(/\(11\)/g, '');
    } else if (name.match(/9(?!\))/)) {
      // 9thコードの場合、(9)を削除
      simplifiedName = name.replace(/\(9\)/g, '');
    }

    // 既に存在する場合は配列として追加
    const existing = chordMap[key];
    if (existing) {
      // 簡略化版と元の名前が異なる場合、両方追加
      if (simplifiedName !== name) {
        const names = Array.isArray(existing) ? existing : [existing];
        chordMap[key] = [...names, name, simplifiedName];
      } else {
        chordMap[key] = Array.isArray(existing) ? [...existing, name] : [existing, name];
      }
    } else {
      // 簡略化版と元の名前が異なる場合、両方追加
      if (simplifiedName !== name) {
        chordMap[key] = [name, simplifiedName];
      } else {
        chordMap[key] = name;
      }
    }
  }

  return chordMap as ChordMap;
}

/**
 * インターバル配列を結合（重複チェック付き）
 *
 * @param e1 - 第1のインターバル（数値、配列、またはnull）
 * @param e2 - 第2のインターバル（数値、配列、またはnull）
 * @returns 結合されたインターバル配列と重複フラグ
 */
function combineIntervals(
  e1: number | number[] | null,
  e2: number | number[] | null
): { intervals: number[]; hasDuplicate: boolean } {
  const intervals: number[] = [];
  let hasDuplicate = false;

  [e1, e2].forEach((e) => {
    if (e == null) {
      // nullはスキップ
      return;
    }

    const values = Array.isArray(e) ? e : [e];
    for (const num of values) {
      if (intervals.indexOf(num) >= 0) {
        hasDuplicate = true;
      } else {
        intervals.push(num);
      }
    }
  });

  // インターバルをソート
  intervals.sort((a, b) => a - b);

  return { intervals, hasDuplicate };
}

/**
 * 置き換えルールを適用
 *
 * @param name - 元のコード名
 * @param intervals - インターバル配列
 * @param rules - 置き換えルール（オプション）
 * @returns 適用結果のChordEntry配列
 */
function applyReplacementRules(
  name: string,
  intervals: number[] | null,
  rules?: ReplacementRule[]
): ChordEntry[] {
  const results: ChordEntry[] = [[intervals, name]];

  if (!rules) {
    return results;
  }

  for (const [regex, replacement] of rules) {
    if (regex.test(name)) {
      const newName = name.replace(regex, replacement);
      if (newName !== name) {
        results.push([intervals, newName]);
      }
    }
  }

  return results;
}

/**
 * 2つの配列の直積を計算（リファクタリング版）
 *
 * ChordEntry配列の直積を計算し、重複チェックと置き換えルールを適用
 *
 * @param ary1 - 第1のChordEntry配列
 * @param ary2 - 第2のChordEntry配列
 * @returns 直積結果のChordEntry配列
 */
function productArray(ary1: ChordEntry[], ary2: ChordEntry[]): ChordEntry[] {
  const res: ChordEntry[] = [];

  for (const e1 of ary1) {
    for (const e2 of ary2) {
      // インターバル配列を結合
      const { intervals, hasDuplicate } = combineIntervals(e1[0], e2[0]);

      // 重複がある場合はスキップ
      if (hasDuplicate) {
        continue;
      }

      // コード名を結合
      const name = e1[1] + e2[1];

      // インターバルをnullまたは配列として格納
      const intervalsOrNull = intervals.length > 0 ? intervals : null;

      // 置き換えルールを適用して結果を追加
      const entries = applyReplacementRules(name, intervalsOrNull, e2[2]);
      res.push(...entries);
    }
  }

  return res;
}


/**
 * 重複チェック
 */
function hasDuplicates(arr: number[]): boolean {
  return new Set(arr).size !== arr.length;
}

/**
 * 正規表現にマッチする部分を末尾に移動
 */
function moveToTail(chord_ary: ChordEntry[], regex: RegExp): ChordEntry[] {
  return chord_ary.map(([intervals, name]) => {
    const matches = name.match(new RegExp(regex, 'g'));
    if (matches) {
      const newName = name.replace(new RegExp(regex, 'g'), "") + matches.join("");
      return [intervals, newName];
    }
    return [intervals, name];
  });
}
