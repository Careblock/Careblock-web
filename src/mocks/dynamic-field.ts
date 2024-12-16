import { FieldType } from '@/enums/FieldType';
import { DynamicFieldType } from '@/types/dynamic-field.type';

export const dynamicFieldData: DynamicFieldType[] = [
    {
        type: FieldType.Image,
        fieldName: 'brand',
        value: '',
        images: [],
        alignment: 'between',
        isDefault: true,
        rowIndex: 1,
    },
    {
        type: FieldType.Text,
        fieldName: 'hospital',
        value: '',
        alignment: 'between',
        style: 'uppercase',
        isDefault: true,
        rowIndex: 1,
    },
    {
        type: FieldType.Text,
        fieldName: 'location',
        value: '',
        alignment: 'right',
        caption: 'Add',
        isDefault: true,
        rowIndex: 2,
    },
    {
        type: FieldType.Text,
        fieldName: 'tel',
        value: '',
        alignment: 'right',
        caption: 'Tel',
        isDefault: true,
        rowIndex: 3,
    },
    {
        type: FieldType.Text,
        fieldName: 'fax',
        value: '',
        alignment: 'right',
        caption: 'Fax',
        isDefault: true,
        rowIndex: 3,
    },
    {
        type: FieldType.Href,
        fieldName: 'website',
        value: '',
        alignment: 'right',
        caption: 'Website',
        isDefault: true,
        rowIndex: 3,
    },
    {
        type: FieldType.Input,
        fieldName: 'title',
        value: 'Phiếu siêu âm tuyến giáp',
        alignment: 'center',
        style: 'font-bold uppercase mt-[20px] text-[20px] w-[400px] mx-auto',
        isDefault: true,
        rowIndex: 4,
        placeholder: 'Nhập tiêu đề phiếu',
    },
    {
        type: FieldType.Text,
        fieldName: 'info-patient',
        value: 'Thông tin bệnh nhân',
        alignment: 'center',
        style: 'font-bold uppercase bg-[#eee] py-[4px] my-[4px]',
        isDefault: true,
        isGroup: true,
        rowIndex: 5,
    },
    {
        type: FieldType.Input,
        fieldName: 'fullname',
        value: '',
        placeholder: '',
        caption: 'Họ và tên',
        style: 'font-bold',
        alignment: 'between',
        isDefault: true,
        rowIndex: 6,
    },
    {
        type: FieldType.Input,
        fieldName: 'year-of-birth',
        value: '',
        placeholder: '',
        caption: 'Năm sinh',
        alignment: 'between',
        style: 'font-bold',
        isDefault: true,
        rowIndex: 6,
    },
    {
        type: FieldType.SelectBox,
        fieldName: 'gender',
        value: '',
        placeholder: '',
        caption: 'Giới tính',
        alignment: 'between',
        style: 'font-bold',
        isDefault: true,
        rowIndex: 6,
    },
    {
        type: FieldType.Input,
        fieldName: 'address',
        value: '',
        placeholder: '',
        caption: 'Địa chỉ',
        style: 'font-bold',
        alignment: 'left',
        isDefault: true,
        rowIndex: 7,
    },
    {
        type: FieldType.Input,
        fieldName: 'diagnostic',
        value: 'Khám sức khỏe',
        placeholder: '',
        caption: 'Chuẩn đoán',
        alignment: 'left',
        style: 'font-bold',
        isDefault: true,
        rowIndex: 8,
    },
    {
        type: FieldType.Input,
        fieldName: 'sa',
        value: 'Tuyến giáp',
        placeholder: '',
        caption: 'Chỉ định SA',
        alignment: 'left',
        style: 'font-bold',
        isDefault: false,
        rowIndex: 9,
    },
    {
        type: FieldType.Text,
        fieldName: 'result',
        value: 'Kết quả',
        alignment: 'center',
        style: 'font-bold uppercase bg-[#eee] py-[4px] my-[4px]',
        isDefault: true,
        isGroup: true,
        rowIndex: 10,
    },
    {
        type: FieldType.TextArea,
        fieldName: 'right',
        value: 'Kích thước bình thường. Nhu mô đồng nhất, bờ tuyến đều, không có khối khu trú',
        alignment: 'left',
        caption: 'Thùy phải',
        style: 'uppercase pb-[10px]',
        isDefault: false,
        rowIndex: 11,
    },
    {
        type: FieldType.TextArea,
        fieldName: 'left',
        value: 'Kích thước bình thường. Nhu mô cục dưới có nang kích thước ~ 5.5 x 2mm, thành mỏng dịch trong',
        alignment: 'left',
        caption: 'Thùy trái',
        style: 'uppercase pb-[10px]',
        isDefault: false,
        rowIndex: 12,
    },
    {
        type: FieldType.TextArea,
        fieldName: 'center',
        value: 'Thanh mảnh, không có khối khu trú',
        alignment: 'left',
        caption: 'Eo tuyến',
        style: 'uppercase pb-[10px]',
        isDefault: false,
        rowIndex: 13,
    },
    {
        type: FieldType.TextArea,
        fieldName: 'relation',
        value: 'Không thấy hình ảnh hạch to, khối bất thường vùng cổ hai bên',
        alignment: 'left',
        caption: 'Liên quan',
        style: 'uppercase pb-[10px]',
        isDefault: false,
        rowIndex: 14,
    },
    {
        type: FieldType.TextArea,
        fieldName: 'summary',
        value: 'Hình ảnh nang thùy trái tuyến giáp (TIRADS 2)',
        alignment: 'left',
        caption: 'Kết luận',
        style: 'font-bold uppercase bg-[#eee] py-[4px]',
        isDefault: true,
        rowIndex: 15,
    },
    {
        type: FieldType.TextArea,
        fieldName: 'recommend',
        value: '',
        alignment: 'left',
        caption: 'Đề nghị',
        style: 'font-bold uppercase bg-[#eee] py-[4px] mt-[4px]',
        isDefault: true,
        rowIndex: 16,
    },
    {
        type: FieldType.AutoDate,
        fieldName: 'datetime',
        value: '',
        alignment: 'right',
        style: 'mt-[20px]',
        isDefault: true,
        rowIndex: 17,
    },
    {
        type: FieldType.Text,
        fieldName: 'doctor',
        value: 'Bác sĩ chuyên khoa',
        alignment: 'right',
        style: 'font-bold',
        isDefault: true,
        rowIndex: 18,
    },
    {
        type: FieldType.SelectBox,
        fieldName: 'doctor-name',
        value: '',
        alignment: 'right',
        style: 'font-bold',
        isDefault: true,
        rowIndex: 19,
    },
    {
        type: FieldType.SelectBox,
        fieldName: 'doctor-dd',
        value: '',
        alignment: 'right',
        style: 'font-bold',
        isDefault: false,
        rowIndex: 20,
    },
];