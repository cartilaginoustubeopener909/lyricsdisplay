export interface Album {
    name: string,
    cover: string
}

export interface Artist {
    name: string;
}

export interface SongItem {
    duration_ms: number;
    name: string;
    artists: Artist[];
    album: Album;
}

export interface Song {
    item: SongItem;
    progress_ms: number;
    is_playing: boolean;
}

export interface LyricSyllable {
    text: string;
    startTimeMs: number;
    endTimeMs: number;
    partOfWord: boolean;
}

export interface LyricLine {
    startTimeMs: number;
    endTimeMs?: number;
    text?: string;
    oppositeAligned?: boolean;
    syllables?: LyricSyllable[];
}

export interface RawLineLyric {
    startTime?: number;
    text?: string;
}

export interface RawSyllableLyric {
    text?: string;
    startTimeMs?: number;
    endTimeMs?: number;
    partOfWord?: boolean;
}

export interface RawSyllableSection {
    syllables?: RawSyllableLyric[];
    startTime?: number;
    endTime?: number;
    oppositeAligned?: boolean;
}

export interface TranslationEntry {
    identifier: string;
    translation: string;
}
