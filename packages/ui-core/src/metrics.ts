const OPACITY_DECAY_RATE = 0.15;

export interface LineMetrics {
    opacity: number;
    scale: number;
    blur: number;
    isCenter: boolean;
    isPast: boolean;
}

export function getLineMetrics(
    globalIndex: number,
    centerIndex: number,
): LineMetrics {
    const distance = Math.abs(globalIndex - centerIndex);
    const isCenter = globalIndex === centerIndex;
    const isPast = globalIndex < centerIndex;

    return {
        opacity: Math.max(0, 1 - Math.pow(distance, 1.5) * OPACITY_DECAY_RATE),
        scale: isCenter ? 1.08 : Math.max(0.82, 1 - Math.pow(distance, 1.2) * 0.08),
        blur: distance > 0 ? Math.min(distance * 0.6, 3) : 0,
        isCenter,
        isPast,
    };
}
