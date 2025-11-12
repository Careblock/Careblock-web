import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageview } from '@/utils/analytics';

// Wrapper component to track page views
const PageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        pageview(location.pathname + location.search);
    }, [location]);

    return <Outlet />;
};

export default PageTracker;
