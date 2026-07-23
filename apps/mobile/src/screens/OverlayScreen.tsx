import React, { useEffect, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { useSettingsStore, useVisibleLyrics } from '@lyricsdisplay/shared';
import { LyricsDisplay } from '../components/LyricsDisplay';
import { OverlayManager } from 'react-native-android-overlay';
import { useMobilePlayer } from '../hooks/useMobilePlayer';

export const OverlayScreen = () => {
  const { lyrics, centerIndex } = useMobilePlayer();

  const maxLines = useSettingsStore(state => state.settings.maxLines) || 3;
  const fontSize = useSettingsStore(state => state.settings.fontSize) || 18;
  const fontName = useSettingsStore(state => state.settings.fontName);
  const color = useSettingsStore(state => state.settings.color);

  useEffect(() => {
    const widthDp = Dimensions.get('window').width;
    const baseHeight = maxLines * (fontSize * 1.8) + 20;

    OverlayManager.resizeOverlay(widthDp, baseHeight);
  }, [maxLines, fontSize]);

  const { visibleLyrics, startIndex } = useVisibleLyrics(lyrics, centerIndex, maxLines);

  const hasOppositeAligned = useMemo(
      () => lyrics.some(line => line.oppositeAligned),
      [lyrics],
  );

  return (
      <View className="w-full justify-center items-center" pointerEvents="box-none">
        <LyricsDisplay
            lyrics={visibleLyrics}
            oppositeAlign={hasOppositeAligned}
            centerIndex={centerIndex}
            startIndex={startIndex}
            fontSize={fontSize}
            fontName={fontName}
            color={color}
            isOverlay={true}
        />
      </View>
  );
};