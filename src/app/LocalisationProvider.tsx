'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';


export function Providers({ children }: { children: React.ReactNode; }) {
    const locale = enUS;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
            {children}
        </LocalizationProvider>
    );
}
