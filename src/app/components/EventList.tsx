'use client';

import { useMemo, useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import { TextField, IconButton, Typography, Pagination } from '@mui/material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

type Props = {
    events: EventInput[];
    itemsPerPage?: number;
    onEventClick?: (event: EventInput) => void;
};

export default function EventList({ events, itemsPerPage = 5,onEventClick }: Props) {
    const [search, setSearch] = useState('');
    const [groupByDate, setGroupByDate] = useState(false);
    const [page, setPage] = useState(1);

    const filteredEvents = useMemo(() => {
        return events.filter((event) =>
            event.title?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, events]);

    const groupedEvents = useMemo(() => {
        const map: { [date: string]: EventInput[]; } = {};
        filteredEvents.forEach((event) => {
            const dateKey = format(new Date(event.start as string), 'yyyy-MM-dd');
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(event);
        });
        return map;
    }, [filteredEvents]);

    // Pagination logic
    const paginatedEvents = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredEvents, page, itemsPerPage]);

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '2rem',
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            '& fieldset': {
                borderColor: 'var(--border)'
            },
            '&:hover fieldset': {
                borderColor: 'var(--accent)'
            },
            '&.Mui-focused fieldset': {
                borderColor: 'var(--accent)'
            },
            '& input': {
                color: 'var(--foreground)',
                '&::placeholder': {
                    color: '#888',
                    opacity: 1
                }
            },
            '& .MuiSvgIcon-root': {
                color: 'var(--foreground)'
            }
        },
        '& .MuiInputLabel-root': {
            color: 'var(--foreground)'
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--accent)'
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <TextField
                    label="Search Events"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // reset to page 1 on search
                    }}
                    sx={inputStyles}
                    className="flex-1 min-w-[200px]"
                />
                <IconButton
                    onClick={() => setGroupByDate((prev) => !prev)}
                    title="Toggle Group View"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border)',
                        color: 'var(--accent)',
                        borderRadius: '9999px',
                        padding: '8px',
                        transition: '0.3s',
                        '&:hover': {
                            backgroundColor: 'var(--accent)',
                            color: '#fff',
                        },
                    }}
                >
                    {groupByDate ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>

            </div>

            {groupByDate ? (
                Object.entries(groupedEvents).map(([date, dayEvents]) => (
                    <div key={date} className="mb-6">
                        <Typography
                            variant="h6"
                            className="text-[var(--accent)] mb-2 font-bold"
                        >
                            {format(new Date(date), 'do MMM yyyy')}
                        </Typography>
                        <ul className="space-y-3">
                            {dayEvents.map((event, i) => (
                                <motion.li
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-md"
                                >
                                    <h4 className="font-medium text-lg">{event.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(event.start as string), 'p')} –{' '}
                                        {format(new Date(event.end as string), 'p')}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <ul className="space-y-3">
                    {paginatedEvents.map((event, idx) => (
                        <motion.li
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onEventClick?.(event)}
                            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-md"
                        >
                            <h4 className="font-medium text-lg text-[var(--accent)]">
                                {event.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(event.start as string), 'Pp')} –{' '}
                                {format(new Date(event.end as string), 'Pp')}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            )}

            {filteredEvents.length === 0 && (
                <Typography variant="body2" className="text-center mt-6 text-muted-foreground">
                    No events found.
                </Typography>
            )}

            {!groupByDate && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </div>
            )}
        </div>
    );
}
