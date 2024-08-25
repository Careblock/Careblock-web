import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { updatePatientSchema } from '@/validations/user.validation';
import { dropDownGenders } from '@/constants/dropdown.const';
import { INITIAL_VALUES, localStorageKeys } from '@/constants/common.const';
import { SystemMessage } from '@/constants/message.const';
import { AuthContextType, User } from '@/types/auth.type';
import { addToast } from '@/components/base/toast/toast.service';
import AccountService from '@/services/account.service';
import StorageService from '@/services/storage.service';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { setTitle } from '@/utils/document';
import { AccountRequest } from '@/types/accountRequest.type';
import DefaultAvatar from '@/assets/images/auth/avatarDefault.png';

function PatientInfo() {
    const { subscribeOnce } = useObservable();
    const { userData, setUser } = useAuth() as AuthContextType;
    const [userInfo, setUserInfo] = useState<any>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();

    useEffect(() => {
        setTitle('Information | CareBlock');
    }, []);

    const formik = useFormik({
        initialValues: INITIAL_VALUES.EDIT_PROFILE_PATIENT,
        validationSchema: updatePatientSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        subscribeOnce(AccountService.getById(userData?.id), (res: User) => {
            if (res) {
                setUserInfo({ ...res, dateOfBirth: format(new Date(res?.dateOfBirth), 'yyyy-MM-dd') });
            }
        });
    }, []);

    useEffect(() => {
        if (userInfo) {
            const updatedUserInfo = { ...userInfo };
            formik.setFieldValue('firstname', updatedUserInfo.firstname);
            formik.setFieldValue('lastname', updatedUserInfo.lastname);
            formik.setFieldValue('dateOfBirth', updatedUserInfo.dateOfBirth);
            formik.setFieldValue('gender', updatedUserInfo.gender);
            formik.setFieldValue('identityId', updatedUserInfo.identityId);
            formik.setFieldValue('email', updatedUserInfo.email);
            formik.setFieldValue('phone', updatedUserInfo.phone);
            formik.setFieldValue('avatar', updatedUserInfo.avatar);
        }
    }, [userInfo]);

    const handleSubmit = (values: AccountRequest) => {
        subscribeOnce(
            AccountService.update(userData?.id, {
                ...values,
                avatar: selectedFile ?? userInfo.avatar,
            }),
            (res: User) => {
                try {
                    if (res) {
                        setUser(res);
                        StorageService.setObject(localStorageKeys.USER_INFO, res);
                        addToast({ text: SystemMessage.EDIT_PROFILE, position: 'top-right' });
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        );
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const t = URL.createObjectURL(file);
            setImageSrc(t);
        }
    };

    return (
        <div className="w-[740px] mx-auto text-center rounded-gray-300">
            <form onSubmit={formik.handleSubmit} className="w-full py-[12px] px-[20px] bg-white">
                <h2 className="text-[20px] font-bold text-center mb-4">PERSONAL PROFILE</h2>
                <div>
                    <div className="flex flex-col items-center mb-2">
                        <img
                            className="w-[80px] h-[80px] object-cover rounded-[175px] border shadow-xl"
                            aria-hidden="true"
                            alt="avatar"
                            src={imageSrc ? imageSrc : userInfo?.avatar ? userInfo.avatar : DefaultAvatar}
                        />
                        <div className="my-3">
                            <label
                                htmlFor="avatar"
                                className="py-2 px-3 rounded-md shadow-xl block font-medium text-white cursor-pointer bg-blue-gray-300"
                            >
                                Upload Avatar
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                className="sr-only mt-1 focus:ring-blue-500 focus:border-blue-500 block shadow-sm border-gray-300 rounded"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3 gap-x-3">
                        <div className="flex gap-x-3">
                            <div className="flex flex-col w-1/2">
                                <h4 className="text-left mb-2">First name</h4>
                                <TextField
                                    className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                    name="firstname"
                                    placeholder="Type value"
                                    type="text"
                                    size="small"
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                    helperText={formik.touched.firstname && formik.errors.firstname}
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <h4 className="text-left mb-2">Last name</h4>
                                <TextField
                                    className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                    name="lastname"
                                    placeholder="Type value"
                                    type="text"
                                    size="small"
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                    helperText={formik.touched.lastname && formik.errors.lastname}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex mb-3 gap-x-3">
                        <div className="flex flex-col w-1/2">
                            <h4 className="text-left mb-2">Gender</h4>
                            <Select
                                name="gender"
                                className="w-full"
                                size="small"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                            >
                                {dropDownGenders.map((item) => (
                                    <MenuItem key={item.gender} value={item.gender}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h4 className="text-left mb-2">Date of birth</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="dateOfBirth"
                                placeholder="Type value"
                                type="date"
                                size="small"
                                value={formik.values.dateOfBirth}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                            />
                        </div>
                    </div>
                    <div className="flex mb-3 gap-x-3">
                        <div className="flex flex-col w-1/2">
                            <h4 className="text-left mb-2">Identity ID</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="identityId"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.identityId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.identityId && Boolean(formik.errors.identityId)}
                                helperText={formik.touched.identityId && formik.errors.identityId}
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h4 className="text-left mb-2">Phone number</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="phone"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </div>
                    </div>
                    <div className="flex mb-3 gap-x-3">
                        <div className="w-full">
                            <h4 className="text-left mb-2">Email</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="email"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end mt-6">
                    <Button type="submit" className="w-full" size="large" variant="contained">
                        Save Profile
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PatientInfo;
