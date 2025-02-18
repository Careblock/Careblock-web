import { PATHS } from '@/enums/RoutePath';

export enum SidebarItemValue {
    Organization = 1,
    Departments = 2,
    Members = 3,
    Invitation = 4,
    Specialist = 5,
    Packages = 6,
    Medicines = 7,
    Appoinments = 8,
    ExaminationType = 9,
    Options = 10,
    TimeSlot = 11,
    MedicineType = 12,
    Payment = 13,
    Permission = 14,
}

export interface SidebarItemType {
    itemValue: SidebarItemValue;
    label: string;
    path: PATHS;
    isCustom?: boolean;
}

export const sidebarItemManagers: SidebarItemType[] = [
    {
        itemValue: SidebarItemValue.Organization,
        label: 'Organization',
        path: PATHS.ORGANIZATION_INFOR,
    },
    {
        itemValue: SidebarItemValue.Departments,
        label: 'Departments',
        path: PATHS.DEPARTMENT_MANAGEMENT,
    },
    {
        itemValue: SidebarItemValue.Members,
        label: 'Members',
        path: PATHS.TEAM_MEMBERS,
    },
    {
        itemValue: SidebarItemValue.Invitation,
        label: 'Invitation',
        path: PATHS.INVITE_MEMBERS,
    },
    {
        itemValue: SidebarItemValue.Specialist,
        label: 'Specialist',
        path: PATHS.SPECIALIST,
    },
    {
        itemValue: SidebarItemValue.Packages,
        label: 'Packages',
        path: PATHS.EXAMINATION_PACKAGE,
    },
    {
        itemValue: SidebarItemValue.Medicines,
        label: 'Medicines',
        path: PATHS.MEDICINES,
    },
    {
        itemValue: SidebarItemValue.Appoinments,
        label: 'Appoinments',
        path: PATHS.APPOINTMENT_HISTORIES,
        isCustom: true,
    },
];

export const sidebarItemAdmins: SidebarItemType[] = [
    {
        itemValue: SidebarItemValue.Organization,
        label: 'Organizations',
        path: PATHS.ORGANIZATION_ADMIN,
    },
    {
        itemValue: SidebarItemValue.Departments,
        label: 'Departments',
        path: PATHS.DEPARTMENT_ADMIN,
    },
    {
        itemValue: SidebarItemValue.Specialist,
        label: 'Specialist',
        path: PATHS.SPECIALIST_ADMIN,
    },
    {
        itemValue: SidebarItemValue.ExaminationType,
        label: 'Examination Type',
        path: PATHS.EXAMINATION_TYPE,
    },
    {
        itemValue: SidebarItemValue.Packages,
        label: 'Packages',
        path: PATHS.EXAMINATION_PACKAGE_ADMIN,
    },
    {
        itemValue: SidebarItemValue.Options,
        label: 'Options',
        path: PATHS.EXAMINATION_OPTIONS_ADMIN,
    },
    {
        itemValue: SidebarItemValue.TimeSlot,
        label: 'Time slot',
        path: PATHS.TIME_SLOT_ADMIN,
    },
    {
        itemValue: SidebarItemValue.MedicineType,
        label: 'Medicine Type',
        path: PATHS.MEDICINE_TYPE_ADMIN,
    },
    {
        itemValue: SidebarItemValue.Medicines,
        label: 'Medicines',
        path: PATHS.MEDICINES_ADMIN,
    },
    {
        itemValue: SidebarItemValue.Payment,
        label: 'Payment Methods',
        path: PATHS.PAYMENT_METHOD_ADMIN,
    },
    {
        itemValue: SidebarItemValue.Permission,
        label: 'Permissions',
        path: PATHS.PERMISSION_ADMIN,
    },
];
