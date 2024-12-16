import HttpService from './http/http.service';
import { ExaminationTypes } from '@/types/examinationType.type';
import { RequestContentType } from './http/http.type';

class _ExaminationTypeService {
    public getAll() {
        return HttpService.get<ExaminationTypes[]>('/examinationType/get-all');
    }

    public getByUserId(userId: string) {
        return HttpService.get<ExaminationTypes[]>(`/examinationType/get-by-user/${userId}`);
    }

    public insert(examinationType: ExaminationTypes) {
        return HttpService.post<string>(`/examinationType/create`, {
            body: { ...examinationType },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public update(id: number, examinationType: ExaminationTypes) {
        return HttpService.put<ExaminationTypes>(`/examinationType/${id}`, {
            body: { ...examinationType },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: number) {
        return HttpService.delete<string>(`/examinationType/${id}`);
    }
}

const ExaminationTypeService = new _ExaminationTypeService();

export default ExaminationTypeService;
