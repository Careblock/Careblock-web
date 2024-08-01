export interface Notifications {
    id: string;
    accountId: string;
    notificationTypeId: number;
    message: string;
    link: string;
    isRead: boolean;
    createdDate: string;
}
