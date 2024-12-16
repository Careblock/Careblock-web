import { AppAction } from '@/types/action.type';
import { NotificationActionType, NotificationState } from './notification.type';

export default function notificationReducer(
    state: NotificationState = initialState,
    action: AppAction
): NotificationState {
    switch (action.type) {
        case NotificationActionType.CONNECT:
            return {
                ...state,
                connection: action.payload?.connection,
            };
        case NotificationActionType.DISCONNECT:
            return initialState;
        default:
            return state;
    }
}

const initialState: NotificationState = {
    connection: undefined,
};
