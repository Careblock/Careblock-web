import { AppAction } from '../../types/action.type';
import { LoginResponse } from '../../types/auth.type';
import { AuthActionType } from './auth.type';

export const storeUser = (user: LoginResponse): AppAction => {
    return {
        type: AuthActionType.STORE_AUTH,
        payload: { user },
    };
};

export const clearUser = (): AppAction => {
    return {
        type: AuthActionType.CLEAR_AUTH,
    };
};
