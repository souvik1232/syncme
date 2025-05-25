// components/Calendar/useGoogleEvents.ts
import { useEffect } from 'react';

type Event = {
    title: string;
    start: Date;
    end: Date;
};

export function useGoogleEvents(accessToken: string | null, setEvents: (events: Event[]) => void) {
    useEffect(() => {
        if (!accessToken) return;

        const fetchEvents = async () => {
            try {
                const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const data = await res.json();
                // Transform if needed
                console.log(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [accessToken, setEvents]);
}
