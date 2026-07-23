import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {DEFAULT_SETTINGS} from "../constants/config";
import {ClientSettings} from "../types/settings";

export interface SettingsStore {
    settings: ClientSettings;
    updateSettings: (settings: Partial<ClientSettings>) => void;
    updateCacheOnly: (settings: Partial<ClientSettings>) => void;
    resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: DEFAULT_SETTINGS,
            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: {...state.settings, ...newSettings},
                }))
            },
            updateCacheOnly: (newSettings) => {
                set((state) => ({
                    settings: {...state.settings, ...newSettings},
                }))
            },
            resetSettings: () => set({settings: DEFAULT_SETTINGS}),
        }),
        {
            name: 'settings-storage',
        }
    )
)