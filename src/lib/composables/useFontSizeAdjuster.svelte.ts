/**
 * Font Size Adjuster Composable
 *
 * フォントサイズをコンテナ幅に合わせて自動調整するコンポーザブル
 * $derived ベースの同期的な計算により、タイミング問題を完全に解消
 */

import { onMount } from 'svelte';
import { calculateFontSize } from '$lib/utils';
import { FONT_SIZE_RESIZE_DEBOUNCE } from '$lib/constants';

export interface UseFontSizeAdjusterOptions {
	/** 最大フォントサイズ（rem） */
	maxFontSize: number;
	/** フォントファミリー */
	fontFamily?: string;
	/** フォントウェイト */
	fontWeight?: number;
}

/**
 * フォントサイズ自動調整のコンポーザブル
 *
 * テキストコンテンツとコンテナ幅を渡すと、最適なフォントサイズを$derivedで計算
 * オフスクリーン測定により、レンダリング前にフォントサイズが確定
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const adjuster = useFontSizeAdjuster({
 *     maxFontSize: 12,
 *     fontFamily: '-apple-system, sans-serif',
 *     fontWeight: 800
 *   });
 *
 *   let containerElement: HTMLElement | undefined = $state();
 *   let primaryChordName = $state('CM7');
 *
 *   // フォントサイズは自動的に計算される
 *   let fontSize = adjuster.calculateForText(
 *     primaryChordName,
 *     containerElement?.clientWidth ?? 0
 *   );
 * </script>
 *
 * <div bind:this={containerElement}>
 *   <div style="font-size: {fontSize}rem;">
 *     {primaryChordName}
 *   </div>
 * </div>
 * ```
 */
export function useFontSizeAdjuster(options: UseFontSizeAdjusterOptions) {
	const {
		maxFontSize,
		fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		fontWeight = 800
	} = options;

	// リサイズ時の再計算トリガー用
	let resizeTrigger = $state(0);

	/**
	 * テキストコンテンツに基づいてフォントサイズを計算
	 *
	 * @param text - テキストコンテンツ
	 * @param containerWidth - コンテナ幅 (px)
	 * @param html - HTMLコンテンツ（ディグリー表記等）
	 * @returns 最適なフォントサイズ (rem)
	 */
	function calculateForText(text: string, containerWidth: number, html?: string): number {
		// resizeTriggerを参照して、リサイズ時に再計算されるようにする
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		resizeTrigger;

		if (!text || containerWidth === 0) {
			return maxFontSize;
		}

		return calculateFontSize({
			text,
			html,
			containerWidth,
			maxFontSize,
			fontFamily,
			fontWeight
		});
	}

	// ウィンドウリサイズ時に再計算をトリガー
	onMount(() => {
		if (typeof window === 'undefined') return;

		let resizeTimeout: number;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = window.setTimeout(() => {
				// resizeTriggerを変更して再計算をトリガー
				resizeTrigger++;
			}, FONT_SIZE_RESIZE_DEBOUNCE);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(resizeTimeout);
		};
	});

	return {
		calculateForText
	};
}
