'use client';

import { useState } from 'react';
import { Container } from '@mui/material';
import CalendarView from './components/CalendarViewWrapper';
import EventList from './components/EventList';
import ToggleSwitch from './components/ThemeToggle';
type Event = {
  title: string;
  start: Date;
  end: Date;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Welcome Event',
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000),
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ToggleSwitch/>
      <CalendarView events={events} setEvents={setEvents} />
      <EventList events={events} />
    </Container>
  );
}
