import React, { useMemo } from 'react';
import { Text } from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  LyricLine,
  LyricSyllable,
  usePlayerStore,
  needsSpaceBefore,
  lineText,
} from '@lyricsdisplay/shared';
import {
  buildColors,
  getKaraokeChars,
  getSyllableStatus,
  KaraokeChar,
  LyricColors,
} from '@lyricsdisplay/ui-core';

interface LyricLineRowProps {
  line: LyricLine;
  isCenter: boolean;
  isPast: boolean;
  opacity: number;
  scale: number;
  fontSize: number;
  fontName: string;
  offsetX: number;
  color: string;
}

const Char = React.memo(
  ({
    char,
    fontName,
    fontSize,
    colors,
  }: {
    char: KaraokeChar;
    fontName: string;
    fontSize: number;
    colors: LyricColors;
  }) => {
    const { state } = char;
    const isActive = state === 'active';
    const isPast = state === 'past';

    return (
      <Text
        className="font-bold shrink"
        style={{
          fontFamily: fontName,
          fontSize,
          color: state === 'future' ? colors.inactive : colors.active,
          textShadowColor: isActive
            ? colors.glow
            : isPast
            ? 'rgba(0,0,0,0.4)'
            : 'rgba(0,0,0,0.3)',
          textShadowRadius: isActive ? 12 : isPast ? 4 : 2,
          textShadowOffset: !isActive
            ? { width: 0, height: 1 }
            : { width: 0, height: 0 },
        }}
      >
        {char.char}
      </Text>
    );
  },
);

const SyllableRenderer = React.memo(
  ({
    syllable,
    currentProgressMs,
    fontName,
    fontSize,
    colors,
  }: {
    syllable: LyricSyllable;
    currentProgressMs: number;
    fontName: string;
    fontSize: number;
    colors: LyricColors;
  }) => {
    const { isActive, isPast } = getSyllableStatus(syllable, currentProgressMs);

    if (isActive) {
      const chars = getKaraokeChars(syllable, currentProgressMs);
      return (
        <Text>
          {chars.map((c, i) => (
            <Char
              key={i}
              char={c}
              fontName={fontName}
              fontSize={fontSize}
              colors={colors}
            />
          ))}
        </Text>
      );
    }

    return (
      <Text
        className="font-bold"
        style={{
          fontFamily: fontName,
          fontSize,
          color: isPast ? colors.past : colors.inactive,
          textShadowColor: isPast ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)',
          textShadowRadius: isPast ? 4 : 2,
          textShadowOffset: { width: 0, height: 1 },
        }}
      >
        {syllable.text}
      </Text>
    );
  },
);

export const LyricLineRow: React.FC<LyricLineRowProps> = React.memo(
  ({ line, isCenter, isPast, opacity, fontSize, fontName, offsetX, color }) => {
    const currentProgressMs = usePlayerStore(s =>
      isCenter ? s.currentProgressMs : 0,
    );
    const colors = useMemo(() => buildColors(color), [color]);

    const animatedStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(opacity, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        transform: [
          {
            translateX: withTiming(offsetX, {
              duration: 400,
              easing: Easing.inOut(Easing.ease),
            }),
          },
        ],
      }),
      [opacity, offsetX],
    );

    const renderLine = () => {
      if (!isCenter) {
        return (
          <Text
            className="text-center font-normal"
            style={{
              color: isPast ? colors.past : colors.inactive,
              fontSize,
              fontFamily: fontName,
              textShadowRadius: 3,
              textShadowOffset: { width: 0, height: 1 },
            }}
          >
            {lineText(line)}
          </Text>
        );
      }

      if (line.syllables?.length) {
        return (
          <Text className="text-center">
            {line.syllables.map((syl, idx) => (
              <React.Fragment key={idx}>
                {needsSpaceBefore(idx, line.syllables[idx - 1]?.partOfWord ?? false) && (
                  <Text style={{ fontFamily: fontName, fontSize }}> </Text>
                )}
                <SyllableRenderer
                  syllable={syl}
                  currentProgressMs={currentProgressMs}
                  fontName={fontName}
                  fontSize={fontSize}
                  colors={colors}
                />
              </React.Fragment>
            ))}
          </Text>
        );
      }

      return (
        <Text
          className="text-center font-bold"
          style={{
            color: colors.active,
            fontSize,
            fontFamily: fontName,
            textShadowColor: colors.glow,
            textShadowRadius: 7,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          {line.text}
        </Text>
      );
    };

    return (
      <Animated.View
        layout={LinearTransition.duration(400).easing(
          Easing.inOut(Easing.ease),
        )}
        className="w-full px-8 items-center justify-center"
        style={animatedStyle}
      >
        {renderLine()}
      </Animated.View>
    );
  },
);
