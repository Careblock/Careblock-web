import { AppAction } from '@/types/action.type';
import { NotificationActionType } from './notification.type';

export const connect = (connection: any): AppAction => {
    return {
        type: NotificationActionType.CONNECT,
        payload: { connection },
    };
};

export const disconnect = (): AppAction => {
    return {
        type: NotificationActionType.DISCONNECT,
    };
};
