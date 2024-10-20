export interface Notifications {
    id?: string;
    accountId: string;
    originId?: string;
    notificationTypeId: number;
    message: string;
    link?: string;
    isRead?: boolean;
    createdDate?: string;
}
