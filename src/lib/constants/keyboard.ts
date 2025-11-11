/**
 * Keyboard Constants
 *
 * VirtualKeyboard（仮想ピアノ鍵盤）に関する定数
 */

// ===========================
// SVG座標系
// ===========================

/** SVG ViewBoxの幅 (白鍵52個 × 23.5) */
export const KEYBOARD_VIEWBOX_WIDTH = 1222;

/** SVG ViewBoxの高さ */
export const KEYBOARD_VIEWBOX_HEIGHT = 150;

// ===========================
// 鍵盤寸法
// ===========================

/** 白鍵の幅 */
export const WHITE_KEY_WIDTH = 23.5;

/** 白鍵の高さ */
export const WHITE_KEY_HEIGHT = 150;

/** 黒鍵の幅 */
export const BLACK_KEY_WIDTH = 14;

/** 黒鍵の高さ */
export const BLACK_KEY_HEIGHT = 100;

/** 鍵盤下部の角丸半径比率（鍵盤幅に対する比率） */
export const KEY_CORNER_RADIUS_RATIO = 0.16;

// ===========================
// ラベル表示
// ===========================

/** ラベルのY座標オフセット比率（白鍵高さに対する比率） */
export const LABEL_Y_OFFSET_RATIO = 0.05;

/** ラベルのフォントサイズ比率（白鍵幅に対する比率） */
export const LABEL_FONT_SIZE_RATIO = 0.3;

// ===========================
// 鍵盤範囲
// ===========================

/** 88鍵盤の最低MIDI番号 (A0) */
export const MIN_MIDI_NUMBER = 21;

/** 88鍵盤の最高MIDI番号 (C8) */
export const MAX_MIDI_NUMBER = 108;

/** 白鍵の総数 */
export const WHITE_KEY_COUNT = 52;

/** 黒鍵の総数 */
export const BLACK_KEY_COUNT = 36;
