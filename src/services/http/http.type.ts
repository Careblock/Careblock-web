import { AjaxResponse } from 'rxjs/ajax';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export enum RequestContentType {
    MULTIPART = 1,
    BINARY_STREAM = 2,
}

export interface HttpOptions {
    queryParams?: Record<string, ParamTypes>;
    body?: Record<string, unknown> | FormData | File;
    headers?: Record<string, unknown>;
    requestContentType?: RequestContentType;
    isLoading?: boolean;
}

type ParamTypes = number | string | string[] | undefined | { [key: string]: any };

type JsonType = string | number | boolean | object | any[] | null | any;

export interface DataSet {
    [key: string]: JsonType;
}

export interface ResponsePagination {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
}

export type PaginateSearchValue = string | number | boolean | any[];

export interface PaginationOption {
    page?: number;
    perPage?: number;
    total?: number;
    equal?: { [key: string]: PaginateSearchValue };
    like?: { [key: string]: PaginateSearchValue };
    sort?: string;
    in?: { [key: string]: PaginateSearchValue[] };
}

export interface ResponseResult {
    data: DataSet | DataSet[];
    pagination?: ResponsePagination;
}

export interface CoreResponse {
    status: number;
    message: string;
    result?: ResponseResult | DataSet;
}

export interface ProgressOptions {
    includeUploadProgress: boolean;

    progressHandler: (ajaxResponse: AjaxResponse<any>) => void;
}
