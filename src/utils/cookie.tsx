import Cookie from 'js-cookie';

export const CookieManager = () => {
    const setCookie = (cookiename: string, usrin: any) => {
        Cookie.set(cookiename, usrin, {
            expires: 1, // 1 day
            secure: true,
            sameSite: 'strict',
            path: '/',
        });
    };

    const getCookie = (cookiename: string) => {
        return Cookie.get(cookiename);
    };

    const removeCookie = (cookiename: string) => {
        Cookie.remove(cookiename);
    };

    return { setCookie, getCookie, removeCookie };
};
