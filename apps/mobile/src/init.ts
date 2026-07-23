import { useSettingsStore } from '@lyricsdisplay/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export function initMobileServices() {
  const storage = createJSONStorage(() => AsyncStorage);

  useSettingsStore.persist.setOptions({
    storage: storage as any,
  });

  useSettingsStore.persist.rehydrate();
}
