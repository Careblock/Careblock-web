export enum SystemMessage {
    UNKNOWN_ERROR = "Something's wrong",
    REGISTER_SUCCESS = 'Register successfully!',
    HAS_ACCOUNT = 'You need to create a new account',
    ACCOUNT_EXISTED = 'The account was existed!',
    LOGIN_AGAIN = 'You need to login again!',
    LOGIN_SUCCESS = 'Login successfully!',
    VERIFY_SUCCESS = 'Verify successfully',
    CHANGE_PASSWORD_SUCCESS = 'Change password successfully',
    MAKE_AN_APPOINTMENT_SUCCESS = 'Successfully scheduled an appointment',
    INSERT_DIAGNOSTIC_SUCCESS = 'Successfully inserted a dianostic',
    EDIT_PROFILE = 'Edit profile successfully!',
    EDIT_ORGANIZATION = 'Edit organization successfully!',
    ADD_DEPARTMENT = 'Add new department successfully!',
    EDIT_DEPARTMENT = 'Edit department successfully!',
    DELETE_DEPARTMENT = 'Delete department successfully!',
    DELETE_DEPARTMENT_FAILED = 'Delete department failed!',
    REMOVE_FROM_ORGANIZATION_SUCCESS = 'Successfully remove the doctor',
    UPLOAD_RESULT = 'Upload examination result successfully!',
    AT_LEAST_ONE_ROLE = 'At least one role must be selected for the user',
    GRANT_SUCCESS = 'Grant permission successfully!',
    GRANT_FAILED = 'Grant permission failed!',
}
