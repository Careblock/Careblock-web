import HttpService from './http/http.service';
import { Specialists } from '@/types/specialist.type';
import { RequestContentType } from './http/http.type';

class _SpecialistService {
    public getByUserId(userId: string) {
        return HttpService.get<Specialists[]>(`/specialist/get-by-user/${userId}`);
    }

    public insert(specialists: Specialists) {
        return HttpService.post<string>(`/specialist/create`, {
            body: { ...specialists },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public assignSpecialist(userId: string, specialist: Specialists[]) {
        return HttpService.post<boolean>(`/specialist/assign-specialist/${userId}`, {
            body: {
                specialist,
            },
        });
    }

    public update(id: string, specialist: Specialists) {
        return HttpService.put<Specialists>(`/specialist/${id}`, {
            body: { ...specialist },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/specialist/${id}`);
    }
}

const SpecialistService = new _SpecialistService();

export default SpecialistService;
