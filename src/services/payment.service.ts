import { Payments } from '@/types/payment.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _PaymentService {
    public getAll() {
        return HttpService.get<Payments[]>('/payment/get-all');
    }

    public getPaidByAppointmentId(appointmentId: string) {
        return HttpService.get<Payments>(`/payment/get-paid-by-appointment/${appointmentId}`);
    }

    public insert(payment: Payments) {
        return HttpService.post<string>(`/payment/create`, {
            body: { ...payment },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: string, payment: Payments) {
        return HttpService.put<Payments>(`/payment/${id}`, {
            body: { ...payment },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public updateByAppointment(id: string, payment: Payments) {
        return HttpService.put<string>(`/payment/update-by-appointment/${id}`, {
            body: { ...payment },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/payment/${id}`);
    }
}

const PaymentService = new _PaymentService();

export default PaymentService;
