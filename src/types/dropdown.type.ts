export interface DropDownRole {
    name: string;
    role: number;
    [key: string]: any;
}

export interface DropDownGender {
    name: string;
    gender: number;
    [key: string]: any;
}

export interface DropDownBloodType {
    name: string;
    bloodType: number;
    [key: string]: any;
}

export interface DropDownProps {
    items: DropDownRole[] | DropDownGender[] | DropDownBloodType[];
    defaultValue: number | string;
    fieldName: string;
    displayProp: string;
    [key: string]: any;
}

export interface DropDownGenders {
    items: DropDownGender[];
    defaultValue: number | string;
    fieldName: string;
    displayProp: string;
    [key: string]: any;
}
