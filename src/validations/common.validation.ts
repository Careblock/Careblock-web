import * as Yup from 'yup';

interface ValidationConfig {
    [key: string]: Yup.StringSchema<string | undefined> | any;
}

export const createValidation = (config: ValidationConfig) => {
    return Yup.object().shape(config);
};

export const minLengthValidation = (min: number, errorMessage: string): Yup.StringSchema<string | undefined> => {
    return Yup.string().min(min, errorMessage);
};

export const maxLengthValidation = (max: number, errorMessage: string): Yup.StringSchema<string | undefined> => {
    return Yup.string().max(max, errorMessage);
};

export const regexValidation = (pattern: RegExp, errorMessage: string): Yup.StringSchema<string | undefined> => {
    return Yup.string().matches(pattern, errorMessage);
};

export const requiredValidation = (errorMessage: string): Yup.StringSchema<string | undefined> => {
    return Yup.string().required(errorMessage);
};

export const confirmPasswordValidation = (ref: string, errorMessage: string): Yup.StringSchema<string | undefined> => {
    return Yup.string()
        .required(errorMessage)
        .oneOf([Yup.ref(ref)], errorMessage);
};
