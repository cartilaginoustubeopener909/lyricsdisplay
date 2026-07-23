import { NativeModules } from 'react-native';

const { SystemMediaModule } = NativeModules;

export interface SystemTrack {
  title: string;
  artist: string;
  album: string;
  duration_ms: number;
  position_ms: number;
  playing: boolean;
  cover: string | null;
}

export const SystemMediaManager = {
  play: () => {
    try {
      SystemMediaModule.play();
    } catch (e) {}
  },
  pause: () => {
    try {
      SystemMediaModule.pause();
    } catch (e) {}
  },
  skipToNext: () => {
    try {
      SystemMediaModule.skipToNext();
    } catch (e) {}
  },
  skipToPrevious: () => {
    try {
      SystemMediaModule.skipToPrevious();
    } catch (e) {}
  },

  getCurrentTrack: async (): Promise<SystemTrack | null> => {
    try {
      return await SystemMediaModule.getCurrentTrack();
    } catch (e) {
      return null;
    }
  },

  hasMediaAccess: async (): Promise<boolean> => {
    try {
      return await SystemMediaModule.hasNotificationListenerAccess();
    } catch (e) {
      return false;
    }
  },

  requestMediaAccess: () => {
    try {
      SystemMediaModule.requestNotificationAccess();
    } catch (e) {}
  },
};
