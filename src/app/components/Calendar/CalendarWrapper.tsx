// components/Calendar/CalendarWrapper.tsx
import { ReactNode } from 'react';

export default function CalendarWrapper({ children }: { children: ReactNode; }) {
    return (
        <div className="bg-[var(--card-bg)] text-[var(--foreground)] p-6 rounded-2xl border border-[var(--card-border)] shadow-md">
            <h2 className="text-2xl font-semibold text-[var(--accent)] mb-4">📅 Calendar</h2>
            {children}
        </div>
    );
}
