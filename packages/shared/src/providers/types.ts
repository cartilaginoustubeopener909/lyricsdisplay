import {LyricLine} from '../types/song';

export interface LyricsProvider {
    readonly name: string;

    fetchLyrics(
        title: string,
        artist: string,
        album: string,
    ): Promise<LyricLine[]>;
}

function cleanTitle(title: string) {
    return title.replace(/ *\([^)]*\) */g, '').trim();
}

export class LyricsProviderManager {
    private readonly providers: LyricsProvider[];
    private readonly cache = new Map<string, LyricLine[]>();

    constructor(providers: LyricsProvider[]) {
        this.providers = providers;
    }

    async fetchLyrics(
        title: string,
        artist: string,
        album: string,
    ): Promise<LyricLine[]> {
        const key = `${title.toLowerCase()}__${artist.toLowerCase()}`;

        title = cleanTitle(title);

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        for (const provider of this.providers) {
            try {
                console.log(`[LyricsProvider] Trying ${provider.name} for "${title}" by "${artist}"`);
                const lyrics = await provider.fetchLyrics(title, artist, album);
                if (lyrics.length > 0) {
                    console.log(`[LyricsProvider] ${provider.name} returned ${lyrics.length} lines`);
                    this.setCache(key, lyrics);
                    return lyrics;
                }
                console.log(`[LyricsProvider] ${provider.name} returned nothing`);
            } catch (err) {
                console.warn(`[LyricsProvider] ${provider.name} threw:`, err);
            }
        }

        return [];
    }

    private setCache(key: string, lyrics: LyricLine[]): void {
        if (this.cache.size >= 10) {
            const firstKey = this.cache.keys().next().value;
            if (typeof firstKey === 'string') this.cache.delete(firstKey);
        }

        this.cache.set(key, lyrics);
    }
}
