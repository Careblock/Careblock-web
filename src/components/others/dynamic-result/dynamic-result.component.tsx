import { DynamicFieldType } from '@/types/dynamic-field.type';
import { Props } from './dynamic-result.type';
import { FormType } from '@/enums/FormType';
import { FieldType } from '@/enums/FieldType';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
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
import { AuthContextType } from '@/types/auth.type';
import { useAuth } from '@/contexts/auth.context';

function DynamicResult({ type, datasource, classes, onClickConvertToImage }: Props) {
    const { userData } = useAuth() as AuthContextType;
    const { subscribeOnce } = useObservable();
    const rowLength = datasource[datasource.length - 1].rowIndex;
    const rowArray = new Array(rowLength).fill(0);
    const [data, setData] = useState<DynamicFieldType[]>(datasource);
    const dynamicRef = useRef(null);
    const [doctorList, setDoctorList] = useState<Doctors[]>([]);

    useEffect(() => {
        subscribeOnce(AccountService.getAllDoctor(), (res: Doctors[]) => {
            setDoctorList(res);
        });
    }, []);

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
        console.log(temp);
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
            console.log(temp);
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
                const dateTime = new Date();
                const date = dateTime.getDate().toString();
                const month = (dateTime.getMonth() + 1).toString();
                const year = dateTime.getFullYear().toString();
                return <div>{`${month.padStart(2, '0')}/${date.padStart(2, '0')}/${year}`}</div>;
            case FieldType.SelectBox:
                return (
                    <Select
                        name={field.fieldName}
                        value={field.value ? field.value : field.fieldName === 'gender' ? GenderList[0] : userData!.id}
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

    return (
        <>
            <Button variant="contained" onClick={() => onClickConvertToImage(dynamicRef)}>
                Convert
            </Button>
            <div ref={dynamicRef}>
                {type === FormType.Detail ? (
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
                                                className={`px-[32px] ${Array.isArray(field.value) ? '' : 'flex items-center'} ${field.style ?? ''} ${getAlignmentStyle(field.alignment)}`}
                                            >
                                                {field.caption && <div className="mr-[8px]">{`${field.caption}:`}</div>}
                                                {Array.isArray(field.value) ? (
                                                    <ul className="list-disc ml-[50px]">
                                                        {field.value.map((item: any) => (
                                                            <li key={item}>{item}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div>
                                                        {field.type === FieldType.AutoDate
                                                            ? getDisplayDateTime(field)
                                                            : field.displayValue ?? field.value}
                                                    </div>
                                                )}
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
                                                className={`${isDynamicField(field.type) ? 'my-[6px]' : ''} px-[32px] flex items-center ${field.style ?? ''} ${getAlignmentStyle(field.alignment)}`}
                                            >
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
        </>
    );
}

export default DynamicResult;
