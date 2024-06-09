import { User } from '../../types/auth.type';

export interface AuthState {
    user: User | null;
    accessToken: string;
}

export enum AuthActionType {
    STORE_AUTH = 'auth/storeAuth',
    CLEAR_AUTH = 'auth/clearAuth',
}
