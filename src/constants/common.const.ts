import { LoginInitialValues, SignUpInitialValues } from '../types/auth.type';

export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const DEFAULT_MINUTES_SECONDS_FORMAT = 'mm:ss';
export const REFRESH_TOKEN_KEY = '';

export const CONFIRM_TYPE = {
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgotPassword',
};

export const REF = {
    PASSSWORD: 'password',
    NEWPASSWORD: 'newPassword',
};

export const localStorageKeys = {
    USER_TOKEN: 'access_token',
    USER_INFO: 'user_info',
};

export const INITIAL_VALUES = {
    SEARCH: { q: '' },
    REGISTER: {
        stakeId: '',
        firstname: '',
        lastname: '',
        dateOfBirth: '',
        gender: 1,
        email: '',
        identityId: '',
        bloodType: 1,
        organizationId: '',
        phone: '',
        role: 1,
        seniority: 0,
        avatar: '',
    } as SignUpInitialValues,
    LOGIN: { email: '', password: '' } as LoginInitialValues,
    FORGOT_PASSWORD: { email: '' },
    CHANGE_PASSWORD: { newPassword: '', confirmPassword: '' },
    EDIT_PROFILE_PATIENT: {
        stakeId: '',
        firstname: '',
        lastname: '',
        dateOfBirth: '',
        gender: 1,
        email: '',
        identityId: '',
        bloodType: 1,
        phone: '',
        role: 1,
        avatar: '',
    } as SignUpInitialValues,
    CHANGE_PASSWORD_PROFILE: { oldPassword: '', newPassword: '', confirmPassword: '' },
};
