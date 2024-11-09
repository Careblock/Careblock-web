import { UnitPrice, UnitPriceName } from '@/enums/UnitPrice';
import { Medicines } from '@/types/medicine.type';
import { MedicineTypes } from '@/types/medicineType.type';

export const INITIAL_MEDICINES_VALUES = {
    INFORMATION: {
        medicineTypeId: '',
        name: '',
        price: 0,
        unitPrice: UnitPrice.USD,
        description: '',
        thumbnail: '',
    } as Medicines,
};

export const INITIAL_MEDICINE_TYPES_VALUES = {
    INFORMATION: {
        name: '',
    } as MedicineTypes,
};

export const UnitPriceOptions = [
    {
        name: UnitPriceName.USD,
        id: UnitPrice.USD,
    },
    {
        name: UnitPriceName.VND,
        id: UnitPrice.VND,
    },
];
