'use client'; // if using the app directory

import { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';
import {
    DateTimePicker,
    LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Home() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
    const [endDateTime, setEndDateTime] = useState<Date | null>(new Date());

    const handleSubmit = () => {
        console.log({
            title,
            description,
            start: startDateTime,
            end: endDateTime,
        });
        // TODO: Integrate with Google Calendar API
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Schedule an Event
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />
                    <DateTimePicker
                        label="Start Date & Time"
                        value={startDateTime}
                        onChange={setStartDateTime}
                    />
                    <DateTimePicker
                        label="End Date & Time"
                        value={endDateTime}
                        onChange={setEndDateTime}
                    />
                    <Button variant="contained" onClick={handleSubmit}>
                        Create Event
                    </Button>
                </Box>
            </Container>
        </LocalizationProvider>
    );
}
