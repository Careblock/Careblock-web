import { DynamicFieldType } from '@/types/dynamic-field.type';
import { Props } from './dynamic-result.type';
import { FormType } from '@/enums/FormType';
import { FieldType } from '@/enums/FieldType';
import { ChangeEvent, ReactNode, useEffect, useState, forwardRef } from 'react';
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import { DateTimeValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers';
import { GenderList } from '@/constants/common.const';
import { Images } from '@/assets/images';
import { getAlignmentStyle, isDynamicField } from './dynamic-result.util';
import { uuidv4 } from '@/utils/common.helpers';
import useObservable from '@/hooks/use-observable.hook';
import AccountService from '@/services/account.service';
import { Doctors } from '@/types/doctor.type';

const DynamicResult = forwardRef(({ type, datasource, classes, setDataSubmit }: Props, ref: any) => {
    const { subscribeOnce } = useObservable();
    const [rowArray, setRowArray] = useState<any[]>(new Array(datasource[datasource.length - 1].rowIndex).fill(0));
    const [data, setData] = useState<DynamicFieldType[]>(datasource);
    const [doctorList, setDoctorList] = useState<Doctors[]>([]);

    useEffect(() => {
        subscribeOnce(AccountService.getAllDoctor(), (res: Doctors[]) => {
            setDoctorList(res);
        });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setData(datasource);
        }, 300);
    }, [datasource]);

    useEffect(() => {
        setDataSubmit(data);
    }, [data]);

    const getRowData = (rowIndex: number): DynamicFieldType[] => {
        return data.filter((field) => field.rowIndex === rowIndex);
    };

    const handleSetFieldValue = (field: DynamicFieldType, newValue: any) => {
        let theField = data.find((item) => item.fieldName === field.fieldName);
        let theIndex = data.findIndex((item) => item.fieldName === field.fieldName);
        if (theField != undefined) {
            theField.value = newValue;
            let tempData = data.filter((item) => item.fieldName !== field.fieldName);

            tempData.splice(theIndex, 0, theField);
            setData([...tempData]);
        }
    };

    const handleSetCaptionValue = (field: DynamicFieldType, newValue: any) => {
        let theField = data.find((item) => item.fieldName === field.fieldName);
        let theIndex = data.findIndex((item) => item.fieldName === field.fieldName);
        if (theField != undefined) {
            theField.caption = newValue;
            let tempData = data.filter((item) => item.fieldName !== field.fieldName);

            tempData.splice(theIndex, 0, theField);
            setData([...tempData]);
        }
    };

    const handleClickAddField = (field: DynamicFieldType) => {
        let theData;
        let theIndex;
        if (field.fieldName === 'info-patient') {
            theData = data.find((item) => item.fieldName === 'result');
            theIndex = data.findIndex((item) => item.fieldName === 'result');
        } else {
            theData = data.find((item) => item.fieldName === 'summary');
            theIndex = data.findIndex((item) => item.fieldName === 'summary');
        }
        if (theData === undefined) return;
        const temp = [...data];
        temp.splice(theIndex, 0, {
            type: FieldType.TextArea,
            fieldName: uuidv4(),
            value: '',
            alignment: 'left',
            caption: '',
            isDefault: false,
            isCustomField: true,
            rowIndex: theData.rowIndex,
        });
        for (let i = theIndex + 1; i < temp.length; i++) temp[i].rowIndex += 1;
        setData([...temp]);
        setRowArray(new Array(temp[temp.length - 1].rowIndex).fill(0));
    };

    const getDisplayDateTime = (_: DynamicFieldType) => {
        const dateTime = new Date();
        const date = dateTime.getDate().toString();
        const month = (dateTime.getMonth() + 1).toString();
        const year = dateTime.getFullYear().toString();
        return <div>{`${month.padStart(2, '0')}/${date.padStart(2, '0')}/${year}`}</div>;
    };

    const handleClickRemoveField = (field: DynamicFieldType) => {
        let theIndex = data.findIndex((item) => item.fieldName === field.fieldName);
        if (theIndex !== -1) {
            const temp = [...data];
            temp.splice(theIndex, 1);
            setData([...temp]);
            for (let i = theIndex; i < temp.length; i++) temp[i].rowIndex -= 1;
            setRowArray(new Array(temp[temp.length - 1].rowIndex).fill(0));
        }
    };

    const getField = (field: DynamicFieldType): ReactNode => {
        switch (field.type) {
            case FieldType.Text:
                return Array.isArray(field.value) ? (
                    <ul className="list-disc ml-[50px]">
                        {field.value.map((item: any) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <div>{field.displayValue ?? field.value}</div>
                );
            case FieldType.Href:
                return Array.isArray(field.value) ? (
                    <ul className="list-disc ml-[50px]">
                        {field.value.map((item: any) => (
                            <li key={item}>
                                <a
                                    className="text-[#0000EE] hover:underline"
                                    rel="noreferrer"
                                    target="_blank"
                                    href={field.value}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <a
                        className="text-[#0000EE] hover:underline"
                        rel="noreferrer"
                        target="_blank"
                        href={field.displayValue ?? field.value}
                    >
                        {field.displayValue ?? field.value}
                    </a>
                );
            case FieldType.Input:
                return (
                    <TextField
                        name={field.fieldName}
                        placeholder={field.placeholder ?? ''}
                        value={field.value}
                        variant="outlined"
                        size="small"
                        className="flex-1 my-[10px]"
                        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            handleSetFieldValue(field, event.target.value)
                        }
                    />
                );
            case FieldType.DateBox:
                return (
                    <DateTimePicker
                        name={field.fieldName}
                        onChange={(value: Dayjs | null, _: PickerChangeHandlerContext<DateTimeValidationError>) =>
                            handleSetFieldValue(field, value)
                        }
                    />
                );
            case FieldType.AutoDate:
                return (
                    <div>{`${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${new Date().getFullYear().toString()}`}</div>
                );
            case FieldType.SelectBox:
                return (
                    <Select
                        name={field.fieldName}
                        value={field.value}
                        size="small"
                        onChange={(event: SelectChangeEvent<any>) => handleSetFieldValue(field, event.target.value)}
                    >
                        {field.fieldName === 'gender'
                            ? GenderList.map((item) => (
                                  <MenuItem key={item} value={item}>
                                      {item}
                                  </MenuItem>
                              ))
                            : doctorList.map((item) => (
                                  <MenuItem key={item.id} value={item.id}>
                                      {`${item.firstname} ${item.lastname}`}
                                  </MenuItem>
                              ))}
                    </Select>
                );
            case FieldType.TextArea:
                return (
                    <TextField
                        name={field.fieldName}
                        placeholder={field.placeholder ?? ''}
                        multiline
                        maxRows={4}
                        value={field.value}
                        variant="outlined"
                        size="small"
                        className="w-full my-[10px]"
                        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            handleSetFieldValue(field, event.target.value)
                        }
                    />
                );
        }
    };

    const getFieldDetails = (field: DynamicFieldType) => {
        if (field.type === FieldType.Href) {
            return (
                <a
                    className="text-[#0000EE] hover:underline"
                    rel="noreferrer"
                    target="_blank"
                    href={field.displayValue ?? field.value}
                >
                    {field.displayValue ?? field.value}
                </a>
            );
        }
        return (
            <div>
                {field.type === FieldType.AutoDate ? getDisplayDateTime(field) : field.displayValue ?? field.value}
            </div>
        );
    };

    const getListItemDetails = (field: DynamicFieldType) => {
        if ((field.value as string).includes('.')) {
            return (
                <ul className="list-disc ml-[20px] capitalize">
                    {field.value.split('.').map((item: any) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            );
        } else {
            return <div className="capitalize">{field.displayValue ?? field.value}</div>;
        }
    };

    return (
        <div ref={ref}>
            {type === FormType.Detail ? (
                <div className={`${classes ?? ''} border border-solid border-[#ddd] rounded-lg py-[16px] mx-auto`}>
                    <table className="w-full">
                        <tbody>
                            {rowArray.map((_, index) => (
                                <tr
                                    key={`${_}${index}`}
                                    className={`${getRowData(index + 1).length > 1 ? 'flex' : ''} ${getAlignmentStyle(getRowData(index + 1)[0]?.alignment)}`}
                                >
                                    {getRowData(index + 1).map((field) => (
                                        <td
                                            key={field.fieldName}
                                            className={`px-[32px] relative ${index === 0 && 'pt-[30px]'} ${Array.isArray(field.value) ? '' : 'flex items-center'} ${field.style ?? ''} ${getAlignmentStyle(field.alignment)}`}
                                        >
                                            {field.type === FieldType.Image && (
                                                <div
                                                    className={`size-[60px] overflow-hidden ${index === 0 && 'absolute top-[0px] left-[20px]'}`}
                                                >
                                                    {field.images && field.images[0] && (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={field.images[0]}
                                                            alt="Brand"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            {field.caption && <div className="mr-[8px]">{`${field.caption}:`}</div>}
                                            {field.type === FieldType.TextArea
                                                ? getListItemDetails(field)
                                                : getFieldDetails(field)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={`${classes} border border-solid border-[#ddd] rounded-lg py-[16px] mx-auto`}>
                    <table className="w-full">
                        <tbody>
                            {rowArray.map((_, index) => (
                                <tr
                                    key={`${_}${index}`}
                                    className={`${getRowData(index + 1).length > 1 ? 'flex' : ''} ${getAlignmentStyle(getRowData(index + 1)[0]?.alignment)}`}
                                >
                                    {getRowData(index + 1).map((field) => (
                                        <td
                                            key={field.fieldName}
                                            className={`${isDynamicField(field.type) ? 'my-[6px]' : ''} ${index === 0 && 'pt-[20px]'} px-[32px] flex items-center relative ${field.style ?? ''} ${getAlignmentStyle(field.alignment)}`}
                                        >
                                            {field.type === FieldType.Image && (
                                                <div
                                                    className={`size-[100px] overflow-hidden ${index === 0 && 'absolute top-[0px] left-[20px]'}`}
                                                >
                                                    {field.images && field.images[0] && (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={field.images[0]}
                                                            alt="Brand"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            {field.caption && !field.isCustomField && (
                                                <div
                                                    className={`mr-[8px] ${isDynamicField(field.type) ? 'min-w-[134px]' : ''}`}
                                                >{`${field.caption}:`}</div>
                                            )}
                                            {field.isCustomField && (
                                                <TextField
                                                    name={field.fieldName}
                                                    placeholder={field.placeholder ?? ''}
                                                    value={field.caption}
                                                    variant="outlined"
                                                    size="small"
                                                    className="w-[160px] !mr-[10px]"
                                                    onChange={(
                                                        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                                                    ) => handleSetCaptionValue(field, event.target.value)}
                                                />
                                            )}
                                            {getField(field)}
                                            {!field.isDefault && (
                                                <Images.RiDeleteBin6Line
                                                    size={20}
                                                    className="ml-5 cursor-pointer"
                                                    title="Click to remove field"
                                                    onClick={() => handleClickRemoveField(field)}
                                                />
                                            )}
                                            {field.isGroup && (
                                                <Images.MdAddCircleOutline
                                                    size={20}
                                                    className="ml-5 cursor-pointer"
                                                    title="Click to add new field"
                                                    onClick={() => handleClickAddField(field)}
                                                />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
});

export default DynamicResult;
