import { translations, availableLanguages } from '../i18n';

export class I18nService {
    private static instance: I18nService;

    private constructor() {
    }

    static getInstance(): I18nService {
        if (!I18nService.instance) {
            I18nService.instance = new I18nService();
        }
        return I18nService.instance;
    }

    translate(key: string, language: string): string {
        const messages = translations[language] || translations['en'];
        return messages?.[key] || key;
    }

    getAvailableLanguages(): string[] {
        return availableLanguages;
    }
}
