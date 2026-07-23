import type { LyricSyllable } from '@lyricsdisplay/shared';

export type SyllableState = 'active' | 'past' | 'future';
export type CharState     = 'active' | 'past' | 'future';

export interface SyllableStatus {
    state:    SyllableState;
    isActive: boolean;
    isPast:   boolean;
}

export interface KaraokeChar {
    char:      string;
    state:     CharState;
    progress:  number;
}

export function getSyllableStatus(
    syllable: Pick<LyricSyllable, 'startTimeMs' | 'endTimeMs'>,
    currentProgressMs: number,
): SyllableStatus {
    const isActive = currentProgressMs >= syllable.startTimeMs && currentProgressMs < syllable.endTimeMs;
    const isPast   = currentProgressMs >= syllable.endTimeMs;
    const state: SyllableState = isActive ? 'active' : isPast ? 'past' : 'future';
    return { state, isActive, isPast };
}

export function getKaraokeChars(
    syllable: Pick<LyricSyllable, 'text' | 'startTimeMs' | 'endTimeMs'>,
    currentProgressMs: number,
): KaraokeChar[] {
    const chars        = syllable.text.split('');
    const duration     = Math.max(1, syllable.endTimeMs - syllable.startTimeMs);
    const charDuration = duration / Math.max(1, chars.length);

    return chars.map((char, i) => {
        const charStart   = syllable.startTimeMs + i * charDuration;
        const charEnd     = charStart + charDuration;
        const isPastChar  = currentProgressMs >= charEnd;
        const isActiveChar = currentProgressMs >= charStart && currentProgressMs < charEnd;
        const state: CharState = isPastChar ? 'past' : isActiveChar ? 'active' : 'future';
        const progress = isActiveChar
            ? (currentProgressMs - charStart) / charDuration
            : 0;
        return { char, state, progress };
    });
}
