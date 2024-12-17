export const REGEX = {
    firstname: /^[\d\w]+$/,
    LASTNAME: /^[\d\w]+$/,
    USERNAME: /^[\d\w]+$/,
    PHONE_NUMBER: /^[0-9]{10}$/,
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PRICE: /^[1-9]\d{0,2}(,\d{3})*(\.\d{1,2})?$/,
    COUPON: /^(0*(\d{1,2})|100)(\.\d{1,2})?$/,
    AGE: /^(?:[1-9]|[1-9][0-9]|1[01][0-9]|110)$/,
    NUMBER: /^[0-9]+$/,
};
