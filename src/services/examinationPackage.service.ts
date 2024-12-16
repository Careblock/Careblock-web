import { ExaminationPackages } from '@/types/examinationPackage.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _ExaminationPackageService {
    public getAll() {
        return HttpService.get<ExaminationPackages[]>(`/examinationPackage/get-all`);
    }

    public getByType(examinationTypeId: number) {
        return HttpService.get<ExaminationPackages[]>(`/examinationPackage/get-by-type/${examinationTypeId}`);
    }

    public getByTypeAndOrganization(type: number, organizationId: string) {
        return HttpService.get<ExaminationPackages[]>(
            `/examinationPackage/get-by-type-organization/${type}/${organizationId}`
        );
    }

    public getByOrganization(userId: string) {
        return HttpService.get<ExaminationPackages[]>(`/examinationPackage/get-by-organization/${userId}`);
    }

    public insert(examinationPackage: ExaminationPackages, userId: string) {
        return HttpService.post<string>(`/examinationPackage/create/${userId}`, {
            body: { ...examinationPackage },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public insertNew(examinationPackage: ExaminationPackages) {
        return HttpService.post<string>(`/examinationPackage/create`, {
            body: { ...examinationPackage },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: string, examinationPackage: ExaminationPackages) {
        return HttpService.put<ExaminationPackages>(`/examinationPackage/${id}`, {
            body: { ...examinationPackage },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/examinationPackage/${id}`);
    }
}

const ExaminationPackageService = new _ExaminationPackageService();

export default ExaminationPackageService;
