/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { useEffect, useRef, useState } from 'react';
// import { motion } from 'framer-motion';
import EventDialog from './EventDialog';
import { useTheme } from '../context/ThemeContext';
import { useGoogleAuthContext } from '../context/GoogleAuthProvider';

type Event = {
    title: string;
    start: Date;
    end: Date;
};

type Props = {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    selectedEvent?: Event | null;
    setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
    highlightDate?: Date | null;
  };

export interface CalendarViewRef {
    selectEvent: (start: Date, end: Date) => void;
  }

export default function CalendarView({ events, setEvents, selectedEvent, setSelectedEvent, highlightDate }: Props) {
    const calendarRef = useRef<any>(null);
    const { mode } = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
    const { accessToken } = useGoogleAuthContext();

    useEffect(() => {
        console.log(accessToken);

        if (!accessToken) return;

        const fetchEvents = async () => {
            try {
                const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await res.json();
                console.log(data);


                // if (data.items) {
                //     const mappedEvents = data.items
                //         .filter((event: any) => event.start && (event.start.dateTime || event.start.date))
                //         .map((event: any) => ({
                //             title: event.summary || 'Untitled',
                //             start: event.start.dateTime || event.start.date,
                //             end: event.end?.dateTime || event.end?.date || event.start.dateTime || event.start.date,
                //         }));

                //     setEvents(mappedEvents);
                // }
            } catch (error) {
                console.error('Error fetching Google Calendar events:', error);
            }
        };

        fetchEvents();
    }, [accessToken, setEvents]);

    const handleDateClick = (arg: any) => {
        setSelectedDate(new Date(arg.date));
        setDialogOpen(true);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const calendarEvent = clickInfo.event;
        const eventObj = {
            title: calendarEvent.title,
            start: calendarEvent.start!,
            end: calendarEvent.end!,
        };
        setSelectedEvent(eventObj);
        setDialogOpen(true);
    };

    const handleEventAdd = (event: any) => {
        setEvents((prev) => [...prev, event]);
        setDialogOpen(false);
        setSelectedEvent(null);
        setSelectedDate(null);
    };

    const handleEventDelete = () => {
        if (!selectedEvent) return;
        setEvents((prev) =>
            prev.filter(
                (e) =>
                    !(
                        e.title === selectedEvent.title &&
                        e.start.getTime() === selectedEvent.start.getTime() &&
                        e.end.getTime() === selectedEvent.end.getTime()
                    )
            )
        );
        setDialogOpen(false);
        setSelectedEvent(null);
        setSelectedDate(null);
    };

    useEffect(() => {
        if (selectedEvent && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            const date = selectedEvent.start!;
            calendarApi.gotoDate(date);
            const dateStr = date.toLocaleDateString('en-CA');;
            setHighlightedDate(dateStr);
            const currentView = calendarApi.view.type;
            calendarApi.changeView('dayGridDay', date);
            setTimeout(() => {
                calendarApi.changeView(currentView, date);
            }, 0);
        }
    }, [selectedEvent]);

    useEffect(() => {
        if (!highlightDate) return;

        const pad = (n: number) => n.toString().padStart(2, '0');
        const toLocalDateStr = (date: Date) => {
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        };

        const dateStr = toLocalDateStr(highlightDate);
        setHighlightedDate(dateStr);

        // Delay until DOM is rendered
        setTimeout(() => {
            requestAnimationFrame(() => {
                // Clear previous highlights
                document.querySelectorAll('.fc-daygrid-day.highlighted, .fc-timegrid-col.highlighted')
                    .forEach(el => el.classList.remove('highlighted'));

                // Highlight correct date cell
                const el = document.querySelector(`[data-date="${dateStr}"]`);
                if (el) {
                    el.classList.add('highlighted');
                } else {
                    console.warn(`No element found for [data-date="${dateStr}"]`);
                }
            });
        }, 60)
    }, [highlightDate]);

    return (
        <div className={`bg-[var(--card-bg)] text-[var(--foreground)] p-6 rounded-2xl border border-[var(--card-border)] ${mode === 'dark'
                ? 'shadow-[0_4px_20px_rgba(255,255,255,0.1)]'
                : 'shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
        }`}>
            <h2 className="text-2xl font-semibold text-[var(--accent)] mb-4">📅 Calendar</h2>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable
                selectable
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={events}
                dayCellDidMount={(arg) => {
                    const cellDateStr = arg.date.toLocaleDateString('en-CA');
                    if (cellDateStr === highlightedDate) {
                        arg.el.classList.add('highlighted-cell');
                        setTimeout(() => {
                            arg.el.classList.remove('highlighted-cell');
                        }, 1500);
                    }
                  }}
                height={600}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                key={mode}
            />
            {dialogOpen && (
                <EventDialog
                    open={dialogOpen}
                    date={selectedDate}
                    initialData={selectedEvent}
                    onSave={handleEventAdd}
                    onClose={() => {
                        setDialogOpen(false);
                        setSelectedEvent(null);
                        setSelectedDate(null);
                    }}
                    onDelete={selectedEvent ? handleEventDelete : undefined}
                />
            )}
        </div>
    );
}
