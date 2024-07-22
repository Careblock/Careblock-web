import { AppAction } from '../../types/action.type';
import { AuthActionType, AuthState } from './auth.type';

const initialState: AuthState = {
    user: null,
    accessToken: '',
};

export default function authReducer(state: AuthState = initialState, action: AppAction): AuthState {
    switch (action.type) {
        case AuthActionType.STORE_AUTH:
            return {
                ...state,
                user: action.payload?.user,
                accessToken: action.payload?.accessToken,
            } as AuthState;
        case AuthActionType.CLEAR_AUTH:
            return initialState;
        default:
            return state;
    }
}
