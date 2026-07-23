import {useEffect} from 'react';
import {listen} from '@tauri-apps/api/event';
import {ClientSettings, useSettingsStore} from '@lyricsdisplay/shared';

export const useSettingsSync = () => {
    const updateCacheOnly = useSettingsStore(state => state.updateCacheOnly);

    useEffect(() => {
        let unlistenSettings: (() => void) | undefined;

        const handleUpdateSettings = (newSettings: ClientSettings) => {
            updateCacheOnly(newSettings);
        };

        listen<ClientSettings>('update-settings', (event) => {
            handleUpdateSettings(event.payload);
        }).then(cb => unlistenSettings = cb);

        return () => {
            if (unlistenSettings) unlistenSettings();
        };
    }, [updateCacheOnly]);
};
