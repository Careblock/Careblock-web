import { ExaminationOptions } from '@/types/examinationOption.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _ExaminationOptionService {
    public getAll() {
        return HttpService.get<ExaminationOptions[]>(`/ExaminationOption/get-all`);
    }

    public getExaminationOption(patientId: string) {
        return HttpService.get<string>(`/ExaminationOption/get-file-by-patient/${patientId}`, {
            headers: {
                'Content-Disposition': 'attachment; filename=examination-result.pdf',
                'Content-Type': 'application/pdf',
            },
        });
    }

    public getByPackage(examinationPackageId: string) {
        return HttpService.get<ExaminationOptions[]>(`/ExaminationOption/get-by-package/${examinationPackageId}`);
    }

    public insert(result: ExaminationOptions) {
        return HttpService.post<string>(`/ExaminationOption/create`, {
            body: { ...result },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: string, examinationOption: ExaminationOptions) {
        return HttpService.put<ExaminationOptions>(`/ExaminationOption/${id}`, {
            body: { ...examinationOption },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/ExaminationOption/${id}`);
    }
}

const ExaminationOptionService = new _ExaminationOptionService();

export default ExaminationOptionService;
