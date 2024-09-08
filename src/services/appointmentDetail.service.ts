import { AppointmentDetails } from '@/types/appointmentDetail.type';
import HttpService from './http/http.service';

class _AppointmentDetailService {
    public insert(diagnostic: AppointmentDetails) {
        return HttpService.post<string>(`/AppointmentDetail/create`, { body: { ...diagnostic } });
    }
}

const DiagnosticService = new _AppointmentDetailService();

export default DiagnosticService;
