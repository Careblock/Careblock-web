import { Environment } from '../environment';

const cookiePrf = 'careblock_';

export function getCookieHelper(name: string): string | null {
    const nameEQ = `${cookiePrf}${name}` + '=';
    const listCookies = document.cookie.split(';');

    for (const element of listCookies) {
        let c = element;

        while (c.charAt(0) === ' ') c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

export function removeAllCookiesHelper(excludes: string[] = []) {
    const cookies = document.cookie.split(';');

    for (const element of cookies) {
        const [cookieName] = element.split('=');

        !excludes.includes(cookieName.trim()) && deleteCookieHelper(cookieName);
    }
}

export function deleteCookieHelper(cookieName: string) {
    const name = cookieName.startsWith(cookiePrf) ? cookieName : `${cookiePrf}${cookieName}`;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function replaceCookieHelper(cookieName: string, cookieValue: string) {
    const date = new Date();

    /** 12h */
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

    let cookieString = `${cookiePrf}${cookieName}=${cookieValue};expires=${date}; path=/`;

    if (Environment.ENV === 'production') {
        cookieString += `; domain=${Environment.BASE_DOMAIN}`;
    }

    document.cookie = cookieString;
}
