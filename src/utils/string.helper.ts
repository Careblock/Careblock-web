import { isNullOrUndefined } from './common.helpers';

export const getNotNullString = (value: string | undefined, defaultValue: string) => {
    return value ? value : defaultValue;
};

const isString = (value: any): boolean => {
    return typeof value === 'string' || value instanceof String;
};

const isStringEmpty = (value: string): boolean => {
    return isNullOrUndefined(value) || value.trim() === '';
};

const titleCase = (str: string): string => {
    const splitStr = str.toLowerCase().split(/\s+/g);

    for (let i = 0; i < splitStr.length; i++) {
        const word = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);

        splitStr[i] = word;
    }

    return splitStr.join(' ');
};

function removeDotsAndCommas(input: string | number): string | number {
    if (typeof input === 'string') {
        return input.replace(/[.,]/g, '');
    }

    return input;
}

function formatString(str: string, ...values: string[]) {
    return str.replace(/\{(\d+)\}/g, (_, index) => {
        return values[parseInt(index)];
    });
}

export { isString, isStringEmpty, titleCase, removeDotsAndCommas, formatString };
