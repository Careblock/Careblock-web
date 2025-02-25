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
    INSERT_DIAGNOSTIC_FAILED = 'Insert the dianostic failed',
    UPLOAD_FILE_FAILED = 'Uploaded failed!',
    EDIT_PROFILE = 'Edit profile successfully!',
    EDIT_ORGANIZATION = 'Edit organization successfully!',
    ADD_DEPARTMENT = 'Add new department successfully!',
    EDIT_DEPARTMENT = 'Edit department successfully!',
    DELETE_DEPARTMENT = 'Remove doctor successfully!',
    DELETE_DEPARTMENT_FAILED = 'Remove doctor failed!',
    REMOVE_FROM_ORGANIZATION_SUCCESS = 'Successfully remove the doctor',
    UPLOAD_RESULT = 'Upload examination result successfully!',
    AT_LEAST_ONE_ROLE = 'At least one role must be selected for the user',
    GRANT_SUCCESS = 'Grant permission successfully!',
    GRANT_FAILED = 'Grant permission failed!',
    ADD_EXAMINATION_TYPE = 'Add new examination type successfully!',
    ADD_MEDICINE_TYPE = 'Add new medicine type successfully!',
    ADD_PAYMENT_METHOD = 'Add new payment method successfully!',
    ADD_EXAMINATION_PACKAGE = 'Add new examination package successfully!',
    ASSIGNED_DOCTOR = 'Assigned doctor to appoinment successfully!',
    ADD_EXAMINATION_OPTION = 'Add new examination option successfully!',
    ADD_TIME_SLOT = 'Add new time slot successfully!',
    ADD_MEDICINE = 'Add new medicine successfully!',
    EDIT_EXAMINATION_TYPE = 'Edit examination type successfully!',
    EDIT_MEDICINE_TYPE = 'Edit medicine type successfully!',
    EDIT_PAYMENT_METHOD = 'Edit payment method successfully!',
    EDIT_EXAMINATION_PACKAGE = 'Edit examination package successfully!',
    EDIT_EXAMINATION_OPTION = 'Edit examination option successfully!',
    EDIT_TIME_SLOT = 'Edit time slot successfully!',
    EDIT_MEDICINE = 'Edit medicine successfully!',
    DELETE_EXAMINATION_TYPE = 'Delete examination type successfully!',
    DELETE_MEDICINE_TYPE = 'Delete medicine type successfully!',
    DELETE_PAYMENT_METHOD = 'Delete payment method successfully!',
    DELETE_EXAMINATION_PACKAGE = 'Delete examination package successfully!',
    DELETE_EXAMINATION_OPTION = 'Delete examination option successfully!',
    DELETE_TIME_SLOT = 'Delete time slot successfully!',
    DELETE_MEDICINE = 'Delete medicine successfully!',
    ADD_SPECIALIST = 'Add new specialist successfully!',
    ADD_ORGANIZATION = 'Add new organization successfully!',
    DELETE_SPECIALIST = 'Delete specialist successfully!',
    DELETE_ORGANIZATION = 'Delete organization successfully!',
    LACK_OF_PACKAGE = 'Examination package is required',
    EDIT_SPECIALIST = 'Update specialist successfully!',
    EDIT_ORGANIZATIONS = 'Update organization successfully!',
    EDIT_SPECIALIST_FAILED = 'Update specialist failed!',
    INVITE_MEMBER = 'Invitation sent successfully!',
    SEND_RESULT = 'Send result successfully!',
    SEND_RESULT_FAILED = 'Failed to send result, please try again later!',
    SEND_BILL = 'Send bill successfully!',
    JOIN_ORG = 'Participate in organization successfully!',
    JOIN_ORG_FAILED = 'Participate in organization failed!',
    EXAMINATION_REQUIRED = 'Examination Option is required!',
    EXAMINATION_TYPE_REQUIRED = 'Examination Type is required!',
    DOCTOR_REQUIRED = 'Doctor is required!',
    MEDICINE_TYPE_REQUIRED = 'Medicine Type is required!',
    SIGN_RESULT = 'Sign result successfully!',
    SIGN_RESULT_FAILED = 'Signed result failed!',
    FEEDBACK_UPDATE = 'Update feedback successfully!', 
    FEEDBACK_CREATE = 'Create feedback successfully!',
    FEEDBACK_CREATE_FAILED = 'Failed to create feedbacl, please try again later!'

}
