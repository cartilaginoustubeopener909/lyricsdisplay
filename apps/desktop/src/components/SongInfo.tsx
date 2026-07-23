import React from 'react';
import {Song, useSongDetails} from "@lyricsdisplay/shared";

interface SongInfoProps {
    song: Song | null;
    showTitle: boolean;
    showArtists: boolean;
    showCover: boolean;
    fontSize: number;
}

export const SongInfo: React.FC<SongInfoProps> = React.memo(
    ({song, showTitle, showArtists, showCover, fontSize}) => {
        const {isAvailable, title, artists, coverUrl} = useSongDetails(song);

        if (!isAvailable) return null;

        return (
            <>
                {showCover && coverUrl && (
                    <img
                        src={coverUrl}
                        data-tauri-drag-region
                        className="rounded-xl mb-2 h-32 w-32 object-cover mx-auto"
                        style={{width: `${fontSize * 5}px`, height: `${fontSize * 5}px`}}
                        alt=""
                        loading="lazy"
                    />
                )}

                {(showTitle || showArtists) && (
                    <div>
                        {showTitle && title && (
                            <div data-tauri-drag-region className="font-bold"
                                 style={{fontSize: `${fontSize + 4}px`}}>{title}</div>
                        )}
                        {showArtists && artists && (
                            <div data-tauri-drag-region className="font-normal"
                                 style={{fontSize: `${fontSize - 2}px`}}>{artists}</div>
                        )}
                    </div>
                )}
            </>
        );
    }
);