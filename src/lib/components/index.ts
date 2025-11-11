/**
 * Components Barrel Export
 *
 * Public API for UI components used throughout the application.
 *
 * This barrel export re-exports functionality from specialized subdirectories:
 * - display/ - Chord and note display components
 * - keyboard/ - Virtual piano keyboard components
 * - settings/ - Settings and configuration components
 * - common/ - Shared utility components
 */

// Display components
export { ChordDisplay, NoteDisplay } from './display';

// Keyboard components
export { VirtualKeyboard, WhiteKey, BlackKey } from './keyboard';

// Settings components
export {
	Settings,
	SettingsChordNotation,
	SettingsDisplay,
	SettingsMIDI
} from './settings';

// Common components
export { StatusBar, Notification, CustomDropdown } from './common';
