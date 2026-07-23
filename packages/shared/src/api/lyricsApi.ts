import {LyricLine} from '../types/song';
import {LyricsProviderManager, PaxsenixProvider} from '../providers';

const defaultProviders = [
    new PaxsenixProvider()
];

export class LyricsApiService {
    private static instance: LyricsApiService;
    private readonly manager = new LyricsProviderManager(defaultProviders);

    private constructor() {
    }

    static getInstance(): LyricsApiService {
        if (!LyricsApiService.instance) {
            LyricsApiService.instance = new LyricsApiService();
        }
        return LyricsApiService.instance;
    }

    async fetchLyrics(title: string, author: string, album: string): Promise<LyricLine[]> {
        return this.manager.fetchLyrics(title, author, album);
    }
}
