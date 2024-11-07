import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _AppointmentDetailService {
    public insert(payload: any) {
        return HttpService.post<string>(`/AppointmentDetail/create`, {
            body: { ...payload },
            requestContentType: RequestContentType.MULTIPART,
        });
    }
}

const AppointmentDetailService = new _AppointmentDetailService();

export default AppointmentDetailService;
