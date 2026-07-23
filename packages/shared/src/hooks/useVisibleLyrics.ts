import { useMemo } from 'react';
import {LyricLine} from "@shared/types/song";

export interface VisibleLyricsResult {
    visibleLyrics: LyricLine[];
    startIndex: number;
}

export const useVisibleLyrics = (
    lyrics: LyricLine[],
    centerIndex: number,
    maxVisibleCount: number
): VisibleLyricsResult => {
    return useMemo(() => {
        const totalLines = lyrics.length;
        if (totalLines === 0) {
            return { visibleLyrics: [], startIndex: 0 };
        }

        const half = Math.floor((maxVisibleCount - 1) / 2);
        let start = Math.max(0, centerIndex - half);

        if (start + maxVisibleCount > totalLines) {
            start = Math.max(totalLines - maxVisibleCount, 0);
        }

        return {
            visibleLyrics: lyrics.slice(start, start + maxVisibleCount),
            startIndex: start,
        };
    }, [lyrics, centerIndex, maxVisibleCount]);
};
