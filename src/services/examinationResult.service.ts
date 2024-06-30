import { ExaminationResults } from '@/types/examinationResult.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _ExaminationResultService {
    public insert(result: ExaminationResults) {
        return HttpService.post<string>(`/ExaminationResult/create`, {
            body: { ...result },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public getExaminationResult(patientId: string) {
        return HttpService.get<string>(`/ExaminationResult/get-file-by-patient/${patientId}`, {
            headers: {
                'Content-Disposition': 'attachment; filename=examination-result.pdf',
                'Content-Type': 'application/pdf',
            },
        });
    }
}

const ExaminationResultService = new _ExaminationResultService();

export default ExaminationResultService;
