export interface NotificationState {
    connection: any;
}

export enum NotificationActionType {
    CONNECT = 'notification/connect',
    DISCONNECT = 'notification/disconnect',
}
