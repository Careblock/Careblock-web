import DefaultAvatar from '@/assets/images/auth/avatarDefault.png';
import { getFullName } from '@/utils/common.helpers';
import { BaseCardProps } from './team-card.type';
import { Images } from '@/assets/images';
import { ROLE_NAMES } from '@/enums/Common';

const BaseTeamCard = ({
    dataSource,
    isInOrganization,
    onClickRemove,
    onClickGrant,
    onClickEdit,
    onClickInvite,
}: BaseCardProps) => {
    return (
        <div
            className={`shadow-md rounded-lg w-[280px] ${isInOrganization ? 'h-[284px]' : 'h-[224px] relative'} overflow-hidden flex flex-col items-center justify-between py-[16px] pt-[20px] cursor-pointer hover:bg-[#f2f2f2] select-none`}
        >
            {!isInOrganization && (
                <Images.FcInvite
                    className="absolute top-[10px] right-[10px] text-[28px] cursor-pointer"
                    title="Invite to join the organization"
                    onClick={() => {
                        onClickInvite ? onClickInvite() : () => {};
                    }}
                />
            )}
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
            <div className="flex flex-col gap-y-[4px] pb-[10px]">
                {dataSource.roles!.includes(ROLE_NAMES.MANAGER) && isInOrganization && (
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
            {isInOrganization && (
                <div className="flex items-center justify-center gap-x-[16px] pt-[10px] border-t border-[#d6d6d6] w-full">
                    <Images.FaClipboardUser
                        title="Edit information"
                        className="text-[26px] cursor-pointer hover:text-[#bc8c39]"
                        onClick={() => onClickEdit()}
                    />
                    <Images.RiAdminFill
                        title="Grant permissions"
                        className="text-[26px] cursor-pointer hover:text-[#3986bc]"
                        onClick={() => onClickGrant()}
                    />
                    <Images.MdDelete
                        title="Remove from team"
                        className="text-[26px] cursor-pointer hover:text-[red]"
                        onClick={($event) => onClickRemove($event)}
                    />
                </div>
            )}
        </div>
    );
};

export default BaseTeamCard;
