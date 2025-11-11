/**
 * Font Size Adjuster Utility
 *
 * テキスト要素のフォントサイズを自動調整してコンテナ幅に収める
 * オフスクリーン測定方式による同期的な計算
 */

import { FONT_SIZE_MARGIN_RATIO, FONT_SIZE_TOLERANCE } from '$lib/constants';

export interface FontSizeCalculatorOptions {
	/** テキストコンテンツ */
	text: string;
	/** HTMLコンテンツ（ディグリー表記等のHTML） */
	html?: string;
	/** コンテナ幅 (px) */
	containerWidth: number;
	/** 最大フォントサイズ (rem) */
	maxFontSize: number;
	/** フォントファミリー */
	fontFamily: string;
	/** フォントウェイト */
	fontWeight: number;
	/** 幅のマージン比率 (デフォルト: 0.98 = 2%マージン) */
	marginRatio?: number;
	/** 許容オーバー幅 (px) - この値以下のオーバーは無視 (デフォルト: 2px) */
	tolerance?: number;
}

/**
 * オフスクリーン要素でテキスト幅を測定し、最適なフォントサイズを計算
 * DOM更新を待たずに同期的に計算できる
 *
 * @param options - 計算オプション
 * @returns 調整後のフォントサイズ (rem)
 */
export function calculateFontSize(options: FontSizeCalculatorOptions): number {
	const {
		text,
		html,
		containerWidth,
		maxFontSize,
		fontFamily,
		fontWeight,
		marginRatio = FONT_SIZE_MARGIN_RATIO,
		tolerance = FONT_SIZE_TOLERANCE
	} = options;

	// SSR時は最大サイズを返す
	if (typeof window === 'undefined') {
		return maxFontSize;
	}

	// コンテナ幅が0の場合は最大サイズを返す
	if (containerWidth === 0) {
		console.warn('[FontSizeCalculator] Container width is 0, using maxFontSize');
		return maxFontSize;
	}

	// 測定用の非表示要素を作成
	const measureElement = document.createElement('div');
	measureElement.style.position = 'absolute';
	measureElement.style.visibility = 'hidden';
	measureElement.style.pointerEvents = 'none';
	measureElement.style.whiteSpace = 'nowrap';
	measureElement.style.fontFamily = fontFamily;
	measureElement.style.fontWeight = fontWeight.toString();
	measureElement.style.fontSize = `${maxFontSize}rem`;

	// テキストまたはHTMLをセット
	if (html) {
		measureElement.innerHTML = html;
	} else {
		measureElement.textContent = text;
	}

	// DOMに追加して測定
	document.body.appendChild(measureElement);
	const actualWidth = measureElement.getBoundingClientRect().width;
	document.body.removeChild(measureElement);

	const overflow = actualWidth - containerWidth;

	console.log('[FontSizeCalculator] 測定結果:', {
		text,
		containerWidth,
		actualWidth,
		overflow,
		maxFontSize,
		needsAdjustment: overflow > tolerance
	});

	// 許容範囲を超えてオーバーしている場合のみ調整
	if (overflow > tolerance) {
		const ratio = containerWidth / actualWidth;
		const adjustedSize = maxFontSize * ratio * marginRatio;
		console.log('[FontSizeCalculator] 調整:', {
			overflow,
			ratio,
			adjustedSize: adjustedSize.toFixed(3)
		});
		return adjustedSize;
	}

	return maxFontSize;
}
