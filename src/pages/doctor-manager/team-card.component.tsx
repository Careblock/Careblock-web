import DefaultAvatar from '@/assets/images/auth/avatarDefault.png';
import { getFullName } from '@/utils/common.helpers';
import { BaseCardProps } from './team-card.type';
import { Images } from '@/assets/images';
import { useEffect } from 'react';
import { ROLE_NAMES } from '@/enums/Common';

const BaseTeamCard = ({ dataSource, onClickRemove, onClickItem }: BaseCardProps) => {
    return (
        <div
            className="shadow-md rounded-lg w-[300px] h-[224px] overflow-hidden flex flex-col items-center justify-between py-[16px] pt-[20px] relative cursor-pointer hover:bg-[#f2f2f2]"
            onClick={() => onClickItem()}
        >
            <Images.MdDelete
                className="absolute top-[10px] right-[10px] text-[28px] cursor-pointer hover:text-[red]"
                onClick={($event) => onClickRemove($event)}
            />
            <div className="rounded-full size-[80px] overflow-hidden select-none">
                <img
                    src={dataSource.avatar ? dataSource.avatar : DefaultAvatar}
                    alt="Avatar default"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="text-center">
                <p className="font-bold text-[16px]">{getFullName(dataSource)}</p>
                <p className="text-[12px]">{dataSource.email}</p>
            </div>
            <div className="flex flex-col gap-y-[4px]">
                {dataSource.roles!.includes(ROLE_NAMES.MANAGER) && (
                    <div className="text-center text-white bg-[#672bff] py-[2px] px-[10px] rounded-full select-none">
                        Manager
                    </div>
                )}
                {dataSource.roles!.includes(ROLE_NAMES.DOCTOR) && (
                    <div className="text-center text-white bg-[#1976d2] py-[2px] px-[10px] rounded-full select-none">
                        Doctor
                    </div>
                )}
            </div>
        </div>
    );
};

export default BaseTeamCard;
