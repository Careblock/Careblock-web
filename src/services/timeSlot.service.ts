import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';
import { TimeSlots } from '@/types/timeSlot.type';

class _TimeSlotService {
    public getAll() {
        return HttpService.get<TimeSlots[]>(`/timeSlot/get-all`);
    }

    public insert(timeSlot: TimeSlots) {
        return HttpService.post<string>(`/timeSlot/create`, {
            body: { ...timeSlot },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: string, timeSlot: TimeSlots) {
        return HttpService.put<TimeSlots>(`/timeSlot/${id}`, {
            body: { ...timeSlot },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/timeSlot/${id}`);
    }
}

const TimeSlotService = new _TimeSlotService();

export default TimeSlotService;
