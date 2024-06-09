import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import avatarDefault from 'src/assets/images/auth/avatarDefault.png';
import { PeopleSelectType } from './people-select.type';
import { dataSource } from './people-select.constant';

export default function PeopleSelect({
    label,
    id,
    placeholder,
    width,
    limitTags,
    isMultiple,
    className,
}: PeopleSelectType) {
    return (
        <Autocomplete
            id={id}
            className={`base-people-select ${className}`}
            multiple={isMultiple}
            limitTags={limitTags ?? 5}
            options={dataSource}
            sx={{ width: width ?? '500px' }}
            getOptionLabel={(option) => option.fullName}
            renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                        loading="lazy"
                        width="28"
                        alt="avatar"
                        srcSet={option.avatar ? option.avatar : avatarDefault}
                        src={option.avatar ? option.avatar : avatarDefault}
                    />
                    {option.fullName}
                </Box>
            )}
        />
    );
}
