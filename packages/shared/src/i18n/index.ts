import en from './locales/en.json';
import it from './locales/it.json';

export const translations: Record<string, Record<string, string>> = {
    en,
    it
};

export const availableLanguages = Object.keys(translations);
