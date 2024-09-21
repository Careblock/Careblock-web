import { Organizations } from '@/types/organization.type';
import HttpService from './http/http.service';
import { RequestContentType } from './http/http.type';

class _OrganizationService {
    public getAllOrganization() {
        return HttpService.get<Organizations[]>('/organization/get-all');
    }

    public getByUserId(userId: string) {
        return HttpService.get<Organizations>(`/organization/get-by-user/${userId}`);
    }

    public update(id: string, org: Organizations) {
        return HttpService.put<Organizations>(`/organization/${id}`, {
            body: { ...org },
            requestContentType: RequestContentType.MULTIPART,
        });
    }
}

const OrganizationService = new _OrganizationService();

export default OrganizationService;
