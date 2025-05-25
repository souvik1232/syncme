'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CalendarView from './components/Calendar/CalendarViewWrapper';
import EventList from './components/EventList';
import ToggleSwitch from './components/ThemeToggle';
import { safeDate } from './utils/date';
import { useGoogleAuthContext } from './context/GoogleAuthProvider';
import SignInPage from './signin/signinPage';
import Navbar from './components/Navbar';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import ListAltIcon from '@mui/icons-material/ListAlt';
import useIsMobile from './hooks/useIsMobile';
import { useEventsContext } from './context/EventsContext';

type Event = {
  title: string;
  start: Date;
  end: Date;
};

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { isSignedIn, user, gsiReady } = useGoogleAuthContext();
  const { events, setEvents } = useEventsContext();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            {isMobile && <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'var(--accent)' }}
            >
              📅 Calendar
            </Typography>}

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Button
                variant="outlined"
                startIcon={<ListAltIcon />}
                onClick={() => router.push('/mobile')}
                sx={{
                  borderRadius: '2rem',
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'var(--accent)',
                  borderColor: 'var(--accent)',
                  '&:hover': {
                    backgroundColor: 'var(--accent)',
                    color: '#fff',
                  },
                }}
              >
                View Events
              </Button>
            </Box>
          </Box>
          <CalendarView
            events={events}
            setEvents={setEvents}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            highlightDate={selectedEvent?.start ?? null}
            isMobile={isMobile}
          />
        </Box>

        {/* Event List */}
       {!isMobile &&  <Box
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
        </Box>}
      </Box>
    </Box>
  );
}
