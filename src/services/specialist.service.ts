import HttpService from './http/http.service';
import { Specialists } from '@/types/specialist.type';

class _SpecialistService {
    public getByUserId(userId: string) {
        return HttpService.get<Specialists[]>(`/specialist/get-by-user/${userId}`);
    }

    public assignSpecialist(userId: string, specialist: Specialists[]) {
        return HttpService.post<boolean>(`/specialist/assign-specialist/${userId}`, {
            body: {
                specialist,
            },
        });
    }
}

const SpecialistService = new _SpecialistService();

export default SpecialistService;
