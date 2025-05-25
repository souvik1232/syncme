// components/Calendar/useHighlightDate.ts
import { useEffect } from 'react';

export function useHighlightDate(highlightDate?: Date | null) {
    useEffect(() => {
        if (!highlightDate) return;

        const pad = (n: number) => n.toString().padStart(2, '0');
        const dateStr = `${highlightDate.getFullYear()}-${pad(highlightDate.getMonth() + 1)}-${pad(highlightDate.getDate())}`;

        setTimeout(() => {
            requestAnimationFrame(() => {
                document.querySelectorAll('.fc-daygrid-day.highlighted, .fc-timegrid-col.highlighted')
                    .forEach((el) => el.classList.remove('highlighted'));

                const el = document.querySelector(`[data-date="${dateStr}"]`);
                el?.classList.add('highlighted');
            });
        }, 60);
    }, [highlightDate]);
}
