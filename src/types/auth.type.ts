import { ReactNode } from 'react';
import { BLOODTYPE, GENDER, ROLES } from '../enums/Common';

export interface SignUpInitialValues {
    stakeId: string;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    gender: GENDER;
    email: string;
    identityId: string;
    bloodType: BLOODTYPE;
    phone: string;
    role: ROLES;
    avatar?: string;
    organizationId?: string;
    seniority?: number;
}

export interface SignUpRequest extends SignUpInitialValues {}

export interface RegisterResponse {
    status: boolean;
}

export interface LoginInitialValues {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface ChangePasswordInitialValues {
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordRequest {
    newPassword: string;
    confirmPassword: string;
    token: string;
}

export interface ChangePasswordProfileRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface User {
    [key: string]: any;
}

export interface AuthContextType {
    userData: User | null;
    isLoading: boolean;
    setUser: (user: User) => void;
    startSession: ({ accessToken, user }: LoginResponse) => void;
    endSession: () => void;
}
