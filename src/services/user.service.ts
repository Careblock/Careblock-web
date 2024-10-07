import { ChangePasswordProfileRequest, User } from '@/types/auth.type';
import { ConfirmResponse } from '@/types/response.type';
import HttpService from './http/http.service';

class _UserService {
    public getAll(data: any) {
        return HttpService.get<any>(`/users/get-all`, { queryParams: { ...data }, isLoading: false });
    }

    public update(id: string, body: any) {
        return HttpService.put<User>(`/users/update/${id}`, {
            body,
        });
    }

    public changePassword(changePasswordReq: ChangePasswordProfileRequest) {
        return HttpService.post<ConfirmResponse>('/auth/change-password', {
            body: { ...changePasswordReq },
        });
    }
}
const UserService = new _UserService();

export default UserService;
