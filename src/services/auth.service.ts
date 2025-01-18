import HttpService from './http/http.service';
import { AuthenticationRequest, LoginResponse, RegisterResponse, SignUpRequest } from '../types/auth.type';
import { ConfirmResponse } from '../types/response.type';
import { RequestContentType } from './http/http.type';

class _AuthService {
    public login(email: string, password: string) {
        return HttpService.post<LoginResponse>('/auth/login', {
            body: {
                email,
                password,
            },
        });
    }

    public register(signUpRequest: SignUpRequest) {
        return HttpService.post<RegisterResponse>('/Account/register', {
            body: { ...signUpRequest },
            requestContentType: RequestContentType.MULTIPART,
        });
    }

    public hasAccount(stakeId: string[]) {
        return HttpService.post<ConfirmResponse>(`/Account/has-account?stakeId=${stakeId}`);
    }

    public authenticate(request: AuthenticationRequest) {
        return HttpService.post<any>(`/Account/authenticate`, {
            body: { ...request },
            headers: {
                credentials: 'include',
            },
        });
    }

    public refreshToken() {
        return HttpService.post<any>(`/Account/refresh-token`, {
            requestContentType: RequestContentType.MULTIPART,
        });
    }
}

const AuthService = new _AuthService();

export default AuthService;
