import { GENDER, ROLES } from '@/enums/Common';
import { LoginInitialValues, SignUpInitialValues } from '../types/auth.type';

export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const DEFAULT_MINUTES_SECONDS_FORMAT = 'mm:ss';
export const REFRESH_TOKEN_KEY = '';

export const GenderList: string[] = ['Male', 'Female', 'Other'];

export const REF = {
    PASSSWORD: 'password',
    NEWPASSWORD: 'newPassword',
};

export const localStorageKeys = {
    USER_TOKEN: 'access_token',
    USER_INFO: 'user_info',
};

export const INITIAL_USER_VALUES = {
    SEARCH: { q: '' },
    REGISTER: {
        departmentId: '',
        organizationId: '',
        stakeId: '',
        firstname: '',
        lastname: '',
        dateOfBirth: '',
        gender: GENDER.MALE,
        identityId: '',
        phone: '',
        email: '',
        role: ROLES.PATIENT,
        avatar: '',
        seniority: 0,
        description: '',
    } as SignUpInitialValues,
    LOGIN: { email: '', password: '' } as LoginInitialValues,
    FORGOT_PASSWORD: { email: '' },
    CHANGE_PASSWORD: { newPassword: '', confirmPassword: '' },
    EDIT_PROFILE_PATIENT: {
        departmentId: '',
        stakeId: '',
        firstname: '',
        lastname: '',
        dateOfBirth: '',
        gender: GENDER.MALE,
        identityId: '',
        phone: '',
        email: '',
        role: ROLES.PATIENT,
        avatar: '',
        seniority: 0,
        description: '',
    } as SignUpInitialValues,
    CHANGE_PASSWORD_PROFILE: { oldPassword: '', newPassword: '', confirmPassword: '' },
};
