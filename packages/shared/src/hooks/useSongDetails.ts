import { useMemo } from 'react';
import {Artist, Song} from "@shared/types/song";

export interface SongDetails {
    isAvailable: boolean;
    title: string;
    artists: string;
    coverUrl: string | null;
}

export const useSongDetails = (song: Song | null): SongDetails => {
    return useMemo(() => {
        if (!song || !song.item) {
            return {
                isAvailable: false,
                title: '',
                artists: '',
                coverUrl: null,
            };
        }

        const item = song.item;
        const title = item.name || '';
        const artists = item.artists ? item.artists.map((a: Artist) => a.name).join(', ') : '';
        const coverBase64 = item.album && item.album.cover ? item.album.cover : null;

        let coverUrl: string | null = null;
        if (coverBase64) {
            if (coverBase64.startsWith('http') || coverBase64.startsWith('data:')) {
                coverUrl = coverBase64;
            } else {
                coverUrl = `data:image/jpeg;base64,${coverBase64}`;
            }
        }

        return {
            isAvailable: true,
            title,
            artists,
            coverUrl,
        };
    }, [song]);
};
