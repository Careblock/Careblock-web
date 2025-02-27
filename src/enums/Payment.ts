export enum PAYMENT_STATUS_NAME {
    UNPAID = 'Unpaid',
    PAID = 'Paid',
}

export enum PAYMENT_STATUS {
    UNPAID = 1,
    PAID = 2,
}

export const paymentMethods = [
    {
        label: PAYMENT_STATUS_NAME.UNPAID,
        value: PAYMENT_STATUS.UNPAID,
    },
    {
        label: PAYMENT_STATUS_NAME.PAID,
        value: PAYMENT_STATUS.PAID,
    },
];
