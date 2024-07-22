export const getStandardNumber = (req: number) => (req > 9 ? req : `0${req}`);

export const isNumber = (value: any) => {
    return typeof value === 'number';
};

export function formatCurrency(number: number, locale = 'vi-VN', currency = 'VND') {
    if (typeof number !== 'number') {
        return 0;
    }

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    });

    return formatter.format(number);
}
