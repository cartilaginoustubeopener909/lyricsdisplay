import { useMemo } from 'react';
import { usePlayer } from '@lyricsdisplay/shared';
import { SystemMediaManager } from '../modules/SystemMediaManager';

export const useMobilePlayer = () => {
  const fetcher = useMemo(
    () => ({
      fetchCurrentSong: async () => {
        try {
          const track = await SystemMediaManager.getCurrentTrack();
          if (!track) return null;

          return {
            item: {
              duration_ms: track.duration_ms,
              name: track.title || '',
              artists: [{ name: track.artist || '' }],
              album: { name: track.album || '', cover: track.cover || '' },
            },
            progress_ms: track.position_ms,
            is_playing: track.playing,
          };
        } catch (e) {
          console.error('Song fetch failed', e);
          return null;
        }
      },
    }),
    [],
  );

  return usePlayer({ fetcher });
};
