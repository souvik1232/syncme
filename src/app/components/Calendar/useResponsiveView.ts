// components/Calendar/useResponsiveView.ts
import { useEffect, useState } from 'react';

export function useResponsiveView() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return isMobile;
}
