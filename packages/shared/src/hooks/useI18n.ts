import { useCallback, useEffect, useMemo, useRef } from 'react';
import { I18nService } from '../service/i18nService';
import { useSettingsStore } from '../store/settingStore';

export const useI18n = (settingsStore?: typeof useSettingsStore) => {
    const store = settingsStore ?? useSettingsStore;
    const i18nService = useMemo(() => I18nService.getInstance(), []);
    const language = store((state) => state.settings.language);

    const t = useCallback((key: string): string => {
        return i18nService.translate(key, language);
    }, [i18nService, language]);

    const availableLanguages = useMemo(() => i18nService.getAvailableLanguages(), [i18nService]);

    return {
        t,
        availableLanguages,
    };
};
