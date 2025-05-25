import { useEffect } from 'react';

type KeyPressHandlerOptions = {
    targetKeys?: string[]; // e.g., ['Escape', 'Enter']
    callback?: (event: KeyboardEvent) => void;
    ref?: React.RefObject<HTMLElement>; // for outside click
    onClickOutside?: () => void;
    active?: boolean; // allow dynamic enabling/disabling
};

export function useKeyPressHandler({
    targetKeys = [],
    callback,
    ref,
    onClickOutside,
    active = true,
}: KeyPressHandlerOptions) {
    useEffect(() => {
        if (!active) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (callback && targetKeys.includes(event.key)) {
                callback(event);
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (
                ref?.current &&
                !ref.current.contains(event.target as Node) &&
                onClickOutside
            ) {
                onClickOutside();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [targetKeys, callback, ref, onClickOutside, active]);
}
