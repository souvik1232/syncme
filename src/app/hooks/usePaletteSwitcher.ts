import { useEffect, useState } from 'react';
import { themePalettes, ThemeMode, ThemeVars } from '../components/themePalettes';

type PaletteName = keyof typeof themePalettes;

export const usePaletteSwitcher = () => {
    const [palette, setPaletteState] = useState<PaletteName>('default');

    const applyPalette = (paletteName: PaletteName) => {
        const mode: ThemeMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const paletteVars: ThemeVars = themePalettes[paletteName][mode];

        for (const key in paletteVars) {
            document.documentElement.style.setProperty(key, paletteVars[key]);
        }

        setPaletteState(paletteName);
        localStorage.setItem('palette', paletteName);
    };

    useEffect(() => {
        const savedPalette = localStorage.getItem('palette') as PaletteName | null;
        const initialPalette = savedPalette || 'default';
        applyPalette(initialPalette);
    }, []);

    return {
        palette,
        setPalette: applyPalette,
        allPalettes: Object.keys(themePalettes) as PaletteName[],
    };
};
