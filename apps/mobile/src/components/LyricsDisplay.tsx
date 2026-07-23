import React, { useMemo } from 'react';

import Animated, { Easing, LinearTransition } from 'react-native-reanimated';
import { LyricLine } from '@lyricsdisplay/shared';
import { getLineMetrics } from '@lyricsdisplay/ui-core';
import { LyricLineRow } from './LyricLineRow';

const MAX_OFFSET = 15;

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  oppositeAlign: boolean;
  centerIndex: number;
  startIndex: number;
  fontSize: number;
  fontName: string;
  color: string;
  isOverlay?: boolean;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = React.memo(
  ({
    lyrics,
    oppositeAlign,
    centerIndex,
    startIndex,
    fontSize,
    fontName,
    color,
    isOverlay,
  }) => {
    const lyricElements = useMemo(() => {
      return lyrics.map((line, localIndex) => {
        const globalIndex = startIndex + localIndex;
        const { opacity, scale, isCenter, isPast } = getLineMetrics(
          globalIndex,
          centerIndex,
        );

        const offsetX = oppositeAlign
          ? line.oppositeAligned
            ? -MAX_OFFSET
            : MAX_OFFSET
          : 0;

        return (
          <LyricLineRow
            key={line.startTimeMs || globalIndex}
            line={line}
            isCenter={isCenter}
            isPast={isPast}
            opacity={opacity}
            scale={scale}
            fontSize={fontSize}
            fontName={fontName}
            offsetX={offsetX}
            color={color}
          />
        );
      });
    }, [
      lyrics,
      startIndex,
      centerIndex,
      oppositeAlign,
      fontSize,
      fontName,
      color,
    ]);

    return (
      <Animated.View
        layout={LinearTransition.duration(400).easing(
          Easing.inOut(Easing.ease),
        )}
        className="items-center justify-center w-full max-w-full"
        style={isOverlay ? { paddingVertical: 0 } : undefined}
      >
        {lyricElements}
      </Animated.View>
    );
  },
);
