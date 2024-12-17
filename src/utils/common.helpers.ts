import { TestResultEnum } from '@/enums/TestResultEnum';
import { DIAGNOSTIC_STATUS, GENDER } from '../enums/Common';
import { AccountSimple, Accounts } from '../types/account.type';
import { Patients } from '../types/patient.type';
import { Environment } from '@/environment';
import { Doctors } from '@/types/doctor.type';

export const nullSafetyJSONStringify = (obj: any): string => {
    return JSON.stringify(obj, (_, v) => (v === null ? undefined : v));
};

export function isNullOrUndefined(value: any) {
    return value === null || value === undefined;
}

export function scrollToTop() {
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
        }
    }, 15);
}

export const getFullName = (account: Accounts | Patients | AccountSimple | Doctors) => {
    return `${account?.firstname} ${account?.lastname}`;
};

export const getGenderName = (index: number) => Object.keys(GENDER).filter((key) => isNaN(Number(key)))[index - 1];

export const getDiagnosticStatusName = (index: number) =>
    Object.keys(DIAGNOSTIC_STATUS).filter((key) => isNaN(Number(key)))[index - 1];

export const getCityFromLocaltion = (location: string | undefined) => {
    if (!location) return;
    const locations = location.split(',');
    return locations[locations.length - 1];
};

export const getTestResult = (result: number): string => {
    if (result === -1) return TestResultEnum.Negative;
    return TestResultEnum.Positive;
};

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const numberToRoman = (num: number): string => {
    if (isNaN(num) || num < 1 || num > 3999) {
        return 'Số nhập vào không hợp lệ.';
    }

    const romanNumerals = [
        ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
        ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
        ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
        ['', 'M', 'MM', 'MMM'],
    ];

    let result = '';
    let digits = num.toString().split('').reverse();

    for (let i = 0; i < digits.length; i++) {
        result = romanNumerals[i][parseInt(digits[i])] + result;
    }

    return result;
};

export const resolveUri = (uri: string) => {
    if (/^(http|https):\/\/.+$/.test(uri)) {
        return uri;
    }

    return `${Environment.BASE_API}${uri}`;
};
