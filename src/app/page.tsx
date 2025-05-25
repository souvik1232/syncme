'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import CalendarView from './components/CalendarViewWrapper';
import EventList from './components/EventList';
import ToggleSwitch from './components/ThemeToggle';
import { safeDate } from './utils/date';
import { useGoogleAuthContext } from './context/GoogleAuthProvider';
import SignInPage from './signin/signinPage';
import Navbar from './components/Navbar';

type Event = {
  title: string;
  start: Date;
  end: Date;
};

export default function Home() {
  const { isSignedIn, user, gsiReady } = useGoogleAuthContext();
  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Welcome Event',
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000),
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  console.log(isSignedIn);


  if (!gsiReady) return <div>Loading Google Sign-In...</div>;
  if (!isSignedIn || !user) return <SignInPage />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar/>
      <Box sx={{ padding: 2 }}>
        <ToggleSwitch />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          gap: 2,
          mt: 2,
          px: 2,
          pb: 2,
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* Calendar View */}
        <Box
          sx={{
            flex: 2,
            minHeight: 0,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CalendarView
            events={events}
            setEvents={setEvents}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            highlightDate={selectedEvent?.start ?? null}
          />
        </Box>

        {/* Event List */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <EventList
            events={events}
            onEventClick={(event) => {
              const title = event.title ?? 'Untitled';
              const start = safeDate(event.start);
              const end = safeDate(event.end);

              if (start && end) {
                setSelectedEvent({ title, start, end });
              } else {
                console.warn('Invalid date in event:', event);
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
