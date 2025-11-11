/**
 * Utilities Barrel Export
 *
 * Public API for utility functions used throughout the application.
 *
 * This barrel export re-exports functionality from specialized subdirectories:
 * - chord/ - Chord detection and analysis
 * - notation/ - Music notation conversion
 * - formatting/ - Text and UI formatting
 * - midi/ - MIDI utilities
 * - keyboard/ - Piano keyboard generation
 */

// Chord detection and formatting
export {
	detectChord,
	type ChordDetectionOptions,
	formatChordName,
	formatChordList,
	extractChordParts,
	formatAccidentals,
	formatBrackets
} from './chord';

// Degree notation conversion
export { chordToDegree } from './notation';

// MIDI utilities
export { midiToNoteName, midiToNoteNameSharp, midiToNoteNameFlat } from './midi';

// Formatting utilities
export {
	calculateFontSize,
	type FontSizeCalculatorOptions,
	formatActiveNoteNames,
	formatNoteNamesAsText,
	formatNoteNamesAsHTML,
	formatNoteList
} from './formatting';

// Piano keyboard utilities
export {
	generateWhiteKeys,
	generateBlackKeys,
	getWhiteKeyIndex,
	getBlackKeyX,
	createRoundedBottomPath,
	DIMENSIONS,
	KEYBOARD_RANGE,
	BLACK_KEY_OFFSETS
} from './keyboard';
