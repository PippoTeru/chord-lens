/**
 * Types Barrel Export
 *
 * Public API for TypeScript type definitions.
 */

// Chord Types
export type {
	ChordMap,
	Num2ChordMap,
	Chord2NumMap,
	ChordCandidate,
	ChordCandidateGroup,
	ChordDetectionResult,
	Interval,
	PitchClass,
	ChordQuality,
	ChordStructure
} from './chord.types';

// Degree Notation Types
export { TONIC_NOTES, type TonicNote, type KeyMode } from './degree';

// MIDI Types
export {
	MIDIControlChange,
	type MIDIEventType,
	type MIDINoteOnEvent,
	type MIDINoteOffEvent,
	type MIDIControlChangeEvent,
	type MIDIPitchBendEvent,
	type MIDIProgramChangeEvent,
	type MIDIEvent,
	type MIDIEventHandler,
	type MIDIInputInfo,
	type MIDIState
} from './midi.types';

// Piano Keyboard Types
export type {
	WhiteNoteName,
	BlackNoteName,
	NoteName,
	WhitePianoKey,
	BlackPianoKey,
	PianoKey,
	KeyboardRange,
	KeyboardDimensions
} from './piano.types';
