import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCookieHelper, removeAllCookiesHelper, replaceCookieHelper } from '../utils/cookie.helper';
import { AuthContextType, AuthProviderProps, LoginResponse, User } from '../types/auth.type';
import { localStorageKeys } from '../constants/common.const';
import useObservable from '../hooks/use-observable.hook';
import StorageService from '../services/storage.service';
import AuthService from '../services/auth.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { jwtIsValid } from '../utils/jwt.helper';
import { CookieManager } from '../utils/cookie';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<User | null>(null);
    const [token] = useState<string | null>(getCookieHelper(localStorageKeys.USER_TOKEN));

    const { removeCookie } = CookieManager();
    const { subscribeOnce } = useObservable();

    const startSession = useCallback(({ accessToken, user }: LoginResponse) => {
        replaceCookieHelper(localStorageKeys.USER_TOKEN, accessToken);
        setUserData(user);
    }, []);

    const setUser = (newUser: User) => {
        setUserData(newUser);
    };

    const endSession = useCallback(() => {
        setUserData(null);
        StorageService.remove(localStorageKeys.USER_INFO);
        removeCookie('stakeId');
        removeCookie('careblock_access_token');
        removeAllCookiesHelper();
    }, []);

    useEffect(() => {
        const isValid = jwtIsValid(token ?? '');
        const userInfo = StorageService.getObject(localStorageKeys.USER_INFO) as User;

        if (!isValid) {
            if (!token) {
                endSession();
                setIsLoading(false);
                return;
            }
            subscribeOnce(AuthService.refreshToken(), (res: any) => {
                if (res?.isError) {
                    endSession();
                    setIsLoading(false);
                    return;
                }
                const { jwtToken, ...rest } = res;
                startSession({ accessToken: res.jwtToken, user: rest });
                const user = jwtDecode<JwtPayload>(token || '') as User;
                setUserData(userInfo ?? user);
                setIsLoading(false);
                return;
            });
        }

        const user = jwtDecode<JwtPayload>(token ?? '') as User;
        setUserData(userInfo ?? user);
        setIsLoading(false);
    }, [token, endSession]);

    const value = useMemo(() => {
        return {
            userData,
            token,
            isLoading,
            setUser,
            startSession,
            endSession,
        };
    }, [userData, token, isLoading, startSession, endSession]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
