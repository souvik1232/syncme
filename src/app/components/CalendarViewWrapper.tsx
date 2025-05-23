'use client';

import dynamic from 'next/dynamic';

const CalendarView = dynamic(() => import('./CalendarView'), {
    ssr: false, // ⛔ Disable server-side rendering
});

export default CalendarView;
