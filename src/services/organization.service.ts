import { Organizations } from '@/types/organization.type';
import HttpService from './http/http.service';

class _OrganizationService {
    public getAllOrganization() {
        return HttpService.get<Organizations[]>('/organization/get-all');
    }
}

const OrganizationService = new _OrganizationService();

export default OrganizationService;
