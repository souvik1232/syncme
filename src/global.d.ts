/* eslint-disable @typescript-eslint/no-explicit-any */
export { };

declare global {
    interface GoogleCredentialResponse {
        credential: string;
        select_by: string;
    }

    interface GoogleIdentityInitializationOptions {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
    }

    interface GoogleIdentityRenderOptions {
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'large' | 'medium' | 'small';
        type?: 'standard' | 'icon';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        logo_alignment?: 'left' | 'center';
        width?: number;
        locale?: string;
    }

    interface GoogleAccountsId {
        initialize: (options: GoogleIdentityInitializationOptions) => void;
        prompt: () => void;
        renderButton: (parent: HTMLElement, options: GoogleIdentityRenderOptions) => void;
        disableAutoSelect: () => void;
    }

    interface GoogleAccounts {
        id: GoogleAccountsId;
    }

    interface Google {
        accounts: GoogleAccounts;
    }

    interface Window {
        google: {
            accounts: {
                id: {initialize: (config: any) => void;
                renderButton: (element: HTMLElement, options: any) => void;
                prompt: () => void;
                disableAutoSelect: () => void;} // or the real type if you prefer
                oauth2: {
                    initTokenClient: (config: {
                        client_id: string;
                        scope: string;
                        callback: (response: { access_token: string; }) => void;
                    }) => {
                        requestAccessToken: () => void;
                    };
                };
            };
        };
      }
}
