import { MedicineTypes } from '@/types/medicineType.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _MedicineTypeService {
    public getAll() {
        return HttpService.get<MedicineTypes[]>('/medicineType/get-all');
    }

    public getByUserId(userId: string) {
        return HttpService.get<MedicineTypes[]>(`/medicineType/get-by-user/${userId}`);
    }

    public insert(medicineType: MedicineTypes) {
        return HttpService.post<string>(`/medicineType/create`, {
            body: { ...medicineType },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: number, medicineType: MedicineTypes) {
        return HttpService.put<MedicineTypes>(`/medicineType/${id}`, {
            body: { ...medicineType },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: number) {
        return HttpService.delete<string>(`/medicineType/${id}`);
    }
}

const MedicineTypeService = new _MedicineTypeService();

export default MedicineTypeService;
