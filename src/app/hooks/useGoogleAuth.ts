'use client';

import { useEffect, useState } from 'react';

type GoogleUserProfile = {
    name: string;
    email: string;
    imageUrl: string;
};

// interface GoogleCredentialResponse {
//     credential: string;
//     select_by: string;
//     clientId?: string;
// }

const CLIENT_ID = '757382743029-upebl4cnp35vk6gf4ciu8acptgupho7b.apps.googleusercontent.com'; // Replace with your actual client ID
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const parseJwt=(token: string): GoogleUserProfile | null=> {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        const { name, email, picture } = JSON.parse(jsonPayload);
        return { name, email, imageUrl: picture };
    } catch (error) {
        console.error('JWT parse error:', error);
        return null;
    }
  }

export function useGoogleAuth() {
    const [user, setUser] = useState<GoogleUserProfile | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [gsiReady, setGsiReady] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedUser = sessionStorage.getItem('google_user');
        const savedToken = sessionStorage.getItem('google_token');
        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
                setAccessToken(savedToken);
                setIsSignedIn(true);
            } catch (err) {
                console.error('Failed to restore session:', err);
                sessionStorage.removeItem('google_user');
                sessionStorage.removeItem('google_token');
            }
          }

        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('✅ Google Identity script loaded');
                setGsiReady(true);
            };
            script.onerror = () => {
                console.error('❌ Failed to load Google Identity script');
            };
            document.body.appendChild(script);
        };

        if (!window.google || !window.google.accounts) {
            loadGoogleScript();
        } else {
            console.log('✅ Google Identity already available');
            setGsiReady(true);
        }
    }, []);

    const signIn = (response: GoogleCredentialResponse) => {
        const profile = parseJwt(response.credential);
        if (profile) {
            setUser(profile);
            setIsSignedIn(true);
            sessionStorage.setItem('google_user', JSON.stringify(profile));
        }

        const tryRequestToken = () => {
            if (window.google?.accounts?.oauth2) {
                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: (tokenResponse: { access_token: string; }) => {
                        setAccessToken(tokenResponse.access_token);
                        sessionStorage.setItem('google_token', tokenResponse.access_token);
                    },
                });

                tokenClient.requestAccessToken();
            } else {
                console.error('❌ google.accounts.oauth2 is not available yet');
            }
        };

        setTimeout(tryRequestToken, 0);
      };

    const signOut = () => {
        setUser(null);
        setIsSignedIn(false);
        setAccessToken(null);
        sessionStorage.removeItem('google_user');
        sessionStorage.removeItem('google_token');
        if (window.google?.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
        } else {
            console.error('Failed to parse Google profile.');
          }
    };

    return {
        user,
        isSignedIn,
        signIn,
        signOut,
        gsiReady,
        accessToken
    };
}
