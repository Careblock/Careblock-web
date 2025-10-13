import { ReactElement } from 'react';

export interface Pagination {
    page?: number;
    size?: number;
    sortType?: string;
    text?: string;
}

export interface SocialMediaLink {
    platform: string;
    icon: ReactElement<any, any>;
    link: string;
}

export interface MenuSidebar {
    title: string;
    path: string;
}

export type FieldType = 'number' | 'text' | 'password' | 'date' | undefined;

export interface FormField {
    name: string;
    placeholder: string;
    type: string;
}

export interface Result<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: Error;
}
