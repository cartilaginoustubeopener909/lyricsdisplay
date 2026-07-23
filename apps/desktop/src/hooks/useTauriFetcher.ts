import {useMemo} from 'react';
import {invoke} from '@tauri-apps/api/core';
import {CurrentSongFetcher, Song} from '@lyricsdisplay/shared';

interface CurrentTrack {
    duration_ms: number;
    title: string;
    artist: string;
    album?: string | null;
    cover: string | null;
    position_ms: number;
    playing: boolean;
}

export const useTauriFetcher = (): CurrentSongFetcher => {
    return useMemo(() => ({
        fetchCurrentSong: async () => {
            try {
                const track = await invoke<CurrentTrack | null>("get_current_track");

                if (!track) return null;

                const song: Song = {
                    item: {
                        duration_ms: track.duration_ms,
                        name: track.title,
                        artists: [{name: track.artist}],
                        album: {name: track.album || "", cover: track.cover || ""}
                    },
                    progress_ms: track.position_ms,
                    is_playing: track.playing
                };

                return song;
            } catch (e) {
                console.error('Failed to fetch song from Tauri backend:', e);
                return null;
            }
        }
    }), []);
};
