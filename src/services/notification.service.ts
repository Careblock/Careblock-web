import { Notifications } from '@/types/notification.type';
import HttpService from './http/http.service';

class _NotificationService {
    public getByUserId(userId: string) {
        return HttpService.get<Notifications[]>(`/notification/get-by-user/${userId}`);
    }

    public updateIsRead(id: string) {
        return HttpService.put<Notifications>(`/notification/update-read/${id}`);
    }

    public insert(notification: Notifications) {
        return HttpService.post<string>(`/notification/create`, { body: { ...notification } });
    }

    public decline(id: string) {
        return HttpService.post<boolean>(`/notification/decline/${id}`);
    }
}

const NotificationService = new _NotificationService();

export default NotificationService;
