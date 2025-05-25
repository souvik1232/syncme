import { usePaletteSwitcher } from '../hooks/usePaletteSwitcher';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themePalettes } from '../components/themePalettes';

export const PaletteDropdown = () => {
    const { palette, setPalette, allPalettes } = usePaletteSwitcher();
    const [open, setOpen] = useState(false);

    // Use light mode colors for preview in dropdown
    const currentColors = themePalettes[palette]?.light;

    return (
        <div className="relative text-left flex justify-end">
            {/* Circular button showing current palette accent color */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Select theme palette"
                className="w-10 h-10 rounded-full border border-border shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ backgroundColor: currentColors?.['--accent'] || '#ccc' }}
            ></button>

            {/* AnimatePresence for dropdown animation */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 bottom-full mb-2 w-36 rounded-xl shadow-lg bg-card ring-1 ring-border p-3 flex flex-col gap-2 z-50"
                        style={{ transformOrigin: 'bottom right' }}
                    >
                        {allPalettes.map((p) => {
                            const colors = themePalettes[p]?.light;
                            const isSelected = p === palette;
                            return (
                                <button
                                    key={p}
                                    onClick={() => {
                                        setPalette(p);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition whitespace-nowrap ${isSelected ? 'bg-accent/20 font-semibold text-accent' : 'hover:bg-hover-color text-foreground'
                                        }`}
                                >
                                    {/* Circle showing accent color */}
                                    <span
                                        className="w-6 h-6 rounded-full border flex-shrink-0"
                                        style={{ backgroundColor: colors?.['--accent'] || '#ccc' }}
                                    ></span>
                                    <span className="capitalize">{p}</span>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
