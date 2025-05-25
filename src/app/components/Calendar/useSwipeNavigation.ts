/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Calendar/useSwipeNavigation.ts
import { useEffect } from 'react';

export function useSwipeNavigation(ref: React.RefObject<HTMLElement>, calendarRef: React.RefObject<any>) {
    useEffect(() => {
        let startX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const endX = e.changedTouches[0].clientX;
            const delta = endX - startX;

            const calendarApi = calendarRef.current?.getApi?.();
            if (delta > 50) calendarApi?.prev();
            else if (delta < -50) calendarApi?.next();
        };

        const node = ref.current;
        if (node) {
            node.addEventListener('touchstart', handleTouchStart, { passive: true });
            node.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            if (node) {
                node.removeEventListener('touchstart', handleTouchStart);
                node.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [ref, calendarRef]);
}
