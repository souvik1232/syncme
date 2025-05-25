'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { themePalettes } from '../components/themePalettes';

type Mode = "light" | "dark";
type ThemeName = keyof typeof themePalettes;

interface ThemeContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


const applyTheme = (themeName: keyof typeof themePalettes, mode: "light" | "dark") => {
    const root = document.documentElement;

    const theme = themePalettes[themeName][mode];
    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
    localStorage.setItem('mode', mode);
}

export const ThemeProvider = ({ children }: { children: React.ReactNode; }) => {
    const [mode, setMode] = useState<Mode>("light");
    const [themeName, setThemeName] = useState<ThemeName>("default");

    useEffect(() => {
        const savedPalette = localStorage.getItem('palette') as ThemeName | null;
        const initialPalette = savedPalette || 'default';
        applyTheme(initialPalette, mode);

        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
          }
    }, [mode, themeName]);

    return <ThemeContext.Provider value={{ mode, setMode, themeName, setThemeName }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
