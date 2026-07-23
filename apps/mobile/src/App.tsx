import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  registerTimerController,
  useSettingsStore,
} from '@lyricsdisplay/shared';
import { LyricsScreen } from './screens/LyricsScreen';
import { initMobileServices } from './init';
// @ts-ignore
import { BackgroundTimer } from 'react-native-background-timer';

registerTimerController({
  setInterval: (callback, ms) => BackgroundTimer.setInterval(callback, ms),
  clearInterval: id => BackgroundTimer.clearInterval(id),
});

initMobileServices();

export default function App() {
  if (!useSettingsStore.persist.hasHydrated()) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <View className="flex-1 bg-[#060608]">
          <LyricsScreen />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
