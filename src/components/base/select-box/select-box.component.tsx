import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { SelectBoxType } from './select-box.type';

export default function BaseSelectBox({ id, inputId, label, dataSource, modelValue, updateModelValue }: SelectBoxType) {
    const [value, setValue] = useState(modelValue ?? '');

    const handleChange = (event: SelectChangeEvent) => {
        const newValue = event?.target?.value;
        setValue(newValue);
        updateModelValue(newValue);
    };

    useEffect(() => {
        setValue(modelValue);
    }, [modelValue]);

    return (
        <FormControl className="w-full">
            <InputLabel id={inputId}>{label}</InputLabel>
            <Select className="w-full" labelId={inputId} id={id} value={value} label={label} onChange={handleChange}>
                {dataSource.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                        {data.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
