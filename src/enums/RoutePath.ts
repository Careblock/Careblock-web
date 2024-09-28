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
    PATIENT_PAGE = '/patient',
    APPOINTMENT = '/appointment/:step',
    APPOINTMENT_STEP1 = '/appointment/1',
    APPOINTMENT_STEP2 = '/appointment/2',
    APPOINTMENT_STEP3 = '/appointment/3',
    PATIENT_INFO = '/patient/detail_info',
    PATIENT_APPOINTMENT_HISTORY = '/patient/appointment-history',
    // Doctor manager
    MANAGER_PAGE = '/manager',
    ORGANIZATION_INFOR = '/organization',
    DEPARTMENT_MANAGEMENT = '/departments',
    TEAM_MEMBERS = '/team',
    APPOINTMENT_HISTORIES = '/appoiment-histories',
    // Error
    NOTFOUND = '*',
}
