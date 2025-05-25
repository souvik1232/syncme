'use client';

import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { PaletteDropdown } from './PaletteDropdown';

export default function ToggleSwitch() {
    const { mode, setMode } = useTheme();
    const [ripple, setRipple] = useState<{ x: number; y: number; } | null>(null);
    const [animating, setAnimating] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        if (animating) return;

        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            setRipple({ x, y });
            setAnimating(true);

            setTimeout(() => {
                setMode(mode === 'dark' ? 'light' : 'dark');
                setTimeout(() => {
                    setRipple(null);
                    setAnimating(false);
                }, 100);
            }, 100);
        }
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                {/* Palette Selector */}
                <PaletteDropdown />

                {/* Theme toggle button */}
                <button
                    ref={buttonRef}
                    onClick={handleToggle}
                    className="flex items-center bg-[var(--accent)] text-white rounded-full px-3 py-1.5 shadow-lg w-fit"
                    aria-label="Toggle Theme"
                >
                    <motion.div
                        className="relative w-10 h-6 rounded-full bg-white/20"
                        animate={{ backgroundColor: mode === 'dark' ? '#4b5563' : '#d1d5db' }}
                    >
                        <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                            layout
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            animate={{ x: mode === 'dark' ? 20 : 0 }}
                        >
                            {mode === 'dark' ? (
                                <Moon className="w-3 h-3 text-black" />
                            ) : (
                                <Sun className="w-3 h-3 text-yellow-500" />
                            )}
                        </motion.div>
                    </motion.div>
                    <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium whitespace-nowrap">
                        {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>

            {/* Ripple animation */}
            <AnimatePresence>
                {ripple && (
                    <motion.div
                        key="ripple"
                        initial={{
                            left: ripple.x,
                            top: ripple.y,
                            scale: 0,
                            opacity: 0.5,
                        }}
                        animate={{
                            scale: 50,
                            opacity: 0,
                            transition: { duration: 0.6, ease: 'easeOut' },
                        }}
                        exit={{ opacity: 0 }}
                        className="fixed w-[10px] h-[10px] bg-[var(--background)] rounded-full z-40 pointer-events-none"
                        style={{
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
