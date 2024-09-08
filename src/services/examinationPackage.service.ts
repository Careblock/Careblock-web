import { ExaminationPackages } from '@/types/examinationPackage.type';
import HttpService from './http/http.service';

class _ExaminationPackageService {
    public getByType(examinationTypeId: number) {
        return HttpService.get<ExaminationPackages[]>(`/examinationPackage/get-by-type/${examinationTypeId}`);
    }

    public getByTypeAndOrganization(type: number, organizationId: string) {
        return HttpService.get<ExaminationPackages[]>(
            `/examinationPackage/get-by-type-organization/${type}/${organizationId}`
        );
    }
}

const ExaminationPackageService = new _ExaminationPackageService();

export default ExaminationPackageService;
