import { BLOODTYPE, GENDER, ROLES } from '../enums/Common';
import { DropDownBloodType, DropDownGender, DropDownRole } from '../types/dropdown.type';

export const dropDownGenders: DropDownGender[] = [
    {
        name: 'Male',
        gender: GENDER.MALE,
    },
    {
        name: 'Female',
        gender: GENDER.FEMALE,
    },
    {
        name: 'Others',
        gender: GENDER.OTHER,
    },
];

export const dropDownRoles: DropDownRole[] = [
    {
        name: 'Patient',
        role: ROLES.PATIENT,
    },
    {
        name: 'Doctor',
        role: ROLES.DOCTOR,
    },
    {
        name: 'Doctor Manager',
        role: ROLES.DOCTOR_MANAGER,
    },
];

export const dropDownBloodTypes: DropDownBloodType[] = [
    {
        name: 'A',
        bloodType: BLOODTYPE.A,
    },
    {
        name: 'B',
        bloodType: BLOODTYPE.B,
    },
    {
        name: 'AB',
        bloodType: BLOODTYPE.AB,
    },
    {
        name: 'O',
        bloodType: BLOODTYPE.O,
    },
];
