// Google Analytics utility functions

declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: Record<string, unknown>
        ) => void;
        dataLayer?: unknown[];
    }
}

export const GA_TRACKING_ID = 'G-2JT1XGVVK1';

// Track page views
export const pageview = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    }
};

// Track custom events
export const event = (action: string, params?: Record<string, unknown>) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, params);
    }
};

// Track exceptions
export const exception = (description: string, fatal = false) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'exception', {
            description,
            fatal,
        });
    }
};

// Track custom user properties
export const setUserProperties = (properties: Record<string, unknown>) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('set', 'user_properties', properties);
    }
};
