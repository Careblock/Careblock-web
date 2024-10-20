import { ExaminationOptions } from '@/types/examinationOption.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _ExaminationOptionService {
    public getExaminationOption(patientId: string) {
        return HttpService.get<string>(`/ExaminationOption/get-file-by-patient/${patientId}`, {
            headers: {
                'Content-Disposition': 'attachment; filename=examination-result.pdf',
                'Content-Type': 'application/pdf',
            },
        });
    }

    public insert(result: ExaminationOptions) {
        return HttpService.post<string>(`/ExaminationOption/create`, {
            body: { ...result },
            requestContentType: RequestContentType.MULTIPART,
        });
    }
}

const ExaminationOptionService = new _ExaminationOptionService();

export default ExaminationOptionService;
