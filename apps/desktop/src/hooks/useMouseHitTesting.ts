import {useEffect, useRef} from 'react';
import {invoke} from '@tauri-apps/api/core';
import {getCurrentWindow} from '@tauri-apps/api/window';
import {listen} from '@tauri-apps/api/event';

interface ElementRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export const useMouseHitTesting = (dependencies: any[]) => {
    const cachedRectsRef = useRef<ElementRect[]>([]);

    const updateCachedRects = () => {
        const dragElements = document.querySelectorAll('[data-tauri-drag-region]');
        const rects: ElementRect[] = [];
        dragElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            rects.push({
                left: rect.left,
                top: rect.top,
                right: rect.left + rect.width,
                bottom: rect.top + rect.height
            });
        });
        cachedRectsRef.current = rects;
    };

    useEffect(() => {
        const handle = requestAnimationFrame(() => {
            updateCachedRects();
        });

        const handleResize = () => {
            updateCachedRects();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(handle);
            window.removeEventListener('resize', handleResize);
        };
    }, dependencies);

    useEffect(() => {
        let unlistenMouse: (() => void) | undefined;
        let unlistenMove: (() => void) | undefined;
        let isStarted = false;

        const initHitTesting = async () => {
            try {
                const win = getCurrentWindow();
                await invoke('start_global_mouse_stream').catch(console.error);
                isStarted = true;

                await win.setIgnoreCursorEvents(true).catch(e => console.error("Initial ignore cursor failed:", e));

                let innerPos = await win.innerPosition().catch(() => ({x: 0, y: 0}));
                let scaleFactor = await win.scaleFactor().catch(() => 1);

                const moveCb = await win.onMoved(async () => {
                    try {
                        innerPos = await win.innerPosition();
                        scaleFactor = await win.scaleFactor();
                    } catch (e) {
                    }
                });
                unlistenMove = moveCb;

                let lastIgnoreState: boolean | null = null;

                unlistenMouse = await listen<string>('device-mouse-move', ({payload}) => {
                    try {
                        const {x: payloadX, y: payloadY} = JSON.parse(payload);
                        const rects = cachedRectsRef.current;

                        if (rects.length === 0) return;

                        let isEnter = false;
                        for (let i = 0; i < rects.length; i++) {
                            const rect = rects[i];
                            const globalLeft = innerPos.x + (rect.left * scaleFactor);
                            const globalTop = innerPos.y + (rect.top * scaleFactor);
                            const globalRight = innerPos.x + (rect.right * scaleFactor);
                            const globalBottom = innerPos.y + (rect.bottom * scaleFactor);

                            if (payloadX >= globalLeft && payloadX <= globalRight &&
                                payloadY >= globalTop && payloadY <= globalBottom) {
                                isEnter = true;
                                break;
                            }
                        }

                        const shouldIgnore = !isEnter;

                        if (shouldIgnore !== lastIgnoreState) {
                            lastIgnoreState = shouldIgnore;
                            win.setIgnoreCursorEvents(shouldIgnore).catch(console.error);
                        }
                    } catch (e) {
                    }
                });
            } catch (e) {
                console.error("Failed to init hit testing:", e);
            }
        };

        initHitTesting();

        return () => {
            if (unlistenMouse) unlistenMouse();
            if (unlistenMove) unlistenMove();
            if (isStarted) {
                invoke('stop_global_mouse_stream').catch(console.error);
            }
        };
    }, []);
};
