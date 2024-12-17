import { catchError, finalize, map, Observable, of, Subject, throwError } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { HttpMethod, HttpOptions, ProgressOptions, RequestContentType } from './http.type';
import { isNullOrUndefined, nullSafetyJSONStringify, resolveUri } from '../../utils/common.helpers';
import { localStorageKeys } from '../../constants/common.const';
import { addToast } from '@/components/base/toast/toast.service';
import { SystemMessage } from '../../constants/message.const';
import { isStringEmpty } from '../../utils/string.helper';
import { getCookieHelper } from '../../utils/cookie.helper';
import StorageService from '../storage.service';

class _HttpService {
    public isRequesting$ = new Subject<boolean>();
    public onError$ = new Subject<any>();

    private _commonHeader = {
        'Content-Type': 'application/json',
    };

    public get<T>(uri: string, options?: HttpOptions): Observable<T> {
        return this.request(uri, HttpMethod.GET, options);
    }

    public post<T>(uri: string, options?: HttpOptions): Observable<T> {
        return this.request(uri, HttpMethod.POST, options);
    }

    public put<T>(uri: string, options?: HttpOptions): Observable<T> {
        return this.request(uri, HttpMethod.PUT, options);
    }

    public patch<T>(uri: string, options?: HttpOptions): Observable<T> {
        return this.request(uri, HttpMethod.PATCH, options);
    }

    public delete<T>(uri: string, options?: HttpOptions): Observable<T> {
        return this.request(uri, HttpMethod.DELETE, options);
    }

    public requestUpload<T>(
        uri: string,
        method = HttpMethod.POST,
        progressHandler: (ajaxResponse: AjaxResponse<any>) => void,
        options?: HttpOptions
    ): Observable<T> {
        const headers = {
            ...options?.headers,
            'Content-Type': 'application/octet-stream',
        };

        const newOptions: HttpOptions = {
            ...options,
            headers,
            requestContentType: RequestContentType.BINARY_STREAM,
        };

        return this.request(uri, method, newOptions, {
            includeUploadProgress: true,
            progressHandler,
        });
    }

    public requestDownload(uri: string, options?: HttpOptions) {
        const token = this.getAccessToken();
        const url = resolveUri(uri);

        return ajax({
            url,
            method: HttpMethod.GET,
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                ...options?.headers,
            },
            responseType: 'blob' as 'json',
        });
    }

    private request<T>(
        uri: string,
        method: string,
        options?: HttpOptions,
        progressOptions?: ProgressOptions
    ): Observable<T> {
        let isLoading = true;

        if (typeof options?.isLoading === 'boolean') {
            isLoading = options.isLoading;
        }

        const token = this.getAccessToken();

        let url = resolveUri(uri);

        if (options?.queryParams) {
            url = url + '?' + this.generateHttpParams(options?.queryParams);
        }

        let body: any = nullSafetyJSONStringify(this.buildBodyData(options?.body));

        if (options?.requestContentType) {
            switch (options?.requestContentType) {
                case RequestContentType.MULTIPART:
                    body = this.buildFormData(options?.body);
                    break;
                case RequestContentType.BINARY_STREAM:
                    body = options.body;
                    break;
            }
        }

        isLoading && this.isRequesting$.next(true);

        return ajax({
            url,
            method,
            body,
            headers: {
                ...(options?.requestContentType === RequestContentType.MULTIPART
                    ? { Accept: 'application/json' }
                    : this._commonHeader),
                Authorization: token ? `Bearer ${token}` : '',
                ...options?.headers,
            },
            includeUploadProgress: progressOptions?.includeUploadProgress,
            withCredentials: true,
        }).pipe(
            map((ajaxResponse) => {
                progressOptions?.progressHandler && progressOptions?.progressHandler(ajaxResponse);

                return this.handleResponse<T>(ajaxResponse);
            }),
            catchError((error): Observable<any> => {
                this.onError$.next(error);
                const message = (error?.response?.errors || error?.response?.message) ?? SystemMessage.UNKNOWN_ERROR;

                addToast({ text: message, status: 'inValid' });

                if (process.env.NODE_ENV === 'development') {
                    isLoading && this.isRequesting$.next(false);
                    return of({ message, isError: true });
                }

                return throwError(() => error);
            }),
            finalize(() => {
                isLoading && this.isRequesting$.next(false);
            })
        );
    }

    protected buildBodyData(data: any) {
        return data || Object.create(null);
    }

    protected buildFormData(data: any) {
        const formData = new FormData();

        for (const key in data) {
            if (data[key]) {
                if (data[key] instanceof File) {
                    formData.append(key, data[key], data[key].name);
                } else if (Array.isArray(data[key])) {
                    for (const item of data[key]) {
                        formData.append(key, item);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            }
        }

        return formData;
    }

    public handleResponse<T>(ajaxResponse: AjaxResponse<any>): T {
        return ajaxResponse.response.data;
    }

    // private refreshToken(): Observable<any> {
    //     const refreshToken = StorageService.get(REFRESH_TOKEN_KEY);

    //     if (!refreshToken) {
    //         return throwError(() => new Error('Refresh token is missing.'));
    //     }

    //     const url = `${Environment.BASE_API}/refresh-token`;

    //     const headers = {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${refreshToken}`,
    //     };

    //     return ajax({
    //         url,
    //         method: HttpMethod.POST,
    //         headers,
    //     }).pipe(
    //         map((ajaxResponse) => ajaxResponse.response),
    //         catchError((): Observable<any> => {
    //             // Xử lý lỗi refresh token, có thể đưa người dùng đến trang đăng nhập lại.
    //             return throwError(() => new Error('Failed to refresh token.'));
    //         })
    //     );
    // }

    private generateHttpParams(params: object) {
        const httpParams: string[] = [];
        const objectToQueryString = (obj: object, prefix?: any) => {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const k = prefix ? prefix + '[' + key + ']' : key;
                    const v = (obj as any)[key];

                    if (Array.isArray(v)) {
                        for (const vv of v) {
                            httpParams.push(k + '=' + vv);
                        }
                    } else if (v !== null && typeof v === 'object') {
                        objectToQueryString(v, k);
                    } else {
                        if (!isNullOrUndefined(v) && !isStringEmpty(v.toString())) {
                            httpParams.push(k + '=' + v);
                        }
                    }
                }
            }
        };

        objectToQueryString(params);

        return encodeURI(httpParams.join('&'));
    }

    public getAccessToken() {
        return (
            getCookieHelper(localStorageKeys.USER_TOKEN) ??
            StorageService.get(localStorageKeys.USER_TOKEN) ??
            StorageService.getSession(localStorageKeys.USER_TOKEN)
        );
    }
}

const HttpService = new _HttpService();

export default HttpService;
