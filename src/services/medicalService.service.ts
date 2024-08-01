import { Medicines } from '@/types/medicine.type';
import HttpService from './http/http.service';

class _MedicineService {
    public filterByOrganization(organizationID: string) {
        return HttpService.get<Medicines[]>(`/medicine/filter-by-organization/${organizationID}`);
    }
}

const MedicalService = new _MedicineService();

export default MedicalService;
