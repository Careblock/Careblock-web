export const CookieManager = () => {
    const setCookie = (cookieName: string, value: any, expirationDays: number = 1) => {
        const expires = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; secure; samesite=strict`;
    };

    const getCookie = (cookieName: string): any | null => {
        const name = `${cookieName}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return JSON.parse(cookie.substring(name.length, cookie.length));
            }
        }
        return null;
    };

    const removeCookie = (cookieName: string) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    return { setCookie, getCookie, removeCookie };
};
