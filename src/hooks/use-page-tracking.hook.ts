import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from '@/utils/analytics';

// Custom hook to track page views on route changes
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        pageview(location.pathname + location.search);
    }, [location]);
};
