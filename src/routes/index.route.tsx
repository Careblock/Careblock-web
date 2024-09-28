import AppointmentHistory from '@/pages/patient/appointment-history/appointment-history.page';
import AppointmentPage from '@/pages/appointment/appointment-page/appointment-page.page';
import PatientInfo from '@/pages/patient/patient-info/patient-information.page';
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

export const routesForNotAuthenticatedOnly = [
    { path: PATHS.REGISTER, element: <Register /> },
    { path: PATHS.LOGIN, element: <Login /> },
];

export const routesForPublic = [
    { path: PATHS.DEFAULT, element: <HomePage /> },
    { path: PATHS.HOME, element: <HomePage /> },
    { path: PATHS.APPOINTMENT, element: <AppointmentPage /> },
    { path: PATHS.LOGOUT, element: <Logout /> },
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
            { path: PATHS.PATIENT_INFO, element: <PatientInfo /> },
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
            { path: PATHS.APPOINTMENT_HISTORIES, element: <AppointmentHistories /> },
        ],
    },
];
