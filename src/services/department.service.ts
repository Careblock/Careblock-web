import HttpService from './http/http.service';
import { Departments } from '@/types/department.type';

class _DepartmentService {
    public getByOrganization(organizationId: string) {
        return HttpService.get<Departments[]>(`/department/get-by-organization/${organizationId}`);
    }

    public getByUserId(userId: string) {
        return HttpService.get<Departments[]>(`/department/get-by-user/${userId}`);
    }

    public insert(department: Departments) {
        return HttpService.post<string>(`/department/create`, {
            body: { ...department },
        });
    }

    public update(id: string, department: Departments) {
        return HttpService.put<string>(`/department/${id}`, {
            body: { ...department },
        });
    }

    public delete(id: string) {
        return HttpService.delete<string>(`/department/${id}`);
    }
}

const DepartmentService = new _DepartmentService();

export default DepartmentService;
