import { JwtPayload, jwtDecode } from 'jwt-decode';

export const jwtIsValid = (token: string): boolean => {
    let res = false;
    try {
        const t = jwtDecode<JwtPayload>(token);
        const crt = new Date();
        const expJwt = expToDate(t.exp ?? 0);
        res = expJwt > crt;
    } catch {
        res = false;
    }

    return res;
};

function expToDate(exp: number): Date {
    const date = new Date(0);
    date.setUTCSeconds(exp);
    return date;
}
