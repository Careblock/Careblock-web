import AppointmentHistory from '@/pages/patient/appointment-history/appointment-history.page';
import AppointmentPage from '@/pages/appointment/appointment-page/appointment-page.page';
import UserInfo from '@/pages/user-info/user-information.page';
import DoctorSchedulePage from '@/pages/doctor/schedules/doctor-schedule.page';
import Register from '@/pages/authentication/register/register.page';
import HomePage from '../pages/home/home.page';
import Logout from '@/pages/authentication/logout/log-out.page';
import { ProtectedRoute } from './auth.guard';
import { PATHS } from '../enums/RoutePath';
import { ROLE_NAMES } from '@/enums/Common';
import { Login } from '@/pages/authentication/login/login.page';
import PatientPage from '@/pages/patient/patient.page';
import TeamMembersPage from '@/pages/doctor-manager/team-members/team-members.page';
import OrganizationInfoPage from '@/pages/doctor-manager/organization-info/organization-info.page';
import DepartmentManagement from '@/pages/doctor-manager/department-management/department-management.page';
import AppointmentHistories from '@/pages/doctor-manager/appointment-histories/appointment-histories.page';
import MedicineType from '@/pages/super-admin/medicine-type/medicine-type.page';
import ExaminationPackage from '@/pages/doctor-manager/examination-package/examination-package.page';
import InviteMembersPage from '@/pages/doctor-manager/invite-members/invite-members.page';
import SpecialistPage from '@/pages/doctor-manager/specialist/specialist.page';
import ExaminationType from '@/pages/super-admin/examination-type/examination-type.page';
import Medicines from '@/pages/doctor-manager/medicines/medicines.page';
import Organizations from '@/pages/super-admin/organizations/organizations.page';
import Departments from '@/pages/super-admin/departments/departments.page';
import SpecialistPageAdmin from '@/pages/super-admin/specialist/specialist.page';
import ExaminationPackageAdmin from '@/pages/super-admin/examination-package/examination-package.page';
import MedicinesAdmin from '@/pages/super-admin/medicines/medicines.page';
import ExaminationOptions from '@/pages/super-admin/examination-options/examination-options.page';

export const routesForNotAuthenticatedOnly = [
    { path: PATHS.REGISTER, element: <Register /> },
    { path: PATHS.LOGIN, element: <Login /> },
];

export const routesForPublic = [
    { path: PATHS.DEFAULT, element: <HomePage /> },
    { path: PATHS.HOME, element: <HomePage /> },
    { path: PATHS.APPOINTMENT, element: <AppointmentPage /> },
    { path: PATHS.LOGOUT, element: <Logout /> },
    { path: PATHS.USER_INFO, element: <UserInfo /> },
];

export const routesForDoctor = [
    {
        path: PATHS.DEFAULT,
        element: <ProtectedRoute allowedRoles={[ROLE_NAMES.DOCTOR]} />,
        children: [{ path: PATHS.DOCTOR_SCHEDULE, element: <DoctorSchedulePage /> }],
    },
];

export const routesForPatient = [
    {
        path: PATHS.DEFAULT,
        element: <ProtectedRoute allowedRoles={[ROLE_NAMES.PATIENT]} />,
        children: [
            { path: PATHS.PATIENT_PAGE, element: <PatientPage /> },
            { path: PATHS.PATIENT_APPOINTMENT_HISTORY, element: <AppointmentHistory /> },
        ],
    },
];

export const routesForDoctorManager = [
    {
        path: PATHS.DEFAULT,
        element: <ProtectedRoute allowedRoles={[ROLE_NAMES.MANAGER]} />,
        children: [
            { path: PATHS.ORGANIZATION_INFOR, element: <OrganizationInfoPage /> },
            { path: PATHS.DEPARTMENT_MANAGEMENT, element: <DepartmentManagement /> },
            { path: PATHS.TEAM_MEMBERS, element: <TeamMembersPage /> },
            { path: PATHS.INVITE_MEMBERS, element: <InviteMembersPage /> },
            { path: PATHS.SPECIALIST, element: <SpecialistPage /> },
            { path: PATHS.EXAMINATION_PACKAGE, element: <ExaminationPackage /> },
            { path: PATHS.MEDICINES, element: <Medicines /> },
            { path: PATHS.APPOINTMENT_HISTORIES, element: <AppointmentHistories /> },
        ],
    },
];

export const routesForAdmin = [
    {
        path: PATHS.DEFAULT,
        element: <ProtectedRoute allowedRoles={[ROLE_NAMES.ADMIN]} />,
        children: [
            { path: PATHS.ORGANIZATION_ADMIN, element: <Organizations /> },
            { path: PATHS.DEPARTMENT_ADMIN, element: <Departments /> },
            { path: PATHS.SPECIALIST_ADMIN, element: <SpecialistPageAdmin /> },
            { path: PATHS.EXAMINATION_TYPE, element: <ExaminationType /> },
            { path: PATHS.EXAMINATION_PACKAGE_ADMIN, element: <ExaminationPackageAdmin /> },
            { path: PATHS.EXAMINATION_OPTIONS_ADMIN, element: <ExaminationOptions /> },
            { path: PATHS.MEDICINE_TYPE, element: <MedicineType /> },
            { path: PATHS.MEDICINES_ADMIN, element: <MedicinesAdmin /> },
        ],
    },
];
