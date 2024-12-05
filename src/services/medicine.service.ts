import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';
import { Medicines } from '@/types/medicine.type';

class _MedicineService {
    public getAll() {
        return HttpService.get<Medicines[]>(`/medicine/get-all`);
    }

    public getByType(medicineTypeId: number) {
        return HttpService.get<Medicines[]>(`/medicine/get-by-type/${medicineTypeId}`);
    }

    public getByTypeAndOrganization(type: number, organizationId: string) {
        return HttpService.get<Medicines[]>(`/medicine/get-by-type-organization/${type}/${organizationId}`);
    }

    public getByOrganization(userId: string) {
        return HttpService.get<Medicines[]>(`/medicine/get-by-organization/${userId}`);
    }

    public insert(medicine: Medicines, userId: string) {
        return HttpService.post<string>(`/medicine/create/${userId}`, {
            body: { ...medicine },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public insertNew(medicine: Medicines) {
        return HttpService.post<string>(`/medicine/create`, {
            body: { ...medicine },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: string, medicine: Medicines) {
        return HttpService.put<Medicines>(`/medicine/${id}`, {
            body: { ...medicine },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/medicine/${id}`);
    }
}

const MedicineService = new _MedicineService();

export default MedicineService;
