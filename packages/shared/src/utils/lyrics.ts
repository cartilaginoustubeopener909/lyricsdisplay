import { LyricSyllable, LyricLine } from '../types/song';

export function buildLineText(syllables: LyricSyllable[]): string {
    if (!syllables || syllables.length === 0) return '';
    
    return syllables.reduce((acc, syl, i, arr) =>
        i === 0 ? syl.text : acc + (arr[i - 1].partOfWord ? '' : ' ') + syl.text
    , '');
}

export function lineText(line: LyricLine): string {
    if (line.text) return line.text;
    if (!line.syllables?.length) return '';
    return buildLineText(line.syllables);
}

export function needsSpaceBefore(syllableIndex: number, previousPartOfWord: boolean): boolean {
    return syllableIndex > 0 && !previousPartOfWord;
}
