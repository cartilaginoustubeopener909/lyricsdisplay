import { create } from 'zustand';
import { LyricLine, Song } from '../types/song';

interface PlayerStore {
    song: Song | null;
    lyrics: LyricLine[];
    centerIndex: number;
    currentProgressMs: number;
    setSong: (song: Song | null) => void;
    setLyrics: (lyrics: LyricLine[]) => void;
    setCenterIndex: (index: number) => void;
    setCurrentProgressMs: (ms: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    song: null,
    lyrics: [],
    centerIndex: 0,
    currentProgressMs: 0,
    setSong: (song) => set({ song }),
    setLyrics: (lyrics) => set({ lyrics }),
    setCenterIndex: (centerIndex) => set({ centerIndex }),
    setCurrentProgressMs: (currentProgressMs) => set({ currentProgressMs }),
}));
