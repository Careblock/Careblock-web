import DefaultAvatar from '@/assets/images/auth/avatarDefault.png';
import { getFullName } from '@/utils/common.helpers';
import { BaseCardProps } from './team-card.type';
import { Images } from '@/assets/images';

const BaseTeamCard = ({ dataSource, onClickRemove }: BaseCardProps) => {
    return (
        <div className="shadow-md rounded-lg w-[300px] h-[224px] overflow-hidden flex flex-col items-center justify-between py-[16px] pt-[20px] relative">
            <Images.MdDelete
                className="absolute top-[10px] right-[10px] text-[28px] cursor-pointer hover:text-[red]"
                onClick={() => onClickRemove()}
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
            <div className="text-white bg-[#1976d2] py-[2px] px-[10px] rounded-full select-none">Doctor</div>
        </div>
    );
};

export default BaseTeamCard;
