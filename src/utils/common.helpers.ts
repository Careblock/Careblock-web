import { DIAGNOSTIC_STATUS, GENDER } from '../enums/Common';
import { AccountSimple, Accounts } from '../types/account.type';
import { Patients } from '../types/patient.type';

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

export const getFullName = (account: Accounts | Patients | AccountSimple) => {
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
