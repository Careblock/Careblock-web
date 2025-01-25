import { ExposeData } from '@/pages/appointment/second-step/second-step.type';
import { getStandardNumber } from './number.helper';

export const formatStandardDateTime = (date: Date) => {
    return `${date.getFullYear()}-${getStandardNumber(date.getMonth() + 1)}-${getStandardNumber(date.getDate())} ${getStandardNumber(date.getHours())}:${getStandardNumber(date.getMinutes())}:${getStandardNumber(date.getSeconds())}`;
};

export const displayStandardDateTime = (date: Date) => {
    return `${getStandardNumber(date.getMonth() + 1)}/${getStandardNumber(date.getDate())}/${date.getFullYear()} ${getStandardNumber(date.getHours())}:${getStandardNumber(date.getMinutes())}`;
};

export const formatStandardDate = (date: Date) => {
    return `${getStandardNumber(date.getMonth() + 1)}/${getStandardNumber(date.getDate())}/${date.getFullYear()}`;
};

export const formatHyphenDate = (date: Date) => {
    return `${date.getFullYear()}-${getStandardNumber(date.getMonth() + 1)}-${getStandardNumber(date.getDate())}`;
};

export const formattedDate = (date: any) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};

export const convertSeparateToDateTime = (scheduleData: ExposeData) => {
    const tempDate = scheduleData.date!.format('YYYY-MM-DD').toString();
    const tempStartTime = scheduleData.time.split(' - ')[0];
    const tempEndTime = scheduleData.time.split(' - ')[1];
    let startDate = new Date(tempDate);
    let endDate = new Date(tempDate);
    startDate.setHours(+tempStartTime.split(':')[0]);
    endDate.setHours(+tempEndTime.split(':')[0]);
    startDate.setUTCHours(startDate.getUTCHours() + 7);
    endDate.setUTCHours(endDate.getUTCHours() + 7);

    return {
        startDate: new Date(formatStandardDateTime(startDate)).toISOString(),
        endDate: new Date(formatStandardDateTime(endDate)).toISOString(),
    };
};

export const formatDateToString  = (date: Date) : string => {

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${year}_${day}_${month}_${hour}_${minute}`;
}