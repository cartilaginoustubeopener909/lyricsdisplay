import React from "react";
import {X} from "lucide-react";
import {getCurrentWindow} from '@tauri-apps/api/window';
import {useI18n} from "@lyricsdisplay/shared";

interface PageWrapperProps {
    children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({children}) => {
    const {t} = useI18n();

    return (
        <div
            className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden text-[#F5F3EE] bg-[#0B0B0D] shadow-xl rounded-2xl border-[1px] border-white/10">

            <header
                onMouseDown={(e) => {
                    if (e.button === 0) {
                        getCurrentWindow().startDragging();
                    }
                }}
                className="absolute top-0 w-full flex justify-between items-center px-6 py-4 z-10">
                <div className="flex items-center gap-2 pointer-events-none">
                    <span className="text-[17px] font-bold tracking-tight text-[#F5F3EE]">{t("settings.title")}</span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => getCurrentWindow().destroy()}
                        className="text-red-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-500/20"
                    >
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            </header>

            <main className="relative min-w-screen flex flex-col items-center justify-center">
                {children}
            </main>
        </div>
    );
};
