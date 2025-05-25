'use client';

import { useGoogleAuthContext } from '../context/GoogleAuthProvider';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function SignOutButton() {
    const { signOut, isSignedIn, user } = useGoogleAuthContext();
    const { mode } = useTheme();

    if (!isSignedIn) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className={`px-4 py-2 rounded-lg shadow-md border transition-colors duration-200
                    bg-[var(--btn-bg)] text-[var(--btn-fg)] border-[var(--btn-border)]
                    hover:bg-[var(--btn-hover-bg)]`}
                key={mode}
            >
                Sign out {user?.name ? `(${user.name})` : ''}
            </motion.button>
        </div>
    );
}
