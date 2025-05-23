'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

type Event = {
    title: string;
    start: Date;
    end: Date;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (event: Event) => void;
    onDelete?: () => void;
    initialData?: Event | null;
    date?: Date | null;
};

export default function EventDialog({
    open,
    onClose,
    onSave,
    onDelete,
    initialData,
    date
}: Props) {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState<Date | null>(new Date());
    const [end, setEnd] = useState<Date | null>(new Date());

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setStart(initialData.start);
            setEnd(initialData.end);
        } else if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setHours(endDate.getHours() + 1);
            setTitle('');
            setStart(startDate);
            setEnd(endDate);
        } else {
            setTitle('');
            setStart(new Date());
            setEnd(new Date());
        }
    }, [initialData, date, open]);

    const handleSave = () => {
        if (!title || !start || !end) return;
        onSave({ title, start, end });
    };

    if (!open) return null;

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


    const buttonStyles = {
        cancel: {
            color: 'var(--accent)',
            borderColor: 'var(--accent)',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
        },
        save: {
            backgroundColor: 'var(--accent)',
            color: 'white',
            '&:hover': {
                backgroundColor: 'var(--accent-hover)'
            }
        },
        delete: {
            color: 'var(--error)',
            '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)'
            }
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl shadow-2xl w-[95%] max-w-lg overflow-hidden border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                >
                    <DialogTitle className="text-xl font-semibold px-6 pt-6 text-[var(--accent)]">
                        {initialData ? 'Edit Event' : 'New Event'}
                    </DialogTitle>
                    <DialogContent className="flex flex-col gap-4 px-6 py-2">
                        <TextField
                            fullWidth
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                            sx={inputStyles}
                        />
                        <DateTimePicker
                            label="Start"
                            value={start}
                            onChange={setStart}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    sx: inputStyles
                                }
                            }}
                        />
                        <DateTimePicker
                            label="End"
                            value={end}
                            onChange={setEnd}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    sx: inputStyles
                                }
                            }}
                        />
                    </DialogContent>
                    <DialogActions className="px-6 pb-6 flex justify-between">
                        <div>
                            {onDelete && (
                                <Button onClick={onDelete} sx={buttonStyles.delete}>
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={onClose} sx={buttonStyles.cancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} variant="contained" sx={buttonStyles.save}>
                                Save
                            </Button>
                        </div>
                    </DialogActions>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
