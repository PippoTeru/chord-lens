/**
 * UI Constants
 *
 * UI要素のサイズ、アニメーション、フォントサイズなどの定数
 */

// ===========================
// フォントサイズ関連
// ===========================

/** コード名の最大フォントサイズ (rem) */
export const MAX_CHORD_FONT_SIZE = 12;

/** 代替コード候補の最大フォントサイズ (rem) */
export const MAX_ALTERNATIVES_FONT_SIZE = 3;

/** 音名表示の最大フォントサイズ (rem) */
export const MAX_NOTE_FONT_SIZE = 2.5;

// ===========================
// フォントサイズ調整関連
// ===========================

/** フォントサイズ調整時の幅のマージン比率 (0.98 = 2%マージン) */
export const FONT_SIZE_MARGIN_RATIO = 0.98;

/** フォントサイズ調整の許容オーバー幅 (px) */
export const FONT_SIZE_TOLERANCE = 2;

/** ウィンドウリサイズ時のフォントサイズ再計算デバウンス時間 (ms) */
export const FONT_SIZE_RESIZE_DEBOUNCE = 150;

// ===========================
// レイアウト関連
// ===========================

/** 代替コード候補の上マージン (rem) */
export const ALTERNATIVES_MARGIN_TOP = 8;

// ===========================
// アニメーション・トランジション
// ===========================

/** 色変更のトランジション時間 (ms) */
export const COLOR_TRANSITION_DURATION = 300;

/** 不透明度変更のトランジション時間 (ms) */
export const OPACITY_TRANSITION_DURATION = 100;

/** 設定パネルのフォーカス遅延時間 (ms) */
export const SETTINGS_FOCUS_DELAY = 100;
