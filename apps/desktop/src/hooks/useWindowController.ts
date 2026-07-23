import {useEffect} from 'react';
import {getCurrentWindow} from '@tauri-apps/api/window';
import {WebviewWindow} from '@tauri-apps/api/webviewWindow';

export const useWindowController = () => {
    useEffect(() => {
        getCurrentWindow().setAlwaysOnTop(true).catch(console.error);

        const handleMouseDownSettings = (e: MouseEvent) => {
            if (e.button === 1) { // middle click
                e.preventDefault();

                try {
                    const settingsWindow = new WebviewWindow('settings', {
                        url: '/#/settings',
                        title: 'Settings',
                        width: 800,
                        height: 750,
                        transparent: true,
                        decorations: false,
                        shadow: false,
                        resizable: false,
                        center: true,
                        focus: true,
                    });

                    settingsWindow.once('tauri://created', async () => {
                        await settingsWindow.setFocus();
                    });

                    settingsWindow.once('tauri://error', (error) => {
                        console.error('Failed to create settings window:', error);
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        };

        const handleMouseDownDrag = (e: MouseEvent) => {
            if (e.button === 0) { // left click
                const target = e.target as HTMLElement;
                if (target.closest('button, a, input, textarea, .settings-button')) return;

                if (target.closest('[data-tauri-drag-region]')) {
                    getCurrentWindow().startDragging();
                }
            }
        };

        document.addEventListener('mousedown', handleMouseDownSettings);
        document.addEventListener('mousedown', handleMouseDownDrag);

        return () => {
            document.removeEventListener('mousedown', handleMouseDownSettings);
            document.removeEventListener('mousedown', handleMouseDownDrag);
        };
    }, []);
};
