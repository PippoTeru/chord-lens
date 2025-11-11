/**
 * Formatting Utilities Module Exports
 *
 * Public API for text and UI formatting utilities.
 */

// Font size calculation
export { calculateFontSize, type FontSizeCalculatorOptions } from './fontSizeAdjuster';

// Note list formatting
export {
	formatActiveNoteNames,
	formatNoteNamesAsText,
	formatNoteNamesAsHTML,
	formatNoteList
} from './noteListFormatter';
