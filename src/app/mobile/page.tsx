'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    IconButton,
    Typography,
    InputBase,
    Paper,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useEventsContext } from '../context/EventsContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function MobileEventListPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { events } = useEventsContext();

    const filteredEvents = useMemo(() => {
        return events.filter((event) =>
            event.title?.toLowerCase().includes(search.toLowerCase())
        );
    }, [events, search]);

    if (!isMobile) {
        router.push('/');
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Navbar />
            <Box sx={{ px: 2, py: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
                        Events List
                    </Typography>
                </Box>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    <Paper
                        sx={{
                            mb: 3,
                            px: 2,
                            py: 1.5,
                            borderRadius: '12px',
                            backgroundColor: 'var(--card)',
                        }}
                    >
                        <InputBase
                            placeholder="Search Events"
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ fontSize: '0.95rem' }}
                        />
                    </Paper>
                </motion.div>

                {/* List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <AnimatePresence>
                        {filteredEvents.map((event, idx) => (
                            <motion.div
                                key={event.title + idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                            >
                                <Paper
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--card)',
                                        boxShadow: 'sm',
                                    }}
                                    onClick={() => console.log('Clicked:', event)}
                                >
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'var(--event-text)'}}>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ color: 'var(--event-text)' }}>
                                        {format(new Date(event.start), 'p')} –{' '}
                                        {format(new Date(event.end), 'p')}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredEvents.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                No events found.
                            </Typography>
                        </motion.div>
                    )}
                </Box>
            </Box>
        </motion.div>
    );
}
