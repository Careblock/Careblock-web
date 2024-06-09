export enum DataType {
    string,
    number,
}

export enum ROLES {
    PATIENT = 1,
    DOCTOR = 2,
    DOCTOR_MANAGER = 3,
    ADMIN = 4,
}

export enum GENDER {
    MALE = 1,
    FEMALE = 2,
    OTHER = 3,
}

export enum BLOODTYPE {
    A = 1,
    B = 2,
    AB = 3,
    O = 4,
}

export enum DIAGNOSTIC_STATUS {
    HEALTHY = 1,
    UNHEALTHY = 2,
    CRITICAL = 3,
    NORMAL = 4,
    PATHOLOGICAL = 5,
}

export enum ScheduleTabs {
    ACTIVE = '1',
    POSTPONED = '2',
    CHECKEDIN = '3',
}

export enum Option {
    ADD = 1,
    REMOVE = 2,
}
