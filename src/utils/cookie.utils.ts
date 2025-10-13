/**
 * Cookie utility functions for CareBlock application
 */

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

/**
 * Set a cookie with optional expiration
 * @param name Cookie name
 * @param value Cookie value
 * @param days Days until expiration (optional)
 */
export const setCookie = (name: string, value: string, days?: number): void => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
};

/**
 * Remove a cookie by name
 * @param name Cookie name
 */
export const removeCookie = (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

/**
 * Get the user's stake ID from cookies
 * @returns Stake ID string or null if not found
 */
export const getStakeIdFromCookies = (): string | null => {
    const rawStakeId = getCookie('stakeId');
    if (!rawStakeId) {
        return null;
    }

    try {
        // Decode URL encoded string
        const decodedStakeId = decodeURIComponent(rawStakeId);
        
        // If it's a JSON array string, parse and extract the first element
        if (decodedStakeId.startsWith('[') && decodedStakeId.endsWith(']')) {
            const parsed = JSON.parse(decodedStakeId);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed[0];
            }
        }
        
        // If it's already a clean string, return as is
        return decodedStakeId;
    } catch (error) {
        console.error('Error parsing stake ID from cookies:', error);
        // Fallback: try to extract stake ID using regex
        const match = rawStakeId.match(/stake_test1[a-z0-9]+|stake1[a-z0-9]+/);
        return match ? match[0] : null;
    }
};

/**
 * Check if user is logged in by checking for stake ID in cookies
 * @returns Boolean indicating if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
    return getStakeIdFromCookies() !== null;
};