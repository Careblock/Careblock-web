import HttpService from './http/http.service';
import { Departments } from '@/types/department.type';

class _DepartmentService {
    public getByOrganization(organizationId: string) {
        return HttpService.get<Departments[]>(`/department/get-by-organization/${organizationId}`);
    }
}

const DepartmentService = new _DepartmentService();

export default DepartmentService;
