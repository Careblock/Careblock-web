import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';
import { PaymentMethods } from '@/types/paymentMethods.type';

class _PaymentMethodService {
    public getAll() {
        return HttpService.get<PaymentMethods[]>('/paymentMethod/get-all');
    }

    public insert(paymentMethod: PaymentMethods) {
        return HttpService.post<string>(`/paymentMethod/create`, {
            body: { ...paymentMethod },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: number, paymentMethod: PaymentMethods) {
        return HttpService.put<PaymentMethods>(`/paymentMethod/${id}`, {
            body: { ...paymentMethod },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: number) {
        return HttpService.delete<string>(`/paymentMethod/${id}`);
    }
}

const PaymentMethodService = new _PaymentMethodService();

export default PaymentMethodService;
