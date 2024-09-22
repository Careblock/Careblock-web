import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { organizationSchema } from '@/validations/organization.validation';
import { INITIAL_ORGANIZATION_VALUES } from '@/constants/organization.const';
import { SystemMessage } from '@/constants/message.const';
import { AuthContextType } from '@/types/auth.type';
import { addToast } from '@/components/base/toast/toast.service';
import useObservable from '@/hooks/use-observable.hook';
import { useAuth } from '@/contexts/auth.context';
import { Button, TextField } from '@mui/material';
import { setTitle } from '@/utils/document';
import DefaultThumbnail from '@/assets/images/common/organization.png';
import OrganizationService from '@/services/organization.service';
import { Organizations } from '@/types/organization.type';

function DoctorManagerPage() {
    const { subscribeOnce } = useObservable();
    const { userData } = useAuth() as AuthContextType;
    const [organizationInfo, setOrganizationInfo] = useState<any>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<any>();

    useEffect(() => {
        setTitle('Organization | CareBlock');
    }, []);

    const formik = useFormik({
        initialValues: INITIAL_ORGANIZATION_VALUES.INFORMATION,
        validationSchema: organizationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        subscribeOnce(OrganizationService.getByUserId(userData?.id), (res: Organizations) => {
            if (res) {
                setOrganizationInfo({ ...res });
            }
        });
    }, []);

    useEffect(() => {
        if (organizationInfo) {
            const updatedOrganizationInfo = { ...organizationInfo };
            formik.setFieldValue('name', updatedOrganizationInfo.name);
            formik.setFieldValue('city', updatedOrganizationInfo.city);
            formik.setFieldValue('district', updatedOrganizationInfo.district);
            formik.setFieldValue('address', updatedOrganizationInfo.address);
            formik.setFieldValue('mapUrl', updatedOrganizationInfo.mapUrl);
        }
    }, [organizationInfo]);

    const handleSubmit = (values: Organizations) => {
        console.log(organizationInfo?.id);
        console.log({
            ...values,
            thumbnail: selectedFile ?? organizationInfo.thumbnail,
        });
        subscribeOnce(
            OrganizationService.update(organizationInfo?.id, {
                ...values,
                thumbnail: selectedFile ?? organizationInfo.thumbnail,
            }),
            (res: Organizations) => {
                try {
                    if (res) {
                        setOrganizationInfo(res);
                        addToast({ text: SystemMessage.EDIT_ORGANIZATION, position: 'top-right' });
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
                <h2 className="text-[20px] font-bold text-center mb-4">Organization Information</h2>
                <div>
                    <div className="flex flex-col items-center mb-2">
                        <img
                            className="p-[4px] w-[80px] h-[80px] object-cover rounded-[175px] border shadow-xl"
                            alt="thumbnail"
                            src={
                                imageSrc
                                    ? imageSrc
                                    : organizationInfo?.thumbnail
                                      ? organizationInfo.thumbnail
                                      : DefaultThumbnail
                            }
                        />
                        <div className="my-3">
                            <label
                                htmlFor="thumbnail"
                                className="py-2 px-3 rounded-md shadow-xl block font-medium text-white cursor-pointer bg-blue-gray-300"
                            >
                                Upload Thumbnail
                            </label>
                            <input
                                id="thumbnail"
                                name="thumbnail"
                                type="file"
                                accept="image/*"
                                className="sr-only mt-1 focus:ring-blue-500 focus:border-blue-500 block shadow-sm border-gray-300 rounded"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3 gap-x-3">
                        <div className="flex gap-x-3">
                            <div className="w-full">
                                <h4 className="text-left mb-2">Name</h4>
                                <TextField
                                    className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                    name="name"
                                    placeholder="Type value"
                                    type="text"
                                    size="small"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex mb-3 gap-x-3">
                        <div className="flex flex-col w-1/2">
                            <h4 className="text-left mb-2">City</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="city"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.city && Boolean(formik.errors.city)}
                                helperText={formik.touched.city && formik.errors.city}
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h4 className="text-left mb-2">District</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="district"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.district}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.district && Boolean(formik.errors.district)}
                                helperText={formik.touched.district && formik.errors.district}
                            />
                        </div>
                    </div>
                    <div className="flex mb-3 gap-x-3">
                        <div className="w-full">
                            <h4 className="text-left mb-2">Address</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="address"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </div>
                    </div>
                    <div className="flex mb-3 gap-x-3">
                        <div className="w-full">
                            <h4 className="text-left mb-2">Map URL</h4>
                            <TextField
                                className="w-full rounded-[10px] focus:outline-none focus:border-blue-500 mx-auto"
                                name="mapUrl"
                                placeholder="Type value"
                                type="text"
                                size="small"
                                value={formik.values.mapUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mapUrl && Boolean(formik.errors.mapUrl)}
                                helperText={formik.touched.mapUrl && formik.errors.mapUrl}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-end mt-6">
                    <Button type="submit" className="w-full" size="large" variant="contained">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default DoctorManagerPage;
