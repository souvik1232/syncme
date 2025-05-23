/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { useState } from 'react';
// import { motion } from 'framer-motion';
import EventDialog from './EventDialog';
import { useTheme } from '../context/ThemeContext';

type Event = {
    title: string;
    start: Date;
    end: Date;
};

type Props = {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  };

export default function CalendarView({ events, setEvents }: Props) {
    const { theme } = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleDateClick = (arg: any) => {
        setSelectedDate(new Date(arg.date));
        setDialogOpen(true);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const calendarEvent = clickInfo.event;
        setSelectedEvent({
            title: calendarEvent.title,
            start: calendarEvent.start!,
            end: calendarEvent.end!,
        });
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

    return (
        <div className="bg-[var(--card-bg)] text-[var(--foreground)] p-6 rounded-2xl shadow-md border border-[var(--card-border)]">
            <h2 className="text-2xl font-semibold text-[var(--accent)] mb-4">📅 Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable
                selectable
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={events}
                height={600}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                key={theme}
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
