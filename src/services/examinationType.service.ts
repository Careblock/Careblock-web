import HttpService from './http/http.service';
import { ExaminationTypes } from '@/types/examinationType.type';

class _ExaminationTypeService {
    public getAll() {
        return HttpService.get<ExaminationTypes[]>('/examinationType/get-all');
    }
}

const ExaminationTypeService = new _ExaminationTypeService();

export default ExaminationTypeService;
