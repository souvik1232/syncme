// context/EventsContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Event = {
    title: string;
    start: Date;
    end: Date;
};

type EventsContextType = {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function useEventsContext() {
    const context = useContext(EventsContext);
    if (!context) throw new Error('useEventsContext must be used within EventsProvider');
    return context;
}

export function EventsProvider({ children }: { children: ReactNode; }) {
    const [events, setEvents] = useState<Event[]>([
        {
            title: 'Welcome Event',
            start: new Date(),
            end: new Date(new Date().getTime() + 30 * 60 * 1000),
        },
    ]);

    return (
        <EventsContext.Provider value={{ events, setEvents }}>
            {children}
        </EventsContext.Provider>
    );
}
