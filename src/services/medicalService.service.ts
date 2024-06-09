import { MedicalServices } from '@/types/medical-services.type';
import HttpService from './http/http.service';

class _MedicalService {
    public filterByOrganization(organizationID: string) {
        return HttpService.get<MedicalServices[]>(`/MedicalService/filter-by-organization/${organizationID}`);
    }
}

const MedicalService = new _MedicalService();

export default MedicalService;
