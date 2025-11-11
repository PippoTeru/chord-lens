/**
 * Chord Detection Module Exports
 *
 * Public API for chord detection and analysis.
 */

// Main chord detection function
export { detectChord, type ChordDetectionOptions } from './chordDetector';

// Chord name formatting utilities
export {
	formatChordName,
	formatChordList,
	extractChordParts,
	formatAccidentals,
	formatBrackets
} from './chordFormatter';

// Internal utilities (not exported - used only within chord directory)
// - chordGenerator (used by chordDetector)
// - chordMaps (used by chordDetector)
// - chordScoring (used by chordDetector)
