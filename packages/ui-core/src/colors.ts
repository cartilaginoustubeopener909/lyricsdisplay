export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export interface LyricColors {
    active: string;
    past: string;
    inactive: string;
    glow: string;
    glowSoft: string;
}

export function parseColor(color: string): RgbColor {
    const hex = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (hex) return { r: parseInt(hex[1], 16), g: parseInt(hex[2], 16), b: parseInt(hex[3], 16) };
    if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] };
    return { r: 255, g: 255, b: 255 };
}

export function buildColors(color: string): LyricColors {
    const c = parseColor(color);
    return {
        active:   color,
        past:     color,
        inactive: `rgba(${c.r}, ${c.g}, ${c.b}, 0.38)`,
        glow:     `rgba(${c.r}, ${c.g}, ${c.b}, 0.55)`,
        glowSoft: `rgba(${c.r}, ${c.g}, ${c.b}, 0.18)`,
    };
}

export function rgba({ r, g, b }: RgbColor, alpha: number): string {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
