'use client';

import { createContext, useContext } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const GoogleAuthContext = createContext<ReturnType<typeof useGoogleAuth> | null>(null);

export const GoogleAuthProvider = ({ children }: { children: React.ReactNode; }) => {
    const auth = useGoogleAuth();
    return <GoogleAuthContext.Provider value={auth}>{children}</GoogleAuthContext.Provider>;
};

export const useGoogleAuthContext = () => {
    const ctx = useContext(GoogleAuthContext);
    if (!ctx) throw new Error('useGoogleAuthContext must be used within GoogleAuthProvider');
    return ctx;
};
