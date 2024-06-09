import { ComponentType, ReactElement } from 'react';

export interface Pagination {
    page?: number;
    size?: number;
    sortType?: string;
    text?: string;
}

export type ChangeTypeOfKeys<T extends object, Keys extends keyof T, NewType> = {
    [key in keyof T]: key extends Keys ? NewType : T[key];
};

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

export type ExtractPropsFromComponent<C> = C extends ComponentType<infer P> ? P : any;
