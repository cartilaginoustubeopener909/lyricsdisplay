/**
 * @lyricsdisplay/ui-core
 *
 * Contains shared UI code between the app platforms.
 */

export type { RgbColor, LyricColors } from './colors';
export { parseColor, buildColors, rgba } from './colors';


export type { LineMetrics } from './metrics';
export { getLineMetrics } from './metrics';

export type { SyllableState, CharState, SyllableStatus, KaraokeChar } from './syllable';
export { getSyllableStatus, getKaraokeChars } from './syllable';
