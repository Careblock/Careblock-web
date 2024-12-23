import { Bill, Results } from '@/types/result.type';
import HttpService from './http/http.service';

class _ResultService {
    public getByAppointmentID(appointmentId: string) {
        return HttpService.get<Results[]>(`/result/get-by-appointment/${appointmentId}`);
    }

    public getBill(appointmentId: string) {
        return HttpService.get<Bill>(`/result/get-bill/${appointmentId}`);
    }
}

const ResultService = new _ResultService();

export default ResultService;
