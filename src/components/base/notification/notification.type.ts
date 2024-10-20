import { NotificationType } from '@/enums/NotificationType';

export interface NotificationItemType {
    isRead?: boolean;
    message: string;
    type: NotificationType;
    link?: string;
    onClickAccept?: Function;
    onClickDecline?: Function;
    onClickRead?: Function;
}
