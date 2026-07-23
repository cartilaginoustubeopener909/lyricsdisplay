import React, {useMemo} from "react";
import {LyricLine} from "@lyricsdisplay/shared";
import {getLineMetrics} from "@lyricsdisplay/ui-core";
import {LyricLineRow} from "./LyricLineRow";

interface LyricsDisplayProps {
    lyrics: LyricLine[];
    oppositeAlign: boolean;
    centerIndex: number;
    startIndex: number;
    fontSize: number;
    color: string;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = React.memo(
    ({lyrics, oppositeAlign, centerIndex, startIndex, fontSize, color}) => {
        const lyricElements = useMemo(() => {
            return lyrics.map((line, localIndex) => {
                const globalIndex = startIndex + localIndex;
                const {opacity, scale, blur, isCenter, isPast} = getLineMetrics(globalIndex, centerIndex);

                return (
                    <LyricLineRow
                        key={line.startTimeMs}
                        line={line}
                        isCenter={isCenter}
                        isPast={isPast}
                        opacity={opacity}
                        scale={scale}
                        blur={blur}
                        oppositeAlign={oppositeAlign}
                        fontSize={fontSize}
                        color={color}
                    />
                );
            });
        }, [lyrics, centerIndex, startIndex, fontSize, color, oppositeAlign]);

        return (
            <div className="flex flex-col pt-6 relative overflow-hidden">
                {lyricElements}
            </div>
        );
    }
);