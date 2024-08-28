import { Button } from '@mui/material';
import { useState } from 'react';
import CreateConsultation from '../create-consultation/create-consultation.page';
import { formatStandardDate } from '@/utils/datetime.helper';
import { getFullName, getGenderName } from '@/utils/common.helpers';
import avatarDefault from '@/assets/images/auth/avatarDefault.png';
import { DetailsInfoType } from './details-info.type';
import { Images } from '@/assets/images';
import { GENDER } from '@/enums/Common';

const DetailsInfo = ({ dataSource, clickedSave }: DetailsInfoType) => {
    const [isShowCreatePopup, setIsShowCreatePopup] = useState(false);

    const handleClickPatientRecords = () => {
        console.log('Clicked patient records');
    };

    const handleClickGenerateQR = () => {
        console.log('Clicked Generate QR');
    };

    const handleClickAccoummodate = () => {
        setIsShowCreatePopup(true);
    };

    const handleSetIsShowCreatePopup = (type: boolean) => {
        setIsShowCreatePopup(type);
    };

    return (
        <>
            <div className="details__wrapper w-full overflow-hidden bg-white p-4">
                <div className="details__top flex items-center justify-between">
                    <div className="details-top__left flex items-center">
                        <div className="top-left__avatar overflow-hidden rounded-full w-[64px] h-[64px]">
                            <img
                                src={dataSource?.avatar ? dataSource?.avatar : avatarDefault}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="top-left__name ml-3 text-[18px]">{getFullName(dataSource)}</div>
                    </div>
                    <div className="details-top__right flex flex-col space-y-2">
                        <Button
                            variant="outlined"
                            startIcon={<Images.MdKeyboardArrowLeft className="text-[20px]" />}
                            onClick={handleClickPatientRecords}
                        >
                            Patient Records
                        </Button>
                        <Button
                            variant="outlined"
                            color="success"
                            startIcon={<Images.QrCode2Icon className="text-[20px]" />}
                            onClick={handleClickGenerateQR}
                        >
                            Generate QR
                        </Button>
                    </div>
                </div>
                <div className="details__center w-[400px] columns-3 space-y-2 my-2 select-none">
                    {dataSource.gender && (
                        <div className="gender flex items-center">
                            {dataSource.gender === GENDER.FEMALE ? (
                                <Images.FemaleIcon className="text-[18px] text-[#4e4e4e]" />
                            ) : (
                                <Images.MaleIcon className="text-[18px] text-[#4e4e4e]" />
                            )}
                            <div className="text text-[#4e4e4e] ml-1">{getGenderName(dataSource.gender)}</div>
                        </div>
                    )}
                    {dataSource.dateOfBirth && (
                        <div className="date-of-birth flex items-center">
                            <Images.CakeIcon className="text-[18px] text-[#4e4e4e]" />
                            <div className="text text-[#4e4e4e] ml-1">
                                {formatStandardDate(new Date(dataSource.dateOfBirth))}
                            </div>
                        </div>
                    )}
                    {dataSource.phone && (
                        <div className="phone flex items-center">
                            <Images.PhoneAndroidIcon className="text-[18px] text-[#4e4e4e]" />
                            <div className="text text-[#4e4e4e] ml-1">{dataSource.phone}</div>
                        </div>
                    )}
                    {dataSource.email && (
                        <div className="email flex items-center">
                            <Images.MailOutlineIcon className="text-[18px] text-[#4e4e4e]" />
                            <div className="text text-[#4e4e4e] ml-1">{dataSource.email}</div>
                        </div>
                    )}
                </div>
                <div className="details__content shadow-3 w-full px-4 mt-4 py-8">
                    <div className="details-content__nodata flex items-center flex-col justify-center">
                        <div className="text-[16px] mb-2">Would you like to begin serving this patient?</div>
                        <Button variant="contained" onClick={handleClickAccoummodate}>
                            Create Consultation
                        </Button>
                    </div>
                </div>
            </div>
            <CreateConsultation
                appointmentId={dataSource.appointmentId!}
                patientId={dataSource.id}
                visible={isShowCreatePopup}
                setVisible={handleSetIsShowCreatePopup}
                clickedSave={clickedSave}
            />
        </>
    );
};

export default DetailsInfo;
