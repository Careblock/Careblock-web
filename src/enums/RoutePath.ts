export enum PATHS {
    // Common
    DEFAULT = '/',
    HOME = '/home',
    // Auth
    REGISTER = '/register',
    LOGIN = '/login',
    LOGOUT = '/logout',
    FORGOT_PASSWORD = '/forgot-password',
    CHANGE_PASSWORD = '/change-password',
    CONFIRM = '/confirm',
    // Personal
    EDIT_PROFILE = '/user/edit-profile',
    CHANGE_PASSWORD_PROFILE = '/user/change-password-profile',
    // Doctor
    DOCTOR_SCHEDULE = '/doctor/schedule',
    // Patient
    APPOINTMENT = '/appointment/:step',
    APPOINTMENT_STEP1 = '/appointment/1',
    APPOINTMENT_STEP2 = '/appointment/2',
    APPOINTMENT_STEP3 = '/appointment/3',
    PATIENT_APPOINTMENT_HISTORY = '/patient/appointment-history',
    // Doctor manager
    MANAGER_PAGE = '/manager',
    ORGANIZATION_INFOR = '/organization',
    DEPARTMENT_MANAGEMENT = '/departments',
    TEAM_MEMBERS = '/team',
    INVITE_MEMBERS = '/invite-member',
    SPECIALIST = '/specialist',
    EXAMINATION_PACKAGE = '/examination-package',
    MEDICINES = '/medicines',
    APPOINTMENT_HISTORIES = '/appoiment-histories',
    // Super admin
    ORGANIZATION_ADMIN = '/organization-admin',
    DEPARTMENT_ADMIN = '/department-admin',
    SPECIALIST_ADMIN = '/specialist-admin',
    EXAMINATION_TYPE = '/examination-type-admin',
    EXAMINATION_PACKAGE_ADMIN = '/examination-package-admin',
    EXAMINATION_OPTIONS_ADMIN = '/examination-options-admin',
    TIME_SLOT_ADMIN = '/time-slot-admin',
    MEDICINE_TYPE_ADMIN = '/medicine-type-admin',
    MEDICINES_ADMIN = '/medicines-admin',
    PAYMENT_METHOD_ADMIN = '/payment-method-admin',
    // Error
    NOTFOUND = '*',
    FORBIDDEN = '/forbidden',
    // User information
    USER_INFO = '/user/info',
}
