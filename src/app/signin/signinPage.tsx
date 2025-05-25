'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useGoogleAuthContext } from '../context/GoogleAuthProvider';

const CLIENT_ID = '757382743029-upebl4cnp35vk6gf4ciu8acptgupho7b.apps.googleusercontent.com';

export default function SignInPage() {
    const { gsiReady, user, isSignedIn, signIn, signOut } = useGoogleAuthContext();
    const buttonDivRef = useRef<HTMLDivElement>(null);
    const hasRenderedButton = useRef(false);


    useEffect(() => {
        if (gsiReady && !isSignedIn && window.google && buttonDivRef.current && !hasRenderedButton.current) {
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (response: GoogleCredentialResponse) => signIn(response),
                auto_select: false,
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
            });

            window.google.accounts.id.renderButton(buttonDivRef.current, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
            });

            // Optionally auto-prompt
            window.google.accounts.id.prompt();
        }
    }, [gsiReady, isSignedIn]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <motion.div
                className="p-10 bg-white rounded-2xl shadow-xl text-center space-y-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
                {isSignedIn && user ? (
                    <>
                        <p className="text-gray-600">Signed in as {user.name}</p>
                        <Image
                            src={user?.imageUrl || '/default-avatar.png'}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                        />
                        <button onClick={signOut} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full">
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600">Sign in to continue</p>
                        <div ref={buttonDivRef} className="flex justify-center" />
                    </>
                )}
            </motion.div>
        </div>
    );
}
