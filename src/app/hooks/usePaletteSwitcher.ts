import { useEffect, useState } from 'react';
import { themePalettes, ThemeMode, ThemeVars } from '../components/themePalettes';

type PaletteName = keyof typeof themePalettes;

export const usePaletteSwitcher = () => {
    const [palette, setPaletteState] = useState<PaletteName>(() =>
        (localStorage.getItem('palette') as PaletteName) || 'default'
    );

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
        applyPalette(palette);

        const observer = new MutationObserver(() => applyPalette(palette));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, [palette]);

    return {
        palette,
        setPalette: applyPalette,
        allPalettes: Object.keys(themePalettes) as PaletteName[],
    };
};
