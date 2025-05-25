'use client';

import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { useGoogleAuthContext } from '../context/GoogleAuthProvider';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function Navbar() {
    const { user, isSignedIn, signOut } = useGoogleAuthContext();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'var(--nav-bg, #ffffff)',
                color: 'var(--nav-fg, #000000)',
                boxShadow: 'none',
                px: 2,
                py: 1,
                zIndex: 1201,
            }}
        >
            <Toolbar
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                sx={{ width: '100%', justifyContent: 'space-between' }}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <FaRegCalendarAlt size={24} color="var(--accent, #10B981)" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                background: 'linear-gradient(to right, var(--accent), var(--btn-fg))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'var(--event-text)',
                                textTransform: 'uppercase',
                            }}
                        >
                            SyncMe
                        </Typography>
                    </motion.div>
                </motion.div>

                {isSignedIn && (
                    <Box display="flex" alignItems="center" gap={2}>
                        {user?.imageUrl && (
                            <Box
                                component="img"
                                src={user.imageUrl}
                                alt={user.name}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        )}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                                onClick={signOut}
                                sx={{
                                    color: 'var(--btn-fg, #ffffff)',
                                    backgroundColor: 'var(--accent, #10B981)',
                                    '&:hover': {
                                        backgroundColor: 'var(--accent-hover, #059669)',
                                    },
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </motion.div>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
