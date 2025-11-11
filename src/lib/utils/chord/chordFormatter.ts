/**
 * Chord Name Formatting Utilities
 *
 * コード名を表示用にHTML形式でフォーマットする関数群。
 * - ♭/♯記号のスーパースクリプト化
 * - 括弧の上付き文字化
 * - ルート音とクオリティの分離と装飾
 */

/**
 * コード名のルート音とクオリティを分離
 *
 * ディグリー表記（♯I, ♭VII等）と通常のコード名（C, D♭等）の両方に対応。
 *
 * @param chordName - コード名（例: "CM7", "♭IIm7", "C♯dim7"）
 * @returns ルート音とクオリティの分離結果
 *
 * @example
 * extractChordParts("CM7")      // { root: "C", quality: "M7" }
 * extractChordParts("♭IIm7")    // { root: "♭II", quality: "m7" }
 * extractChordParts("C♯dim7")   // { root: "C♯", quality: "dim7" }
 */
export function extractChordParts(chordName: string): { root: string; quality: string } {
	if (!chordName) {
		return { root: '', quality: '' };
	}

	// ディグリー表記の場合：♯/♭ + ローマ数字（I-VII）
	// 通常のコード名の場合：A-G + オプションの♯/♭
	const match = chordName.match(/^([♯♭]?[IVX]+|[A-G][♯♭]?)/);

	if (!match) {
		return { root: chordName, quality: '' };
	}

	const root = match[1];
	const quality = chordName.substring(root.length);

	return { root, quality };
}

/**
 * ♭と♯を HTMLスーパースクリプト要素に変換
 *
 * 音楽記号をスペーシング調整のため span 要素で囲む。
 *
 * @param text - 変換対象テキスト
 * @returns HTML変換後のテキスト
 *
 * @example
 * formatAccidentals("C♭")  // 'C<sup class="flat">♭</sup>'
 * formatAccidentals("D♯")  // 'D<sup class="sharp">♯</sup>'
 */
export function formatAccidentals(text: string): string {
	return text
		.replace(/♭/g, '<sup class="flat">♭</sup>')
		.replace(/♯/g, '<sup class="sharp">♯</sup>');
}

/**
 * 括弧を上付き文字に変換
 *
 * テンションコードの括弧表記（例: (9)(13)）をスーパースクリプト化。
 *
 * @param text - 変換対象テキスト
 * @returns HTML変換後のテキスト
 *
 * @example
 * formatBrackets("m7(9)")      // 'm7<sup>(9)</sup>'
 * formatBrackets("M7(9)(13)")  // 'M7<sup>(9)</sup><sup>(13)</sup>'
 */
export function formatBrackets(text: string): string {
	return text.replace(/\([^)]+\)/g, (match) => `<sup>${match}</sup>`);
}

/**
 * コード名を表示用にフォーマット
 *
 * ルート音とクオリティを分離し、以下の装飾を適用：
 * - ♭/♯をスーパースクリプトに変換
 * - 括弧を上付き文字に変換
 * - クオリティ部分を75%のフォントサイズに縮小
 *
 * ディグリー表記（I, ♭II等）と通常のコード名（C, D♭等）の両方に対応。
 *
 * @param chordName - コード名（例: "CM7", "♭IIm7", "C♯dim7(9)"）
 * @returns HTML形式のフォーマット済みコード名
 *
 * @example
 * formatChordName("CM7")
 * // => 'C<span class="quality">M7</span>'
 *
 * formatChordName("♭IIm7")
 * // => '<sup class="flat">♭</sup>II<span class="quality">m7</span>'
 *
 * formatChordName("C♯m7(9)")
 * // => 'C<sup class="sharp">♯</sup><span class="quality">m7<sup>(9)</sup></span>'
 */
export function formatChordName(chordName: string): string {
	if (!chordName) return '';

	const { root, quality } = extractChordParts(chordName);

	// ルート音の♭と♯を上付き文字でフォーマット
	const formattedRoot = formatAccidentals(root);

	// クオリティ部分の♭と♯と括弧をフォーマット
	const formattedQuality = formatBrackets(formatAccidentals(quality));

	// クオリティ部分を75%のフォントサイズで囲む
	return formattedRoot + (formattedQuality ? `<span class="quality">${formattedQuality}</span>` : '');
}

/**
 * カンマ区切りの複数コード名をフォーマット
 *
 * コード候補のリストをフォーマットし、カンマ区切りで結合。
 *
 * @param chordNames - カンマ区切りのコード名（例: "CM7, Cmaj7, C△7"）
 * @returns HTML形式のフォーマット済みコード名リスト
 *
 * @example
 * formatChordList("CM7, Cmaj7")
 * // => 'C<span class="quality">M7</span>, C<span class="quality">maj7</span>'
 */
export function formatChordList(chordNames: string): string {
	if (!chordNames) return '';

	return chordNames
		.split(', ')
		.map(chord => formatChordName(chord.trim()))
		.join(', ');
}
